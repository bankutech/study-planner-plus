-- Create table for storing study schedules
CREATE TABLE public.study_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  day TEXT NOT NULL,
  hour INTEGER NOT NULL,
  subject_id TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  subject_code TEXT NOT NULL,
  subject_color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, day, hour)
);

-- Enable Row Level Security
ALTER TABLE public.study_schedules ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own schedules" 
ON public.study_schedules 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own schedules" 
ON public.study_schedules 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own schedules" 
ON public.study_schedules 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own schedules" 
ON public.study_schedules 
FOR DELETE 
USING (user_id = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_study_schedules_updated_at
  BEFORE UPDATE ON public.study_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();