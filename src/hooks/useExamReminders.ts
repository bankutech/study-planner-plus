import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
}

export interface ExamReminder {
  id: string;
  user_id: string;
  subject_id: string;
  subject_name: string;
  subject_code?: string | null;
  subject_color?: string | null;
  exam_date: string; // ISO date string
  note?: string | null;
  created_at: string;
}

export const useExamReminders = () => {
  const [reminders, setReminders] = useState<ExamReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadReminders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('exam_reminders')
        .select('*')
        .order('exam_date', { ascending: true });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Error loading exam reminders:', error);
      toast({
        title: 'Error loading exam reminders',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  const addReminder = useCallback(async (date: Date, subject: Subject, note?: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const examDate = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;

      const { data, error } = await supabase
        .from('exam_reminders')
        .insert({
          user_id: user.id,
          subject_id: subject.id,
          subject_name: subject.name,
          subject_code: subject.code,
          subject_color: subject.color,
          exam_date: examDate,
          note: note || null,
        })
        .select('*')
        .single();

      if (error) throw error;

      setReminders((prev) => [...prev, data].sort((a, b) => a.exam_date.localeCompare(b.exam_date)));
      toast({ title: 'Reminder added' });
    } catch (error) {
      console.error('Error adding exam reminder:', error);
      toast({
        title: 'Error adding reminder',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const deleteReminder = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('exam_reminders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setReminders((prev) => prev.filter((r) => r.id !== id));
      toast({ title: 'Reminder deleted' });
    } catch (error) {
      console.error('Error deleting exam reminder:', error);
      toast({
        title: 'Error deleting reminder',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  return { reminders, loading, addReminder, deleteReminder };
};
