"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage("Erreur de connexion : " + error.message);
      setLoading(false);
    } else {
      setMessage("Connexion réussie ! Redirection...");
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-160px)] flex flex-col items-center justify-center text-[#F5F0E8] px-6 py-20 bg-[#191970] overflow-hidden">
      <div className="fixed inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('/fond-nuit.png')" }}></div>
      <div className="fixed inset-0 z-0 bg-black/60"></div>
      <div className="relative z-10 w-full max-w-md p-8 md:p-10 border border-[#8B1A1A] bg-[#8B1A1A]/30 backdrop-blur-md shadow-2xl">
        <div className="text-center mb-8">
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
            <polygon points="50,90 90,20 10,20" fill="#8B1A1A" />
            <line x1="50" y1="10" x2="50" y2="100" stroke="#F5F0E8" strokeWidth="3" />
            <circle cx="50" cy="55" r="15" fill="#F5F0E8" />
          </svg>
          <h1 className="font-cinzel text-3xl md:text-4xl font-bold tracking-wider text-[#D4AF37]">ESPACE DAKINIS</h1>
          <div className="w-24 h-[2px] bg-[#F5F0E8] mx-auto mt-4" style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }}></div>
          <p className="font-outfit text-sm text-[#F5F0E8]/80 uppercase tracking-widest mt-6 font-light">Back-Office Sécurisé</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block font-outfit text-sm uppercase tracking-wider mb-2 text-[#F5F0E8]/80 font-light">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-transparent border-b-2 border-[#F5F0E8]/50 py-2 px-1 font-outfit text-lg text-[#F5F0E8] focus:outline-none focus:border-[#8B1A1A] font-light placeholder:text-[#F5F0E8]/40" placeholder="Votre email" />
          </div>
          <div>
            <label className="block font-outfit text-sm uppercase tracking-wider mb-2 text-[#F5F0E8]/80 font-light">Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-transparent border-b-2 border-[#F5F0E8]/50 py-2 px-1 font-outfit text-lg text-[#F5F0E8] focus:outline-none focus:border-[#8B1A1A] font-light placeholder:text-[#F5F0E8]/40" placeholder="Votre mot de passe" />
          </div>
          <div className="text-center pt-4">
            <button type="submit" disabled={loading} className="w-full bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-sm px-8 py-4 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors duration-300 font-light disabled:opacity-50">
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </div>
          {message && <p className="text-center font-outfit text-sm text-[#F5F0E8]/80 mt-4">{message}</p>}
        </form>
      </div>
    </div>
  );
}