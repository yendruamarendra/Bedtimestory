import React from 'react';

const MoonIcon = () => (
  <svg xmlns="http://www.w.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-300 transform -rotate-12" viewBox="0 0 20 20" fill="currentColor">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

interface HeaderProps {
    onShowFavorites: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowFavorites }) => {
  return (
    <header className="z-10 text-center w-full relative">
      <div className="flex items-center justify-center gap-3">
        <MoonIcon />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-pacifico text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400">
          DreamWeaver
        </h1>
      </div>
      <p className="mt-2 text-md sm:text-lg text-indigo-200">Your Personal AI Bedtime Storyteller</p>
      
      <div className="absolute top-0 right-0">
          <button 
            onClick={onShowFavorites}
            className="flex items-center px-4 py-2 bg-yellow-400/10 text-yellow-300 border border-yellow-400/30 rounded-full hover:bg-yellow-400/20 transition-colors"
            aria-label="Show my favorite stories"
          >
            <StarIcon />
            My Favorites
          </button>
      </div>
    </header>
  );
};

export default Header;
