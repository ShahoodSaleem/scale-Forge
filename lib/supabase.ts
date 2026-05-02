import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Shared Types ──────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'employee';
  avatar_url?: string;
  department?: string;
  position?: string;
  expected_time_in?: string;
  expected_time_out?: string;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  department?: string;
  lead_id?: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  profile_id: string;
  joined_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  assigned_team?: string;
  created_by?: string;
  deadline?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceLog {
  id: string;
  profile_id: string;
  event_type: 'time_in' | 'break_start' | 'break_end' | 'time_out' | 'absent';
  timestamp: string;
  date: string;
  notes?: string;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  created_by?: string;
  attendees: string[];
  color: string;
  created_at: string;
}
