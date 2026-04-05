import React from 'react';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Layers,
  Mic,
  Video,
  Cpu
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  sender: 'AI Mentor' | 'You';
  time: string;
  text: string;
  isLive?: boolean;
}

interface SidebarProps {
  messages: Message[];
  isSpeaking: boolean;
  setIsSpeaking: (val: boolean) => void;
  timer: number;
}

export const Sidebar = ({ messages, isSpeaking, setIsSpeaking, timer }: SidebarProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <aside className="flex-1 flex flex-col gap-4 min-w-[320px] h-full overflow-hidden">
      {/* Transcript Card */}
      <div className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden border border-white/40 shadow-xl shadow-blue-900/5">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
              <MessageSquare size={16} />
            </div>
            <h3 className="font-bold text-sm text-slate-800 tracking-tight">Transcript</h3>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-50 rounded-full">
            <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Live</span>
          </div>
        </div>
        
        <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
          {messages.map(msg => (
            <div key={msg.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-wider",
                  msg.sender === 'AI Mentor' ? "text-blue-600" : "text-slate-500"
                )}>
                  {msg.sender} • {msg.time}
                </span>
              </div>
              <p className={cn(
                "text-xs leading-relaxed font-medium p-2.5 rounded-xl",
                msg.sender === 'AI Mentor' 
                  ? "bg-blue-50/50 text-slate-700 rounded-tl-none" 
                  : "bg-slate-50 text-slate-600 rounded-tr-none italic"
              )}>
                {msg.text}
              </p>
            </div>
          ))}
          
          {isSpeaking && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1.5 text-blue-600/60 italic"
            >
              <div className="flex gap-0.5">
                <motion.span animate={{ height: [3, 9, 3] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-blue-400 rounded-full" />
                <motion.span animate={{ height: [6, 3, 6] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }} className="w-0.5 bg-blue-400 rounded-full" />
                <motion.span animate={{ height: [3, 7, 3] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-0.5 bg-blue-400 rounded-full" />
              </div>
              <span className="text-[10px] font-bold tracking-tight">User is speaking...</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Controls Card */}
      <div className="glass-panel rounded-2xl p-4 space-y-4 border border-white/40 shadow-xl shadow-blue-900/5 bg-white/40 shrink-0">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Interview Duration</span>
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-blue-500" />
              <span className="text-base font-bold text-slate-800 tabular-nums">
                {formatTime(timer)}
              </span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <Layers size={18} />
          </div>
        </div>

        <button 
          onClick={() => setIsSpeaking(!isSpeaking)}
          className={cn(
            "w-full py-4 rounded-xl font-bold text-base shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
            isSpeaking 
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200" 
              : "bg-slate-100 text-slate-500 shadow-none"
          )}
        >
          <span>{isSpeaking ? "Done Speaking" : "Start Speaking"}</span>
          <CheckCircle2 size={18} />
        </button>

        <div className="flex gap-2">
          <button className="flex-1 py-2.5 bg-white rounded-lg text-xs font-bold text-slate-600 border border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
            <FileText size={14} />
            Notes
          </button>
          <button className="flex-1 py-2.5 bg-white rounded-lg text-xs font-bold text-slate-600 border border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
            <Layers size={14} />
            Resources
          </button>
        </div>
      </div>
    </aside>
  );
};
