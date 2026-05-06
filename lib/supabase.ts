import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase environment variables are missing! Portals will not function.");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// ── Shared Types ──────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: string; // Changed from 'admin' | 'employee' to allow flexible roles like SEO Head
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

// ── CEO Portal Types ──────────────────────────────────────────────────────────

export interface FinancialAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'wallet';
  balance: number;
  currency: string;
  institution?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CeoTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  client_name?: string;
  account_id?: string;
  reference?: string;
  notes?: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email?: string;
  issued_date: string;
  due_date?: string;
  status: 'unpaid' | 'paid' | 'overdue' | 'draft' | 'cancelled';
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes?: string;
  pdf_url?: string;
  currency: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  created_at: string;
}

export interface PaymentPlan {
  id: string;
  client_name: string;
  project_name: string;
  total_amount: number;
  upfront_amount: number;
  remaining_balance: number;
  installment_amount: number;
  frequency: 'monthly' | 'bimonthly' | 'quarterly';
  currency: string;
  total_installments: number;
  installments_paid: number;
  start_date: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeSalary {
  id: string;
  employee_name: string;
  position: string;
  department?: string;
  role_type: 'regular' | 'sales' | 'senior' | 'contractor';
  base_salary: number;
  currency: string;
  commission_rate?: number;
  start_date: string;
  status: 'active' | 'inactive' | 'on_leave';
  impact_notes?: string;
  profile_id?: string;
  created_at: string;
  updated_at: string;
}

export interface SalarySalesRecord {
  id: string;
  employee_id: string;
  month: number;
  year: number;
  sales_amount: number;
  commission_rate?: number;
  commission_earned: number;
  notes?: string;
  created_at: string;
}

export interface CurrencyRate {
  id: string;
  currency: string;
  to_pkr_rate: number;
  updated_at: string;
}
