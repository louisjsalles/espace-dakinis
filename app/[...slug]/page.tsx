import { supabase } from '../lib/supabase';
import PageRenderer from '../components/PageRenderer';

export const dynamic = 'force-dynamic';

export default async function DynamicPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugArray } = await params;
  const slug = slugArray.join('/');

  const { data: page } = await supabase.from('pages').select('*').eq('slug', slug).eq('status', 'published').maybeSingle();

  let settings: any = null;
  if (slug === 'contact') {
    const { data: sData } = await supabase.from('settings').select('phone, email').eq('id', 1).single();
    settings = sData;
  }

  // On récupère aussi les espaces au cas où il y ait une grille d'espaces
  const { data: espaces } = await supabase.from('pages').select('slug, title, seo_description').like('slug', 'espaces/%');

  if (!page) {
    return (
      <main className="min-h-screen bg-[#191970] text-[#F5F0E8] flex flex-col items-center justify-center font-outfit text-xl p-8 text-center">
        <h1 className="font-cinzel text-3xl text-[#D4AF37] mb-4">Page non trouvée</h1>
      </main>
    );
  }

  return <PageRenderer page={page} espaces={espaces || []} settings={settings} />;
}