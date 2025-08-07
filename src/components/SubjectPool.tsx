import SubjectCard from './SubjectCard';

interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
}

interface SubjectPoolProps {
  subjects: Subject[];
  onSubjectDragStart: (subject: Subject) => void;
}

const SubjectPool = ({ subjects, onSubjectDragStart }: SubjectPoolProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 card-elevated">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        📋 <span>Available Subjects</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            onDragStart={onSubjectDragStart}
          />
        ))}
      </div>
    </div>
  );
};

export default SubjectPool;