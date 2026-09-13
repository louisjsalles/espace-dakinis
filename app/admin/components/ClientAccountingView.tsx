"use client";
import { useState } from "react";
import InvoiceModal from "./InvoiceModal";

export default function ClientAccountingView({ client, accountingEntries, onAddEntry, onDeleteEntry, onBackToPatient, onGoToGeneralAccounting, consultationTypes, onAddConsultationType, onGenerateInvoice }: any) {
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState({ entry_date: "", amount: "", payment_method: "Espèces", session_count: "1", consultation_type_id: "" });
  const [error, setError] = useState("");
  const [showAddType, setShowAddType] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  
  // État pour la facture
  const [invoiceData, setInvoiceData] = useState<any>(null);

  const formatDateFr = (isoDate: string) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!newEntry.entry_date || !newEntry.amount) {
      setError("Date et montant obligatoires.");
      return;
    }
    await onAddEntry({
      client_id: client.id,
      entry_date: newEntry.entry_date,
      amount: parseFloat(newEntry.amount),
      payment_method: newEntry.payment_method,
      session_count: parseInt(newEntry.session_count) || 1,
      consultation_type_id: newEntry.consultation_type_id || null
    });
    setNewEntry({ entry_date: "", amount: "", payment_method: "Espèces", session_count: "1", consultation_type_id: "" });
    setShowForm(false);
  };

  const handleSaveNewType = async () => {
    if (!newTypeName.trim()) return;
    const newId = await onAddConsultationType(newTypeName.trim());
    if (newId) {
      setNewEntry({ ...newEntry, consultation_type_id: newId });
      setNewTypeName("");
      setShowAddType(false);
    }
  };

  const handleFacturer = async (entry: any) => {
    const data = await onGenerateInvoice(client, entry);
    if (data) {
      setInvoiceData({ entry, invoiceNumber: data.invoiceNumber });
    }
  };

  const currentYear = new Date().getFullYear();
  const yearEntries = (accountingEntries || []).filter((e: any) => new Date(e.entry_date).getFullYear() === currentYear);
  const totalAmount = yearEntries.reduce((sum: number, e: any) => sum + parseFloat(e.amount || 0), 0);
  const totalSessions = yearEntries.reduce((sum: number, e: any) => sum + (e.session_count || 0), 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="font-cinzel text-2xl md:text-3xl text-[#D4AF37]">Comptabilité — {client.prenom} {client.nom}</h2>
        <div className="w-24 h-[2px] bg-[#8B1A1A] mx-auto mt-4" style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }}></div>
      </div>

      {/* Totaux */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border border-[#8B1A1A] bg-[#8B1A1A]/30 backdrop-blur-md p-6 text-center">
          <p className="font-outfit text-xs text-[#F5F0E8]/60 uppercase tracking-wider mb-2">Année {currentYear}</p>
          <p className="font-cinzel text-3xl text-[#D4AF37]">{totalAmount.toFixed(2)} €</p>
        </div>
        <div className="border border-[#8B1A1A] bg-[#8B1A1A]/30 backdrop-blur-md p-6 text-center">
          <p className="font-outfit text-xs text-[#F5F0E8]/60 uppercase tracking-wider mb-2">Séances {currentYear}</p>
          <p className="font-cinzel text-3xl text-[#D4AF37]">{totalSessions}</p>
        </div>
        <div className="border border-[#8B1A1A] bg-[#8B1A1A]/30 backdrop-blur-md p-6 text-center">
          <p className="font-outfit text-xs text-[#F5F0E8]/60 uppercase tracking-wider mb-2">Total entrées</p>
          <p className="font-cinzel text-3xl text-[#D4AF37]">{accountingEntries?.length || 0}</p>
        </div>
      </div>

      {/* Bouton Ajouter */}
      <div className="mb-6">
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-sm px-8 py-4 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors duration-300 font-light"
        >
          {showForm ? "- Annuler" : "+ Ajouter un Paiement"}
        </button>
      </div>

      {/* Formulaire d'ajout */}
      {showForm && (
        <div className="border border-[#8B1A1A] bg-[#8B1A1A]/30 backdrop-blur-md p-6 mb-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div className="md:col-span-1">
              <label className="block text-xs text-[#F5F0E8]/60 mb-1">Date</label>
              <input type="date" required value={newEntry.entry_date} onChange={(e) => setNewEntry({...newEntry, entry_date: e.target.value})} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-2 px-3 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#D4AF37]" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs text-[#F5F0E8]/60 mb-1">Séances</label>
              <input type="number" min="1" value={newEntry.session_count} onChange={(e) => setNewEntry({...newEntry, session_count: e.target.value})} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-2 px-3 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#D4AF37]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-[#F5F0E8]/60 mb-1">Consultation</label>
              <div className="flex gap-2">
                <select 
                  value={newEntry.consultation_type_id} 
                  onChange={(e) => setNewEntry({...newEntry, consultation_type_id: e.target.value})}
                  className="w-full bg-black/60 backdrop-blur-md border border-[#F5F0E8]/30 text-[#F5F0E8] py-2 px-3 text-sm focus:outline-none focus:border-[#D4AF37] appearance-none cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="">Sélectionner...</option>
                  {consultationTypes?.map((type: any) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
                <button type="button" onClick={() => setShowAddType(!showAddType)} className="bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] text-xs px-3 hover:bg-[#D4AF37] hover:text-[#191970] transition-colors shrink-0">+</button>
              </div>
              {showAddType && (
                <div className="flex gap-2 mt-2">
                  <input 
                    type="text" 
                    value={newTypeName} 
                    onChange={(e) => setNewTypeName(e.target.value)} 
                    placeholder="Nouveau type..." 
                    className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button type="button" onClick={handleSaveNewType} className="bg-[#8B1A1A] text-[#F5F0E8] text-xs px-3 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors shrink-0">OK</button>
                </div>
              )}
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs text-[#F5F0E8]/60 mb-1">Montant (€)</label>
              <input type="number" step="0.01" required value={newEntry.amount} onChange={(e) => setNewEntry({...newEntry, amount: e.target.value})} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-2 px-3 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#D4AF37]" placeholder="0.00" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs text-[#F5F0E8]/60 mb-1">Paiement</label>
              <select value={newEntry.payment_method} onChange={(e) => setNewEntry({...newEntry, payment_method: e.target.value})} className="w-full bg-black/60 backdrop-blur-md border border-[#F5F0E8]/30 text-[#F5F0E8] py-2 px-3 text-sm focus:outline-none focus:border-[#D4AF37] appearance-none cursor-pointer" style={{ colorScheme: 'dark' }}>
                <option value="Espèces">Espèces</option>
                <option value="Chèque">Chèque</option>
                <option value="Virement">Virement</option>
                <option value="Carte">Carte</option>
              </select>
            </div>
            
            {error && <p className="text-red-400 text-sm col-span-6">{error}</p>}
            <div className="col-span-6 text-center">
              <button type="submit" className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-xs px-8 py-3 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors">Enregistrer</button>
            </div>
          </form>
        </div>
      )}

      {/* Tableau comptable */}
      <div className="overflow-x-auto border border-[#8B1A1A] bg-[#8B1A1A]/30 backdrop-blur-md shadow-2xl mb-8">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-[#8B1A1A] bg-[#2C2C2C]/80 backdrop-blur-sm">
              <th className="p-4 font-cinzel text-sm text-[#D4AF37] uppercase tracking-wider">Date</th>
              <th className="p-4 font-cinzel text-sm text-[#D4AF37] uppercase tracking-wider">Séance</th>
              <th className="p-4 font-cinzel text-sm text-[#D4AF37] uppercase tracking-wider">Consultation</th>
              <th className="p-4 font-cinzel text-sm text-[#D4AF37] uppercase tracking-wider">Montant</th>
              <th className="p-4 font-cinzel text-sm text-[#D4AF37] uppercase tracking-wider">Paiement</th>
              <th className="p-4 font-cinzel text-sm text-[#D4AF37] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(accountingEntries?.length === 0 || !accountingEntries) && (
              <tr><td colSpan={6} className="p-8 text-center text-[#F5F0E8]/40 italic">Aucune entrée comptable.</td></tr>
            )}
            {accountingEntries?.map((entry: any) => (
              <tr key={entry.id} className="border-b border-[#F5F0E8]/10 hover:bg-[#8B1A1A]/50 transition-colors">
                <td className="p-4 font-outfit text-sm text-[#F5F0E8]/80">{formatDateFr(entry.entry_date)}</td>
                <td className="p-4 font-outfit text-sm text-[#F5F0E8]/80">{entry.session_count}</td>
                <td className="p-4 font-outfit text-sm text-[#F5F0E8]/80">{entry.consultation_types?.name || "N/A"}</td>
                <td className="p-4 font-cinzel text-sm text-[#D4AF37]">{parseFloat(entry.amount).toFixed(2)} €</td>
                <td className="p-4 font-outfit text-sm text-[#F5F0E8]/80">{entry.payment_method}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleFacturer(entry)} className="text-xs text-[#D4AF37] hover:underline">Facturer</button>
                  <button onClick={() => onDeleteEntry(entry)} className="text-xs text-red-400 hover:text-red-300">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Boutons de navigation */}
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <button onClick={onBackToPatient} className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-sm px-8 py-4 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors duration-300 font-light">
          Retour Fiche Patient
        </button>
        <button onClick={onGoToGeneralAccounting} className="bg-transparent border border-[#F5F0E8] text-[#F5F0E8] font-outfit uppercase tracking-widest text-sm px-8 py-4 hover:bg-[#F5F0E8] hover:text-[#191970] transition-colors duration-300 font-light">
          Tableau Général Comptabilité
        </button>
      </div>

      {/* MODALE FACTURE */}
      {invoiceData && (
        <InvoiceModal 
          client={client} 
          entry={invoiceData.entry} 
          invoiceNumber={invoiceData.invoiceNumber} 
          onClose={() => setInvoiceData(null)} 
          onSave={() => setInvoiceData(null)} 
        />
      )}
    </div>
  );
}