
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TEXT_FIT_PRESETS, EUROPEAN_LANGUAGES, EUROPEAN_REGIONS } from '../constants';
import { Game, Edition } from '../types';

interface EditionDetailViewProps {
  games: Game[];
  editions: Edition[];
}

const EditionDetailView: React.FC<EditionDetailViewProps> = ({ games, editions }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const edition = editions.find(e => e.id === id);
  const game = games.find(g => g.id === edition?.gameId);

  // States for localization selection
  const [selectedRegions, setSelectedRegions] = useState<string[]>(
    edition?.region ? edition.region.split(', ').filter(Boolean) : []
  );
  const [searchTerm, setSearchTerm] = useState('');

  if (!edition) return <div className="p-8 text-center text-slate-500 italic">Edition not found.</div>;

  const handleRegionToggle = (region: string) => {
    setSelectedRegions(prev => 
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  const filteredRegions = EUROPEAN_REGIONS.filter(r => 
    r.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(`/games/${game?.id}`)} className="p-2 hover:bg-slate-100 rounded-lg group transition-all">
            <svg className="w-5 h-5 text-slate-400 group-hover:text-[#f26522]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h2 className="text-3xl font-serif italic text-slate-900 leading-none mb-2">{edition.name}</h2>
            <div className="flex items-center space-x-3 mt-1">
              <p className="text-slate-500 font-mono text-xs">{edition.sku} • {edition.region}</p>
              <span className="text-slate-300">•</span>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Master Blueprint:</span>
                <Link 
                  to={`/games/${game?.id}`} 
                  className="text-[10px] font-black text-[#f26522] uppercase tracking-widest hover:underline"
                >
                  {game?.name || 'Unknown'}
                </Link>
              </div>
            </div>
          </div>
        </div>
        <button className="px-8 py-2.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all">Save Changes</button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Enhanced Localization Metadata */}
          <section className="bg-white p-8 rounded-xl border border-[#e8e4db] shadow-sm space-y-8">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Metadata</h3>
              <span className="text-[9px] font-bold text-[#f26522] uppercase font-mono tracking-tighter">Edition ID: {edition.id}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              {/* Added editable Edition Title field */}
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Edition Title (Market Display Name)</label>
                <input 
                  type="text" 
                  defaultValue={edition.name} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-4 text-base font-serif italic text-slate-800 outline-none focus:ring-1 focus:ring-[#f26522] shadow-inner" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Language</label>
                <div className="relative">
                  <select 
                    defaultValue={edition.language} 
                    className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#f26522] appearance-none"
                  >
                    {EUROPEAN_LANGUAGES.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Global SKU Code</label>
                <input type="text" defaultValue={edition.sku} className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-3 text-sm font-mono outline-none focus:ring-1 focus:ring-[#f26522]" />
              </div>

              <div className="col-span-2 space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Regions & Target Countries</label>
                <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-inner">
                  <div className="p-3 bg-slate-50 border-b border-slate-100">
                    <input 
                      type="text" 
                      placeholder="Search European countries..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-xs outline-none focus:border-[#f26522] transition-colors"
                    />
                  </div>
                  <div className="h-48 overflow-y-auto p-4 grid grid-cols-2 gap-x-6 gap-y-2 scrollbar-thin">
                    {filteredRegions.map(region => (
                      <label key={region} className="flex items-center space-x-3 group cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedRegions.includes(region)}
                          onChange={() => handleRegionToggle(region)}
                          className="w-4 h-4 rounded text-[#f26522] border-slate-300 focus:ring-[#f26522] transition-all"
                        />
                        <span className={`text-xs transition-colors ${selectedRegions.includes(region) ? 'text-slate-900 font-bold' : 'text-slate-500 group-hover:text-slate-700'}`}>
                          {region}
                        </span>
                      </label>
                    ))}
                  </div>
                  {selectedRegions.length > 0 && (
                    <div className="p-3 bg-[#fcf8f2] border-t border-slate-100 flex flex-wrap gap-1.5">
                      {selectedRegions.map(r => (
                        <span key={r} className="inline-flex items-center px-2 py-0.5 rounded-md bg-white border border-[#f26522]/20 text-[9px] font-bold text-[#f26522] uppercase tracking-tighter">
                          {r}
                          <button onClick={() => handleRegionToggle(r)} className="ml-1 hover:text-red-500 transition-colors">
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Local Adaptation Notes</label>
                <textarea 
                  rows={3}
                  defaultValue={edition.description} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-3 text-sm resize-none outline-none focus:ring-1 focus:ring-[#f26522] italic leading-relaxed"
                  placeholder="Describe regional-specific adaptations or theme changes for this edition..."
                />
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-xl border border-[#e8e4db] shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Game Rule Translation</h3>
            <div className="aspect-video border border-dashed border-slate-200 rounded-xl bg-slate-50/30 flex items-center justify-center p-8 text-slate-400 italic text-sm text-center">
              Instruction Booklet Rich Text Editor coming soon...
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          <section className="bg-white p-6 rounded-xl border border-[#e8e4db] shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Master Blueprint View</h3>
            <div className="p-5 bg-slate-900 rounded-2xl space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-widest">Base Name:</span>
                <span className="text-white font-serif italic">{game?.name}</span>
              </div>
              <div className="border-t border-slate-800 pt-4 flex flex-col space-y-2">
                 <span className="text-[9px] text-slate-500 uppercase font-black">Gameplay Mechanic:</span>
                 <p className="text-[11px] text-slate-400 italic leading-snug line-clamp-4">{game?.description}</p>
              </div>
              <button onClick={() => navigate(`/games/${game?.id}`)} className="w-full mt-2 py-2 bg-white/5 border border-white/10 rounded text-[9px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">
                Modify Master
              </button>
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl border border-[#e8e4db] shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Validation Logic</h3>
            <div className="space-y-4">
              {TEXT_FIT_PRESETS.map((preset) => (
                <div 
                  key={preset.id} 
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${edition.textFitRulesId === preset.id ? 'border-[#f26522] bg-[#fcf8f2]' : 'border-slate-100 hover:border-slate-300'}`}
                >
                  <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-2">{preset.name}</p>
                  <div className="grid grid-cols-2 gap-y-1 text-[9px] text-slate-500 font-mono">
                    <span>Normal Max:</span>
                    <span className="text-right">{preset.normal.maxChars} ch</span>
                    <span>Order Max:</span>
                    <span className="text-right">{preset.ordering.itemMax} ch</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl border border-[#e8e4db] shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Physical Assets</h3>
            <div className="grid grid-cols-2 gap-3">
              {['Front Cover', 'Back Cover', 'Box Inlay', 'Manual'].map(a => (
                <div key={a} className="aspect-video bg-slate-50 border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-[8px] font-black text-slate-300 uppercase text-center p-2 hover:border-[#f26522] hover:text-[#f26522] cursor-pointer transition-all">
                  Upload {a}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EditionDetailView;
