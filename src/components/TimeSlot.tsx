import { useState } from 'react';

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
  minute?: number;
}

interface TimeSlotProps {
  day: string;
  hour: number;
  scheduledSubject?: ScheduledSubject;
  onDrop: (day: string, hour: number, subject: Subject) => void;
  onRemove: (day: string, hour: number) => void;
  onEdit: (day: string, hour: number) => void;
  onEmptyClick?: (day: string, hour: number) => void;
}

const TimeSlot = ({ day, hour, scheduledSubject, onDrop, onRemove, onEdit, onEmptyClick }: TimeSlotProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const subjectData = e.dataTransfer.getData('application/json');
    if (subjectData) {
      try {
        const subject = JSON.parse(subjectData);
        onDrop(day, hour, subject);
      } catch (error) {
        console.error('Error parsing dropped subject data:', error);
      }
    }
  };

  const dayColors = {
    monday: 'monday',
    tuesday: 'tuesday', 
    wednesday: 'wednesday',
    thursday: 'thursday',
    friday: 'friday',
    saturday: 'saturday',
    sunday: 'sunday'
  };

  const dayGradientClass = `day-gradient-${day}`;
  const dayColorClass = dayColors[day as keyof typeof dayColors];

  const subjectColorClasses = {
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600',
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
    green: 'bg-gradient-to-r from-green-500 to-green-600',
    orange: 'bg-gradient-to-r from-orange-500 to-orange-600',
    red: 'bg-gradient-to-r from-red-500 to-red-600',
    indigo: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    pink: 'bg-gradient-to-r from-pink-500 to-pink-600',
  };

  return (
    <div
      className={`
        time-slot relative p-2 flex items-center justify-center
        ${isDragOver ? 'drag-over' : ''}
        ${scheduledSubject ? '' : `border-2 border-dashed opacity-60`}
        ${!scheduledSubject ? `border-${dayColorClass} bg-gradient-to-br from-${dayColorClass}/10 to-${dayColorClass}/20` : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {scheduledSubject ? (
        <div
          className={`
            scheduled-subject w-full text-white p-3 rounded-lg text-sm font-medium text-center
            relative cursor-pointer group
            ${subjectColorClasses[scheduledSubject.subject.color as keyof typeof subjectColorClasses]}
          `}
          onClick={() => onEdit(day, hour)}
        >
          <div className="text-[11px] opacity-90 mb-1">
            {`${String(hour).padStart(2,'0')}:${String(scheduledSubject.minute ?? 0).padStart(2,'0')}`}
          </div>
          <div className="font-semibold">{scheduledSubject.subject.name}</div>
          <div className="text-xs opacity-90 mt-1">{scheduledSubject.subject.code}</div>
          
          {/* Delete button */}
          <button
            className="
              absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full
              opacity-0 group-hover:opacity-100 transition-opacity duration-200
              flex items-center justify-center text-xs font-bold
              hover:bg-red-600 hover:scale-110 transform
            "
            onClick={(e) => {
              e.stopPropagation();
              onRemove(day, hour);
            }}
          >
            ×
          </button>
        </div>
      ) : (
        <div className="text-xs text-gray-400 opacity-50" role="button" onClick={() => onEmptyClick?.(day, hour)}>Tap to add</div>
      )}
    </div>
  );
};

export default TimeSlot;