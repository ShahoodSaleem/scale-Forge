"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, CheckCircle2, Loader2, Mail, Key } from "lucide-react";
import { createEmployeeAccount } from "../../../app/actions/admin";
import { supabase } from "../../../lib/supabase";

export default function OnboardingTab({ addToast }: { addToast: (t: any, m: string) => void }) {
  const [method, setMethod] = useState<"email" | "manual">("email");
  const [form, setForm] = useState({
    full_name: "", email: "", role: "employee",
    password: "", department: "", position: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (method === "manual" && form.password.length < 6) {
      addToast("error", "Password must be at least 6 characters.");
      return;
    }
    setLoading(true);

    const result = await createEmployeeAccount({
      email: form.email,
      password: form.password,
      fullName: form.full_name,
      role: form.role,
      method,
    });

    if (result.error) {
      addToast("error", result.error);
      setLoading(false);
      return;
    }

    // Attempt to upsert the department and position if they exist.
    // The profile is auto-created by the DB trigger, but we need to update it.
    // We wait briefly for the trigger to finish before updating.
    if (form.department || form.position) {
      setTimeout(async () => {
        const { data: userRecord } = await supabase.from("profiles").select("id").eq("email", form.email).single();
        if (userRecord) {
          await supabase.from("profiles").update({
            department: form.department || null,
            position: form.position || null
          }).eq("id", userRecord.id);
        }
      }, 1500);
    }

    addToast("success", result.message || "Success");
    setSuccess(true);
    setLoading(false);
    
    setTimeout(() => {
      setSuccess(false);
      setForm({ full_name: "", email: "", role: "employee", password: "", department: "", position: "" });
    }, 3000);
  };

  const fields = [
    { label: "Full Name",   key: "full_name",   type: "text",  required: true, placeholder: "Jane Smith" },
    { label: "Email",       key: "email",        type: "email", required: true, placeholder: "jane@company.com" },
    { label: "Department",  key: "department",   type: "text",  placeholder: "Engineering" },
    { label: "Position",    key: "position",     type: "text",  placeholder: "Frontend Developer" },
  ];

  return (
    <div className="max-w-lg">
      <div className="mb-8">
        <h2 className="text-white font-bold text-xl mb-2">Onboard New Team Member</h2>
        <p className="text-white/40 text-sm">Choose how you want to invite your new team member.</p>
      </div>

      {/* Method Selector */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setMethod("email")}
          className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
            method === "email" ? "bg-orange-500/10 border-orange-500/50 text-orange-400" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
          }`}
        >
          <Mail size={20} />
          <span className="text-xs font-bold uppercase tracking-wider">Send Email Invite</span>
        </button>
        <button 
          onClick={() => setMethod("manual")}
          className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
            method === "manual" ? "bg-orange-500/10 border-orange-500/50 text-orange-400" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
          }`}
        >
          <Key size={20} />
          <span className="text-xs font-bold uppercase tracking-wider">Create Credentials</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl border border-white/8 bg-white/5 backdrop-blur-xl p-8"
      >
        <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

        {success ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-4 py-8"
          >
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-green-400" />
            </div>
            <p className="text-white font-semibold">Success!</p>
            <p className="text-white/40 text-sm text-center">
              {method === "email" ? `An email has been sent to ${form.email}.` : `The account for ${form.email} is ready.`}
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map(f => (
              <div key={f.key} className="space-y-1.5">
                <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{f.label}</label>
                <input
                  type={f.type} required={f.required} placeholder={f.placeholder}
                  value={(form as any)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-orange-500/50 transition-colors"
                />
              </div>
            ))}

            {method === "manual" && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="space-y-1.5 overflow-hidden">
                <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Temporary Password</label>
                <input
                  type="password" required placeholder="Min 6 characters"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-orange-500/50 transition-colors"
                />
              </motion.div>
            )}

            {/* Role selector */}
            <div className="space-y-1.5">
              <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Role</label>
              <div className="flex gap-3">
                {["employee", "admin"].map(r => (
                  <button key={r} type="button" onClick={() => setForm(p => ({ ...p, role: r }))}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                      form.role === r
                        ? "bg-orange-500 border-orange-500 text-white"
                        : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/20"
                    }`}
                  >{r}</button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-50 mt-2 shadow-[0_0_20px_rgba(249,115,22,0.25)]"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              {loading ? (method === "email" ? "Sending Invite…" : "Creating Account…") : (method === "email" ? "Send Invite" : "Create Account")}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
