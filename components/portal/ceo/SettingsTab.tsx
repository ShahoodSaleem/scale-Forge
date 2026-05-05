"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../../lib/supabase";
import { motion } from "framer-motion";
import { Settings, Save, RefreshCw } from "lucide-react";
import type { CurrencyRate } from "../../../lib/supabase";

export default function CeoSettingsTab({ addToast }: {
  addToast: (type: "success" | "error" | "info", msg: string) => void;
}) {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("currency_rates").select("*").order("currency");
    if (!error && data) {
      setRates(data);
      const initialForm: Record<string, string> = {};
      data.forEach(r => initialForm[r.currency] = String(r.to_pkr_rate));
      
      // Default to these if not present
      if (!initialForm['USD']) initialForm['USD'] = '278.50';
      if (!initialForm['EUR']) initialForm['EUR'] = '300.20';
      if (!initialForm['GBP']) initialForm['GBP'] = '350.00';
      
      setForm(initialForm);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    setSaving(true);
    
    const currencies = ['USD', 'EUR', 'GBP'];
    for (const c of currencies) {
      if (!form[c]) continue;
      const rate = parseFloat(form[c]);
      
      // Upsert
      await supabase.from("currency_rates").upsert({
        currency: c,
        to_pkr_rate: rate
      }, { onConflict: 'currency' });
    }
    
    addToast("success", "Exchange rates updated successfully.");
    setSaving(false);
    load();
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-7 h-7 rounded-full border-2 border-yellow-500/30 border-t-yellow-400 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Settings className="text-white/40" size={20} />
        </div>
        <div>
          <h2 className="text-white font-bold tracking-wide">Platform Settings</h2>
          <p className="text-white/40 text-xs">Configure global preferences and exchange rates</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/6 bg-white/3 overflow-hidden">
        
        <div className="p-5 border-b border-white/5 bg-white/2">
          <h3 className="text-white/80 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <RefreshCw size={14} className="text-yellow-500" />
            Exchange Rates (to PKR)
          </h3>
          <p className="text-white/30 text-xs mt-1">
            These rates are used globally across the dashboard when toggling between PKR and original currencies.
          </p>
        </div>

        <div className="p-6 space-y-5">
          {['USD', 'EUR', 'GBP'].map((currency) => (
            <div key={currency} className="flex items-center gap-4">
              <div className="w-20">
                <p className="text-white/60 font-bold tracking-wider">{currency}</p>
                <p className="text-white/20 text-[10px] uppercase">1 {currency} = </p>
              </div>
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm font-mono">₨</span>
                <input
                  type="number"
                  step="0.01"
                  value={form[currency] || ''}
                  onChange={(e) => setForm(f => ({ ...f, [currency]: e.target.value }))}
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-white font-mono text-sm outline-none focus:border-yellow-500/50 transition-colors"
                />
              </div>
              <div className="w-12 text-white/30 text-xs font-bold uppercase">PKR</div>
            </div>
          ))}

          <div className="pt-4 mt-4 border-t border-white/5 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold text-xs uppercase tracking-wider hover:from-yellow-400 hover:to-yellow-500 transition-all disabled:opacity-50"
            >
              {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? "Saving..." : "Save Rates"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
