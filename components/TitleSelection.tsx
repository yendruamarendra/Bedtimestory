import React from 'react';

interface TitleSelectionProps {
  titles: string[];
  onSelectTitle: (title: string) => void;
}

const TitleSelection: React.FC<TitleSelectionProps> = ({ titles, onSelectTitle }) => {
  return (
    <div className="w-full max-w-2xl text-center animate-fade-in">
      <h2 className="text-3xl font-pacifico text-yellow-300 mb-6">Choose Your Adventure!</h2>
      <div className="grid grid-cols-1 gap-4">
        {titles.map((title, index) => (
          <button
            key={index}
            onClick={() => onSelectTitle(title)}
            className="w-full p-5 bg-white/5 backdrop-blur-md rounded-xl text-lg font-bold text-indigo-100 border border-white/10 transition-all duration-300 transform hover:scale-105 hover:bg-pink-500/20 hover:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {title}
          </button>
        ))}
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .animate-fade-in button {
            opacity: 0;
            animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TitleSelection;
