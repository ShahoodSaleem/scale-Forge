"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, X, Check, Pencil, ChevronRight, ChevronDown,
  Clock, CheckCircle2, PauseCircle, XCircle, DollarSign
} from "lucide-react";

interface PaymentPlan {
  id: string;
  client_name: string;
  project_name: string;
  total_amount: number;
  upfront_amount: number;
  upfront_paid: boolean;
  remaining_balance: number;
  installment_amount: number;
  frequency: "monthly" | "bimonthly" | "quarterly";
  total_installments: number;
  installments_paid: number;
  start_date: string;
  status: "active" | "completed" | "paused" | "cancelled";
  notes?: string;
  currency: string;
}

const STATUS_CFG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  active: { label: "Active", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20", icon: Clock },
  completed: { label: "Completed", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 },
  paused: { label: "Paused", color: "text-white/40 bg-white/5 border-white/10", icon: PauseCircle },
  cancelled: { label: "Cancelled", color: "text-red-400 bg-red-500/10 border-red-500/20", icon: XCircle },
};

const FREQ_LABEL: Record<string, string> = {
  monthly: "Monthly", bimonthly: "Bi-Monthly", quarterly: "Quarterly",
};




const emptyForm = {
  client_name: "", project_name: "", total_amount: "", upfront_amount: "",
  installment_amount: "", frequency: "monthly" as PaymentPlan["frequency"],
  total_installments: "", installments_paid: "0", start_date: new Date().toISOString().split("T")[0],
  status: "active" as PaymentPlan["status"], notes: "", currency: "USD",
};

