import { useState } from 'react';
import TimeSlot from './TimeSlot';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

interface WeeklyCalendarProps {
  schedule: Record<string, Record<number, ScheduledSubject>>;
  subjects: Subject[];
  onDropSubject: (day: string, hour: number, subject: Subject, minute?: number) => void;
  onRemoveSubject: (day: string, hour: number) => void;
  onEditSubject: (day: string, hour: number) => void;
}

const WeeklyCalendar = ({ 
  schedule,
  subjects, 
  onDropSubject, 
  onRemoveSubject, 
  onEditSubject 
}: WeeklyCalendarProps) => {
  const days = [
    { key: 'monday', label: '📅 Monday' },
    { key: 'tuesday', label: '📅 Tuesday' },
    { key: 'wednesday', label: '📅 Wednesday' },
    { key: 'thursday', label: '📅 Thursday' },
    { key: 'friday', label: '📅 Friday' },
    { key: 'saturday', label: '📅 Saturday' },
    { key: 'sunday', label: '📅 Sunday' }
  ];

  // Only show hours from 6am to 11pm (6-23)
  const hours = Array.from({ length: 18 }, (_, i) => i + 6);

  const [pickerSlot, setPickerSlot] = useState<{ day: string; hour: number } | null>(null);
  const [pickerMinute, setPickerMinute] = useState<number>(0);

  const getDayHeaderClass = (dayKey: string) => {
    const dayClasses = {
      monday: 'day-gradient-monday',
      tuesday: 'day-gradient-tuesday',
      wednesday: 'day-gradient-wednesday',
      thursday: 'day-gradient-thursday',
      friday: 'day-gradient-friday',
      saturday: 'day-gradient-saturday',
      sunday: 'day-gradient-sunday'
    };
    return dayClasses[dayKey as keyof typeof dayClasses] || '';
  };

  const formatTimeRange = (hour: number) => {
    const startHour = hour;
    const endHour = hour + 1;
    const formatHour = (h: number) => {
      if (h === 0) return '12:00 AM';
      if (h < 12) return `${h}:00 AM`;
      if (h === 12) return '12:00 PM';
      return `${h - 12}:00 PM`;
    };
    return `${formatHour(startHour)} - ${formatHour(endHour)}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 card-elevated">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        🗓️ <span>Weekly Schedule</span>
      </h2>
      
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header */}
          <div className="grid grid-cols-8 gap-2 mb-4">
            <div className="font-semibold text-center text-white p-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg shadow-md">
              ⏰ Time
            </div>
            {days.map((day) => (
              <div
                key={day.key}
                className={`
                  font-semibold text-center text-white p-3 rounded-lg shadow-md
                  ${getDayHeaderClass(day.key)}
                `}
              >
                {day.label}
              </div>
            ))}
          </div>
          
          {/* Time Slots */}
          <div className="space-y-2">
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-8 gap-2">
                {/* Time label */}
                <div className="text-sm font-medium text-white p-3 text-center bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg shadow-sm">
                  {formatTimeRange(hour)}
                </div>
                
                {/* Day slots */}
                {days.map((day) => (
                  <TimeSlot
                    key={`${day.key}-${hour}`}
                    day={day.key}
                    hour={hour}
                    scheduledSubject={schedule[day.key]?.[hour]}
                    onDrop={onDropSubject}
                    onRemove={onRemoveSubject}
                    onEdit={onEditSubject}
                    onEmptyClick={() => setPickerSlot({ day: day.key, hour })}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!pickerSlot} onOpenChange={(open) => !open && setPickerSlot(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select a subject and start minute</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <label className="text-sm font-medium">Start minutes:</label>
            <select
              className="border rounded-md px-2 py-1 text-sm"
              value={pickerMinute}
              onChange={(e) => setPickerMinute(Math.max(0, Math.min(59, parseInt(e.target.value || '0', 10))))}
            >
              {[0, 15, 30, 45].map((m) => (
                <option key={m} value={m}>{m.toString().padStart(2,'0')}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {subjects.map((s) => (
              <Button
                key={s.id}
                variant="outline"
                onClick={() => {
                  if (pickerSlot) {
                    onDropSubject(pickerSlot.day, pickerSlot.hour, s, pickerMinute);
                    setPickerSlot(null);
                    setPickerMinute(0);
                  }
                }}
              >
                {s.name}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WeeklyCalendar;
