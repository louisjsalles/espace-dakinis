"use client";
import { useState, useEffect } from "react";

export default function PageEditorView({ currentPage, blocks, onUpdateBlock, onAddBlock, onDeleteBlock, onMoveBlock, onSave, setView, saving, message, openMediaPicker, onUpdateProduct, onAddProduct, onDeleteProduct }: any) {
  const [newBlockType, setNewBlockType] = useState("text_image");
  const updateField = (index: number, field: string, value: string) => { const updatedBlock = { ...blocks[index], [field]: value }; onUpdateBlock(index, updatedBlock); };
  const updateList = (index: number, listTitle: string, itemsString: string) => { const items = itemsString.split('\n').filter(item => item.trim() !== ''); const updatedBlock = { ...blocks[index], list: { title: listTitle, items: items } }; onUpdateBlock(index, updatedBlock); };
  const updateButtons = (index: number, buttonsString: string) => { const lines = buttonsString.split('\n').filter(line => line.trim() !== ''); const buttons = lines.map(line => { const parts = line.split(','); return { text: parts[0]?.trim() || "", link: parts[1]?.trim() || "/contact" }; }); const updatedBlock = { ...blocks[index], buttons: buttons }; onUpdateBlock(index, updatedBlock); };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="font-cinzel text-2xl md:text-3xl text-[#D4AF37]">Éditer : {currentPage.title}</h2>
        <div className="w-24 h-[2px] bg-[#8B1A1A] mx-auto mt-4" style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }}></div>
      </div>
      <div className="space-y-8 border border-[#8B1A1A] bg-[#8B1A1A]/30 backdrop-blur-md shadow-2xl p-8 md:p-10">
        {blocks.map((block: any, index: number) => {
          const Controls = () => (
            <div className="absolute top-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-2 py-1 rounded">
              <button onClick={() => onMoveBlock(index, 'up')} disabled={index === 0} className="text-xs text-[#F5F0E8]/80 hover:text-white disabled:opacity-30">↑</button>
              <button onClick={() => onMoveBlock(index, 'down')} disabled={index === blocks.length - 1} className="text-xs text-[#F5F0E8]/80 hover:text-white disabled:opacity-30">↓</button>
              <button onClick={() => onDeleteBlock(index)} className="text-xs text-red-400 hover:text-red-300">Supprimer</button>
            </div>
          );

          if (block.type === 'intro' || block.type === 'paragraph') {
            return (
              <div key={index} className="space-y-2 relative group">
                <Controls />
                <label className="block font-outfit text-sm uppercase tracking-wider text-[#D4AF37] font-light">{block.type === 'intro' ? 'Texte central (Introduction)' : 'Paragraphe'}</label>
                <textarea rows={4} value={block.text} onChange={(e) => updateField(index, 'text', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-2 px-3 font-outfit text-base text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37] font-light rounded-sm" />
                <p className="text-xs text-[#F5F0E8]/40 italic">Astuce : Utilisez &lt;br/&gt; pour les retours à la ligne.</p>
              </div>
            );
          }
          if (block.type === 'heading_with_logo') {
            return (
              <div key={index} className="space-y-2 relative group">
                <Controls />
                <label className="block font-outfit text-sm uppercase tracking-wider text-[#D4AF37] font-light">Titre avec Logo</label>
                <input type="text" value={block.text} onChange={(e) => updateField(index, 'text', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-2 px-3 font-outfit text-lg text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37]" />
              </div>
            );
          }
          if (block.type === 'image_standalone' || block.type === 'text_image') {
            return (
              <div key={index} className="space-y-4 border-l-2 border-[#D4AF37]/50 pl-6 relative group">
                <Controls />
                <label className="block font-outfit text-sm uppercase tracking-wider text-[#D4AF37] font-light">{block.type === 'image_standalone' ? 'Photo seule' : 'Bloc complet (Texte + Image)'}</label>
                {block.type === 'text_image' && (<div><label className="block text-xs text-[#F5F0E8]/60 mb-1">Titre</label><input type="text" value={block.title || ''} onChange={(e) => updateField(index, 'title', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] font-cinzel text-lg focus:outline-none focus:border-[#D4AF37]" /></div>)}
                {block.type === 'text_image' && (<div><label className="block text-xs text-[#F5F0E8]/60 mb-1">Texte</label><textarea rows={5} value={block.text || ''} onChange={(e) => updateField(index, 'text', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-2 px-3 font-outfit text-sm text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37]" /></div>)}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs text-[#F5F0E8]/60 mb-1">Image</label>
                    <div className="flex gap-2">
                      <input type="text" value={block.image || ''} onChange={(e) => updateField(index, 'image', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-xs focus:outline-none focus:border-[#D4AF37]" />
                      <button type="button" onClick={() => openMediaPicker(index)} className="bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] text-xs px-3 hover:bg-[#D4AF37] hover:text-[#191970] transition-colors">Choisir</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-[#F5F0E8]/60 mb-1">{block.type === 'image_standalone' ? 'Alignement' : 'Position Image'}</label>
                    <select 
                      value={block.align || block.image_position || 'right'} 
                      onChange={(e) => updateField(index, block.type === 'image_standalone' ? 'align' : 'image_position', e.target.value)} 
                      className="w-full bg-[#0A0A0A] border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-xs focus:outline-none focus:border-[#D4AF37]"
                      style={{ colorScheme: 'dark' }}
                    >
                      {block.type === 'image_standalone' && <option value="left" className="bg-[#0A0A0A] text-[#F5F0E8]">Gauche</option>}
                      <option value={block.type === 'image_standalone' ? 'center' : 'right'} className="bg-[#0A0A0A] text-[#F5F0E8]">{block.type === 'image_standalone' ? 'Centre' : 'Droite'}</option>
                      {block.type === 'image_standalone' && <option value="right" className="bg-[#0A0A0A] text-[#F5F0E8]">Droite</option>}
                      {block.type === 'text_image' && <option value="left" className="bg-[#0A0A0A] text-[#F5F0E8]">Gauche</option>}
                    </select>
                  </div>
                  {block.type === 'image_standalone' && (<div><label className="block text-xs text-[#F5F0E8]/60 mb-1">Texte ALT (SEO)</label><input type="text" value={block.alt || ''} onChange={(e) => updateField(index, 'alt', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-xs focus:outline-none focus:border-[#D4AF37]" /></div>)}
                </div>
                {block.type === 'text_image' && block.list && (
                  <div className="mt-4 bg-black/30 p-4 rounded-sm">
                    <label className="block text-xs text-[#D4AF37] mb-2 uppercase tracking-wider">Liste à puces intégrée</label>
                    <input type="text" value={block.list.title || ''} onChange={(e) => updateList(index, e.target.value, block.list.items.join('\n'))} className="w-full bg-transparent border-b border-[#F5F0E8]/30 py-1 px-1 text-[#F5F0E8] text-sm mb-2 focus:outline-none focus:border-[#D4AF37]" placeholder="Titre de la liste" />
                    <textarea rows={4} value={block.list.items.join('\n')} onChange={(e) => updateList(index, block.list.title, e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-xs focus:outline-none focus:border-[#D4AF37]" placeholder="Un élément par ligne" />
                  </div>
                )}
              </div>
            );
          }
          if (block.type === 'home_hero') {
            return (
              <div key={index} className="space-y-4 border-l-2 border-[#D4AF37]/50 pl-6 relative group">
                <Controls />
                <label className="block font-outfit text-sm uppercase tracking-wider text-[#D4AF37] font-light">Bannière d'accueil (Hero)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs text-[#F5F0E8]/60 mb-1">Titre 1</label><input type="text" value={block.title || ''} onChange={(e) => updateField(index, 'title', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#D4AF37]" /></div>
                  <div><label className="block text-xs text-[#F5F0E8]/60 mb-1">Titre 2</label><input type="text" value={block.title2 || ''} onChange={(e) => updateField(index, 'title2', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#D4AF37]" /></div>
                </div>
                <div><label className="block text-xs text-[#F5F0E8]/60 mb-1">Sous-titre</label><input type="text" value={block.subtitle || ''} onChange={(e) => updateField(index, 'subtitle', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#D4AF37]" /></div>
                <div><label className="block text-xs text-[#F5F0E8]/60 mb-1">Texte d'accroche</label><textarea rows={3} value={block.text || ''} onChange={(e) => updateField(index, 'text', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-2 px-3 font-outfit text-sm text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37]" /></div>
                <div>
                  <label className="block text-xs text-[#F5F0E8]/60 mb-1">URL de l'Image</label>
                  <div className="flex gap-2">
                    <input type="text" value={block.image || ''} onChange={(e) => updateField(index, 'image', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-xs focus:outline-none focus:border-[#D4AF37]" />
                    <button type="button" onClick={() => openMediaPicker(index)} className="bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] text-xs px-3 hover:bg-[#D4AF37] hover:text-[#191970] transition-colors">Choisir</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs text-[#F5F0E8]/60 mb-1">Texte du Bouton</label><input type="text" value={block.button_text || ''} onChange={(e) => updateField(index, 'button_text', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-xs focus:outline-none focus:border-[#D4AF37]" /></div>
                  <div><label className="block text-xs text-[#F5F0E8]/60 mb-1">Lien du Bouton</label><input type="text" value={block.button_link || ''} onChange={(e) => updateField(index, 'button_link', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-xs focus:outline-none focus:border-[#D4AF37]" /></div>
                </div>
              </div>
            );
          }
          if (block.type === 'spaces_grid') {
            return (
              <div key={index} className="space-y-2 relative group">
                <Controls />
                <label className="block font-outfit text-sm uppercase tracking-wider text-[#D4AF37] font-light">Grille des 3 Espaces</label>
                <input type="text" value={block.title || ''} onChange={(e) => updateField(index, 'title', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-2 px-3 font-outfit text-lg text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37]" placeholder="Titre de la section" />
                <p className="text-xs text-[#F5F0E8]/40 italic">Ce bloc affichera automatiquement les 3 pages de l'espace.</p>
              </div>
            );
          }
          if (block.type === 'products_grid') {
            return (
              <div key={index} className="space-y-4 border-l-2 border-[#D4AF37]/50 pl-6 relative group">
                <Controls />
                <label className="block font-outfit text-sm uppercase tracking-wider text-[#D4AF37] font-light">Grille de Produits (Boutique)</label>
                {block.products && block.products.map((product: any, pIndex: number) => (
                  <div key={pIndex} className="bg-black/30 p-4 rounded-sm space-y-2 relative border border-[#F5F0E8]/10">
                    <button type="button" onClick={() => onDeleteProduct(index, pIndex)} className="absolute top-2 right-2 text-xs text-red-400 hover:text-red-300">Supprimer produit</button>
                    <div><label className="block text-xs text-[#F5F0E8]/60 mb-1">Titre du produit</label><input type="text" value={product.title || ''} onChange={(e) => onUpdateProduct(index, pIndex, 'title', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#D4AF37]" /></div>
                    <div><label className="block text-xs text-[#F5F0E8]/60 mb-1">Sous-titre</label><input type="text" value={product.subtitle || ''} onChange={(e) => onUpdateProduct(index, pIndex, 'subtitle', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-xs focus:outline-none focus:border-[#D4AF37]" /></div>
                    <div><label className="block text-xs text-[#F5F0E8]/60 mb-1">Description</label><textarea rows={2} value={product.description || ''} onChange={(e) => onUpdateProduct(index, pIndex, 'description', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-xs focus:outline-none focus:border-[#D4AF37]" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs text-[#F5F0E8]/60 mb-1">Prix</label><input type="text" value={product.price || ''} onChange={(e) => onUpdateProduct(index, pIndex, 'price', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#D4AF37]" /></div>
                      <div><label className="block text-xs text-[#F5F0E8]/60 mb-1">Lien Vinted</label><input type="text" value={product.vinted_link || ''} onChange={(e) => onUpdateProduct(index, pIndex, 'vinted_link', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-xs focus:outline-none focus:border-[#D4AF37]" /></div>
                    </div>
                    
                    {/* CHAMPS POUR LES TEXTES DES BOUTONS */}
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div><label className="block text-xs text-[#F5F0E8]/60 mb-1">Texte bouton Vinted</label><input type="text" value={product.vinted_button_text || ''} onChange={(e) => onUpdateProduct(index, pIndex, 'vinted_button_text', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-xs focus:outline-none focus:border-[#D4AF37]" /></div>
                      <div><label className="block text-xs text-[#F5F0E8]/60 mb-1">Texte bouton Contacter</label><input type="text" value={product.contact_button_text || ''} onChange={(e) => onUpdateProduct(index, pIndex, 'contact_button_text', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-xs focus:outline-none focus:border-[#D4AF37]" /></div>
                    </div>

                    <div>
                      <label className="block text-xs text-[#F5F0E8]/60 mb-1">URL de l'Image</label>
                      <div className="flex gap-2">
                        <input type="text" value={product.image || ''} onChange={(e) => onUpdateProduct(index, pIndex, 'image', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-xs focus:outline-none focus:border-[#D4AF37]" />
                        <button type="button" onClick={() => openMediaPicker(index, pIndex)} className="bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] text-xs px-3 hover:bg-[#D4AF37] hover:text-[#191970] transition-colors">Choisir</button>
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => onAddProduct(index)} className="bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] font-outfit uppercase tracking-widest text-xs px-6 py-2 hover:bg-[#D4AF37] hover:text-[#191970] transition-colors w-full">+ Ajouter un produit</button>
              </div>
            );
          }
          if (block.type === 'contact_main') {
            return (
              <div key={index} className="space-y-4 border-l-2 border-[#D4AF37]/50 pl-6 relative group">
                <Controls />
                <label className="block font-outfit text-sm uppercase tracking-wider text-[#D4AF37] font-light">Bloc Page Contact</label>
                <div><label className="block text-xs text-[#F5F0E8]/60 mb-1">Titre 1 (Prendre Contact)</label><input type="text" value={block.title1 || ''} onChange={(e) => updateField(index, 'title1', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] font-cinzel text-lg focus:outline-none focus:border-[#D4AF37]" /></div>
                <div>
                  <label className="block text-xs text-[#F5F0E8]/60 mb-1">URL de la Photo</label>
                  <div className="flex gap-2">
                    <input type="text" value={block.image || ''} onChange={(e) => updateField(index, 'image', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-xs focus:outline-none focus:border-[#D4AF37]" />
                    <button type="button" onClick={() => openMediaPicker(index)} className="bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] text-xs px-3 hover:bg-[#D4AF37] hover:text-[#191970] transition-colors">Choisir</button>
                  </div>
                </div>
                <div><label className="block text-xs text-[#F5F0E8]/60 mb-1">Titre 2 (Paiement & Modalités)</label><input type="text" value={block.title2 || ''} onChange={(e) => updateField(index, 'title2', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] font-cinzel text-lg focus:outline-none focus:border-[#D4AF37]" /></div>
                <div><label className="block text-xs text-[#F5F0E8]/60 mb-1">Texte Paiement</label><textarea rows={3} value={block.paiement_text || ''} onChange={(e) => updateField(index, 'paiement_text', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-2 px-3 font-outfit text-sm text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37]" /></div>
                <div><label className="block text-xs text-[#F5F0E8]/60 mb-1">Texte du Bouton</label><input type="text" value={block.button_text || ''} onChange={(e) => updateField(index, 'button_text', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#D4AF37]" /></div>
              </div>
            );
          }
          if (block.type === 'buttons') {
            return (
              <ButtonsEditor 
                key={index} 
                block={block} 
                index={index} 
                onMoveBlock={onMoveBlock}
                onDeleteBlock={onDeleteBlock}
                blocksLength={blocks.length}
                updateButtons={updateButtons}
              />
            );
          }
          if (block.type === 'disclaimer') {
            return (
              <div key={index} className="space-y-2 relative group">
                <Controls />
                <label className="block font-outfit text-sm uppercase tracking-wider text-[#D4AF37] font-light">Cadre Rouge (Disclaimer)</label>
                <textarea rows={3} value={block.text} onChange={(e) => updateField(index, 'text', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-2 px-3 font-outfit text-sm text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37]" />
              </div>
            );
          }
          if (block.type === 'separator') {
            return (
              <div key={index} className="text-center text-[#F5F0E8]/40 text-xs italic border-t border-b border-[#F5F0E8]/10 py-2 relative group">
                <Controls />
                --- Trait de séparation rouge ---
              </div>
            );
          }
          return null;
        })}

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center border-t border-[#F5F0E8]/20 pt-6 mt-8">
          <select 
            value={newBlockType} 
            onChange={(e) => setNewBlockType(e.target.value)} 
            className="bg-[#0A0A0A] border border-[#F5F0E8]/30 text-[#F5F0E8] py-2 px-3 text-sm focus:outline-none focus:border-[#D4AF37]"
            style={{ colorScheme: 'dark' }}
          >
            <option value="text_image" className="bg-[#0A0A0A] text-[#F5F0E8]">Bloc complet (Texte + Image)</option>
            <option value="image_standalone" className="bg-[#0A0A0A] text-[#F5F0E8]">Photo seule</option>
            <option value="heading_with_logo" className="bg-[#0A0A0A] text-[#F5F0E8]">Logo + Titre</option>
            <option value="intro" className="bg-[#0A0A0A] text-[#F5F0E8]">Texte central</option>
            <option value="separator" className="bg-[#0A0A0A] text-[#F5F0E8]">Trait rouge</option>
            <option value="disclaimer" className="bg-[#0A0A0A] text-[#F5F0E8]">Cadre rouge</option>
            <option value="buttons" className="bg-[#0A0A0A] text-[#F5F0E8]">Bouton(s)</option>
            <option value="home_hero" className="bg-[#0A0A0A] text-[#F5F0E8]">Bannière d'accueil (Hero)</option>
            <option value="spaces_grid" className="bg-[#0A0A0A] text-[#F5F0E8]">Grille des 3 Espaces</option>
            <option value="contact_main" className="bg-[#0A0A0A] text-[#F5F0E8]">Bloc Page Contact</option>
            <option value="products_grid" className="bg-[#0A0A0A] text-[#F5F0E8]">Grille de Produits (Boutique)</option>
          </select>
          <button type="button" onClick={() => onAddBlock(newBlockType)} className="bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] font-outfit uppercase tracking-widest text-xs px-6 py-2 hover:bg-[#D4AF37] hover:text-[#191970] transition-colors">+ Ajouter</button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <button onClick={onSave} disabled={saving} className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-sm px-8 py-4 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors duration-300 font-light disabled:opacity-50">{saving ? "Sauvegarde..." : "Sauvegarder"}</button>
          <button onClick={() => setView("pagesList")} className="bg-transparent border border-[#F5F0E8] text-[#F5F0E8] font-outfit uppercase tracking-widest text-sm px-8 py-4 hover:bg-[#F5F0E8] hover:text-[#191970] transition-colors duration-300 font-light">Retour</button>
        </div>
        {message && <p className="text-center font-outfit text-sm text-[#D4AF37] mt-4">{message}</p>}
      </div>
    </div>
  );
}

// COMPOSANT DEDIÉ POUR LES BOUTONS (Règle le bug de l'espace)
function ButtonsEditor({ block, index, onMoveBlock, onDeleteBlock, blocksLength, updateButtons }: any) {
  const [text, setText] = useState(block.buttons.map((b: any) => `${b.text}, ${b.link}`).join('\n'));

  // Synchronise le texte local si le bloc change (ex: on le déplace avec les flèches)
  useEffect(() => {
    setText(block.buttons.map((b: any) => `${b.text}, ${b.link}`).join('\n'));
  }, [block]);

  return (
    <div className="space-y-2 relative group">
      <div className="absolute top-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-2 py-1 rounded">
        <button onClick={() => onMoveBlock(index, 'up')} disabled={index === 0} className="text-xs text-[#F5F0E8]/80 hover:text-white disabled:opacity-30">↑</button>
        <button onClick={() => onMoveBlock(index, 'down')} disabled={index === blocksLength - 1} className="text-xs text-[#F5F0E8]/80 hover:text-white disabled:opacity-30">↓</button>
        <button onClick={() => onDeleteBlock(index)} className="text-xs text-red-400 hover:text-red-300">Supprimer</button>
      </div>
      <label className="block font-outfit text-sm uppercase tracking-wider text-[#D4AF37] font-light">Bouton(s)</label>
      <textarea 
        rows={3} 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        // On ne met à jour l'état global que quand on quitte le champ
        onBlur={() => updateButtons(index, text)} 
        className="w-full bg-black/20 border border-[#F5F0E8]/30 py-2 px-3 font-outfit text-sm text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37]" 
      />
      <p className="text-xs text-[#F5F0E8]/40 italic">Format : Texte du bouton, /lien</p>
    </div>
  );
}