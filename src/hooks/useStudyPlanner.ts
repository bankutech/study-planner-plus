import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
}

interface ScheduledSubject {
  subject: Subject;
  day: string;
  hour: number;
  minute: number;
}

export const useStudyPlanner = () => {
  const [schedule, setSchedule] = useState<Record<string, Record<number, ScheduledSubject>>>({});
  const [draggedSubject, setDraggedSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const subjects: Subject[] = [
    {
      id: '1',
      name: 'Transforms and Boundary Value Problems',
      code: '21MAB201T - Theory',
      color: 'purple'
    },
    {
      id: '2', 
      name: 'Data Structures and Algorithms',
      code: '21CSC201J - Theory and Practical',
      color: 'blue'
    },
    {
      id: '3',
      name: 'Computer Organization and Architecture', 
      code: '21CSS201T - Theory',
      color: 'green'
    },
    {
      id: '4',
      name: 'Advanced Programming Practice',
      code: '21CSC203P - Theory',
      color: 'orange'
    },
    {
      id: '5',
      name: 'Operating Systems',
      code: '21CSC202J - Theory and Practical', 
      color: 'red'
    },
    {
      id: '6',
      name: 'UHV-II: Universal Human Values',
      code: '21LEM202T - Theory',
      color: 'indigo'
    },
    {
      id: '7',
      name: 'Professional Ethics',
      code: 'Theory',
      color: 'pink'
    }
  ];

  // Load schedule from database
  const loadSchedule = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('study_schedules')
        .select('*');

      if (error) throw error;

      const scheduleData: Record<string, Record<number, ScheduledSubject>> = {};
      data.forEach((item) => {
        if (!scheduleData[item.day]) {
          scheduleData[item.day] = {};
        }
        scheduleData[item.day][item.hour] = {
          subject: {
            id: item.subject_id,
            name: item.subject_name,
            code: item.subject_code,
            color: item.subject_color
          },
          day: item.day,
          hour: item.hour,
          minute: item.minute ?? 0
        };
      });

      setSchedule(scheduleData);
    } catch (error) {
      console.error('Error loading schedule:', error);
      toast({
        title: "Error loading schedule",
        description: "Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Save schedule item to database
  const saveScheduleItem = useCallback(async (day: string, hour: number, subject: Subject, minute: number = 0) => {
    try {
      const { error } = await supabase
        .from('study_schedules')
        .upsert(
          {
            day,
            hour,
            minute,
            subject_id: subject.id,
            subject_name: subject.name,
            subject_code: subject.code,
            subject_color: subject.color,
            user_id: (await supabase.auth.getUser()).data.user?.id
          },
          {
            onConflict: 'user_id,day,hour'
          }
        );

      if (error) throw error;
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast({
        title: "Error saving schedule",
        description: "Your changes may not be saved.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Delete schedule item from database
  const deleteScheduleItem = useCallback(async (day: string, hour: number) => {
    try {
      const { error } = await supabase
        .from('study_schedules')
        .delete()
        .eq('day', day)
        .eq('hour', hour);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast({
        title: "Error deleting schedule",
        description: "The item may not be deleted.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  const handleSubjectDragStart = useCallback((subject: Subject) => {
    setDraggedSubject(subject);
  }, []);

  const handleDropSubject = useCallback(async (day: string, hour: number, subject: Subject, minute: number = 0) => {
    // Check if slot is already occupied
    if (schedule[day]?.[hour]) {
      toast({
        title: "Time slot occupied",
        description: "This time slot is already occupied!",
        variant: "destructive",
      });
      return;
    }

    // Update local state
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [hour]: { subject, day, hour, minute }
      }
    }));
    setDraggedSubject(null);

    // Save to database
    await saveScheduleItem(day, hour, subject, minute);
  }, [schedule, saveScheduleItem, toast]);

  const handleRemoveSubject = useCallback(async (day: string, hour: number) => {
    // Update local state
    setSchedule(prev => {
      const newSchedule = { ...prev };
      if (newSchedule[day]) {
        delete newSchedule[day][hour];
        // Clean up empty day objects
        if (Object.keys(newSchedule[day]).length === 0) {
          delete newSchedule[day];
        }
      }
      return newSchedule;
    });

    // Delete from database
    await deleteScheduleItem(day, hour);
  }, [deleteScheduleItem]);

  const handleEditSubject = useCallback(async (day: string, hour: number) => {
    const current = schedule[day]?.[hour];
    if (!current) return;

    // Ask for minute update first
    const currentMinute = typeof current.minute === 'number' ? current.minute : 0;
    const minuteInput = prompt(
      `Set start minutes for ${day.charAt(0).toUpperCase() + day.slice(1)} ${hour}:00-${hour + 1}:00` +
      `\n\nEnter a value between 0 and 59 (current: ${currentMinute})`
    );

    let newMinute = currentMinute;
    if (minuteInput !== null) {
      const parsed = parseInt(minuteInput, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 59) {
        newMinute = parsed;
      }
    }

    // Optional: change subject
    const subjectOptions = subjects.map((s, index) => `${index + 1}. ${s.name}`).join('\n');
    const choice = prompt(
      `Change subject? (optional)` +
      `\nCurrent: ${current.subject.name}` +
      `\n\nChoose new subject number or Cancel to keep the same:` +
      `\n${subjectOptions}`
    );

    let newSubject = current.subject;
    const choiceNum = parseInt(choice || '');
    if (choice && choiceNum >= 1 && choiceNum <= subjects.length) {
      newSubject = subjects[choiceNum - 1];
    }

    // Update local state
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [hour]: { subject: newSubject, day, hour, minute: newMinute }
      }
    }));

    // Persist
    await saveScheduleItem(day, hour, newSubject, newMinute);
  }, [schedule, subjects, saveScheduleItem]);

  return {
    subjects,
    schedule,
    draggedSubject,
    loading,
    handleSubjectDragStart,
    handleDropSubject,
    handleRemoveSubject,
    handleEditSubject
  };
};