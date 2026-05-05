"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "../../../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet, TrendingUp, TrendingDown, DollarSign,
  PiggyBank, BarChart3, Plus, Pencil, Trash2, X, Check,
  ArrowUpRight, ArrowDownRight, Activity, CreditCard,
  ChevronDown, Layers, MoreHorizontal
} from "lucide-react";

interface Account {
  id: string; name: string;
  type: "checking" | "savings" | "investment" | "wallet";
  balance: number; currency: string; institution?: string; notes?: string;
}
interface Transaction {
  id: string; date: string; description: string; amount: number;
  type: "income" | "expense"; category: string; client_name?: string;
}
interface PaymentPlan {
  id: string; client_name: string; project_name: string;
  remaining_balance: number; installment_amount: number;
  total_installments: number; installments_paid: number;
  frequency: string; status: string; currency: string;
}
interface CurrencyRate {
  currency: string; to_pkr_rate: number;
}

const ACCOUNT_ICON: Record<string, React.ElementType> = {
  checking: DollarSign, savings: PiggyBank, investment: BarChart3, wallet: Wallet,
};
const ACCOUNT_COLOR: Record<string, string> = {
  checking: "text-blue-400 bg-blue-500/10",
  savings: "text-emerald-400 bg-emerald-500/10",
  investment: "text-violet-400 bg-violet-500/10",
  wallet: "text-orange-400 bg-orange-500/10",
};