export default function CeoPaymentPlansTab({ addToast, globalCurrency = "USD", rates = {} }: {
  addToast: (type: "success" | "error" | "info", msg: string) => void;
  globalCurrency?: "USD" | "PKR";
  rates?: Record<string, number>;
}) {
  // Bridge conversion: stored_currency -> PKR -> globalCurrency
  const convertPlan = (amount: number, storedCurr: string) => {
    const fromRate = storedCurr === "PKR" ? 1 : (rates[storedCurr] ?? rates["USD"] ?? 278.5);
    const inPkr = amount * fromRate;
    if (globalCurrency === "PKR") return inPkr;
    const toRate = rates[globalCurrency] ?? rates["USD"] ?? 278.5;
    return inPkr / toRate;
  };
  const fmtMoney = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: globalCurrency, maximumFractionDigits: 0 }).format(n);
  const getUsdAmount = (amount: number, currency: string) => {
    const usdToPkr = rates["USD"] ?? 278.5;
    if (currency === "USD") return amount;
    const fromRate = currency === "PKR" ? 1 : (rates[currency] || usdToPkr);
    const inPkr = amount * fromRate;
    return inPkr / usdToPkr;
  };
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PaymentPlan | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | PaymentPlan["status"]>("all");
  const [form, setForm] = useState({ ...emptyForm });

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("payment_plans").select("*").order("created_at", { ascending: false });
    setPlans(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = plans.filter(p => filterStatus === "all" || p.status === filterStatus);

  // Summaries
  const totalOutstanding = plans.filter(p => p.status === "active").reduce((s, p) => s + convertPlan(p.remaining_balance, p.currency || "USD"), 0);
  const totalCollected = plans.reduce((s, p) => s + convertPlan((p.upfront_paid ? p.upfront_amount : 0) + p.installments_paid * p.installment_amount, p.currency || "USD"), 0);
  const activePlans = plans.filter(p => p.status === "active").length;

  const openEdit = (p: PaymentPlan) => {
    setEditing(p);
    setForm({
      client_name: p.client_name, project_name: p.project_name,
      total_amount: String(p.total_amount), upfront_amount: String(p.upfront_amount),
      installment_amount: String(p.installment_amount), frequency: p.frequency,
      total_installments: String(p.total_installments), installments_paid: String(p.installments_paid),
      start_date: p.start_date, status: p.status, notes: p.notes ?? "", currency: p.currency || "USD",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.client_name || !form.project_name || !form.total_amount || !form.installment_amount || !form.total_installments) {
      addToast("error", "Fill in all required fields."); return;
    }
    const total = parseFloat(form.total_amount);
    const upfront = parseFloat(form.upfront_amount) || 0;
    const installAmt = parseFloat(form.installment_amount);
    const totalInst = parseInt(form.total_installments);
    const paidInst = parseInt(form.installments_paid) || 0;
    const remaining = total - upfront - (paidInst * installAmt);

    const payload = {
      client_name: form.client_name, project_name: form.project_name,
      total_amount: total, upfront_amount: upfront,
      remaining_balance: Math.max(0, remaining),
      installment_amount: installAmt, frequency: form.frequency,
      total_installments: totalInst, installments_paid: paidInst,
      start_date: form.start_date, status: form.status, notes: form.notes || null, currency: form.currency,
    };

    const { error } = editing
      ? await supabase.from("payment_plans").update(payload).eq("id", editing.id)
      : await supabase.from("payment_plans").insert(payload);

    if (error) {
      console.error(error);
      addToast("error", `Failed to save plan: ${error.message}`);
      return;
    }

    // NOTE: Upfront payment recording is now handled manually via the "Advance Payment Paid" button
    // as requested, to allow marking it as paid AFTER plan creation.


    // If installments were marked as paid during creation
    if (!editing && paidInst > 0) {
      const { error: txnError } = await supabase.from("transactions").insert({
        date: new Date().toISOString().split("T")[0],
        description: `Initial Paid Installments (${paidInst}): ${form.project_name} (${form.client_name})`,
        amount: getUsdAmount(paidInst * installAmt, form.currency),
        type: "income",
        category: "client_payment",
        client_name: form.client_name,
        notes: `Initial ${paidInst} installments recorded during plan creation. Original: ${paidInst * installAmt} ${form.currency}`,
      });
      if (txnError) {
        console.error("Failed to record initial installments transaction:", txnError);
      }
    }

    addToast("success", editing ? "Plan updated." : "Payment plan created.");
    setShowForm(false); setEditing(null); setForm({ ...emptyForm }); load();
  };

  const recordPayment = async (p: PaymentPlan) => {
    if (p.installments_paid >= p.total_installments) { addToast("info", "All installments already paid."); return; }
    const newPaid = p.installments_paid + 1;
    const newRemaining = Math.max(0, p.remaining_balance - p.installment_amount);
    const newStatus = newPaid >= p.total_installments ? "completed" : p.status;
    const { error } = await supabase.from("payment_plans").update({
      installments_paid: newPaid, remaining_balance: newRemaining, status: newStatus,
    }).eq("id", p.id);
    if (error) { addToast("error", "Failed to record payment."); return; }

    // Create transaction for installment
    const { error: txnError } = await supabase.from("transactions").insert({
      date: new Date().toISOString().split("T")[0],
      description: `Installment #${newPaid}: ${p.project_name} (${p.client_name})`,
      amount: getUsdAmount(p.installment_amount, p.currency || "USD"),
      type: "income",
      category: "client_payment",
      client_name: p.client_name,
      notes: `Installment ${newPaid}/${p.total_installments} for ${p.project_name}. Original: ${p.installment_amount} ${p.currency || "USD"}`,
    });

    if (txnError) {
      console.error("Failed to record installment transaction:", txnError);
      addToast("error", "Payment recorded in plan, but failed to record transaction.");
    }

    addToast("success", newStatus === "completed" ? `✓ Plan for ${p.client_name} fully paid!` : `Payment #${newPaid} recorded for ${p.client_name}.`);
    load();
  };
  
  const recordUpfrontPayment = async (p: PaymentPlan) => {
    if (p.upfront_paid) { addToast("info", "Upfront payment already recorded."); return; }
    
    // Update the plan
    const { error } = await supabase.from("payment_plans").update({
      upfront_paid: true
    }).eq("id", p.id);
    
    if (error) { addToast("error", "Failed to mark upfront as paid."); return; }
    
    // Create transaction
    const { error: txnError } = await supabase.from("transactions").insert({
      date: new Date().toISOString().split("T")[0],
      description: `Advanced payment: ${p.client_name}`,
      amount: getUsdAmount(p.upfront_amount, p.currency || "USD"),
      type: "income",
      category: "client_payment",
      client_name: p.client_name,
      notes: `Advanced payment for ${p.project_name}: ${p.upfront_amount} ${p.currency || "USD"}`,
    });
    
    if (txnError) {
      console.error("Failed to record upfront transaction:", txnError);
      addToast("error", "Upfront marked as paid in plan, but failed to record transaction.");
    } else {
      addToast("success", `Advanced payment for ${p.client_name} recorded.`);
    }
    
    load();
  };

  const updateStatus = async (id: string, status: PaymentPlan["status"]) => {
    const { error } = await supabase.from("payment_plans").update({ status }).eq("id", id);
    if (error) { addToast("error", "Failed to update status."); return; }
    addToast("success", `Status updated to ${status}.`); load();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("payment_plans").delete().eq("id", id);
    if (error) { addToast("error", "Failed to delete."); return; }
    addToast("success", "Plan deleted."); load();
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-7 h-7 rounded-full border-2 border-yellow-500/30 border-t-yellow-400 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Summary Strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Outstanding", value: fmtMoney(totalOutstanding), sub: `${activePlans} active plan${activePlans !== 1 ? "s" : ""}`, color: "text-yellow-600 dark:text-yellow-400" },
          { label: "Total Collected", value: fmtMoney(totalCollected), sub: "across all plans", color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Total Plans", value: String(plans.length), sub: `${plans.filter(p => p.status === "completed").length} completed`, color: "text-foreground" },
        ].map(c => (
          <div key={c.label} className="rounded-xl border border-border bg-card px-5 py-4 shadow-sm transition-all">
            <p className="opacity-40 text-[9px] font-bold uppercase tracking-widest mb-1">{c.label}</p>
            <p className={`text-xl font-bold ${c.color}`}>{c.value}</p>
            <p className="opacity-30 text-[9px] mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1 p-1 bg-card border border-border rounded-xl shadow-sm transition-all">
          {(["all", "active", "completed", "paused", "cancelled"] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all ${filterStatus === s ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20" : "opacity-40 hover:opacity-100"}`}>
              {s}
            </button>
          ))}
        </div>
        <button onClick={() => { setEditing(null); setForm({ ...emptyForm }); setShowForm(true); }}
          className="ml-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-[10px] font-bold hover:bg-yellow-500/20 transition-all">
          <Plus size={12} /> New Plan
        </button>
      </div>

      {/* Plans List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-12 text-center">
            <p className="opacity-20 text-sm">No payment plans found.</p>
          </div>
        ) : filtered.map(p => {
          const cfg = STATUS_CFG[p.status] ?? STATUS_CFG.active;
          const Icon = cfg.icon;
          const remaining = p.total_installments - p.installments_paid;
          const pct = p.total_installments > 0 ? Math.round((p.installments_paid / p.total_installments) * 100) : 0;
          const isExpanded = expanded === p.id;

          return (
            <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-xl border border-border bg-card shadow-sm transition-all overflow-hidden">
              {/* Row */}
              <div className="flex items-center gap-4 px-5 py-4 hover:bg-foreground/[0.02] transition-colors cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : p.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="opacity-90 text-sm font-medium truncate">{p.client_name}</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${cfg.color}`}>
                      <Icon size={8} /> {cfg.label}
                    </span>
                  </div>
                  <p className="opacity-30 text-xs truncate">{p.project_name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="opacity-90 text-sm font-bold font-mono">
                    {fmtMoney(convertPlan(p.remaining_balance, p.currency || "USD"))}
                  </p>
                  <p className="opacity-30 text-[9px]">remaining</p>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <p className="opacity-60 text-xs font-mono">
                    {fmtMoney(convertPlan(p.installment_amount, p.currency || "USD"))}
                  </p>
                  <p className="opacity-30 text-[9px]">{FREQ_LABEL[p.frequency]}</p>
                </div>
                <div className="text-right shrink-0 hidden md:block">
                  <p className="opacity-60 text-xs">{remaining} left</p>
                  <p className="opacity-30 text-[9px]">of {p.total_installments}</p>
                </div>
                {isExpanded ? <ChevronDown size={14} className="opacity-30 shrink-0" /> : <ChevronRight size={14} className="opacity-30 shrink-0" />}
              </div>

              {/* Progress */}
              <div className="px-5 pb-3 -mt-2">
                <div className="h-[3px] bg-foreground/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400" />
                </div>
                <p className="opacity-20 text-[9px] mt-1">{pct}% collected</p>
              </div>

              {/* Expanded Detail */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-border">
                    <div className="px-5 py-4 space-y-4">
                      {/* Stats grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: "Total Project Value", value: fmtMoney(convertPlan(p.total_amount, p.currency || "USD")) },
                          { label: "Upfront Amount", value: fmtMoney(convertPlan(p.upfront_amount, p.currency || "USD")) },
                          { label: "Upfront Status", value: p.upfront_paid ? "Paid" : "Pending", color: p.upfront_paid ? "text-emerald-400" : "text-yellow-400" },
                          { label: "Paid Installments", value: `${p.installments_paid} / ${p.total_installments}` },
                        ].map(f => (
                          <div key={f.label} className="bg-foreground/[0.03] rounded-lg px-3.5 py-2.5">
                            <p className="opacity-30 text-[9px] font-bold uppercase tracking-wider mb-0.5">{f.label}</p>
                            <p className={`text-xs font-semibold ${f.color || "opacity-70"}`}>{f.value}</p>
                          </div>
                        ))}
                      </div>
                      {p.notes && <p className="opacity-40 text-xs italic">{p.notes}</p>}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {p.status === "active" && (
                          <button onClick={() => recordPayment(p)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold hover:bg-emerald-500/20 transition-all">
                            <DollarSign size={11} /> Record Payment
                          </button>
                        )}
                        {p.status !== "completed" && (
                          <button onClick={() => updateStatus(p.id, "completed")}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-foreground/5 border border-border text-foreground/50 text-[10px] font-bold hover:bg-foreground/10 transition-all">
                            <CheckCircle2 size={11} /> Mark Fully Paid
                          </button>
                        )}
                        <button onClick={() => openEdit(p)}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-foreground/5 border border-border text-foreground/50 text-[10px] font-bold hover:bg-foreground/10 transition-all">
                          <Pencil size={11} /> Edit
                        </button>
                        {!p.upfront_paid && p.upfront_amount > 0 && (
                          <button onClick={() => recordUpfrontPayment(p)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-[10px] font-bold hover:bg-yellow-500/20 transition-all">
                            <DollarSign size={11} /> Advanced Payment Paid
                          </button>
                        )}
                        <button onClick={() => handleDelete(p.id)}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-500/8 border border-red-500/15 text-red-500 dark:text-red-400/70 text-[10px] font-bold hover:bg-red-500/15 transition-all ml-auto">
                          <X size={11} /> Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl my-4">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-semibold text-base">{editing ? "Edit Payment Plan" : "New Payment Plan"}</h3>
                <button onClick={() => { setShowForm(false); setEditing(null); setForm({ ...emptyForm }); }} className="text-white/30 hover:text-white transition-colors"><X size={16} /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Client Name *", key: "client_name", type: "text", full: true },
                  { label: "Project Name *", key: "project_name", type: "text", full: true },
                  { label: "Total Amount *", key: "total_amount", type: "number" },
                  { label: "Upfront Paid", key: "upfront_amount", type: "number" },
                  { label: "Installment Amount *", key: "installment_amount", type: "number" },
                  { label: "Total Installments *", key: "total_installments", type: "number" },
                  { label: "Already Paid (count)", key: "installments_paid", type: "number" },
                  { label: "Start Date", key: "start_date", type: "date" },
                ].map(({ label, key, type, full }) => (
                  <div key={key} className={full ? "col-span-2" : ""}>
                    <label className="text-white/30 text-[9px] font-bold uppercase tracking-widest block mb-1.5">{label}</label>
                    <input type={type} value={form[key as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full bg-white/4 border border-white/8 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none focus:border-yellow-500/40 transition-all" />
                  </div>
                ))}
                <div>
                  <label className="text-white/30 text-[9px] font-bold uppercase tracking-widest block mb-1.5">Frequency</label>
                  <select value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value as PaymentPlan["frequency"] }))}
                    className="w-full bg-white/4 border border-white/8 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none focus:border-yellow-500/40">
                    <option value="monthly" className="bg-[#0d0d0d]">Monthly</option>
                    <option value="bimonthly" className="bg-[#0d0d0d]">Bi-Monthly</option>
                    <option value="quarterly" className="bg-[#0d0d0d]">Quarterly</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/30 text-[9px] font-bold uppercase tracking-widest block mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as PaymentPlan["status"] }))}
                    className="w-full bg-white/4 border border-white/8 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none focus:border-yellow-500/40">
                    {["active", "completed", "paused", "cancelled"].map(s => <option key={s} value={s} className="bg-[#0d0d0d]">{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-white/30 text-[9px] font-bold uppercase tracking-widest block mb-1.5">Currency</label>
                  <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                    className="w-full bg-white/4 border border-white/8 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none focus:border-yellow-500/40">
                    {["USD", "PKR", "EUR", "GBP"].map(c => <option key={c} value={c} className="bg-[#0d0d0d]">{c}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-white/30 text-[9px] font-bold uppercase tracking-widest block mb-1.5">Notes</label>
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2}
                    className="w-full bg-white/4 border border-white/8 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none focus:border-yellow-500/40 resize-none" />
                </div>
              </div>
              <button onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 py-2.5 mt-4 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm transition-all">
                <Check size={14} /> {editing ? "Save Changes" : "Create Plan"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
