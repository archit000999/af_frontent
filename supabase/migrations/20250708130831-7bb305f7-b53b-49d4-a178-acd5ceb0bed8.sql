
-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view their own copilot configurations" ON public.copilot_configurations;
DROP POLICY IF EXISTS "Users can create their own copilot configurations" ON public.copilot_configurations;
DROP POLICY IF EXISTS "Users can update their own copilot configurations" ON public.copilot_configurations;
DROP POLICY IF EXISTS "Users can delete their own copilot configurations" ON public.copilot_configurations;

-- Change the user_id column from UUID to TEXT
ALTER TABLE public.copilot_configurations ALTER COLUMN user_id TYPE TEXT;

-- Recreate policies for Clerk authentication (using application-level security)
CREATE POLICY "Users can view their own copilot configurations" 
ON public.copilot_configurations 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own copilot configurations" 
ON public.copilot_configurations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own copilot configurations" 
ON public.copilot_configurations 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete their own copilot configurations" 
ON public.copilot_configurations 
FOR DELETE 
USING (true);
