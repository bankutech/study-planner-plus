
import TimeSlot from './TimeSlot';

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

interface WeeklyCalendarProps {
  schedule: Record<string, Record<number, ScheduledSubject>>;
  onDropSubject: (day: string, hour: number, subject: Subject) => void;
  onRemoveSubject: (day: string, hour: number) => void;
  onEditSubject: (day: string, hour: number) => void;
}

const WeeklyCalendar = ({ 
  schedule, 
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
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar;
