"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, type AttendanceLog } from "../../../lib/supabase";
import { Timer, LogIn, LogOut, Coffee, ChevronDown, ChevronUp } from "lucide-react";

function calcHoursWorked(logs: AttendanceLog[]): string {
  let totalMs = 0;
  let lastIn: Date | null = null;
  let breakStart: Date | null = null;
  let breakTotal = 0;

  logs.forEach(log => {
    const ts = new Date(log.timestamp);
    if (log.event_type === "time_in") lastIn = ts;
    if (log.event_type === "break_start") breakStart = ts;
    if (log.event_type === "break_end" && breakStart) { 
      breakTotal += ts.getTime() - breakStart.getTime(); 
      breakStart = null; 
    }
    if (log.event_type === "time_out" && lastIn) { 
      totalMs += ts.getTime() - lastIn.getTime() - breakTotal; 
      lastIn = null; 
      breakTotal = 0;
    }
  });

  const hrs = Math.floor(totalMs / 3600000);
  const mins = Math.floor((totalMs % 3600000) / 60000);
  return totalMs > 0 ? `${hrs}h ${mins}m` : "—";
}

function aggregateDayLogs(logs: AttendanceLog[]) {
  const shifts: { in: string | null; out: string | null }[] = [];
  const breaks: { start: string | null; end: string | null }[] = [];
  
  const sorted = [...logs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  let currentShift: { in: string | null; out: string | null } | null = null;
  let currentBreak: { start: string | null; end: string | null } | null = null;

  sorted.forEach(log => {
    if (log.event_type === "time_in") {
      currentShift = { in: log.timestamp, out: null };
      shifts.push(currentShift);
    } else if (log.event_type === "time_out") {
      if (currentShift) {
        currentShift.out = log.timestamp;
        currentShift = null;
      } else {
        shifts.push({ in: null, out: log.timestamp });
      }
    } else if (log.event_type === "break_start") {
      currentBreak = { start: log.timestamp, end: null };
      breaks.push(currentBreak);
    } else if (log.event_type === "break_end") {
      if (currentBreak) {
        currentBreak.end = log.timestamp;
        currentBreak = null;
      } else {
        breaks.push({ start: null, end: log.timestamp });
      }
    }
  });

  return { shifts, breaks };
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function EmployeeAttendanceCard({ date, dayLogs, index }: { date: string, dayLogs: AttendanceLog[], index: number }) {
  const [expanded, setExpanded] = useState(false);
  const hours = calcHoursWorked([...dayLogs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
  const agg = aggregateDayLogs(dayLogs);
  
  // A shift is ongoing if the last shift has no time out.
  const isOngoing = agg.shifts.length > 0 && agg.shifts[agg.shifts.length - 1].out === null;
  const isAbsent = dayLogs.some(l => l.event_type === "absent");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
      className={`border rounded-2xl overflow-hidden transition-colors ${isAbsent ? "bg-red-500/5 border-red-500/20" : "bg-white/5 border-white/10"}`}
    >
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex items-center gap-4 flex-wrap">
          <h3 className="text-white font-bold text-lg">
            {new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </h3>
          {isAbsent ? (
            <div className="flex items-center gap-2 text-red-400 font-bold bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl text-xs">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Absent
            </div>
          ) : (
            <div className="flex items-center gap-2 text-orange-400 font-bold bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-xl text-xs">
              <Timer size={14} />
              {hours !== "—" ? `${hours} Total` : ""}
              {hours === "—" && isOngoing ? "Ongoing Shift" : ""}
              {hours !== "—" && isOngoing ? " (+ Ongoing)" : ""}
              {hours === "—" && !isOngoing ? "No Completed Shifts" : ""}
            </div>
          )}
        </div>
        <div className="text-white/40 flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="px-5 pb-5"
          >
            <div className="pt-5 border-t border-white/5">
              {/* Shifts */}
              <div className="space-y-4 mb-6">
                {agg.shifts.map((s, i) => (
                  <div key={i} className="grid grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                      <div className="flex items-center gap-2 text-green-400 mb-2">
                        <LogIn size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Time In {agg.shifts.length > 1 ? `#${i+1}` : ""}</span>
                      </div>
                      <p className="text-white font-medium text-lg">{s.in ? formatTime(s.in) : "—"}</p>
                    </div>
                    <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                      <div className="flex items-center gap-2 text-red-400 mb-2">
                        <LogOut size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Time Out {agg.shifts.length > 1 ? `#${i+1}` : ""}</span>
                      </div>
                      <p className="text-white font-medium text-lg">{s.out ? formatTime(s.out) : "—"}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Breaks */}
              {agg.breaks.length > 0 && (
                <div className="space-y-3">
                  <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <Coffee size={12} /> Break History ({agg.breaks.length})
                  </span>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {agg.breaks.map((b, i) => (
                      <div key={i} className="flex items-center justify-between text-sm text-white/70 bg-black/20 rounded-xl p-3 border border-white/5">
                        <span className="font-medium text-white">{b.start ? formatTime(b.start) : "—"}</span>
                        <span className="text-white/30 text-[10px] uppercase">to</span>
                        <span className="font-medium text-white">{b.end ? formatTime(b.end) : "Ongoing"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AttendanceHistoryTab({ profileId }: { profileId: string }) {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);

  useEffect(() => {
    supabase.from("attendance_logs").select("*")
      .eq("profile_id", profileId)
      .order("timestamp", { ascending: false })
      .limit(150)
      .then(({ data }) => setLogs(data ?? []));
  }, [profileId]);

  const grouped: Record<string, AttendanceLog[]> = {};
  logs.forEach(l => { if (!grouped[l.date]) grouped[l.date] = []; grouped[l.date].push(l); });
  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-4">
      {dates.length === 0 && (
        <p className="text-white/30 text-sm text-center py-16">No attendance history yet.</p>
      )}
      {dates.map((date, index) => (
        <EmployeeAttendanceCard key={date} date={date} dayLogs={grouped[date]} index={index} />
      ))}
    </div>
  );
}
