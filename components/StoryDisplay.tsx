import React from 'react';

interface StoryDisplayProps {
  title: string;
  story: string;
  isLoading: boolean;
  error: string | null;
  isSpeaking: boolean;
  isPaused: boolean;
  play: () => void;
  pause: () => void;
  stop: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  exitFullscreen: () => void;
}

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const StopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6v6H9z" />
    </svg>
);

const StarIcon = ({ isFilled }: { isFilled: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill={isFilled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isFilled ? 0 : 1.5}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
);

const StoryDisplay: React.FC<StoryDisplayProps> = ({ title, story, isLoading, error, isSpeaking, isPaused, play, pause, stop, isFavorite, onToggleFavorite, exitFullscreen }) => {
  const paragraphs = story.split('\n').filter(p => p.trim() !== '');
  const showControls = !isLoading && story && !error;

  return (
    <div className="w-full h-full bg-[#0c0a1a] flex flex-col justify-center items-center p-6 sm:p-8 md:p-10">
      <div className="w-full max-w-4xl h-full flex flex-col justify-center items-center overflow-hidden">
        
        <div className="flex-grow flex items-center justify-center overflow-hidden w-full">
            {isLoading && (
              <div className="text-center text-indigo-200">
                <div className="book">
                  <div className="book__pg-shadow"></div>
                  <div className="book__pg"></div>
                  <div className="book__pg book__pg--2"></div>
                  <div className="book__pg book__pg--3"></div>
                  <div className="book__pg book__pg--4"></div>
                  <div className="book__pg book__pg--5"></div>
                </div>
                <p className="mt-4 text-lg animate-pulse">Gathering stardust and moonbeams...</p>
                <style>{`
                .book {
                  --book-width: 50px;
                  --book-height: 70px;
                  --page-width: 48px;
                  --page-height: 65px;
                  --pg-bg: #eadebe;
                  --pg-shadow-color: #d1c8a6;
                  --pg-border-radius: 5px;
                  
                  position: relative;
                  perspective: 50em;
                  margin: 0 auto;
                  width: var(--book-width);
                  height: var(--book-height);
                }
                .book__pg-shadow,
                .book__pg {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: var(--page-width);
                  height: var(--page-height);
                  border-radius: var(--pg-border-radius);
                  transform-origin: 100% 50%;
                  background: var(--pg-bg);
                }
                .book__pg-shadow {
                  animation: shadow 5s infinite;
                  background: var(--pg-shadow-color);
                }
                .book__pg {
                  animation: flip 5s infinite;
                }
                .book__pg--2 { animation-delay: 0.25s; }
                .book__pg--3 { animation-delay: 0.5s; }
                .book__pg--4 { animation-delay: 0.75s; }
                .book__pg--5 { animation-delay: 1.0s; }
                @keyframes flip {
                  0% { transform: rotateY(0deg); }
                  30% { transform: rotateY(-180deg); }
                  70% { transform: rotateY(-180deg); }
                  100% { transform: rotateY(0deg); }
                }
                @keyframes shadow {
                  0% { transform: rotateY(0deg) translateZ(-2px); }
                  30% { transform: rotateY(0deg) translateZ(-2px); }
                  55% { transform: rotateY(-180deg) translateZ(-2px); }
                  100% { transform: rotateY(-180deg) translateZ(-2px); }
                }
                `}</style>
              </div>
            )}
            {error && (
              <div className="text-center text-red-400">
                <p className="text-2xl font-bold">Oh no!</p>
                <p className="mt-2">{error}</p>
              </div>
            )}
            {!isLoading && story && (
              <div className="w-full h-full max-h-none overflow-y-auto pr-4 animate-fade-in">
                <h2 className="text-3xl sm:text-4xl font-pacifico text-yellow-300 mb-6 text-center">{title}</h2>
                <div className="text-indigo-100 text-lg sm:text-xl md:text-2xl leading-relaxed sm:leading-loose md:leading-loose">
                  {paragraphs.map((para, index) => (
                    <p key={index} className="mb-4">{para}</p>
                  ))}
                </div>
                <style>{`
                @keyframes fade-in {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                  animation: fade-in 0.8s ease-in-out forwards;
                }
                `}</style>
              </div>
            )}
        </div>

        {showControls && (
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-center items-center gap-4 flex-shrink-0">
                <button 
                    onClick={isSpeaking && !isPaused ? pause : play}
                    aria-label={isSpeaking && !isPaused ? "Pause story" : "Play story"}
                    className="p-2 rounded-full text-white bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                    {isSpeaking && !isPaused ? <PauseIcon /> : <PlayIcon />}
                </button>
                <button 
                    onClick={stop}
                    aria-label="Stop story"
                    disabled={!isSpeaking && !isPaused}
                    className="p-2 rounded-full text-white bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                    <StopIcon />
                </button>
                <button
                    onClick={onToggleFavorite}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 ${isFavorite ? 'text-yellow-400 bg-yellow-400/20' : 'text-white bg-white/10 hover:bg-white/20'}`}
                >
                    <StarIcon isFilled={isFavorite} />
                </button>
                <button
                    onClick={exitFullscreen}
                    aria-label={"Back to Home Screen"}
                    className="p-2 rounded-full text-white bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                    <HomeIcon />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default StoryDisplay;