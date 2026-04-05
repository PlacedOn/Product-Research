import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  HelpCircle, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Layers,
  MoreVertical,
  ChevronRight,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// --- Types ---
interface Message {
  id: string;
  sender: 'AI Mentor' | 'You';
  time: string;
  text: string;
  isLive?: boolean;
}

// --- Components ---

const Navbar = () => (
  <header className="flex justify-between items-center w-full px-8 h-16 sticky top-0 z-50 glass-panel border-b border-slate-200/50">
    <div className="flex items-center gap-8">
      <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent tracking-tight">
        InterviewAI
      </span>
      <nav className="hidden md:flex gap-8">
        <a href="#" className="text-blue-600 border-b-2 border-blue-600 font-bold pb-1 transition-all">Interview</a>
        <a href="#" className="text-slate-500 hover:text-blue-600 font-medium transition-colors">IDE</a>
        <a href="#" className="text-slate-500 hover:text-blue-600 font-medium transition-colors">Whiteboard</a>
      </nav>
    </div>
    <div className="flex items-center gap-4">
      <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all">
        <Settings size={20} />
      </button>
      <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all">
        <HelpCircle size={20} />
      </button>
      <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
        End Interview
      </button>
      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
        <img 
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100" 
          alt="User Profile" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  </header>
);

const AIBlob = () => (
  <div className="relative w-80 h-80 flex items-center justify-center">
    <motion.div 
      animate={{ 
        scale: [1, 1.05, 1],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ 
        duration: 8, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className="ai-blob-gradient w-72 h-72 rounded-full flex flex-col items-center justify-center gap-4 relative z-10"
    >
      <div className="flex gap-10">
        <motion.div 
          animate={{ height: [24, 12, 24] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-4 bg-white/40 rounded-full" 
        />
        <motion.div 
          animate={{ height: [24, 12, 24] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
          className="w-4 bg-white/40 rounded-full" 
        />
      </div>
      <div className="w-20 h-2.5 bg-white/20 rounded-full" />
    </motion.div>
    {/* Glow layers */}
    <div className="absolute inset-0 blur-[80px] rounded-full bg-blue-400/20 animate-pulse" />
    <div className="absolute inset-0 blur-[40px] rounded-full bg-blue-300/10" />
  </div>
);

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'AI Mentor',
      time: '14:02',
      text: "Welcome, Alex. It's great to have you here today for the Lead Systems Engineer role. To start, could you introduce yourself?"
    },
    {
      id: '2',
      sender: 'You',
      time: '14:03',
      text: "Thanks! I've been working in cloud infrastructure for about six years, primarily focusing on high-availability systems..."
    },
    {
      id: '3',
      sender: 'AI Mentor',
      time: '14:05',
      text: "That's impressive. Let's dive deeper. Tell me about a time you handled a conflict within your technical team during a major deployment."
    }
  ]);

  const [isSpeaking, setIsSpeaking] = useState(true);
  const [timer, setTimer] = useState(764); // 12:44 in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex p-6 gap-6 overflow-hidden">
        {/* Main Interview Stage */}
        <section className="flex-[3] flex flex-col gap-6 relative">
          <div className="flex-1 glass-panel rounded-3xl flex flex-col items-center justify-center relative overflow-hidden border border-white/40 shadow-xl shadow-blue-900/5">
            <AIBlob />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 text-center max-w-2xl px-8"
            >
              <h2 className="text-3xl font-bold text-slate-800 leading-tight">
                "Tell me about a time you handled a conflict."
              </h2>
              <p className="text-slate-500 mt-4 font-semibold tracking-wide flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                AI Mentor is listening and taking notes...
              </p>
            </motion.div>

            {/* Candidate Video Feed */}
            <div className="absolute bottom-8 right-8 w-64 h-40 bg-slate-100 rounded-2xl border-4 border-white shadow-2xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=200" 
                alt="Candidate" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] text-white font-bold tracking-wide">
                You (Candidate)
              </div>
              <div className="absolute top-3 right-3 flex gap-2">
                <button className="p-1.5 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-all">
                  <Mic size={14} />
                </button>
                <button className="p-1.5 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-all">
                  <Video size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="flex-1 flex flex-col gap-6 min-w-[360px]">
          {/* Transcript Card */}
          <div className="flex-1 glass-panel rounded-3xl flex flex-col overflow-hidden border border-white/40 shadow-xl shadow-blue-900/5">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                  <MessageSquare size={18} />
                </div>
                <h3 className="font-bold text-slate-800">Transcript</h3>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-red-50 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Live</span>
              </div>
            </div>
            
            <div className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar">
              {messages.map(msg => (
                <div key={msg.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-wider",
                      msg.sender === 'AI Mentor' ? "text-blue-600" : "text-slate-500"
                    )}>
                      {msg.sender} • {msg.time}
                    </span>
                    {msg.isLive && (
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Live</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {msg.text}
                  </p>
                </div>
              ))}
              
              {isSpeaking && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-blue-600/60 italic"
                >
                  <div className="flex gap-1">
                    <motion.span animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-blue-400 rounded-full" />
                    <motion.span animate={{ height: [8, 4, 8] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }} className="w-0.5 bg-blue-400 rounded-full" />
                    <motion.span animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-0.5 bg-blue-400 rounded-full" />
                  </div>
                  <span className="text-xs font-bold tracking-tight">User is speaking...</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Controls Card */}
          <div className="glass-panel rounded-3xl p-6 space-y-6 border border-white/40 shadow-xl shadow-blue-900/5 bg-white/40">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Interview Duration</span>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-blue-500" />
                  <span className="text-lg font-bold text-slate-800 tabular-nums">
                    {formatTime(timer)}
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                <Layers size={20} />
              </div>
            </div>

            <button 
              onClick={() => setIsSpeaking(!isSpeaking)}
              className={cn(
                "w-full py-5 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98]",
                isSpeaking 
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200" 
                  : "bg-slate-100 text-slate-500 shadow-none"
              )}
            >
              <span>{isSpeaking ? "Done Speaking" : "Start Speaking"}</span>
              <CheckCircle2 size={22} />
            </button>

            <div className="flex gap-3">
              <button className="flex-1 py-3.5 bg-white rounded-xl text-sm font-bold text-slate-600 border border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <FileText size={16} />
                Notes
              </button>
              <button className="flex-1 py-3.5 bg-white rounded-xl text-sm font-bold text-slate-600 border border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <Layers size={16} />
                Resources
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* Mobile Navigation (Hidden on desktop) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel h-20 px-6 flex justify-around items-center z-50 border-t border-slate-200">
        <button className="flex flex-col items-center gap-1 text-blue-600">
          <Video size={20} />
          <span className="text-[10px] font-bold">Interview</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <MessageSquare size={20} />
          <span className="text-[10px] font-bold">IDE</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <Layers size={20} />
          <span className="text-[10px] font-bold">Whiteboard</span>
        </button>
      </nav>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}} />
    </div>
  );
}
