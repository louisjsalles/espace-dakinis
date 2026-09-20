"use client";
import { useState } from "react";

export default function CahierDeBordView({ setView }: any) {
  const [copied, setCopied] = useState(false);

  const cahierDeBordText = `### 📖 CAHIER DE BORD — ESPACE DAKINIS (CMS, CRM, COMPTA & FACTURATION PROPRIÉTAIRES)

**1. OBJECTIF DU PROJET**
Création d'un site vitrine haut de gamme au design "Brutalisme Sacré" pour Alexandra (Espace Dakinis), doté d'un véritable écosystème propriétaire Back-Office. Il permet de gérer le site vitrine (CMS), la relation patient (CRM), la comptabilité analytique, la facturation PDF, l'envoi d'emails via Gmail, et l'importation de données Excel, le tout sans toucher au code.

**2. STACK TECHNIQUE**
*   **Framework :** Next.js 16 (App Router, React Server Components, Turbopack)
*   **Langage :** TypeScript
*   **Styling :** Tailwind CSS v4 (configuré via globals.css)
*   **Base de données & Authentification :** Supabase (PostgreSQL) + Google OAuth
*   **Stockage Médias :** Supabase Storage (Buckets publics : 'medias', 'client-files')
*   **Polices :** Cormorant Garamond / Cinzel (Titres), Montserrat / Outfit (Textes)
*   **Librairies tierces :** xlsx (SheetJS) pour l'import Excel, nodemailer pour l'envoi d'emails, @supabase/supabase-js pour le client serveur.

**3. ARCHITECTURE DU SITE (Next.js)**
*   app/layout.tsx : Récupère dynamiquement les pages dans Supabase pour construire le menu du Header. Inclut le Header, le Footer et le composant ScrollToTop.
*   app/page.tsx : Route d'accueil dynamique.
*   app/[...slug]/page.tsx : Route dynamique "attrape-tout" qui génère toutes les pages du site en lisant la base de données.
*   app/urban-dakinis/page.tsx : Route spécifique pour la boutique (gère un fond d'écran personnalisé).
*   app/components/PageRenderer.tsx : Le "moteur de rendu". Il lit le tableau JSON des blocs d'une page et affiche le composant correspondant. Contient le composant ContactForm qui envoie les données à l'API Nodemailer. Les boutons de la grille produits (products_grid) sont dynamiques (vinted_button_text, contact_button_text).
*   app/components/Header.tsx & Footer.tsx : Navigation dynamique.
*   app/lib/supabase.ts : Client Supabase côté navigateur (clé anon).

**4. ARCHITECTURE DU BACK-OFFICE (Admin)**
*   app/admin/page.tsx : Le Back-Office complet (Client Component). Fond noir (#0A0A0A) avec image fond-nuit.png. Gère l'authentification Google/Email, la liste des pages, l'éditeur de blocs visuel, la médiathèque, les paramètres globaux, et toute la gestion d'état du CRM/Compta. Utilise Promise.all pour optimiser les temps de chargement des fiches patients. Tri des clients par ordre alphabétique (nom_prenom).
*   app/admin/components/ : Contient toutes les vues du tableau de bord :
    *   LoginForm.tsx : Fond sombre, formulaire email/mdp + bouton "Se connecter avec Google" (Supabase OAuth).
    *   DashboardView.tsx, PagesListView.tsx, MediasListView.tsx, SettingsView.tsx, CahierDeBordView.tsx.
    *   PageEditorView.tsx : Éditeur de blocs. Contient le sous-composant ButtonsEditor (qui gère un état local pour éviter le bug de la perte d'espaces). Les menus déroulants utilisent style={{ colorScheme: 'dark' }}.
    *   CRM : ClientsListView.tsx (liste, création, import Excel, export Excel, bouton réinitialiser BDD, compteur de patients), ClientDetailView.tsx (fiche patient, notes, communications, fichiers, listes déroulantes Origine/Consultation avec boutons +/-).
    *   Compta/Facturation : ClientAccountingView.tsx (compta du patient), AccountingDashboardView.tsx (compta générale avec drill-down Année/Mois/Jour, statistiques par Origine/Consultation, exports avancés par Année/Mois/Client), InvoiceModal.tsx (génération de facture PDF avec aperçu WYSIWYG, masquage automatique du footer du site pendant l'impression).

**5. ARCHITECTURE DES API ROUTES (Serveur Next.js)**
*   app/api/import-clients/route.ts : Route POST dédiée à l'importation de gros fichiers Excel. Le navigateur lit le fichier et envoie les données JSON à cette route. Le serveur utilise la SUPABASE_SERVICE_ROLE_KEY (clé secrète admin) pour insérer les patients et la comptabilité en masse sans être bloqué par les sécurités réseau (RLS) ou de saturation du navigateur (erreurs "Failed to fetch").
*   app/api/contact/route.ts : Route POST pour le formulaire de contact. Utilise nodemailer avec un mot de passe d'application Gmail (GMAIL_PASS) pour envoyer les messages du formulaire directement dans la boîte Gmail d'Alexandra (a.alexandradurand@gmail.com). L'expéditeur est paramétré sous le nom "Espace Dakinis". Le corps de l'email est formaté en HTML (Nom, Téléphone, Email, puis Message).

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
L'éditeur de pages permet de créer et réorganiser les blocs suivants : home_hero, intro/paragraph, text_image, image_standalone, heading_with_logo, products_grid (avec textes de boutons dynamiques), contact_main, disclaimer, buttons, separator.

**8. FONCTIONNALITÉS CLÉS DU BACK-OFFICE**
*   **Auth Google :** Connexion au back-office via OAuth Google (configuré dans Google Cloud Console + Supabase).
*   **Import Excel Avancé :** Bouton d'import qui lit un fichier .xlsx (Nom, Prénom, Adresse, Origine, Tel, et colonnes Mois Janvier à Juillet). Création automatique des fiches patients, des origines si elles n'existent pas, et des lignes comptables (détection auto "Virement" si cellule contient "vir", sinon "Chèque").
*   **Export Excel/CSV :** Export de la liste des patients (xlsx), et export comptable détaillé (par Année, par Mois, ou par Client).
*   **Reset Base :** Bouton de réinitialisation qui vide d'un clic toutes les tables CRM et Comptabilité pour repartir d'une base saine.
*   **Statistiques Comptables :** Vue drill-down (Année -> Mois -> Jour) et tableaux croisés dynamiques affichant le CA mensuel par Origine et par Type de Consultation, avec sélecteur d'année.
*   **Facturation :** Génération de factures avec prévisualisation directe sur le navigateur (modifiable avant impression), incrémentation automatique du numéro de facture, et impression via window.print().
*   **Emails :** Réception des emails du formulaire de contact sur l'adresse Gmail d'Alexandra via Nodemailer.

**9. SÉCURITÉ & VARIABLES D'ENVIRONNEMENT (.env.local & Vercel)**
*   NEXT_PUBLIC_SUPABASE_URL : URL du projet Supabase.
*   NEXT_PUBLIC_SUPABASE_ANON_KEY (ou publishable key) : Clé publique côté navigateur.
*   SUPABASE_SERVICE_ROLE_KEY (ou secret key) : Clé secrète admin utilisée uniquement dans app/api/import-clients/route.ts.
*   GMAIL_USER : Adresse Gmail d'Alexandra (a.alexandradurand@gmail.com).
*   GMAIL_PASS : Mot de passe d'application Gmail (16 caractères) utilisé dans app/api/contact/route.ts.

**10. DÉPLOIEMENT & INFRASTRUCTURE**
*   **Hébergement :** Vercel (Projet lié au dépôt GitHub https://github.com/louisjsalles/espace-dakinis.git).
*   **Nom de domaine principal :** espacedakinis.com (DNS chez IONOS : A record pointant vers 76.76.21.21, CNAME www pointant vers cname.vercel-dns.com).
*   **Noms de domaine secondaires :** hypnosetoulouse.fr et alexandradurand.fr (Redirections 307 vers espacedakinis.com configurées dans Vercel, DNS IONOS pointant vers Vercel).
*   **Configuration Supabase Auth :** URLs de redirection configurées pour http://localhost:3000/admin et https://espacedakinis.com/admin.
*   **Favicon :** Géré via le fichier app/icon.png (ou icon.svg). Si modifications, supprimer l'ancien fichier pour éviter le cache Next.js.`;

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