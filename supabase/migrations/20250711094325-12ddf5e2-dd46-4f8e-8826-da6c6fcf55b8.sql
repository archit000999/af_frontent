
-- Drop existing storage policies that use auth.uid()
DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own resumes" ON storage.objects;

-- Create new storage policies that work with Clerk user IDs
-- These policies check if the first folder in the path matches the authenticated user's ID
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
