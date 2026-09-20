"use client";

import Link from "next/link";
import { useState } from "react";

const DakiniLogo = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <polygon points="50,90 90,20 10,20" fill="#8B1A1A" />
    <line x1="50" y1="10" x2="50" y2="100" stroke="#D4AF37" strokeWidth="3" />
    <circle cx="50" cy="55" r="15" fill="#2C2C2C" />
  </svg>
);

export default function PageRenderer({ page, espaces, settings }: { page: any, espaces?: any[], settings?: any }) {
  const bgImage = page.background || '/fond-nuit.png';
  const overlayClass = page.background === '/terre-lave.png' ? 'bg-black/60' : 'bg-black/40';

  return (
    <main className="relative min-h-screen text-[#F5F0E8] px-6 py-20 md:py-32 bg-[#191970] overflow-hidden">
      <div className="fixed inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url('${bgImage}')` }}></div>
      <div className={`fixed inset-0 z-0 ${overlayClass}`}></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {page.slug !== 'home' && (
          <div className="text-center mb-20 border-b border-[#F5F0E8]/30 pb-10">
            <h1 className="font-cinzel text-4xl md:text-5xl font-bold tracking-wider text-[#D4AF37] uppercase">
              {page.title}
            </h1>
            {page.subtitle && (
              <p className="mt-4 font-outfit text-lg text-[#F5F0E8]/80 italic font-light">
                {page.subtitle}
              </p>
            )}
          </div>
        )}

        <div className="space-y-24">
          {page.content.map((block: any, index: number) => {
            
            if (block.type === 'home_hero') {
              return (
                <section key={index} className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-80px)] md:mt-20 items-center gap-8 p-8 md:p-16">
                  <div className="flex flex-col justify-center md:items-start items-center text-center md:text-left">
                    <h1 className="font-cinzel text-6xl md:text-8xl font-medium text-white tracking-wide leading-none mb-4">
                      {block.title} <br/> <span className="text-[#D4AF37]">{block.title2}</span>
                    </h1>
                    <p className="font-outfit text-sm md:text-base text-white/80 tracking-[0.3em] uppercase mt-6 mb-8 font-light">
                      {block.subtitle}
                    </p>
                    <div className="w-32 h-[2px] bg-[#8B1A1A] mb-8 mx-auto md:mx-0" style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }}></div>
                    <p className="font-outfit text-base text-white/90 max-w-md leading-relaxed font-light">
                      {block.text}
                    </p>
                    <Link href={block.button_link} className="mt-10 bg-[#8B1A1A] text-white font-outfit uppercase tracking-widest text-sm px-8 py-4 hover:bg-white hover:text-[#191970] transition-colors duration-300 font-light">
                      {block.button_text}
                    </Link>
                  </div>
                  <div className="w-full h-[60vh] md:h-[90vh] flex items-center justify-center">
                    <img src={block.image} alt="Statue dorée de Dakini" className="max-h-full w-auto object-contain drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)] scale-110" />
                  </div>
                </section>
              );
            }

            if (block.type === 'products_grid') {
              return (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
                  {block.products.map((p: any, i: number) => (
                    <div key={i} className="flex flex-col items-center text-center border border-[#F5F0E8]/10 p-8 bg-[#0F0F0F]/90 backdrop-blur-sm">
                      <img src={p.image} alt={p.title} className="w-full aspect-square object-cover border border-[#F5F0E8]/20 mb-6" />
                      <h2 className="font-cinzel text-2xl text-[#D4AF37] mb-2">{p.title}</h2>
                      <p className="font-outfit text-sm text-[#F5F0E8]/60 mb-4 italic font-light">{p.subtitle}</p>
                      <p className="font-outfit text-base text-[#F5F0E8]/90 mb-6 font-light">{p.description}</p>
                      <p className="font-cinzel text-xl text-[#F5F0E8] mb-8">{p.price}</p>
                      <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <a href={p.vinted_link || '#'} target="_blank" rel="noopener noreferrer" className="flex-1 border border-[#D4AF37] text-[#D4AF37] font-outfit uppercase tracking-widest text-xs px-4 py-3 hover:bg-[#D4AF37] hover:text-[#1A1A1A] transition-colors duration-300 text-center font-light">
                          {p.vinted_button_text || 'Acheter sur Vinted'}
                        </a>
                        <Link href={p.contact_link || '/contact'} className="flex-1 bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-xs px-4 py-3 hover:bg-[#2C2C2C] transition-colors duration-300 font-light text-center">
                          {p.contact_button_text || 'Contacter'}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }

            // MISE À JOUR : Affichage des Espaces avec les nouvelles données modifiables
            if (block.type === 'spaces_grid') {
              const cards = block.cards || [];
              return (
                <section key={index} className="py-32 px-6">
                  <div className="max-w-6xl mx-auto text-center">
                    <h2 className="font-cinzel text-4xl md:text-5xl font-medium text-[#F5F0E8] mb-4">{block.title || "Les 3 Espaces"}</h2>
                    <div className="w-32 h-[2px] bg-[#8B1A1A] mx-auto mb-20" style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }}></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                      {cards.map((card: any, i: number) => (
                        <Link key={i} href={card.link || '#'} className="group block p-10 border-t-2 border-[#8B1A1A] bg-[#8B1A1A]/50 backdrop-blur-md hover:bg-[#8B1A1A]/70 transition-colors duration-500">
                          <h3 className="font-cinzel text-2xl mb-4 text-[#D4AF37] transition-colors">{card.title}</h3>
                          <p className="font-outfit text-sm text-[#F5F0E8]/70 font-light mb-4 italic">{card.description}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </section>
              );
            }

            if (block.type === 'intro' || block.type === 'paragraph') {
              return (
                <div key={index} className="max-w-3xl mx-auto text-center">
                  <div className="w-32 h-[2px] bg-[#8B1A1A] mb-8 mx-auto" style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }}></div>
                  <p className="font-outfit text-base md:text-lg leading-relaxed font-light text-[#F5F0E8]" dangerouslySetInnerHTML={{ __html: block.text }} />
                </div>
              );
            }

            if (block.type === 'separator') {
              return (
                <div key={index} className="flex justify-center">
                  <div className="w-32 h-[2px] bg-[#8B1A1A]" style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }}></div>
                </div>
              );
            }

            if (block.type === 'heading_with_logo') {
              return (
                <div key={index} className="flex flex-row items-center gap-4 mb-8 justify-center md:justify-start">
                  <DakiniLogo />
                  <h2 className="font-cinzel text-2xl md:text-3xl text-[#D4AF37]">{block.text}</h2>
                </div>
              );
            }

            if (block.type === 'text_image') {
              const isImageRight = block.image_position === 'right';
              return (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                  <div className={`flex flex-col ${isImageRight ? 'order-1' : 'order-2'}`}>
                    {block.title && (
                      <div className="flex flex-row items-center gap-4 mb-6">
                        <DakiniLogo />
                        <h2 className="font-cinzel text-2xl md:text-3xl text-[#D4AF37]">{block.title}</h2>
                      </div>
                    )}
                    <div className="font-outfit text-base leading-relaxed font-light space-y-4 text-[#F5F0E8]/90" dangerouslySetInnerHTML={{ __html: block.text }} />
                    {block.list && (
                      <div className="mt-6">
                        <h3 className="font-cinzel text-xl mb-3 text-[#D4AF37]">{block.list.title}</h3>
                        <ul className="list-none pl-0 space-y-2 font-outfit text-base font-light text-[#F5F0E8]/90">
                          {block.list.items.map((item: string, i: number) => (
                            <li key={i} className="pl-6 relative">
                              <span className="absolute left-0 top-0 text-[#D4AF37]">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className={`w-full h-[60vh] md:h-[80vh] border border-white/30 shadow-2xl overflow-hidden ${isImageRight ? 'order-2' : 'order-1'}`}>
                    <img src={block.image} alt={block.title || 'Visuel'} className="w-full h-full object-cover" />
                  </div>
                </div>
              );
            }

            if (block.type === 'image_standalone') {
              const alignClass = block.align === 'left' ? 'justify-start' : block.align === 'right' ? 'justify-end' : 'justify-center';
              const maxWClass = block.align === 'center' ? 'max-w-2xl' : 'max-w-md';
              return (
                <div key={index} className={`flex ${alignClass} w-full`}>
                  <div className={`w-full ${maxWClass} border border-white/30 shadow-2xl overflow-hidden`}>
                    <img src={block.image} alt={block.alt || 'Visuel'} className="w-full h-auto object-cover" />
                  </div>
                </div>
              );
            }

            if (block.type === 'contact_main') {
              return <ContactForm key={index} block={block} settings={settings} />;
            }

            if (block.type === 'disclaimer') {
              return (
                <div key={index} className="border border-[#8B1A1A] bg-[#8B1A1A]/30 backdrop-blur-md p-8 text-center max-w-3xl mx-auto">
                  <p className="font-outfit text-sm tracking-wide text-[#F5F0E8] font-light" dangerouslySetInnerHTML={{ __html: block.text }} />
                </div>
              );
            }

            if (block.type === 'buttons') {
              return (
                <div key={index} className="flex flex-col sm:flex-row gap-4 justify-center">
                  {block.buttons.map((btn: any, i: number) => (
                    <a key={i} href={btn.link} className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-sm px-8 py-4 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors duration-300 font-light text-center">
                      {btn.text}
                    </a>
                  ))}
                </div>
              );
            }

            return null;
          })}
        </div>

      </div>
    </main>
  );
}

// --- COMPOSANT : FORMULAIRE DE CONTACT CONNECTE A L'API EMAIL ---
function ContactForm({ block, settings }: { block: any, settings: any }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('nom_prenom'),
          phone: formData.get('telephone'),
          email: formData.get('email'),
          message: formData.get('message')
        })
      });

      if (response.ok) {
        setStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="flex flex-col">
          <div className="flex flex-row items-center gap-4 mb-6">
            <DakiniLogo />
            <h2 className="font-cinzel text-2xl md:text-3xl text-[#D4AF37]">{block.title1}</h2>
          </div>
          <div className="w-32 h-[2px] bg-[#8B1A1A] mb-8" style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }}></div>
          
          {status === 'success' ? (
            <div className="border border-[#D4AF37] bg-[#D4AF37]/10 p-8 text-center">
              <p className="font-cinzel text-xl text-[#D4AF37] mb-4">Message envoyé !</p>
              <p className="font-outfit text-sm text-[#F5F0E8]/80">Votre demande a bien été transmise. Je vous recontacterai très bientôt.</p>
            </div>
          ) : (
            <div className="space-y-6 max-w-xl">
              <div>
                <label className="block font-outfit text-sm uppercase tracking-wider mb-2 text-[#F5F0E8]/80 font-light">Nom & Prénom</label>
                <input type="text" name="nom_prenom" required className="w-full bg-transparent border-b-2 border-[#F5F0E8]/50 py-2 px-1 font-outfit text-lg text-[#F5F0E8] focus:outline-none focus:border-[#8B1A1A] font-light placeholder:text-[#F5F0E8]/40" placeholder="Votre nom" />
              </div>
              <div>
                <label className="block font-outfit text-sm uppercase tracking-wider mb-2 text-[#F5F0E8]/80 font-light">Téléphone</label>
                <input type="tel" name="telephone" className="w-full bg-transparent border-b-2 border-[#F5F0E8]/50 py-2 px-1 font-outfit text-lg text-[#F5F0E8] focus:outline-none focus:border-[#8B1A1A] font-light placeholder:text-[#F5F0E8]/40" placeholder="Votre numéro de téléphone" />
              </div>
              <div>
                <label className="block font-outfit text-sm uppercase tracking-wider mb-2 text-[#F5F0E8]/80 font-light">Email</label>
                <input type="email" name="email" required className="w-full bg-transparent border-b-2 border-[#F5F0E8]/50 py-2 px-1 font-outfit text-lg text-[#F5F0E8] focus:outline-none focus:border-[#8B1A1A] font-light placeholder:text-[#F5F0E8]/40" placeholder="Votre adresse email" />
              </div>
              <div>
                <label className="block font-outfit text-sm uppercase tracking-wider mb-2 text-[#F5F0E8]/80 font-light">Message</label>
                <textarea name="message" rows={4} required className="w-full bg-transparent border-b-2 border-[#F5F0E8]/50 py-2 px-1 font-outfit text-lg text-[#F5F0E8] focus:outline-none focus:border-[#8B1A1A] font-light placeholder:text-[#F5F0E8]/40" placeholder="Votre demande..."></textarea>
              </div>
              {status === 'error' && <p className="text-red-400 text-sm">Une erreur est survenue. Veuillez réessayer.</p>}
            </div>
          )}
        </div>
        <div className="w-full h-[60vh] md:h-[80vh] border border-white/30 shadow-2xl overflow-hidden">
          <img src={block.image} alt="Alexandra" className="w-full h-full object-cover" />
        </div>
      </div>

      {settings && (
        <div className="text-center flex flex-col md:flex-row justify-center items-center gap-10 md:gap-20">
          <a href={`tel:${settings.phone}`} className="flex items-center gap-4 group">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5F0E8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#D4AF37] transition-colors">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <span className="font-outfit text-base text-[#F5F0E8]/80 group-hover:text-[#D4AF37] transition-colors tracking-wider font-light">{settings.phone}</span>
          </a>
          <a href={`mailto:${settings.email}`} className="flex items-center gap-4 group">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5F0E8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#D4AF37] transition-colors">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span className="font-outfit text-base text-[#F5F0E8]/80 group-hover:text-[#D4AF37] transition-colors tracking-wider font-light">{settings.email}</span>
          </a>
        </div>
      )}

      <div className="text-center">
        <div className="flex flex-row items-center justify-center gap-4 mb-6">
          <DakiniLogo />
          <h3 className="font-cinzel text-xl md:text-2xl text-[#D4AF37]">{block.title2}</h3>
        </div>
        <div className="w-32 h-[2px] bg-[#8B1A1A] mx-auto mb-6" style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }}></div>
        <p className="font-outfit text-base text-[#F5F0E8]/80 font-light mb-10 max-w-xl mx-auto">
          {block.paiement_text}
        </p>
        <button type="submit" disabled={status === 'sending'} className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-sm px-10 py-4 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors duration-300 font-light disabled:opacity-50">
          {status === 'sending' ? "Envoi en cours..." : block.button_text}
        </button>
      </div>
    </form>
  );
}