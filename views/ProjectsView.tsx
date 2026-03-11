
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PROJECTS, MOCK_EDITIONS } from '../constants';
import { ProjectStatus } from '../types';

const StatusBadge = ({ status }: { status: ProjectStatus }) => {
  const colors: Record<ProjectStatus, string> = {
    [ProjectStatus.DRAFT]: 'bg-slate-100 text-slate-600 border-slate-200',
    [ProjectStatus.CONTENT_GEN]: 'bg-purple-50 text-purple-600 border-purple-200',
    [ProjectStatus.REVIEW]: 'bg-blue-50 text-blue-600 border-blue-200',
    [ProjectStatus.SET_BUILDING]: 'bg-amber-50 text-amber-600 border-amber-200',
    [ProjectStatus.TEMPLATE_CHECK]: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    [ProjectStatus.PRINT_READY]: 'bg-green-50 text-green-600 border-green-200',
    [ProjectStatus.PRODUCTION]: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${colors[status]}`}>
      {status}
    </span>
  );
};

const ProjectsView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif italic text-slate-900 leading-none">Active Projects</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Production Queue & Editorial Progress</p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-2 rounded text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-slate-800 transition-all">
          New Production Run
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_PROJECTS.map((proj) => {
          const edition = MOCK_EDITIONS.find(e => e.id === proj.editionId);
          return (
            <div 
              key={proj.id} 
              className="studio-card p-6 flex flex-col hover:border-[#ff8a00]/30 transition-all cursor-pointer group"
              onClick={() => navigate(`/projects/${proj.id}/builder`)}
            >
              <div className="flex justify-between items-start mb-4">
                <StatusBadge status={proj.status} />
                <span className="text-[8px] text-slate-300 uppercase font-black tracking-widest">{proj.lastModified}</span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#ff8a00] transition-colors mb-2 leading-tight">
                {proj.name}
              </h3>
              
              <div className="flex items-center space-x-2 mt-auto">
                <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-500 border border-slate-200">
                  {edition?.language.substring(0,2).toUpperCase()}
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {edition?.sku} • {edition?.region}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400">SM</div>
                    <span className="text-[10px] font-bold text-slate-500">{proj.owner}</span>
                </div>
                <svg className="w-4 h-4 text-slate-200 group-hover:text-[#ff8a00] transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectsView;
