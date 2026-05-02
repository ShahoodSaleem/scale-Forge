"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import type { Profile } from "../../../lib/supabase";
import PortalNav from "../../../components/portal/PortalNav";
import Toast, { useToast } from "../../../components/portal/Toast";
import OverviewTab from "../../../components/portal/admin/OverviewTab";
import EmployeesTab from "../../../components/portal/admin/EmployeesTab";
import TasksTab from "../../../components/portal/admin/TasksTab";
import AttendanceTab from "../../../components/portal/admin/AttendanceTab";
import CalendarTab from "../../../components/portal/admin/CalendarTab";
import TeamsTab from "../../../components/portal/admin/TeamsTab";
import OnboardingTab from "../../../components/portal/admin/OnboardingTab";
import { LayoutDashboard, Users, CheckSquare, Clock, CalendarDays, Network, UserPlus, Loader2 } from "lucide-react";

const TABS = [
  { id: "overview",    label: "Overview",    icon: LayoutDashboard },
  { id: "employees",   label: "Employees",   icon: Users },
  { id: "tasks",       label: "Tasks",       icon: CheckSquare },
  { id: "attendance",  label: "Attendance",  icon: Clock },
  { id: "calendar",    label: "Calendar",    icon: CalendarDays },
  { id: "teams",       label: "Teams",       icon: Network },
  { id: "onboarding",  label: "Onboarding",  icon: UserPlus },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const { toasts, add: addToast, remove } = useToast();

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/portal"); return; }
      const { data: prof } = await supabase
        .from("profiles").select("*").eq("id", session.user.id).single();
      if (!prof) { 
        await supabase.auth.signOut();
        router.replace("/portal"); 
        return; 
      }
      if (prof.role !== "admin") { router.replace("/portal/employee"); return; }
      setProfile(prof);
      setLoading(false);
    })();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={32} />
      </div>
    );
  }

  const sharedProps = { addToast };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-orange-500/20">
      {/* Ambient background */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/3 rounded-full blur-[120px] pointer-events-none" />

      <PortalNav userName={profile!.full_name} role="admin" />

      <div className="max-w-[1400px] mx-auto px-6 pt-28 pb-16">
        {/* Tab Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-1 p-1 bg-white/5 border border-white/8 rounded-2xl mb-10 overflow-x-auto scrollbar-none"
        >
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                activeTab === id
                  ? "bg-orange-500 text-white shadow-[0_0_16px_rgba(249,115,22,0.35)]"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5"
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {activeTab === "overview"   && <OverviewTab {...sharedProps} />}
          {activeTab === "employees"  && <EmployeesTab {...sharedProps} />}
          {activeTab === "tasks"      && <TasksTab {...sharedProps} />}
          {activeTab === "attendance" && <AttendanceTab {...sharedProps} />}
          {activeTab === "calendar"   && <CalendarTab {...sharedProps} />}
          {activeTab === "teams"      && <TeamsTab {...sharedProps} />}
          {activeTab === "onboarding" && <OnboardingTab {...sharedProps} />}
        </motion.div>
      </div>

      <Toast toasts={toasts} remove={remove} />
    </main>
  );
}
