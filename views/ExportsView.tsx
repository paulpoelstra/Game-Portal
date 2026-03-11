
import React from 'react';

const ExportsView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-300 mb-6 shadow-sm">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </div>
      <h2 className="text-3xl font-serif italic text-slate-900 mb-2">Print Packs</h2>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] max-w-xs leading-relaxed">
        Coming Soon: Automated generation of high-resolution PDF print packs and InDesign assets.
      </p>
    </div>
  );
};

export default ExportsView;
