"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError("Email ou mot de passe incorrect.");
  };

  // Fonction de connexion via Google
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // window.location.origin gère automatiquement localhost ou espacedakinis.com
        redirectTo: window.location.origin + '/admin'
      }
    });
    if (error) setError("Erreur de connexion Google.");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* FOND CIEL DE NUIT */}
      <div className="fixed inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('/fond-nuit.png')" }}></div>
      <div className="fixed inset-0 z-0 bg-black/70"></div>

      {/* CARTE DE CONNEXION (Brutalisme Sacré) */}
      <div className="w-full max-w-md bg-[#0A0A0A]/80 border border-[#8B1A1A] backdrop-blur-md p-8 shadow-2xl relative z-10">
        <h1 className="font-cinzel text-3xl text-[#D4AF37] text-center mb-8 uppercase tracking-wider">Espace Admin</h1>
        
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs text-[#F5F0E8]/60 mb-1 uppercase">Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full bg-transparent border-b border-[#F5F0E8]/30 py-2 text-[#F5F0E8] focus:outline-none focus:border-[#8B1A1A] transition-colors" 
            />
          </div>
          <div>
            <label className="block text-xs text-[#F5F0E8]/60 mb-1 uppercase">Mot de passe</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full bg-transparent border-b border-[#F5F0E8]/30 py-2 text-[#F5F0E8] focus:outline-none focus:border-[#8B1A1A] transition-colors" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-[#8B1A1A] text-[#F5F0E8] font-outfit uppercase tracking-widest text-sm py-3 hover:bg-[#F5F0E8] hover:text-[#8B1A1A] transition-colors duration-300 font-light"
          >
            Se connecter
          </button>
        </form>

        {/* SÉPARATEUR */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-[1px] bg-[#F5F0E8]/20"></div>
          <span className="px-4 text-xs text-[#F5F0E8]/50 uppercase">Ou</span>
          <div className="flex-1 h-[1px] bg-[#F5F0E8]/20"></div>
        </div>

        {/* BOUTON GOOGLE */}
        <button 
          onClick={handleGoogleLogin} 
          className="w-full flex items-center justify-center gap-3 border border-[#F5F0E8]/30 text-[#F5F0E8] font-outfit text-sm py-3 hover:bg-[#F5F0E8]/10 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Se connecter avec Google
        </button>
      </div>
    </div>
  );
}