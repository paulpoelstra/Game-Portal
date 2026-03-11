
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PROJECTS, CATEGORIES, MOCK_EDITIONS, TEXT_FIT_PRESETS, CATEGORY_STYLES } from '../constants';
import { QuizQuestion, RoundCard, RoundType, TextFitRules } from '../types';
import { localizeContent } from '../geminiService';

const RoundEditorView: React.FC = () => {
  const { projectId, quizIdx, roundIdx } = useParams();
  const navigate = useNavigate();
  const project = MOCK_PROJECTS.find(p => p.id === projectId);
  const edition = MOCK_EDITIONS.find(e => e.id === project?.editionId);
  const rules: TextFitRules = useMemo(() => 
    TEXT_FIT_PRESETS.find(r => r.id === edition?.textFitRulesId) || TEXT_FIT_PRESETS[0],
    [edition]
  );
  
  const categoryNames = ['Geografie', 'Amusement', 'Geschiedenis', 'Kunst & Cultuur', 'Wetenschap', 'Sport'];
  const category = categoryNames[Number(roundIdx)] || CATEGORIES[Number(roundIdx)];
  const [previewSide, setPreviewSide] = useState<'front' | 'back'>('front');

  // Dynamische data op basis van ronde (Geografie vs Amusement foto's)
  const getInitialData = (): RoundCard => {
    if (Number(roundIdx) === 0) { // Geografie
      return {
        id: `q${quizIdx}-r${roundIdx}`,
        type: 'Normal 5Q',
        questions: [
          { id: '1', question: 'Hoe heet het 800 jaar oude Haagse gebouwencomplex naast het Mauritshuis waarvan de renovatiekosten in 2024 werden beraamd op zo’n 2 miljard euro?', answer: 'Binnenhof' },
          { id: '2', question: 'Hoeveel kilometer is het rijden met de auto van America in de provincie Limburg tot Poortugaal in de provincie Zuid-Holland volgens Routenet? Je mag er 15 km naast zitten.', answer: '164 km (dus 149 tot 179 kilometer is goed)' },
          { id: '3', question: 'In welke provincie liggen de dorpjes Eijsden, Mesch, Mheer en Noorbeek waar het op 12 september 2024 precies 80 jaar geleden was dat ze als eerste werden bevrijd?', answer: 'Limburg' },
          { id: '4', question: 'Welke plaats staat op Wikipedia onderaan de alfabetische lijst met Nederlandse plaatsen?', answer: 'Zwolle (de hoofdstad van Overijssel maar ook een buurtschap in de gemeente Oost Gelre in Gelderland)' },
          { id: '5', question: 'In welke provincie staat Zeehondencentrum Pieterburen dat in 2024 viral ging en veel donaties ontving nadat een Japans X-account de livestream deelde?', answer: 'Groningen (zeehonden lijken op een Japans gelukssymbool)' }
        ],
        reviewStatus: 'Pending', fitStatus: 'Ok'
      };
    } else if (Number(roundIdx) === 1) { // Amusement
      return {
        id: `q${quizIdx}-r${roundIdx}`,
        type: 'Normal 5Q',
        questions: [
          { id: '1', question: 'Welke Nederlandse band met Martin Buitenhuis als leadzanger vierde in 2024 het 30-jarig jubileum van de hit ‘Stil In Mij’ met een concert in AFAS Live?', answer: 'Van Dik Hout' },
          { id: '2', question: 'Wat is de artiestennaam van YouTube-ster Kalvijn Boerma die in 2024 trouwde met zijn jeugdliefde Nina Warink die zelf ook YouTuber is en kookboeken schrijft?', answer: 'Kalvijn' },
          { id: '3', question: 'Hoe heet het journaal dat vanaf 2 september 2024 om 17:00 te zien is en zich richt op mensen die het lastig vinden om het nieuws te volgen? NOS Journaal in ...', answer: 'Makkelijke Taal' },
          { id: '4', question: 'Bij welk culinaire jeugdprogramma dat o.a. de Zilveren Nipkowschijf won, stopte Siemon de Jong na 20 jaar als presentator en nam Nick Toet in 2024 die rol over?', answer: 'Taarten van Abel / (vanaf 2024) Taarten van Babel (gepresenteerd door bakker en YouTuber Nick Toet)' },
          { id: '5', question: 'Welke zanger cancelde begin 2024 zijn geplande theatertour na de vele negatieve reacties en hoopte middels een realityserie later in dat jaar het tij te keren?', answer: 'Gordon / Cornelis Willem Heuckeroth' }
        ],
        reviewStatus: 'Pending', fitStatus: 'Ok'
      };
    }
    return { id: `q${quizIdx}-r${roundIdx}`, type: 'Normal 5Q', questions: Array(5).fill({ question: '', answer: '' }), reviewStatus: 'Pending', fitStatus: 'Ok' };
  };

  const [roundData, setRoundData] = useState<RoundCard>(getInitialData());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'create' | 'reuse' | 'adapt'>('reuse');
  const [isLocalizing, setIsLocalizing] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const checkFit = (text: string = '', type: 'normal' | 'order-prompt' | 'order-item' | 'list-prompt' | 'list-hint') => {
    const len = text.length;
    const lines = Math.ceil(len / 42); 
    switch(type) {
      case 'normal':
        if (len > rules.normal.maxChars || lines > 4) return 'fail';
        if (len > rules.normal.warnChars || lines >= 3) return 'warn';
        return 'ok';
      default: return 'ok';
    }
  };

  const overallStatus = useMemo(() => {
    let hasFail = false;
    if (roundData.type === 'Normal 5Q') {
      hasFail = roundData.questions.some(q => checkFit(q.question, 'normal') === 'fail');
    }
    return hasFail ? 'Overflow' : 'Ok';
  }, [roundData, rules]);

  const handleSourceAction = async (tab: string) => {
    if (tab === 'adapt') {
      setIsProcessing(true);
      const adapted = await localizeContent(roundData, edition?.language || 'Dutch', isLocalizing);
      setRoundData({ ...roundData, ...adapted, origin: 'Adapted from Trivia UK', reviewStatus: 'Pending' });
      setIsProcessing(false);
    }
    setIsModalOpen(false);
  };

  if (!project) return <div>Project not found</div>;

  const style = CATEGORY_STYLES[category] || { color: '#00AEEF', icon: 'globe' };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(`/projects/${projectId}/builder`)} className="p-2 hover:bg-white rounded-lg transition-all border border-slate-200">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-800">Ronde Editor</h2>
              <span className={`px-2 py-0.5 text-[9px] font-black rounded uppercase border ${overallStatus === 'Overflow' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                {overallStatus}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{category} • Quiz {Number(quizIdx)+1}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200 shadow-sm mr-4">
             <button onClick={() => setPreviewSide('front')} className={`px-4 py-1.5 text-[9px] font-black uppercase rounded transition-all ${previewSide === 'front' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}>Questions</button>
             <button onClick={() => setPreviewSide('back')} className={`px-4 py-1.5 text-[9px] font-black uppercase rounded transition-all ${previewSide === 'back' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}>Answers</button>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg text-[10px] font-black uppercase hover:bg-slate-50 shadow-sm">Library</button>
          <button className="px-6 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase shadow-md">Opslaan</button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-8 overflow-hidden">
        {/* Editorial Side */}
        <div className="col-span-6 flex flex-col space-y-4 overflow-y-auto pr-4">
          <div className="flex space-x-2 mb-2 p-1 bg-slate-100 rounded-lg w-fit">
            {(['Normal 5Q', 'Ordering', 'List'] as RoundType[]).map(t => (
              <button 
                key={t}
                onClick={() => setRoundData({...roundData, type: t})}
                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${roundData.type === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {roundData.questions.map((q, idx) => {
            const fit = checkFit(previewSide === 'front' ? q.question : q.answer, 'normal');
            return (
              <div key={idx} className={`studio-card p-5 space-y-3 ${fit === 'fail' ? 'border-red-200 ring-1 ring-red-50' : 'border-slate-200'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vraag {idx + 1}</span>
                  <div className="flex space-x-3 items-center">
                    <span className={`text-[8px] font-bold ${fit === 'fail' ? 'text-red-500' : 'text-slate-300'}`}>
                      {previewSide === 'front' ? q.question.length : q.answer.length} ch
                    </span>
                    {fit !== 'ok' && <span className={`w-1.5 h-1.5 rounded-full ${fit === 'fail' ? 'bg-red-500' : 'bg-amber-400'}`} />}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-300 uppercase tracking-[0.1em]">Vraag</label>
                    <textarea 
                      value={q.question}
                      onChange={(e) => {
                        const n = [...roundData.questions]; n[idx].question = e.target.value; setRoundData({...roundData, questions: n});
                      }}
                      className="w-full bg-slate-50 border border-slate-100 rounded px-3 py-2 text-sm focus:ring-0 outline-none resize-none h-16 leading-relaxed"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-300 uppercase tracking-[0.1em]">Antwoord</label>
                    <textarea 
                      value={q.answer}
                      onChange={(e) => {
                        const n = [...roundData.questions]; n[idx].answer = e.target.value; setRoundData({...roundData, questions: n});
                      }}
                      className="w-full bg-white border border-slate-100 rounded px-3 py-2 text-sm font-bold text-[#f26522] focus:ring-0 outline-none resize-none h-12 leading-snug"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Physical Card Preview */}
        <div className="col-span-6 flex flex-col items-center">
          <div className="w-full h-full bg-[#f0f0f0] rounded-3xl flex items-center justify-center p-10 border border-slate-200 shadow-inner overflow-hidden">
            <div className="aspect-[3/2] w-full max-w-[500px] bg-black rounded-[28px] p-6 flex flex-col text-white shadow-2xl relative border-[6px] border-black">
               {/* Header Area */}
               <div className="flex items-center space-x-2 mb-6 h-10">
                  <div className="border-[1.5px] border-white rounded-[10px] px-3 h-full flex items-center justify-center text-[11px] font-black uppercase whitespace-nowrap">
                    QUIZ {Number(quizIdx)+1}
                  </div>
                  <div className="border-[1.5px] border-white rounded-[10px] w-10 h-full flex items-center justify-center">
                    {style.icon === 'tv' ? (
                       <svg className="w-5 h-5" style={{ color: style.color }} fill="currentColor" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg>
                    ) : (
                       <svg className="w-5 h-5" style={{ color: style.color }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM11 19.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zM17.9 17.39c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                    )}
                  </div>
                  <div className="flex-1 border-[1.5px] rounded-[10px] h-full flex items-center justify-center" style={{ borderColor: style.color }}>
                    <span className="text-[14px] font-black uppercase tracking-[0.1em]" style={{ color: style.color }}>
                      {previewSide === 'front' ? category.toUpperCase() : 'ANTWOORDEN'}
                    </span>
                  </div>
                  <div className="border-[1.5px] border-white rounded-[10px] px-3 h-full flex items-center justify-center text-[11px] font-black uppercase whitespace-nowrap">
                    RONDE {Number(roundIdx)+1}
                  </div>
               </div>
               
               {/* Body Content */}
               <div className="flex-1 flex flex-col justify-between py-1 relative">
                  {roundData.questions.map((q, i) => {
                    const text = previewSide === 'front' ? q.question : q.answer;
                    const fail = checkFit(text, 'normal') === 'fail';
                    return (
                      <div key={i} className="flex space-x-3 items-start border-t border-white/10 pt-1.5 pb-1.5 first:border-t-0 relative">
                         {/* Dunne categorie-kleur scheidingslijn */}
                         {i > 0 && <div className="absolute top-0 left-10 right-0 h-[0.5px] bg-white/10" />}
                         
                         <div 
                           className="w-7 h-7 shrink-0 border-[1.5px] border-white rounded-lg flex items-center justify-center text-[16px] font-black"
                           style={{ color: style.color }}
                         >
                           {i+1}
                         </div>
                         {/* Ruimte voor 3 regels vraag / 2 regels antwoord */}
                         <p className={`text-[11.2px] font-bold leading-[1.25] pt-0.5 pr-2 ${fail ? 'text-red-400' : 'text-slate-100'} ${previewSide === 'front' ? 'line-clamp-3' : 'line-clamp-2'}`}>
                           {text || '---'}
                         </p>
                      </div>
                    );
                  })}
               </div>

               {/* Footer */}
               <div className="mt-2 flex justify-start opacity-30">
                  <span className="text-[9px] font-black text-white tracking-[0.3em]">
                    {Number(quizIdx)+1}-{Number(roundIdx)+1}
                  </span>
               </div>
            </div>
          </div>
          <div className="mt-4 flex space-x-8">
             <div className="flex items-center space-x-2">
               <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-300" />
               <span className="text-[9px] font-black text-slate-400 uppercase">Black Core Cardboard</span>
             </div>
             <div className="flex items-center space-x-2">
               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: style.color }} />
               <span className="text-[9px] font-black text-slate-400 uppercase">{category} Color</span>
             </div>
          </div>
        </div>
      </div>

      {/* Sourcing Modal - Adapt/Reuse */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-8">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-[#e8e4db]">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-serif italic font-bold text-slate-800 leading-none mb-2">Content Sourcing Library</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Active Search: {category} Rounds</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex bg-slate-50/50 border-b border-slate-100">
              {['reuse', 'adapt', 'create'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setModalTab(tab as any)}
                  className={`px-10 py-5 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${modalTab === tab ? 'border-[#ff8a00] text-[#ff8a00] bg-white' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  {tab === 'reuse' ? 'Direct Import' : tab === 'adapt' ? 'Localize & Adapt' : 'Manual Entry'}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-12">
              {modalTab === 'adapt' ? (
                <div className="max-w-xl mx-auto space-y-10 text-center">
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500 mb-6">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" /></svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">Adaptive Localization Agent</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">This will analyze content from a reference edition (e.g., UK 2024) and generate a culturally adapted draft for {edition?.language} while maintaining structure and card constraints.</p>
                  </div>
                  <button 
                    onClick={() => handleSourceAction('adapt')}
                    disabled={isProcessing}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-slate-200 disabled:opacity-50 hover:bg-slate-800 transition-all"
                  >
                    {isProcessing ? 'Processing Diffusion...' : 'Generate Adaptive Draft'}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-300">
                  <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                  <p className="italic font-serif text-xl">Module staging area...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoundEditorView;
