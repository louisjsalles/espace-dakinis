"use client";

export default function MediaPickerModal({ showMediaPicker, setShowMediaPicker, medias, handleSelectMedia, handleUploadMedia }: any) {
  if (!showMediaPicker) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-8" onClick={() => setShowMediaPicker(false)}>
      <div className="bg-[#191970] border border-[#D4AF37]/50 p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-cinzel text-2xl text-[#D4AF37]">Bibliothèque d'Images</h3>
          <button onClick={() => setShowMediaPicker(false)} className="text-[#F5F0E8]/60 hover:text-white text-xl">X</button>
        </div>
        <div className="mb-8 border-2 border-dashed border-[#F5F0E8]/20 p-4 text-center">
          <label className="cursor-pointer text-[#D4AF37] hover:underline">
            + Importer une nouvelle photo depuis l'ordinateur
            <input type="file" accept="image/*" onChange={handleUploadMedia} className="hidden" />
          </label>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {medias.map((media: any) => (
            <div key={media.id} onClick={() => handleSelectMedia(media.url)} className="cursor-pointer group relative border border-transparent hover:border-[#D4AF37] transition-all">
              <img src={media.url} alt={media.alt_text} className="w-full h-32 object-cover" />
              <p className="text-xs text-[#F5F0E8]/60 truncate p-1">{media.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}