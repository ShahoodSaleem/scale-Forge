"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, TrendingDown, Filter, Search,
  Download, Plus, X, Check, ChevronDown
} from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  client_name?: string;
  notes?: string;
}

const CATEGORIES = ["general", "client_payment", "payroll", "rent", "software", "marketing", "utilities", "other"];



function exportToCSV(data: Transaction[]) {
  const headers = ["Date", "Description", "Amount", "Type", "Category", "Client"];
  const rows = data.map(t => [
    t.date, `"${t.description}"`, t.amount, t.type, t.category, t.client_name ?? ""
  ]);
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "transactions.csv"; a.click();
  URL.revokeObjectURL(url);
}

export default function CeoTransactionsTab({ addToast, globalCurrency = "USD", rates = {} }: {
  addToast: (type: "success" | "error" | "info", msg: string) => void;
  globalCurrency?: "USD" | "PKR";
  rates?: Record<string, number>;
}) {
  // Transactions are stored in USD. Convert to globalCurrency for display.
  const usdToPkr = rates["USD"] ?? 278.5;
  const convert = (usd: number) => globalCurrency === "PKR" ? usd * usdToPkr : usd;
  const fmtMoney = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: globalCurrency, maximumFractionDigits: 0 }).format(n);
  const [txns, setTxns]         = useState<Transaction[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filterType, setFilterType]       = useState<"all" | "income" | "expense">("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterClient, setFilterClient]   = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo]     = useState("");
  const [showAdd, setShowAdd]   = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "", amount: "", type: "income" as "income" | "expense",
    category: "general", client_name: "", notes: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("transactions").select("*").order("date", { ascending: false });
    setTxns(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = txns.filter(t => {
    if (filterType !== "all" && t.type !== filterType) return false;
    if (filterCategory !== "all" && t.category !== filterCategory) return false;
    if (filterClient && !t.client_name?.toLowerCase().includes(filterClient.toLowerCase())) return false;
    if (dateFrom && t.date < dateFrom) return false;
    if (dateTo && t.date > dateTo) return false;
    if (search && !t.description.toLowerCase().includes(search.toLowerCase()) &&
        !t.client_name?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalIncome  = filtered.filter(t => t.type === "income").reduce((s, t) => s + convert(t.amount), 0);
  const totalExpense = filtered.filter(t => t.type === "expense").reduce((s, t) => s + convert(t.amount), 0);

  const handleAdd = async () => {
    if (!form.description || !form.amount) { addToast("error", "Description and amount are required."); return; }
    const { error } = await supabase.from("transactions").insert({
      date: form.date, description: form.description,
      amount: parseFloat(form.amount), type: form.type,
      category: form.category, client_name: form.client_name || null, notes: form.notes || null,
    });
    if (error) { addToast("error", "Failed to add transaction."); return; }
    addToast("success", "Transaction added.");
    setShowAdd(false);
    setForm({ date: new Date().toISOString().split("T")[0], description: "", amount: "", type: "income", category: "general", client_name: "", notes: "" });
    load();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) { addToast("error", "Failed to delete."); return; }
    addToast("success", "Transaction deleted.");
    load();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 rounded-full border-2 border-yellow-500/30 border-t-yellow-400 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Filtered Income", value: fmtMoney(totalIncome), color: "text-green-400", border: "border-green-500/20 bg-green-500/5" },
          { label: "Filtered Expenses", value: fmtMoney(totalExpense), color: "text-red-400", border: "border-red-500/20 bg-red-500/5" },
          { label: "Net", value: fmtMoney(totalIncome - totalExpense), color: totalIncome >= totalExpense ? "text-green-400" : "text-red-400", border: "border-white/10 bg-white/3" },
        ].map(c => (
          <div key={c.label} className={`rounded-2xl border p-4 ${c.border}`}>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">{c.label}</p>
            <p className={`text-xl font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions…"
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 outline-none focus:border-yellow-500/50 transition-all" />
        </div>
        <div className="flex gap-1 p-1 bg-white/5 border border-white/8 rounded-xl">
          {(["all","income","expense"] as const).map(v => (
            <button key={v} onClick={() => setFilterType(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${filterType === v ? "bg-yellow-500 text-black" : "text-white/40 hover:text-white/70"}`}>
              {v}
            </button>
          ))}
        </div>
        <button onClick={() => setShowFilters(v => !v)}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-xs font-bold hover:bg-white/10 transition-all">
          <Filter size={12} /> Filters <ChevronDown size={12} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>
        <button onClick={() => exportToCSV(filtered)}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-xs font-bold hover:bg-white/10 transition-all">
          <Download size={12} /> CSV
        </button>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold hover:bg-yellow-500/20 transition-all">
          <Plus size={12} /> Add
        </button>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl border border-white/8 bg-white/3">
              <div>
                <label className="text-white/30 text-[9px] font-bold uppercase tracking-widest block mb-1.5">Category</label>
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-yellow-500/50">
                  <option value="all" className="bg-black">All categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/30 text-[9px] font-bold uppercase tracking-widest block mb-1.5">Client</label>
                <input value={filterClient} onChange={e => setFilterClient(e.target.value)} placeholder="Filter by client…"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/20 outline-none focus:border-yellow-500/50" />
              </div>
              <div>
                <label className="text-white/30 text-[9px] font-bold uppercase tracking-widest block mb-1.5">From Date</label>
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-yellow-500/50" />
              </div>
              <div>
                <label className="text-white/30 text-[9px] font-bold uppercase tracking-widest block mb-1.5">To Date</label>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-yellow-500/50" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transactions Table */}
      <div className="rounded-2xl border border-white/8 overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-0 bg-white/3 px-5 py-3 text-[9px] font-bold uppercase tracking-widest text-white/30 border-b border-white/8">
          <span>Description</span><span className="text-right pr-4">Category</span><span className="text-right pr-4">Client</span><span className="text-right pr-4">Date</span><span className="text-right">Amount</span>
        </div>
        {filtered.length === 0 ? (
          <p className="text-center text-white/30 text-sm py-10">No transactions match your filters.</p>
        ) : (
          filtered.map((t, i) => (
            <div key={t.id}
              className={`group grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-0 px-5 py-3.5 hover:bg-white/3 transition-colors ${i !== filtered.length - 1 ? "border-b border-white/5" : ""}`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${t.type === "income" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
                  {t.type === "income" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                </div>
                <div className="min-w-0">
                  <p className="text-white/80 text-sm font-medium truncate">{t.description}</p>
                  {t.notes && <p className="text-white/30 text-xs truncate">{t.notes}</p>}
                </div>
              </div>
              <span className="text-white/40 text-xs pr-4 text-right">{t.category}</span>
              <span className="text-white/40 text-xs pr-4 text-right">{t.client_name ?? "—"}</span>
              <span className="text-white/30 text-xs pr-4 text-right font-mono">{new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}</span>
              <div className="flex items-center gap-2 justify-end">
                <span className={`text-sm font-bold font-mono ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>
                  {t.type === "income" ? "+" : "-"}{fmtMoney(convert(t.amount))}
                </span>
                <button onClick={() => handleDelete(t.id)}
                  className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all p-1 rounded">
                  <X size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-black/90 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold text-lg">Add Transaction</h3>
                <button onClick={() => setShowAdd(false)} className="text-white/40 hover:text-white transition-colors"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl">
                  {(["income","expense"] as const).map(v => (
                    <button key={v} onClick={() => setForm(f => ({ ...f, type: v }))}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${form.type === v ? (v === "income" ? "bg-green-500 text-white" : "bg-red-500 text-white") : "text-white/40 hover:text-white/70"}`}>
                      {v}
                    </button>
                  ))}
                </div>
                {[
                  { label: "Description", key: "description", type: "text", placeholder: "e.g. Project payment from client" },
                  { label: "Amount", key: "amount", type: "number", placeholder: "0.00" },
                  { label: "Client Name", key: "client_name", type: "text", placeholder: "Optional" },
                  { label: "Date", key: "date", type: "date", placeholder: "" },
                  { label: "Notes", key: "notes", type: "text", placeholder: "Optional notes" },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="text-white/40 text-[9px] font-bold uppercase tracking-widest block mb-1.5">{label}</label>
                    <input type={type} placeholder={placeholder} value={form[key as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-500/50 transition-all" />
                  </div>
                ))}
                <div>
                  <label className="text-white/40 text-[9px] font-bold uppercase tracking-widest block mb-1.5">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-500/50">
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
                  </select>
                </div>
                <button onClick={handleAdd}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold text-sm hover:from-yellow-400 hover:to-yellow-500 transition-all">
                  <Check size={15} /> Add Transaction
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

