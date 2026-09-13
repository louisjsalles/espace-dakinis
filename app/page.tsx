import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen text-[#F5F0E8]">
      
      {/* L'image de fond globale fixe */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center" 
        style={{ backgroundImage: "url('/fond-nuit.png')" }}
      ></div>
      {/* Voile sombre très léger pour garder le texte lisible */}
      <div className="fixed inset-0 z-0 bg-black/40"></div>

      {/* Contenu de la page qui flotte par-dessus */}
      <div className="relative z-10">

        {/* ========================================= */}
        {/* BLOC 1 : HERO (Espace Dakinis + Statue) */}
        {/* ========================================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-80px)] md:mt-20 items-center gap-8 p-8 md:p-16">
          
          {/* Côté Gauche : Texte en Blanc pur */}
          <div className="flex flex-col justify-center md:items-start items-center text-center md:text-left">
            <h1 className="font-cinzel text-6xl md:text-8xl font-medium text-white tracking-wide leading-none mb-4">
              Espace <br/> <span className="text-[#D4AF37]">DAKINIS</span>
            </h1>
            <p className="font-outfit text-sm md:text-base text-white/80 tracking-[0.3em] uppercase mt-6 mb-8 font-light">
              Accompagnement à la transformation et à l&apos;éveil
            </p>
            
            <div className="w-32 h-[2px] bg-[#8B1A1A] mb-8 mx-auto md:mx-0" style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }}></div>

            <p className="font-outfit text-base text-white/90 max-w-md leading-relaxed font-light">
              Un espace de confrontation, de dépouillement et de transformation radicale pour celles et ceux qui sont prêts à affronter leur ombre.
            </p>

            <Link href="/espaces/voir-clairement" className="mt-10 bg-[#8B1A1A] text-white font-outfit uppercase tracking-widest text-sm px-8 py-4 hover:bg-white hover:text-[#191970] transition-colors duration-300 font-light">
              Découvrir les Espaces
            </Link>
          </div>

          {/* Côté Droit : La photo de la statue flottante */}
          <div className="w-full h-[60vh] md:h-[90vh] flex items-center justify-center">
            <img 
              src="/dakini-or.png" 
              alt="Statue dorée de Dakini" 
              className="max-h-full w-auto object-contain drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)] scale-110"
            />
          </div>
        </section>

        {/* ========================================= */}
        {/* BLOC 2 : MANIFESTE (Parchemin 60% + Texte et Titre Blancs) */}
        {/* ========================================= */}
        <section className="py-40 px-6 text-center">
          <div className="max-w-3xl mx-auto border border-[#D4AF37]/30 relative shadow-2xl overflow-hidden">
            {/* 1. Image Parchemin (encore plus transparente : 60%) */}
            <div className="absolute inset-0 z-0 bg-cover bg-center opacity-60" style={{ backgroundImage: "url('/parchemin.png')" }}></div>
            {/* 2. Filttre Or (mix-blend-mode pour teinter le parchemin) */}
            <div className="absolute inset-0 z-0 bg-[#D4AF37]/40 mix-blend-overlay"></div>
            {/* 3. Voile sombre très léger (20%) pour la lisibilité */}
            <div className="absolute inset-0 z-0 bg-black/20"></div>
            
            <div className="relative z-10 p-12 md:p-16">
              {/* Titre en Blanc pur */}
              <h2 className="font-cinzel text-4xl md:text-6xl font-light text-white italic mb-10">
                Voir clairement, <br/> Aimer vraiment.
              </h2>
              <div className="w-32 h-[2px] bg-[#8B1A1A] mx-auto mb-10" style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }}></div>
              <p className="font-outfit text-lg text-white leading-loose font-light">
                Ces mots ne sont pas un slogan. Ils sont l’injonction intime que j&apos;ai reçue au cœur d&apos;une nuit. <br/>
                &quot;Voir clairement&quot;, c&apos;est l&apos;épée qui tranche l&apos;illusion. <br/>
                &quot;Aimer vraiment&quot;, c&apos;est le feu qui ose embrasser nos blessures.
                <br/><br/>
                <span className="text-white">Bienvenue dans l&apos;Espace Dakinis.</span>
              </p>
            </div>
          </div>
        </section>

        {/* ========================================= */}
        {/* BLOC 3 : RÉHABILITER LA DAKINI (Texte + Photo) */}
        {/* ========================================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 p-8 md:p-16 mb-20">
          
          <div className="w-full h-[50vh] md:h-[70vh] border border-[#D4AF37]/30 p-2 shadow-2xl order-2 md:order-1">
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/danse.png')" }}></div>
          </div>

          <div className="flex flex-col justify-center md:items-start items-center text-center md:text-left order-1 md:order-2">
            <h3 className="font-cinzel text-3xl md:text-5xl font-medium text-[#D4AF37] mb-8">
              Réhabiliter la Dakini
            </h3>
            <div className="w-32 h-[2px] bg-[#8B1A1A] mb-8 mx-auto md:mx-0" style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }}></div>
            <p className="font-outfit text-base md:text-lg text-[#F5F0E8]/80 leading-loose font-light max-w-lg">
              Dans les traditions de sagesse de l&apos;Himalaya, la Dakini n&apos;est pas une fée bienveillante qui caresse les égos. Elle est l&apos;énergie féroce de l&apos;éveil. Celle qui danse au cœur du bûcher, qui coupe les attachements et révèle la nudité de notre esprit.
              <br/><br/>
              L&apos;urgence n&apos;est pas d&apos;inverser la polarité pour opposer un matriarcat à un patriarcat — la Dakini se moque des guerres de genre, elle transcende la dualité. L&apos;urgence est de rétablir l&apos;équilibre brisé : réinsuffler l&apos;intuition, la chair, le rythme et la vacuité au cœur d&apos;une quête de sens trop souvent coupée de sa sève instinctive.
              <br/><br/>
              Ici, L’espace Dakinis ne transmet pas une religion. Il ouvre l’espace à un état.
            </p>
          </div>
        </section>

        {/* ========================================= */}
        {/* BLOC 4 : LES 3 ESPACES (Flouté Rouge Permanent) */}
        {/* ========================================= */}
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="font-cinzel text-4xl md:text-5xl font-medium text-[#F5F0E8] mb-4">Les 3 Espaces</h2>
            <div className="w-32 h-[2px] bg-[#8B1A1A] mx-auto mb-20" style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }}></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
              
              <Link href="/espaces/voir-clairement" className="group block p-10 border-t-2 border-[#8B1A1A] bg-[#8B1A1A]/50 backdrop-blur-md hover:bg-[#8B1A1A]/70 transition-colors duration-500">
                <h3 className="font-cinzel text-2xl mb-4 text-[#D4AF37] transition-colors">Espace 1 — Voir Clairement</h3>
                <p className="font-outfit text-sm text-[#F5F0E8]/70 font-light mb-4 italic">Identifier la géographie de vos conditionnements, pour en sortir.</p>
                <p className="font-outfit text-sm text-[#F5F0E8]/60 font-light">
                  Le Jyotish (astrologie védique) et le Tarot sont des cartes de navigation archétypales : elles révèlent vos schémas de répétition et vos cycles de temps. La Chirurgie du Subconscient est l'épée qui tranche la racine : en état de conscience modifiée, elle recode le conditionnement à l’origine. De la lucidité à la libération.
                </p>
                <p className="font-outfit text-sm text-[#D4AF37] font-light mt-4">➡️ Consultation existentielle, symbolique et stratégique.</p>
              </Link>

              <Link href="/espaces/aimer-vraiment" className="group block p-10 border-t-2 border-[#8B1A1A] bg-[#8B1A1A]/50 backdrop-blur-md hover:bg-[#8B1A1A]/70 transition-colors duration-500">
                <h3 className="font-cinzel text-2xl mb-4 text-[#D4AF37] transition-colors">Espace 2 — Aimer Vraiment</h3>
                <p className="font-outfit text-sm text-[#F5F0E8]/70 font-light mb-4 italic">Préparer le corps et l'espace pour soutenir la vue.</p>
                <p className="font-outfit text-sm text-[#F5F0E8]/60 font-light">
                  Les protocoles de santé traditionnelle tibétaine (Ku Nyé, Hormé) et la géomancie (Feng Shui) ne sont pas des médecines de substitution. Ce sont des arts de l'hygiène vitale : apaiser le système nerveux pour soutenir la contemplation, et aligner l'habitat pour soutenir le destin.
                </p>
                <p className="font-outfit text-sm text-[#D4AF37] font-light mt-4">➡️ Pratiques de bien-être et d'harmonisation environnementale.</p>
              </Link>

              <Link href="/espaces/exploration-esprit" className="group block p-10 border-t-2 border-[#8B1A1A] bg-[#8B1A1A]/50 backdrop-blur-md hover:bg-[#8B1A1A]/70 transition-colors duration-500">
                <h3 className="font-cinzel text-2xl mb-4 text-[#D4AF37] transition-colors">Espace 3 — Exploration de l'Esprit</h3>
                <p className="font-outfit text-sm text-[#F5F0E8]/70 font-light mb-4 italic">Pour celles et ceux dont la psyché est stable et qui veulent aller au-delà de l'intellect.</p>
                <p className="font-outfit text-sm text-[#F5F0E8]/60 font-light">
                  Travail sur les rêves lucides, états hypnagogiques et approches contemplatives inspirées des traditions de sagesse.
                </p>
                <p className="font-outfit text-sm text-[#D4AF37] font-light mt-4">➡️ Entraînement méditatif et philosophique.</p>
              </Link>

            </div>
          </div>
        </section>

        {/* ========================================= */}
        {/* BLOC 5 : QUI SUIS-JE (Centré) */}
        {/* ========================================= */}
        <section className="py-32 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-cinzel text-3xl md:text-4xl font-medium text-[#D4AF37] mb-4">Qui suis-je pour vous accompagner ?</h2>
            <div className="w-32 h-[2px] bg-[#8B1A1A] mx-auto mb-10" style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }}></div>
            
            <div className="font-outfit text-base md:text-lg text-[#F5F0E8]/80 leading-loose font-light space-y-6 text-justify">
              <p>
                Depuis l'enfance, je navigue dans les états non ordinaires de conscience. J'ai d'abord cherché des réponses dans l'ésotérisme, avant que la tradition vivante ne me réclame. J'ai pris Refuge dans le bouddhisme tibétain (Vajrayana et Dzogchen). J'y ai étudié la philosophie (Shédra) et les fondements de la santé tibétaine (Sowa Rigpa) pendant des années. J'ai vécu des expériences directes et l'incandescence de l'énergie sous le regard de mes Maîtres — des états aperçus, traversés, mais que je n'ai pas la prétention d'avoir stabilisés ou domptés.
              </p>
              <p>
                Mais je n'ai pas choisi la voie du retrait. J'ai choisi le monde. Assistante sociale à l'ASE, face à la violence réelle faite aux femmes et aux enfants, j'ai traversé le burn-out, l'effondrement et la renaissance. Aujourd'hui, comédienne engagée et créatrice d’Urban Dakinis, je connais la boue de la condition humaine et c’est à partir de là que j’œuvre à enraciner ma vue.
              </p>
              <p>
                Je ne suis pas un maître détenteur de sagesse. Je suis une femme qui marche, assume ses propres failles et poli sa pierre. Mon état d'être est l'espace que je vous tends. La traversée, elle, vous appartient.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Link href="/espaces/voir-clairement" className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-sm px-8 py-4 hover:bg-[#F5F0E8] hover:text-[#191970] transition-colors duration-300 font-light text-center">
                Découvrir les Espaces
              </Link>
              <Link href="/arts-esprit" className="bg-transparent border border-[#F5F0E8] text-[#F5F0E8] font-outfit uppercase tracking-widest text-sm px-8 py-4 hover:bg-[#F5F0E8] hover:text-[#191970] transition-colors duration-300 font-light text-center">
                Arts de l’Esprit
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================= */}
        {/* BLOC 6 : L'APPEL (Parchemin 60% + Texte et Titre Blancs) */}
        {/* ========================================= */}
        <section className="py-40 px-6 text-center">
          <div className="max-w-3xl mx-auto border border-[#D4AF37]/30 relative shadow-2xl overflow-hidden">
            {/* 1. Image Parchemin (encore plus transparente : 60%) */}
            <div className="absolute inset-0 z-0 bg-cover bg-center opacity-60" style={{ backgroundImage: "url('/parchemin.png')" }}></div>
            {/* 2. Filttre Or (mix-blend-mode pour teinter le parchemin) */}
            <div className="absolute inset-0 z-0 bg-[#D4AF37]/40 mix-blend-overlay"></div>
            {/* 3. Voile sombre très léger (20%) pour la lisibilité */}
            <div className="absolute inset-0 z-0 bg-black/20"></div>

            <div className="relative z-10 p-12 md:p-16">
              {/* Titre en Blanc pur */}
              <h2 className="font-cinzel text-4xl md:text-5xl font-light text-white italic mb-10">L&apos;Appel</h2>
              <div className="w-32 h-[2px] bg-[#8B1A1A] mx-auto mb-10" style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }}></div>
              <p className="font-outfit text-base md:text-lg text-white leading-loose font-light">
                Si vous êtes prêt à cesser de fuir, à déposer les masques, à regarder votre réalité en face et à rencontrer vos zones d&apos;ombre, alors l’Espace Dakinis sera là pour vous accompagner dans votre traversée.
                <br/><br/>
                Voir clairement et aimer vraiment n&apos;est pas une promesse que quelqu’un peut tenir pour vous. C&apos;est un chemin que vous êtes invité à emprunter. Entrez.
              </p>

              <div className="flex flex-col md:flex-row gap-4 justify-center mt-12">
                <Link href="/espaces/voir-clairement" className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-sm px-8 py-4 hover:bg-[#F5F0E8] hover:text-[#191970] transition-colors duration-300 font-light text-center">
                  Découvrir les Espaces
                </Link>
                <Link href="/urban-dakinis" className="bg-transparent border border-[#F5F0E8] text-[#F5F0E8] font-outfit uppercase tracking-widest text-sm px-8 py-4 hover:bg-[#F5F0E8] hover:text-[#191970] transition-colors duration-300 font-light text-center">
                  Découvrir Urban Dakinis
                </Link>
                <Link href="/arts-esprit" className="bg-transparent border border-[#F5F0E8] text-[#F5F0E8] font-outfit uppercase tracking-widest text-sm px-8 py-4 hover:bg-[#F5F0E8] hover:text-[#191970] transition-colors duration-300 font-light text-center">
                  Arts de l’Esprit
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
} 