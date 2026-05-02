"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LogOut, Sun, Moon, Shield, User } from "lucide-react";
import { useTheme } from "next-themes";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

interface PortalNavProps {
  userName: string;
  role: "admin" | "employee";
}

export default function PortalNav({ userName, role }: PortalNavProps) {
  const { theme, setTheme } = useTheme();
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.replace("/portal");
  };

  const isAdmin = role === "admin";
  const glowColor = theme === "light"
    ? "[text-shadow:0_0_8px_#00f3ff]"
    : "[text-shadow:0_0_8px_#f97316]";

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 h-12 rounded-full border border-white/10 bg-black/80 backdrop-blur-xl shadow-xl"
    >
      {/* Logo */}
      <span className={`text-xs font-bold tracking-widest uppercase pr-4 border-r border-white/10 ${glowColor} text-white`}>
        Scale Forge
      </span>

      {/* Role badge */}
      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
        isAdmin
          ? "bg-orange-500/10 border border-orange-500/30 text-orange-400"
          : "bg-blue-500/10 border border-blue-500/30 text-blue-400"
      }`}>
        {isAdmin ? <Shield size={10} /> : <User size={10} />}
        {isAdmin ? "Admin" : "Employee"}
      </div>

      {/* User name */}
      <span className="text-white/50 text-xs font-medium hidden sm:block">{userName}</span>

      {/* Theme toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="text-white/40 hover:text-white/80 transition-colors p-1.5 rounded-full hover:bg-white/5"
      >
        {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
      </button>

      {/* Logout */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="flex items-center gap-1.5 text-white/40 hover:text-red-400 transition-colors text-[10px] font-bold uppercase tracking-wider pl-3 border-l border-white/10"
      >
        <LogOut size={13} />
        <span className="hidden sm:block">{loggingOut ? "…" : "Logout"}</span>
      </button>
    </motion.nav>
  );
}
