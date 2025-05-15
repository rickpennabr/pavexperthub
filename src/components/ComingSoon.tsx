import React from 'react';

interface ComingSoonProps {
  title: string;
  description?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title, description }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-2xl mx-auto text-center p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
        <p className="text-xl text-gray-600 mb-8">
          {description || "We're working hard to bring you something amazing. Stay tuned!"}
        </p>
        <div className="animate-pulse">
          <div className="h-4 w-48 bg-blue-200 rounded mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon; 