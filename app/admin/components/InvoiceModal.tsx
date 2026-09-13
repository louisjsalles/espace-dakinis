"use client";
import { useState, useEffect } from "react";

export default function InvoiceModal({ client, entry, invoiceNumber, onClose, onSave }: any) {
  const today = new Date().toISOString().split('T')[0];
  
  // Bloquer le scroll du site et MASQUER LE FOOTER en arrière-plan
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    const footers = document.querySelectorAll('footer, [class*="footer"], [class*="Footer"]');
    const hiddenElements: HTMLElement[] = [];
    
    footers.forEach((el) => {
      if (el instanceof HTMLElement) {
        const elStyle = window.getComputedStyle(el);
        if (elStyle.position === 'fixed' || elStyle.position === 'sticky' || elStyle.position === 'absolute') {
          el.style.display = 'none';
          hiddenElements.push(el);
        }
      }
    });

    return () => {
      document.body.style.overflow = originalStyle;
      hiddenElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.display = '';
        }
      });
    };
  }, []);

  const [issuer, setIssuer] = useState({
    name: "Alexandra Durand",
    address: "92 Avenue du Château d'Eau",
    city: "31880 La Salvetat-Saint-Gilles",
    phone: "0688188595",
    email: "a.alexandradurand@gmail.com",
    siren: "908 310 188",
    tva: "FR77908310188"
  });

  // Récupération sécurisée du nom du patient
  const clientName = client?.nom_prenom || `${client?.prenom || ''} ${client?.nom || ''}`.trim() || "";

  const [recipient, setRecipient] = useState({
    name: clientName,
    address: client?.adresse || "",
    email: client?.email || "",
    phone: client?.telephone || ""
  });

  const [details, setDetails] = useState({
    date: entry?.entry_date ? entry.entry_date.split('T')[0] : today,
    description: entry?.consultation_types?.name || "Consultation",
    amount: entry?.amount || 0,
    payment_method: entry?.payment_method || "Espèces"
  });

  const handlePrint = () => {
    const printContents = document.getElementById('invoice-print-area')?.innerHTML;
    if (!printContents) return;

    const win = window.open('', '', 'height=800,width=800');
    if (!win) return;
    
    win.document.write('<html><head><title>Facture ' + invoiceNumber + '</title>');
    win.document.write('<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">');
    win.document.write('<style>');
    win.document.write('body { font-family: "Montserrat", sans-serif; background: #F5F0E8; color: #2C2C2C; padding: 40px; line-height: 1.6; margin: 0; }');
    // Sécurité pour que les inputs s'impriment bien sur toute leur largeur sans se couper
    win.document.write('input, textarea { border: none !important; background: transparent !important; outline: none !important; box-shadow: none !important; padding: 0 !important; margin: 0 !important; min-width: 0 !important; max-width: 100% !important; color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; text-align: inherit !important; }');
    
    win.document.write('.doc-header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #8B1A1A; padding-bottom: 20px; }');
    win.document.write('.issuer h1 { font-family: "Cinzel", serif; font-size: 24px; margin: 0 0 10px 0; color: #2C2C2C; }');
    win.document.write('.issuer p { margin: 2px 0; font-size: 14px; }');
    win.document.write('.meta { text-align: right; }');
    win.document.write('.meta h2 { font-family: "Cinzel", serif; font-size: 32px; margin: 0 0 10px 0; color: #8B1A1A; text-transform: uppercase; letter-spacing: 2px; }');
    win.document.write('.meta p { margin: 2px 0; font-size: 14px; }');
    win.document.write('.recipient { margin-bottom: 40px; }');
    win.document.write('.recipient h3 { font-family: "Cinzel", serif; font-size: 16px; color: #4A5568; margin: 0 0 5px 0; text-transform: uppercase; }');
    win.document.write('.recipient p { margin: 2px 0; font-size: 14px; }');
    win.document.write('.line-items { margin-bottom: 40px; border-top: 1px solid #2C2C2C; border-bottom: 1px solid #2C2C2C; padding: 20px 0; }');
    win.document.write('.item-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }');
    win.document.write('.item-desc { font-size: 16px; }');
    win.document.write('.item-date { font-size: 14px; color: #4A5568; margin-right: 20px; }');
    win.document.write('.item-amount { font-family: "Cinzel", serif; font-size: 18px; color: #2C2C2C; }');
    win.document.write('.total-row { display: flex; justify-content: flex-end; align-items: center; margin-top: 20px; }');
    win.document.write('.total-label { font-family: "Cinzel", serif; font-size: 18px; text-transform: uppercase; margin-right: 20px; }');
    win.document.write('.total-amount { font-family: "Cinzel", serif; font-size: 24px; font-weight: bold; color: #8B1A1A; }');
    win.document.write('.footer { margin-top: 60px; font-size: 12px; color: #4A5568; border-top: 1px solid #2C2C2C; padding-top: 20px; text-align: center; }');
    win.document.write('</style>');
    win.document.write('</head><body>');
    win.document.write(printContents);
    win.document.write('</body></html>');
    
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 500);
  };

  const handleSave = () => {
    onSave({ invoiceNumber, issuer, recipient, details });
  };

  const inputBase = "bg-transparent border-b border-transparent hover:border-dashed hover:border-[#8B1A1A]/50 focus:outline-none focus:border-solid focus:border-[#8B1A1A] transition-all w-full py-1";
  const labelBase = "block text-xs text-[#4A5568] uppercase tracking-wider mb-1";

  return (
    <div className="fixed inset-0 z-[2147483647] bg-black/90 backdrop-blur-md flex items-start justify-center p-4 md:p-8 pb-32 overflow-y-auto" onClick={onClose}>
      
      {/* Conteneur de la modale */}
      <div className="bg-[#0A0A0A] border border-[#8B1A1A]/60 p-4 md:p-8 max-w-4xl w-full my-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-cinzel text-xl text-[#D4AF37] uppercase tracking-wider">Prévisualisation de la Facture</h3>
          <button onClick={onClose} className="text-[#F5F0E8]/60 hover:text-[#8B1A1A] text-xl transition-colors">X</button>
        </div>

        {/* LA FEUILLE DE FACTURE (Prévisualisation directe) */}
        <div id="invoice-print-area" className="bg-[#F5F0E8] text-[#2C2C2C] p-8 md:p-12 shadow-inner rounded-sm">
          
          {/* EN-TÊTE : INFOS ALEXANDRA EMPIÉLÉES */}
          <div className="doc-header flex flex-col md:flex-row justify-between mb-10 pb-6 border-b-2 border-[#8B1A1A]">
            
            {/* Bloc gauche : Alexandra */}
            <div className="issuer mb-6 md:mb-0 w-full md:w-1/2 flex flex-col gap-1">
              <h1 className="font-cinzel text-2xl md:text-3xl mb-2 text-[#2C2C2C]">{issuer.name}</h1>
              <input type="text" value={issuer.address} onChange={(e) => setIssuer({...issuer, address: e.target.value})} className={`${inputBase} text-sm`} />
              <input type="text" value={issuer.city} onChange={(e) => setIssuer({...issuer, city: e.target.value})} className={`${inputBase} text-sm`} />
              <input type="text" value={issuer.phone} onChange={(e) => setIssuer({...issuer, phone: e.target.value})} className={`${inputBase} text-sm`} />
              <input type="text" value={issuer.email} onChange={(e) => setIssuer({...issuer, email: e.target.value})} className={`${inputBase} text-sm`} />
              
              <div className="mt-2">
                <span className="text-xs text-[#4A5568] uppercase block mb-1">SIREN</span>
                <input type="text" value={issuer.siren} onChange={(e) => setIssuer({...issuer, siren: e.target.value})} className={`${inputBase} text-sm`} />
              </div>
              <div>
                <span className="text-xs text-[#4A5568] uppercase block mb-1">TVA Intracom.</span>
                <input type="text" value={issuer.tva} onChange={(e) => setIssuer({...issuer, tva: e.target.value})} className={`${inputBase} text-sm`} />
              </div>
            </div>
            
            {/* Bloc droit : Facture N° et Date */}
            <div className="meta text-left md:text-right w-full md:w-1/2 mt-6 md:mt-0">
              <h2 className="font-cinzel text-3xl md:text-4xl text-[#8B1A1A] uppercase tracking-widest mb-2">Facture</h2>
              <p className="text-sm font-outfit">N° {invoiceNumber}</p>
              <div className="mt-2 md:flex md:flex-col md:items-end">
                <label className={labelBase}>Date</label>
                <input type="date" value={details.date} onChange={(e) => setDetails({...details, date: e.target.value})} className={`${inputBase} text-sm md:w-auto`} />
              </div>
            </div>
          </div>

          {/* DESTINATAIRE (CLIENT) - Même présentation que l'entête */}
          <div className="recipient mb-10 w-full md:w-1/2 flex flex-col gap-1">
            <h3 className="font-cinzel text-base text-[#4A5568] uppercase tracking-wider mb-2">Facturé à :</h3>
            <input type="text" value={recipient.name} onChange={(e) => setRecipient({...recipient, name: e.target.value})} className={`${inputBase} text-lg font-medium`} />
            <input type="text" value={recipient.address} onChange={(e) => setRecipient({...recipient, address: e.target.value})} className={`${inputBase} text-sm`} />
            <input type="text" value={recipient.phone} onChange={(e) => setRecipient({...recipient, phone: e.target.value})} className={`${inputBase} text-sm`} />
            <input type="text" value={recipient.email} onChange={(e) => setRecipient({...recipient, email: e.target.value})} className={`${inputBase} text-sm`} />
          </div>

          {/* DÉTAILS DE LA PRESTATION */}
          <div className="line-items border-t border-b border-[#2C2C2C] py-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="font-cinzel text-sm uppercase tracking-wider text-[#4A5568]">Consultation</span>
              <span className="font-cinzel text-sm uppercase tracking-wider text-[#4A5568]">Montant</span>
            </div>
            
            <div className="item-row flex justify-between items-start py-2">
              {/* Gauche : Consultation */}
              <input type="text" value={details.description} onChange={(e) => setDetails({...details, description: e.target.value})} className={`${inputBase} text-base font-medium w-3/5`} />
              
              {/* Droite : Montant au-dessus de Paiement */}
              <div className="flex flex-col items-end gap-1 w-2/5">
                <div className="flex items-center w-full justify-end">
                  <span className="text-[#2C2C2C] mr-1">€</span>
                  <input type="number" step="0.01" value={details.amount} onChange={(e) => setDetails({...details, amount: parseFloat(e.target.value)})} className={`${inputBase} text-lg font-cinzel text-right w-24`} />
                </div>
                <span className="text-sm text-[#4A5568]">Paiement: {details.payment_method}</span>
              </div>
            </div>
          </div>

          {/* TOTAL */}
          <div className="total-row flex justify-end items-center mb-10">
            <span className="total-label font-cinzel text-lg uppercase mr-4">Total à payer</span>
            <span className="total-amount font-cinzel text-2xl font-bold text-[#8B1A1A]">{details.amount.toFixed(2)} €</span>
          </div>

          {/* PIED DE PAGE */}
          <div className="footer text-center text-xs text-[#4A5568] border-t border-[#2C2C2C]/30 pt-6 mt-12">
            <p>Merci de votre confiance. Règlement par {details.payment_method} à réception de la facture.</p>
          </div>

        </div>

        {/* BOUTONS D'ACTION (Couleurs Dakinis) */}
        <div className="flex flex-col md:flex-row gap-4 justify-between mt-8">
          {/* Bouton de retour à gauche */}
          <button onClick={onClose} className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-xs px-6 py-3 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors">
            Retour à la fiche
          </button>
          
          {/* Boutons de sauvegarde/impression à droite */}
          <div className="flex flex-col md:flex-row gap-4">
            <button onClick={handleSave} className="bg-transparent border border-[#F5F0E8]/50 text-[#F5F0E8] font-outfit uppercase tracking-widest text-xs px-6 py-3 hover:bg-[#F5F0E8]/10 transition-colors">
              Enregistrer l'historique
            </button>
            <button onClick={handlePrint} className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-xs px-6 py-3 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors">
              Imprimer / Télécharger PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}