"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, type Task } from "../../../lib/supabase";
import { Flag, Calendar, CheckCircle2, ArrowRight } from "lucide-react";

const PRIORITY_STYLES: Record<string, string> = {
  low:    "bg-white/5 text-white/30 border-white/10",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  high:   "bg-orange-500/10 text-orange-400 border-orange-500/30",
  urgent: "bg-red-500/10 text-red-400 border-red-500/30",
};

const STATUS_NEXT: Record<string, Task["status"]> = {
  todo: "in_progress", in_progress: "review", review: "done", done: "done",
};
const STATUS_LABEL: Record<string, string> = {
  todo: "To Do", in_progress: "In Progress", review: "In Review", done: "Done",
};

export default function ActiveTasksTab({ profileId, addToast }: { profileId: string; addToast: (t: any, m: string) => void }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    supabase.from("tasks").select("*")
      .eq("assigned_to", profileId).neq("status", "done")
      .order("created_at", { ascending: false })
      .then(({ data }) => setTasks(data ?? []));
  }, [profileId]);

  const updateStatus = async (task: Task, nextStatus: Task["status"]) => {
    if (nextStatus === task.status) return;
    await supabase.from("tasks").update({ status: nextStatus }).eq("id", task.id);
    if (nextStatus === "done") {
      setTasks(prev => prev.filter(t => t.id !== task.id));
      addToast("success", `"${task.title}" marked as done 🎉`);
    } else {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: nextStatus } : t));
      addToast("success", `Moved to ${STATUS_LABEL[nextStatus]}`);
    }
  };

  return (
    <div className="space-y-4">
      {tasks.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <CheckCircle2 size={40} className="text-white/10" />
          <p className="text-white/30 text-sm">No active tasks. You&apos;re all caught up!</p>
        </div>
      )}
      <AnimatePresence>
        {tasks.map((task, i) => (
          <motion.div key={task.id} layout
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex items-start gap-5 p-5 rounded-2xl border border-white/8 bg-white/5 hover:bg-white/8 hover:border-white/15 transition-all duration-200 group"
          >
            {/* Status indicator */}
            <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
              task.status === "todo" ? "bg-white/20" :
              task.status === "in_progress" ? "bg-orange-400 animate-pulse" :
              "bg-blue-400"
            }`} />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="text-white font-semibold text-sm">{task.title}</p>
                <div className="relative shrink-0">
                  <select
                    value={task.status}
                    onChange={(e) => updateStatus(task, e.target.value as Task["status"])}
                    className={`appearance-none outline-none cursor-pointer pl-3 pr-8 py-1 rounded-full text-[9px] font-bold uppercase border transition-all ${
                      task.status === "todo" ? "bg-white/5 text-white/40 border-white/10 hover:bg-white/10" :
                      task.status === "in_progress" ? "bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500/20" :
                      "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
                    }`}
                  >
                    <option value="todo" className="bg-black text-white">To Do</option>
                    <option value="in_progress" className="bg-black text-white">In Progress</option>
                    <option value="review" className="bg-black text-white">In Review</option>
                    <option value="done" className="bg-black text-white">Done</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              {task.description && <p className="text-white/40 text-xs leading-relaxed mb-3">{task.description}</p>}

              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${PRIORITY_STYLES[task.priority]}`}>
                  <Flag size={8} className="inline mr-1" />{task.priority}
                </span>
                {task.deadline && (
                  <span className="text-white/30 text-[10px] flex items-center gap-1">
                    <Calendar size={9} /> {new Date(task.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
