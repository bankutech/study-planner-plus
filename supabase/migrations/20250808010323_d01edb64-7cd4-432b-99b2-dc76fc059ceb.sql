-- Add minute column to study_schedules for finer time granularity
ALTER TABLE public.study_schedules
ADD COLUMN IF NOT EXISTS minute integer NOT NULL DEFAULT 0;

-- Create exam_reminders table for upcoming exam reminders
CREATE TABLE IF NOT EXISTS public.exam_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subject_id text NOT NULL,
  subject_name text NOT NULL,
  subject_code text,
  subject_color text,
  exam_date date NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.exam_reminders ENABLE ROW LEVEL SECURITY;

-- Policies for user-specific access
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'exam_reminders' AND policyname = 'Users can view their own exam reminders'
  ) THEN
    CREATE POLICY "Users can view their own exam reminders"
    ON public.exam_reminders
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'exam_reminders' AND policyname = 'Users can insert their own exam reminders'
  ) THEN
    CREATE POLICY "Users can insert their own exam reminders"
    ON public.exam_reminders
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'exam_reminders' AND policyname = 'Users can update their own exam reminders'
  ) THEN
    CREATE POLICY "Users can update their own exam reminders"
    ON public.exam_reminders
    FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'exam_reminders' AND policyname = 'Users can delete their own exam reminders'
  ) THEN
    CREATE POLICY "Users can delete their own exam reminders"
    ON public.exam_reminders
    FOR DELETE
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS exam_reminders_user_date_idx ON public.exam_reminders (user_id, exam_date);
