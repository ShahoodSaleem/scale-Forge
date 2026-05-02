"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase, type Profile } from "../../../lib/supabase";
import { Users, CheckSquare, Clock, AlertTriangle, MoreHorizontal, Edit2, Trash2 } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  Working:  "bg-green-500",
  Break:    "bg-yellow-500",
  Offline:  "bg-white/20",
};

function StatCard({ label, value, icon: Icon, gradient, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative rounded-2xl border border-white/8 bg-white/5 backdrop-blur-xl p-6 overflow-hidden group hover:border-white/15 hover:scale-[1.02] transition-all duration-300"
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient} blur-[60px]`} />
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">{label}</p>
          <p className="text-4xl font-bold text-white">{value}</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/8">
          <Icon size={18} className="text-orange-400" />
        </div>
      </div>
    </motion.div>
  );
}

function EmployeeCard({ emp, onRemove }: { emp: Profile & { status: string }; onRemove: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 p-4 rounded-xl border border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15 transition-all duration-200 group"
    >
      {/* Avatar */}
      <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
        {emp.full_name.charAt(0)}
        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${STATUS_COLORS[emp.status] ?? "bg-white/20"} ${emp.status === "Working" ? "animate-pulse" : ""}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold truncate">{emp.full_name}</p>
        <p className="text-white/40 text-xs truncate">{emp.position ?? emp.department ?? emp.email}</p>
      </div>

      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
        emp.status === "Working" ? "bg-green-500/10 border-green-500/30 text-green-400" :
        emp.status === "Break"   ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" :
                                   "bg-white/5 border-white/10 text-white/30"
      }`}>{emp.status}</span>

      {/* Actions */}
      <div className="relative">
        <button onClick={() => setOpen(v => !v)} className="p-1.5 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/8 transition-colors opacity-0 group-hover:opacity-100">
          <MoreHorizontal size={15} />
        </button>
        {open && (
          <div className="absolute right-0 top-8 z-30 bg-black border border-white/10 rounded-xl overflow-hidden shadow-2xl w-36">
            <button className="flex items-center gap-2 px-4 py-2.5 text-xs text-white/60 hover:text-white hover:bg-white/5 w-full transition-colors">
              <Edit2 size={12} /> Edit
            </button>
            <button onClick={onRemove} className="flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 w-full transition-colors">
              <Trash2 size={12} /> Remove
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function OverviewTab({ addToast }: { addToast: (t: any, m: string) => void }) {
  const [employees, setEmployees] = useState<(Profile & { status: string })[]>([]);
  const [stats, setStats] = useState({ active: 0, tasks: 0, live: 0, alerts: 0 });

  useEffect(() => {
    (async () => {
      const { data: profiles } = await supabase.from("profiles").select("*").eq("role", "employee");
      const { data: tasks } = await supabase.from("tasks").select("id").neq("status", "done");

      // Get today's attendance to compute status
      const today = new Date().toISOString().split("T")[0];
      const { data: logs } = await supabase.from("attendance_logs").select("profile_id, event_type").eq("date", today);

      const statusMap: Record<string, string> = {};
      (logs ?? []).forEach((l: any) => {
        if (l.event_type === "time_in")     statusMap[l.profile_id] = "Working";
        if (l.event_type === "break_start") statusMap[l.profile_id] = "Break";
        if (l.event_type === "break_end")   statusMap[l.profile_id] = "Working";
        if (l.event_type === "time_out")    statusMap[l.profile_id] = "Offline";
      });

      const emps = (profiles ?? []).map((p: Profile) => ({ ...p, status: statusMap[p.id] ?? "Offline" }));
      const live = emps.filter(e => e.status === "Working").length;
      setEmployees(emps);
      setStats({ active: emps.length, tasks: tasks?.length ?? 0, live, alerts: 0 });
    })();
  }, []);

  const STAT_CARDS = [
    { label: "Total Employees", value: stats.active, icon: Users, gradient: "bg-blue-500/10", delay: 0 },
    { label: "Active Tasks",    value: stats.tasks,  icon: CheckSquare, gradient: "bg-orange-500/10", delay: 0.1 },
    { label: "Live Right Now",  value: stats.live,   icon: Clock,  gradient: "bg-green-500/10", delay: 0.2 },
    { label: "Alerts",          value: stats.alerts, icon: AlertTriangle, gradient: "bg-red-500/10", delay: 0.3 },
  ];

  const handleRemove = async (id: string) => {
    await supabase.from("profiles").delete().eq("id", id);
    setEmployees(prev => prev.filter(e => e.id !== id));
    addToast("success", "Employee removed.");
  };

  return (
    <div className="space-y-10">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Employee List */}
      <div>
        <h2 className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-4">Team Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {employees.length === 0 && (
            <p className="text-white/30 text-sm col-span-2 py-8 text-center">No employees yet — use Onboarding to add team members.</p>
          )}
          {employees.map(emp => (
            <EmployeeCard key={emp.id} emp={emp} onRemove={() => handleRemove(emp.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}
