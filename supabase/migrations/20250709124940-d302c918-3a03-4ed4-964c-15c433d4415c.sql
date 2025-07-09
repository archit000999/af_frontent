
-- Add new columns to copilot_configurations table for comprehensive data storage
ALTER TABLE public.copilot_configurations ADD COLUMN IF NOT EXISTS filters_data JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.copilot_configurations ADD COLUMN IF NOT EXISTS screening_data JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.copilot_configurations ADD COLUMN IF NOT EXISTS final_config_data JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.copilot_configurations ADD COLUMN IF NOT EXISTS resume_file_name TEXT;
ALTER TABLE public.copilot_configurations ADD COLUMN IF NOT EXISTS resume_file_url TEXT;
ALTER TABLE public.copilot_configurations ADD COLUMN IF NOT EXISTS personal_info JSONB DEFAULT '{}'::jsonb;

-- Create a storage bucket for resumes if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for resumes bucket
CREATE POLICY IF NOT EXISTS "Users can upload their own resumes" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY IF NOT EXISTS "Users can view their own resumes" ON storage.objects
FOR SELECT USING (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY IF NOT EXISTS "Users can update their own resumes" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY IF NOT EXISTS "Users can delete their own resumes" ON storage.objects
FOR DELETE USING (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
