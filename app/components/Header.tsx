"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header({ espaces, mainPages }: { espaces: { slug: string, title: string }[], mainPages: { slug: string, title: string }[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Barre de navigation principale */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#191970]/90 backdrop-blur-sm border-b border-[#D4AF37]/20">
        <div className="flex items-center justify-between p-6">
          
          <Link href="/" className="flex items-center gap-3 group">
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="50,90 90,20 10,20" fill="#8B1A1A" />
              <line x1="50" y1="10" x2="50" y2="100" stroke="#D4AF37" strokeWidth="3" />
              <circle cx="50" cy="55" r="15" fill="#2C2C2C" />
            </svg>
            <span className="font-cinzel text-xl tracking-[0.2em] text-[#D4AF37] font-light">
              ESPACE DAKINIS
            </span>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex space-x-8 items-center">
            
            <Link href="/" className="font-grotesk text-sm uppercase tracking-wider text-[#F5F0E8] hover:text-[#F5F0E8] relative group">
              Accueil
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#8B1A1A] group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* MENU DÉROULANT POUR LES ESPACES */}
            {espaces.length > 0 && (
              <div className="relative group">
                <button className="font-grotesk text-sm uppercase tracking-wider text-[#F5F0E8] focus:outline-none">
                  Les Espaces
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#8B1A1A] group-hover:w-full transition-all duration-300"></span>
                </button>
                
                <div className="absolute left-0 top-full mt-2 w-56 bg-[#191970] border border-[#D4AF37]/20 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 z-50 shadow-2xl">
                  {espaces.map((espace) => (
                    <Link key={espace.slug} href={`/${espace.slug}`} className="block px-4 py-3 text-[#F5F0E8] hover:bg-[#8B1A1A] font-grotesk text-sm uppercase tracking-wider border-t border-[#D4AF37]/10 first:border-t-0">
                      {espace.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* PAGES PRINCIPALES DYNAMIQUES (en blanc écru) */}
            {mainPages.map((page) => (
              <Link key={page.slug} href={`/${page.slug}`} className="font-grotesk text-sm uppercase tracking-wider text-[#F5F0E8] relative group">
                {page.title}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#8B1A1A] group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}

            {/* PAGES CODÉES EN DUR (Arts de l'Esprit et Urban Dakinis) */}
            <Link href="/arts-esprit" className="font-grotesk text-sm uppercase tracking-wider text-[#F5F0E8] relative group">
              Arts de l&apos;Esprit
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#8B1A1A] group-hover:w-full transition-all duration-300"></span>
            </Link>

            <Link href="/urban-dakinis" className="font-grotesk text-sm uppercase tracking-wider text-[#F5F0E8] relative group">
              Urban Dakinis
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#8B1A1A] group-hover:w-full transition-all duration-300"></span>
            </Link>

            <Link href="/contact" className="font-grotesk text-sm uppercase tracking-wider text-[#F5F0E8] relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#8B1A1A] group-hover:w-full transition-all duration-300"></span>
            </Link>

          </nav>

          {/* Bouton Hamburger Mobile */}
          <button 
            className="md:hidden flex flex-col space-y-1.5 z-50"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            <span className={`block w-8 h-0.5 bg-[#F5F0E8] transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`block w-8 h-0.5 bg-[#F5F0E8] transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}></span>
            <span className={`block w-8 h-0.5 bg-[#F5F0E8] transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </button>
        </div>
      </header>

      {/* Menu Plein Écran Mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#191970] z-40 flex flex-col items-center justify-center space-y-6 overflow-y-auto py-12">
          
          <Link href="/" onClick={() => setIsOpen(false)} className="font-cinzel text-2xl text-[#D4AF37] hover:text-[#8B1A1A] transition-colors">
            Accueil
          </Link>

          {espaces.length > 0 && (
            <div className="flex flex-col items-center space-y-3">
              <span className="font-cinzel text-2xl text-[#D4AF37]">Les Espaces</span>
              {espaces.map((espace) => (
                <Link key={espace.slug} href={`/${espace.slug}`} onClick={() => setIsOpen(false)} className="font-grotesk text-lg text-[#F5F0E8]/80 hover:text-[#8B1A1A] transition-colors">
                  {espace.title}
                </Link>
              ))}
            </div>
          )}

          {/* Pages dynamiques sur mobile (en blanc écru, pas en jaune) */}
          {mainPages.map((page) => (
            <Link key={page.slug} href={`/${page.slug}`} onClick={() => setIsOpen(false)} className="font-cinzel text-2xl text-[#D4AF37] hover:text-[#8B1A1A] transition-colors">
              {page.title}
            </Link>
          ))}

          {/* Pages en dur sur mobile */}
          <Link href="/arts-esprit" onClick={() => setIsOpen(false)} className="font-cinzel text-2xl text-[#D4AF37] hover:text-[#8B1A1A] transition-colors">
            Arts de l&apos;Esprit
          </Link>
          <Link href="/urban-dakinis" onClick={() => setIsOpen(false)} className="font-cinzel text-2xl text-[#D4AF37] hover:text-[#8B1A1A] transition-colors">
            Urban Dakinis
          </Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className="font-cinzel text-2xl text-[#D4AF37] hover:text-[#8B1A1A] transition-colors">
            Contact
          </Link>

        </div>
      )}
    </>
  );
}