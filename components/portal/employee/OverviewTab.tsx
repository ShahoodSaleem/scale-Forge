"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, type AttendanceLog, type Profile } from "../../../lib/supabase";
import { Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function OverviewTab({ profile }: { profile: Profile }) {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("attendance_logs")
      .select("*")
      .eq("profile_id", profile.id)
      .eq("event_type", "time_in")
      .order("timestamp", { ascending: false })
      .then(({ data }) => {
        setLogs(data ?? []);
        setLoading(false);
      });
  }, [profile.id]);

  const expectedIn = profile.expected_time_in;
  
  // Calculate late attendances
  const lateLogs = logs.filter(log => {
    if (!expectedIn) return false;
    
    // Parse time strings
    const logTime = new Date(log.timestamp);
    const logHours = logTime.getHours();
    const logMins = logTime.getMinutes();
    
    const [expHoursStr, expMinsStr] = expectedIn.split(":");
    const expHours = parseInt(expHoursStr, 10);
    const expMins = parseInt(expMinsStr, 10);
    
    // Convert both to minutes since midnight for easy comparison
    const logTotalMins = logHours * 60 + logMins;
    // Allow a 5 minute grace period? Or strict? Let's use strict, any minute past expected is late.
    const expTotalMins = expHours * 60 + expMins;
    
    return logTotalMins > expTotalMins;
  });

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }

  function formatExpected(time: string) {
    const [h, m] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(h, 10), parseInt(m, 10));
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }

  if (loading) {
    return <div className="text-white/30 text-sm text-center py-10">Loading overview...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Expected Hours Banner */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-white font-bold text-lg">Your Schedule</h3>
          <p className="text-white/40 text-sm mt-1">Your expected working hours as set by administration.</p>
        </div>
        <div className="flex items-center gap-3">
          {expectedIn ? (
            <div className="bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
              <Clock size={16} className="text-orange-400" />
              <span className="text-orange-400 font-bold text-sm tracking-wider">
                {formatExpected(expectedIn)} - {profile.expected_time_out ? formatExpected(profile.expected_time_out) : "End"}
              </span>
            </div>
          ) : (
            <span className="text-white/30 text-sm">No schedule assigned</span>
          )}
        </div>
      </div>

      {/* Late Attendances */}
      <div>
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          Late Attendances
          {lateLogs.length > 0 && (
            <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {lateLogs.length} Total
            </span>
          )}
        </h3>

        {!expectedIn ? (
          <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-white/40 text-sm">You don't have an expected check-in time assigned yet.</p>
          </div>
        ) : lateLogs.length === 0 ? (
          <div className="text-center py-12 bg-green-500/5 border border-green-500/10 rounded-2xl">
            <CheckCircle2 size={32} className="text-green-400 mx-auto mb-3" />
            <p className="text-white font-semibold">Perfect Attendance!</p>
            <p className="text-white/40 text-sm">You haven't been late for any check-ins.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {lateLogs.map((log, i) => {
                const logTime = new Date(log.timestamp);
                const logMins = logTime.getHours() * 60 + logTime.getMinutes();
                const [h, m] = expectedIn.split(":");
                const expMins = parseInt(h, 10) * 60 + parseInt(m, 10);
                const diffMins = logMins - expMins;
                
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5"
                  >
                    <div className="flex items-center gap-2 text-red-400 mb-3">
                      <AlertTriangle size={16} />
                      <span className="text-xs font-bold uppercase tracking-widest">
                        {diffMins} Minutes Late
                      </span>
                    </div>
                    <p className="text-white font-semibold text-sm mb-1">
                      {new Date(log.date).toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                    <div className="flex items-center justify-between text-xs mt-3">
                      <span className="text-white/40">Expected: {formatExpected(expectedIn)}</span>
                      <span className="text-red-400/80 font-medium">Actual: {formatTime(log.timestamp)}</span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
