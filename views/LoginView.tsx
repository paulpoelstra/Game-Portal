
import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginViewProps {
  onLogin: (role: UserRole, name: string) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent, roleOverride?: UserRole) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API delay
    setTimeout(() => {
      // Check for specific admin credentials requested by user
      if (!roleOverride && email === 'paul@thebuzzstation.com' && password === '120373pp') {
        onLogin('Lead Editor', 'Paul');
      } else if (roleOverride) {
        // Handle quick-login buttons for testing
        onLogin(roleOverride, roleOverride === 'Lead Editor' ? 'Sarah Miller' : 'Guest Editor');
      } else {
        // Basic fallback for standard demo login if requested credentials don't match
        if (email.includes('@puzzlesandgames.nl')) {
          onLogin('Editor', 'Staff Member');
        } else {
          setError('Invalid credentials. Please use the authorized administrator account.');
          setIsLoading(false);
          return;
        }
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#fcfaf7]">
      <div className="w-full max-w-md space-y-12">
        {/* Large Branded Logo */}
        <div className="flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="w-32 h-36 mb-4">
              <svg viewBox="0 0 100 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#f26522', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#d9531e', stopOpacity:1}} />
                  </linearGradient>
                </defs>
                <path d="M50 115 L38 60 Q50 55 62 60 L50 115 Z" fill="url(#orangeGrad)" />
                <path d="M50 50 L35 35 L50 15 L65 35 Z" fill="#f26522" />
                <path d="M50 50 L65 65 L80 50 L65 35 Z" fill="#f26522" />
                <path d="M50 50 L35 65 L20 50 L35 35 Z" fill="#f26522" />
                <path d="M50 50 L65 65 L50 85 L35 65 Z" fill="#f26522" />
                <g transform="translate(36, 34) rotate(-45)">
                  <path d="M0 4 L-5 16 H5 L0 4 Z" fill="#39b54a" />
                  <circle cx="0" cy="4" r="5" fill="#39b54a" />
                </g>
                <g transform="translate(64, 34) rotate(45)">
                  <path d="M0 4 L-5 16 H5 L0 4 Z" fill="#fff200" />
                  <circle cx="0" cy="4" r="5" fill="#fff200" />
                </g>
                <g transform="translate(64, 66) rotate(135)">
                  <path d="M0 4 L-5 16 H5 L0 4 Z" fill="#0071bc" />
                  <circle cx="0" cy="4" r="5" fill="#0071bc" />
                </g>
                <g transform="translate(36, 66) rotate(-135)">
                  <path d="M0 4 L-5 16 H5 L0 4 Z" fill="#ed1c24" />
                  <circle cx="0" cy="4" r="5" fill="#ed1c24" />
                </g>
              </svg>
           </div>
           <h1 className="text-3xl font-black tracking-tight text-[#f26522] text-center uppercase">
             Studio Admin Portal
           </h1>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Puzzles & Games Publishing House</p>
        </div>

        <form onSubmit={(e) => handleSubmit(e)} className="bg-white p-10 rounded-3xl border border-[#e8e4db] shadow-xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="editor@puzzlesandgames.nl" 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-1 focus:ring-[#f26522] transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Key</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-1 focus:ring-[#f26522] transition-all"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
              <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider text-center">{error}</p>
            </div>
          )}

          <div className="pt-4 space-y-4">
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Access Studio Management</span>
              )}
            </button>
            
            <div className="flex items-center justify-center space-x-4 opacity-50">
               <button type="button" onClick={(e) => handleSubmit(e, 'Editor')} className="text-[9px] font-black text-slate-400 uppercase hover:text-slate-600 underline">Login as Editor</button>
               <span className="text-slate-200">|</span>
               <button type="button" onClick={(e) => handleSubmit(e, 'Viewer')} className="text-[9px] font-black text-slate-400 uppercase hover:text-slate-600 underline">Login as Viewer</button>
            </div>
          </div>
        </form>

        <p className="text-center text-[9px] font-bold text-slate-300 uppercase tracking-widest">
          Authorized Personnel Only • © 2025 Puzzles & Games B.V.
        </p>
      </div>
    </div>
  );
};

export default LoginView;
