import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { supabase } from "./lib/supabase";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Espace Dakinis - Accompagnement à la transformation et à l'éveil",
  description: "L'Espace Dakinis n'est pas un site de bien-être classique. C'est un espace de confrontation, de dépouillement et de transformation radicale.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Pages pour le sous-menu "Les Espaces"
  const { data: espaces } = await supabase
    .from('pages')
    .select('slug, title')
    .eq('status', 'published')
    .like('slug', 'espaces/%');

  // Pages pour les onglets principaux (sans slash dans l'URL)
  const { data: mainPagesRaw } = await supabase
    .from('pages')
    .select('slug, title')
    .eq('status', 'published')
    .not('slug', 'like', '%/%');
  
  // On filtre manuellement pour enlever les pages qui sont déjà codées en dur dans le Header
  const mainPages = mainPagesRaw?.filter(page => !['mentions-legales', 'arts-esprit', 'contact', 'home', 'urban-dakinis'].includes(page.slug)) || [];

  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased flex flex-col min-h-screen bg-[#191970] text-[#F5F0E8]">
        <Header espaces={espaces || []} mainPages={mainPages} />
        <main className="flex-grow pt-20 md:pt-0">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}