import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Globe, MapPin, Edit3, Save, Zap, Trophy, Flame, Github, Twitter, Link as LinkIcon, Shield, Target, QrCode, BarChart3, Fingerprint, LogOut } from 'lucide-react';
import { updateUserProfile, subscribeToPosts } from '../lib/db';
import { auth } from '../lib/firebase';
import { signOut, sendEmailVerification } from 'firebase/auth';
import { toast } from 'sonner';

interface ProfileProps {
  user: any;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || 'Initializing neural baseline...');
  const [location, setLocation] = useState(user?.location || 'Digital Nomad');
  const [website, setWebsite] = useState(user?.website || 'https://grindbook.io');
  const [userPosts, setUserPosts] = useState<any[]>([]);

  const userId = user?.uid;

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = subscribeToPosts((allPosts) => {
      setUserPosts(allPosts.filter(p => p.authorId === userId));
    });
    return () => unsubscribe();
  }, [userId]);

  const handleSave = async () => {
    if (!userId) return;
    try {
      await updateUserProfile(userId, { bio, location, website });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const handleResendVerification = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        toast.success('LINK_DISPATCHED', {
          description: 'A new authentication sequence has been sent to your primary node.',
        });
      } catch (error: any) {
        toast.error('DISPATCH_ERROR', {
          description: error.message || 'The verification relay failed to transmit.',
        });
      }
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto pb-32 px-4 md:px-0">
      <AnimatePresence mode="wait">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="relative group mb-20"
        >
          {/* Main Tactical ID Card */}
          <div className="tech-metal tech-corner-notch p-1 md:p-2 relative z-10 transition-all duration-700 hover:shadow-[0_0_50px_rgba(var(--tech-glow-color),0.15)]">
            <div className="bg-[#1a1c1e] tech-corner-notch p-6 md:p-10 relative overflow-hidden">
              
              {/* Technical Grain Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/brushed-alum.png')` }}></div>

              {/* Top Header Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start mb-8 relative z-10 gap-6 sm:gap-0">
                <div className="space-y-1">
                  <p className="text-[8px] md:text-[10px] font-mono text-[var(--tech-accent)] font-bold tracking-[0.2em] md:tracking-[0.4em] uppercase opacity-60">Neural_ID_Protocol // OPERATOR_REGISTRY</p>
                  <h2 className="text-2xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">{user.displayName}</h2>
                  <div className="flex items-center space-x-2 pt-2">
                    <div className="w-12 h-1 bg-[var(--tech-accent)] flex space-x-1 p-0.5">
                      <div className="w-1/3 h-full bg-white/20"></div>
                    </div>
                    <span className="text-[8px] md:text-[9px] font-mono font-black text-white/40 tracking-widest uppercase">Direct_Access_Granted</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-start">
                  {/* Log Out Option (New) */}
                  <button 
                    onClick={handleLogout}
                    className="tech-panel p-2.5 md:p-3 bg-black/40 border-[var(--tech-border)] text-red-500/60 hover:text-red-500 hover:border-red-500/40 transition-all group"
                    title="Terminate Session"
                  >
                    <LogOut size={16} className="group-hover:scale-110 transition-transform" />
                  </button>

                  <div className="relative group">
                    <div className="tech-badge-pill px-5 md:px-8 py-2.5 md:py-3 rounded-full relative z-10 flex items-center justify-center transform -rotate-2 group-hover:rotate-0 transition-transform duration-500">
                      <span className="text-lg md:text-2xl font-black text-[#1a1c1e] italic tracking-tighter shrink-0">LV.{user.stats?.level || 1 < 10 ? `0${user.stats?.level || 1}` : user.stats?.level || 1}</span>
                    </div>
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl scale-150 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Main Card Body */}
              <div className="flex flex-col md:flex-row gap-10 relative z-10">
                {/* Photo Module (Refined Size - md:w-56) */}
                <div className="w-full md:w-56 space-y-4 shrink-0">
                  <div className="aspect-[4/5] tech-indent p-2 bg-[#0f1112] relative overflow-hidden group border border-white/5">
                    <div className="relative h-full w-full bg-[#1a1c1e] overflow-hidden flex items-center justify-center">
                       <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/30 via-transparent to-transparent opacity-60 mix-blend-overlay"></div>
                       <img 
                        src={user.photoURL || `https://picsum.photos/seed/${user.uid}/500/700`} 
                        alt={user.displayName} 
                        className="w-full h-full object-cover grayscale brightness-110 contrast-125 transition-transform duration-700 group-hover:scale-110" 
                        referrerPolicy="no-referrer" 
                       />
                       <div className="absolute bottom-4 right-4 flex flex-col items-end">
                          <p className="text-[7px] font-mono text-white/40 uppercase tracking-tighter">ID_SYNC</p>
                          <p className="text-[8px] font-mono text-white italic font-bold">ALPHA_SEC</p>
                       </div>
                       
                       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--tech-accent)]/10 to-transparent h-20 w-full tech-pulse pointer-events-none"></div>
                    </div>

                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="absolute bottom-6 left-6 p-2.5 bg-[var(--tech-accent)] text-black rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 active:scale-95"
                    >
                      <Fingerprint size={18} />
                    </button>
                  </div>
                  
                  <div className="tech-indent p-5 bg-[var(--tech-inner)]/40 min-h-[90px] border border-[var(--tech-border)]">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[7px] font-mono text-[var(--tech-accent)] uppercase tracking-widest font-black italic">Operator_Notes</span>
                       <Fingerprint size={10} className="text-[var(--tech-text)]/20" />
                    </div>
                    {isEditing ? (
                      <textarea 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full bg-transparent text-[10px] text-[var(--tech-text-bright)] font-bold uppercase tracking-widest outline-none resize-none border-b border-[var(--tech-border)]"
                      />
                    ) : (
                      <p className="text-[9px] text-[var(--tech-text)]/80 font-bold uppercase tracking-widest leading-relaxed italic">{bio}</p>
                    )}
                  </div>
                </div>

                {/* Technical Stats & Connectivity Mod */}
                <div className="flex-1 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="tech-indent p-5 bg-[var(--tech-inner)]/20 group hover:bg-[var(--tech-inner)]/30 transition-all border-l-2 border-[var(--tech-accent)]/20">
                       <p className="text-[7px] font-black text-[var(--tech-text-dim)] uppercase tracking-widest mb-1.5">Persistence_Rating</p>
                       <div className="flex items-end justify-between">
                          <span className="text-2xl font-black text-[var(--tech-text-bright)] italic leading-none">{user.stats?.streak || 0}d</span>
                          <Flame size={16} className="text-[var(--tech-accent)] tech-pulse" />
                       </div>
                    </div>
                    <div className="tech-indent p-5 bg-[var(--tech-inner)]/20 group hover:bg-[var(--tech-inner)]/30 transition-all border-l-2 border-indigo-500/20">
                       <p className="text-[7px] font-black text-[var(--tech-text-dim)] uppercase tracking-widest mb-1.5">Extraction_Success</p>
                       <div className="flex items-end justify-between">
                          <span className="text-2xl font-black text-[var(--tech-text-bright)] italic leading-none">{user.stats?.tasksCompleted || 0}u</span>
                          <Trophy size={16} className="text-indigo-400" />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[8px] font-black text-[var(--tech-text-dim)] uppercase tracking-widest">
                       <span>Synchronization_Link</span>
                       <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-[var(--tech-accent)]"></div>
                          <div className="w-2 h-2 bg-[var(--tech-accent)] opacity-40"></div>
                       </div>
                    </div>
                    <div className="space-y-2">
                       {[
                         { icon: Mail, value: user.email, label: 'Encrypted_Mail', verified: user.emailVerified },
                         { icon: MapPin, value: location, label: 'Physical_Node', edit: true, state: setLocation },
                         { icon: Globe, value: website, label: 'Global_Alias', edit: true, state: setWebsite },
                       ].map((link, idx) => (
                         <div key={idx} className="flex items-center justify-between p-4 bg-black/20 border border-white/5 hover:border-[var(--tech-accent)]/20 transition-all">
                            <div className="flex items-center space-x-3">
                               <link.icon size={14} className="text-white/40" />
                               <div className="flex flex-col">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-[6px] font-mono text-white/20 uppercase font-black">{link.label}</span>
                                    {link.label === 'Encrypted_Mail' && (
                                      <span className={`text-[6px] font-black italic px-1 rounded ${link.verified ? 'text-[var(--tech-accent)] bg-[var(--tech-accent)]/10' : 'text-red-500 bg-red-500/10'}`}>
                                        {link.verified ? 'SECURE' : 'UNVERIFIED'}
                                      </span>
                                    )}
                                  </div>
                                  {isEditing && link.edit ? (
                                    <input value={link.value} onChange={(e) => link.state!(e.target.value)} className="bg-transparent text-[10px] text-white font-bold outline-none border-b border-white/10" />
                                  ) : (
                                    <div className="flex items-center space-x-3">
                                      <span className="text-[10px] text-white/70 font-black uppercase tracking-widest truncate max-w-[200px]">{link.value}</span>
                                      {link.label === 'Encrypted_Mail' && !link.verified && (
                                        <button 
                                          onClick={handleResendVerification}
                                          className="text-[8px] font-black text-[var(--tech-accent)] border-b border-[var(--tech-accent)]/30 hover:border-[var(--tech-accent)] transition-all"
                                        >
                                          RETRY_DISPATCH
                                        </button>
                                      )}
                                    </div>
                                  )}
                               </div>
                            </div>
                            <div className="flex space-x-0.5">
                               {[1,2,3].map(i => <div key={i} className={`w-0.5 h-3 bg-[var(--tech-accent)] ${i > 1 ? 'opacity-20' : ''}`}></div>)}
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* QR / Barcode Module (Bottom corner inspired by Image 1) */}
                  <div className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-6 sm:gap-0">
                     <div className="flex-1 pr-0 sm:pr-6 w-full sm:w-auto">
                        <div className="h-6 w-full tech-qr-sim opacity-40 mb-2"></div>
                        <p className="text-[6px] font-mono text-white/20 uppercase tracking-[0.3em] md:tracking-[0.5em] font-black">Authentication_Sequence_Active // Secure_Node_Access</p>
                     </div>
                     <div className="w-16 h-16 bg-white/10 p-1 border border-white/5 relative shrink-0">
                        <QrCode size={54} className="text-white opacity-20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <Shield size={16} className="text-[var(--tech-accent)]" />
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Editing Controls */}
              {isEditing && (
                <div className="mt-12 flex justify-center space-x-4 border-t border-white/5 pt-12">
                   <button onClick={handleSave} className="tech-btn tech-btn-active px-12 py-4 flex items-center space-x-3">
                      <Save size={18} />
                      <span className="text-sm">COMMIT_PROTOCOL</span>
                   </button>
                   <button onClick={() => setIsEditing(false)} className="tech-btn px-12 py-4 text-white/40">
                      <span>CANCEL</span>
                   </button>
                </div>
              )}
            </div>
          </div>

          {/* Shadow Background Decorations */}
          <div className="absolute -inset-4 bg-zinc-900 tech-corner-notch -z-10 opacity-50 blur-sm pointer-events-none"></div>
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] -z-10"></div>
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[var(--tech-accent)]/5 rounded-full blur-[100px] -z-10"></div>
        </motion.div>

        {/* Global Achievement Pulse */}
        <div className="space-y-12">
           <div className="flex items-center justify-between border-b border-[var(--tech-border)] pb-8">
              <div className="flex items-center space-x-4">
                 <BarChart3 className="text-[var(--tech-accent)]" size={24} />
                 <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Evolution_Telemetry</h3>
              </div>
              <div className="flex items-center space-x-4 font-mono text-[9px] font-black text-white/40 uppercase tracking-widest">
                 <span>Sync_Status:</span>
                 <div className="flex space-x-1">
                    {[1,2,3,4,5].map(i => <div key={i} className={`w-4 h-1 ${i <= 4 ? 'bg-[var(--tech-accent)]' : 'bg-white/10'}`}></div>)}
                 </div>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Badges Section */}
              <div className="space-y-8">
                <p className="text-[10px] font-black text-[var(--tech-accent)] tech-glow-text tracking-[0.4em] uppercase">Neural_Milestones</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'streak', icon: Flame, label: 'RELENTLESS', value: `${user.stats?.streak || 0}d`, active: (user.stats?.streak || 0) >= 7 },
                    { id: 'tasks', icon: Target, label: 'ARCHITECT', value: `${user.stats?.tasksCompleted || 0}`, active: (user.stats?.tasksCompleted || 0) >= 50 },
                    { id: 'exp', icon: Zap, label: 'OPTIMIZED', value: `${user.stats?.level || 1}`, active: (user.stats?.level || 1) >= 5 },
                    { id: 'profile', icon: User, label: 'VERIFIED', value: 'OK', active: !!user.displayName },
                  ].map((badge) => (
                    <div 
                      key={badge.id}
                      className={`tech-panel p-6 flex flex-col items-center justify-center space-y-4 group transition-all duration-500 overflow-hidden relative ${badge.active ? 'border-[var(--tech-accent)]/40 bg-[var(--tech-accent)]/5 shadow-[0_0_20px_rgba(var(--tech-glow-color),0.05)]' : 'opacity-40 grayscale'}`}
                    >
                      <div className={`p-4 rounded-full ${badge.active ? 'bg-[var(--tech-accent)]/20 text-[var(--tech-accent)]' : 'bg-black/20 text-[var(--tech-text-dim)]'} group-hover:scale-110 transition-transform relative z-10`}>
                        <badge.icon size={20} />
                      </div>
                      <div className="relative z-10 text-center">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1">{badge.label}</p>
                        <p className="text-[12px] font-mono font-black text-[var(--tech-accent)]">{badge.value}</p>
                      </div>
                      {badge.active && (
                        <div className="absolute top-0 right-0 w-12 h-12 bg-[var(--tech-accent)]/10 rotate-45 translate-x-6 -translate-y-6"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Evolution Progress */}
              <div className="space-y-8">
                <p className="text-[10px] font-black text-indigo-500 tracking-[0.4em] uppercase">Architecture_Stability</p>
                <div className="tech-panel p-10 bg-[var(--tech-inner)] space-y-12">
                   <div className="flex items-center justify-between">
                      <div>
                         <p className="text-[9px] font-black text-[var(--tech-text-dim)] uppercase tracking-widest mb-1">Current_Tier</p>
                         <p className="text-3xl font-black text-[var(--tech-text-bright)] italic tracking-tighter uppercase leading-none">Vanguard_Unit</p>
                      </div>
                      <div className="w-16 h-16 rounded-full border-4 border-[var(--tech-border)] flex items-center justify-center relative">
                         <div className="absolute inset-0 border-t-4 border-[var(--tech-accent)] rounded-full animate-spin"></div>
                         <span className="text-[var(--tech-accent)] font-black italic">{user.stats?.level || 1}</span>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center justify-between text-[10px] font-black text-[var(--tech-text-bright)] tracking-widest leading-none">
                         <span className="uppercase">Evolution_Status</span>
                         <span className="italic text-[var(--tech-accent)]">{Math.round(((user.stats?.exp || 0) / ((user.stats?.level || 1) * 500)) * 100)}% COMPLETE</span>
                      </div>
                      <div className="h-4 w-full bg-[var(--tech-inner)]/40 tech-indent p-1">
                         <div 
                          className="h-full bg-[var(--tech-accent)] shadow-[0_0_10px_var(--tech-glow)] transition-all duration-1000" 
                          style={{ width: `${Math.min(100, ((user.stats?.exp || 0) / ((user.stats?.level || 1) * 500)) * 100)}%` }}
                         ></div>
                      </div>
                      <p className="text-[8px] font-mono text-[var(--tech-text-dim)]/40 uppercase tracking-[0.3em] font-bold text-center">Next Synchronization Point in {((user.stats?.level || 1) * 500) - (user.stats?.exp || 0)} Units</p>
                   </div>
                </div>
              </div>
           </div>
        </div>
      </AnimatePresence>
    </div>
  );
};
