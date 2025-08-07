import { useState, useCallback } from 'react';

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
}

export const useStudyPlanner = () => {
  const [schedule, setSchedule] = useState<Record<string, Record<number, ScheduledSubject>>>({});
  const [draggedSubject, setDraggedSubject] = useState<Subject | null>(null);

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

  const handleSubjectDragStart = useCallback((subject: Subject) => {
    setDraggedSubject(subject);
  }, []);

  const handleDropSubject = useCallback((day: string, hour: number, subject: Subject) => {
    // Check if slot is already occupied
    if (schedule[day]?.[hour]) {
      alert('This time slot is already occupied!');
      return;
    }

    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [hour]: { subject, day, hour }
      }
    }));
    setDraggedSubject(null);
  }, [schedule]);

  const handleRemoveSubject = useCallback((day: string, hour: number) => {
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
  }, []);

  const handleEditSubject = useCallback((day: string, hour: number) => {
    const currentSubject = schedule[day]?.[hour]?.subject;
    if (!currentSubject) return;

    const subjectOptions = subjects.map((subject, index) => 
      `${index + 1}. ${subject.name}`
    ).join('\n');

    const choice = prompt(
      `Edit subject for ${day.charAt(0).toUpperCase() + day.slice(1)} ${hour}:00-${hour + 1}:00\n\n` +
      `Current: ${currentSubject.name}\n\n` +
      `Choose new subject:\n${subjectOptions}\n\n` +
      `Enter number (1-${subjects.length}) or cancel:`
    );

    const choiceNum = parseInt(choice || '');
    if (choice && choiceNum >= 1 && choiceNum <= subjects.length) {
      const newSubject = subjects[choiceNum - 1];
      setSchedule(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          [hour]: { subject: newSubject, day, hour }
        }
      }));
    }
  }, [schedule, subjects]);

  return {
    subjects,
    schedule,
    draggedSubject,
    handleSubjectDragStart,
    handleDropSubject,
    handleRemoveSubject,
    handleEditSubject
  };
};