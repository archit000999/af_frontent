
-- Create a table to store copilot configurations
CREATE TABLE public.copilot_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
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

-- Create policy to allow users to view their own configurations
CREATE POLICY "Users can view their own copilot configurations" 
ON public.copilot_configurations 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own configurations
CREATE POLICY "Users can create their own copilot configurations" 
ON public.copilot_configurations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own configurations
CREATE POLICY "Users can update their own copilot configurations" 
ON public.copilot_configurations 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own configurations
CREATE POLICY "Users can delete their own copilot configurations" 
ON public.copilot_configurations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_copilot_configurations_updated_at
BEFORE UPDATE ON public.copilot_configurations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
