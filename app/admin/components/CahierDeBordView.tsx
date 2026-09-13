"use client";
import { useState } from "react";

export default function CahierDeBordView({ setView }: any) {
  const [copied, setCopied] = useState(false);

  const cahierDeBordText = `### 📖 CAHIER DE BORD — ESPACE DAKINIS (CMS, CRM & COMPTA PROPRIÉTAIRES)

**1. OBJECTIF DU PROJET**
Création d'un site vitrine haut de gamme au design "Brutalisme Sacré" pour Alexandra (Espace Dakinis), doté d'un véritable écosystème propriétaire Back-Office. Il permet de gérer le site vitrine (CMS), la relation patient (CRM), la comptabilité analytique, la facturation, et l'importation de données Excel, le tout sans toucher au code.

**2. STACK TECHNIQUE**
*   **Framework :** Next.js 16 (App Router, React Server Components, Turbopack)
*   **Langage :** TypeScript
*   **Styling :** Tailwind CSS v4 (configuré via globals.css)
*   **Base de données & Authentification :** Supabase (PostgreSQL)
*   **Stockage Médias :** Supabase Storage (Buckets publics : 'medias', 'client-files')
*   **Polices :** Cormorant Garamond / Cinzel (Titres), Montserrat / Outfit (Textes)
*   **Librairies tierces :** xlsx (SheetJS) pour la lecture des fichiers Excel, @supabase/supabase-js pour le client serveur.

**3. ARCHITECTURE DU SITE (Next.js)**
*   app/layout.tsx : Récupère dynamiquement les pages dans Supabase pour construire le menu du Header. Inclut le Header, le Footer et le composant ScrollToTop.
*   app/page.tsx : Route d'accueil dynamique.
*   app/[...slug]/page.tsx : Route dynamique "attrape-tout" qui génère toutes les pages du site en lisant la base de données.
*   app/urban-dakinis/page.tsx : Route spécifique pour la boutique (gère un fond d'écran personnalisé).
*   app/components/PageRenderer.tsx : Le "moteur de rendu". Il lit le tableau JSON des blocs d'une page et affiche le composant correspondant (Texte, Image, Liste, Grille de Produits, Hero, Contact, etc.).
*   app/components/Header.tsx & Footer.tsx : Navigation dynamique.
*   app/lib/supabase.ts : Client Supabase côté navigateur (clé anon).

**4. ARCHITECTURE DU BACK-OFFICE (Admin)**
*   app/admin/page.tsx : Le Back-Office complet (Client Component). Gère l'authentification, la liste des pages, l'éditeur de blocs visuel, la médiathèque, les paramètres globaux, et toute la gestion d'état du CRM/Compta. Utilise Promise.all pour optimiser les temps de chargement des fiches patients.
*   app/admin/components/ : Contient toutes les vues du tableau de bord :
    *   DashboardView.tsx, PagesListView.tsx, PageEditorView.tsx, MediasListView.tsx, SettingsView.tsx, CahierDeBordView.tsx.
    *   CRM : ClientsListView.tsx (liste, création, import Excel), ClientDetailView.tsx (fiche patient, notes, communications, fichiers).
    *   Compta/Facturation : ClientAccountingView.tsx (compta du patient), AccountingDashboardView.tsx (compta générale avec drill-down Année/Mois/Jour et statistiques), InvoiceModal.tsx (génération de facture PDF avec aperçu WYSIWYG).

**5. ARCHITECTURE DES API ROUTES (Serveur Next.js)**
*   app/api/import-clients/route.ts : Route POST dédiée à l'importation de gros fichiers Excel. Le navigateur lit le fichier et envoie les données JSON à cette route. Le serveur utilise la SUPABASE_SERVICE_ROLE_KEY (clé secrète admin) pour insérer les patients et la comptabilité en masse sans être bloqué par les sécurités réseau (RLS) ou de saturation du navigateur (erreurs "Failed to fetch").

**6. ARCHITECTURE DE LA BASE DE DONNÉES (Supabase)**
*   **Tables CMS :** 
    *   pages : id, slug, title, seo_description, content (JSONB), status, order_index, background, subtitle.
    *   medias : id, url, name, alt_text.
    *   settings : id, site_name, phone, email, invoice_counter (compteur pour les factures).
*   **Tables CRM :**
    *   clients : id, nom_prenom, telephone, email, adresse, origin_id, raison_consultation, date_rdv, source, archived, created_at.
    *   origins : id, name (ex: Dr XXX, Planity, Réseau...).
    *   consultation_types : id, name (ex: Soin Ku Nyé, Consultation esprit...).
    *   consultations : id, client_id, notes, created_at.
    *   client_communications : id, client_id, type (email, call, sms), content, created_at.
    *   client_files : id, client_id, file_url, file_name.
*   **Tables Comptabilité & Facturation :**
    *   accounting_entries : id, client_id, entry_date, amount, payment_method (Espèces, Chèque, Virement, Carte), session_count, consultation_type_id.
    *   invoices : id, client_id, invoice_number (ex: FACT-2024-360), content (JSONB).

**7. LE SYSTÈME DE BLOCS (CMS Front-end)**
L'éditeur de pages permet de créer et réorganiser les blocs suivants : home_hero, intro/paragraph, text_image, image_standalone, heading_with_logo, products_grid, contact_main, disclaimer, buttons, separator.

**8. FONCTIONNALITÉS CLÉS DU BACK-OFFICE**
*   Import Excel Avancé : Bouton d'import qui lit un fichier .xlsx (Nom, Prénom, Adresse, Origine, Tel, et colonnes Mois de Janvier à Juillet). Création automatique des fiches patients, des origines si elles n'existent pas, et des lignes comptables (détection auto "Virement" si cellule contient "vir", sinon "Chèque").
*   Reset Base : Bouton de réinitialisation qui vide d'un clic toutes les tables CRM et Comptabilité pour repartir d'une base saine.
*   Statistiques Comptables : Vue drill-down (Année -> Mois -> Jour) et tableaux croisés dynamiques en bas de page affichant le CA mensuel par Origine et par Type de Consultation, avec sélecteur d'année.
*   Facturation : Génération de factures avec prévisualisation directe sur le navigateur (modifiable avant impression), incrémentation automatique du numéro de facture, et impression via window.print() avec CSS d'isolation.

**9. SÉCURITÉ & VARIABLES D'ENVIRONNEMENT (.env.local)**
*   NEXT_PUBLIC_SUPABASE_URL : URL du projet Supabase.
*   NEXT_PUBLIC_SUPABASE_ANON_KEY (ou publishable key) : Clé publique côté navigateur.
*   SUPABASE_SERVICE_ROLE_KEY (ou secret key) : Clé secrète admin utilisée uniquement dans app/api/import-clients/route.ts pour bypasser la RLS lors de l'import en masse. Ne doit jamais être exposée côté client.

**10. CAHIER DES CHARGES À VENIR (Roadmap)**
*   Phase 6 (SEO & Métadonnées) : Créer un sitemap.xml dynamique, gérer les balises Open Graph, et structurer les données (Schema.org).
*   Phase 7 (Formulaires & Emails) : Connecter le formulaire de contact (contact_main) à un service d'envoi d'emails (ex: Resend).
*   Phase 8 (Déploiement) : Créer un compte GitHub et Vercel, pousser le code en ligne, connecter la base de données Supabase en production, et lier le nom de domaine officiel d'Alexandra. Attention à bien ajouter les variables d'environnement (notamment la Service Role Key) sur Vercel.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cahierDeBordText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="font-cinzel text-2xl md:text-3xl text-[#D4AF37]">Cahier de Bord Technique</h2>
        <div className="w-24 h-[2px] bg-[#8B1A1A] mx-auto mt-4" style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }}></div>
        <p className="mt-6 text-sm text-[#F5F0E8]/60 font-outfit">Copie-colle ce texte dans un nouveau chat pour redonner le contexte du projet à l'IA.</p>
      </div>
      <div className="border border-[#8B1A1A] bg-[#8B1A1A]/30 backdrop-blur-md shadow-2xl p-8">
        <div className="text-center mb-8">
          <button onClick={handleCopy} className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-sm px-8 py-3 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors duration-300 font-light">
            {copied ? "✓ Copié !" : "Copier le texte"}
          </button>
        </div>
        <pre className="text-xs md:text-sm text-[#F5F0E8]/90 font-outfit whitespace-pre-wrap bg-black/30 p-6 rounded-sm max-h-[60vh] overflow-y-auto">
{cahierDeBordText}
        </pre>
      </div>
      <div className="text-center mt-10">
        <button onClick={() => setView("dashboard")} className="bg-transparent border border-[#F5F0E8] text-[#F5F0E8] font-outfit uppercase tracking-widest text-sm px-8 py-4 hover:bg-[#F5F0E8] hover:text-[#191970] transition-colors duration-300 font-light">
          Retour
        </button>
      </div>
    </div>
  );
}