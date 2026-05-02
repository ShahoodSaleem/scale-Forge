"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, type Team, type Profile } from "../../../lib/supabase";
import { Plus, Crown, ChevronDown, ChevronUp, X, Users } from "lucide-react";

interface TeamWithMembers extends Team {
  members: Profile[];
  lead?: Profile;
  expanded: boolean;
}

export default function TeamsTab({ addToast }: { addToast: (t: any, m: string) => void }) {
  const [teams, setTeams] = useState<TeamWithMembers[]>([]);
  const [employees, setEmployees] = useState<Profile[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", department: "", lead_id: "" });

  const load = async () => {
    const { data: teamsData } = await supabase.from("teams").select("*");
    const { data: membersData } = await supabase.from("team_members").select("*");
    const { data: profiles } = await supabase.from("profiles").select("*").eq("role", "employee");
    const profMap = Object.fromEntries((profiles ?? []).map((p: Profile) => [p.id, p]));

    setEmployees(profiles ?? []);
    setTeams((teamsData ?? []).map((t: Team) => {
      const memberIds = (membersData ?? []).filter((m: any) => m.team_id === t.id).map((m: any) => m.profile_id);
      return {
        ...t,
        members: memberIds.map((id: string) => profMap[id]).filter(Boolean),
        lead: t.lead_id ? profMap[t.lead_id] : undefined,
        expanded: false,
      };
    }));
  };

  useEffect(() => { load(); }, []);

  const toggleExpand = (id: string) =>
    setTeams(prev => prev.map(t => t.id === id ? { ...t, expanded: !t.expanded } : t));

  const handleAddMember = async (teamId: string, profileId: string) => {
    await supabase.from("team_members").upsert({ team_id: teamId, profile_id: profileId });
    addToast("success", "Member added to team.");
    load();
  };

  const handleRemoveMember = async (teamId: string, profileId: string) => {
    await supabase.from("team_members").delete().match({ team_id: teamId, profile_id: profileId });
    addToast("info", "Member removed.");
    load();
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("teams").insert({
      name: form.name, department: form.department || null,
      lead_id: form.lead_id || null,
    });
    setForm({ name: "", department: "", lead_id: "" });
    setShowModal(false);
    addToast("success", `Team "${form.name}" created!`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold uppercase tracking-wider transition-colors">
          <Plus size={14} /> New Team
        </button>
      </div>

      {teams.length === 0 && (
        <p className="text-white/30 text-sm text-center py-16">No teams yet. Create your first team.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {teams.map(team => (
          <motion.div key={team.id} layout className="rounded-2xl border border-white/8 bg-white/5 overflow-hidden">
            {/* Team Header */}
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white font-semibold">{team.name}</p>
                  {team.department && <p className="text-white/40 text-xs mt-0.5">{team.department}</p>}
                </div>
                <span className="text-white/30 text-[10px] font-bold bg-white/5 border border-white/8 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Users size={9} /> {team.members.length}
                </span>
              </div>

              {/* Lead */}
              {team.lead && (
                <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-orange-500/8 border border-orange-500/15">
                  <Crown size={11} className="text-orange-400" />
                  <span className="text-orange-400 text-xs font-semibold">{team.lead.full_name}</span>
                  <span className="text-orange-400/50 text-[10px]">Team Lead</span>
                </div>
              )}

              {/* Member Avatars (collapsed) */}
              <div className="flex items-center gap-1 flex-wrap mb-3">
                {team.members.slice(0, 6).map(m => (
                  <div key={m.id} className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white text-[10px] font-bold" title={m.full_name}>
                    {m.full_name.charAt(0)}
                  </div>
                ))}
                {team.members.length > 6 && (
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/50 text-[9px] font-bold">
                    +{team.members.length - 6}
                  </div>
                )}
              </div>

              <button onClick={() => toggleExpand(team.id)} className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-[10px] font-bold uppercase tracking-wider transition-colors">
                {team.expanded ? <><ChevronUp size={12} /> Collapse</> : <><ChevronDown size={12} /> Expand</>}
              </button>
            </div>

            {/* Expanded Members */}
            <AnimatePresence>
              {team.expanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                  className="border-t border-white/8 overflow-hidden"
                >
                  <div className="p-4 space-y-2">
                    {team.members.map(m => (
                      <div key={m.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/3 hover:bg-white/6 transition-colors">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white text-[9px] font-bold">{m.full_name.charAt(0)}</div>
                          <span className="text-white/70 text-xs">{m.full_name}</span>
                        </div>
                        <button onClick={() => handleRemoveMember(team.id, m.id)} className="text-white/20 hover:text-red-400 transition-colors">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {/* Add member */}
                    <select onChange={e => { if (e.target.value) { handleAddMember(team.id, e.target.value); e.target.value = ""; }}}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/50 outline-none hover:border-orange-500/40 transition-colors mt-2"
                    >
                      <option value="">+ Add member…</option>
                      {employees.filter(e => !team.members.find(m => m.id === e.id)).map(e => (
                        <option key={e.id} value={e.id}>{e.full_name}</option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Create Team Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center px-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm bg-black border border-white/10 rounded-2xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-bold text-lg">New Team</h2>
                <button onClick={() => setShowModal(false)} className="text-white/30 hover:text-white"><X size={18} /></button>
              </div>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                {[{ label: "Team Name", key: "name", required: true }, { label: "Department", key: "department" }].map(f => (
                  <div key={f.key} className="space-y-1.5">
                    <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{f.label}</label>
                    <input type="text" required={f.required} value={(form as any)[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500/50 transition-colors"
                    />
                  </div>
                ))}
                <div className="space-y-1.5">
                  <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Team Lead</label>
                  <select value={form.lead_id} onChange={e => setForm(p => ({ ...p, lead_id: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500/50 transition-colors"
                  >
                    <option value="">No lead</option>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.full_name}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm uppercase tracking-wider transition-colors mt-2">
                  Create Team
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
