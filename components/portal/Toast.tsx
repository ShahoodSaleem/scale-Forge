"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastData {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface ToastProps {
  toasts: ToastData[];
  remove: (id: string) => void;
}

const icons = { success: CheckCircle2, error: AlertCircle, info: Info };
const colors = {
  success: "border-green-500/30 bg-green-500/10 text-green-400",
  error:   "border-red-500/30 bg-red-500/10 text-red-400",
  info:    "border-orange-500/30 bg-orange-500/10 text-orange-400",
};

function ToastItem({ toast, remove }: { toast: ToastData; remove: (id: string) => void }) {
  const Icon = icons[toast.type];
  useEffect(() => {
    const t = setTimeout(() => remove(toast.id), 4000);
    return () => clearTimeout(t);
  }, [toast.id, remove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.25 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-xl text-sm max-w-sm ${colors[toast.type]}`}
    >
      <Icon size={15} className="shrink-0" />
      <span className="flex-1 font-medium">{toast.message}</span>
      <button onClick={() => remove(toast.id)} className="opacity-50 hover:opacity-100 transition-opacity">
        <X size={13} />
      </button>
    </motion.div>
  );
}

export default function Toast({ toasts, remove }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map(t => <ToastItem key={t.id} toast={t} remove={remove} />)}
      </AnimatePresence>
    </div>
  );
}

// Hook for easy toast management
import { useState, useCallback } from "react";

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const add = useCallback((type: ToastData["type"], message: string) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);
  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);
  return { toasts, add, remove };
}
