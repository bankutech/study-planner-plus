import { useState } from 'react';
import { useExamReminders } from '@/hooks/useExamReminders';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
}

interface ExamRemindersProps {
  subjects: Subject[];
}

const ExamReminders = ({ subjects }: ExamRemindersProps) => {
  const { reminders, loading, addReminder, deleteReminder } = useExamReminders();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [subjectId, setSubjectId] = useState<string>('');
  const [note, setNote] = useState<string>('');

  const selectedSubject = subjects.find((s) => s.id === subjectId);

  const formatLocalDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1).toDateString();
  };
  const handleAdd = async () => {
    if (!date || !selectedSubject) return;
    await addReminder(date, selectedSubject, note);
    setDate(undefined);
    setSubjectId('');
    setNote('');
  };

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">📝 Exam Reminders</h2>
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-end">
          <div className="w-full md:w-1/3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? date.toDateString() : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className={cn('p-3 pointer-events-auto')}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="w-full md:w-1/3">
            <select
              className="w-full border rounded-md p-2"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
            >
              <option value="">Select subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/3">
            <Input
              placeholder="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <Button onClick={handleAdd} disabled={!date || !selectedSubject}>
            Add Reminder
          </Button>
        </div>

        <div className="mt-6">
          {loading ? (
            <p className="text-sm text-gray-500">Loading reminders...</p>
          ) : reminders.length === 0 ? (
            <p className="text-sm text-gray-500">No reminders yet. Add one above.</p>
          ) : (
            <ul className="space-y-2">
              {reminders.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between p-3 rounded-md border"
                >
                  <div>
                    <div className="font-medium">{r.subject_name}</div>
                    <div className="text-sm text-gray-500">{formatLocalDate(r.exam_date)}</div>
                    {r.note && (
                      <div className="text-xs text-gray-500 mt-1">{r.note}</div>
                    )}
                  </div>
                  <Button variant="outline" size="icon" onClick={() => deleteReminder(r.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default ExamReminders;
