
-- Fix database schema by adding missing columns to copilot_configurations table
DO $$ 
BEGIN
    -- Add filters_data column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'copilot_configurations' 
                   AND column_name = 'filters_data') THEN
        ALTER TABLE public.copilot_configurations ADD COLUMN filters_data JSONB DEFAULT '{}'::jsonb;
    END IF;

    -- Add screening_data column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'copilot_configurations' 
                   AND column_name = 'screening_data') THEN
        ALTER TABLE public.copilot_configurations ADD COLUMN screening_data JSONB DEFAULT '{}'::jsonb;
    END IF;

    -- Add final_config_data column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'copilot_configurations' 
                   AND column_name = 'final_config_data') THEN
        ALTER TABLE public.copilot_configurations ADD COLUMN final_config_data JSONB DEFAULT '{}'::jsonb;
    END IF;

    -- Add resume_file_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'copilot_configurations' 
                   AND column_name = 'resume_file_name') THEN
        ALTER TABLE public.copilot_configurations ADD COLUMN resume_file_name TEXT;
    END IF;

    -- Add resume_file_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'copilot_configurations' 
                   AND column_name = 'resume_file_url') THEN
        ALTER TABLE public.copilot_configurations ADD COLUMN resume_file_url TEXT;
    END IF;

    -- Add personal_info column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'copilot_configurations' 
                   AND column_name = 'personal_info') THEN
        ALTER TABLE public.copilot_configurations ADD COLUMN personal_info JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

-- Create resumes storage bucket if it doesn't exist
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
