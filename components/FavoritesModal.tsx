import React, { useState } from 'react';
import { FavoriteStory } from '../types';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: FavoriteStory[];
  onSelect: (story: FavoriteStory) => void;
  onRemove: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
}

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
  </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);


const FavoritesModal: React.FC<FavoritesModalProps> = ({ isOpen, onClose, favorites, onSelect, onRemove, onRename }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');

  if (!isOpen) return null;

  const handleStartEditing = (fav: FavoriteStory) => {
    setEditingId(fav.id);
    setNewTitle(fav.title);
  };

  const handleCancelEditing = () => {
    setEditingId(null);
    setNewTitle('');
  };

  const handleSave = () => {
    if (editingId && newTitle.trim()) {
      onRename(editingId, newTitle.trim());
    }
    handleCancelEditing();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancelEditing();
    }
  };


  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="favorites-title"
    >
      <style>{`
        @keyframes fade-in-fast {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-fast { animation: fade-in-fast 0.3s ease-out; }
      `}</style>
      <div 
        className="bg-gradient-to-br from-[#1a1a3a] to-[#0c0a1a] w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl border border-white/10 flex flex-col"
        onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <header className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 id="favorites-title" className="text-2xl font-bold text-yellow-300 font-pacifico">My Favorite Stories</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Close favorites">
            <CloseIcon />
          </button>
        </header>
        
        <div className="flex-grow p-6 overflow-y-auto">
          {favorites.length === 0 ? (
            <div className="text-center text-indigo-300 py-10">
              <p className="text-xl">Your storybook is empty!</p>
              <p className="mt-2">Click the star on a story to save it here.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {favorites.map(fav => (
                <li key={fav.id} className="bg-white/5 p-4 rounded-lg flex items-center justify-between gap-4 transition-all hover:bg-white/10 group">
                  <div className="flex-grow overflow-hidden">
                    {editingId === fav.id ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={handleSave}
                                className="w-full bg-indigo-900/80 border border-pink-500 rounded-md px-2 py-1 focus:ring-2 focus:ring-pink-500 focus:outline-none text-indigo-100 font-bold"
                                autoFocus
                            />
                            <button onClick={handleSave} className="p-2 text-green-400 rounded-full hover:bg-green-400/20" aria-label="Save new title">
                                <SaveIcon />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <p className="truncate font-bold text-indigo-100">{fav.title}</p>
                            <button onClick={() => handleStartEditing(fav)} className="p-1 text-indigo-300 rounded-full hover:bg-white/10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity" aria-label={`Rename story: ${fav.title}`}>
                                <EditIcon />
                            </button>
                        </div>
                    )}
                    <p className="text-sm text-indigo-300 mt-1">{`For a ${fav.age}-year-old • ${fav.genre} • ${fav.country}`}</p>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <button onClick={() => onSelect(fav)} className="px-4 py-2 text-sm bg-pink-500 rounded-full hover:bg-pink-600 transition-colors font-bold">Read</button>
                    <button onClick={() => onRemove(fav.id)} className="p-2 text-red-400 rounded-full hover:bg-red-400/20 transition-colors" aria-label={`Remove story: ${fav.title}`}>
                      <TrashIcon />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesModal;