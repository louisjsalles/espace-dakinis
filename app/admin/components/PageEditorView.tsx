"use client";
import { useState, useEffect, useRef } from "react";

export default function PageEditorView({ currentPage, seoDescription, onUpdateSeoDescription, blocks, onUpdateBlock, onAddBlock, onDeleteBlock, onMoveBlock, onSave, setView, saving, message, openMediaPicker, onUpdateProduct, onAddProduct, onDeleteProduct }: any) {
  const [newBlockType, setNewBlockType] = useState("text_image");
  const updateField = (index: number, field: string, value: string) => { const updatedBlock = { ...blocks[index], [field]: value }; onUpdateBlock(index, updatedBlock); };
  const updateList = (index: number, listTitle: string, itemsString: string) => { const items = itemsString.split('\n').filter(item => item.trim() !== ''); const updatedBlock = { ...blocks[index], list: { title: listTitle, items: items } }; onUpdateBlock(index, updatedBlock); };
  const updateButtons = (index: number, buttonsString: string) => { const lines = buttonsString.split('\n').filter(line => line.trim() !== ''); const buttons = lines.map(line => { const parts = line.split(','); return { text: parts[0]?.trim() || "", link: parts[1]?.trim() || "/contact" }; }); const updatedBlock = { ...blocks[index], buttons: buttons }; onUpdateBlock(index, updatedBlock); };

  const updateCard = (blockIndex: number, cardIndex: number, field: string, value: string) => {
    const block = blocks[blockIndex];
    const cards = [...(block.cards || [])];
    cards[cardIndex] = { ...cards[cardIndex], [field]: value };
    onUpdateBlock(blockIndex, { ...block, cards });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="font-cinzel text-2xl md:text-3xl text-[#D4AF37]">Éditer : {currentPage.title}</h2>
        <div className="w-24 h-[2px] bg-[#8B1A1A] mx-auto mt-4" style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }}></div>
      </div>
      <div className="space-y-8 border border-[#8B1A1A] bg-[#8B1A1A]/30 backdrop-blur-md shadow-2xl p-8 md:p-10">
        
        {/* CHAMP SEO DESCRIPTION */}
        <div className="space-y-2 mb-8 border-b border-[#F5F0E8]/20 pb-6">
          <label className="block font-outfit text-sm uppercase tracking-wider text-[#D4AF37] font-light">Description courte (SEO & Aperçu)</label>
          <textarea rows={2} value={seoDescription} onChange={(e) => onUpdateSeoDescription(e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-2 px-3 font-outfit text-sm text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37] rounded-sm" placeholder="Description utilisée pour le référencement Google et l'aperçu dans la grille des espaces." />
          <p className="text-xs text-[#F5F0E8]/40 italic">⚠️ Si cette page est un des 3 espaces, ce texte s'affichera dans les tableaux de la page d'accueil.</p>
        </div>

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
                <RichTextEditor value={block.text} onChange={(val) => updateField(index, 'text', val)} />
                <p className="text-xs text-[#F5F0E8]/40 italic">Astuce : Utilisez la barre d'outils ci-dessus pour mettre en forme le texte sélectionné.</p>
              </div>
            );
          }
          
          // MISE À JOUR : LOGO + TITRE AVEC ALIGNEMENT
          if (block.type === 'heading_with_logo') {
            return (
              <div key={index} className="space-y-2 relative group border-l-2 border-[#D4AF37]/50 pl-6">
                <Controls />
                <label className="block font-outfit text-sm uppercase tracking-wider text-[#D4AF37] font-light">Titre avec Logo</label>
                <input type="text" value={block.text} onChange={(e) => updateField(index, 'text', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-2 px-3 font-outfit text-lg text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37]" />
                <div>
                  <label className="block text-xs text-[#F5F0E8]/60 mb-1">Alignement</label>
                  <select 
                    value={block.align || 'left'} 
                    onChange={(e) => updateField(index, 'align', e.target.value)} 
                    className="w-full bg-[#0A0A0A] border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-xs focus:outline-none focus:border-[#D4AF37]"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="left" className="bg-[#0A0A0A] text-[#F5F0E8]">Gauche</option>
                    <option value="center" className="bg-[#0A0A0A] text-[#F5F0E8]">Centre</option>
                    <option value="right" className="bg-[#0A0A0A] text-[#F5F0E8]">Droite</option>
                  </select>
                </div>
              </div>
            );
          }

          if (block.type === 'image_standalone' || block.type === 'text_image') {
            return (
              <div key={index} className="space-y-4 border-l-2 border-[#D4AF37]/50 pl-6 relative group">
                <Controls />
                <label className="block font-outfit text-sm uppercase tracking-wider text-[#D4AF37] font-light">{block.type === 'image_standalone' ? 'Photo seule' : 'Bloc complet (Texte + Image)'}</label>
                {block.type === 'text_image' && (<div><label className="block text-xs text-[#F5F0E8]/60 mb-1">Titre</label><input type="text" value={block.title || ''} onChange={(e) => updateField(index, 'title', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] font-cinzel text-lg focus:outline-none focus:border-[#D4AF37]" /></div>)}
                {block.type === 'text_image' && (
                  <div>
                    <label className="block text-xs text-[#F5F0E8]/60 mb-1">Texte</label>
                    <RichTextEditor value={block.text || ''} onChange={(val) => updateField(index, 'text', val)} />
                  </div>
                )}
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
                    <select value={block.align || block.image_position || 'right'} onChange={(e) => updateField(index, block.type === 'image_standalone' ? 'align' : 'image_position', e.target.value)} className="w-full bg-[#0A0A0A] border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-xs focus:outline-none focus:border-[#D4AF37]" style={{ colorScheme: 'dark' }}>
                      {block.type === 'image_standalone' && <option value="left" className="bg-[#0A0A0A]">Gauche</option>}
                      <option value={block.type === 'image_standalone' ? 'center' : 'right'} className="bg-[#0A0A0A]">{block.type === 'image_standalone' ? 'Centre' : 'Droite'}</option>
                      {block.type === 'image_standalone' && <option value="right" className="bg-[#0A0A0A]">Droite</option>}
                      {block.type === 'text_image' && <option value="left" className="bg-[#0A0A0A]">Gauche</option>}
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
            const cards = block.cards || [];
            return (
              <div key={index} className="space-y-4 border-l-2 border-[#D4AF37]/50 pl-6 relative group">
                <Controls />
                <label className="block font-outfit text-sm uppercase tracking-wider text-[#D4AF37] font-light">Grille des 3 Espaces</label>
                <div><label className="block text-xs text-[#F5F0E8]/60 mb-1">Titre de la section</label><input type="text" value={block.title || ''} onChange={(e) => updateField(index, 'title', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-2 px-3 font-outfit text-lg text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37]" /></div>
                
                {cards.length > 0 ? cards.map((card: any, cIndex: number) => (
                  <div key={cIndex} className="bg-black/30 p-4 rounded-sm space-y-2 border border-[#F5F0E8]/10">
                    <div><label className="block text-xs text-[#F5F0E8]/60 mb-1">Titre du tableau {cIndex + 1}</label><input type="text" value={card.title || ''} onChange={(e) => updateCard(index, cIndex, 'title', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#D4AF37]" /></div>
                    <div><label className="block text-xs text-[#F5F0E8]/60 mb-1">Description</label><textarea rows={2} value={card.description || ''} onChange={(e) => updateCard(index, cIndex, 'description', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-xs focus:outline-none focus:border-[#D4AF37]" /></div>
                    <div><label className="block text-xs text-[#F5F0E8]/60 mb-1">Lien (ex: /espaces/voir-clairement)</label><input type="text" value={card.link || ''} onChange={(e) => updateCard(index, cIndex, 'link', e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-1 px-2 text-[#F5F0E8] text-xs focus:outline-none focus:border-[#D4AF37]" /></div>
                  </div>
                )) : (
                  <p className="text-xs text-[#F5F0E8]/40 italic">Aucune carte. Supprimez ce bloc et ajoutez-en un nouveau pour générer les cartes.</p>
                )}
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
              <ButtonsEditor key={index} block={block} index={index} onMoveBlock={onMoveBlock} onDeleteBlock={onDeleteBlock} blocksLength={blocks.length} updateButtons={updateButtons} />
            );
          }
          if (block.type === 'disclaimer') {
            return (
              <div key={index} className="space-y-2 relative group">
                <Controls />
                <label className="block font-outfit text-sm uppercase tracking-wider text-[#D4AF37] font-light">Cadre Rouge (Disclaimer)</label>
                <RichTextEditor value={block.text} onChange={(val) => updateField(index, 'text', val)} />
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
          <select value={newBlockType} onChange={(e) => setNewBlockType(e.target.value)} className="bg-[#0A0A0A] border border-[#F5F0E8]/30 text-[#F5F0E8] py-2 px-3 text-sm focus:outline-none focus:border-[#D4AF37]" style={{ colorScheme: 'dark' }}>
            <option value="text_image" className="bg-[#0A0A0A]">Bloc complet (Texte + Image)</option>
            <option value="image_standalone" className="bg-[#0A0A0A]">Photo seule</option>
            <option value="heading_with_logo" className="bg-[#0A0A0A]">Logo + Titre</option>
            <option value="intro" className="bg-[#0A0A0A]">Texte central</option>
            <option value="separator" className="bg-[#0A0A0A]">Trait rouge</option>
            <option value="disclaimer" className="bg-[#0A0A0A]">Cadre rouge</option>
            <option value="buttons" className="bg-[#0A0A0A]">Bouton(s)</option>
            <option value="home_hero" className="bg-[#0A0A0A]">Bannière d'accueil (Hero)</option>
            <option value="spaces_grid" className="bg-[#0A0A0A]">Grille des 3 Espaces</option>
            <option value="contact_main" className="bg-[#0A0A0A]">Bloc Page Contact</option>
            <option value="products_grid" className="bg-[#0A0A0A]">Grille de Produits (Boutique)</option>
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

// --- COMPOSANT EDITEUR DE TEXTE RICH ---
function RichTextEditor({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormat = (openTag: string, closeTag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newValue = value.substring(0, start) + openTag + selectedText + closeTag + value.substring(end);
    onChange(newValue);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + openTag.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos + selectedText.length);
    }, 0);
  };

  const applyColor = (color: string) => applyFormat(`<span style="color: ${color};">`, '</span>');
  const applyFont = (font: string) => applyFormat(`<span style="font-family: '${font}', sans-serif;">`, '</span>');
  const applySize = (size: string) => applyFormat(`<span style="font-size: ${size};">`, '</span>');

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-1 mb-2 p-2 bg-[#0A0A0A] border border-[#F5F0E8]/20 rounded-sm">
        <button type="button" onClick={() => applyFormat('<strong>', '</strong>')} className="px-2 py-1 text-xs text-[#F5F0E8] bg-[#F5F0E8]/10 hover:bg-[#F5F0E8]/20 font-bold">B</button>
        <button type="button" onClick={() => applyFormat('<em>', '</em>')} className="px-2 py-1 text-xs text-[#F5F0E8] bg-[#F5F0E8]/10 hover:bg-[#F5F0E8]/20 italic">I</button>
        <div className="w-px h-5 bg-[#F5F0E8]/20 mx-1 self-center"></div>
        <button type="button" onClick={() => applyColor('#F5F0E8')} className="px-2 py-1 text-xs text-[#F5F0E8] bg-[#F5F0E8]/10 hover:bg-[#F5F0E8]/20">Blanc</button>
        <button type="button" onClick={() => applyColor('#8B1A1A')} className="px-2 py-1 text-xs text-[#8B1A1A] bg-[#8B1A1A]/10 hover:bg-[#8B1A1A]/20">Rouge</button>
        <button type="button" onClick={() => applyColor('#D4AF37')} className="px-2 py-1 text-xs text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20">Doré</button>
        <div className="w-px h-5 bg-[#F5F0E8]/20 mx-1 self-center"></div>
        <select onChange={(e) => applySize(e.target.value)} className="px-1 py-1 text-xs bg-[#0A0A0A] border border-[#F5F0E8]/20 text-[#F5F0E8]" style={{ colorScheme: 'dark' }}>
          <option value="">Taille</option>
          <option value="0.75rem">Petit</option>
          <option value="1rem">Normal</option>
          <option value="1.25rem">Grand</option>
          <option value="1.5rem">Titre</option>
        </select>
        <select onChange={(e) => applyFont(e.target.value)} className="px-1 py-1 text-xs bg-[#0A0A0A] border border-[#F5F0E8]/20 text-[#F5F0E8]" style={{ colorScheme: 'dark' }}>
          <option value="">Police</option>
          <option value="Cinzel">Cinzel</option>
          <option value="Cormorant Garamond">Cormorant Garamond</option>
          <option value="Playfair Display">Playfair Display</option>
          <option value="EB Garamond">EB Garamond</option>
          <option value="Merriweather">Merriweather</option>
          <option value="Lora">Lora</option>
          <option value="Outfit">Outfit</option>
          <option value="Montserrat">Montserrat</option>
          <option value="Roboto">Roboto</option>
          <option value="Open Sans">Open Sans</option>
          <option value="Lato">Lato</option>
          <option value="Poppins">Poppins</option>
          <option value="Bebas Neue">Bebas Neue</option>
          <option value="Oswald">Oswald</option>
          <option value="Dancing Script">Dancing Script</option>
        </select>
      </div>
      <textarea ref={textareaRef} rows={4} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-2 px-3 font-outfit text-base text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37] font-light rounded-sm" />
    </div>
  );
}

function ButtonsEditor({ block, index, onMoveBlock, onDeleteBlock, blocksLength, updateButtons }: any) {
  const [text, setText] = useState(block.buttons.map((b: any) => `${b.text}, ${b.link}`).join('\n'));
  useEffect(() => { setText(block.buttons.map((b: any) => `${b.text}, ${b.link}`).join('\n')); }, [block]);

  return (
    <div className="space-y-2 relative group">
      <div className="absolute top-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-2 py-1 rounded">
        <button onClick={() => onMoveBlock(index, 'up')} disabled={index === 0} className="text-xs text-[#F5F0E8]/80 hover:text-white disabled:opacity-30">↑</button>
        <button onClick={() => onMoveBlock(index, 'down')} disabled={index === blocksLength - 1} className="text-xs text-[#F5F0E8]/80 hover:text-white disabled:opacity-30">↓</button>
        <button onClick={() => onDeleteBlock(index)} className="text-xs text-red-400 hover:text-red-300">Supprimer</button>
      </div>
      <label className="block font-outfit text-sm uppercase tracking-wider text-[#D4AF37] font-light">Bouton(s)</label>
      <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} onBlur={() => updateButtons(index, text)} className="w-full bg-black/20 border border-[#F5F0E8]/30 py-2 px-3 font-outfit text-sm text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37]" />
      <p className="text-xs text-[#F5F0E8]/40 italic">Format : Texte du bouton, /lien</p>
    </div>
  );
}