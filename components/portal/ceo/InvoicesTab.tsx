"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Plus, X, Check, ChevronRight, Download,
  ArrowLeft, Clock, CheckCircle2, AlertCircle, XCircle, FileMinus, UploadCloud, ExternalLink, Loader2
} from "lucide-react";

interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email?: string;
  issued_date: string;
  due_date?: string;
  status: "unpaid" | "paid" | "overdue" | "draft" | "cancelled";
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes?: string;
  pdf_url?: string;
  currency: string;
  paid_at?: string;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  paid: { label: "Paid", color: "bg-green-500/15 text-green-400 border-green-500/20", icon: CheckCircle2 },
  unpaid: { label: "Unpaid", color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20", icon: Clock },
  overdue: { label: "Overdue", color: "bg-red-500/15 text-red-400 border-red-500/20", icon: AlertCircle },
  draft: { label: "Draft", color: "bg-white/10 text-white/50 border-white/10", icon: FileMinus },
  cancelled: { label: "Cancelled", color: "bg-white/5 text-white/30 border-white/10", icon: XCircle },
};



function StatusBadge({ status }: { status: Invoice["status"] }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${cfg.color}`}>
      <Icon size={10} /> {cfg.label}
    </span>
  );
}

function exportInvoicesCSV(data: any[], convert: any, globalCurrency: string) {
  const headers = ["Invoice #", "Client", "Email", "Issued", "Due", "Status", "Total (USD)", `Total (${globalCurrency})` ];
  const rows = data.map(inv => [
    inv.invoice_number, `"${inv.client_name}"`, inv.client_email ?? "",
    inv.issued_date, inv.due_date ?? "", inv.status,
    inv.total, convert(inv.total, inv.currency)
  ]);
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `invoices_${new Date().toISOString().split('T')[0]}.csv`; a.click();
  URL.revokeObjectURL(url);
}

export default function CeoInvoicesTab({ addToast, globalCurrency = "USD", rates = {} }: {
  addToast: (type: "success" | "error" | "info", msg: string) => void;
  globalCurrency?: "USD" | "PKR";
  rates?: Record<string, number>;
}) {
  // Invoices are stored in USD. Convert to globalCurrency for display.
  const usdToPkr = rates["USD"] ?? 278.5;
  const convert = (amount: number, fromCurr: string = "USD") => {
    if (fromCurr === globalCurrency) return amount;
    const fromRate = fromCurr === "PKR" ? 1 : (rates[fromCurr] || usdToPkr);
    const inPkr = amount * fromRate;
    if (globalCurrency === "PKR") return inPkr;
    const toRate = rates[globalCurrency] || usdToPkr;
    return inPkr / toRate;
  };
  const getUsdAmount = (amount: number, currency: string) => {
    if (currency === "USD") return amount;
    const fromRate = currency === "PKR" ? 1 : (rates[currency] || usdToPkr);
    const inPkr = amount * fromRate;
    return inPkr / usdToPkr;
  };
  const fmtMoney = (n: number, curr?: string) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: curr || globalCurrency, maximumFractionDigits: 0 }).format(n);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<Invoice | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | Invoice["status"]>("all");

  // New invoice form
  const [form, setForm] = useState<{
    client_name: string; client_email: string; issued_date: string;
    due_date: string; tax_rate: string; notes: string; status: Invoice["status"];
    currency: string;
    pdfFile: File | null;
  }>({
    client_name: "", client_email: "", issued_date: new Date().toISOString().split("T")[0],
    due_date: "", tax_rate: "0", notes: "", status: "unpaid" as Invoice["status"],
    currency: "USD",
    pdfFile: null,
  });
  const [lineItems, setLineItems] = useState([{ description: "", quantity: "1", unit_price: "" }]);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  
  // History state
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const loadHistory = useCallback(async (invoiceId: string) => {
    setLoadingHistory(true);
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("reference", invoiceId)
      .order("date", { ascending: false });
    setPaymentHistory(data ?? []);
    setLoadingHistory(false);
  }, []);

  useEffect(() => {
    if (detail) {
      loadHistory(detail.id);
    } else {
      setPaymentHistory([]);
    }
  }, [detail, loadHistory]);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: inv }, { data: itm }] = await Promise.all([
      supabase.from("invoices").select("*").order("created_at", { ascending: false }),
      supabase.from("invoice_items").select("*"),
    ]);
    setInvoices(inv ?? []);
    setItems(itm ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = invoices.filter(inv => filterStatus === "all" || inv.status === filterStatus);

  // Totals for filter view
  const totalPaid = invoices.filter(i => i.status === "paid").reduce((s, i) => s + convert(i.total, i.currency), 0);
  const totalPending = invoices.filter(i => i.status === "unpaid").reduce((s, i) => s + convert(i.total, i.currency), 0);
  const totalOverdue = invoices.filter(i => i.status === "overdue").reduce((s, i) => s + convert(i.total, i.currency), 0);
  const totalInvoiced = invoices.reduce((s, i) => s + convert(i.total, i.currency), 0);

  const handleMarkPaid = async (inv: Invoice) => {
    const { error } = await supabase.from("invoices").update({ status: "paid", paid_at: new Date().toISOString() }).eq("id", inv.id);
    if (error) { addToast("error", "Failed to update status."); return; }

    // Create transaction
    const { error: txnError } = await supabase.from("transactions").insert({
      date: new Date().toISOString().split("T")[0],
      description: `Payment for Invoice ${inv.invoice_number}`,
      amount: getUsdAmount(inv.total, inv.currency),
      type: "income",
      category: "client_payment",
      client_name: inv.client_name,
      reference: inv.id,
      notes: `Original amount: ${fmtMoney(inv.total, inv.currency)}`,
    });

    if (txnError) {
      console.error("Failed to record transaction:", txnError);
      addToast("error", "Invoice marked as paid, but failed to record transaction.");
    }

    addToast("success", `Invoice ${inv.invoice_number} marked as paid.`);
    load();
    if (detail?.id === inv.id) setDetail({ ...inv, status: "paid", paid_at: new Date().toISOString() });
  };

  const handleDelete = async (id: string) => {
    // Optionally we could delete the PDF from storage as well here, but ignoring for simplicity
    const { error } = await supabase.from("invoices").delete().eq("id", id);
    if (error) { addToast("error", "Failed to delete invoice."); return; }
    addToast("success", "Invoice deleted."); setDetail(null); load();
  };

  const handlePdfUpload = async (invoiceId: string, file: File) => {
    setUploadingPdf(true);
    // Use a fixed name within the invoice folder to easily replace on re-upload
    const path = `${invoiceId}/invoice.pdf`;
    const { error: uploadError } = await supabase.storage.from('invoice-pdfs').upload(path, file, { upsert: true });

    if (uploadError) {
      addToast("error", "Failed to upload PDF.");
      setUploadingPdf(false);
      return;
    }

    const { error: updateError } = await supabase.from('invoices').update({ pdf_url: path }).eq('id', invoiceId);
    if (updateError) {
      addToast("error", "Failed to link PDF to invoice.");
    } else {
      addToast("success", "PDF attached to invoice.");
      load();
      if (detail && detail.id === invoiceId) {
        setDetail({ ...detail, pdf_url: path });
      }
    }
    setUploadingPdf(false);
  };

  const handleViewPdf = async (path: string) => {
    const { data, error } = await supabase.storage.from('invoice-pdfs').createSignedUrl(path, 3600);
    if (error || !data) {
      addToast("error", "Failed to generate PDF view link.");
      return;
    }
    window.open(data.signedUrl, '_blank');
  };

  const calcLineTotal = (li: { quantity: string; unit_price: string }) =>
    (parseFloat(li.quantity) || 0) * (parseFloat(li.unit_price) || 0);

  const calcSubtotal = () => lineItems.reduce((s, li) => s + calcLineTotal(li), 0);

  const handleCreate = async () => {
    if (!form.client_name) { addToast("error", "Client name is required."); return; }
    if (lineItems.some(li => !li.description || !li.unit_price)) { addToast("error", "All line items need a description and price."); return; }

    const subtotal = calcSubtotal();
    const taxRate = parseFloat(form.tax_rate) || 0;
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;
    const invNumber = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, "0")}`;

    const { data: newInv, error } = await supabase.from("invoices").insert({
      invoice_number: invNumber,
      client_name: form.client_name,
      client_email: form.client_email || null,
      issued_date: form.issued_date,
      due_date: form.due_date || null,
      status: form.status,
      currency: form.currency,
      subtotal, tax_rate: taxRate, tax_amount: taxAmount, total,
      notes: form.notes || null,
    }).select().single();

    if (error || !newInv) { addToast("error", "Failed to create invoice."); return; }

    const itemsPayload = lineItems.map(li => ({
      invoice_id: newInv.id,
      description: li.description,
      quantity: parseFloat(li.quantity) || 1,
      unit_price: parseFloat(li.unit_price) || 0,
    }));
    await supabase.from("invoice_items").insert(itemsPayload);

    if (form.pdfFile) {
      await handlePdfUpload(newInv.id, form.pdfFile);
    }

    if (form.status === "paid") {
      const { error: txnError } = await supabase.from("transactions").insert({
        date: new Date().toISOString().split("T")[0],
        description: `Payment for Invoice ${invNumber}`,
        amount: getUsdAmount(total, form.currency),
        type: "income",
        category: "client_payment",
        client_name: form.client_name,
        reference: newInv.id,
        notes: `Original amount: ${fmtMoney(total, form.currency)}`,
      });
      if (txnError) {
        console.error("Failed to record transaction:", txnError);
        addToast("error", "Invoice created, but failed to record transaction.");
      }
    }

    addToast("success", `Invoice ${invNumber} created.`);
    setShowAdd(false);
    setForm({ client_name: "", client_email: "", issued_date: new Date().toISOString().split("T")[0], due_date: "", tax_rate: "0", notes: "", status: "unpaid", currency: "USD", pdfFile: null });
    setLineItems([{ description: "", quantity: "1", unit_price: "" }]);
    load();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 rounded-full border-2 border-yellow-500/30 border-t-yellow-400 animate-spin" /></div>;

  // Detail view
  if (detail) {
    const invItems = items.filter(i => i.invoice_id === detail.id);
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setDetail(null)} className="flex items-center gap-1.5 text-white/40 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">
            <ArrowLeft size={14} /> Back to Invoices
          </button>
          <StatusBadge status={detail.status} />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/3 p-8 space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Invoice Number</p>
              <h2 className="text-2xl font-bold text-white">{detail.invoice_number}</h2>
            </div>
            <div className="text-right">
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Total Amount ({detail.currency})</p>
              <p className="text-3xl font-bold text-white">{fmtMoney(detail.total, detail.currency)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-white/8">
            {[
              { label: "Client", value: detail.client_name },
              { label: "Email", value: detail.client_email ?? "—" },
              { label: "Issued", value: new Date(detail.issued_date).toLocaleDateString("en-US", { dateStyle: "medium" }) },
              { label: "Due", value: detail.due_date ? new Date(detail.due_date).toLocaleDateString("en-US", { dateStyle: "medium" }) : "—" },
            ].map(f => (
              <div key={f.label}>
                <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest mb-1">{f.label}</p>
                <p className="text-white/80 text-sm font-medium">{f.value}</p>
              </div>
            ))}
          </div>
          {/* Line Items */}
          <div>
            <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest mb-3">Line Items</p>
            <div className="rounded-xl border border-white/8 overflow-hidden">
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 bg-white/5 text-[9px] font-bold uppercase tracking-widest text-white/30">
                <span>Description</span><span>Qty</span><span>Unit Price</span><span className="text-right">Total</span>
              </div>
              {invItems.length === 0 ? (
                <p className="text-white/20 text-xs text-center py-6">No line items recorded.</p>
              ) : invItems.map(item => (
                <div key={item.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-t border-white/5 text-sm">
                  <span className="text-white/70">{item.description}</span>
                  <span className="text-white/40">{item.quantity}</span>
                  <span className="text-white/40">{fmtMoney(item.unit_price, detail.currency)}</span>
                  <span className="text-white text-right font-semibold">{fmtMoney(item.total, detail.currency)}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Subtotals */}
          <div className="flex flex-col items-end gap-2 pt-4 border-t border-white/8">
            <div className="flex gap-8 text-sm"><span className="text-white/40">Subtotal</span><span className="text-white font-medium">{fmtMoney(detail.subtotal, detail.currency)}</span></div>
            <div className="flex gap-8 text-sm"><span className="text-white/40">Tax ({detail.tax_rate}%)</span><span className="text-white font-medium">{fmtMoney(detail.tax_amount, detail.currency)}</span></div>
            <div className="flex gap-8 text-base font-bold border-t border-white/10 pt-2 mt-1"><span className="text-white/60">Total</span><span className="text-white">{fmtMoney(detail.total, detail.currency)}</span></div>
          </div>
          {detail.paid_at && (
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3 text-green-400 text-sm">
              ✓ Paid on {new Date(detail.paid_at).toLocaleDateString("en-US", { dateStyle: "long" })}
            </div>
          )}
          {detail.notes && (
            <div className="rounded-xl border border-white/8 bg-white/3 px-4 py-3">
              <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest mb-1">Notes</p>
              <p className="text-white/60 text-sm">{detail.notes}</p>
            </div>
          )}

          {/* Payment History Section */}
          <div className="space-y-3">
            <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest px-1">Payment History</p>
            {loadingHistory ? (
              <div className="flex items-center gap-2 text-white/20 text-xs px-1">
                <Loader2 size={12} className="animate-spin" /> Loading payments...
              </div>
            ) : paymentHistory.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 p-4 text-center">
                <p className="text-white/20 text-xs italic text-center">No transactions recorded for this invoice.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {paymentHistory.map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/3 border border-white/5 group hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle2 size={14} className="text-green-400/70" />
                      </div>
                      <div>
                        <p className="text-white/80 text-xs font-medium">{txn.description}</p>
                        <p className="text-white/30 text-[10px] font-mono">{new Date(txn.date).toLocaleDateString("en-US", { dateStyle: "medium" })}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 text-xs font-bold font-mono">+{fmtMoney(convert(txn.amount, "USD"))}</p>
                      <p className="text-white/20 text-[9px] uppercase tracking-wider">Confirmed</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PDF Section */}
          <div className="rounded-xl border border-white/8 bg-white/3 px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest mb-1">Original Invoice PDF</p>
                <p className="text-white/60 text-xs">
                  {detail.pdf_url ? "PDF document is attached to this invoice." : "No PDF attached."}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {detail.pdf_url && (
                  <button onClick={() => handleViewPdf(detail.pdf_url!)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold hover:bg-blue-500/20 transition-all">
                    <ExternalLink size={12} /> View PDF
                  </button>
                )}
                <div className="relative">
                  <input type="file" accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handlePdfUpload(detail.id, e.target.files[0]);
                      }
                    }}
                    disabled={uploadingPdf}
                  />
                  <button disabled={uploadingPdf} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 text-[10px] font-bold hover:bg-white/10 transition-all disabled:opacity-50">
                    {uploadingPdf ? <Loader2 size={12} className="animate-spin" /> : <UploadCloud size={12} />}
                    {detail.pdf_url ? "Replace PDF" : "Attach PDF"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {detail.status !== "paid" && (
              <button onClick={() => handleMarkPaid(detail)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold hover:bg-green-500/20 transition-all">
                <CheckCircle2 size={13} /> Mark as Paid
              </button>
            )}
            <button onClick={() => handleDelete(detail.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all">
              <X size={13} /> Delete Invoice
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Collected</p>
          <p className="text-2xl font-bold text-green-400">{fmtMoney(totalPaid)}</p>
          <p className="text-white/30 text-[9px] mt-1">{invoices.filter(i => i.status === "paid").length} paid</p>
        </div>
        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-400">{fmtMoney(totalPending)}</p>
          <p className="text-white/30 text-[9px] mt-1">{invoices.filter(i => i.status === "unpaid").length} open</p>
        </div>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Overdue</p>
          <p className="text-2xl font-bold text-red-400">{fmtMoney(totalOverdue)}</p>
          <p className="text-white/30 text-[9px] mt-1">{invoices.filter(i => i.status === "overdue").length} critical</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 p-1 bg-white/5 border border-white/8 rounded-xl flex-wrap">
          {(["all", "unpaid", "paid", "overdue", "draft"] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${filterStatus === s ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20" : "text-white/40 hover:text-white/70"}`}>
              {s}
            </button>
          ))}
        </div>
        <button onClick={() => exportInvoicesCSV(filtered, convert, globalCurrency)}
          className="ml-auto flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-xs font-bold hover:bg-white/10 transition-all">
          <Download size={12} /> Export CSV
        </button>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold hover:bg-yellow-500/20 transition-all">
          <Plus size={12} /> New Invoice
        </button>
      </div>

      {/* Invoice List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="text-center text-white/30 text-sm py-10">No invoices found.</p>
        ) : filtered.map(inv => (
          <motion.div key={inv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={() => setDetail(inv)}
            className="flex items-center justify-between px-5 py-4 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/5 cursor-pointer transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <FileText size={16} className="text-white/40" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{inv.invoice_number}</p>
                <p className="text-white/40 text-xs">{inv.client_name} {inv.client_email ? `· ${inv.client_email}` : ""}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-white/30 text-[9px] uppercase tracking-wider">Issued</p>
                <p className="text-white/50 text-xs">{new Date(inv.issued_date).toLocaleDateString("en-US", { dateStyle: "medium" })}</p>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-white/30 text-[9px] uppercase tracking-wider">Due</p>
                <p className="text-white/50 text-xs">{inv.due_date ? new Date(inv.due_date).toLocaleDateString("en-US", { dateStyle: "medium" }) : "—"}</p>
              </div>
              <StatusBadge status={inv.status} />
              <p className="text-white font-bold text-sm min-w-[80px] text-right">{fmtMoney(convert(inv.total, inv.currency), globalCurrency)}</p>
              <ChevronRight size={14} className="text-white/20 group-hover:text-white/50 transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Invoice Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-2xl border border-white/10 bg-black/95 p-6 shadow-2xl my-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold text-lg">New Invoice</h3>
                <button onClick={() => setShowAdd(false)} className="text-white/40 hover:text-white transition-colors"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Client Name *", key: "client_name", type: "text", placeholder: "Client Inc." },
                    { label: "Client Email", key: "client_email", type: "email", placeholder: "billing@client.com" },
                    { label: "Issued Date", key: "issued_date", type: "date", placeholder: "" },
                    { label: "Due Date", key: "due_date", type: "date", placeholder: "" },
                    { label: "Tax Rate (%)", key: "tax_rate", type: "number", placeholder: "0" },
                  ].map(({ label, key, type, placeholder }) => (
                    <div key={key} className={key === "client_name" ? "col-span-2" : ""}>
                      <label className="text-white/30 text-[9px] font-bold uppercase tracking-widest block mb-1.5">{label}</label>
                      <input type={type} placeholder={placeholder} value={form[key as keyof typeof form]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-500/50 transition-all" />
                    </div>
                  ))}
                  <div>
                    <label className="text-white/30 text-[9px] font-bold uppercase tracking-widest block mb-1.5">Status</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Invoice["status"] }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-500/50">
                      {["unpaid", "paid", "draft", "overdue", "cancelled"].map(s => <option key={s} value={s} className="bg-black">{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/30 text-[9px] font-bold uppercase tracking-widest block mb-1.5">Currency</label>
                    <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-500/50">
                      {["USD", "PKR", "EUR", "GBP"].map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
                    </select>
                  </div>
                </div>
                {/* Line Items */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-white/30 text-[9px] font-bold uppercase tracking-widest">Line Items</label>
                    <button onClick={() => setLineItems(li => [...li, { description: "", quantity: "1", unit_price: "" }])}
                      className="text-yellow-400 text-[10px] font-bold hover:text-yellow-300 flex items-center gap-1"><Plus size={10} /> Add Item</button>
                  </div>
                  <div className="space-y-2">
                    {lineItems.map((li, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input placeholder="Description" value={li.description}
                          onChange={e => setLineItems(l => l.map((x, i) => i === idx ? { ...x, description: e.target.value } : x))}
                          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-yellow-500/50" />
                        <input placeholder="Qty" type="number" value={li.quantity}
                          onChange={e => setLineItems(l => l.map((x, i) => i === idx ? { ...x, quantity: e.target.value } : x))}
                          className="w-14 bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-white text-xs outline-none focus:border-yellow-500/50" />
                        <input placeholder="Price" type="number" value={li.unit_price}
                          onChange={e => setLineItems(l => l.map((x, i) => i === idx ? { ...x, unit_price: e.target.value } : x))}
                          className="w-24 bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-white text-xs outline-none focus:border-yellow-500/50" />
                        <span className="text-white/40 text-xs w-16 text-right">{fmtMoney(calcLineTotal(li), form.currency)}</span>
                        {lineItems.length > 1 && (
                          <button onClick={() => setLineItems(l => l.filter((_, i) => i !== idx))} className="text-white/20 hover:text-red-400 transition-colors"><X size={12} /></button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-3 text-sm gap-3">
                    <span className="text-white/40">Subtotal:</span>
                    <span className="text-white font-bold">{fmtMoney(calcSubtotal(), form.currency)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-white/30 text-[9px] font-bold uppercase tracking-widest block mb-1.5">Notes</label>
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Optional notes…"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-500/50 resize-none" />
                </div>
                <div>
                  <label className="text-white/30 text-[9px] font-bold uppercase tracking-widest block mb-1.5">Invoice PDF (Optional)</label>
                  <div className="relative">
                    <input type="file" accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setForm(f => ({ ...f, pdfFile: e.target.files![0] }));
                        }
                      }}
                    />
                    <div className="flex items-center justify-between w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm">
                      <span className={form.pdfFile ? "text-white" : "text-white/40"}>
                        {form.pdfFile ? form.pdfFile.name : "Select PDF document..."}
                      </span>
                      <UploadCloud size={16} className="text-white/40" />
                    </div>
                  </div>
                </div>
                <button onClick={handleCreate} disabled={uploadingPdf}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold text-sm hover:from-yellow-400 hover:to-yellow-500 transition-all disabled:opacity-50">
                  {uploadingPdf ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                  {uploadingPdf ? "Creating..." : "Create Invoice"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

