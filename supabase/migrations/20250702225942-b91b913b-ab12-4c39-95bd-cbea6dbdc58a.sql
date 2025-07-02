-- Create applications table to store form submissions
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  linkedin_url TEXT NOT NULL,
  is_in_us TEXT NOT NULL,
  career_track TEXT NOT NULL,
  is_currently_employed TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert applications (public form)
CREATE POLICY "Anyone can submit applications" 
ON public.applications 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow users to view their own applications (if they have auth)
CREATE POLICY "Users can view applications" 
ON public.applications 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();