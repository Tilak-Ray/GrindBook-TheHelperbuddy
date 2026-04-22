import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TaskPad } from './components/TaskPad';
import { DeepFocus } from './components/DeepFocus';
import { CommunityFeed } from './components/CommunityFeed';
import { SignalFeed } from './components/SignalFeed';
import { NodeDiscovery } from './components/NodeDiscovery';
import { NeuralOutpost } from './components/NeuralOutpost';
import { WorldGrid } from './components/WorldGrid';
import { GrindBot } from './components/GrindBot';
import { Roadmaps } from './components/Roadmaps';
import { Profile } from './components/Profile';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster, toast } from 'sonner';
import { logger } from './lib/logger';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Trophy, TrendingUp, Calendar, ArrowRight, UserPlus, LogIn, BookOpen, Globe, Search, Bell, Home, 
  Users, MessageSquare, UserCircle, Shield, Cpu, Activity, Terminal, Lock, Sun, Moon, Bot, Menu, X, Video, Map, Box
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { auth } from './lib/firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut,
  applyActionCode 
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './lib/firebase';
import { getOrCreateUserProfile } from './lib/db';

const chartData = [
  { name: 'MON', value: 400 },
  { name: 'TUE', value: 300 },
  { name: 'WED', value: 500 },
  { name: 'THU', value: 200 },
  { name: 'FRI', value: 600 },
  { name: 'SAT', value: 450 },
  { name: 'SUN', value: 700 },
];

