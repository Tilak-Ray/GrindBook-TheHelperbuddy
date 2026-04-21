import React from 'react';
import { LayoutDashboard, Users, Zap, BookOpen, UserCircle, Target, LogOut, MessageSquare, Terminal, Video, Map, Box, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  user: any;
  onLogout: () => void;
  isMinimized?: boolean;
  setIsMinimized?: (value: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  setView, 
  user, 
  onLogout,
  isMinimized = false,
  setIsMinimized
}) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'GRIND_PAD' },
    { id: 'focus', icon: Zap, label: 'DEEP_FOCUS' },
    { id: 'base', icon: Box, label: 'THE_BASE' },
    { id: 'signals', icon: Video, label: 'SIGNALS' },
    { id: 'nearby', icon: Map, label: 'NEARBY_NODES' },
    { id: 'community', icon: Users, label: 'NETWORK' },
    { id: 'roadmaps', icon: BookOpen, label: 'PROTOCOLS' },
    { id: 'buddy', icon: MessageSquare, label: 'ASSISTANT' },
    { id: 'profile', icon: UserCircle, label: 'OPERATOR' },
  ];

  return (
    <div className={`h-full border-r border-[var(--tech-border)] hidden md:flex flex-col bg-[var(--tech-inner)] shrink-0 relative transition-all duration-500 ease-[0.23,1,0.32,1] ${isMinimized ? 'w-20' : 'w-20 lg:w-64'}`}>
      <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-[var(--tech-accent)] opacity-20 shadow-[0_0_10px_var(--tech-glow)]"></div>
      
      <div 
        className={`border-b border-[var(--tech-border)] cursor-pointer hover:bg-white/5 transition-all duration-300 ${isMinimized ? 'p-6 mb-2' : 'p-8 mb-4'}`}
        onClick={() => setIsMinimized?.(!isMinimized)}
      >
        <div className={`flex items-center mb-2 transition-all duration-300 ${isMinimized ? 'justify-center space-x-0' : 'space-x-3'}`}>
           <Terminal size={20} className="text-[var(--tech-accent)] shrink-0" />
           <h1 className={`text-xl font-black tracking-tighter text-[var(--tech-text-bright)] italic transition-all duration-300 ${isMinimized ? 'w-0 opacity-0 overflow-hidden' : 'lg:block hidden'}`}>GB_UNIT.01</h1>
        </div>
        <div className={`flex items-center space-x-1 transition-all duration-300 ${isMinimized ? 'h-0 opacity-0 overflow-hidden' : 'h-4 opacity-100'}`}>
           <div className="w-1 h-1 bg-[var(--tech-accent)] rounded-full animate-pulse shrink-0"></div>
           <p className={`text-[8px] uppercase font-mono text-[var(--tech-accent)] opacity-60 italic ${isMinimized ? 'hidden' : 'lg:block hidden'}`}>Architecture Active</p>
        </div>
      </div>

      <nav className={`flex-1 mt-6 space-y-4 transition-all duration-300 ${isMinimized ? 'px-2' : 'px-4'}`}>
        {navItems.map((item) => (
          <button
            key={`sidebar-${item.id}`}
            onClick={() => setView(item.id)}
            className={`w-full group relative flex items-center transition-all duration-300 border h-12 ${
              currentView === item.id 
                ? 'bg-[var(--tech-accent)]/10 border-[var(--tech-accent)]/30 text-[var(--tech-text-bright)] shadow-[0_0_15px_var(--tech-glow)]' 
                : 'border-transparent text-[var(--tech-text-dim)] hover:text-[var(--tech-text-bright)]'
            } ${isMinimized ? 'justify-center px-0' : 'px-4 space-x-4'}`}
          >
            {currentView === item.id && (
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--tech-accent)] tech-glow-text"></div>
            )}
            <item.icon size={18} className={`shrink-0 ${currentView === item.id ? 'text-[var(--tech-accent)]' : 'group-hover:text-[var(--tech-accent)] transition-colors'}`} />
            {!isMinimized && (
              <span className="font-black text-[9px] tracking-[0.2em] uppercase italic lg:block hidden truncate">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {!isMinimized && (
        <div className="hidden lg:block px-4 py-4 space-y-2 mb-2 transition-all duration-300">
           <div className="flex items-center space-x-2 text-[7px] font-black text-[var(--tech-text-dim)] uppercase tracking-widest border-b border-[var(--tech-border)] pb-2 mb-2">
              <Terminal size={10} />
              <span>SYST_LOGS // STREAM_01</span>
           </div>
           <div className="space-y-1 h-20 overflow-hidden font-mono text-[7px] leading-tight">
              <p className="text-[var(--tech-accent)] opacity-60">{">>"} NEURAL_LINK: STABLE [99.8%]</p>
              <p className="text-[var(--tech-text-dim)] opacity-40">{">>"} HANDSHAKE: COMPLETED CC.24</p>
              <p className="text-[var(--tech-accent)] opacity-80 tech-pulse">{">>"} INCOMING_SIGNAL: DETECTED</p>
              <p className="text-[var(--tech-text-dim)] opacity-60">{">>"} ARCH_SYNC: SUCCESSFUL</p>
              <p className="text-[var(--tech-text-dim)] opacity-80">{">>"} BUFFER_CLEARED...</p>
           </div>
        </div>
      )}

      <div className="mt-auto p-4 border-t border-[var(--tech-border)] bg-[var(--tech-indent-bg)]">
        <div className={`flex items-center space-x-3 mb-6 p-2 rounded border border-[var(--tech-border)] bg-[var(--tech-inner)]/40 transition-all duration-300 ${isMinimized ? 'hidden' : 'lg:flex hidden'}`}>
          <div className="w-10 h-10 rounded-full bg-[var(--tech-bg)] flex items-center justify-center overflow-hidden border-2 border-[var(--tech-accent)] opacity-60 shrink-0">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-full h-full object-cover grayscale brightness-125" referrerPolicy="no-referrer" />
            ) : (
              <UserCircle size={22} className="text-[var(--tech-text-dim)]" />
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-black text-[var(--tech-text-bright)] truncate uppercase tracking-widest italic">{user?.displayName || 'OPERATOR'}</p>
            <div className="flex items-center space-x-1">
               <span className="w-1 h-1 bg-[var(--tech-accent)] rounded-full"></span>
               <p className="text-[8px] text-[var(--tech-accent)] font-black">LVL {user?.stats?.level || 1}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className={`w-full text-zinc-500 hover:text-red-500 flex items-center transition-all duration-300 border border-transparent hover:border-red-500/20 py-3 ${isMinimized ? 'justify-center px-0' : 'px-4 space-x-3'}`}
        >
          <LogOut size={16} className="shrink-0" />
          {!isMinimized && (
            <span className="text-[9px] font-black uppercase tracking-widest italic lg:block hidden">TERMINATE</span>
          )}
        </button>
      </div>
    </div>
  );
};
