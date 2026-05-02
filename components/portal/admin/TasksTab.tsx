"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, type Task, type Profile } from "../../../lib/supabase";
import { Plus, X, Flag, User, Calendar } from "lucide-react";

const COLUMNS: { id: Task["status"]; label: string; color: string }[] = [
  { id: "todo",        label: "To Do",      color: "border-white/20" },
  { id: "in_progress", label: "In Progress", color: "border-orange-500/40" },
  { id: "review",      label: "Review",      color: "border-blue-500/40" },
  { id: "done",        label: "Done",        color: "border-green-500/40" },
];

const PRIORITY_STYLES: Record<string, string> = {
  low:    "bg-white/5 text-white/30 border-white/10",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  high:   "bg-orange-500/10 text-orange-400 border-orange-500/30",
  urgent: "bg-red-500/10 text-red-400 border-red-500/30",
};

function TaskCard({ task, onStatusChange, onDelete }: { task: Task & { assignee?: Profile }; onStatusChange: (id: string, s: Task["status"]) => void; onDelete: (id: string) => void }) {
  return (
    <motion.div
      layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl border border-white/8 bg-white/5 hover:bg-white/8 hover:border-white/15 transition-all duration-200 group space-y-3"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-white text-sm font-medium leading-tight">{task.title}</p>
        <button onClick={() => onDelete(task.id)} className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0">
          <X size={13} />
        </button>
      </div>
      {task.description && <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{task.description}</p>}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${PRIORITY_STYLES[task.priority]}`}>
          <Flag size={8} className="inline mr-1" />{task.priority}
        </span>
        {task.deadline && (
          <span className="text-white/30 text-[9px] flex items-center gap-1">
            <Calendar size={9} /> {new Date(task.deadline).toLocaleDateString()}
          </span>
        )}
        {task.assignee && (
          <span className="text-white/30 text-[9px] flex items-center gap-1">
            <User size={9} /> {task.assignee.full_name}
          </span>
        )}
      </div>
      {/* Quick status change */}
      <select
        value={task.status}
        onChange={e => onStatusChange(task.id, e.target.value as Task["status"])}
        className="w-full bg-white/5 border border-white/10 rounded-lg text-[10px] text-white/50 px-2 py-1.5 outline-none cursor-pointer hover:border-orange-500/40 transition-colors"
      >
        {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
      </select>
    </motion.div>
  );
}

export default function TasksTab({ addToast }: { addToast: (t: any, m: string) => void }) {
  const [tasks, setTasks] = useState<(Task & { assignee?: Profile })[]>([]);
  const [employees, setEmployees] = useState<Profile[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", priority: "medium", assigned_to: "", deadline: "" });

  useEffect(() => {
    const load = async () => {
      const { data: t } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
      const { data: p } = await supabase.from("profiles").select("*").eq("role", "employee");
      const empMap = Object.fromEntries((p ?? []).map((e: Profile) => [e.id, e]));
      setTasks((t ?? []).map((task: Task) => ({ ...task, assignee: empMap[task.assigned_to ?? ""] })));
      setEmployees(p ?? []);
    };
    load();
  }, []);

  const handleStatusChange = async (id: string, status: Task["status"]) => {
    await supabase.from("tasks").update({ status }).eq("id", id);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    addToast("success", "Task updated.");
  };

  const handleDelete = async (id: string) => {
    await supabase.from("tasks").delete().eq("id", id);
    setTasks(prev => prev.filter(t => t.id !== id));
    addToast("info", "Task deleted.");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    const { data } = await supabase.from("tasks").insert({
      title: form.title, description: form.description || null,
      priority: form.priority, status: "todo",
      assigned_to: form.assigned_to || null,
      deadline: form.deadline || null,
      created_by: session?.user.id,
    }).select().single();
    if (data) {
      const emp = employees.find(e => e.id === data.assigned_to);
      setTasks(prev => [{ ...data, assignee: emp }, ...prev]);
      setForm({ title: "", description: "", priority: "medium", assigned_to: "", deadline: "" });
      setShowModal(false);
      addToast("success", "Task created!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-[0_0_16px_rgba(249,115,22,0.3)]">
          <Plus size={14} /> New Task
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className={`rounded-2xl border ${col.color} bg-white/3 p-4 space-y-3`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{col.label}</h3>
                <span className="text-white/30 text-[10px] font-bold bg-white/5 px-2 py-0.5 rounded-full">{colTasks.length}</span>
              </div>
              <AnimatePresence>
                {colTasks.map(t => (
                  <TaskCard key={t.id} task={t} onStatusChange={handleStatusChange} onDelete={handleDelete} />
                ))}
              </AnimatePresence>
              {colTasks.length === 0 && <p className="text-white/15 text-xs text-center py-6">Empty</p>}
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-end"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md h-full bg-black border-l border-white/10 p-8 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-white font-bold text-lg">New Task</h2>
                <button onClick={() => setShowModal(false)} className="text-white/30 hover:text-white transition-colors"><X size={18} /></button>
              </div>
              <form onSubmit={handleCreate} className="space-y-5">
                {[
                  { label: "Title", key: "title", type: "text", required: true },
                  { label: "Deadline", key: "deadline", type: "date" },
                ].map(f => (
                  <div key={f.key} className="space-y-1.5">
                    <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{f.label}</label>
                    <input type={f.type} required={f.required} value={(form as any)[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500/50 transition-colors"
                    />
                  </div>
                ))}
                <div className="space-y-1.5">
                  <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Description</label>
                  <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white resize-none outline-none focus:border-orange-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Priority</label>
                  <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500/50 transition-colors"
                  >
                    {["low", "medium", "high", "urgent"].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Assign To</label>
                  <select value={form.assigned_to} onChange={e => setForm(p => ({ ...p, assigned_to: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500/50 transition-colors"
                  >
                    <option value="">Unassigned</option>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.full_name}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm uppercase tracking-wider transition-colors mt-4">
                  Create Task
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
