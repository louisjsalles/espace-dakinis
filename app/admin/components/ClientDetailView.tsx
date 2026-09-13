"use client";
import { useState, useEffect } from "react";

export default function ClientDetailView({ client, consultations, communications, onAddConsult, onAddCommunication, onArchive, onUploadFile, clientFiles, onDeleteFile, onUpdateClient, origins, onAddOrigin, onDeleteOrigin, consultationTypes, onAddConsultationType, onViewAccounting, setView }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(client);
  
  const [showCallModal, setShowCallModal] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsText, setSmsText] = useState("");
  const [showAddOrigin, setShowAddOrigin] = useState(false);
  const [newOriginName, setNewOriginName] = useState("");
  const [showAddConsultType, setShowAddConsultType] = useState(false);
  const [newConsultTypeName, setNewConsultTypeName] = useState("");

  useEffect(() => {
    setIsEditing(false);
    setEditData(client);
  }, [client]);

  const handleSave = () => {
    onUpdateClient(editData);
    setIsEditing(false);
  };

  const getQrUrl = (text: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent("Espace Dakinis");
    const body = encodeURIComponent("Bonjour,\n\n");
    window.location.href = `mailto:${client.email}?subject=${subject}&body=${body}`;
    onAddCommunication(client.id, 'email', `Email envoyé à ${client.email}`);
  };

  const handleSaveNewOrigin = async () => {
    if (!newOriginName.trim()) return;
    const newId = await onAddOrigin(newOriginName.trim());
    if (newId) {
      setEditData({ ...editData, origin_id: newId });
      setNewOriginName("");
      setShowAddOrigin(false);
    }
  };

  const handleRemoveOrigin = () => {
    if (editData.origin_id) {
      if (window.confirm("Supprimer cette origine de la liste ?")) {
        onDeleteOrigin(editData.origin_id);
        setEditData({ ...editData, origin_id: '' });
      }
    }
  };

  const handleSaveNewConsultType = async () => {
    if (!newConsultTypeName.trim()) return;
    const success = await onAddConsultationType(newConsultTypeName.trim());
    if (success) {
      setEditData({ ...editData, raison_consultation: newConsultTypeName.trim() });
      setNewConsultTypeName("");
      setShowAddConsultType(false);
    }
  };

  // CALCUL DU TOTAL DES SÉANCES DE L'ANNÉE EN COURS
  const currentYear = new Date().getFullYear();
  const totalSessions = (client.accounting_entries || []).reduce((sum: number, entry: any) => {
    const entryYear = new Date(entry.entry_date).getFullYear();
    return entryYear === currentYear ? sum + (entry.session_count || 0) : sum;
  }, 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="font-cinzel text-2xl md:text-3xl text-[#D4AF37]">{client.nom_prenom}</h2>
        <div className="w-24 h-[2px] bg-[#8B1A1A] mx-auto mt-4" style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }}></div>
      </div>

      {/* MODALE APPEL TÉLÉPHONE */}
      {showCallModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8" onClick={() => setShowCallModal(false)}>
          <div className="bg-[#F5F0E8] border border-[#8B1A1A] p-8 max-w-sm w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-cinzel text-xl text-[#2C2C2C] mb-6 uppercase tracking-wider">Appeler</h3>
            <div className="bg-white p-2 inline-block mb-6 border border-[#2C2C2C]/20">
              <img src={getQrUrl(`tel:${client.telephone}`)} alt="QR Code Appel" className="w-40 h-40" />
            </div>
            <p className="font-outfit text-sm text-[#2C2C2C] mb-8 tracking-wider">{client.telephone}</p>
            <button 
              onClick={() => { setShowCallModal(false); onAddCommunication(client.id, 'call', `Appel effectué vers ${client.telephone}`); }} 
              className="w-full bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-xs px-6 py-3 hover:bg-[#2C2C2C] transition-colors duration-300 font-light"
            >
              Enregistrer l'appel
            </button>
            <button onClick={() => setShowCallModal(false)} className="text-xs text-[#2C2C2C]/50 hover:text-[#2C2C2C] w-full mt-4 font-outfit">Annuler</button>
          </div>
        </div>
      )}

      {/* MODALE SMS */}
      {showSmsModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8" onClick={() => setShowSmsModal(false)}>
          <div className="bg-[#F5F0E8] border border-[#8B1A1A] p-8 max-w-sm w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-cinzel text-xl text-[#2C2C2C] mb-6 uppercase tracking-wider">Envoyer un SMS</h3>
            
            <textarea 
              rows={3} 
              value={smsText} 
              onChange={(e) => setSmsText(e.target.value)} 
              placeholder="Votre message..." 
              className="w-full bg-transparent border-b-2 border-[#2C2C2C]/30 py-2 px-1 font-outfit text-sm text-[#2C2C2C] focus:outline-none focus:border-[#8B1A1A] mb-6"
            />
            
            {smsText && (
              <div className="bg-white p-2 inline-block mb-6 border border-[#2C2C2C]/20">
                <img src={getQrUrl(`sms:${client.telephone}?body=${encodeURIComponent(smsText)}`)} alt="QR Code SMS" className="w-40 h-40" />
              </div>
            )}
            
            <button 
              onClick={() => { 
                setShowSmsModal(false); 
                onAddCommunication(client.id, 'sms', `SMS préparé : "${smsText}"`); 
                setSmsText(""); 
              }} 
              className="w-full bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-xs px-6 py-3 hover:bg-[#2C2C2C] transition-colors duration-300 font-light disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!smsText}
            >
              Enregistrer le SMS
            </button>
            <button onClick={() => setShowSmsModal(false)} className="text-xs text-[#2C2C2C]/50 hover:text-[#2C2C2C] w-full mt-4 font-outfit">Annuler</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE : Infos, Communication & Historique des Comms */}
        <div className="md:col-span-1 space-y-8">
          
          <div className="border border-[#8B1A1A] bg-[#8B1A1A]/30 backdrop-blur-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-cinzel text-xl text-[#D4AF37]">Informations</h3>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="text-xs text-[#D4AF37] hover:underline">Modifier</button>
              ) : (
                <div className="flex gap-3">
                  <button onClick={() => setIsEditing(false)} className="text-xs text-red-400 hover:underline">Annuler</button>
                  <button onClick={handleSave} className="text-xs text-green-400 hover:underline">Sauvegarder</button>
                </div>
              )}
            </div>
            
            {!isEditing ? (
              <div className="space-y-2">
                <p className="font-outfit text-sm text-[#F5F0E8]/80"><strong>Nom & Prénom:</strong> {client.nom_prenom || "N/A"}</p>
                <p className="font-outfit text-sm text-[#F5F0E8]/80"><strong>Téléphone:</strong> {client.telephone || "N/A"}</p>
                <p className="font-outfit text-sm text-[#F5F0E8]/80"><strong>Email:</strong> {client.email || "N/A"}</p>
                <p className="font-outfit text-sm text-[#F5F0E8]/80"><strong>Adresse:</strong> {client.adresse || "N/A"}</p>
                <p className="font-outfit text-sm text-[#F5F0E8]/80"><strong>Origine:</strong> {client.origins?.name || client.source || "N/A"}</p>
                <p className="font-outfit text-sm text-[#F5F0E8]/80"><strong>Nb Séances ({currentYear}):</strong> {totalSessions}</p>
                <p className="font-outfit text-sm text-[#F5F0E8]/80"><strong>Consultation:</strong> {client.raison_consultation || "N/A"}</p>
                <p className="font-outfit text-sm text-[#F5F0E8]/80"><strong>Date RDV:</strong> {client.date_rdv || "N/A"}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* CHAMP UNIQUE POUR LE NOM */}
                <div>
                  <label className="block text-xs text-[#F5F0E8]/60 mb-1">Nom & Prénom</label>
                  <input type="text" value={editData.nom_prenom || ''} onChange={(e) => setEditData({...editData, nom_prenom: e.target.value})} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div>
                  <label className="block text-xs text-[#F5F0E8]/60 mb-1">Téléphone</label>
                  <input type="tel" value={editData.telephone || ''} onChange={(e) => setEditData({...editData, telephone: e.target.value})} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div>
                  <label className="block text-xs text-[#F5F0E8]/60 mb-1">Email</label>
                  <input type="email" value={editData.email || ''} onChange={(e) => setEditData({...editData, email: e.target.value})} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div>
                  <label className="block text-xs text-[#F5F0E8]/60 mb-1">Adresse</label>
                  <input type="text" value={editData.adresse || ''} onChange={(e) => setEditData({...editData, adresse: e.target.value})} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#D4AF37]" />
                </div>
                
                {/* Sélecteur d'Origine avec boutons + et - */}
                <div>
                  <label className="block text-xs text-[#F5F0E8]/60 mb-1">Origine</label>
                  <div className="flex gap-2">
                    <select 
                      value={editData.origin_id || ''} 
                      onChange={(e) => setEditData({...editData, origin_id: e.target.value})}
                      className="w-full bg-[#0A0A0A] border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="" className="bg-[#0A0A0A]">Sélectionner...</option>
                      {origins?.map((origin: any) => (
                        <option key={origin.id} value={origin.id} className="bg-[#0A0A0A]">{origin.name}</option>
                      ))}
                    </select>
                    <button type="button" onClick={() => setShowAddOrigin(!showAddOrigin)} className="bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] text-xs px-3 hover:bg-[#D4AF37] hover:text-[#191970] transition-colors">+</button>
                    {editData.origin_id && (
                      <button 
                        type="button" 
                        onClick={handleRemoveOrigin} 
                        className="bg-[#8B1A1A]/30 border border-[#8B1A1A] text-red-400 text-xs px-3 hover:bg-[#8B1A1A] hover:text-[#F5F0E8] transition-colors"
                      >
                        -
                      </button>
                    )}
                  </div>
                  {showAddOrigin && (
                    <div className="flex gap-2 mt-2">
                      <input 
                        type="text" 
                        value={newOriginName} 
                        onChange={(e) => setNewOriginName(e.target.value)} 
                        placeholder="Nouvelle origine..." 
                        className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#D4AF37]"
                      />
                      <button type="button" onClick={handleSaveNewOrigin} className="bg-[#8B1A1A] text-[#F5F0E8] text-xs px-3 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors">OK</button>
                    </div>
                  )}
                </div>

                {/* Sélecteur de Consultation avec bouton + */}
                <div>
                  <label className="block text-xs text-[#F5F0E8]/60 mb-1">Consultation</label>
                  <div className="flex gap-2">
                    <select 
                      value={editData.raison_consultation || ''} 
                      onChange={(e) => setEditData({...editData, raison_consultation: e.target.value})}
                      className="w-full bg-[#0A0A0A] border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#D4AF37]"
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
                        className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#D4AF37]"
                      />
                      <button type="button" onClick={handleSaveNewConsultType} className="bg-[#8B1A1A] text-[#F5F0E8] text-xs px-3 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors">OK</button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-[#F5F0E8]/60 mb-1">Date RDV</label>
                  <input type="date" value={editData.date_rdv || ''} onChange={(e) => setEditData({...editData, date_rdv: e.target.value})} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#D4AF37]" />
                </div>
              </div>
            )}
            
            <div className="mt-6 pt-6 border-t border-[#F5F0E8]/10">
              <button onClick={() => onArchive(client.id, !client.archived)} className={`w-full font-outfit uppercase tracking-widest text-xs px-4 py-2 transition-colors ${client.archived ? 'bg-green-500/20 border border-green-500 text-green-400 hover:bg-green-500 hover:text-white' : 'bg-transparent border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500 hover:text-[#191970]'}`}>
                {client.archived ? "Désarchiver" : "Archiver le patient"}
              </button>
            </div>
          </div>

          <div className="border border-[#D4AF37]/30 bg-[#D4AF37]/5 backdrop-blur-sm p-6">
            <h3 className="font-cinzel text-xl text-[#D4AF37] mb-4">Communiquer & Gérer</h3>
            <div className="flex flex-col gap-3">
              <button onClick={handleSendEmail} className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-xs px-4 py-2 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors">Email</button>
              <button onClick={() => setShowCallModal(true)} className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-xs px-4 py-2 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors">Téléphone (QR)</button>
              <button onClick={() => setShowSmsModal(true)} className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-xs px-4 py-2 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors">SMS (QR)</button>
              <button onClick={() => onViewAccounting(client)} className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-xs px-4 py-2 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors">Comptabilité</button>
            </div>
          </div>

          {/* HISTORIQUE DES COMMUNICATIONS */}
          <div className="border border-[#F5F0E8]/20 bg-black/30 backdrop-blur-sm p-6">
            <h3 className="font-cinzel text-lg text-[#D4AF37] mb-4">Historique Comms</h3>
            <div className="space-y-4 max-h-40 overflow-y-auto pr-2">
              {communications?.length === 0 && <p className="text-[#F5F0E8]/40 text-xs italic">Aucune communication.</p>}
              {communications?.map((comm: any) => (
                <div key={comm.id} className="border-l-2 border-[#8B1A1A] pl-3">
                  <p className="text-[10px] text-[#F5F0E8]/40 mb-1">{new Date(comm.created_at).toLocaleString()}</p>
                  <p className="text-xs text-[#F5F0E8]/90 whitespace-pre-wrap">
                    <span className="font-bold text-[#D4AF37]">[{comm.type.toUpperCase()}]</span> {comm.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : Consultations (Élément principal) & Documents */}
        <div className="md:col-span-2 space-y-8">
          
          <div className="border border-[#8B1A1A] bg-[#8B1A1A]/30 backdrop-blur-md shadow-2xl p-8">
            <h3 className="font-cinzel text-xl text-[#D4AF37] mb-4">Nouvelle Consultation</h3>
            <form onSubmit={onAddConsult} className="space-y-4">
              <textarea name="notes" rows={6} required className="w-full bg-black/20 border border-[#F5F0E8]/30 py-2 px-3 font-outfit text-sm text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37]" placeholder="Prenez vos notes ici..."></textarea>
              <div className="text-right">
                <button type="submit" className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-xs px-6 py-3 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors">Valider et Archiver</button>
              </div>
            </form>
          </div>

          <div className="border border-[#F5F0E8]/20 bg-black/30 backdrop-blur-sm p-6">
            <h3 className="font-cinzel text-xl text-[#D4AF37] mb-6">Historique des Consultations</h3>
            <div className="space-y-6">
              {consultations?.length === 0 && <p className="text-[#F5F0E8]/40 text-sm italic">Aucune consultation enregistrée.</p>}
              {consultations?.map((consult: any) => (
                <div key={consult.id} className="border-l-2 border-[#D4AF37]/50 pl-4">
                  <p className="text-xs text-[#F5F0E8]/40 mb-1">{new Date(consult.created_at).toLocaleString()}</p>
                  <p className="text-sm text-[#F5F0E8]/90 whitespace-pre-wrap">{consult.notes}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-[#F5F0E8]/20 bg-black/30 backdrop-blur-sm p-6">
            <h3 className="font-cinzel text-xl text-[#D4AF37] mb-6">Documents & Fichiers</h3>
            <div className="mb-6 border-2 border-dashed border-[#F5F0E8]/20 p-4 text-center">
              <label className="cursor-pointer text-[#D4AF37] font-outfit uppercase tracking-widest text-xs hover:underline">
                + Uploader un fichier (PDF, Photo...)
                <input type="file" onChange={(e) => onUploadFile(e, client.id)} className="hidden" />
              </label>
            </div>
            <div className="space-y-3">
              {clientFiles?.length === 0 && <p className="text-[#F5F0E8]/40 text-sm italic">Aucun fichier.</p>}
              {clientFiles?.map((file: any) => (
                <div key={file.id} className="flex justify-between items-center bg-black/40 p-3 border border-[#F5F0E8]/10">
                  <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#F5F0E8] hover:text-[#D4AF37] truncate flex-1">📄 {file.file_name}</a>
                  <button onClick={() => onDeleteFile(file)} className="text-xs text-red-400 hover:text-red-300 ml-4">X</button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <div className="text-center mt-10">
        <button onClick={() => setView("clientsList")} className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-sm px-8 py-4 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors duration-300 font-light">Retour à la liste</button>
      </div>
    </div>
  );
}