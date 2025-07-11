
-- Drop existing storage policies
DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own resumes" ON storage.objects;

-- Update bucket to be public for easier access
UPDATE storage.buckets SET public = true WHERE id = 'resumes';

-- Create new storage policies for direct client access
CREATE POLICY "Users can upload their own resumes"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'resumes' AND 
  (storage.foldername(name))[1] = auth.jwt() ->> 'sub'
);

CREATE POLICY "Users can view their own resumes"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'resumes' AND 
  (storage.foldername(name))[1] = auth.jwt() ->> 'sub'
);

CREATE POLICY "Users can update their own resumes"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'resumes' AND 
  (storage.foldername(name))[1] = auth.jwt() ->> 'sub'
);

CREATE POLICY "Users can delete their own resumes"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'resumes' AND 
  (storage.foldername(name))[1] = auth.jwt() ->> 'sub'
);
