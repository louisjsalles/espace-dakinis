"use client";
import { useState } from "react";

export default function AccountingDashboardView({ entries, clients, setView, onViewClient, onUpdateEntry, onDeleteEntry }: any) {
  const [drillLevel, setDrillLevel] = useState<"year" | "month" | "day">("year");
  const [drillYear, setDrillYear] = useState(new Date().getFullYear());
  const [drillMonth, setDrillMonth] = useState(0);
  const [drillDay, setDrillDay] = useState(0);
  
  const [statsYear, setStatsYear] = useState(new Date().getFullYear());
  
  // États pour les exports détaillés
  const [expYear, setExpYear] = useState(new Date().getFullYear());
  const [expMonth, setExpMonth] = useState(new Date().getMonth());
  const [expClientId, setExpClientId] = useState("");
  
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [editData, setEditData] = useState<any>({});

  const formatDateFr = (isoDate: string) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  const getClientName = (clientId: string) => {
    const c = clients?.find((cl: any) => cl.id === clientId);
    if (!c) return "Inconnu";
    return `${c.prenom || ''} ${c.nom || ''}`.trim() || c.nom_prenom || "Inconnu";
  };

  const getClientOrigin = (clientId: string) => {
    const c = clients?.find((cl: any) => cl.id === clientId);
    return c?.origins?.name || c?.source || "N/A";
  };

  const getMonthEntries = (month: number, year: number) => {
    return (entries || []).filter((e: any) => {
      const d = new Date(e.entry_date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
  };

  const getYearEntries = (year: number) => {
    return (entries || []).filter((e: any) => new Date(e.entry_date).getFullYear() === year);
  };

  const getDayEntries = (day: number, month: number, year: number) => {
    return (entries || []).filter((e: any) => {
      const d = new Date(e.entry_date);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  const calcTotals = (entryList: any[]) => {
    const total = entryList.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const sessions = entryList.reduce((sum, e) => sum + (e.session_count || 0), 0);
    const byMethod: any = { 'Espèces': 0, 'Chèque': 0, 'Virement': 0, 'Carte': 0 };
    entryList.forEach(e => {
      const method = e.payment_method || 'Espèces';
      if (byMethod.hasOwnProperty(method)) byMethod[method] += parseFloat(e.amount || 0);
      else byMethod['Espèces'] += parseFloat(e.amount || 0);
    });
    return { total, sessions, byMethod };
  };

  const exportToCSV = (entryList: any[], filename: string) => {
    let csvContent = "Date;Patient;Séances;Montant;Paiement;Origine\n";
    entryList.forEach((entry: any) => {
      const date = formatDateFr(entry.entry_date);
      const name = getClientName(entry.client_id).replace(/;/g, ',');
      const sessions = entry.session_count;
      const amount = parseFloat(entry.amount).toFixed(2);
      const payment = entry.payment_method;
      const origin = getClientOrigin(entry.client_id).replace(/;/g, ',');
      csvContent += `${date};${name};${sessions};${amount};${payment};${origin}\n`;
    });
    const totals = calcTotals(entryList);
    csvContent += `\nTOTAL;;${totals.sessions};${totals.total.toFixed(2)};;\n`;
    csvContent += `Espèces;;;${totals.byMethod['Espèces'].toFixed(2)};;\n`;
    csvContent += `Chèque;;;${totals.byMethod['Chèque'].toFixed(2)};;\n`;
    csvContent += `Virement;;;${totals.byMethod['Virement'].toFixed(2)};;\n`;
    csvContent += `Carte;;;${totals.byMethod['Carte'].toFixed(2)};;\n`;

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename + ".csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthEntries = getMonthEntries(currentMonth, currentYear);
  const currentMonthTotals = calcTotals(currentMonthEntries);

  const yearEntries = getYearEntries(currentYear);
  const yearTotals = calcTotals(yearEntries);

  const availableYears: number[] = Array.from(new Set((entries || []).map((e: any) => new Date(e.entry_date).getFullYear())));
  availableYears.sort((a: number, b: number) => b - a);
  if (availableYears.length === 0) availableYears.push(currentYear);

  const yearViewData = monthNames.map((name, i) => {
    const mEntries = getMonthEntries(i, drillYear);
    const totals = calcTotals(mEntries);
    return { name, index: i, ...totals, hasData: mEntries.length > 0 };
  });

  const monthViewData: any[] = [];
  if (drillLevel === "month") {
    const uniqueDays: number[] = Array.from(new Set(getMonthEntries(drillMonth, drillYear).map((e: any) => new Date(e.entry_date).getDate())));
    uniqueDays.sort((a: number, b: number) => a - b);
    uniqueDays.forEach((day: number) => {
      const dEntries = getDayEntries(day, drillMonth, drillYear);
      const totals = calcTotals(dEntries);
      monthViewData.push({ day, ...totals });
    });
  }

  const dayViewEntries = drillLevel === "day" ? getDayEntries(drillDay, drillMonth, drillYear) : [];
  const dayViewTotals = calcTotals(dayViewEntries);

  const handleEdit = (entry: any) => {
    setEditingEntry(entry);
    setEditData({ ...entry, amount: String(entry.amount), session_count: String(entry.session_count) });
  };

  const handleSaveEdit = () => {
    onUpdateEntry({
      ...editData,
      amount: parseFloat(editData.amount) || 0,
      session_count: parseInt(editData.session_count) || 1
    });
    setEditingEntry(null);
  };

  const buildStatsMatrix = (type: 'origin' | 'consultation') => {
    const matrix: { [key: string]: number[] } = {};
    const yearEntries = (entries || []).filter((e: any) => new Date(e.entry_date).getFullYear() === statsYear);

    yearEntries.forEach((e: any) => {
      let key = "Inconnu";
      if (type === 'origin') {
        key = getClientOrigin(e.client_id);
      } else {
        key = e.consultation_types?.name || "Non spécifié";
      }

      if (!matrix[key]) {
        matrix[key] = new Array(13).fill(0);
      }
      const month = new Date(e.entry_date).getMonth();
      const amount = parseFloat(e.amount) || 0;
      matrix[key][month] += amount;
      matrix[key][12] += amount;
    });

    return Object.keys(matrix).sort().map(k => ({ name: k, data: matrix[k] }));
  };

  const originStats = buildStatsMatrix('origin');
  const consultStats = buildStatsMatrix('consultation');

  const renderStatsTable = (title: string, data: {name: string, data: number[]}[]) => (
    <div className="mb-8">
      <h4 className="font-cinzel text-md text-[#D4AF37] uppercase tracking-wider mb-4">{title}</h4>
      <div className="overflow-x-auto border border-[#8B1A1A]/50 bg-black/30 backdrop-blur-md shadow-2xl">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-[#8B1A1A] bg-[#2C2C2C]/80">
              <th className="p-3 font-cinzel text-xs text-[#D4AF37] uppercase">Nom</th>
              {monthNames.map((m, i) => (
                <th key={i} className="p-3 font-cinzel text-xs text-[#D4AF37] uppercase text-center">{m.substring(0, 3)}</th>
              ))}
              <th className="p-3 font-cinzel text-xs text-[#D4AF37] uppercase text-center bg-[#8B1A1A]/30">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr><td colSpan={14} className="p-4 text-center text-[#F5F0E8]/40 italic">Aucune donnée pour cette année</td></tr>
            )}
            {data.map((row, i) => (
              <tr key={i} className="border-b border-[#F5F0E8]/10 hover:bg-[#8B1A1A]/30 transition-colors">
                <td className="p-3 font-outfit text-sm text-[#F5F0E8]">{row.name}</td>
                {row.data.slice(0, 12).map((val, j) => (
                  <td key={j} className="p-3 font-outfit text-sm text-[#F5F0E8]/80 text-center">
                    {val > 0 ? `${val.toFixed(0)} €` : '-'}
                  </td>
                ))}
                <td className="p-3 font-cinzel text-sm text-[#D4AF37] text-center bg-[#8B1A1A]/20 font-bold">{row.data[12].toFixed(0)} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const DetailTable = ({ entryList, totals }: { entryList: any[], totals: any }) => (
    <div className="overflow-x-auto border border-[#8B1A1A] bg-[#8B1A1A]/30 backdrop-blur-md shadow-2xl mb-8">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead className="sticky top-0 z-10">
          <tr className="border-b border-[#8B1A1A] bg-[#2C2C2C]/80 backdrop-blur-sm">
            <th className="p-3 font-cinzel text-xs text-[#D4AF37] uppercase tracking-wider">Date</th>
            <th className="p-3 font-cinzel text-xs text-[#D4AF37] uppercase tracking-wider">Patient</th>
            <th className="p-3 font-cinzel text-xs text-[#D4AF37] uppercase tracking-wider">Séances</th>
            <th className="p-3 font-cinzel text-xs text-[#D4AF37] uppercase tracking-wider">Montant</th>
            <th className="p-3 font-cinzel text-xs text-[#D4AF37] uppercase tracking-wider">Paiement</th>
            <th className="p-3 font-cinzel text-xs text-[#D4AF37] uppercase tracking-wider">Origine</th>
            <th className="p-3 font-cinzel text-xs text-[#D4AF37] uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody>
          {entryList.length === 0 && (
            <tr><td colSpan={7} className="p-6 text-center text-[#F5F0E8]/40 italic">Aucune entrée.</td></tr>
          )}
          {entryList.map((entry: any) => (
            <tr key={entry.id} className="border-b border-[#F5F0E8]/10 hover:bg-[#8B1A1A]/50 transition-colors">
              <td className="p-3 font-outfit text-sm text-[#F5F0E8]/80">{formatDateFr(entry.entry_date)}</td>
              <td className="p-3 font-outfit text-sm text-[#F5F0E8]/80">
                <button onClick={() => {
                  const c = clients?.find((cl: any) => cl.id === entry.client_id);
                  if (c) onViewClient(c);
                }} className="hover:text-[#D4AF37] hover:underline text-left">
                  {getClientName(entry.client_id)}
                </button>
              </td>
              <td className="p-3 font-outfit text-sm text-[#F5F0E8]/80">{entry.session_count}</td>
              <td className="p-3 font-cinzel text-sm text-[#D4AF37]">{parseFloat(entry.amount).toFixed(2)} €</td>
              <td className="p-3 font-outfit text-sm text-[#F5F0E8]/80">{entry.payment_method}</td>
              <td className="p-3 font-outfit text-xs text-[#F5F0E8]/60">{getClientOrigin(entry.client_id)}</td>
              <td className="p-3 flex gap-2">
                <button onClick={() => handleEdit(entry)} className="text-xs text-[#D4AF37] hover:underline">Modifier</button>
                <span className="text-[#F5F0E8]/20">|</span>
                <button onClick={() => onDeleteEntry(entry)} className="text-xs text-red-400 hover:underline">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
        {entryList.length > 0 && (
          <tfoot>
            <tr className="border-t-2 border-[#8B1A1A] bg-black/50">
              <td colSpan={2} className="p-3 font-cinzel text-sm text-[#D4AF37] uppercase">TOTAL</td>
              <td className="p-3 font-cinzel text-sm text-[#D4AF37]">{totals.sessions}</td>
              <td className="p-3 font-cinzel text-sm text-[#D4AF37]">{totals.total.toFixed(2)} €</td>
              <td colSpan={3} className="p-3 font-outfit text-xs text-[#F5F0E8]/60">
                Esp: {totals.byMethod['Espèces'].toFixed(2)}€ | Chq: {totals.byMethod['Chèque'].toFixed(2)}€ | Vir: {totals.byMethod['Virement'].toFixed(2)}€ | CB: {totals.byMethod['Carte'].toFixed(2)}€
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="font-cinzel text-2xl md:text-3xl text-[#D4AF37]">Comptabilité Générale</h2>
        <div className="w-24 h-[2px] bg-[#8B1A1A] mx-auto mt-4" style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }}></div>
      </div>

      {/* SECTION 1: MOIS EN COURS */}
      <div className="mb-8">
        <h3 className="font-cinzel text-lg text-[#D4AF37] mb-4 uppercase tracking-wider">Mois en cours</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-[#8B1A1A] bg-[#8B1A1A]/30 backdrop-blur-md p-4 text-center">
            <p className="font-outfit text-xs text-[#F5F0E8]/60 uppercase mb-1">Séances</p>
            <p className="font-cinzel text-2xl text-[#D4AF37]">{currentMonthTotals.sessions}</p>
          </div>
          <div className="border border-[#8B1A1A] bg-[#8B1A1A]/30 backdrop-blur-md p-4 text-center">
            <p className="font-outfit text-xs text-[#F5F0E8]/60 uppercase mb-1">CA Mois</p>
            <p className="font-cinzel text-2xl text-[#D4AF37]">{currentMonthTotals.total.toFixed(2)} €</p>
          </div>
          <div className="border border-[#8B1A1A] bg-[#8B1A1A]/30 backdrop-blur-md p-4 text-center">
            <p className="font-outfit text-xs text-[#F5F0E8]/60 uppercase mb-1">CA Année</p>
            <p className="font-cinzel text-2xl text-[#D4AF37]">{yearTotals.total.toFixed(2)} €</p>
          </div>
          <div className="border border-[#8B1A1A] bg-[#8B1A1A]/30 backdrop-blur-md p-4 text-center">
            <p className="font-outfit text-xs text-[#F5F0E8]/60 uppercase mb-1">Séances Année</p>
            <p className="font-cinzel text-2xl text-[#D4AF37]">{yearTotals.sessions}</p>
          </div>
        </div>
      </div>

      {/* SECTION 2: DÉTAIL DU MOIS EN COURS */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-cinzel text-lg text-[#D4AF37] uppercase tracking-wider">Détail</h3>
          <button onClick={() => exportToCSV(currentMonthEntries, `Comptabilite_Mois_En_Cours`)} className="bg-transparent border border-[#D4AF37] text-[#D4AF37] font-outfit uppercase tracking-widest text-xs px-4 py-2 hover:bg-[#D4AF37] hover:text-[#191970] transition-colors">Télécharger (CSV)</button>
        </div>
        <DetailTable entryList={currentMonthEntries} totals={currentMonthTotals} />
      </div>

      {/* SECTION 3: EXPLORATEUR ANNUEL */}
      <div className="mb-10">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
          <h3 className="font-cinzel text-lg text-[#D4AF37] uppercase tracking-wider">
            {drillLevel === "year" && `Explorateur Annuel`}
            {drillLevel === "month" && `${monthNames[drillMonth]}`}
            {drillLevel === "day" && `${drillDay} ${monthNames[drillMonth]}`}
          </h3>
          
          <div className="flex gap-2">
            {drillLevel === "year" && (
              <select 
                value={drillYear} 
                onChange={(e) => setDrillYear(parseInt(e.target.value))} 
                className="bg-black/60 backdrop-blur-md border border-[#F5F0E8]/30 text-[#F5F0E8] py-2 px-4 text-sm focus:outline-none focus:border-[#D4AF37] appearance-none cursor-pointer"
                style={{ colorScheme: 'dark' }}
              >
                {availableYears.map((y: number) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            )}
            {drillLevel === "month" && (
              <button onClick={() => setDrillLevel("year")} className="bg-transparent border border-[#F5F0E8] text-[#F5F0E8] font-outfit uppercase tracking-widest text-xs px-4 py-2 hover:bg-[#F5F0E8] hover:text-[#191970] transition-colors">
                Retour à l'année
              </button>
            )}
            {drillLevel === "day" && (
              <button onClick={() => setDrillLevel("month")} className="bg-transparent border border-[#F5F0E8] text-[#F5F0E8] font-outfit uppercase tracking-widest text-xs px-4 py-2 hover:bg-[#F5F0E8] hover:text-[#191970] transition-colors">
                Retour au mois
              </button>
            )}
          </div>
        </div>

        {drillLevel === "year" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {yearViewData.map((m) => (
              <div 
                key={m.index} 
                onClick={() => { if (m.hasData) { setDrillMonth(m.index); setDrillLevel("month"); } }} 
                className={`border ${m.hasData ? 'border-[#8B1A1A] bg-[#8B1A1A]/30 backdrop-blur-md cursor-pointer hover:bg-[#8B1A1A]/50' : 'border-[#F5F0E8]/10 bg-black/20 opacity-50'} p-4 text-center transition-colors`}
              >
                <p className="font-cinzel text-md text-[#D4AF37] uppercase">{m.name}</p>
                {m.hasData ? (
                  <>
                    <p className="font-cinzel text-xl text-[#F5F0E8] mt-2">{m.total.toFixed(2)} €</p>
                    <p className="font-outfit text-xs text-[#F5F0E8]/60 italic mt-1">{m.sessions} séance(s)</p>
                  </>
                ) : (
                  <p className="font-outfit text-xs text-[#F5F0E8]/40 italic mt-2">Aucune entrée</p>
                )}
              </div>
            ))}
          </div>
        )}

        {drillLevel === "month" && (
          <div className="border border-[#8B1A1A] bg-[#8B1A1A]/30 backdrop-blur-md shadow-2xl mb-8">
            {monthViewData.length === 0 && <p className="p-6 text-center text-[#F5F0E8]/40 italic">Aucune entrée ce mois-ci.</p>}
            {monthViewData.map((d) => (
              <div 
                key={d.day} 
                onClick={() => { setDrillDay(d.day); setDrillLevel("day"); }} 
                className="cursor-pointer p-4 border-b border-[#F5F0E8]/10 hover:bg-[#8B1A1A]/50 transition-colors flex justify-between items-center"
              >
                <span className="font-cinzel text-sm text-[#D4AF37]">Jour {d.day}</span>
                <div className="text-right">
                  <span className="font-cinzel text-md text-[#F5F0E8] mr-4">{d.total.toFixed(2)} €</span>
                  <span className="font-outfit text-xs text-[#F5F0E8]/60">{d.sessions} séance(s)</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {drillLevel === "day" && (
          <>
            <div className="flex justify-end mb-4">
              <button onClick={() => exportToCSV(dayViewEntries, `Comptabilite_Jour_${drillDay}_${monthNames[drillMonth]}_${drillYear}`)} className="bg-transparent border border-[#D4AF37] text-[#D4AF37] font-outfit uppercase tracking-widest text-xs px-4 py-2 hover:bg-[#D4AF37] hover:text-[#191970] transition-colors">Télécharger (CSV)</button>
            </div>
            <DetailTable entryList={dayViewEntries} totals={dayViewTotals} />
          </>
        )}
      </div>

      {/* MODALE D'ÉDITION */}
      {editingEntry && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8" onClick={() => setEditingEntry(null)}>
          <div className="bg-[#F5F0E8] border border-[#8B1A1A] p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-cinzel text-xl text-[#2C2C2C] mb-6 uppercase tracking-wider">Modifier l'entrée</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#2C2C2C]/60 mb-1">Date</label>
                <input type="date" value={editData.entry_date ? editData.entry_date.substring(0, 10) : ''} onChange={(e) => setEditData({...editData, entry_date: e.target.value})} className="w-full bg-transparent border-b-2 border-[#2C2C2C]/30 py-1 px-1 font-outfit text-sm text-[#2C2C2C] focus:outline-none focus:border-[#8B1A1A]" />
              </div>
              <div>
                <label className="block text-xs text-[#2C2C2C]/60 mb-1">Nb Séances</label>
                <input type="number" min="1" value={editData.session_count || ''} onChange={(e) => setEditData({...editData, session_count: e.target.value})} className="w-full bg-transparent border-b-2 border-[#2C2C2C]/30 py-1 px-1 font-outfit text-sm text-[#2C2C2C] focus:outline-none focus:border-[#8B1A1A]" />
              </div>
              <div>
                <label className="block text-xs text-[#2C2C2C]/60 mb-1">Montant (€)</label>
                <input type="number" step="0.01" value={editData.amount || ''} onChange={(e) => setEditData({...editData, amount: e.target.value})} className="w-full bg-transparent border-b-2 border-[#2C2C2C]/30 py-1 px-1 font-outfit text-sm text-[#2C2C2C] focus:outline-none focus:border-[#8B1A1A]" />
              </div>
              <div>
                <label className="block text-xs text-[#2C2C2C]/60 mb-1">Paiement</label>
                <select value={editData.payment_method || 'Espèces'} onChange={(e) => setEditData({...editData, payment_method: e.target.value})} className="w-full bg-transparent border-b-2 border-[#2C2C2C]/30 py-1 px-1 font-outfit text-sm text-[#2C2C2C] focus:outline-none focus:border-[#8B1A1A]">
                  <option value="Espèces">Espèces</option>
                  <option value="Chèque">Chèque</option>
                  <option value="Virement">Virement</option>
                  <option value="Carte">Carte</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#2C2C2C]/60 mb-1">Description</label>
                <input type="text" value={editData.description || ''} onChange={(e) => setEditData({...editData, description: e.target.value})} className="w-full bg-transparent border-b-2 border-[#2C2C2C]/30 py-1 px-1 font-outfit text-sm text-[#2C2C2C] focus:outline-none focus:border-[#8B1A1A]" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSaveEdit} className="flex-1 bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-xs px-6 py-3 hover:bg-[#2C2C2C] transition-colors">Enregistrer</button>
              <button onClick={() => setEditingEntry(null)} className="flex-1 bg-transparent border border-[#2C2C2C]/30 text-[#2C2C2C] font-outfit uppercase tracking-widest text-xs px-6 py-3 hover:bg-[#2C2C2C] hover:text-[#F5F0E8] transition-colors">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* BOUTON RETOUR DYNAMIQUE */}
      <div className="text-center mt-10">
        <button 
          onClick={() => drillLevel !== "year" ? setDrillLevel("year") : setView("dashboard")} 
          className="bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-sm px-8 py-4 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors duration-300 font-light"
        >
          {drillLevel !== "year" ? "Retour à la Comptabilité Générale" : "Retour au Tableau de Bord"}
        </button>
      </div>

      {/* SECTION 4: STATISTIQUES */}
      <div className="mt-16 pt-10 border-t border-[#F5F0E8]/10">
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <h3 className="font-cinzel text-xl text-[#D4AF37] uppercase tracking-wider">Statistiques</h3>
          <select 
            value={statsYear} 
            onChange={(e) => setStatsYear(parseInt(e.target.value))} 
            className="bg-black/60 backdrop-blur-md border border-[#F5F0E8]/30 text-[#F5F0E8] py-2 px-4 text-sm focus:outline-none focus:border-[#D4AF37] appearance-none cursor-pointer"
            style={{ colorScheme: 'dark' }}
          >
            {availableYears.map((y: number) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        
        {renderStatsTable("Par Origine", originStats)}
        {renderStatsTable("Par Consultation", consultStats)}
      </div>

      {/* SECTION 5: EXPORTS DÉTAILLÉS (EXCEL/CSV) */}
      <div className="mt-16 pt-10 border-t border-[#F5F0E8]/10">
        <h3 className="font-cinzel text-xl text-[#D4AF37] uppercase tracking-wider mb-8">Exports Détaillés (Excel)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Export par Année */}
          <div className="border border-[#F5F0E8]/20 bg-black/30 backdrop-blur-md p-6 flex flex-col gap-4">
            <h4 className="font-cinzel text-sm text-[#F5F0E8] uppercase tracking-wider">Par Année</h4>
            <select 
              value={expYear} 
              onChange={(e) => setExpYear(parseInt(e.target.value))} 
              className="bg-[#0A0A0A] border border-[#F5F0E8]/30 py-2 px-3 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#D4AF37]"
            >
              {availableYears.map((y: number) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <button 
              onClick={() => exportToCSV(getYearEntries(expYear), `Compta_Année_${expYear}`)} 
              className="bg-[#D4AF37] text-[#191970] font-outfit uppercase tracking-widest text-xs py-3 hover:bg-[#F5F0E8] transition-colors mt-auto"
            >
              Exporter l'année
            </button>
          </div>

          {/* Export par Mois */}
          <div className="border border-[#F5F0E8]/20 bg-black/30 backdrop-blur-md p-6 flex flex-col gap-4">
            <h4 className="font-cinzel text-sm text-[#F5F0E8] uppercase tracking-wider">Par Mois</h4>
            <div className="flex gap-2">
              <select 
                value={expYear} 
                onChange={(e) => setExpYear(parseInt(e.target.value))} 
                className="w-1/2 bg-[#0A0A0A] border border-[#F5F0E8]/30 py-2 px-3 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#D4AF37]"
              >
                {availableYears.map((y: number) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <select 
                value={expMonth} 
                onChange={(e) => setExpMonth(parseInt(e.target.value))} 
                className="w-1/2 bg-[#0A0A0A] border border-[#F5F0E8]/30 py-2 px-3 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#D4AF37]"
              >
                {monthNames.map((m, i) => (
                  <option key={i} value={i}>{m}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={() => exportToCSV(getMonthEntries(expMonth, expYear), `Compta_${monthNames[expMonth]}_${expYear}`)} 
              className="bg-[#D4AF37] text-[#191970] font-outfit uppercase tracking-widest text-xs py-3 hover:bg-[#F5F0E8] transition-colors mt-auto"
            >
              Exporter le mois
            </button>
          </div>

          {/* Export par Client */}
          <div className="border border-[#F5F0E8]/20 bg-black/30 backdrop-blur-md p-6 flex flex-col gap-4">
            <h4 className="font-cinzel text-sm text-[#F5F0E8] uppercase tracking-wider">Par Client</h4>
            <select 
              value={expClientId} 
              onChange={(e) => setExpClientId(e.target.value)} 
              className="bg-[#0A0A0A] border border-[#F5F0E8]/30 py-2 px-3 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="">Sélectionner un patient...</option>
              {clients?.map((c: any) => (
                <option key={c.id} value={c.id}>{c.nom_prenom}</option>
              ))}
            </select>
            <button 
              onClick={() => {
                if (!expClientId) { alert("Veuillez sélectionner un patient."); return; }
                const clientEntries = entries.filter((e: any) => e.client_id === expClientId);
                const clientName = clients.find((c: any) => c.id === expClientId)?.nom_prenom || "Client";
                exportToCSV(clientEntries, `Compta_${clientName}`);
              }} 
              className="bg-[#D4AF37] text-[#191970] font-outfit uppercase tracking-widest text-xs py-3 hover:bg-[#F5F0E8] transition-colors mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!expClientId}
            >
              Exporter le patient
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}