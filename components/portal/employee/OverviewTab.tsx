"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, type AttendanceLog, type Profile, type Task, type Meeting, type Team } from "../../../lib/supabase";
import { Clock, AlertTriangle, CheckCircle2, Calendar, CheckSquare, Users } from "lucide-react";

export default function OverviewTab({ profile }: { profile: Profile }) {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [logsRes, tasksRes, meetingsRes, teamsRes] = await Promise.all([
        supabase.from("attendance_logs")
          .select("*")
          .eq("profile_id", profile.id)
          .eq("event_type", "time_in")
          .order("timestamp", { ascending: false }),
        supabase.from("tasks")
          .select("*")
          .eq("assigned_to", profile.id)
          .neq("status", "done")
          .order("deadline", { ascending: true, nullsFirst: false }),
        supabase.from("meetings")
          .select("*")
          .contains("attendees", [profile.id])
          .gte("start_time", new Date().toISOString())
          .order("start_time", { ascending: true }),
        supabase.from("team_members")
          .select("*, teams(*)")
          .eq("profile_id", profile.id)
      ]);

      setLogs(logsRes.data ?? []);
      setTasks(tasksRes.data ?? []);
      setMeetings(meetingsRes.data ?? []);
      
      // Extract team objects from the join
      const userTeams = (teamsRes.data ?? []).map((tm: any) => tm.teams).filter(Boolean);
      setTeams(userTeams);
      
      setLoading(false);
    }
    
    loadData();
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Active Tasks */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <CheckSquare size={20} className="text-cyan-400" /> Tasks in Hand
            {tasks.length > 0 && (
              <span className="bg-cyan-500/20 text-cyan-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {tasks.length} Active
              </span>
            )}
          </h3>
          {tasks.length === 0 ? (
            <div className="text-center py-8 bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-white/40 text-sm">No active tasks assigned to you.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {tasks.map(task => (
                <div key={task.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors">
                  <h4 className="text-white font-semibold mb-1 text-sm">{task.title}</h4>
                  <div className="flex items-center justify-between text-[10px] mt-3">
                    <span className={`px-2 py-1 rounded border font-semibold ${
                      task.priority === 'urgent' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                      task.priority === 'high' ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' :
                      task.priority === 'medium' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' :
                      'bg-gray-500/20 border-gray-500/50 text-gray-400'
                    }`}>
                      {task.priority.toUpperCase()}
                    </span>
                    <span className="text-white/40">
                      {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Meetings */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-orange-400" /> Upcoming Meetings
            {meetings.length > 0 && (
              <span className="bg-orange-500/20 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {meetings.length} Scheduled
              </span>
            )}
          </h3>
          {meetings.length === 0 ? (
            <div className="text-center py-8 bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-white/40 text-sm">No upcoming meetings scheduled.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {meetings.map(meeting => {
                const start = new Date(meeting.start_time);
                const end = new Date(meeting.end_time);
                return (
                  <div key={meeting.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 border-l-4" style={{ borderLeftColor: meeting.color }}>
                    <h4 className="text-white font-semibold text-sm mb-1">{meeting.title}</h4>
                    <p className="text-white/50 text-[10px] mb-2">{start.toLocaleDateString()}</p>
                    <div className="text-xs font-medium text-white/80">
                      {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Enrolled Teams */}
      <div className="mt-6">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Users size={20} className="text-purple-400" /> Your Teams
        </h3>
        {teams.length === 0 ? (
          <div className="text-center py-8 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-white/40 text-sm">You are not enrolled in any teams.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {teams.map(team => (
              <div key={team.id} className="bg-purple-500/10 border border-purple-500/20 rounded-xl px-5 py-3 flex flex-col">
                <span className="text-purple-300 font-semibold text-sm">{team.name}</span>
                {team.department && <span className="text-purple-400/50 text-[10px] uppercase mt-1">{team.department}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
