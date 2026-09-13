"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import * as XLSX from 'xlsx';

// Fonction pour convertir la date américaine (AAAA-MM-JJ) en française (JJ/MM/AAAA)
const formatDateFr = (isoDate: string) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function ClientsListView({ clients, setView, onView, fetchClients, origins, fetchOrigins, consultationTypes, fetchConsultationTypes, onAddConsultationType, onWipeData }: any) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newClient, setNewClient] = useState({ nom_prenom: "", telephone: "", email: "", raison_consultation: "", date_rdv: "" });
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddConsultType, setShowAddConsultType] = useState(false);
  const [newConsultTypeName, setNewConsultTypeName] = useState("");
  
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    fetchOrigins();
    fetchConsultationTypes();
  }, [fetchOrigins, fetchConsultationTypes]);

  const handleSaveNewConsultType = async () => {
    if (!newConsultTypeName.trim()) return;
    const success = await onAddConsultationType(newConsultTypeName.trim());
    if (success) {
      setNewClient({ ...newClient, raison_consultation: newConsultTypeName.trim() });
      setNewConsultTypeName("");
      setShowAddConsultType(false);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const payload = {
      nom_prenom: newClient.nom_prenom || null,
      telephone: newClient.telephone || null,
      email: newClient.email || null,
      raison_consultation: newClient.raison_consultation || null,
      date_rdv: newClient.date_rdv ? newClient.date_rdv : null,
      source: 'manuel'
    };
      
    const { data, error: supaError } = await supabase.from('clients').insert(payload).select().single();
    
    if (supaError) {
      setError("Erreur Base de données: " + supaError.message);
      return;
    }
    
    if (data) {
      await fetchClients();
      onView(data);
    }
  };

  // FONCTION D'IMPORT EXCEL
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    setError("");
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array', cellDates: true });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      
      const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const startIndex = rows[0] && String(rows[0][0]).toLowerCase().includes('nom') ? 1 : 0;
      const rowsToProcess = rows.slice(startIndex).filter(r => r[0]);

      const res = await fetch('/api/import-clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: rowsToProcess, origins: origins })
      });

      const result = await res.json();

      if (result.error) {
        alert("Erreur lors de l'import: " + result.error);
      } else {
        alert(`Importation terminée par le serveur !\n${result.clientCount} client(s) créé(s).\n${result.entryCount} entrée(s) comptable(s) ajoutée(s).\n${result.errorCount} ligne(s) en erreur.`);
        fetchClients();
      }
      
    } catch (err: any) {
      alert("Erreur de lecture du fichier: " + err.message);
    } finally {
      setIsImporting(false);
      e.target.value = ""; 
    }
  };

  // NOUVELLE FONCTION : EXPORT EXCEL DES PATIENTS
  const handleExportClients = () => {
    if (!clients || clients.length === 0) {
      alert("Aucun client à exporter.");
      return;
    }

    // On prépare les données pour Excel (on prend la liste filtrée actuelle)
    const dataToExport = filteredClients.map((c: any) => ({
      "Nom & Prénom": c.nom_prenom || "",
      "Téléphone": c.telephone || "",
      "Email": c.email || "",
      "Adresse": c.adresse || "",
      "Origine": c.origins?.name || c.source || "",
      "Raison Consultation": c.raison_consultation || "",
      "Date RDV": c.date_rdv ? formatDateFr(c.date_rdv) : ""
    }));

    // On crée la feuille de calcul
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");

    // On génère le fichier et on le télécharge
    XLSX.writeFile(workbook, "Export_Patients_Espace_Dakinis.xlsx");
  };

  const filteredClients = clients.filter((client: any) => {
    const term = searchTerm.toLowerCase();
    const createdFr = formatDateFr(client.created_at);
    const rdvFr = formatDateFr(client.date_rdv);
    return (
      client.nom_prenom?.toLowerCase().includes(term) ||
      client.email?.toLowerCase().includes(term) ||
      client.telephone?.toLowerCase().includes(term) ||
      client.raison_consultation?.toLowerCase().includes(term) ||
      createdFr.includes(term) ||
      rdvFr.includes(term)
    );
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="font-cinzel text-2xl md:text-3xl text-[#D4AF37]">Clients (CRM)</h2>
        <div className="w-24 h-[2px] bg-[#8B1A1A] mx-auto mt-4" style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }}></div>
        
        <p className="mt-6 text-sm text-[#F5F0E8]/60 font-outfit uppercase tracking-widest">
          Base de données : {clients.length} patient(s) actif(s)
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)} 
          className="flex-1 bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-sm py-4 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors duration-300 font-light"
        >
          {showCreateForm ? "- Annuler" : "+ Nouveau Contact"}
        </button>
        
        <label 
          className={`flex-1 cursor-pointer border font-outfit uppercase tracking-widest text-sm py-4 transition-colors duration-300 font-light text-center flex items-center justify-center ${isImporting ? 'bg-[#2C2C2C] text-[#F5F0E8]/50 border-[#2C2C2C] cursor-wait' : 'bg-transparent border-[#F5F0E8] text-[#F5F0E8] hover:bg-[#F5F0E8] hover:text-[#191970]'}`}
        >
          {isImporting ? "Importation serveur..." : "Importer (Excel)"}
          <input type="file" accept=".xlsx, .xls, .csv" onChange={handleImportFile} className="hidden" disabled={isImporting} />
        </label>

        {/* NOUVEAU BOUTON EXPORTER */}
        <button 
          onClick={handleExportClients} 
          className="flex-1 bg-transparent border border-[#D4AF37] text-[#D4AF37] font-outfit uppercase tracking-widest text-sm py-4 hover:bg-[#D4AF37] hover:text-[#191970] transition-colors duration-300 font-light text-center flex items-center justify-center"
        >
          Exporter (Excel)
        </button>
      </div>

      {/* BOUTON DE RÉINITIALISATION */}
      <div className="mb-8 text-center">
        <button 
          onClick={onWipeData} 
          className="text-xs text-red-400/70 hover:text-red-400 underline transition-colors"
        >
          ⚠️ Réinitialiser (Vider tous les clients et la comptabilité)
        </button>
      </div>

      {showCreateForm && (
        <div className="border border-[#8B1A1A] bg-[#8B1A1A]/30 backdrop-blur-md p-6 mb-8">
          <form onSubmit={handleCreateClient} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#F5F0E8]/60 mb-1">Nom & Prénom</label>
              <input type="text" required value={newClient.nom_prenom} onChange={(e) => setNewClient({...newClient, nom_prenom: e.target.value})} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-2 px-3 text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37]" />
            </div>
            <div>
              <label className="block text-xs text-[#F5F0E8]/60 mb-1">Téléphone</label>
              <input type="tel" value={newClient.telephone} onChange={(e) => setNewClient({...newClient, telephone: e.target.value})} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-2 px-3 text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37]" />
            </div>
            <div>
              <label className="block text-xs text-[#F5F0E8]/60 mb-1">Email</label>
              <input type="email" value={newClient.email} onChange={(e) => setNewClient({...newClient, email: e.target.value})} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-2 px-3 text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37]" />
            </div>
            
            <div>
              <label className="block text-xs text-[#F5F0E8]/60 mb-1">Raison de la consultation</label>
              <div className="flex gap-2">
                <select 
                  value={newClient.raison_consultation || ''} 
                  onChange={(e) => setNewClient({...newClient, raison_consultation: e.target.value})}
                  className="w-full bg-[#0A0A0A] border border-[#F5F0E8]/30 py-2 px-3 text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="" className="bg-[#0A0A0A]">Sélectionner...</option>
                  {consultationTypes?.map((cType: any) => (
                    <option key={cType.id} value={cType.name} className="bg-[#0A0A0A]">{cType.name}</option>
                  ))}
                </select>
                <button type="button" onClick={() => setShowAddConsultType(!showAddConsultType)} className="bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] text-xs px-3 hover:bg-[#D4AF37] hover:text-[#191970] transition-colors">+</button>
              </div>
              {showAddConsultType && (
                <div className="flex gap-2 mt-2">
                  <input 
                    type="text" 
                    value={newConsultTypeName} 
                    onChange={(e) => setNewConsultTypeName(e.target.value)} 
                    placeholder="Nouveau type de consultation..." 
                    className="w-full bg-black/20 border border-[#F5F0E8]/30 py-2 px-3 text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button type="button" onClick={handleSaveNewConsultType} className="bg-[#8B1A1A] text-[#F5F0E8] text-xs px-3 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors">OK</button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs text-[#F5F0E8]/60 mb-1">Date du RDV</label>
              <input type="date" value={newClient.date_rdv} onChange={(e) => setNewClient({...newClient, date_rdv: e.target.value})} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-2 px-3 text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37]" />
            </div>
            {error && <p className="text-red-400 text-sm col-span-2">{error}</p>}
            <div className="col-span-2 text-center mt-4">
              <button type="submit" className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-xs px-8 py-3 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors">
                Créer la fiche
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BARRE DE RECHERCHE + COMPTEUR DYNAMIQUE */}
      <div className="mb-8 flex justify-between items-center gap-4">
        <input 
          type="text" 
          placeholder="Rechercher par nom, email, téléphone, raison, date (JJ/MM/AAAA)..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-black/20 border border-[#F5F0E8]/30 py-3 px-4 text-[#F5F0E8] font-outfit text-sm focus:outline-none focus:border-[#D4AF37]"
        />
        <span className="text-xs text-[#F5F0E8]/60 font-outfit whitespace-nowrap bg-black/20 border border-[#F5F0E8]/30 py-3 px-4">
          {filteredClients.length} / {clients.length}
        </span>
      </div>

      <div className="overflow-x-auto border border-[#8B1A1A] bg-[#8B1A1A]/30 backdrop-blur-md shadow-2xl mb-8 max-h-[60vh] overflow-y-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-[#8B1A1A] bg-[#2C2C2C]/80 backdrop-blur-sm">
              <th className="p-4 font-cinzel text-sm text-[#D4AF37] uppercase tracking-wider">Client</th>
              <th className="p-4 font-cinzel text-sm text-[#D4AF37] uppercase tracking-wider">Contact</th>
              <th className="p-4 font-cinzel text-sm text-[#D4AF37] uppercase tracking-wider">Raison</th>
              <th className="p-4 font-cinzel text-sm text-[#D4AF37] uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-[#F5F0E8]/40 italic">Aucun client trouvé.</td></tr>
            )}
            {filteredClients.map((client: any) => (
              <tr key={client.id} onClick={() => onView(client)} className="border-b border-[#F5F0E8]/10 hover:bg-[#8B1A1A]/50 cursor-pointer transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    {client.source === 'site' || client.source === 'import_excel' ? (
                      <span className="w-8 h-8 flex items-center justify-center bg-[#D4AF37] text-[#191970] font-bold text-xs rounded-full shrink-0">S</span>
                    ) : (
                      <span className="w-8 h-8 flex items-center justify-center border border-[#F5F0E8]/50 text-[#F5F0E8] font-bold text-xs rounded-full shrink-0">M</span>
                    )}
                    <span 
                      onClick={(e) => { e.stopPropagation(); onView(client); }} 
                      className="font-cinzel text-lg text-[#D4AF37] hover:underline cursor-pointer"
                    >
                      {client.nom_prenom || "Sans nom"}
                    </span>
                  </div>
                </td>
                <td className="p-4 font-outfit text-sm text-[#F5F0E8]/80 align-top">
                  {client.email && <div>{client.email}</div>}
                  {client.telephone && <div>{client.telephone}</div>}
                  {!client.email && !client.telephone && <span className="text-[#F5F0E8]/40">N/A</span>}
                </td>
                <td className="p-4 font-outfit text-sm text-[#F5F0E8]/80 align-top">{client.raison_consultation || "N/A"}</td>
                <td className="p-4 font-outfit text-xs text-[#F5F0E8]/40 italic align-top">{formatDateFr(client.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-10">
        <button 
          onClick={() => setView("dashboard")} 
          className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-sm px-8 py-4 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors duration-300 font-light"
        >
          Retour
        </button>
      </div>
    </div>
  );
}