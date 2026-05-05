"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, X, Check, Pencil, ChevronRight, ChevronDown,
  Users, DollarSign, Briefcase, Trash2, Award, Percent, UserCheck
} from "lucide-react";

interface EmployeeSalary {
  id: string;
  employee_name: string;
  position: string;
  department?: string;
  role_type: "regular" | "sales" | "senior" | "contractor";
  base_salary: number;
  currency: string;
  commission_rate?: number;
  start_date: string;
  status: "active" | "inactive" | "on_leave";
  impact_notes?: string;
}

interface SalarySalesRecord {
  id: string;
  employee_id: string;
  month: number;
  year: number;
  sales_amount: number;
  commission_rate?: number;
  commission_earned: number;
  notes?: string;
}

const ROLE_CFG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  regular:    { label: "Regular",    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",     icon: Users },
  sales:      { label: "Sales",      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: Percent },
  senior:     { label: "Senior",     color: "text-purple-400 bg-purple-500/10 border-purple-500/20",  icon: Award },
  contractor: { label: "Contractor", color: "text-orange-400 bg-orange-500/10 border-orange-500/20", icon: Briefcase },
};

function fmtMoney(n: number, curr = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: curr, maximumFractionDigits: 0 }).format(n);
}

const emptyForm = {
  employee_name: "", position: "", department: "", role_type: "regular" as EmployeeSalary["role_type"],
  base_salary: "", currency: "USD", commission_rate: "", start_date: new Date().toISOString().split("T")[0],
  status: "active" as EmployeeSalary["status"], impact_notes: ""
};

const emptySalesForm = {
  month: new Date().getMonth() + 1, year: new Date().getFullYear(),
  sales_amount: "", commission_rate: "", notes: ""
};

