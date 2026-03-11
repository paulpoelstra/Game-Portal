
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Game } from '../types';

interface GamesViewProps {
  games: Game[];
  onAddGame: (game: Game) => void;
}

const GamesView: React.FC<GamesViewProps> = ({ games, onAddGame }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGame, setNewGame] = useState({ name: '', description: '' });

  const handleEditTemplate = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/games/${id}`);
  };

  const handleAddGame = () => {
    if (!newGame.name) return;
    
    const gameToAdd: Game = {
      id: `game-${Date.now()}`,
      name: newGame.name,
      description: newGame.description || 'No description provided.',
      gridQuizzes: 9,
      gridRounds: 6,
      categories: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5', 'Category 6'],
      allowedRoundTypes: ['Normal 5Q'],
      textFitPresetId: 'rules-nl'
    };

    onAddGame(gameToAdd);
    setNewGame({ name: '', description: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif italic text-slate-900 leading-none mb-1">Games Library</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Master Product Lines & Structural Templates</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-6 py-2 rounded text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-slate-800 transition-all"
        >
          + Add New Game
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {games.map(game => (
          <div 
            key={game.id} 
            className="studio-card p-6 flex flex-col h-full cursor-pointer hover:border-[#ff8a00]/30 transition-all group" 
            onClick={() => navigate(`/games/${game.id}`)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-slate-900 rounded flex items-center justify-center text-white font-bold text-xs group-hover:bg-[#ff8a00] transition-colors">
                {game.name.substring(0, 2).toUpperCase()}
              </div>
              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Master Template</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-[#ff8a00] transition-colors">{game.name}</h3>
            <p className="text-xs text-slate-500 mb-6 flex-1 leading-relaxed line-clamp-3 italic">
              {game.description}
            </p>
            <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest font-mono">Grid Structure</p>
                <p className="text-xs font-bold text-slate-700">{game.gridQuizzes} × {game.gridRounds}</p>
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest font-mono">Total Units</p>
                <p className="text-xs font-bold text-slate-700">{game.gridQuizzes * game.gridRounds}</p>
              </div>
            </div>
            <button 
              onClick={(e) => handleEditTemplate(e, game.id)}
              className="mt-6 w-full py-2 bg-slate-50 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all text-[10px] font-black uppercase tracking-widest rounded border border-slate-100"
            >
              Configure Master
            </button>
          </div>
        ))}
        
        <div 
          onClick={() => setIsModalOpen(true)}
          className="studio-card border-dashed border-2 flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-white transition-colors group min-h-[300px]"
        >
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-4 group-hover:scale-110 transition-transform">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Add New Game Title</p>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="mb-8">
              <h3 className="text-2xl font-serif italic text-slate-900">Add New Game Template</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registering a new global product line</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Game Name</label>
                <input 
                  type="text" 
                  value={newGame.name}
                  onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
                  placeholder="e.g. Pubquiz Ultimate" 
                  className="w-full bg-slate-50 border border-slate-100 rounded px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#ff8a00] outline-none transition-all" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                <textarea 
                  value={newGame.description}
                  onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
                  placeholder="Summary of the product line, physical format..." 
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-100 rounded px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#ff8a00] outline-none transition-all resize-none" 
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-8">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddGame}
                disabled={!newGame.name}
                className="flex-1 py-3 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamesView;
