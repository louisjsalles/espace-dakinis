"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function SettingsView({ setView }: any) {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.from('settings').select('phone, email').eq('id', 1).single().then(({ data }) => {
      if (data) { setPhone(data.phone || ""); setEmail(data.email || ""); setLoading(false); }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const { error } = await supabase.from('settings').update({ phone, email }).eq('id', 1);
    if (error) setMessage("Erreur lors de la sauvegarde.");
    else setMessage("Paramètres mis à jour avec succès !");
    setSaving(false);
  };

  if (loading) return <p className="text-center font-outfit text-[#F5F0E8]/70">Chargement des paramètres...</p>;

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={handleSave} className="space-y-8 border border-[#8B1A1A] bg-[#8B1A1A]/30 backdrop-blur-md shadow-2xl p-8 md:p-10">
        <div className="text-center mb-6">
          <h2 className="font-cinzel text-2xl md:text-3xl text-[#D4AF37]">Paramètres du Site</h2>
          <div className="w-24 h-[2px] bg-[#F5F0E8] mx-auto mt-4" style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }}></div>
        </div>
        <div>
          <label className="block font-outfit text-sm uppercase tracking-wider mb-2 text-[#F5F0E8]/80 font-light">Téléphone</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-transparent border-b-2 border-[#F5F0E8]/50 py-2 px-1 font-outfit text-lg text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37] font-light" />
        </div>
        <div>
          <label className="block font-outfit text-sm uppercase tracking-wider mb-2 text-[#F5F0E8]/80 font-light">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent border-b-2 border-[#F5F0E8]/50 py-2 px-1 font-outfit text-lg text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37] font-light" />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button type="submit" disabled={saving} className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-sm px-8 py-4 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors duration-300 font-light disabled:opacity-50">{saving ? "Sauvegarde..." : "Sauvegarder"}</button>
          <button type="button" onClick={() => setView("dashboard")} className="bg-transparent border border-[#F5F0E8] text-[#F5F0E8] font-outfit uppercase tracking-widest text-sm px-8 py-4 hover:bg-[#F5F0E8] hover:text-[#191970] transition-colors duration-300 font-light">Retour</button>
        </div>
        {message && <p className="text-center font-outfit text-sm text-[#D4AF37] mt-4">{message}</p>}
      </form>
    </div>
  );
}