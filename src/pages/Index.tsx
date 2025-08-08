import { useStudyPlanner } from '../hooks/useStudyPlanner';
import { useAuth } from '../hooks/useAuth';
import SubjectPool from '../components/SubjectPool';
import WeeklyCalendar from '../components/WeeklyCalendar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ExamReminders from '../components/ExamReminders';

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  
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

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-indigo-800">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-indigo-800 mb-4">📚 Study Planner</h1>
          <p className="text-xl text-gray-600 mb-8">Please sign in to access your study schedule</p>
          <Button onClick={() => navigate('/auth')} size="lg">
            Sign In / Sign Up
          </Button>
        </div>
      </div>
    );
  }

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-center text-indigo-800 glow-primary">
            📚 Study Planner
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-indigo-600">Welcome, {user.email}</span>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
        
        <SubjectPool 
          subjects={subjects}
          onSubjectDragStart={handleDragStart}
        />
        
        <WeeklyCalendar
          schedule={schedule}
          subjects={subjects}
          onDropSubject={handleDrop}
          onRemoveSubject={handleRemoveSubject}
          onEditSubject={handleEditSubject}
        />

        <ExamReminders subjects={subjects} />
      </div>
    </div>
  );
};

export default Index;