export default function CeoSalariesTab({ addToast }: {
  addToast: (type: "success" | "error" | "info", msg: string) => void;
}) {
  const [salaries, setSalaries] = useState<EmployeeSalary[]>([]);
  const [salesRecords, setSalesRecords] = useState<SalarySalesRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<EmployeeSalary | null>(null);
  
  const [expanded, setExpanded] = useState<string | null>(null);
  
  const [showSalesForm, setShowSalesForm] = useState<string | null>(null); // employee_id
  
  const [form, setForm] = useState({ ...emptyForm });
  const [salesForm, setSalesForm] = useState({ ...emptySalesForm });

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: sals }, { data: recs }] = await Promise.all([
      supabase.from("employee_salaries").select("*").order("employee_name"),
      supabase.from("salary_sales_records").select("*").order("year", { ascending: false }).order("month", { ascending: false })
    ]);
    setSalaries(sals ?? []);
    setSalesRecords(recs ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const activeSalaries = salaries.filter(s => s.status === "active");
  const totalMonthlyBase = activeSalaries.reduce((acc, s) => acc + s.base_salary, 0); // Simplified assuming all USD for summary
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const currentMonthCommissions = salesRecords
    .filter(r => r.month === currentMonth && r.year === currentYear)
    .reduce((acc, r) => acc + r.commission_earned, 0);

  const openEdit = (s: EmployeeSalary) => {
    setEditing(s);
    setForm({
      employee_name: s.employee_name, position: s.position, department: s.department ?? "",
      role_type: s.role_type, base_salary: String(s.base_salary), currency: s.currency,
      commission_rate: s.commission_rate ? String(s.commission_rate) : "",
      start_date: s.start_date, status: s.status, impact_notes: s.impact_notes ?? ""
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.employee_name || !form.position || !form.base_salary) {
      addToast("error", "Name, position, and base salary are required."); return;
    }
    
    const payload = {
      employee_name: form.employee_name, position: form.position, department: form.department || null,
      role_type: form.role_type, base_salary: parseFloat(form.base_salary), currency: form.currency,
      commission_rate: form.commission_rate ? parseFloat(form.commission_rate) : null,
      start_date: form.start_date, status: form.status, impact_notes: form.impact_notes || null
    };

    const { error } = editing
      ? await supabase.from("employee_salaries").update(payload).eq("id", editing.id)
      : await supabase.from("employee_salaries").insert(payload);

    if (error) { addToast("error", "Failed to save employee."); return; }
    addToast("success", editing ? "Employee updated." : "Employee added.");
    setShowForm(false); setEditing(null); setForm({ ...emptyForm }); load();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("employee_salaries").delete().eq("id", id);
    if (error) { addToast("error", "Failed to delete."); return; }
    addToast("success", "Employee deleted."); load();
  };

  const handleSaveSales = async (empId: string) => {
    if (!salesForm.sales_amount) { addToast("error", "Sales amount required."); return; }
    
    const emp = salaries.find(s => s.id === empId);
    if (!emp) return;
    
    const salesAmt = parseFloat(salesForm.sales_amount);
    const commRate = salesForm.commission_rate ? parseFloat(salesForm.commission_rate) : emp.commission_rate;
    
    const payload = {
      employee_id: empId, month: salesForm.month, year: salesForm.year,
      sales_amount: salesAmt, commission_rate: commRate || null,
      notes: salesForm.notes || null
    };
    
    // Upsert (since employee_id, month, year is unique)
    const { error } = await supabase.from("salary_sales_records").upsert(payload, { onConflict: 'employee_id,month,year' });
    
    if (error) { addToast("error", "Failed to save sales record."); return; }
    addToast("success", "Sales record saved.");
    setShowSalesForm(null); setSalesForm({ ...emptySalesForm }); load();
  };
  
  const deleteSalesRecord = async (id: string) => {
    const { error } = await supabase.from("salary_sales_records").delete().eq("id", id);
    if (error) { addToast("error", "Failed to delete sales record."); return; }
    addToast("success", "Sales record deleted."); load();
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-7 h-7 rounded-full border-2 border-yellow-500/30 border-t-yellow-400 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/6 bg-white/3 p-5">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Total Monthly Base</p>
          <p className="text-2xl font-bold text-white">{fmtMoney(totalMonthlyBase)}</p>
          <p className="text-white/30 text-xs mt-1">{activeSalaries.length} active employees</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <p className="text-emerald-400/50 text-[10px] font-bold uppercase tracking-widest mb-1">Current Month Commissions</p>
          <p className="text-2xl font-bold text-emerald-400">{fmtMoney(currentMonthCommissions)}</p>
          <p className="text-emerald-400/50 text-xs mt-1">Based on recorded sales</p>
        </div>
        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
          <p className="text-purple-400/50 text-[10px] font-bold uppercase tracking-widest mb-1">Senior Leadership</p>
          <p className="text-2xl font-bold text-purple-400">{salaries.filter(s => s.role_type === "senior").length}</p>
          <p className="text-purple-400/50 text-xs mt-1">High-impact roles</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <h2 className="text-white/50 text-sm font-bold uppercase tracking-widest">Employee Salaries & Roles</h2>
        <button onClick={() => { setEditing(null); setForm({ ...emptyForm }); setShowForm(true); }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-bold hover:bg-yellow-500/20 transition-all">
          <Plus size={12} /> Add Employee
        </button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {salaries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/8 py-12 text-center">
            <p className="text-white/20 text-sm">No employees found.</p>
          </div>
        ) : salaries.map(emp => {
          const cfg = ROLE_CFG[emp.role_type] ?? ROLE_CFG.regular;
          const RoleIcon = cfg.icon;
          const isExpanded = expanded === emp.id;
          const empSales = salesRecords.filter(r => r.employee_id === emp.id);

          return (
            <motion.div key={emp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`rounded-xl border transition-all ${emp.status === "inactive" ? "border-white/5 bg-white/2 opacity-60" : "border-white/6 bg-white/3"}`}>
              <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : emp.id)}>
                
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.color.split(' ')[1]}`}>
                  <RoleIcon size={18} className={cfg.color.split(' ')[0]} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-white font-semibold text-sm truncate">{emp.employee_name}</p>
                    {emp.status !== "active" && (
                      <span className="px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-white/40 text-[9px] uppercase font-bold">
                        {emp.status}
                      </span>
                    )}
                  </div>
                  <p className="text-white/40 text-xs truncate">{emp.position} {emp.department ? `· ${emp.department}` : ""}</p>
                </div>
                
                <div className="text-right shrink-0">
                  <p className="text-white/80 text-sm font-bold font-mono">{fmtMoney(emp.base_salary, emp.currency)}</p>
                  <p className="text-white/30 text-[9px] uppercase tracking-widest">Base / Mo</p>
                </div>
                
                <ChevronRight size={16} className={`text-white/20 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-white/5">
                    <div className="px-5 py-4 space-y-6">
                      
                      {/* Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest mb-1">Role Type</p>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${cfg.color}`}>
                            <RoleIcon size={10} /> {cfg.label}
                          </span>
                        </div>
                        <div>
                          <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest mb-1">Start Date</p>
                          <p className="text-white/70 text-sm font-medium">{new Date(emp.start_date).toLocaleDateString("en-US", { dateStyle: "medium" })}</p>
                        </div>
                        {emp.role_type === "sales" && (
                          <div>
                            <p className="text-emerald-400/50 text-[9px] font-bold uppercase tracking-widest mb-1">Commission Rate</p>
                            <p className="text-emerald-400 text-sm font-bold">{emp.commission_rate}%</p>
                          </div>
                        )}
                        {emp.role_type === "senior" && (
                          <div className="col-span-2 md:col-span-1">
                            <p className="text-purple-400/50 text-[9px] font-bold uppercase tracking-widest mb-1">Impact / Ownership</p>
                            <p className="text-white/70 text-sm italic">{emp.impact_notes || "No impact notes specified."}</p>
                          </div>
                        )}
                      </div>

                      {/* Sales & Commissions Section */}
                      {emp.role_type === "sales" && (
                        <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-white/60 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                              <DollarSign size={14} className="text-emerald-400" /> Sales & Commissions
                            </h4>
                            <button onClick={() => { setSalesForm({ ...emptySalesForm }); setShowSalesForm(emp.id); }}
                              className="text-emerald-400 text-[10px] font-bold hover:text-emerald-300 flex items-center gap-1">
                              <Plus size={10} /> Add Record
                            </button>
                          </div>
                          
                          {showSalesForm === emp.id && (
                            <div className="mb-4 bg-white/5 p-3 rounded-lg border border-white/10 grid grid-cols-2 md:grid-cols-5 gap-2 items-end">
                              <div>
                                <label className="text-white/30 text-[9px] font-bold uppercase block mb-1">Month</label>
                                <input type="number" min="1" max="12" value={salesForm.month} onChange={e => setSalesForm(f => ({ ...f, month: parseInt(e.target.value) }))} className="w-full bg-black/50 border border-white/10 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-emerald-500/50" />
                              </div>
                              <div>
                                <label className="text-white/30 text-[9px] font-bold uppercase block mb-1">Year</label>
                                <input type="number" value={salesForm.year} onChange={e => setSalesForm(f => ({ ...f, year: parseInt(e.target.value) }))} className="w-full bg-black/50 border border-white/10 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-emerald-500/50" />
                              </div>
                              <div>
                                <label className="text-white/30 text-[9px] font-bold uppercase block mb-1">Sales ($)</label>
                                <input type="number" value={salesForm.sales_amount} onChange={e => setSalesForm(f => ({ ...f, sales_amount: e.target.value }))} className="w-full bg-black/50 border border-white/10 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-emerald-500/50" />
                              </div>
                              <div>
                                <label className="text-white/30 text-[9px] font-bold uppercase block mb-1">Rate Override %</label>
                                <input type="number" placeholder="Optional" value={salesForm.commission_rate} onChange={e => setSalesForm(f => ({ ...f, commission_rate: e.target.value }))} className="w-full bg-black/50 border border-white/10 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-emerald-500/50" />
                              </div>
                              <div className="flex gap-1">
                                <button onClick={() => handleSaveSales(emp.id)} className="flex-1 bg-emerald-500/20 text-emerald-400 rounded py-1.5 flex justify-center hover:bg-emerald-500/30 transition-colors"><Check size={14} /></button>
                                <button onClick={() => setShowSalesForm(null)} className="flex-1 bg-white/5 text-white/40 rounded py-1.5 flex justify-center hover:bg-white/10 transition-colors"><X size={14} /></button>
                              </div>
                            </div>
                          )}

                          {empSales.length === 0 ? (
                            <p className="text-white/20 text-[10px] italic">No sales records found.</p>
                          ) : (
                            <div className="space-y-1">
                              {empSales.map(r => (
                                <div key={r.id} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0 group">
                                  <span className="text-white/50 w-24">{r.month}/{r.year}</span>
                                  <span className="text-white/70 font-mono w-24">{fmtMoney(r.sales_amount)} sales</span>
                                  <span className="text-emerald-400 font-bold font-mono w-24">+{fmtMoney(r.commission_earned)}</span>
                                  <span className="text-white/30 text-[9px] italic flex-1 truncate">{r.notes}</span>
                                  <button onClick={() => deleteSalesRecord(r.id)} className="opacity-0 group-hover:opacity-100 text-red-400/50 hover:text-red-400 transition-opacity"><Trash2 size={12} /></button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => openEdit(emp)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold hover:bg-white/10 transition-all">
                          <Pencil size={11} /> Edit
                        </button>
                        <button onClick={() => handleDelete(emp.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold hover:bg-red-500/20 transition-all">
                          <Trash2 size={11} /> Delete
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

      {/* Main Employee Form */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl my-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold text-lg">{editing ? "Edit Employee" : "Add Employee"}</h3>
                <button onClick={() => setShowForm(false)} className="text-white/30 hover:text-white transition-colors"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-white/30 text-[9px] font-bold uppercase tracking-widest block mb-1.5">Employee Name *</label>
                    <input type="text" value={form.employee_name} onChange={e => setForm(f => ({ ...f, employee_name: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-500/50" />
                  </div>
                  <div>
                    <label className="text-white/30 text-[9px] font-bold uppercase tracking-widest block mb-1.5">Position / Title *</label>
                    <input type="text" value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-500/50" />
                  </div>
                  <div>
                    <label className="text-white/30 text-[9px] font-bold uppercase tracking-widest block mb-1.5">Department</label>
                    <input type="text" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-500/50" />
                  </div>
                  <div>
                    <label className="text-white/30 text-[9px] font-bold uppercase tracking-widest block mb-1.5">Role Type</label>
                    <select value={form.role_type} onChange={e => setForm(f => ({ ...f, role_type: e.target.value as EmployeeSalary["role_type"] }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-500/50">
                      <option value="regular" className="bg-[#0d0d0d]">Regular</option>
                      <option value="sales" className="bg-[#0d0d0d]">Sales</option>
                      <option value="senior" className="bg-[#0d0d0d]">Senior Leadership</option>
                      <option value="contractor" className="bg-[#0d0d0d]">Contractor</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/30 text-[9px] font-bold uppercase tracking-widest block mb-1.5">Status</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as EmployeeSalary["status"] }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-500/50">
                      <option value="active" className="bg-[#0d0d0d]">Active</option>
                      <option value="inactive" className="bg-[#0d0d0d]">Inactive</option>
                      <option value="on_leave" className="bg-[#0d0d0d]">On Leave</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-white/30 text-[9px] font-bold uppercase tracking-widest block mb-1.5">Base Salary (per month) *</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm">$</span>
                      <input type="number" value={form.base_salary} onChange={e => setForm(f => ({ ...f, base_salary: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-white text-sm outline-none focus:border-yellow-500/50" />
                    </div>
                  </div>
                  
                  {form.role_type === "sales" && (
                    <div>
                      <label className="text-emerald-400/50 text-[9px] font-bold uppercase tracking-widest block mb-1.5">Commission Rate %</label>
                      <input type="number" value={form.commission_rate} onChange={e => setForm(f => ({ ...f, commission_rate: e.target.value }))} placeholder="e.g. 10"
                        className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-4 py-2.5 text-emerald-400 text-sm outline-none focus:border-emerald-500/50" />
                    </div>
                  )}

                  {form.role_type === "senior" && (
                    <div className="col-span-2">
                      <label className="text-purple-400/50 text-[9px] font-bold uppercase tracking-widest block mb-1.5">Impact / Ownership Notes</label>
                      <textarea value={form.impact_notes} onChange={e => setForm(f => ({ ...f, impact_notes: e.target.value }))} rows={2} placeholder="What does this senior leader own?"
                        className="w-full bg-purple-500/5 border border-purple-500/20 rounded-xl px-4 py-2.5 text-purple-400 text-sm outline-none focus:border-purple-500/50 resize-none" />
                    </div>
                  )}

                  <div className="col-span-2">
                    <label className="text-white/30 text-[9px] font-bold uppercase tracking-widest block mb-1.5">Start Date</label>
                    <input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-500/50" />
                  </div>
                </div>

                <button onClick={handleSave}
                  className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold text-sm hover:from-yellow-400 hover:to-yellow-500 transition-all">
                  <Check size={15} /> {editing ? "Save Changes" : "Add Employee"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