function App() {
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Handle Firebase Auth Actions (Email Verification, Password Reset)
  useEffect(() => {
    const handleAuthActions = async () => {
      // Add a tiny delay to ensure parameters are fully indexed by the browser engine
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const urlParams = new URLSearchParams(window.location.search);
      const mode = urlParams.get('mode');
      const oobCode = urlParams.get('oobCode');

      if (mode && oobCode) {
        logger.info('System: Verification sequence detected', { mode });
        try {
          if (mode === 'verifyEmail' || mode === 'verifyAndChangeEmail' || mode === 'action') {
            await applyActionCode(auth, oobCode);
            logger.info('System: Signature verified successfully');
            toast.success('SIGNATURE_VERIFIED', {
              description: 'Your biological credentials have been authenticated. Neural link secured.',
            });
            // Clean URL from parameters
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          } else if (mode === 'resetPassword') {
            logger.info('System: Password reset operation pending');
            toast.info('DECRYPTION_INITIATED', {
              description: 'Passcode reset procedure detected.',
            });
          }
        } catch (error: any) {
          // Check for expired code specifically
          const isExpired = error.code === 'auth/expired-action-code';
          logger.error('System: Protocol breach in verification sequence', { mode, code: error.code });
          
          toast.error(isExpired ? 'LINK_EXPIRED' : 'PROTOCOL_BREACH', {
            description: isExpired 
              ? 'This authentication sequence has expired. Generate a new dispatch in your profile.' 
              : error.message || 'The verification sequence failed.',
          });
        }
      }
    };

    handleAuthActions();
  }, []);

  useEffect(() => {
    let profileUnsubscribe: () => void = () => {};
    
    const authUnsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // Subscribe to real-time profile updates
        const userRef = doc(db, 'users', authUser.uid);
        profileUnsubscribe = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const profileData = snapshot.data();
            setUser({ ...authUser, ...profileData });
            setIsLoggedIn(true);
          } else {
            // First time login - profile might not exist yet
            getOrCreateUserProfile(authUser).then(profile => {
               setUser({ ...authUser, ...profile });
               setIsLoggedIn(true);
            });
          }
          setLoading(false);
        });
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setLoading(false);
        profileUnsubscribe();
      }
    });

    return () => {
      authUnsubscribe();
      profileUnsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      logger.info('Initiating authentication handshake');
      await signInWithPopup(auth, provider);
      toast.success('Authentication Successful', {
        description: 'Biolink established. Profile synchronized.',
      });
    } catch (error: any) {
      logger.error("Authentication failed", { error });
      toast.error('Handshake Failed', {
        description: error.message || 'The authentication relay is unresponsive.',
      });
    }
  };

  const handleLogout = async () => {
    try {
      logger.info('Terminating active session');
      await signOut(auth);
      toast.info('Session Terminated', {
        description: 'Biolink closed. Neural status: Dormant.',
      });
    } catch (error: any) {
      logger.error("Sign out failed", { error });
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[var(--tech-bg)] flex flex-col items-center justify-center space-y-4">
        <Activity className="text-[var(--tech-accent)] animate-spin" size={40} />
        <p className="font-mono text-[10px] text-[var(--tech-accent)] tracking-[0.5em] tech-pulse">SYNCHRONIZING_BIOMETRICS...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="h-screen w-screen bg-[var(--tech-indent-bg)] flex flex-col items-center justify-center font-sans overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--tech-glow),transparent)] pointer-events-none opacity-20"></div>
        
        <div className="tech-panel p-12 bg-[var(--tech-inner)] border-[var(--tech-border)] max-w-xl w-full relative z-10 mx-4">
          <div className="absolute top-6 right-6">
             <button 
              onClick={toggleTheme}
              className="p-3 tech-btn border-transparent flex items-center justify-center shadow-none bg-transparent hover:border-[var(--tech-accent)] transition-all"
            >
              {theme === 'dark' ? <Sun size={18} className="text-[var(--tech-accent)]" /> : <Moon size={18} className="text-[var(--tech-accent)]" />}
            </button>
          </div>

          <div className="flex items-center space-x-3 mb-12 border-b border-[var(--tech-border)] pb-8">
             <Terminal size={32} className="text-[var(--tech-accent)]" />
             <div>
                <h1 className="text-3xl font-black text-[var(--tech-text-bright)] tracking-tighter uppercase italic">GRINDBOOK_OS</h1>
                <p className="text-[10px] font-mono text-[var(--tech-text-dim)] uppercase tracking-widest mt-1">Terminal.Architecture.01</p>
             </div>
          </div>

          <div className="space-y-8 mb-12">
             <div className="flex items-start space-x-6 group">
                <div className="w-12 h-12 bg-black flex items-center justify-center shrink-0 border border-[var(--tech-border)] group-hover:border-[var(--tech-accent)] transition-all">
                   <Lock size={20} className="text-zinc-500 group-hover:text-[var(--tech-accent)]" />
                </div>
                <div>
                   <h3 className="text-xs font-black text-[var(--tech-text-bright)] uppercase tracking-widest mb-1">Encrypted_Focus</h3>
                   <p className="text-[11px] text-[var(--tech-text-dim)] leading-relaxed uppercase tracking-wider">Biometric time-tracking and architectural task management.</p>
                </div>
             </div>
             <div className="flex items-start space-x-6 group">
                <div className="w-12 h-12 bg-black flex items-center justify-center shrink-0 border border-[var(--tech-border)] group-hover:border-[var(--tech-accent)] transition-all">
                   <Globe size={20} className="text-zinc-500 group-hover:text-[var(--tech-accent)]" />
                </div>
                <div>
                   <h3 className="text-xs font-black text-[var(--tech-text-bright)] uppercase tracking-widest mb-1">Global_Sync</h3>
                   <p className="text-[11px] text-[var(--tech-text-dim)] leading-relaxed uppercase tracking-wider">Real-time networking with top-tier operators worldwide.</p>
                </div>
             </div>
          </div>

          <button 
            onClick={handleLogin}
            className="w-full tech-btn tech-btn-active flex items-center justify-center space-x-4 py-5 hover:border-[var(--tech-accent)] group transition-all"
          >
            <LogIn size={20} />
            <span className="font-black italic">INITIATE_HANDSHAKE</span>
          </button>
          
          <div className="mt-8 pt-8 border-t border-[var(--tech-border)] flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="flex items-center space-x-2">
                <Shield size={12} className="text-[var(--tech-accent)] opacity-40" />
                <p className="text-[8px] font-mono text-[var(--tech-text-dim)] uppercase tracking-[0.2em]">Secure_Link_Established</p>
             </div>
             <p className="text-[8px] font-mono text-[var(--tech-text-dim)] uppercase tracking-[0.2em]">Ver_2.0.4 - Built_by_GB</p>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return (
          <div className="space-y-6 md:space-y-8 pb-32">
            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                <div className="tech-panel p-6 md:p-8 bg-[var(--tech-inner)]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-10 gap-4">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black text-[var(--tech-text-bright)] tracking-tighter uppercase mb-2">Neural_Status</h2>
                      <p className="text-[8px] md:text-[9px] font-mono text-[var(--tech-text-dim)] uppercase tracking-[0.3em]">Execution metrics for current cycle.</p>
                    </div>
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-4 border-[var(--tech-border)] border-t-[var(--tech-accent)] flex items-center justify-center tech-pulse self-start sm:self-center">
                       <span className="text-xs font-black text-[var(--tech-text-bright)]">{user?.stats?.streak || 0}</span>
                    </div>
                  </div>
                  <div className="h-48 md:h-64 w-full min-w-[250px]">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--tech-border)" />
                        <XAxis dataKey="name" fontSize={9} axisLine={false} tickLine={false} stroke="var(--tech-text-dim)" />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ background: 'var(--tech-indent-bg)', border: '1px solid var(--tech-border)', borderRadius: '4px', fontSize: '10px', color: 'var(--tech-text)' }}
                          cursor={{ fill: 'var(--tech-glow)', opacity: 0.1 }}
                        />
                        <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                           {chartData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={index === 4 ? 'var(--tech-accent)' : 'var(--tech-border)'} />
                           ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <TaskPad userId={user?.uid} />
              </div>
              
              <div className="space-y-8">
                <div className="tech-panel p-6 bg-[var(--tech-indent-bg)] overflow-hidden">
                   <h3 className="text-[10px] font-black text-[var(--tech-accent)] uppercase tracking-[0.4em] mb-6 tech-glow-text truncate">Objective_Sync</h3>
                   <div className="flex items-center space-x-5 p-4 bg-black/10 border border-[var(--tech-border)] min-w-0">
                      <div className="w-12 h-12 bg-black/20 flex items-center justify-center shrink-0 border border-[var(--tech-border)]">
                         <Cpu size={20} className="text-[var(--tech-accent)]" />
                      </div>
                      <div className="min-w-0 flex-1">
                         <p className="text-[11px] font-black text-[var(--tech-text-bright)] uppercase tracking-widest italic truncate">Foundation_Protocol</p>
                         <p className="text-[9px] text-[var(--tech-accent)] font-bold mt-1 truncate">LVL {user?.stats?.level}.0{user?.stats?.tasksCompleted}</p>
                      </div>
                   </div>
                </div>

                <div className="tech-panel p-6 bg-[var(--tech-inner)] border-[var(--tech-border)]">
                   <div className="flex items-center justify-between mb-6">
                      <h3 className="text-[10px] font-black text-[var(--tech-text-dim)] uppercase tracking-[0.4em] italic truncate">Neural_Monitor</h3>
                      <div className="flex space-x-1">
                         {[...Array(3)].map((_, i) => (
                           <div key={i} className="w-1.5 h-1.5 bg-[var(--tech-accent)] tech-pulse" style={{ animationDelay: `${i * 0.5}s` }}></div>
                         ))}
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between text-[8px] font-mono uppercase tracking-widest">
                         <span className="text-[var(--tech-text-dim)]">SYST_LOAD</span>
                         <span className="text-[var(--tech-accent)]">{(Math.random() * 20 + 40).toFixed(1)}%</span>
                      </div>
                      <div className="h-1 bg-black/20 overflow-hidden">
                         <div className="h-full bg-[var(--tech-accent)]/40 w-2/3"></div>
                      </div>
                      <div className="flex items-center justify-between text-[8px] font-mono uppercase tracking-widest">
                         <span className="text-[var(--tech-text-dim)]">NETWORK_STABILITY</span>
                         <span className="text-[var(--tech-accent)]">99.8%</span>
                      </div>
                      <div className="h-1 bg-black/20 overflow-hidden">
                         <div className="h-full bg-[var(--tech-accent)] w-[99.8%]"></div>
                      </div>
                   </div>
                </div>

                <WorldGrid user={user} />
              </div>
            </div>
          </div>
        );
      case 'focus': return <DeepFocus />;
      case 'signals': return <SignalFeed />;
      case 'nearby': return <NodeDiscovery />;
      case 'base': return <NeuralOutpost user={user} />;
      case 'community': return <CommunityFeed />;
      case 'roadmaps': return <Roadmaps userId={user?.uid} />;
      case 'buddy': return <GrindBot user={user} />;
      case 'profile': return <Profile user={user} />;
      default: return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-[var(--tech-bg)] text-[var(--tech-text)] font-sans selection:bg-[var(--tech-accent)]/30 overflow-hidden transition-colors duration-500">
        <Toaster 
          theme="dark" 
          position="top-right" 
          toastOptions={{
            className: 'tech-panel border-[var(--tech-border)] bg-[var(--tech-inner)] text-[var(--tech-text-bright)] font-mono text-[10px]',
          }}
        />
      <div className="hidden md:block">
        <Sidebar 
          currentView={view} 
          setView={setView} 
          user={user} 
          onLogout={handleLogout}
          isMinimized={isSidebarMinimized}
          setIsMinimized={setIsSidebarMinimized}
        />
      </div>
      
      <main className="flex-1 flex flex-col min-w-0 bg-[var(--tech-bg)]/50 backdrop-blur-3xl relative">
        {/* Modern Tactical Header (Facebook Style) */}
        <header className="h-14 md:h-20 border-b border-[var(--tech-border)] flex items-center justify-between px-4 md:px-10 bg-[var(--tech-inner)] sticky top-0 z-50">
          <div className="flex items-center space-x-3 min-w-0">
            {view === 'buddy' ? (
              <Bot size={20} className="text-[var(--tech-accent)] md:hidden" />
            ) : (
              <Terminal size={20} className="text-[var(--tech-accent)] md:hidden" />
            )}
            <h2 className="text-xl md:text-[12px] font-black text-[var(--tech-text-bright)] md:text-[var(--tech-text-bright)] uppercase tracking-tighter md:tracking-[0.4em] font-mono truncate">
              {view === 'dashboard' ? 'GRINDBOOK' : view === 'buddy' ? 'NEURAL_CONSULTANT' : view.toUpperCase()}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-8">
            {/* Minimalist Pill Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`w-11 h-6 md:w-14 md:h-7 rounded-full relative p-1 transition-all duration-500 flex items-center overflow-hidden border ${theme === 'dark' ? 'bg-black border-white/10' : 'bg-zinc-200 border-black/5'}`}
            >
              <motion.div 
                animate={{ x: theme === 'dark' ? (window.innerWidth < 768 ? 20 : 28) : 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className={`w-4 h-4 md:w-5 md:h-5 rounded-full shadow-lg relative z-10 flex items-center justify-center ${theme === 'dark' ? 'bg-white' : 'bg-black'}`}
              >
                {theme === 'dark' ? (
                  <Moon size={10} className="text-black" />
                ) : (
                  <Sun size={10} className="text-white" />
                )}
              </motion.div>
            </button>

            <div className="hidden md:flex items-center bg-[var(--tech-indent-bg)] px-4 py-2 border border-[var(--tech-border)] transition-all focus-within:border-[var(--tech-accent)]/40">
              <Search size={14} className="text-[var(--tech-text-dim)]" />
              <input 
                type="text" 
                placeholder="PROBE_NETWORK..." 
                className="bg-transparent text-[10px] font-bold uppercase tracking-widest ml-3 outline-none w-48 placeholder:text-zinc-800" 
              />
            </div>
            
            <button className="md:hidden p-2 text-zinc-500 hover:text-[var(--tech-accent)] transition-colors">
              <Search size={20} />
            </button>

            <div className="flex items-center space-x-2 md:space-x-4">
               <button className="p-2 md:p-3 text-zinc-500 hover:text-[var(--tech-accent)] transition-colors relative group">
                  <div className="absolute top-2 right-2 w-1 h-1 bg-[var(--tech-accent)] rounded-full group-hover:scale-150 transition-transform"></div>
                  <Bell size={18} />
               </button>
               <div className="w-[1px] h-6 bg-[var(--tech-border)]"></div>
               {isLoggedIn ? (
                 <button 
                   onClick={() => setView('profile')}
                   className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-[var(--tech-accent)]/20 hover:border-[var(--tech-accent)] transition-all"
                 >
                    <img src={user?.photoURL} alt="User" className="w-full h-full object-cover grayscale brightness-125" referrerPolicy="no-referrer" />
                 </button>
               ) : (
                 <button onClick={handleLogin} className="p-2 text-[var(--tech-accent)]">
                   <LogIn size={20} />
                 </button>
               )}
            </div>
          </div>
        </header>

        {/* Top-Tab Navigation (Facebook Style - Mobile Only) */}
        <nav className="md:hidden flex h-14 bg-[var(--tech-inner)] border-b border-[var(--tech-border)] sticky top-14 z-40">
          <button 
            onClick={() => setView('dashboard')} 
            className={`flex-1 flex items-center justify-center relative transition-colors ${view === 'dashboard' ? 'text-[var(--tech-accent)]' : 'text-zinc-600'}`}
          >
            <Home size={22} strokeWidth={view === 'dashboard' ? 2.5 : 2} />
            {view === 'dashboard' && <motion.div layoutId="mobileTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--tech-accent)] shadow-[0_-4px_10px_var(--tech-glow)]" />}
          </button>
          <button 
            onClick={() => setView('community')} 
            className={`flex-1 flex items-center justify-center relative transition-colors ${view === 'community' ? 'text-[var(--tech-accent)]' : 'text-zinc-600'}`}
          >
            <Users size={22} strokeWidth={view === 'community' ? 2.5 : 2} />
            {view === 'community' && <motion.div layoutId="mobileTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--tech-accent)] shadow-[0_-4px_10px_var(--tech-glow)]" />}
          </button>
          <button 
            onClick={() => setView('buddy')} 
            className={`flex-1 flex items-center justify-center relative transition-colors ${view === 'buddy' ? 'text-[var(--tech-accent)]' : 'text-zinc-600'}`}
          >
            <Bot size={22} strokeWidth={view === 'buddy' ? 2.5 : 2} />
            {view === 'buddy' && <motion.div layoutId="mobileTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--tech-accent)] shadow-[0_-4px_10px_var(--tech-glow)]" />}
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(true)} 
            className={`flex-1 flex items-center justify-center relative transition-colors ${isMobileMenuOpen ? 'text-[var(--tech-accent)]' : 'text-zinc-600'}`}
          >
            <Menu size={22} />
          </button>
        </nav>

        {/* Mobile Slide-over Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 w-3/4 max-w-[300px] bg-[var(--tech-inner)] border-l border-[var(--tech-border)] z-[70] md:hidden flex flex-col"
              >
                <div className="h-14 border-b border-[var(--tech-border)] flex items-center justify-between px-6">
                   <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[var(--tech-text-dim)] italic">Tactical_Menu</span>
                   <button onClick={() => setIsMobileMenuOpen(false)} className="text-zinc-500">
                      <X size={20} />
                   </button>
                </div>
                
                <div className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
                    {[
                      { id: 'focus', icon: Zap, label: 'DEEP_FOCUS' },
                      { id: 'base', icon: Box, label: 'THE_BASE' },
                      { id: 'signals', icon: Video, label: 'SIGNALS' },
                      { id: 'nearby', icon: Map, label: 'NEARBY_NODES' },
                      { id: 'roadmaps', icon: BookOpen, label: 'PROTOCOLS' },
                      { id: 'profile', icon: UserCircle, label: 'OPERATOR_SYNC' },
                    ].map((item) => (
                     <button
                       key={`mobmenu-${item.id}`}
                       onClick={() => {
                         setView(item.id);
                         setIsMobileMenuOpen(false);
                       }}
                       className={`w-full flex items-center space-x-4 p-4 border transition-all ${
                         view === item.id 
                           ? 'bg-[var(--tech-accent)]/10 border-[var(--tech-accent)]/30 text-[var(--tech-text-bright)] active-menu-glow' 
                           : 'border-transparent text-zinc-500 hover:text-white'
                       }`}
                     >
                       <item.icon size={18} className={view === item.id ? 'text-[var(--tech-accent)]' : ''} />
                       <span className="text-[10px] font-black tracking-[0.2em] uppercase italic">{item.label}</span>
                     </button>
                   ))}
                </div>

                <div className="p-6 border-t border-[var(--tech-border)] bg-[var(--tech-indent-bg)]">
                   <button 
                    onClick={handleLogout}
                    className="w-full py-4 border border-red-500/20 text-red-500/60 flex items-center justify-center space-x-3 hover:bg-red-500/5 transition-all"
                   >
                      <Shield size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest italic">TERMINATE_SESSION</span>
                   </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className={`flex-1 ${view === 'buddy' || view === 'signals' ? 'overflow-hidden' : 'overflow-y-auto p-4 md:p-12'} custom-scrollbar relative z-10 scroll-smooth flex flex-col`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col min-h-0 min-w-0"
            >
              <div className={`max-w-6xl mx-auto w-full flex-1 flex flex-col min-h-0 ${view === 'buddy' || view === 'signals' ? 'h-full' : ''}`}>
                {renderContent()}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
    </ErrorBoundary>
  );
}

export default App;
