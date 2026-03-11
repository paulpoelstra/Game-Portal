
import React, { useState, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { ICONS, MOCK_GAMES, MOCK_EDITIONS } from './constants';
import { Game, Edition, User, UserRole } from './types';
import DashboardView from './views/DashboardView';
import EditionsView from './views/EditionsView';
import EditionDetailView from './views/EditionDetailView';
import ProjectsView from './views/ProjectsView';
import SetBuilderView from './views/SetBuilderView';
import RoundEditorView from './views/RoundEditorView';
import ProductionView from './views/ProductionView';
import GamesView from './views/GamesView';
import GameDetailView from './views/GameDetailView';
import ReviewQueueView from './views/ReviewQueueView';
import ExportsView from './views/ExportsView';
import SettingsView from './views/SettingsView';
import LoginView from './views/LoginView';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const SidebarLink = ({ to, label, icon: Icon, disabled = false }: any) => (
  <NavLink
    to={disabled ? "#" : to}
    className={({ isActive }) => 
      `flex items-center space-x-3 px-5 py-3 transition-all duration-150 group
      ${disabled ? 'opacity-30 cursor-not-allowed' : isActive ? 'sidebar-active font-semibold' : 'text-slate-500 hover:bg-[#fcf8f2] hover:text-[#f26522]'}`
    }
  >
    <Icon className={`w-4 h-4 transition-colors ${disabled ? '' : 'group-hover:text-[#f26522]'}`} />
    <span className="text-[13px] tracking-tight">{label}</span>
    {disabled && <span className="ml-auto text-[7px] uppercase tracking-widest font-black text-slate-400 border border-slate-200 px-1 py-0.5 rounded">Soon</span>}
  </NavLink>
);

const Logo = () => (
  <div className="flex flex-col items-center">
    <div className="w-24 h-28 mb-2 relative">
      <svg viewBox="0 0 100 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'#f26522', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#d9531e', stopOpacity:1}} />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
            <feOffset dx="0.5" dy="0.5" result="offsetblur" />
            <feComponentTransfer><feFuncA type="linear" slope="0.2"/></feComponentTransfer>
            <feMerge> 
              <feMergeNode />
              <feMergeNode in="SourceGraphic" /> 
            </feMerge>
          </filter>
        </defs>
        <path d="M50 115 L38 60 Q50 55 62 60 L50 115 Z" fill="url(#orangeGrad)" filter="url(#shadow)" />
        <path d="M50 50 L35 35 L50 15 L65 35 Z" fill="#f26522" filter="url(#shadow)" />
        <path d="M50 50 L65 65 L80 50 L65 35 Z" fill="#f26522" filter="url(#shadow)" />
        <path d="M50 50 L35 65 L20 50 L35 35 Z" fill="#f26522" filter="url(#shadow)" />
        <path d="M50 50 L65 65 L50 85 L35 65 Z" fill="#f26522" filter="url(#shadow)" />
        <g transform="translate(36, 34) rotate(-45)" filter="url(#shadow)">
          <path d="M0 4 L-5 16 H5 L0 4 Z" fill="#39b54a" />
          <circle cx="0" cy="4" r="5" fill="#39b54a" />
        </g>
        <g transform="translate(64, 34) rotate(45)" filter="url(#shadow)">
          <path d="M0 4 L-5 16 H5 L0 4 Z" fill="#fff200" />
          <circle cx="0" cy="4" r="5" fill="#fff200" />
        </g>
        <g transform="translate(64, 66) rotate(135)" filter="url(#shadow)">
          <path d="M0 4 L-5 16 H5 L0 4 Z" fill="#0071bc" />
          <circle cx="0" cy="4" r="5" fill="#0071bc" />
        </g>
        <g transform="translate(36, 66) rotate(-135)" filter="url(#shadow)">
          <path d="M0 4 L-5 16 H5 L0 4 Z" fill="#ed1c24" />
          <circle cx="0" cy="4" r="5" fill="#ed1c24" />
        </g>
      </svg>
    </div>
    <div className="text-center space-y-0.5">
      <h1 className="text-lg font-black tracking-tight text-[#f26522] leading-[0.85] uppercase font-sans">
        PUZZLES<span className="text-[#f26522] opacity-60 font-medium ml-1">&</span><br/>GAMES
      </h1>
      <p className="text-[9px] font-bold text-[#f26522] opacity-80 font-mono tracking-tighter">www.puzzlesandgames.nl</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [games, setGames] = useState<Game[]>(MOCK_GAMES);
  const [editions, setEditions] = useState<Edition[]>(MOCK_EDITIONS);

  const login = (role: UserRole, name: string) => {
    setUser({
      id: 'u-1',
      name,
      email: `${role.toLowerCase().replace(' ', '.')}@puzzlesandgames.nl`,
      role
    });
  };

  const logout = () => setUser(null);

  const addGame = (game: Game) => setGames(prev => [...prev, game]);
  const addEdition = (edition: Edition) => setEditions(prev => [...prev, edition]);

  if (!user) {
    return <LoginView onLogin={login} />;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <div className="flex h-screen overflow-hidden">
          <aside className="w-64 bg-white border-r border-[#e8e4db] flex flex-col z-20">
            <div className="py-8">
              <div className="px-6 mb-10">
                <Logo />
              </div>
              
              <nav className="flex flex-col">
                <SidebarLink to="/dashboard" label="Studio Overview" icon={ICONS.Dashboard} />
                <SidebarLink to="/games" label="Games Library" icon={ICONS.Games} />
                <SidebarLink to="/editions" label="Edition Registry" icon={ICONS.Editions} />
                <SidebarLink to="/projects" label="Production Tracks" icon={ICONS.Projects} />
                
                <div className="mt-8 px-6 mb-2">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Workspace</p>
                </div>
                <SidebarLink to="/review-queue" label="Review Hub" icon={ICONS.Review} />
                <SidebarLink to="/production" label="Manufacturing" icon={ICONS.Production} />
                <SidebarLink to="/exports" label="Print Packs" icon={ICONS.Exports} />

                <div className="mt-auto pt-8" />
                <SidebarLink to="/settings" label="Portal Settings" icon={ICONS.Settings} />
              </nav>
            </div>
            
            <div className="mt-auto p-4 border-t border-[#f7f3ed] bg-[#fcfaf7]">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-[10px] font-bold text-[#f26522] border border-slate-200 shadow-sm font-serif italic uppercase">
                    {user.name.substring(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate">{user.name}</p>
                    <p className="text-[9px] text-slate-400 font-mono tracking-tighter uppercase">{user.role}</p>
                  </div>
                </div>
                <button onClick={logout} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
              </div>
            </div>
          </aside>

          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-16 bg-white border-b border-[#e8e4db] flex items-center justify-between px-10 z-10">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2 text-slate-500 cursor-pointer hover:text-[#f26522] transition-colors">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Global Management</span>
                  <ICONS.ChevronDown className="w-3 h-3" />
                </div>
                <div className="h-4 w-px bg-slate-200" />
                <div className="relative">
                  <ICONS.Search className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                  <input 
                    type="text" 
                    placeholder="Search Master Templates..." 
                    className="bg-transparent border-none pl-6 py-1 text-xs focus:ring-0 placeholder:text-slate-300 w-64 font-medium"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <button className="relative text-slate-400 hover:text-slate-800 transition-colors">
                  <ICONS.Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ed1c24] rounded-full ring-2 ring-white" />
                </button>
                {user.role === 'Lead Editor' && (
                  <button className="bg-[#f26522] text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#d9531e] transition-all shadow-md">
                    + Create Track
                  </button>
                )}
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-10">
              <div className="max-w-7xl mx-auto">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<DashboardView games={games} editions={editions} />} />
                  <Route path="/games" element={<GamesView games={games} onAddGame={addGame} />} />
                  <Route path="/games/:id" element={<GameDetailView games={games} editions={editions} onAddEdition={addEdition} />} />
                  <Route path="/editions" element={<EditionsView games={games} editions={editions} />} />
                  <Route path="/editions/:id" element={<EditionDetailView games={games} editions={editions} />} />
                  <Route path="/projects" element={<ProjectsView />} />
                  <Route path="/projects/:id/builder" element={<SetBuilderView />} />
                  <Route path="/projects/:projectId/round/:quizIdx/:roundIdx" element={<RoundEditorView />} />
                  <Route path="/production" element={<ProductionView />} />
                  <Route path="/review-queue" element={<ReviewQueueView />} />
                  <Route path="/exports" element={<ExportsView />} />
                  <Route path="/settings" element={<SettingsView />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
