
import React from 'react';
import { COUNTRIES, GENRES } from '../constants';

interface ControlsProps {
  age: number;
  setAge: (age: number) => void;
  country: string;
  setCountry: (country: string) => void;
  genre: string;
  setGenre: (genre: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const Controls: React.FC<ControlsProps> = ({ age, setAge, country, setCountry, genre, setGenre, onGenerate, isLoading }) => {
  return (
    <div className="w-full max-w-2xl bg-white/5 backdrop-blur-md rounded-2xl p-6 my-8 shadow-2xl shadow-black/20 border border-white/10">
      <div className="space-y-6">
        {/* Age Selector */}
        <div>
          <label htmlFor="age-slider" className="block text-lg font-bold text-indigo-200 mb-2">Child's Age: <span className="text-yellow-300 font-black">{age}</span></label>
          <input
            id="age-slider"
            type="range"
            min="1"
            max="10"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full h-3 bg-indigo-200/20 rounded-lg appearance-none cursor-pointer range-lg accent-pink-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Country Selector */}
          <div>
            <label htmlFor="country-select" className="block text-lg font-bold text-indigo-200 mb-2">Cultural Theme</label>
            <select
              id="country-select"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-3 bg-indigo-900/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all"
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c} className="bg-indigo-900">{c}</option>
              ))}
            </select>
          </div>
          {/* Genre Selector */}
          <div>
            <label htmlFor="genre-select" className="block text-lg font-bold text-indigo-200 mb-2">Story Genre</label>
            <select
              id="genre-select"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full p-3 bg-indigo-900/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all"
            >
              {GENRES.map((g) => (
                <option key={g} value={g} className="bg-indigo-900">{g}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white transition-all duration-300 ease-in-out rounded-full shadow-lg overflow-hidden group bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Weaving a Dream...
            </>
          ) : 'Tell me a Story'}
          <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-300 ease-in-out bg-white opacity-0 group-hover:opacity-20"></span>
        </button>
      </div>
    </div>
  );
};

export default Controls;
