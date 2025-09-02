import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateStoryTitles, generateStoryFromTitle } from './services/geminiService';
import { COUNTRIES, GENRES } from './constants';
import Header from './components/Header';
import Controls from './components/Controls';
import TitleSelection from './components/TitleSelection';
import StoryDisplay from './components/StoryDisplay';
import Background from './components/Background';
import Footer from './components/Footer';
import FavoritesModal from './components/FavoritesModal';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { useFullscreen } from './hooks/useFullscreen';
import { FavoriteStory } from './types';

type AppState = 'idle' | 'generating-titles' | 'titles-displayed' | 'generating-story' | 'story-displayed';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('idle');
  const [age, setAge] = useState<number>(5);
  const [country, setCountry] = useState<string>(COUNTRIES[0]);
  const [genre, setGenre] = useState<string>(GENRES[0]);
  
  const [titles, setTitles] = useState<string[]>([]);
  const [storiesCache, setStoriesCache] = useState<Record<string, string>>({});
  const [story, setStory] = useState<string>('');
  const [currentStoryTitle, setCurrentStoryTitle] = useState<string>('');
  
  const [isLoadingTitles, setIsLoadingTitles] = useState<boolean>(false);
  const [isLoadingStory, setIsLoadingStory] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [favorites, setFavorites] = useState<FavoriteStory[]>([]);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState<boolean>(false);

  const appContainerRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreen(appContainerRef);
  const { play, pause, stop, isSpeaking, isPaused } = useSpeechSynthesis(story);
  
  const prevIsFullscreen = useRef(isFullscreen);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('dreamweaver-favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (e) {
      console.error("Failed to load favorites from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('dreamweaver-favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites to localStorage", e);
    }
  }, [favorites]);

  // Effect to reset state when user exits fullscreen
  useEffect(() => {
    if (prevIsFullscreen.current && !isFullscreen) {
      stop();
      setAppState('idle');
      setStory('');
      setCurrentStoryTitle('');
      setTitles([]);
      setStoriesCache({});
      setError(null);
    }
    prevIsFullscreen.current = isFullscreen;
  }, [isFullscreen, stop]);

  const handleGenerateTitles = useCallback(async () => {
    setAppState('generating-titles');
    setIsLoadingTitles(true);
    setError(null);
    setStoriesCache({}); // Clear old cache
    try {
      const newTitles = await generateStoryTitles(age, country, genre);
      setTitles(newTitles);
      setAppState('titles-displayed');

      // Pre-fetch all stories in the background for a faster experience
      newTitles.forEach(title => {
        generateStoryFromTitle(title, age, country, genre)
          .then((storyText) => {
              setStoriesCache(prevCache => ({ ...prevCache, [title]: storyText }));
          })
          .catch(err => {
            console.error(`Failed to pre-fetch story for title: "${title}"`, err);
          });
      });

    } catch (err) {
      setError('Failed to conjure story titles. Please try again.');
      setAppState('idle');
      console.error(err);
    } finally {
      setIsLoadingTitles(false);
    }
  }, [age, country, genre]);

  const handleSelectTitle = useCallback((title: string) => {
    stop();
    setCurrentStoryTitle(title);

    // Request fullscreen and continue execution immediately.
    // React state updates will prepare the story, and the `isFullscreen` state change 
    // will trigger the render of the StoryDisplay component.
    enterFullscreen();

    const cachedStory = storiesCache[title];

    if (cachedStory) {
      setStory(cachedStory);
      setAppState('story-displayed');
      setIsLoadingStory(false);
    } else {
      // Fallback if pre-fetching is slow or failed
      setAppState('generating-story');
      setIsLoadingStory(true);
      generateStoryFromTitle(title, age, country, genre)
        .then(newStory => {
          setStory(newStory);
          setStoriesCache(prevCache => ({ ...prevCache, [title]: newStory }));
          setAppState('story-displayed');
        })
        .catch(err => {
          setError('Failed to weave this dream. Please try again.');
          // If we are in fullscreen, exit it on error.
          if (document.fullscreenElement) {
            exitFullscreen();
          }
          // The useEffect listening to isFullscreen change will reset the state.
          console.error(err);
        })
        .finally(() => {
          setIsLoadingStory(false);
        });
    }
  }, [age, country, genre, stop, enterFullscreen, exitFullscreen, storiesCache]);


  const handleToggleFavorite = () => {
    if (!story) return;

    const existingFavorite = favorites.find(fav => fav.text === story);

    if (existingFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== existingFavorite.id));
    } else {
      const newFavorite: FavoriteStory = {
        id: Date.now().toString(),
        title: currentStoryTitle || "Untitled Story",
        text: story,
        age,
        country,
        genre
      };
      setFavorites([newFavorite, ...favorites]);
    }
  };
  
  const handleSelectFavorite = async (favStory: FavoriteStory) => {
    setIsFavoritesModalOpen(false);
    stop();
    setAge(favStory.age);
    setCountry(favStory.country);
    setGenre(favStory.genre);
    setStory(favStory.text);
    setCurrentStoryTitle(favStory.title);
    setAppState('story-displayed');
    await enterFullscreen();
  };
  
  const handleRemoveFavorite = (id: string) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
  };
  
  const handleRenameFavorite = (id: string, newTitle: string) => {
    setFavorites(favorites.map(fav =>
      fav.id === id ? { ...fav, title: newTitle.trim() } : fav
    ));
  };

  const isCurrentStoryFavorite = favorites.some(fav => fav.text === story && story !== '');

  const renderMainContent = () => {
    switch(appState) {
      case 'idle':
      case 'generating-titles':
        return (
          <>
            <Controls
              age={age} setAge={setAge} country={country} setCountry={setCountry}
              genre={genre} setGenre={setGenre} onGenerate={handleGenerateTitles}
              isLoading={isLoadingTitles}
            />
            {appState === 'idle' && !error && (
              <div className="text-center mt-8 text-indigo-200 text-xl animate-pulse">
                <p>Choose your settings and let's weave a dream!</p>
              </div>
            )}
            {error && (
              <div className="text-center text-red-400 mt-4">
                <p>{error}</p>
              </div>
            )}
          </>
        );
      case 'titles-displayed':
        return <TitleSelection titles={titles} onSelectTitle={handleSelectTitle} />;
      default:
        return null;
    }
  }

  return (
    <div ref={appContainerRef} className="relative min-h-screen w-full overflow-hidden bg-[#0c0a1a] text-white flex flex-col items-center justify-between p-4 sm:p-6 md:p-8">
      <Background />

      {isFullscreen ? (
          <StoryDisplay
            title={currentStoryTitle}
            story={story}
            isLoading={isLoadingStory || appState === 'generating-story'}
            error={error}
            isSpeaking={isSpeaking}
            isPaused={isPaused}
            play={play}
            pause={pause}
            stop={stop}
            isFavorite={isCurrentStoryFavorite}
            onToggleFavorite={handleToggleFavorite}
            exitFullscreen={exitFullscreen}
          />
        ) : (
        <>
          <Header onShowFavorites={() => setIsFavoritesModalOpen(true)} />
          <main className="z-10 w-full max-w-4xl flex flex-col items-center flex-grow mt-8 mb-auto">
            {renderMainContent()}
          </main>
          <Footer />
          <FavoritesModal
            isOpen={isFavoritesModalOpen}
            onClose={() => setIsFavoritesModalOpen(false)}
            favorites={favorites}
            onSelect={handleSelectFavorite}
            onRemove={handleRemoveFavorite}
            onRename={handleRenameFavorite}
          />
        </>
      )}
    </div>
  );
};

export default App;