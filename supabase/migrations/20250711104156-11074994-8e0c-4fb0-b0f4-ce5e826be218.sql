
-- Drop existing storage policies that require authentication
DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own resumes" ON storage.objects;

-- Create new permissive policies that allow unauthenticated access
CREATE POLICY "Anyone can upload resumes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Anyone can view resumes"
ON storage.objects FOR SELECT
USING (bucket_id = 'resumes');

CREATE POLICY "Anyone can update resumes"
ON storage.objects FOR UPDATE
USING (bucket_id = 'resumes');

CREATE POLICY "Anyone can delete resumes"
ON storage.objects FOR DELETE
USING (bucket_id = 'resumes');
