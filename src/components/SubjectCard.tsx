import { useState } from 'react';

interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
}

interface SubjectCardProps {
  subject: Subject;
  onDragStart: (subject: Subject) => void;
}

const SubjectCard = ({ subject, onDragStart }: SubjectCardProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart(subject);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify(subject));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const colorClasses = {
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    green: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
    orange: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
    red: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
    indigo: 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white',
    pink: 'bg-gradient-to-r from-pink-500 to-pink-600 text-white',
  };

  return (
    <div
      className={`
        subject-card p-4 rounded-xl cursor-grab select-none
        ${colorClasses[subject.color as keyof typeof colorClasses]}
        ${isDragging ? 'dragging' : ''}
        hover:shadow-lg transform hover:scale-105
      `}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="font-semibold text-sm mb-1">{subject.name}</div>
      <div className="text-xs opacity-90">{subject.code}</div>
    </div>
  );
};

export default SubjectCard;