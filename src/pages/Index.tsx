import { useStudyPlanner } from '../hooks/useStudyPlanner';
import SubjectPool from '../components/SubjectPool';
import WeeklyCalendar from '../components/WeeklyCalendar';

const Index = () => {
  const {
    subjects,
    schedule,
    handleSubjectDragStart,
    handleDropSubject,
    handleRemoveSubject,
    handleEditSubject
  } = useStudyPlanner();

  // Enhanced drag and drop functionality
  const handleDragStart = (subject: any) => {
    handleSubjectDragStart(subject);
  };

  const handleDrop = (day: string, hour: number, subject: any) => {
    handleDropSubject(day, hour, subject);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-800 mb-8 glow-primary">
          📚 Study Planner
        </h1>
        
        <SubjectPool 
          subjects={subjects}
          onSubjectDragStart={handleDragStart}
        />
        
        <WeeklyCalendar
          schedule={schedule}
          onDropSubject={handleDrop}
          onRemoveSubject={handleRemoveSubject}
          onEditSubject={handleEditSubject}
        />
      </div>
    </div>
  );
};

export default Index;
