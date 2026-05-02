"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase, type Profile, type Team, type Task } from "../../../lib/supabase";
import { Crown, Users, Flag, CheckSquare } from "lucide-react";

const PRIORITY_STYLES: Record<string, string> = {
  low:    "text-white/30 border-white/10",
  medium: "text-yellow-400 border-yellow-500/30",
  high:   "text-orange-400 border-orange-500/30",
  urgent: "text-red-400 border-red-500/30",
};

export default function TeamTab({ profileId }: { profileId: string }) {
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<Profile[]>([]);
  const [lead, setLead] = useState<Profile | null>(null);
  const [teamTasks, setTeamTasks] = useState<Task[]>([]);

  useEffect(() => {
    (async () => {
      // Find which team this employee belongs to
      const { data: membership } = await supabase
        .from("team_members").select("team_id").eq("profile_id", profileId).single();
      if (!membership) return;

      const { data: teamData } = await supabase
        .from("teams").select("*").eq("id", membership.team_id).single();
      setTeam(teamData);

      // Get all members
      const { data: memberLinks } = await supabase
        .from("team_members").select("profile_id").eq("team_id", membership.team_id);
      const ids = (memberLinks ?? []).map((m: any) => m.profile_id);
      const { data: profiles } = await supabase.from("profiles").select("*").in("id", ids);
      setMembers(profiles ?? []);

      if (teamData?.lead_id) {
        const leadProfile = (profiles ?? []).find((p: Profile) => p.id === teamData.lead_id);
        setLead(leadProfile ?? null);
      }

      // Team tasks
      const { data: tasks } = await supabase
        .from("tasks").select("*").eq("assigned_team", membership.team_id).neq("status", "done");
      setTeamTasks(tasks ?? []);
    })();
  }, [profileId]);

  if (!team) return (
    <div className="py-20 text-center">
      <Users size={40} className="text-white/10 mx-auto mb-3" />
      <p className="text-white/30 text-sm">You haven&apos;t been assigned to a team yet.</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Team Header */}
      <div className="p-6 rounded-2xl border border-white/8 bg-white/5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">{team.department ?? "Team"}</p>
            <h2 className="text-white font-bold text-2xl">{team.name}</h2>
          </div>
          <div className="flex items-center gap-1.5 text-white/30 text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <Users size={12} /> {members.length} members
          </div>
        </div>

        {/* Lead */}
        {lead && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-500/8 border border-orange-500/15 w-fit">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
              {lead.full_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Crown size={11} className="text-orange-400" />
                <span className="text-orange-400 text-xs font-bold">Team Lead</span>
              </div>
              <p className="text-white font-semibold text-sm">{lead.full_name}</p>
            </div>
          </div>
        )}
      </div>

      {/* Members Grid */}
      <div>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-4">Members</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {members.map((m, i) => (
            <motion.div key={m.id}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/8 bg-white/5 hover:bg-white/8 transition-colors text-center"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                m.id === lead?.id
                  ? "bg-gradient-to-br from-orange-500 to-pink-600"
                  : "bg-gradient-to-br from-white/10 to-white/5"
              }`}>
                {m.full_name.charAt(0)}
              </div>
              <div>
                <p className="text-white text-xs font-semibold">{m.full_name}</p>
                <p className="text-white/40 text-[10px]">{m.position ?? m.department ?? "—"}</p>
                {m.id === lead?.id && (
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Crown size={9} className="text-orange-400" />
                    <span className="text-orange-400 text-[9px] font-bold">Lead</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Team Tasks */}
      <div>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-4">Team Tasks</p>
        {teamTasks.length === 0 && (
          <div className="flex items-center gap-3 text-white/20 py-8">
            <CheckSquare size={16} /> <span className="text-sm">No active team tasks.</span>
          </div>
        )}
        <div className="space-y-3">
          {teamTasks.map(task => (
            <div key={task.id} className="flex items-center gap-4 p-4 rounded-xl border border-white/8 bg-white/3 hover:bg-white/5 transition-colors">
              <div className={`w-1.5 h-1.5 rounded-full ${
                task.status === "in_progress" ? "bg-orange-400 animate-pulse" :
                task.status === "review" ? "bg-blue-400" : "bg-white/20"
              }`} />
              <p className="text-white text-sm flex-1">{task.title}</p>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${PRIORITY_STYLES[task.priority]}`}>
                <Flag size={8} className="inline mr-0.5" />{task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
