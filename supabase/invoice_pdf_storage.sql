-- ============================================================
--  ScaleForge CEO Portal – Invoice PDF Storage
--  Run this in Supabase → SQL Editor
-- ============================================================

-- Step 1: Add pdf_path column to invoices table
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS pdf_path TEXT;

-- ============================================================
-- Step 2: Storage bucket RLS Policies
-- (Create the bucket manually in Supabase Dashboard first:
--   Storage → New Bucket → Name: "invoice-pdfs" → Private → 50MB limit)
-- Then run these policies:
-- ============================================================

-- Allow CEO to upload PDFs (INSERT)
CREATE POLICY "CEO can upload invoice PDFs"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'invoice-pdfs'
  AND public.is_ceo()
);

-- Allow CEO to view/download PDFs (SELECT)
CREATE POLICY "CEO can view invoice PDFs"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'invoice-pdfs'
  AND public.is_ceo()
);

-- Allow CEO to replace existing PDFs (UPDATE)
CREATE POLICY "CEO can update invoice PDFs"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'invoice-pdfs'
  AND public.is_ceo()
);

-- Allow CEO to delete PDFs (DELETE)
CREATE POLICY "CEO can delete invoice PDFs"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'invoice-pdfs'
  AND public.is_ceo()
);
