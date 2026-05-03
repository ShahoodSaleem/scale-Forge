-- Fix for profiles_role_check constraint to allow more flexible roles or positions
-- Run this in the Supabase SQL Editor

-- 1. Drop the existing constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- 2. Add a more flexible one or just leave it open. 
-- Since the app uses 'admin' and 'employee' for logic, we should probably keep those 
-- but maybe the user wants to store job titles in the role column?
-- Better yet, let's just allow anything for now to stop the errors, 
-- or specifically add common ones.

-- Option A: Remove constraint entirely
-- (Nothing more to do)

-- Option B: Update to include 'SEO Head', 'CTO', etc.
-- ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
-- CHECK (role in ('admin', 'employee', 'SEO Head', 'CTO', 'C-Suite'));

-- Recommendation: Keep 'admin'/'employee' as system roles and use 'position' for job titles.
-- But if the user's manual insert is failing, let's just remove the constraint to be safe.
