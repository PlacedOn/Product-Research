import React from 'react';
import { 
  MessageSquare, 
  Clock, 
  FileText, 
  Layers
} from 'lucide-react';
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
  timer: number;
  answerDraft: string;
  setAnswerDraft: (value: string) => void;
  onSubmitAnswer: () => void;
  isLoading: boolean;
  error: string | null;
}

export const Sidebar = ({
  messages,
  timer,
  answerDraft,
  setAnswerDraft,
  onSubmitAnswer,
  isLoading,
  error,
}: SidebarProps) => {
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
            <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Text Mode</span>
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
          
          <p className="text-[10px] font-bold tracking-tight text-blue-600/70 uppercase">Answers are accepted from text input only.</p>
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

        <div className="w-full py-3 px-3 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
          Voice controls are disabled. Use the text box below to submit answers.
        </div>

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

        <div className="space-y-2">
          <textarea
            value={answerDraft}
            onChange={(e) => setAnswerDraft(e.target.value)}
            placeholder="Type your answer and submit to get the next question..."
            className="w-full min-h-20 resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-blue-400"
          />
          <button
            onClick={onSubmitAnswer}
            disabled={isLoading || !answerDraft.trim()}
            className="w-full py-2.5 rounded-lg text-xs font-bold text-white bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Submit Answer'}
          </button>
          {error ? <p className="text-[11px] text-red-600">{error}</p> : null}
        </div>
      </div>
    </aside>
  );
};
