import Link from "next/link";

export default function Footer() {
  return (
    <footer 
      className="relative z-20 text-[#2C2C2C] bg-cover bg-center" 
      style={{ backgroundImage: "url('/lotus.png')" }}
    >
      {/* Voile d'or (80% d'opacité) pour atténuer l'image de fond et garantir la lisibilité */}
      <div className="absolute inset-0 bg-[#D4AF37]/80 z-0"></div>

      {/* Contenu par-dessus le voile (z-10) */}
      <div className="relative z-10 flex items-center justify-between p-6">
        
        {/* Bloc Gauche : Logo + Nom, et Slogan aligné en dessous */}
        <div className="flex flex-col">
          <Link href="/" className="flex items-center gap-3 group">
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Triangle inversé - Rouge Sang */}
              <polygon points="50,90 90,20 10,20" fill="#8B1A1A" />
              {/* Épée - Noir Charbon */}
              <line x1="50" y1="10" x2="50" y2="100" stroke="#2C2C2C" strokeWidth="3" />
              {/* Cercle central - Noir Charbon */}
              <circle cx="50" cy="55" r="15" fill="#2C2C2C" />
            </svg>
            <span className="font-cinzel text-xl tracking-[0.2em] text-[#2C2C2C] font-light">
              ESPACE DAKINIS
            </span>
          </Link>
          {/* Slogan aligné précisément sous le texte (décalage de 44px = logo + espace) */}
          <p className="font-cinzel text-sm text-[#2C2C2C]/80 italic mt-1 pl-[44px]">
            Voir clairement, Aimer vraiment.
          </p>
        </div>

        {/* Bloc Droite : Liens (Décalés avec md:mr-16 pour éviter l'ascenseur) */}
        <div className="hidden md:flex flex-row space-y-4 md:space-y-0 md:space-x-8 text-center items-center md:mr-16">
          <Link href="/contact" className="font-outfit text-sm uppercase tracking-wider hover:text-[#8B1A1A] transition-colors font-light">
            Contact & Éthique
          </Link>
          <Link href="/mentions-legales" className="font-outfit text-sm uppercase tracking-wider hover:text-[#8B1A1A] transition-colors font-light">
            Mentions Légales
          </Link>
        </div>

      </div>
      
      {/* La barre rouge finale (également au-dessus du voile) */}
      <div className="relative z-10 bg-[#8B1A1A] h-[4px] w-full"></div>
    </footer>
  );
}