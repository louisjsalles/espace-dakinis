"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { Session } from "@supabase/supabase-js";

import LoginForm from "./components/LoginForm";
import DashboardView from "./components/DashboardView";
import CahierDeBordView from "./components/CahierDeBordView";
import MediasListView from "./components/MediasListView";
import MediaPickerModal from "./components/MediaPickerModal";
import PagesListView from "./components/PagesListView";
import PageEditorView from "./components/PageEditorView";
import SettingsView from "./components/SettingsView";
import ClientsListView from "./components/ClientsListView";
import ClientDetailView from "./components/ClientDetailView";
import ClientAccountingView from "./components/ClientAccountingView";
import AccountingDashboardView from "./components/AccountingDashboardView";

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("dashboard");
  
  const [pages, setPages] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<any>(null);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [medias, setMedias] = useState<any[]>([]);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [pickerTargetIndex, setPickerTargetIndex] = useState<number | null>(null);
  const [pickerTargetProduct, setPickerTargetProduct] = useState<number | null>(null);

  const [clients, setClients] = useState<any[]>([]);
  const [currentClient, setCurrentClient] = useState<any>(null);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [clientFiles, setClientFiles] = useState<any[]>([]);
  const [communications, setCommunications] = useState<any[]>([]);
  const [origins, setOrigins] = useState<any[]>([]);
  const [consultationTypes, setConsultationTypes] = useState<any[]>([]);
  
  const [accountingEntries, setAccountingEntries] = useState<any[]>([]);
  const [allAccountingEntries, setAllAccountingEntries] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setSession(session); });
    return () => subscription.unsubscribe();
  }, []);

  const fetchPages = async () => { const { data } = await supabase.from('pages').select('id, slug, title, content, order_index').order('order_index', { ascending: true }); if (data) setPages(data); };
  const fetchMedias = async () => { const { data } = await supabase.from('medias').select('*').order('created_at', { ascending: false }); if (data) setMedias(data); };
  const fetchClients = async () => { const { data } = await supabase.from('clients').select('*, origins(name)').eq('archived', false).order('nom_prenom', { ascending: true }); if (data) setClients(data); };
  const fetchOrigins = async () => { const { data } = await supabase.from('origins').select('*').order('name', { ascending: true }); if (data) setOrigins(data); };
  const fetchConsultationTypes = async () => { const { data } = await supabase.from('consultation_types').select('*').order('name', { ascending: true }); if (data) setConsultationTypes(data); };

  // Pages Handlers
  const handleEditPage = (page: any) => { setCurrentPage(page); setBlocks(page.content || []); setView("pageEditor"); setMessage(""); };
  const handleDeletePage = async (pageId: string) => { if (window.confirm("Supprimer cette page ?")) { await supabase.from('pages').delete().eq('id', pageId); fetchPages(); } };
  const handleMovePage = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === pages.length - 1) return;
    const cPage = pages[index]; const tPage = direction === 'up' ? pages[index - 1] : pages[index + 1];
    await supabase.from('pages').update({ order_index: tPage.order_index }).eq('id', cPage.id);
    await supabase.from('pages').update({ order_index: cPage.order_index }).eq('id', tPage.id);
    fetchPages();
  };

  // Blocks Handlers
  const handleUpdateBlock = (index: number, updatedBlock: any) => { const u = [...blocks]; u[index] = updatedBlock; setBlocks(u); };
  const handleAddBlock = (type: string) => {
    let n: any = { type };
    if (type === 'intro' || type === 'paragraph' || type === 'disclaimer') n.text = "Nouveau texte à éditer.";
    else if (type === 'text_image') { n.title = "Nouveau titre"; n.text = "Nouveau texte"; n.image = "/fond-nuit.png"; n.image_position = "right"; }
    else if (type === 'heading_with_logo') n.text = "Nouveau titre avec logo";
    else if (type === 'buttons') n.buttons = [{ text: "Nouveau bouton", link: "/contact" }];
    else if (type === 'image_standalone') { n.image = "/fond-nuit.png"; n.align = "center"; n.alt = "Description"; }
    else if (type === 'contact_main') { n.title1 = "Prendre Contact"; n.image = "/alexandra.png"; n.title2 = "PAIEMENT & MODALITÉS"; n.paiement_text = "Engagement et respect mutuel. Toute séance annulée moins de 48h avant est due."; n.button_text = "Envoyer la demande"; }
    else if (type === 'home_hero') { n.title = "Espace"; n.title2 = "DAKINIS"; n.subtitle = "Accompagnement à la transformation et à l'éveil"; n.text = "Texte d'accroche..."; n.button_text = "Découvrir les Espaces"; n.button_link = "/espaces/voir-clairement"; n.image = "/dakini-or.png"; }
    else if (type === 'spaces_grid') {
      n.title = "Les 3 Espaces";
      n.cards = [
        { title: "Espace 1", description: "Description de l'espace 1", link: "#" },
        { title: "Espace 2", description: "Description de l'espace 2", link: "#" },
        { title: "Espace 3", description: "Description de l'espace 3", link: "#" }
      ];
    }
    else if (type === 'products_grid') n.products = [{ title: "Nouveau produit", subtitle: "", description: "", price: "0 €", image: "/fond-nuit.png", vinted_link: "#" }];
    setBlocks([...blocks, n]);
  };
  const handleDeleteBlock = (index: number) => { setBlocks(blocks.filter((_, i) => i !== index)); };
  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) { const u = [...blocks]; [u[index - 1], u[index]] = [u[index], u[index - 1]]; setBlocks(u); }
    else if (direction === 'down' && index < blocks.length - 1) { const u = [...blocks]; [u[index + 1], u[index]] = [u[index], u[index + 1]]; setBlocks(u); }
  };

  // Products Handlers
  const handleUpdateProduct = (bi: number, pi: number, f: string, v: string) => { const u = [...blocks]; const p = [...u[bi].products]; p[pi] = { ...p[pi], [f]: v }; u[bi].products = p; setBlocks(u); };
  const handleAddProduct = (bi: number) => { const u = [...blocks]; u[bi].products = [...u[bi].products, { title: "Nouveau produit", subtitle: "", description: "", price: "0 €", image: "/fond-nuit.png", vinted_link: "#", vinted_button_text: "Acheter sur Vinted", contact_button_text: "Contacter" }]; setBlocks(u); };
  const handleDeleteProduct = (bi: number, pi: number) => { const u = [...blocks]; u[bi].products = u[bi].products.filter((_: any, i: number) => i !== pi); setBlocks(u); };

  // MISE À JOUR : Sauvegarde le contenu ET la description SEO
  const handleSavePage = async () => { 
    setSaving(true); 
    setMessage(""); 
    const { error } = await supabase.from('pages').update({ 
      content: blocks, 
      seo_description: currentPage?.seo_description || null 
    }).eq('id', currentPage.id); 
    if (error) setMessage("Erreur lors de la sauvegarde."); 
    else setMessage("Page mise à jour avec succès !"); 
    setSaving(false); 
  };

  // Media Handlers
  const openMediaPicker = (index: number, productIndex: number | null = null) => { setPickerTargetIndex(index); setPickerTargetProduct(productIndex); setShowMediaPicker(true); };
  const handleSelectMedia = (url: string) => {
    if (pickerTargetIndex !== null) {
      if (pickerTargetProduct !== null) handleUpdateProduct(pickerTargetIndex, pickerTargetProduct, 'image', url);
      else handleUpdateBlock(pickerTargetIndex, { ...blocks[pickerTargetIndex], image: url });
    }
    setShowMediaPicker(false); setPickerTargetIndex(null); setPickerTargetProduct(null);
  };
  const handleUploadMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const fn = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const { error: ue } = await supabase.storage.from('medias').upload(fn, file);
    if (ue) alert("Erreur: " + ue.message);
    else {
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/medias/${fn}`;
      const { error: de } = await supabase.from('medias').insert({ url, name: file.name, alt_text: file.name });
      if (de) alert("Erreur DB: " + de.message); else fetchMedias();
    }
  };
  const handleDeleteMedia = async (media: any) => {
    if (window.confirm("Supprimer cette image ?")) {
      const p = media.url.split('/'); const fn = p[p.length - 1];
      const { error: se } = await supabase.storage.from('medias').remove([fn]);
      if (se) { alert("Erreur: " + se.message); return; }
      const { error: de } = await supabase.from('medias').delete().eq('id', media.id);
      if (de) { alert("Erreur: " + de.message); return; }
      fetchMedias();
    }
  };

  // Client Handlers
  const handleViewClient = async (client: any) => {
    setCurrentClient(client);
    try {
      const [
        { data: consults }, 
        { data: files }, 
        { data: comms }, 
        { data: accEntries }
      ] = await Promise.all([
        supabase.from('consultations').select('*').eq('client_id', client.id).order('created_at', { ascending: false }),
        supabase.from('client_files').select('*').eq('client_id', client.id).order('created_at', { ascending: false }),
        supabase.from('client_communications').select('*').eq('client_id', client.id).order('created_at', { ascending: false }),
        supabase.from('accounting_entries').select('session_count, entry_date').eq('client_id', client.id)
      ]);
      
      if (origins.length === 0) await fetchOrigins();
      if (consultationTypes.length === 0) await fetchConsultationTypes();

      setConsultations(consults || []);
      setClientFiles(files || []);
      setCommunications(comms || []);
      setCurrentClient({ ...client, accounting_entries: accEntries || [] });
      setView("clientDetail");
    } catch (err: any) {
      console.error("Erreur vue client:", err);
      setConsultations([]);
      setClientFiles([]);
      setCommunications([]);
      setCurrentClient({ ...client, accounting_entries: [] });
      setView("clientDetail");
    }
  };
  const handleAddConsultation = async (e: React.FormEvent) => {
    e.preventDefault(); const form = e.target as HTMLFormElement; const fd = new FormData(form); const notes = fd.get('notes') as string;
    const { data, error } = await supabase.from('consultations').insert({ client_id: currentClient.id, notes }).select().single();
    if (error) alert("Erreur: " + error.message);
    else { setConsultations((prev: any) => [data, ...prev]); form.reset(); }
  };
  const handleAddCommunication = async (clientId: string, type: string, content: string) => {
    const { data, error } = await supabase.from('client_communications').insert({ client_id: clientId, type, content }).select().single();
    if (error) alert("Erreur: " + error.message);
    else setCommunications([data, ...communications]);
  };
  const handleArchiveClient = async (clientId: string, archive: boolean) => {
    const { error } = await supabase.from('clients').update({ archived: archive }).eq('id', clientId);
    if (error) alert("Erreur: " + error.message);
    else { fetchClients(); setView("clientsList"); }
  };
  const handleUploadClientFile = async (e: React.ChangeEvent<HTMLInputElement>, clientId: string) => {
    const file = e.target.files?.[0]; if (!file) return;
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const { error: uploadError } = await supabase.storage.from('client-files').upload(fileName, file);
    if (uploadError) { alert("Erreur: " + uploadError.message); return; }
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/client-files/${fileName}`;
    const { data, error: dbError } = await supabase.from('client_files').insert({ client_id: clientId, file_url: url, file_name: file.name }).select().single();
    if (dbError) alert("Erreur DB: " + dbError.message);
    else setClientFiles([data, ...clientFiles]);
    e.target.value = "";
  };
  const handleDeleteClientFile = async (file: any) => {
    if (window.confirm("Supprimer ce fichier ?")) {
      const urlParts = file.file_url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      await supabase.storage.from('client-files').remove([fileName]);
      await supabase.from('client_files').delete().eq('id', file.id);
      setClientFiles(clientFiles.filter((f: any) => f.id !== file.id));
    }
  };
  const handleUpdateClient = async (updatedClient: any) => {
    const { data, error } = await supabase.from('clients').update({
      nom_prenom: updatedClient.nom_prenom, 
      telephone: updatedClient.telephone, 
      email: updatedClient.email,
      adresse: updatedClient.adresse, 
      origin_id: updatedClient.origin_id,
      raison_consultation: updatedClient.raison_consultation, 
      date_rdv: updatedClient.date_rdv
    }).eq('id', updatedClient.id).select('*, origins(name)').single();
    if (error) alert("Erreur lors de la sauvegarde: " + error.message);
    else { 
      setCurrentClient({ ...data, accounting_entries: currentClient.accounting_entries }); 
      fetchClients(); 
      alert("Patient mis à jour avec succès !"); 
    }
  };
  const handleAddOrigin = async (name: string) => {
    const { data, error } = await supabase.from('origins').insert({ name }).select().single();
    if (error) {
      if (error.code === '23505') alert("Cette origine existe déjà.");
      else alert("Erreur: " + error.message);
    } else {
      setOrigins([...origins, data].sort((a, b) => a.name.localeCompare(b.name)));
      return data.id;
    }
    return null;
  };
  const handleDeleteOrigin = async (originId: string) => {
    if (window.confirm("Supprimer cette origine de la liste ?")) {
      const { error } = await supabase.from('origins').delete().eq('id', originId);
      if (error) {
        if (error.code === '23503') alert("Impossible de supprimer : cette origine est utilisée par un patient.");
        else alert("Erreur: " + error.message);
      } else {
        setOrigins(origins.filter((o: any) => o.id !== originId));
      }
    }
  };

  const handleAddConsultationType = async (name: string) => {
    const { data, error } = await supabase.from('consultation_types').insert({ name }).select().single();
    if (error) {
      alert("Erreur Ajout Consultation: " + error.message);
      return false;
    }
    setConsultationTypes([...consultationTypes, data].sort((a, b) => a.name.localeCompare(b.name)));
    return true;
  };

  // COMPTABILITÉ HANDLERS
  const handleViewAccounting = async (client: any) => {
    setCurrentClient(client);
    
    const [
      { data: entries }, 
      { data: consults }, 
      { data: files }, 
      { data: comms }
    ] = await Promise.all([
      supabase.from('accounting_entries').select('*, consultation_types(name)').eq('client_id', client.id).order('entry_date', { ascending: false }),
      supabase.from('consultations').select('*').eq('client_id', client.id).order('created_at', { ascending: false }),
      supabase.from('client_files').select('*').eq('client_id', client.id).order('created_at', { ascending: false }),
      supabase.from('client_communications').select('*').eq('client_id', client.id).order('created_at', { ascending: false })
    ]);
    
    setAccountingEntries(entries || []);
    setConsultations(consults || []);
    setClientFiles(files || []);
    setCommunications(comms || []);
    setCurrentClient({ ...client, accounting_entries: entries || [] });

    if (consultationTypes.length === 0) await fetchConsultationTypes();
    setView("clientAccounting");
  };
  const handleAddAccountingEntry = async (entry: any) => {
    const { data, error } = await supabase.from('accounting_entries').insert({
      client_id: entry.client_id,
      entry_date: entry.entry_date,
      amount: entry.amount,
      payment_method: entry.payment_method,
      session_count: entry.session_count,
      consultation_type_id: entry.consultation_type_id
    }).select('*, consultation_types(name)').single();
    if (error) alert("Erreur: " + error.message);
    else {
      setAccountingEntries([data, ...accountingEntries]);
      setCurrentClient((prev: any) => prev ? ({ ...prev, accounting_entries: [data, ...(prev.accounting_entries || [])] }) : null);
    }
  };
  
  const handleDeleteAccountingEntry = async (entry: any) => {
    if (window.confirm("Supprimer définitivement cette entrée comptable ?")) {
      const { error } = await supabase.from('accounting_entries').delete().eq('id', entry.id);
      if (error) {
        alert("Erreur lors de la suppression: " + error.message);
      } else {
        setAccountingEntries(accountingEntries.filter((e: any) => e.id !== entry.id));
        setAllAccountingEntries(allAccountingEntries.filter((e: any) => e.id !== entry.id));
        setCurrentClient((prev: any) => prev ? ({ ...prev, accounting_entries: (prev.accounting_entries || []).filter((e: any) => e.id !== entry.id) }) : null);
      }
    }
  };
  
  const handleUpdateAccountingEntry = async (entry: any) => {
    const { data, error } = await supabase.from('accounting_entries').update({
      entry_date: entry.entry_date,
      amount: parseFloat(entry.amount),
      payment_method: entry.payment_method,
      session_count: parseInt(entry.session_count) || 1,
    }).eq('id', entry.id).select('*, consultation_types(name)').single();
    if (error) alert("Erreur: " + error.message);
    else {
      setAllAccountingEntries(allAccountingEntries.map((e: any) => e.id === entry.id ? data : e));
    }
  };
  const handleBackToPatient = () => {
    setView("clientDetail");
  };
  const handleGoToGeneralAccounting = async () => {
    const { data: entries } = await supabase.from('accounting_entries').select('*, consultation_types(name)').order('entry_date', { ascending: false });
    setAllAccountingEntries(entries || []);
    if (clients.length === 0) {
      await fetchClients();
    }
    setView("accountingDashboard");
  };
  const onOpenAccounting = () => {
    handleGoToGeneralAccounting();
  };

  // FACTURATION
  const handleGenerateInvoice = async (client: any, entry: any) => {
    const { data: settings, error: sErr } = await supabase.from('settings').select('invoice_counter').eq('id', 1).single();
    if (sErr || !settings) { alert("Erreur: impossible de récupérer le compteur de factures."); return null; }

    const nextNumber = (settings.invoice_counter || 359) + 1;
    const year = new Date().getFullYear();
    const invoiceNumber = `FACT-${year}-${nextNumber}`;

    await supabase.from('settings').update({ invoice_counter: nextNumber }).eq('id', 1);

    await supabase.from('invoices').insert({
      client_id: client.id,
      invoice_number: invoiceNumber,
      content: { entry_id: entry.id, amount: entry.amount, date: entry.entry_date }
    });

    return { invoiceNumber };
  };

  // FONCTION : VIDER TOUTE LA BASE DE DONNÉES
  const handleWipeData = async () => {
    if (window.confirm("ATTENTION : Cela va supprimer DÉFINITIVEMENT tous les clients, la comptabilité, les consultations, les fichiers et les factures. Êtes-vous absolument sûr ?")) {
      if (window.confirm("Dernière confirmation : Cette action est IRRÉVERSIBLE. Tout effacer ?")) {
        try {
          await supabase.from('invoices').delete().not('id', 'is', null);
          await supabase.from('accounting_entries').delete().not('id', 'is', null);
          await supabase.from('consultations').delete().not('id', 'is', null);
          await supabase.from('client_communications').delete().not('id', 'is', null);
          await supabase.from('client_files').delete().not('id', 'is', null);
          await supabase.from('clients').delete().not('id', 'is', null);
          
          setClients([]);
          setAllAccountingEntries([]);
          setAccountingEntries([]);
          
          alert("Base de données réinitialisée avec succès. Vous pouvez réimporter votre fichier.");
        } catch (err: any) {
          alert("Erreur lors de la suppression : " + err.message);
        }
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] flex items-center justify-center font-outfit text-lg">Vérification de la session...</div>;
  if (!session) return <LoginForm />;

  return (
    <div className="relative min-h-[calc(100vh-160px)] text-[#F5F0E8] px-6 py-20 md:py-32 bg-[#0A0A0A] overflow-hidden">
      {/* FOND CIEL DE NUIT */}
      <div className="fixed inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('/fond-nuit.png')" }}></div>
      <div className="fixed inset-0 z-0 bg-black/60"></div>

      <MediaPickerModal showMediaPicker={showMediaPicker} setShowMediaPicker={setShowMediaPicker} medias={medias} handleSelectMedia={handleSelectMedia} handleUploadMedia={handleUploadMedia} />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold tracking-wider text-[#D4AF37] mb-4">TABLEAU DE BORD</h1>
          <div className="w-32 h-[2px] bg-[#8B1A1A] mx-auto" style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }}></div>
          <p className="font-outfit text-sm text-[#F5F0E8]/70 uppercase tracking-widest mt-6 font-light">Connecté en tant que : {session.user.email}</p>
        </div>

        {view === "dashboard" && <DashboardView setView={setView} fetchPages={fetchPages} fetchMedias={fetchMedias} fetchClients={fetchClients} onOpenAccounting={onOpenAccounting} />}
        {view === "pagesList" && <PagesListView pages={pages} setView={setView} onEdit={handleEditPage} onDelete={handleDeletePage} onMovePage={handleMovePage} />}
        {view === "mediasList" && <MediasListView medias={medias} setView={setView} onUpload={handleUploadMedia} onDelete={handleDeleteMedia} />}
        {view === "cahierDeBord" && <CahierDeBordView setView={setView} />}
        {view === "parametres" && <SettingsView setView={setView} />}
        {view === "clientsList" && <ClientsListView clients={clients} setView={setView} onView={handleViewClient} fetchClients={fetchClients} origins={origins} fetchOrigins={fetchOrigins} consultationTypes={consultationTypes} fetchConsultationTypes={fetchConsultationTypes} onAddConsultationType={handleAddConsultationType} onWipeData={handleWipeData} />}
        
        {view === "clientDetail" && (
          <ClientDetailView 
            client={currentClient} 
            consultations={consultations} 
            communications={communications} 
            onAddConsult={handleAddConsultation} 
            onAddCommunication={handleAddCommunication}
            onArchive={handleArchiveClient} 
            onUploadFile={handleUploadClientFile} 
            clientFiles={clientFiles} 
            onDeleteFile={handleDeleteClientFile} 
            onUpdateClient={handleUpdateClient} 
            origins={origins}
            onAddOrigin={handleAddOrigin}
            onDeleteOrigin={handleDeleteOrigin}
            consultationTypes={consultationTypes}
            onAddConsultationType={handleAddConsultationType}
            onViewAccounting={handleViewAccounting}
            setView={setView} 
          />
        )}

        {view === "clientAccounting" && (
          <ClientAccountingView 
            client={currentClient} 
            accountingEntries={accountingEntries} 
            onAddEntry={handleAddAccountingEntry} 
            onDeleteEntry={handleDeleteAccountingEntry} 
            onBackToPatient={handleBackToPatient}
            onGoToGeneralAccounting={handleGoToGeneralAccounting}
            consultationTypes={consultationTypes}
            onAddConsultationType={handleAddConsultationType}
            onGenerateInvoice={handleGenerateInvoice}
          />
        )}

        {view === "accountingDashboard" && (
          <AccountingDashboardView 
            entries={allAccountingEntries} 
            clients={clients} 
            setView={setView}
            onViewClient={handleViewAccounting}
            onUpdateEntry={handleUpdateAccountingEntry}
            onDeleteEntry={handleDeleteAccountingEntry}
          />
        )}

        {/* MISE À JOUR : On passe les props seoDescription et onUpdateSeoDescription à PageEditorView */}
        {view === "pageEditor" && (
          <PageEditorView 
            currentPage={currentPage} 
            seoDescription={currentPage?.seo_description || ''} 
            onUpdateSeoDescription={(val: string) => setCurrentPage({...currentPage, seo_description: val})}
            blocks={blocks} 
            onUpdateBlock={handleUpdateBlock} 
            onAddBlock={handleAddBlock}
            onDeleteBlock={handleDeleteBlock} 
            onMoveBlock={handleMoveBlock} 
            onSave={handleSavePage} 
            setView={setView} 
            saving={saving} 
            message={message} 
            openMediaPicker={openMediaPicker}
            onUpdateProduct={handleUpdateProduct} 
            onAddProduct={handleAddProduct} 
            onDeleteProduct={handleDeleteProduct}
          />
        )}
      </div>
    </div>
  );
}