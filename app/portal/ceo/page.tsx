"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import type { Profile } from "../../../lib/supabase";
import PortalNav from "../../../components/portal/PortalNav";
import Toast, { useToast } from "../../../components/portal/Toast";
import CeoDashboardTab from "../../../components/portal/ceo/DashboardTab";
import CeoAnalyticsTab from "../../../components/portal/ceo/AnalyticsTab";
import CeoTransactionsTab from "../../../components/portal/ceo/TransactionsTab";
import CeoInvoicesTab from "../../../components/portal/ceo/InvoicesTab";
import CeoPaymentPlansTab from "../../../components/portal/ceo/PaymentPlansTab";
import CeoSalariesTab from "../../../components/portal/ceo/SalariesTab";
import CeoSettingsTab from "../../../components/portal/ceo/SettingsTab";
import { LayoutDashboard, BarChart3, ArrowLeftRight, FileText, Loader2, CreditCard, Users, Settings } from "lucide-react";

const TABS = [
  { id: "dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { id: "payment-plans",label: "Payment Plans",icon: CreditCard },
  { id: "transactions",label: "Transactions", icon: ArrowLeftRight },
  { id: "invoices",    label: "Invoices",     icon: FileText },
  { id: "salaries",    label: "Salaries",     icon: Users },
  { id: "analytics",   label: "Analytics",    icon: BarChart3 },
  { id: "settings",    label: "Settings",     icon: Settings },
];

export default function CeoPortal() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [globalCurrency, setGlobalCurrency] = useState<"USD" | "PKR">("USD");
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
      if (prof.role !== "ceo") {
        // Redirect non-CEO users to their correct portal
        router.replace(prof.role === "admin" ? "/portal/admin" : "/portal/employee");
        return;
      }
      setProfile(prof);
      setLoading(false);
    })();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-yellow-500" size={32} />
          <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Loading CEO Portal</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-yellow-500/20">
      {/* Ambient glow — gold palette for CEO */}
      <div className="fixed top-0 right-0 w-[700px] h-[700px] bg-yellow-600/4 rounded-full blur-[200px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-yellow-500/3 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-yellow-400/2 rounded-full blur-[120px] pointer-events-none" />

      <PortalNav userName={profile!.full_name} role="ceo" />

      <div className="max-w-[1400px] mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="text-yellow-500/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-1">Executive Dashboard</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},{" "}
            <span className="text-yellow-400">{profile!.full_name.split(" ")[0]}</span>
          </h1>
          <p className="text-white/30 text-sm mt-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </motion.div>

        {/* Tab Bar and Currency Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-1 p-1 bg-white/5 border border-white/8 rounded-2xl overflow-x-auto scrollbar-none max-w-full"
          >
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  activeTab === id
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center p-1 bg-white/5 border border-white/8 rounded-xl flex-shrink-0"
          >
            <button
              onClick={() => setGlobalCurrency("USD")}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all ${
                globalCurrency === "USD" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              USD
            </button>
            <button
              onClick={() => setGlobalCurrency("PKR")}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all ${
                globalCurrency === "PKR" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              PKR
            </button>
          </motion.div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "dashboard"     && <CeoDashboardTab    addToast={addToast} globalCurrency={globalCurrency} />}
          {activeTab === "payment-plans" && <CeoPaymentPlansTab addToast={addToast} />}
          {activeTab === "transactions" && <CeoTransactionsTab addToast={addToast} />}
          {activeTab === "invoices"     && <CeoInvoicesTab     addToast={addToast} />}
          {activeTab === "salaries"     && <CeoSalariesTab     addToast={addToast} />}
          {activeTab === "analytics"    && <CeoAnalyticsTab    addToast={addToast} />}
          {activeTab === "settings"     && <CeoSettingsTab     addToast={addToast} />}
        </motion.div>
      </div>

      <Toast toasts={toasts} remove={remove} />
    </main>
  );
}
