"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import type { Profile } from "../../../lib/supabase";
import PortalNav from "../../../components/portal/PortalNav";
import Toast, { useToast } from "../../../components/portal/Toast";
import ActiveTasksTab from "../../../components/portal/employee/ActiveTasksTab";
import AttendanceHistoryTab from "../../../components/portal/employee/AttendanceHistoryTab";
import CalendarTab from "../../../components/portal/admin/CalendarTab";
import TeamTab from "../../../components/portal/employee/TeamTab";
import OverviewTab from "../../../components/portal/employee/OverviewTab";
import { CheckSquare, Clock, CalendarDays, Users, LogIn, Coffee, LogOut, Loader2, LayoutDashboard } from "lucide-react";

const TABS = [
  { id: "overview",    label: "Overview",            icon: LayoutDashboard },
  { id: "tasks",       label: "Active Tasks",       icon: CheckSquare },
  { id: "attendance",  label: "Attendance History",  icon: Clock },
  { id: "calendar",    label: "Calendar",            icon: CalendarDays },
  { id: "team",        label: "Team",                icon: Users },
];

const ATTENDANCE_SEQUENCE = ["time_in", "break_start", "break_end", "time_out"] as const;
type AttEvent = typeof ATTENDANCE_SEQUENCE[number];

const BTN_META: Record<AttEvent, { label: string; icon: any; style: string }> = {
  time_in:     { label: "Time In",     icon: LogIn,    style: "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20" },
  break_start: { label: "Break Start", icon: Coffee,   style: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20" },
  break_end:   { label: "Break End",   icon: Coffee,   style: "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20" },
  time_out:    { label: "Time Out",    icon: LogOut,   style: "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20" },
};

export default function EmployeePortal() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [lastEvent, setLastEvent] = useState<AttEvent | null>(null);
  const [statusLabel, setStatusLabel] = useState("Clocked Out");
  const [attLoading, setAttLoading] = useState<AttEvent | null>(null);
  const { toasts, add: addToast, remove } = useToast();

  const refreshAttendanceState = useCallback(async (profileId: string) => {
    const today = new Date().toISOString().split("T")[0];
    const { data: logs } = await supabase
      .from("attendance_logs").select("event_type")
      .eq("profile_id", profileId).eq("date", today)
      .order("timestamp", { ascending: false }).limit(1);

    const last = logs?.[0]?.event_type as AttEvent | undefined;
    setLastEvent(last || null);

    if (!last || last === "time_out") {
      setStatusLabel("Clocked Out");
    } else if (last === "break_start") {
      setStatusLabel("🟡 On Break");
    } else {
      setStatusLabel("🟢 Working");
    }
  }, []);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/portal"); return; }
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      if (!prof) { 
        await supabase.auth.signOut();
        router.replace("/portal"); 
        return; 
      }
      if (prof.role === "admin") { router.replace("/portal/admin"); return; }
      setProfile(prof);
      await refreshAttendanceState(prof.id);
      setLoading(false);
    })();
  }, [router, refreshAttendanceState]);

  const handleAttendance = async (eventType: AttEvent) => {
    if (!profile) return;
    setAttLoading(eventType);
    const { error } = await supabase.from("attendance_logs").insert({
      profile_id: profile.id, event_type: eventType,
      timestamp: new Date().toISOString(), date: new Date().toISOString().split("T")[0],
    });
    if (error) { addToast("error", error.message); }
    else {
      const labels: Record<AttEvent, string> = {
        time_in: "Clocked in! Have a great day 🚀",
        break_start: "Enjoy your break ☕",
        break_end: "Welcome back!",
        time_out: "Clocked out. Great work today! 🎉",
      };
      addToast("success", labels[eventType]);
      await refreshAttendanceState(profile.id);
    }
    setAttLoading(null);
  };

  const isEnabled = (type: AttEvent) => {
    if (!lastEvent || lastEvent === "time_out") {
      return type === "time_in"; 
    }
    if (lastEvent === "time_in" || lastEvent === "break_end") {
      return type === "break_start" || type === "time_out";
    }
    if (lastEvent === "break_start") {
      return type === "break_end" || type === "time_out";
    }
    return false;
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-orange-500" size={32} />
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white selection:bg-orange-500/20">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[140px] pointer-events-none" />

      <PortalNav userName={profile!.full_name} role="employee" />

      <div className="max-w-[1400px] mx-auto px-6 pt-28 pb-16 space-y-6">
        {/* Attendance Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-white/8 bg-white/5 backdrop-blur-xl"
        >
          <div>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-0.5">Today's Status</p>
            <p className="text-white font-semibold text-sm">{statusLabel}</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {ATTENDANCE_SEQUENCE.map(type => {
              const meta = BTN_META[type];
              const enabled = isEnabled(type);
              const Icon = meta.icon;

              return (
                <motion.button
                  key={type}
                  whileTap={enabled ? { scale: 0.95 } : undefined}
                  onClick={() => handleAttendance(type)}
                  disabled={!enabled || attLoading !== null}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all 
                    ${enabled ? meta.style : "bg-white/5 border-white/10 text-white/30 cursor-not-allowed opacity-60"}`}
                >
                  {attLoading === type ? <Loader2 size={12} className="animate-spin" /> : <Icon size={12} />}
                  {meta.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex items-center gap-1 p-1 bg-white/5 border border-white/8 rounded-2xl overflow-x-auto scrollbar-none"
        >
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                activeTab === id
                  ? "bg-orange-500 text-white shadow-[0_0_16px_rgba(249,115,22,0.35)]"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5"
              }`}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {activeTab === "overview"   && <OverviewTab profile={profile!} />}
          {activeTab === "tasks"      && <ActiveTasksTab profileId={profile!.id} addToast={addToast} />}
          {activeTab === "attendance" && <AttendanceHistoryTab profileId={profile!.id} />}
          {activeTab === "calendar"   && <CalendarTab role="employee" addToast={addToast} />}
          {activeTab === "team"       && <TeamTab profileId={profile!.id} />}
        </motion.div>
      </div>

      <Toast toasts={toasts} remove={remove} />
    </main>
  );
}
