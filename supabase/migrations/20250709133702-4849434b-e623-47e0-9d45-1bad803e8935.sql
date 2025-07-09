
-- Add new columns to store additional configuration data
ALTER TABLE public.copilot_configurations 
ADD COLUMN filters_data JSONB DEFAULT '{}',
ADD COLUMN screening_data JSONB DEFAULT '{}',
ADD COLUMN final_config_data JSONB DEFAULT '{}',
ADD COLUMN resume_file_name TEXT,
ADD COLUMN resume_file_url TEXT,
ADD COLUMN personal_info JSONB DEFAULT '{}';

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false);

-- Create storage policies for resumes
CREATE POLICY "Users can upload their own resumes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own resumes"
ON storage.objects FOR SELECT
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own resumes"
ON storage.objects FOR UPDATE
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own resumes"
ON storage.objects FOR DELETE
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
