"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";

export default function PortalLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  // If already logged in, redirect immediately
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
          
        if (profile) {
          router.replace(profile.role === "admin" ? "/portal/admin" : "/portal/employee");
        } else {
          // Break the infinite loop if profile is missing
          await supabase.auth.signOut();
          setError("Account setup incomplete: No profile found. Please contact an admin.");
          setChecking(false);
        }
      } else {
        setChecking(false);
      }
    })();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError || !data.session) {
      setError(authError?.message ?? "Login failed.");
      setLoading(false);
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.session.user.id)
      .single();
      
    if (profile) {
      router.replace(profile.role === "admin" ? "/portal/admin" : "/portal/employee");
    } else {
      await supabase.auth.signOut();
      setError("Account setup incomplete: No profile found.");
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={32} />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden px-4">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <p className="text-white/30 text-[10px] font-bold tracking-[0.3em] uppercase mb-2">ScaleForge</p>
          <h1 className="text-4xl font-bold text-white tracking-tight">Portal</h1>
          <p className="text-white/40 text-sm mt-2">Sign in to your workspace</p>
        </div>

        {/* Card */}
        <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
          {/* Subtle top gradient line */}
          <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@scaleforge.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm outline-none focus:border-orange-500/60 focus:bg-white/8 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-white/20 text-sm outline-none focus:border-orange-500/60 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold rounded-xl py-3.5 text-sm tracking-wider uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_24px_rgba(249,115,22,0.25)]"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
              {loading ? "Signing in…" : "Sign In"}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          ScaleForge Internal Portal — Authorised Access Only
        </p>
      </motion.div>
    </main>
  );
}
