import React, { useState, useEffect } from 'react';
import { Map as MapIcon, Shield, Search, Radio, User, MapPin, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface Node {
  id: string;
  name: string;
  distance: string;
  level: number;
  status: 'active' | 'focus';
  x: number;
  y: number;
}

export const NodeDiscovery: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNodes([
        { id: '1', name: 'Operator_Koda', distance: '1.2km', level: 14, status: 'active', x: 30, y: 40 },
        { id: '2', name: 'Zero_Day', distance: '2.5km', level: 22, status: 'focus', x: 60, y: 20 },
        { id: '3', name: 'Arch_Linux_User', distance: '0.8km', level: 9, status: 'active', x: 45, y: 70 },
        { id: '4', name: 'Cyber_Grind', distance: '4.1km', level: 31, status: 'focus', x: 20, y: 80 },
      ]);
      setScanning(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-[var(--tech-border)] pb-10">
        <div>
          <h2 className="text-3xl font-black text-[var(--tech-text-bright)] tracking-tighter uppercase italic mb-2">Node_Discovery</h2>
          <p className="text-[10px] font-mono text-[var(--tech-text-dim)] uppercase tracking-[0.4em]">Subsidary network mesh scanning proximity...</p>
        </div>
        <div className="flex items-center space-x-4">
           <button className="tech-btn flex items-center space-x-3 px-6 text-[var(--tech-text-dim)] hover:text-white">
              <Radio size={14} className={scanning ? "animate-pulse text-[var(--tech-accent)]" : ""} />
              <span className="text-[9px] font-black uppercase tracking-widest">{scanning ? 'RESCANNING...' : 'BROADCAST_ON'}</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
           <div className="tech-panel aspect-square md:aspect-video bg-[var(--tech-inner)] border-[var(--tech-border)] relative overflow-hidden flex items-center justify-center">
              {/* Radar Grid */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(var(--tech-border) 1px, transparent 1px), linear-gradient(90deg, var(--tech-border) 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-2/3 h-2/3 border border-[var(--tech-accent)]/20 rounded-full"></div>
                 <div className="w-1/3 h-1/3 border border-[var(--tech-accent)]/10 rounded-full"></div>
                 <div className="absolute w-[1px] h-full bg-[var(--tech-accent)]/10"></div>
                 <div className="absolute w-full h-[1px] bg-[var(--tech-accent)]/10"></div>
              </div>

              {/* Scanning Line */}
              {scanning && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--tech-accent)]/10 to-transparent w-32 h-full z-10"
                  animate={{ left: ['-20%', '120%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                ></motion.div>
              )}

              {/* Your Node */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                 <div className="relative">
                    <div className="w-4 h-4 bg-[var(--tech-accent)] rounded-full tech-pulse shadow-[0_0_15px_var(--tech-glow)]"></div>
                    <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-[var(--tech-accent)] whitespace-nowrap">LOCAL_HOST</span>
                 </div>
              </div>

              {/* Other Nodes */}
              {!scanning && nodes.map((node) => (
                <motion.div 
                  key={`map-node-${node.id}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute z-20 cursor-pointer group"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <div className="relative">
                    <div className={`w-3 h-3 border-2 ${node.status === 'active' ? 'border-[var(--tech-accent)] bg-black' : 'border-zinc-700 bg-zinc-800'} rounded-full transition-all group-hover:scale-150`}></div>
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none bg-black border border-[var(--tech-border)] p-3 min-w-[140px]">
                       <p className="text-[10px] font-black text-white italic uppercase tracking-tighter mb-1">{node.name}</p>
                       <div className="flex items-center justify-between text-[7px] font-mono text-[var(--tech-text-dim)] uppercase">
                          <span>{node.distance} AWAY</span>
                          <span className="text-[var(--tech-accent)]">LVL {node.level}</span>
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
           </div>
        </div>

        <div className="space-y-8">
           <div className="tech-panel p-8 bg-[var(--tech-inner)] border-[var(--tech-border)]">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--tech-text-dim)] mb-8 flex items-center justify-between italic">
                <span>Active_Nodes_List</span>
                <Radio size={14} />
              </h3>
              <div className="space-y-6">
                {scanning ? (
                   <div className="space-y-6 opacity-30">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-10 bg-zinc-800/10 animate-pulse"></div>
                      ))}
                   </div>
                ) : (
                  nodes.map(node => (
                    <div key={`list-node-${node.id}`} className="flex items-center space-x-4 group cursor-pointer p-2 hover:bg-[var(--tech-accent)]/5 transition-all">
                       <div className="w-10 h-10 bg-black border border-[var(--tech-border)] flex items-center justify-center shrink-0">
                          <User size={18} className="text-zinc-700 group-hover:text-[var(--tech-accent)] transition-colors" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black text-[var(--tech-text-bright)] truncate uppercase italic">{node.name}</p>
                          <p className="text-[8px] font-mono text-[var(--tech-text-dim)] uppercase mt-1">{node.distance} • {node.status}</p>
                       </div>
                       <button className="text-zinc-800 hover:text-[var(--tech-accent)] transition-all">
                          <Zap size={14} />
                       </button>
                    </div>
                  ))
                )}
              </div>
           </div>

           <div className="tech-panel p-8 bg-[var(--tech-indent-bg)] border-[var(--tech-border)]">
              <div className="flex items-start space-x-4">
                 <MapPin size={24} className="text-[var(--tech-accent)]" />
                 <div>
                    <h4 className="text-[11px] font-black text-white uppercase italic tracking-widest mb-1">Privacy_Lock: ACTIVE</h4>
                    <p className="text-[9px] text-[var(--tech-text-dim)] uppercase tracking-wider leading-relaxed">Your location is only visible to verified nodes within a 5km radius during deep focus protocols.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
