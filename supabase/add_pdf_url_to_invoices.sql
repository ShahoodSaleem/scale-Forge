-- ============================================================
-- ScaleForge CEO Portal – Invoice PDF Storage (Updated)
-- Run this in Supabase → SQL Editor
-- ============================================================

-- 1. Add pdf_url column to invoices table
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS pdf_url TEXT;

-- 2. Add currency column to invoices table
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'PKR', 'EUR', 'GBP'));

-- 2. Storage Bucket Setup
-- Create the bucket manually in Supabase Dashboard:
-- Storage → New Bucket → Name: "invoice-pdfs" → Public: No (Private) → 50MB limit
-- OR if you have permissions, you can run:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('invoice-pdfs', 'invoice-pdfs', false);

-- 3. RLS Policies for storage.objects
-- This assumes you have a public.is_ceo() function defined.

-- Allow CEO to upload PDFs (INSERT)
DROP POLICY IF EXISTS "CEO can upload invoice PDFs" ON storage.objects;
CREATE POLICY "CEO can upload invoice PDFs"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'invoice-pdfs'
  AND public.is_ceo()
);

-- Allow CEO to view/download PDFs (SELECT)
DROP POLICY IF EXISTS "CEO can view invoice PDFs" ON storage.objects;
CREATE POLICY "CEO can view invoice PDFs"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'invoice-pdfs'
  AND public.is_ceo()
);

-- Allow CEO to replace/update existing PDFs (UPDATE)
DROP POLICY IF EXISTS "CEO can update invoice PDFs" ON storage.objects;
CREATE POLICY "CEO can update invoice PDFs"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'invoice-pdfs'
  AND public.is_ceo()
);

-- Allow CEO to delete PDFs (DELETE)
DROP POLICY IF EXISTS "CEO can delete invoice PDFs" ON storage.objects;
CREATE POLICY "CEO can delete invoice PDFs"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'invoice-pdfs'
  AND public.is_ceo()
);
