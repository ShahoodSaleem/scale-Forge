"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, type Meeting } from "../../../lib/supabase";
import { Plus, X, ChevronLeft, ChevronRight, Clock, Link as LinkIcon, Users } from "lucide-react";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function CalendarTab({ addToast, role = "admin" }: { addToast: (t: any, m: string) => void, role?: string }) {
  const isAdmin = role === "admin";
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", description: "", link: "", start: "", end: "", attendees: [] as string[] });

  useEffect(() => {
    supabase.from("profiles").select("*").eq("role", "employee").then(({ data }) => setEmployees(data ?? []));
  }, []);

  useEffect(() => {
    const from = new Date(year, month, 1).toISOString();
    const to   = new Date(year, month + 1, 0, 23, 59).toISOString();
    supabase.from("meetings").select("*").gte("start_time", from).lte("start_time", to)
      .then(({ data }) => setMeetings(data ?? []));
  }, [year, month]);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const daysInMonth  = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const getMeetingsForDay = (day: number) =>
    meetings.filter(m => new Date(m.start_time).getDate() === day);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    const { data } = await supabase.from("meetings").insert({
      title: form.title, 
      description: form.description ? `${form.description}\n\nLink: ${form.link}` : (form.link ? `Link: ${form.link}` : null),
      start_time: form.start, end_time: form.end,
      created_by: session?.user.id, color: "orange",
      attendees: form.attendees,
    }).select().single();
    if (data) {
      setMeetings(prev => [...prev, data]);
      setShowModal(false);
      setForm({ title: "", description: "", link: "", start: "", end: "", attendees: [] });
      addToast("success", "Meeting added!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors"><ChevronLeft size={16} /></button>
          <h2 className="text-white font-bold text-lg">{MONTH_NAMES[month]} {year}</h2>
          <button onClick={nextMonth} className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors"><ChevronRight size={16} /></button>
        </div>
        {isAdmin && (
          <button onClick={() => { setSelectedMeeting(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold uppercase tracking-wider transition-colors">
            <Plus size={14} /> Add Meeting
          </button>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-white/8">
          {DAY_NAMES.map(d => (
            <div key={d} className="py-3 text-center text-[10px] font-bold uppercase tracking-widest text-white/30">{d}</div>
          ))}
        </div>
        {/* Day cells */}
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[90px] border-b border-r border-white/5 p-2" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const dayMeetings = getMeetingsForDay(day);
            return (
              <div
                key={day}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                onDoubleClick={() => {
                  if (!isAdmin) return;
                  const clickedDate = new Date(year, month, day);
                  const formattedDate = `${clickedDate.getFullYear()}-${String(clickedDate.getMonth() + 1).padStart(2, '0')}-${String(clickedDate.getDate()).padStart(2, '0')}`;
                  setForm(prev => ({
                    ...prev,
                    start: `${formattedDate}T09:00`,
                    end: `${formattedDate}T10:00`
                  }));
                  setSelectedMeeting(null);
                  setShowModal(true);
                }}
                className={`relative min-h-[90px] border-b border-r border-white/5 p-2 transition-colors cursor-pointer ${isToday ? "bg-orange-500/5" : "hover:bg-white/3"}`}
              >
                <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                  isToday ? "bg-orange-500 text-white" : "text-white/40"
                }`}>{day}</span>
                <div className="mt-1 space-y-1">
                  {dayMeetings.slice(0, 2).map(m => (
                    <div 
                      key={m.id} 
                      onClick={(e) => { e.stopPropagation(); setSelectedMeeting(m); setShowModal(true); }}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 truncate font-medium hover:bg-orange-500/30 transition-colors"
                    >
                      {m.title}
                    </div>
                  ))}
                  {dayMeetings.length > 2 && (
                    <div className="text-[9px] text-white/30">+{dayMeetings.length - 2} more</div>
                  )}
                </div>
                {/* Hover preview */}
                {hoveredDay === day && dayMeetings.length > 0 && (
                  <div className="absolute left-full top-0 z-30 ml-2 w-52 bg-black border border-white/10 rounded-xl p-3 shadow-2xl space-y-2">
                    {dayMeetings.map(m => (
                      <div key={m.id}>
                        <p className="text-white text-xs font-semibold">{m.title}</p>
                        <p className="text-white/40 text-[10px] flex items-center gap-1 mt-0.5">
                          <Clock size={9} />
                          {new Date(m.start_time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          {" – "}
                          {new Date(m.end_time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Meeting Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center px-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-black border border-white/10 rounded-2xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-bold text-lg">{selectedMeeting ? "Meeting Details" : "Add Meeting"}</h2>
                <button onClick={() => setShowModal(false)} className="text-white/30 hover:text-white"><X size={18} /></button>
              </div>

              {selectedMeeting ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-white font-semibold text-xl">{selectedMeeting.title}</h3>
                    <p className="text-white/40 text-xs mt-1 flex items-center gap-2">
                      <Clock size={12} />
                      {new Date(selectedMeeting.start_time).toLocaleString()} – {new Date(selectedMeeting.end_time).toLocaleTimeString()}
                    </p>
                  </div>

                  {selectedMeeting.description && (
                    <div className="space-y-1.5">
                      <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Description</label>
                      <p className="text-white/80 text-sm whitespace-pre-wrap bg-white/5 p-4 rounded-xl border border-white/5">
                        {selectedMeeting.description}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Meeting Link</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white/60 truncate">
                        {selectedMeeting.description?.match(/https?:\/\/[^\s]+/)?.[0] || "No link provided"}
                      </div>
                      {selectedMeeting.description?.match(/https?:\/\/[^\s]+/)?.[0] && (
                        <button 
                          onClick={() => {
                            const link = selectedMeeting.description?.match(/https?:\/\/[^\s]+/)?.[0];
                            if (link) {
                              navigator.clipboard.writeText(link);
                              addToast("success", "Link copied!");
                            }
                          }}
                          className="p-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white transition-colors"
                        >
                          <LinkIcon size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Attendees</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedMeeting.attendees?.length > 0 ? (
                        selectedMeeting.attendees.map(id => {
                          const emp = employees.find(e => e.id === id);
                          return (
                            <div key={id} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/60 flex items-center gap-2">
                              <Users size={10} /> {emp?.full_name || "Unknown"}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-white/30 text-xs italic">No attendees listed</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : isAdmin ? (
                <form onSubmit={handleCreate} className="space-y-4">
                  {[
                    { label: "Title", key: "title", type: "text", required: true },
                    { label: "Description", key: "description", type: "text" },
                    { label: "Meeting Link", key: "link", type: "url" },
                    { label: "Start", key: "start", type: "datetime-local", required: true },
                    { label: "End",   key: "end",   type: "datetime-local", required: true },
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
                    <label className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Attendees</label>
                    <select 
                      multiple 
                      value={form.attendees}
                      onChange={e => {
                        const options = Array.from(e.target.selectedOptions, option => option.value);
                        setForm(p => ({ ...p, attendees: options }));
                      }}
                      className="w-full h-24 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500/50 transition-colors"
                    >
                      {employees.map(e => (
                        <option key={e.id} value={e.id}>{e.full_name}</option>
                      ))}
                    </select>
                    <p className="text-[9px] text-white/30">Hold Ctrl (or Cmd) to select multiple</p>
                  </div>

                  <button type="submit" className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm uppercase tracking-wider transition-colors mt-2">
                    Save Meeting
                  </button>
                </form>
              ) : (
                <p className="text-white/40 text-center py-8">Select a meeting to view details.</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
