
-- Create a table to store cancellation requests
CREATE TABLE public.cancellation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  stripe_email TEXT NOT NULL,
  reason TEXT NOT NULL,
  additional_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.cancellation_requests ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view their own cancellation requests
CREATE POLICY "Users can view their own cancellation requests" 
  ON public.cancellation_requests 
  FOR SELECT 
  USING (user_id = auth.jwt() ->> 'sub');

-- Create policy that allows users to insert their own cancellation requests
CREATE POLICY "Users can create their own cancellation requests" 
  ON public.cancellation_requests 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy for service role to have full access (for admin purposes)
CREATE POLICY "Service role full access to cancellation requests" 
  ON public.cancellation_requests 
  FOR ALL 
  USING (auth.role() = 'service_role');

-- Add trigger to update the updated_at column
CREATE TRIGGER update_cancellation_requests_updated_at
  BEFORE UPDATE ON public.cancellation_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
