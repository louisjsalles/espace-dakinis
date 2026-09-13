"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function PagesListView({ pages, setView, onEdit, onDelete, onMovePage }: any) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const cleanSlug = newSlug.trim().toLowerCase().replace(/\s+/g, '-');
    const maxOrder = pages.length > 0 ? Math.max(...pages.map((p: any) => p.order_index || 0)) : 0;
    const { data, error } = await supabase.from('pages').insert({ title: newTitle, slug: cleanSlug, status: 'published', content: [], order_index: maxOrder + 1 }).select('id, slug, title, content, order_index').single();
    if (error) setError("Erreur: " + error.message);
    else if (data) onEdit(data);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="font-cinzel text-2xl md:text-3xl text-[#D4AF37]">Pages du Site</h2>
        <div className="w-24 h-[2px] bg-[#8B1A1A] mx-auto mt-4" style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }}></div>
      </div>
      <div className="space-y-4 mb-8">
        {pages.map((page: any, index: number) => (
          <div key={page.id} className="border border-[#F5F0E8]/20 p-6 bg-black/30 backdrop-blur-sm flex justify-between items-center">
            <div>
              <h3 className="font-cinzel text-xl text-[#D4AF37]">{page.title}</h3>
              <p className="font-outfit text-sm text-[#F5F0E8]/60 font-light">/{page.slug}</p>
            </div>
            <div className="flex gap-2 items-center">
              <button onClick={() => onMovePage(index, 'up')} disabled={index === 0} className="bg-transparent border border-[#F5F0E8]/30 text-[#F5F0E8]/80 text-xs px-2 py-3 hover:bg-[#F5F0E8] hover:text-[#191970] transition-colors disabled:opacity-30">↑</button>
              <button onClick={() => onMovePage(index, 'down')} disabled={index === pages.length - 1} className="bg-transparent border border-[#F5F0E8]/30 text-[#F5F0E8]/80 text-xs px-2 py-3 hover:bg-[#F5F0E8] hover:text-[#191970] transition-colors disabled:opacity-30">↓</button>
              <button onClick={() => onEdit(page)} className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-xs px-6 py-3 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors ml-2">Éditer</button>
              <button onClick={() => onDelete(page.id)} className="bg-transparent border border-red-500/50 text-red-400 font-outfit uppercase tracking-widest text-xs px-6 py-3 hover:bg-red-500 hover:text-[#F5F0E8] transition-colors">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
      <div className="border border-[#D4AF37]/30 bg-black/30 backdrop-blur-sm p-6">
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="w-full text-[#D4AF37] font-outfit uppercase tracking-widest text-sm py-2 hover:bg-[#D4AF37]/10 transition-colors">
          {showCreateForm ? "- Annuler" : "+ Créer une nouvelle page"}
        </button>
        {showCreateForm && (
          <form onSubmit={handleCreate} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs text-[#F5F0E8]/60 mb-1">Titre de la page</label>
              <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37]" placeholder="Ex: Nouvel Atelier" />
            </div>
            <div>
              <label className="block text-xs text-[#F5F0E8]/60 mb-1">URL (Slug)</label>
              <input type="text" value={newSlug} onChange={(e) => setNewSlug(e.target.value)} required className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37]" placeholder="Ex: espaces/nouvel-atelier OU nouvel-atelier" />
              <p className="text-xs text-[#F5F0E8]/40 italic mt-1">Si l'URL commence par "espaces/", elle ira dans le sous-menu. Sinon, elle sera un onglet principal !</p>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-xs px-6 py-3 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors">Créer et Éditer</button>
          </form>
        )}
      </div>
      <div className="text-center mt-10">
        <button onClick={() => setView("dashboard")} className="bg-transparent border border-[#F5F0E8] text-[#F5F0E8] font-outfit uppercase tracking-widest text-sm px-8 py-4 hover:bg-[#F5F0E8] hover:text-[#191970] transition-colors duration-300 font-light">Retour</button>
      </div>
    </div>
  );
}