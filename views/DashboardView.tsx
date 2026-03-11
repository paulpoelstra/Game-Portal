
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PROJECTS, MOCK_TASKS } from '../constants';
import { Game, Edition } from '../types';

interface DashboardViewProps {
  games: Game[];
  editions: Edition[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ games, editions }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 pb-12">
      {/* Studio Banner */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-serif italic text-slate-900 leading-tight">Studio Portfolio</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Puzzles & Games • Publishing House Overview</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Global Reach</p>
          <p className="text-2xl font-bold text-slate-800">{editions.length} Localized SKUs</p>
        </div>
      </div>

      {/* Product Line Grid - The Focus of the Dashboard */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Master Product Lines</h3>
          <button onClick={() => navigate('/games')} className="text-[9px] font-black text-[#f26522] uppercase tracking-widest hover:underline">Full Library</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map(game => (
            <div 
              key={game.id} 
              onClick={() => navigate(`/games/${game.id}`)}
              className="studio-card p-6 cursor-pointer group hover:bg-slate-900 transition-all border-[#e8e4db] flex flex-col h-64 justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-serif italic text-lg group-hover:bg-[#f26522] group-hover:text-white group-hover:border-[#f26522] transition-all mb-4 shadow-sm">
                  {game.name.charAt(0)}
                </div>
                <h4 className="text-lg font-bold text-slate-800 group-hover:text-white transition-colors mb-2">{game.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 group-hover:text-slate-300 transition-colors italic">
                  {game.description}
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50 group-hover:border-slate-800 transition-all">
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest group-hover:text-slate-500">Master Template</span>
                <span className="text-[10px] font-bold text-[#f26522] opacity-0 group-hover:opacity-100 transition-all">Setup →</span>
              </div>
            </div>
          ))}
          <div 
            onClick={() => navigate('/games')}
            className="studio-card border-dashed border-2 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-white transition-all group h-64"
          >
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-4 group-hover:scale-110 transition-transform">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Add New Product Line</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <section className="studio-card p-8 bg-[#1e293b] text-white">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">AI Generation Strategy</h3>
                <p className="text-xl font-serif italic">Specialized AI Agent Hub</p>
              </div>
              <button className="text-[9px] font-black text-[#f26522] uppercase tracking-widest bg-white/5 px-4 py-2 rounded hover:bg-white/10">Configure Skills</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[
                 { name: 'Music Era Scout', skill: 'Audio Metadata & Era Mapping', target: 'Hitster Line' },
                 { name: 'Cultural Adapter', skill: 'Regional Nuance & Joke Translation', target: 'Global Pubquiz' },
                 { name: 'Fact Sentinel', skill: 'Verification & Source Checking', target: 'Vragen & Antwoorden' },
                 { name: 'Sports Specialist', skill: 'Deep Domain Sport Data', target: 'Niche Editions' }
               ].map((agent, i) => (
                 <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all cursor-pointer group">
                    <p className="text-xs font-bold text-[#f26522] mb-1">{agent.name}</p>
                    <p className="text-[11px] text-slate-300 leading-snug">{agent.skill}</p>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-4">Linked to: {agent.target}</p>
                 </div>
               ))}
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          <section className="studio-card p-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Recent Studio Activity</h3>
            <div className="space-y-6">
              {MOCK_TASKS.map(task => (
                <div key={task.id} className="group cursor-pointer">
                  <div className="flex items-start space-x-3">
                     <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${task.priority === 'High' ? 'bg-[#f26522]' : 'bg-slate-300'}`} />
                     <div>
                        <p className="text-xs font-bold text-slate-700 leading-snug group-hover:text-[#f26522] transition-colors">{task.label}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{task.project}</p>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
