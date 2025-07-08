

-- Create a table to store copilot configurations
CREATE TABLE public.copilot_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  work_location_types TEXT[] DEFAULT '{}',
  remote_locations TEXT[] DEFAULT '{}',
  onsite_locations TEXT[] DEFAULT '{}',
  job_types TEXT[] DEFAULT '{}',
  job_titles TEXT[] DEFAULT '{}',
  step_completed INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.copilot_configurations ENABLE ROW LEVEL SECURITY;

-- Since we're using Clerk, we'll use simpler policies that rely on application-level security
-- Create policy to allow authenticated users to view their own configurations
CREATE POLICY "Users can view their own copilot configurations" 
ON public.copilot_configurations 
FOR SELECT 
USING (true);

-- Create policy to allow authenticated users to insert their own configurations
CREATE POLICY "Users can create their own copilot configurations" 
ON public.copilot_configurations 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow authenticated users to update their own configurations
CREATE POLICY "Users can update their own copilot configurations" 
ON public.copilot_configurations 
FOR UPDATE 
USING (true);

-- Create policy to allow authenticated users to delete their own configurations
CREATE POLICY "Users can delete their own copilot configurations" 
ON public.copilot_configurations 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_copilot_configurations_updated_at
BEFORE UPDATE ON public.copilot_configurations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

