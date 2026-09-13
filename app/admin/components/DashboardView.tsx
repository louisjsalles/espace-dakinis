"use client";
import { supabase } from "../../lib/supabase";

export default function DashboardView({ setView, fetchPages, fetchMedias, fetchClients, onOpenAccounting }: any) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const cardClass = "border border-[#F5F0E8]/20 p-8 bg-black/30 backdrop-blur-sm text-center flex flex-col justify-center items-center";

  return (
    <>
      {/* Rangée 1 : Blocs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className={cardClass}>
          <h3 className="font-cinzel text-xl text-[#D4AF37] mb-4">Pages du Site</h3>
          <p className="font-outfit text-sm text-[#F5F0E8]/60 font-light mb-6 flex-grow">Éditez le contenu de vos pages.</p>
          <button onClick={() => { fetchPages(); setView("pagesList"); }} className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-xs px-6 py-3 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors">Ouvrir</button>
        </div>

        <div className={cardClass}>
          <h3 className="font-cinzel text-xl text-[#D4AF37] mb-4">Bibliothèque Médias</h3>
          <p className="font-outfit text-sm text-[#F5F0E8]/60 font-light mb-6 flex-grow">Importez et gérez vos photos.</p>
          <button onClick={() => { fetchMedias(); setView("mediasList"); }} className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-xs px-6 py-3 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors">Ouvrir</button>
        </div>

        <div className={cardClass}>
          <h3 className="font-cinzel text-xl text-[#D4AF37] mb-4">Paramètres</h3>
          <p className="font-outfit text-sm text-[#F5F0E8]/60 font-light mb-6 flex-grow">Gérez vos coordonnées de contact.</p>
          <button onClick={() => setView("parametres")} className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-xs px-6 py-3 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors">Ouvrir</button>
        </div>
      </div>

      {/* Rangée 2 : CRM, Comptabilité & Outils (Centrés) */}
      <div className="flex flex-col md:flex-row justify-center gap-8 mb-16 max-w-5xl mx-auto">
        <div className={`${cardClass} md:w-1/3`}>
          <h3 className="font-cinzel text-xl text-[#D4AF37] mb-4">Patients (CRM)</h3>
          <p className="font-outfit text-sm text-[#F5F0E8]/60 font-light mb-6 flex-grow">Gérez vos patients et consultations.</p>
          <button onClick={() => { fetchClients(); setView("clientsList"); }} className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-xs px-6 py-3 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors">Ouvrir</button>
        </div>

        <div className={`${cardClass} md:w-1/3`}>
          <h3 className="font-cinzel text-xl text-[#D4AF37] mb-4">Comptabilité</h3>
          <p className="font-outfit text-sm text-[#F5F0E8]/60 font-light mb-6 flex-grow">Gérez vos revenus et paiements.</p>
          <button onClick={() => onOpenAccounting()} className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-xs px-6 py-3 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors">Ouvrir</button>
        </div>

        <div className={`${cardClass} md:w-1/3`}>
          <h3 className="font-cinzel text-xl text-[#D4AF37] mb-4">Cahier de Bord</h3>
          <p className="font-outfit text-sm text-[#F5F0E8]/60 font-light mb-6 flex-grow">Documentation technique du site.</p>
          <button onClick={() => setView("cahierDeBord")} className="bg-transparent border border-[#F5F0E8] text-[#F5F0E8] font-outfit uppercase tracking-widest text-xs px-6 py-3 hover:bg-[#F5F0E8] hover:text-[#191970] transition-colors">Ouvrir</button>
        </div>
      </div>

      <div className="text-center">
        <button onClick={handleLogout} className="bg-transparent border border-[#F5F0E8] text-[#F5F0E8] font-outfit uppercase tracking-widest text-sm px-8 py-4 hover:bg-[#F5F0E8] hover:text-[#191970] transition-colors duration-300 font-light">
          Se Déconnecter
        </button>
      </div>
    </>
  );
}