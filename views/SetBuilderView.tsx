
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PROJECTS, MOCK_EDITIONS, MOCK_GAMES } from '../constants';

const SetBuilderView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const project = MOCK_PROJECTS.find(p => p.id === id);
  const edition = MOCK_EDITIONS.find(e => e.id === project?.editionId);
  const game = MOCK_GAMES.find(g => g.id === edition?.gameId);

  const getCatColor = (cat: string) => {
    switch(cat) {
      case 'Geography': return '#00AEEF';
      case 'Entertainment': return '#E91E63';
      case 'History': return '#FFC107';
      case 'Arts & Culture': return '#9C27B0';
      case 'Science & Tech': return '#4CAF50';
      case 'Sports & Hobbies': return '#FF9800';
      default: return '#cbd5e1';
    }
  };

  if (!project || !game) return <div className="p-8 text-center text-slate-400 italic">Project or template not found.</div>;

  return (
    <div className="space-y-8 h-full flex flex-col min-w-[1200px]">
      <div className="flex items-end justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/projects')} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h2 className="text-2xl font-serif italic text-slate-900 leading-none mb-1">{project.name}</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Set Planner • {game.name} Template • Grid {game.gridQuizzes}x{game.gridRounds} • {project.progress}/{project.totalQuestions} Approved
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-[#e8e4db] text-slate-600 px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">Audit Specs</button>
          <button className="bg-slate-900 text-white px-6 py-2 rounded text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-slate-800">Export Production Draft</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto studio-card border-[#e8e4db]">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-30 shadow-sm">
            <tr className="bg-slate-50 border-b border-[#e8e4db]">
              <th className="p-4 w-32 border-r border-[#e8e4db] text-center text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100/50">Unit Index</th>
              {game.categories.map(cat => (
                <th key={cat} className="p-4 border-r border-[#e8e4db] min-w-[200px]">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getCatColor(cat) }} />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{cat}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e4db]">
            {Array(game.gridQuizzes).fill(null).map((_, quizIdx) => (
              <tr key={quizIdx}>
                <td className="p-6 border-r border-[#e8e4db] text-center bg-slate-50/30 sticky left-0 z-10 backdrop-blur-sm">
                  <p className="font-serif italic text-xl font-bold text-slate-800 leading-none">Q{quizIdx + 1}</p>
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">Set ID 0{quizIdx + 1}</p>
                </td>
                {Array(game.gridRounds).fill(null).map((_, roundIdx) => {
                  const roundData = project.grid[quizIdx]?.[roundIdx];
                  const isPending = roundData?.reviewStatus === 'Pending';
                  return (
                    <td 
                      key={roundIdx} 
                      className="p-4 border-r border-[#e8e4db] align-top hover:bg-[#fcfaf7] transition-all cursor-pointer group"
                      onClick={() => navigate(`/projects/${project.id}/round/${quizIdx}/${roundIdx}`)}
                    >
                      <div className="flex flex-col h-28 justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                             <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">Rnd {roundIdx + 1}</span>
                             <div className={`w-1.5 h-1.5 rounded-full ${isPending ? 'bg-amber-400' : 'bg-green-500'} shadow-sm`} />
                          </div>
                          <p className="text-[11px] font-bold text-slate-700 leading-tight group-hover:text-slate-900 transition-colors">
                            {roundData?.type || 'Standard 5Q Deck'}
                          </p>
                          <p className={`text-[9px] mt-2 font-bold uppercase tracking-wider ${isPending ? 'text-amber-500' : 'text-slate-300'}`}>
                            {isPending ? 'Draft in Review' : 'Verified Content'}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-transparent group-hover:border-slate-100 transition-all">
                           <div className="flex -space-x-1.5">
                              <div className="w-5 h-5 rounded-md border border-white bg-slate-100 flex items-center justify-center text-[7px] font-black text-slate-300">AI</div>
                              <div className="w-5 h-5 rounded-md border border-white bg-slate-800 flex items-center justify-center text-[7px] font-black text-white">ED</div>
                           </div>
                           <svg className="w-4 h-4 text-slate-200 group-hover:text-[#ff8a00] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                           </svg>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SetBuilderView;
