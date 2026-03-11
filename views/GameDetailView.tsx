
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Game, Edition, ExampleQuestion, CardLayoutSpec, RoundType } from '../types';
import { RULES_TEXT_FRONT, RULES_TEXT_BACK, CATEGORY_STYLES } from '../constants';
import { useAuth } from '../App';
import { extractAndAnalyzeExamples } from '../geminiService';

type TabType = 'editions' | 'basics' | 'examples' | 'ai-skills' | 'layout';

interface GameDetailViewProps {
  games: Game[];
  editions: Edition[];
  onAddEdition: (edition: Edition) => void;
}

const FONT_OPTIONS = [
  { label: 'Inter (Sans)', value: "'Inter', sans-serif" },
  { label: 'Playfair (Serif)', value: "'Playfair Display', serif" },
  { label: 'System Serif', value: 'serif' },
  { label: 'System Mono', value: 'monospace' },
  { label: 'Arial', value: 'Arial, sans-serif' }
];

const StarRating = ({ value, max = 5, onChange, readonly = false, color = "text-[#f26522]", label }: { value: number, max?: number, onChange?: (v: number) => void, readonly?: boolean, color?: string, label?: string }) => (
  <div className="flex flex-col space-y-1">
    {label && <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{label}</span>}
    <div className="flex space-x-0.5">
      {Array(max).fill(0).map((_, i) => (
        <button 
          key={i} 
          disabled={readonly}
          onClick={() => onChange?.(i + 1)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-all ${i < value ? color : 'text-slate-200'}`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  </div>
);

const GameDetailView: React.FC<GameDetailViewProps> = ({ games, editions, onAddEdition }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('editions');
  const [isEditionModalOpen, setIsEditionModalOpen] = useState(false);
  const [examples, setExamples] = useState<ExampleQuestion[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewSide, setPreviewSide] = useState<'front' | 'back'>('front');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const game = games.find(g => g.id === id);

  const [layoutSpecs, setLayoutSpecs] = useState<CardLayoutSpec[]>([]);

  useEffect(() => {
    if (game) {
      setLayoutSpecs(game.layoutSpecs || [
        { roundType: 'Rules', widthMm: 90, heightMm: 60, maxCharsQuestion: 40, maxCharsAnswer: 950, maxCharsBack: 1250, safeMarginMm: 5, titleFont: "'Inter', sans-serif", titleSize: 16, bodyFont: "'Inter', sans-serif", bodySize: 10 },
        { roundType: 'Normal 5Q', widthMm: 87, heightMm: 56, maxCharsQuestion: 160, maxCharsAnswer: 40, maxCharsFactoid: 100, safeMarginMm: 3, titleFont: "'Inter', sans-serif", titleSize: 14, bodyFont: "'Inter', sans-serif", bodySize: 11.5 },
        { roundType: 'Ordering', widthMm: 87, heightMm: 56, maxCharsQuestion: 220, maxCharsAnswer: 32, safeMarginMm: 3, titleFont: "'Inter', sans-serif", titleSize: 14, bodyFont: "'Inter', sans-serif", bodySize: 11.5 },
        { roundType: 'List', widthMm: 87, heightMm: 56, maxCharsQuestion: 260, maxCharsAnswer: 90, safeMarginMm: 3, titleFont: "'Inter', sans-serif", titleSize: 14, bodyFont: "'Inter', sans-serif", bodySize: 11.5 }
      ]);
    }
  }, [game]);

  const updateSpec = (index: number, updates: Partial<CardLayoutSpec>) => {
    setLayoutSpecs(prev => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  if (!game) return null;

  const isLeadEditor = user?.role === 'Lead Editor';
  const gameEditions = editions.filter(ed => ed.gameId === game.id);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = event.target?.result as string;
      const extracted = await extractAndAnalyzeExamples(data, file.type);
      const newExamples: ExampleQuestion[] = extracted.map((ex: any) => ({
        id: `ex-${Math.random().toString(36).substr(2, 9)}`,
        gameId: game.id,
        category: ex.category || 'General',
        question: ex.question,
        answer: ex.answer,
        adminRating: 3, 
        aiDifficulty: ex.aiDifficulty || 3,
        sourceFile: file.name,
        createdAt: new Date().toISOString()
      }));
      setExamples(prev => [...newExamples, ...prev]);
      setIsUploading(false);
    };
    if (file.type.startsWith('image/')) reader.readAsDataURL(file);
    else reader.readAsText(file);
  };

  const geoStyle = CATEGORY_STYLES['Geografie'];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div className="flex items-center space-x-6">
          <button onClick={() => navigate('/games')} className="p-3 hover:bg-white rounded-xl border border-slate-200 transition-all group shadow-sm bg-slate-50">
            <svg className="w-5 h-5 text-slate-400 group-hover:text-[#f26522]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h2 className="text-3xl font-serif italic text-slate-900 leading-none">{game.name}</h2>
              <span className="text-[9px] font-black px-2.5 py-1 rounded bg-slate-100 text-slate-500 uppercase tracking-widest border border-slate-200">Master Blueprint</span>
            </div>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed italic line-clamp-1">{game.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setActiveTab('basics')}
            className={`bg-white border border-[#f26522]/30 text-[#f26522] px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#fcf8f2] transition-all flex items-center space-x-2 shadow-sm ${activeTab === 'basics' ? 'bg-[#fcf8f2]' : ''}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            <span>Game basics</span>
          </button>
          {isLeadEditor && (
            <button className="bg-slate-900 text-white px-8 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all">
              Save Blueprint
            </button>
          )}
        </div>
      </div>

      <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-hide">
        {[
          { id: 'editions', label: 'Game Edition' },
          { id: 'basics', label: 'Game basics' },
          { id: 'examples', label: 'Example Library' },
          { id: 'ai-skills', label: 'AI Specialisations' },
          { id: 'layout', label: 'Card Layout Detail' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`px-8 py-5 text-[11px] font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap relative ${
              activeTab === tab.id ? 'border-[#f26522] text-[#f26522]' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.label}
            {tab.id === 'examples' && examples.length > 0 && (
              <span className="ml-2 text-[10px] bg-[#f26522] text-white font-black px-1.5 py-0.5 rounded-full">{examples.length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in duration-300">
        {activeTab === 'layout' && (
          <div className="space-y-10">
            <div className="bg-[#fcfaf7] border border-[#e8e4db] rounded-2xl p-8 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-serif italic text-slate-900 leading-none">Card Layout Detail</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Dimensions & Character Constraints are LOCKED at Master level.</p>
              </div>
              <div className="px-4 py-2 bg-red-50 border border-red-100 rounded flex items-center space-x-2">
                 <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                 <span className="text-[9px] font-black text-red-600 uppercase tracking-tighter">Production Hard-Lock</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-12">
              {layoutSpecs.map((spec, i) => (
                <div key={i} className="studio-card p-0 overflow-hidden group hover:border-[#f26522]/30 transition-all bg-slate-50/10">
                  <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center">
                    <h4 className="font-black text-[10px] text-slate-500 uppercase tracking-widest">{spec.roundType} Blueprint</h4>
                    <div className="flex bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
                      <button onClick={() => setPreviewSide('front')} className={`px-4 py-1.5 text-[9px] font-black uppercase rounded transition-all ${previewSide === 'front' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Front</button>
                      <button onClick={() => setPreviewSide('back')} className={`px-4 py-1.5 text-[9px] font-black uppercase rounded transition-all ${previewSide === 'back' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Back</button>
                    </div>
                  </div>

                  <div className="p-10 flex flex-col md:flex-row gap-16 items-start">
                    {/* Visual Preview */}
                    <div className="shrink-0 w-full md:w-[480px]">
                      {spec.roundType === 'Rules' ? (
                        <div className="aspect-[3/2] w-full bg-white border-[12px] border-slate-900 rounded-[32px] relative shadow-2xl overflow-hidden flex flex-col p-8 group-hover:border-slate-800 transition-colors">
                           <div className="flex flex-col h-full text-slate-900" style={{ fontFamily: spec.bodyFont }}>
                             {previewSide === 'front' && (
                               <div 
                                 className="border-[2.5px] border-slate-900 rounded-xl py-2 px-8 text-center font-black tracking-tight mb-4 uppercase text-[15px]"
                                 style={{ fontFamily: spec.titleFont, fontSize: `${spec.titleSize}px` }}
                               >
                                 PUBQUIZ SPELREGELS
                               </div>
                             )}
                             <div className="flex-1 overflow-hidden relative pt-2">
                                <p 
                                  className="leading-[1.3] text-slate-800 font-medium text-justify"
                                  style={{ fontSize: `${spec.bodySize}px`, paddingRight: previewSide === 'back' ? '30px' : '0' }}
                                >
                                  {previewSide === 'front' ? RULES_TEXT_FRONT : RULES_TEXT_BACK}
                                </p>
                                <div className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-slate-900 text-white text-[12px] flex items-center justify-center font-black shadow-lg">
                                  {previewSide === 'front' ? '1' : '2'}
                                </div>
                             </div>
                           </div>
                        </div>
                      ) : (
                        <div className="aspect-[3/2] w-full bg-black border-[10px] border-slate-900 rounded-[32px] relative shadow-2xl overflow-hidden flex flex-col p-6 group-hover:border-slate-800 transition-colors">
                           <div className="flex flex-col h-full text-white">
                              {/* Header Area conform foto */}
                              <div className="flex items-center space-x-2 mb-6 h-10">
                                <div className="border-[1.5px] border-white rounded-[10px] px-3 h-full flex items-center justify-center text-[11px] font-black uppercase">
                                  QUIZ 1
                                </div>
                                <div className="border-[1.5px] border-white rounded-[10px] w-10 h-full flex items-center justify-center">
                                  <svg className="w-5 h-5" style={{ color: geoStyle.color }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM11 19.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zM17.9 17.39c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                                </div>
                                <div className="flex-1 border-[1.5px] rounded-[10px] h-full flex items-center justify-center" style={{ borderColor: geoStyle.color }}>
                                  <span className="text-[14px] font-black uppercase tracking-[0.1em]" style={{ color: geoStyle.color, fontFamily: spec.titleFont }}>
                                    {previewSide === 'front' ? 'GEOGRAFIE' : 'ANTWOORDEN'}
                                  </span>
                                </div>
                                <div className="border-[1.5px] border-white rounded-[10px] px-3 h-full flex items-center justify-center text-[11px] font-black uppercase">
                                  RONDE 1
                                </div>
                              </div>
                              
                              {/* Body Content met dunne scheidingslijnen */}
                              <div className="flex-1 flex flex-col justify-between py-1" style={{ fontFamily: spec.bodyFont }}>
                                 {[1, 2, 3, 4, 5].map((num) => (
                                   <div key={num} className="flex space-x-3 items-start border-t border-white/10 pt-2 pb-2 first:border-t-0 relative">
                                      {/* Dunne blauwe scheidingslijn (indien front/back conform foto) */}
                                      {num > 1 && <div className="absolute top-0 left-10 right-0 h-[0.5px] bg-white/10" />}
                                      
                                      <div 
                                        className="w-7 h-7 shrink-0 border-[1.5px] border-white rounded-lg flex items-center justify-center text-[16px] font-black"
                                        style={{ color: geoStyle.color }}
                                      >
                                        {num}
                                      </div>
                                      <div className="flex-1 pt-0.5 opacity-40 space-y-1">
                                         {/* 3 regels voor vraag, 2 voor antwoord representatie */}
                                         {previewSide === 'front' ? (
                                           <>
                                             <div className="h-1.5 bg-white w-full rounded-full" />
                                             <div className="h-1.5 bg-white w-full rounded-full" />
                                             <div className="h-1.5 bg-white w-2/3 rounded-full" />
                                           </>
                                         ) : (
                                           <>
                                             <div className="h-1.5 bg-white w-full rounded-full" />
                                             <div className="h-1.5 bg-white w-1/2 rounded-full" />
                                           </>
                                         )}
                                      </div>
                                   </div>
                                 ))}
                              </div>

                              <div className="mt-2 flex justify-start opacity-30">
                                 <span className="text-[9px] font-black text-white tracking-[0.3em]">1-1</span>
                              </div>
                           </div>
                        </div>
                      )}
                      <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Master Physical Preview</p>
                    </div>

                    {/* Constraints Editor */}
                    <div className="flex-1 space-y-12">
                      <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dimensions</label>
                          <div className="text-sm font-black text-slate-900">{spec.widthMm} x {spec.heightMm}mm</div>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Safe Margin</label>
                          <div className="text-sm font-black text-slate-900">{spec.safeMarginMm}mm</div>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-3">Character Constraints</h5>
                        <div className="grid grid-cols-2 gap-8">
                          {spec.roundType === 'Rules' ? (
                            <>
                              <div className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Title Box Limit</label>
                                <input type="number" value={spec.maxCharsQuestion} onChange={(e) => updateSpec(i, { maxCharsQuestion: parseInt(e.target.value) })} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-1 focus:ring-[#f26522] outline-none" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Body {previewSide === 'front' ? 'Front' : 'Back'} Limit</label>
                                <input 
                                  type="number" 
                                  value={previewSide === 'front' ? spec.maxCharsAnswer : spec.maxCharsBack} 
                                  onChange={(e) => previewSide === 'front' ? updateSpec(i, { maxCharsAnswer: parseInt(e.target.value) }) : updateSpec(i, { maxCharsBack: parseInt(e.target.value) })}
                                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-1 focus:ring-[#f26522] outline-none" 
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Max Question Chars</label>
                                <input type="number" value={spec.maxCharsQuestion} onChange={(e) => updateSpec(i, { maxCharsQuestion: parseInt(e.target.value) })} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-1 focus:ring-[#f26522] outline-none" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Max Answer Chars</label>
                                <input type="number" value={spec.maxCharsAnswer} onChange={(e) => updateSpec(i, { maxCharsAnswer: parseInt(e.target.value) })} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-1 focus:ring-[#f26522] outline-none" />
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="space-y-8">
                        <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-3">Typography & Style Guide</h5>
                        <div className="grid grid-cols-2 gap-10">
                          <div className="space-y-4">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Master Title Font</label>
                            <div className="space-y-3">
                              <select 
                                value={spec.titleFont} 
                                onChange={(e) => updateSpec(i, { titleFont: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none"
                              >
                                {FONT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                              </select>
                              <div className="flex items-center space-x-4">
                                <input 
                                  type="range" min="8" max="24" step="0.5" 
                                  value={spec.titleSize} 
                                  onChange={(e) => updateSpec(i, { titleSize: parseFloat(e.target.value) })}
                                  className="flex-1 accent-[#f26522]" 
                                />
                                <span className="text-[10px] font-black text-slate-900 w-10">{spec.titleSize}px</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Body Text Font</label>
                            <div className="space-y-3">
                              <select 
                                value={spec.bodyFont} 
                                onChange={(e) => updateSpec(i, { bodyFont: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none"
                              >
                                {FONT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                              </select>
                              <div className="flex items-center space-x-4">
                                <input 
                                  type="range" min="6" max="18" step="0.25" 
                                  value={spec.bodySize} 
                                  onChange={(e) => updateSpec(i, { bodySize: parseFloat(e.target.value) })}
                                  className="flex-1 accent-[#f26522]" 
                                />
                                <span className="text-[10px] font-black text-slate-900 w-10">{spec.bodySize}px</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-900 text-white italic text-[10px] text-center font-bold uppercase tracking-[0.2em]">Global Design System Constraint</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Andere tabs blijven ongewijzigd */}
        {activeTab === 'editions' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Product Line Editions</h3>
               {isLeadEditor && (
                 <button onClick={() => setIsEditionModalOpen(true)} className="text-[10px] font-black text-[#f26522] uppercase tracking-widest hover:underline">+ Initialize New Localization</button>
               )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gameEditions.map(ed => (
                <div key={ed.id} onClick={() => navigate(`/editions/${ed.id}`)} className="studio-card p-6 cursor-pointer group hover:border-[#f26522]/30 transition-all flex flex-col justify-between min-h-[180px]">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="px-3 py-1 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-widest border border-slate-200">{ed.sku}</div>
                      <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Live</span>
                    </div>
                    <h4 className="text-xl font-serif italic text-slate-900 group-hover:text-[#f26522] transition-colors mb-2">{ed.name}</h4>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{ed.language} • {ed.region}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'basics' && (
          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-12 lg:col-span-8 space-y-10">
              <section className="studio-card p-10 space-y-10 border-l-4 border-l-[#f26522]">
                <div>
                  <h3 className="text-[10px] font-black text-[#f26522] uppercase tracking-[0.2em] mb-6">Master Structure</h3>
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Parent Product Name</label>
                      <input type="text" readOnly={!isLeadEditor} defaultValue={game.name} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-lg font-serif italic text-slate-900 focus:ring-1 focus:ring-[#f26522] outline-none shadow-inner ${!isLeadEditor ? 'opacity-60' : ''}`} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gameplay Mechanics</label>
                      <textarea defaultValue={game.description} readOnly={!isLeadEditor} rows={6} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm leading-relaxed text-slate-600 focus:ring-1 focus:ring-[#f26522] outline-none shadow-inner resize-none italic" />
                    </div>
                  </div>
                </div>
              </section>

              <section className="studio-card p-10">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Structural Grid</h3>
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quizzes per Box</label>
                    <input type="number" disabled={!isLeadEditor} defaultValue={game.gridQuizzes} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm focus:ring-1 focus:ring-[#f26522] outline-none shadow-inner" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rounds per Quiz</label>
                    <input type="number" disabled={!isLeadEditor} defaultValue={game.gridRounds} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm focus:ring-1 focus:ring-[#f26522] outline-none shadow-inner" />
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>

      {isEditionModalOpen && isLeadEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-10 shadow-2xl border border-slate-200">
            <h3 className="text-3xl font-serif italic text-slate-900 text-center mb-8">Initialize Edition</h3>
            <div className="space-y-6">
              <input type="text" placeholder="Edition Title (e.g. NL 2026)" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-1 focus:ring-[#f26522]" />
              <button className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl">Start Production track</button>
              <button onClick={() => setIsEditionModalOpen(false)} className="w-full py-2 text-[11px] font-black text-slate-400 uppercase">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameDetailView;
