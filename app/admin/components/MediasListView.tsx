"use client";

export default function MediasListView({ medias, setView, onUpload, onDelete }: any) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="font-cinzel text-2xl md:text-3xl text-[#D4AF37]">Bibliothèque Médias</h2>
        <div className="w-24 h-[2px] bg-[#8B1A1A] mx-auto mt-4" style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }}></div>
      </div>
      <div className="mb-8 border-2 border-dashed border-[#F5F0E8]/20 p-6 text-center bg-black/20">
        <label className="cursor-pointer text-[#D4AF37] font-outfit uppercase tracking-widest text-sm hover:underline">
          + Importer une nouvelle photo
          <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
        </label>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {medias.map((media: any) => (
          <div key={media.id} className="border border-[#F5F0E8]/10 p-2 bg-black/30 relative group">
            <img src={media.url} alt={media.alt_text} className="w-full h-32 object-cover" />
            <p className="text-xs text-[#F5F0E8]/60 truncate mt-2 font-outfit">{media.name}</p>
            <button onClick={() => onDelete(media)} className="absolute top-1 right-1 bg-red-500/80 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">X</button>
          </div>
        ))}
      </div>
      <div className="text-center mt-10">
        <button onClick={() => setView("dashboard")} className="bg-transparent border border-[#F5F0E8] text-[#F5F0E8] font-outfit uppercase tracking-widest text-sm px-8 py-4 hover:bg-[#F5F0E8] hover:text-[#191970] transition-colors duration-300 font-light">
          Retour
        </button>
      </div>
    </div>
  );
}