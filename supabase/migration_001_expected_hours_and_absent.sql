-- Migration: Add expected hours, update RLS, and allow 'absent' marks
-- Run this snippet in your Supabase SQL Editor

-- 1. Add expected hours to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS expected_time_in text,
ADD COLUMN IF NOT EXISTS expected_time_out text;

-- 2. Add missing RLS policies so Admins can update and delete profiles
CREATE POLICY "Admins can update profiles"
  ON public.profiles FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- 3. Update the attendance_logs check constraint to allow 'absent'
ALTER TABLE public.attendance_logs
DROP CONSTRAINT IF EXISTS attendance_logs_event_type_check;

ALTER TABLE public.attendance_logs
ADD CONSTRAINT attendance_logs_event_type_check 
CHECK (event_type IN ('time_in', 'break_start', 'break_end', 'time_out', 'absent'));