export default function CeoDashboardTab({ addToast, globalCurrency }: {
  addToast: (type: "success" | "error" | "info", msg: string) => void;
  globalCurrency: "USD" | "PKR";
}) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentTxns, setRecentTxns] = useState<Transaction[]>([]);
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const [showAddAccount, setShowAddAccount] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [form, setForm] = useState({ name: "", type: "checking" as Account["type"], balance: "", institution: "", currency: "USD" });

  // Dropdown state for periods
  const [period, setPeriod] = useState<"This Month" | "Last 3 Months" | "This Year">("This Month");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [
      { data: accs },
      { data: txns },
      { data: plns },
      { data: currRates }
    ] = await Promise.all([
      supabase.from("financial_accounts").select("*").order("created_at"),
      supabase.from("transactions").select("*").order("date", { ascending: false }).limit(20),
      supabase.from("payment_plans").select("*").eq("status", "active").order("created_at", { ascending: false }).limit(4),
      supabase.from("currency_rates").select("*"),
    ]);

    setAccounts(accs ?? []);
    setRecentTxns(txns ?? []);
    setPlans(plns ?? []);

    const rMap: Record<string, number> = { USD: 278.5 }; // fallback
    currRates?.forEach(r => { rMap[r.currency] = r.to_pkr_rate; });
    setRates(rMap);

    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const convertAmount = useCallback((amount: number, fromCurr: string, toCurr: string) => {
    if (fromCurr === toCurr) return amount;
    // Convert to PKR first
    const fromRate = fromCurr === 'PKR' ? 1 : (rates[fromCurr] || rates['USD'] || 278.5);
    const inPkr = amount * fromRate;
    // Convert to target
    if (toCurr === 'PKR') return inPkr;
    const toRate = rates[toCurr] || rates['USD'] || 278.5;
    return inPkr / toRate;
  }, [rates]);

  const fmtMoney = useCallback((n: number, forceCurrency?: string) => {
    const c = forceCurrency || globalCurrency;
    return new Intl.NumberFormat("en-US", { style: "currency", currency: c, maximumFractionDigits: 0 }).format(n);
  }, [globalCurrency]);

  const totalBalance = useMemo(() => accounts.reduce((s, a) => s + convertAmount(a.balance, a.currency, globalCurrency), 0), [accounts, globalCurrency, convertAmount]);
  const totalSavings = useMemo(() => accounts.filter(a => a.type === "savings").reduce((s, a) => s + convertAmount(a.balance, a.currency, globalCurrency), 0), [accounts, globalCurrency, convertAmount]);
  const totalInvested = useMemo(() => accounts.filter(a => a.type === "investment").reduce((s, a) => s + convertAmount(a.balance, a.currency, globalCurrency), 0), [accounts, globalCurrency, convertAmount]);

  // Transactions are implicitly treated as USD currently unless noted. We'll assume USD for simplicity here, but convert.
  const netCashFlow = useMemo(() => recentTxns.reduce((s, t) => {
    const amt = convertAmount(t.amount, "USD", globalCurrency);
    return t.type === "income" ? s + amt : s - amt;
  }, 0), [recentTxns, globalCurrency, convertAmount]);

  const resetForm = () => setForm({ name: "", type: "checking", balance: "", institution: "", currency: globalCurrency });

  const handleSaveAccount = async () => {
    if (!form.name || !form.balance) { addToast("error", "Name and balance are required."); return; }
    const payload = { name: form.name, type: form.type, balance: parseFloat(form.balance), institution: form.institution, currency: form.currency };
    const { error } = editingAccount
      ? await supabase.from("financial_accounts").update(payload).eq("id", editingAccount.id)
      : await supabase.from("financial_accounts").insert(payload);
    if (error) { addToast("error", "Failed to save account."); return; }
    addToast("success", editingAccount ? "Account updated." : "Account added.");
    resetForm(); setShowAddAccount(false); setEditingAccount(null); load();
  };

  const handleDeleteAccount = async (id: string) => {
    const { error } = await supabase.from("financial_accounts").delete().eq("id", id);
    if (error) { addToast("error", "Failed to delete."); return; }
    addToast("success", "Account removed."); load();
  };

  const openEdit = (acc: Account) => {
    setEditingAccount(acc);
    setForm({ name: acc.name, type: acc.type, balance: String(acc.balance), institution: acc.institution ?? "", currency: acc.currency });
    setShowAddAccount(true);
  };

  // Mock graph data for Attio style
  const graphData = [
    { day: 'Mon', in: 400, out: 200 },
    { day: 'Tue', in: 300, out: 139 },
    { day: 'Wed', in: 200, out: 800 },
    { day: 'Thu', in: 278, out: 390 },
    { day: 'Fri', in: 189, out: 480 },
    { day: 'Sat', in: 239, out: 380 },
    { day: 'Sun', in: 349, out: 430 },
  ];
  const maxVal = Math.max(...graphData.map(d => Math.max(d.in, d.out)));

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-7 h-7 rounded-full border-2 border-yellow-500/30 border-t-yellow-400 animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col xl:flex-row gap-6 selection:bg-yellow-500/30 text-foreground">
      
      {/* ── Left Sidebar (Accounts & Settings) ───────────────────────── */}
      <div className="w-full xl:w-80 shrink-0 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xl relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-[50px] pointer-events-none rounded-full" />
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold flex items-center gap-2">
              <Layers size={16} className="opacity-40" />
              Accounts
            </h2>
            <button onClick={() => { resetForm(); setEditingAccount(null); setShowAddAccount(true); }}
              className="w-7 h-7 rounded-lg bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 text-foreground/50 transition-colors">
              <Plus size={14} />
            </button>
          </div>

          <div className="space-y-3 relative z-10">
            {accounts.map(acc => {
              const Icon = ACCOUNT_ICON[acc.type] ?? Wallet;
              return (
                <div key={acc.id} className="group relative rounded-xl border border-border bg-foreground/[0.02] p-3.5 hover:bg-foreground/[0.05] transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${ACCOUNT_COLOR[acc.type]}`}>
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate leading-tight">{acc.name}</p>
                      <p className="opacity-30 text-[10px] truncate">{acc.type} {acc.currency}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <button onClick={() => openEdit(acc)} className="p-1 hover:text-foreground opacity-40"><Pencil size={12} /></button>
                      <button onClick={() => handleDeleteAccount(acc.id)} className="p-1 hover:text-red-500 opacity-40"><Trash2 size={12} /></button>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="opacity-30 text-[9px] uppercase tracking-widest font-bold mb-0.5">Balance</p>
                      <p className="font-bold font-mono text-sm">{fmtMoney(convertAmount(acc.balance, acc.currency, globalCurrency))}</p>
                    </div>
                    {acc.currency !== globalCurrency && (
                      <p className="opacity-20 text-[9px] font-mono">({fmtMoney(acc.balance, acc.currency)})</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main Dashboard Area ───────────────────────────────────────── */}
      <div className="flex-1 space-y-6 min-w-0">
        
        {/* Top KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Net Worth",    value: totalBalance,  icon: DollarSign,  color: "text-foreground",        bg: "bg-card border-border shadow-sm" },
            { label: "Savings",      value: totalSavings,  icon: PiggyBank,   color: "text-emerald-500",  bg: "bg-emerald-500/5 border-emerald-500/10" },
            { label: "Invested",     value: totalInvested, icon: BarChart3,   color: "text-violet-500",   bg: "bg-violet-500/5 border-violet-500/10" },
            { label: "Recent Flow",  value: netCashFlow,   icon: Activity,    color: netCashFlow >= 0 ? "text-emerald-500" : "text-red-500", bg: netCashFlow >= 0 ? "bg-emerald-500/5 border-emerald-500/10" : "bg-red-500/5 border-red-500/10" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border ${bg} p-5 relative overflow-hidden group transition-all duration-300`}>
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-foreground/5 rounded-full blur-xl group-hover:bg-foreground/10 transition-colors" />
              <p className="opacity-40 text-[10px] font-bold uppercase tracking-widest mb-1.5 flex items-center justify-between">
                {label} <Icon size={12} className="opacity-20" />
              </p>
              <p className={`text-2xl font-bold tracking-tight font-mono ${color}`}>{fmtMoney(value)}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-foreground">Cash Flow Overview</h3>
              <p className="opacity-30 text-xs">Income vs Expenses tracking</p>
            </div>
            
            {/* Period Dropdown */}
            <div className="relative">
              <button onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-foreground/5 border border-border hover:bg-foreground/10 transition-colors text-xs font-medium">
                {period} <ChevronDown size={14} />
              </button>
              <AnimatePresence>
                {showPeriodDropdown && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 mt-2 w-40 rounded-xl border border-border bg-card shadow-2xl z-20 py-1 overflow-hidden">
                    {(["This Month", "Last 3 Months", "This Year"] as const).map(p => (
                      <button key={p} onClick={() => { setPeriod(p); setShowPeriodDropdown(false); }}
                        className={`w-full text-left px-4 py-2 text-xs transition-colors ${period === p ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 font-bold" : "opacity-60 hover:opacity-100 hover:bg-foreground/5"}`}>
                        {p}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Minimalist Bar Chart */}
          <div className="h-48 flex items-end justify-between gap-2 px-2">
            {graphData.map((d, i) => {
              const inPct = Math.max(5, (d.in / maxVal) * 100);
              const outPct = Math.max(5, (d.out / maxVal) * 100);
              return (
                <div key={i} className="flex flex-col items-center gap-3 flex-1 group">
                  <div className="flex items-end justify-center gap-1.5 w-full h-full relative">
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-card border border-border px-2 py-1 rounded text-[9px] font-mono flex flex-col items-center pointer-events-none z-10 shadow-xl">
                      <span className="text-emerald-500 font-bold">{d.in}</span>
                      <span className="text-red-500 font-bold">{d.out}</span>
                    </div>
                    {/* Bars */}
                    <motion.div initial={{ height: 0 }} animate={{ height: `${inPct}%` }} transition={{ duration: 0.8, delay: i * 0.05 }}
                      className="w-full max-w-[12px] bg-emerald-500/80 rounded-t-sm" />
                    <motion.div initial={{ height: 0 }} animate={{ height: `${outPct}%` }} transition={{ duration: 0.8, delay: i * 0.05 + 0.1 }}
                      className="w-full max-w-[12px] bg-red-500/80 rounded-t-sm" />
                  </div>
                  <span className="opacity-30 text-[10px] font-medium">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two Columns: Activity & Payments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Active Payment Plans */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col shadow-lg transition-all duration-300">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <CreditCard size={16} className="opacity-40" /> Scheduled Inflows
              </h3>
            </div>
            <div className="divide-y divide-border flex-1">
              {plans.length === 0 ? (
                <p className="opacity-20 text-xs text-center py-8">No active payment plans.</p>
              ) : plans.map(p => {
                const pct = Math.round((p.installments_paid / p.total_installments) * 100);
                const remPkr = convertAmount(p.remaining_balance, p.currency || "USD", globalCurrency);
                return (
                  <div key={p.id} className="p-5 hover:bg-foreground/[0.02] transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="opacity-80 text-sm font-semibold">{p.client_name}</p>
                        <p className="opacity-30 text-[10px]">{p.project_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-600 dark:text-yellow-500 font-bold font-mono text-sm">{fmtMoney(remPkr)}</p>
                        <p className="opacity-30 text-[10px]">remaining</p>
                      </div>
                    </div>
                    <div className="h-1.5 bg-foreground/5 rounded-full overflow-hidden mb-2">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full" />
                    </div>
                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest opacity-30">
                      <span>{pct}% Collected</span>
                      <span>{p.total_installments - p.installments_paid}x {p.frequency}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Ledger */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col shadow-lg transition-all duration-300">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <Activity size={16} className="opacity-40" /> Recent Ledger
              </h3>
            </div>
            <div className="divide-y divide-border flex-1">
              {recentTxns.length === 0 ? (
                <p className="opacity-20 text-xs text-center py-8">No transactions found.</p>
              ) : recentTxns.slice(0, 6).map(t => {
                const amt = convertAmount(t.amount, "USD", globalCurrency);
                return (
                  <div key={t.id} className="p-4 hover:bg-foreground/[0.02] transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${t.type === "income" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}`}>
                        {t.type === "income" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      </div>
                      <div>
                        <p className="opacity-80 text-xs font-semibold">{t.description}</p>
                        <p className="opacity-30 text-[10px]">{new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {t.category}</p>
                      </div>
                    </div>
                    <p className={`text-sm font-bold font-mono ${t.type === "income" ? "text-emerald-600" : "opacity-80"}`}>
                      {t.type === "income" ? "+" : "−"}{fmtMoney(amt)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ── Add / Edit Account Modal ────────────────────────────────────── */}
      <AnimatePresence>
        {showAddAccount && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold">{editingAccount ? "Edit Account" : "Add Account"}</h3>
                <button onClick={() => { setShowAddAccount(false); resetForm(); setEditingAccount(null); }} className="opacity-30 hover:opacity-100 transition-colors"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                {([
                  { label: "Account Name", key: "name", type: "text", placeholder: "e.g. Primary Checking" },
                  { label: `Balance (${globalCurrency})`, key: "balance", type: "number", placeholder: "0" },
                  { label: "Institution (Optional)", key: "institution", type: "text", placeholder: "e.g. Chase Bank" },
                ] as const).map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="opacity-40 text-[10px] font-bold uppercase tracking-widest block mb-1.5">{label}</label>
                    <input type={type} placeholder={placeholder} value={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-yellow-500/50 transition-colors" />
                  </div>
                ))}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="opacity-40 text-[10px] font-bold uppercase tracking-widest block mb-1.5">Type</label>
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as Account["type"] }))}
                      className="w-full bg-foreground/5 border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-yellow-500/50 appearance-none">
                      {["checking","savings","investment","wallet"].map(t => <option key={t} value={t} className="bg-card">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="opacity-40 text-[10px] font-bold uppercase tracking-widest block mb-1.5">Currency</label>
                    <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                      className="w-full bg-foreground/5 border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-yellow-500/50 appearance-none">
                      {["USD","PKR","EUR","GBP"].map(t => <option key={t} value={t} className="bg-card">{t}</option>)}
                    </select>
                  </div>
                </div>

                <button onClick={handleSaveAccount}
                  className="w-full flex items-center justify-center gap-2 py-3 mt-4 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg shadow-yellow-500/20">
                  <Check size={16} /> {editingAccount ? "Save Changes" : "Add Account"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
