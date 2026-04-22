import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Zap, PlusCircle } from 'lucide-react';
import { getAIBuddyResponse } from '../lib/gemini';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { addRoadmapToUser } from '../lib/db';

interface GrindBotProps {
  user: any;
}

const Typewriter = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 1); 
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  // Use a unicode block character that looks like the tactical cursor
  // We append it to the text being rendered so it stays inline.
  const contentWithCursor = currentIndex < text.length 
    ? displayedText + ' \u25ae' 
    : displayedText;

  return (
    <div className="relative w-full">
      <Markdown remarkPlugins={[remarkGfm]}>
        {contentWithCursor}
      </Markdown>
    </div>
  );
};

interface Message {
  role: 'user' | 'assistant';
  text: string;
  isNew?: boolean;
}

export const GrindBot: React.FC<GrindBotProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      text: `STATUS: CONNECTED.\n\nCURRENT STATS: LEVEL ${user?.stats?.level || 1} | STREAK: ${user?.stats?.streak || 0} | EXP: ${user?.stats?.xp || 0}. YOU HAVE COMPLETED ${user?.stats?.tasksCompleted || 0} TASKS. THIS IS A BASELINE, NOT A DESTINATION. TO ASCEND, WE MUST INCREASE THE VELOCITY OF YOUR OUTPUT.\n\nWHAT IS THE OBJECTIVE? DO YOU REQUIRE AN ARCHITECTURAL PLAN FOR A NEW HABIT, OR ARE WE IDENTIFYING A WEAKNESS IN YOUR CURRENT WORKFLOW THAT NEEDS TO BE SURGICALLY REMOVED?\n\nSTATE YOUR INTENT.` 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', text: userMsg.toUpperCase() }];
    setMessages(newMessages);
    setIsLoading(true);

    const response = await getAIBuddyResponse(user?.stats || {}, userMsg, messages);
    setMessages(prev => [...prev, { role: 'assistant', text: response, isNew: true }]);
    setIsLoading(false);
  };

  const parseRoadmap = (text: string) => {
    if (!text.includes('### ROADMAP:')) return null;
    try {
      const titleMatch = text.match(/### ROADMAP: (.*)/);
      const title = titleMatch ? titleMatch[1] : 'New Roadmap';
      
      const lines = text.split('\n');
      const modules: any[] = [];
      let description = '';

      lines.forEach(line => {
        if (line.startsWith('- Module')) {
          const modName = line.split(': ')[1];
          if (modName) {
            modules.push({ 
              name: modName, 
              status: modules.length === 0 ? 'current' : 'locked' 
            });
          }
        } else if (!line.startsWith('#') && line.trim() && modules.length === 0) {
          description = line.trim();
        }
      });

      return { title, description, modules, progress: 0 };
    } catch (e) {
      return null;
    }
  };

  const handleAddRoadmap = async (roadmap: any) => {
    if (!user) return;
    try {
      await addRoadmapToUser(user.uid, roadmap);
      setMessages(prev => [...prev, { role: 'assistant', text: 'ROADMAP INTEGRATED INTO YOUR NEURAL ARCHITECTURE. GO TO THE ROADMAPS SECTION TO BEGIN.' }]);
    } catch (error) {
      console.error("Failed to add roadmap:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative bg-transparent overflow-hidden w-full min-h-0">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-6 pb-64 pt-4 md:pt-12 space-y-6 md:space-y-12"
      >
        {/* Centered High-Fidelity Header (Now part of scrollable content) */}
        <div className="flex flex-col items-center justify-center pb-8 md:pb-20 space-y-3 md:space-y-4">
          <div className="w-9 h-9 md:w-12 md:h-12 bg-black border border-[var(--tech-border)] flex items-center justify-center text-[var(--tech-accent)] tech-panel shadow-[0_0_20px_var(--tech-glow)] relative">
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[var(--tech-accent)]"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[var(--tech-border)]"></div>
            <Bot size={18} className="md:w-[22px] md:h-[22px]" />
          </div>
          <div className="text-center px-4">
            <h2 className="text-xl md:text-3xl font-black tracking-tighter text-white uppercase italic leading-none mb-1 md:mb-3">NEURAL_CONSULTANT</h2>
            <p className="font-mono text-[6px] md:text-[8px] font-bold uppercase text-[var(--tech-text-dim)] tracking-[0.1em] md:tracking-[0.4em] leading-none">BIOMETRIC ARCHITECTURE // v2.0.4 // ONLINE</p>
          </div>
        </div>

        {messages.map((msg: any, i) => {
          const roadmap = msg.role === 'assistant' ? parseRoadmap(msg.text) : null;
          
          if (msg.role === 'assistant') {
            return (
              <div key={i} className="max-w-4xl mx-auto w-full">
                <div className="tech-panel border-l-2 border-l-[var(--tech-accent)] p-4 md:p-6 bg-[var(--tech-inner)]/60 relative overflow-hidden group">
                  <div className="flex items-center space-x-3 mb-4 pb-2 md:pb-3 border-b border-[var(--tech-border)]/30">
                    <Zap size={10} className="md:w-[12px] md:h-[12px] text-[var(--tech-accent)]" />
                    <span className="text-[8px] md:text-[10px] font-black tracking-[0.2em] uppercase italic text-[var(--tech-accent)]">INTELLIGENCE</span>
                  </div>
                  
                  <div className="prose prose-invert prose-xs md:prose-sm max-w-none text-[11px] md:text-[13px] font-black uppercase tracking-widest leading-relaxed text-[var(--tech-accent)] prose-headings:text-zinc-700 prose-headings:mb-4 prose-headings:mt-10 first:prose-headings:mt-0 prose-strong:text-white prose-code:text-white prose-p:mb-6 last:prose-p:mb-0 chatbot-markdown">
                    {msg.isNew ? (
                      <Typewriter 
                        text={msg.text} 
                        onComplete={() => {
                          const updated = [...messages];
                          updated[i] = { ...updated[i], isNew: false };
                          setMessages(updated);
                        }} 
                      />
                    ) : (
                      <Markdown remarkPlugins={[remarkGfm]}>{msg.text}</Markdown>
                    )}
                  </div>

                  {roadmap && (
                    <div className="mt-6 pt-4 border-t border-[var(--tech-border)]/20">
                      <button 
                        onClick={() => handleAddRoadmap(roadmap)}
                        className="tech-btn tech-btn-active text-[9px] font-black px-5 py-2"
                      >
                        <PlusCircle size={12} className="mr-2" />
                        <span>INTEGRATE_ROADMAP</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div key={i} className="max-w-4xl mx-auto w-full flex justify-end">
              <div className="w-full max-w-[280px] md:w-[320px] tech-panel p-4 md:p-5 bg-[var(--tech-inner)]/80 border-[var(--tech-border)] relative">
                <div className="absolute top-0 right-0 w-6 h-6 pointer-events-none overflow-hidden">
                   <div className="absolute top-0 right-0 w-12 h-12 bg-[var(--tech-border)]/10 rotate-45 translate-x-9 -translate-y-9"></div>
                </div>
                <div className="flex items-center space-x-3 mb-4 pb-2 md:pb-3 border-b border-[var(--tech-border)]/30">
                  <User size={10} className="md:w-[12px] md:h-[12px] text-[var(--tech-text-dim)]" />
                  <span className="text-[8px] md:text-[10px] font-black tracking-[0.2em] uppercase italic text-[var(--tech-text-dim)]">OPERATOR</span>
                </div>
                <div className="text-[10px] md:text-[13px] font-black uppercase tracking-widest leading-relaxed text-[var(--tech-accent)]">
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
        
        {isLoading && (
          <div className="max-w-4xl mx-auto w-full">
            <div className="tech-panel border-l-2 border-l-[var(--tech-accent)] p-4 md:p-6 bg-[var(--tech-inner)]/40 tech-pulse">
              <div className="flex items-center space-x-3 opacity-50">
                <Zap size={10} className="md:w-[12px] md:h-[12px] text-[var(--tech-accent)]" />
                <span className="text-[8px] md:text-[10px] font-black tracking-[0.2em] uppercase italic text-[var(--tech-accent)]">SYNTHESIZING_NEURAL_DIRECTIVES...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Re-engineered Bottom Input Area with Solid Masking Shield */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--tech-bg)] via-[var(--tech-bg)]/80 to-transparent pt-12 pb-10 md:pb-8 px-4 md:px-8 pointer-events-none z-20">
        <div className="max-w-4xl mx-auto flex items-end space-x-2 md:space-x-3 pointer-events-auto">
          <form onSubmit={handleSend} className="flex-1 group">
            <div className="relative tech-indent bg-black border border-[var(--tech-border)] shadow-2xl overflow-hidden rounded-sm">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="STATE_INTENT..."
                className="w-full bg-transparent border-none py-3 md:py-5 px-4 md:px-8 text-[11px] md:text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--tech-accent)] placeholder:text-[var(--tech-text-dim)]/20 outline-none transition-all"
              />
              <div className="absolute bottom-0 left-0 w-[2px] h-full bg-[var(--tech-accent)]/20 group-focus-within:bg-[var(--tech-accent)] transition-colors"></div>
            </div>
          </form>
          
          <button 
            type="submit"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`tech-btn w-12 md:w-16 h-[46px] md:h-[64px] flex items-center justify-center rounded-sm transition-all border border-[var(--tech-border)] bg-[var(--tech-inner)] shadow-lg ${!input.trim() || isLoading ? 'opacity-20 cursor-not-allowed' : 'hover:border-[var(--tech-accent)] hover:shadow-[0_0_15px_var(--tech-glow)]'}`}
          >
            <Send size={18} className={isLoading || !input.trim() ? "text-[var(--tech-text-dim)]" : "text-[var(--tech-accent)]"} />
          </button>
        </div>
      </div>
    </div>
  );
};
