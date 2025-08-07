import { useStudyPlanner } from '../hooks/useStudyPlanner';
import SubjectPool from '../components/SubjectPool';
import WeeklyCalendar from '../components/WeeklyCalendar';

const Index = () => {
  const {
    subjects,
    schedule,
    loading,
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

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-indigo-800">Loading your study schedule...</p>
        </div>
      </div>
    );
  }

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
