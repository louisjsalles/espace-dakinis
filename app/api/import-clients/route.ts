import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { rows, origins } = await req.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // ATTENTION : Il faut cette variable dans ton fichier .env.local
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Configuration serveur manquante (SUPABASE_SERVICE_ROLE_KEY dans .env.local)." },
        { status: 500 }
      );
    }

    // Client Supabase avec la clé "Service Role" (bypass RLS, 100% de droits, pas de limite réseau)
    const supabase = createClient(supabaseUrl, supabaseKey);

    let clientCount = 0;
    let entryCount = 0;
    let errorCount = 0;

    const currentYear = new Date().getFullYear();
    const monthCols = [
      { index: 5, month: 0 }, { index: 6, month: 1 }, { index: 7, month: 2 },
      { index: 8, month: 3 }, { index: 9, month: 4 }, { index: 10, month: 5 }, { index: 11, month: 6 }
    ];

    for (const row of rows) {
      const nom = String(row[0] || '').trim();
      const prenom = String(row[1] || '').trim();
      const nom_prenom = `${nom} ${prenom}`.trim();

      if (!nom_prenom) continue;

      const adresse = String(row[2] || '').trim();
      const origineText = String(row[3] || '').trim();
      const telephone = String(row[4] || '').trim();

      let origin_id = null;
      if (origineText) {
        let originMatch = origins.find((o: any) => o.name.toLowerCase() === origineText.toLowerCase());
        if (!originMatch) {
          const { data: newOrigin } = await supabase.from('origins').insert({ name: origineText }).select().single();
          if (newOrigin) {
            originMatch = newOrigin;
            origins.push(newOrigin);
          }
        }
        if (originMatch) origin_id = originMatch.id;
      }

      // 1. Insérer le client
      const { data: newClient, error: clientErr } = await supabase
        .from('clients')
        .insert({ nom_prenom, adresse, telephone, origin_id, source: 'import_excel' })
        .select()
        .single();

      if (clientErr || !newClient) {
        console.error("Server: Erreur client", nom_prenom, clientErr?.message);
        errorCount++;
        continue;
      }

      clientCount++;

      // 2. Insérer la compta
      const entriesToInsert = [];
      for (const mc of monthCols) {
        const cellValue = row[mc.index];
        if (cellValue !== null && cellValue !== undefined && String(cellValue).trim() !== '') {
          const strVal = String(cellValue).trim().toLowerCase();
          const isVir = strVal.includes('vir');
          const paymentMethod = isVir ? 'Virement' : 'Chèque';
          const numStr = strVal.replace(/[^0-9.,-]/g, '').replace(',', '.');
          const amount = parseFloat(numStr);

          if (!isNaN(amount) && amount > 0) {
            const entryDate = `${currentYear}-${String(mc.month + 1).padStart(2, '0')}-15`;
            entriesToInsert.push({
              client_id: newClient.id,
              entry_date: entryDate,
              amount: amount,
              payment_method: paymentMethod,
              session_count: 1
            });
          }
        }
      }

      if (entriesToInsert.length > 0) {
        const { error: accErr } = await supabase.from('accounting_entries').insert(entriesToInsert);
        if (accErr) {
          console.error("Server: Erreur compta", nom_prenom, accErr.message);
        } else {
          entryCount += entriesToInsert.length;
        }
      }
    }

    return NextResponse.json({ clientCount, entryCount, errorCount });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}