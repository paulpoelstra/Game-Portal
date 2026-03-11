
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Game, Edition } from '../types';

interface EditionsViewProps {
  games: Game[];
  editions: Edition[];
}

const EditionsView: React.FC<EditionsViewProps> = ({ games, editions }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif italic text-slate-900 leading-none mb-1">Edition Library</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Regional SKUs & Market Localizations</p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-2 rounded text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-slate-800 transition-all">
          + New Edition
        </button>
      </div>

      <div className="studio-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-[#e8e4db] text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">
            <tr>
              <th className="px-8 py-4">Title / SKU</th>
              <th className="px-8 py-4">Parent Product Line</th>
              <th className="px-8 py-4">Language / Region</th>
              <th className="px-8 py-4 text-right">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f7f3ed]">
            {editions.map((ed) => {
              const game = games.find(g => g.id === ed.gameId);
              return (
                <tr key={ed.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6 cursor-pointer" onClick={() => navigate(`/editions/${ed.id}`)}>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-[#ff8a00] transition-colors">{ed.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-widest font-mono">{ed.sku}</p>
                  </td>
                  <td className="px-8 py-6">
                    <Link 
                      to={`/games/${game?.id}`}
                      className="inline-flex items-center space-x-2 text-[10px] font-black text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-200 hover:text-slate-900 transition-all uppercase tracking-widest"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span>{game?.name || 'Unknown'}</span>
                    </Link>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-slate-700">{ed.language}</p>
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{ed.region}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-[9px] font-black text-green-600 uppercase bg-green-50 border border-green-100 px-2 py-1 rounded">Print Ready</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EditionsView;
