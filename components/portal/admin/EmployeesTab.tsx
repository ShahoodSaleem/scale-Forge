"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, type Profile } from "../../../lib/supabase";
import { Search, UserCheck, UserX, Mail, Building2 } from "lucide-react";

function EmployeeCard({ emp, onUpdate, onDelete, onToggleRole }: { emp: Profile; onUpdate: (e: Profile) => void; onDelete: () => void; onToggleRole: () => void }) {
  const [expectedIn, setExpectedIn] = useState(emp.expected_time_in || "");
  const [expectedOut, setExpectedOut] = useState(emp.expected_time_out || "");
  const [saving, setSaving] = useState(false);

  // Check if modified
  const isModified = expectedIn !== (emp.expected_time_in || "") || expectedOut !== (emp.expected_time_out || "");

  const saveHours = async () => {
    setSaving(true);
    await supabase.from("profiles").update({ 
      expected_time_in: expectedIn || null, 
      expected_time_out: expectedOut || null 
    }).eq("id", emp.id);
    onUpdate({ ...emp, expected_time_in: expectedIn, expected_time_out: expectedOut });
    setSaving(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.25 }}
      className="rounded-2xl border border-white/8 bg-white/5 p-5 hover:border-orange-500/20 hover:bg-white/8 hover:scale-[1.02] transition-all duration-200 group"
    >
      <div className="flex justify-between items-start mb-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
          {emp.full_name.charAt(0)}
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onDelete} className="text-white/20 hover:text-red-400 p-1">
            <UserX size={14} />
          </button>
        </div>
      </div>

      <p className="text-white font-semibold text-sm mb-0.5 truncate">{emp.full_name}</p>
      <p className="text-white/40 text-xs mb-3 truncate">{emp.position ?? "No position set"}</p>

      <div className="space-y-1.5 mb-5">
        <div className="flex items-center gap-2 text-white/30 text-xs">
          <Mail size={10} /> <span className="truncate">{emp.email}</span>
        </div>
        <div className="flex items-center gap-2 text-white/30 text-xs">
          <Building2 size={10} /> <span>{emp.department ?? "—"}</span>
        </div>
      </div>

      {/* Expected Hours */}
      <div className="bg-black/20 p-3 rounded-xl border border-white/5 mb-4">
        <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-2">Expected Hours</p>
        <div className="flex items-center gap-2">
          <input 
            type="time" 
            value={expectedIn} 
            onChange={e => setExpectedIn(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-orange-500/50"
          />
          <span className="text-white/20 text-xs">to</span>
          <input 
            type="time" 
            value={expectedOut} 
            onChange={e => setExpectedOut(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-orange-500/50"
          />
        </div>
        {isModified && (
          <button 
            onClick={saveHours} disabled={saving}
            className="w-full mt-2 py-1.5 bg-orange-500 hover:bg-orange-400 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors"
          >
            {saving ? "Saving..." : "Save Hours"}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-white/8 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onToggleRole}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-wide hover:bg-orange-500/20 transition-colors"
        >
          <UserCheck size={10} /> Promote Admin
        </button>
      </div>
    </motion.div>
  );
}

export default function EmployeesTab({ addToast }: { addToast: (t: any, m: string) => void }) {
  const [employees, setEmployees] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase.from("profiles").select("*").eq("role", "employee").then(({ data }) => {
      setEmployees(data ?? []);
    });
    // Realtime subscription
    const ch = supabase.channel("profiles-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        supabase.from("profiles").select("*").eq("role", "employee").then(({ data }) => setEmployees(data ?? []));
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const filtered = employees.filter(e =>
    e.full_name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    (e.department ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleRole = async (emp: Profile) => {
    const newRole = emp.role === "employee" ? "admin" : "employee";
    await supabase.from("profiles").update({ role: newRole }).eq("id", emp.id);
    setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, role: newRole } : e));
    addToast("success", `${emp.full_name} is now ${newRole}.`);
  };

  const handleUpdate = (updated: Profile) => {
    setEmployees(prev => prev.map(e => e.id === updated.id ? updated : e));
    addToast("success", "Expected hours updated.");
  };

  const handleDelete = async (emp: Profile) => {
    await supabase.from("profiles").delete().eq("id", emp.id);
    setEmployees(prev => prev.filter(e => e.id !== emp.id));
    addToast("info", `${emp.full_name} removed.`);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search employees…"
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-orange-500/50 transition-colors"
        />
      </div>

      {/* Cards Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((emp) => (
            <EmployeeCard 
              key={emp.id} 
              emp={emp} 
              onUpdate={handleUpdate}
              onToggleRole={() => handleToggleRole(emp)}
              onDelete={() => handleDelete(emp)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-white/30 text-sm text-center py-16">No employees found.</p>
      )}
    </div>
  );
}
