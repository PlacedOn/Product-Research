import React from 'react';
import { 
  Edit3, 
  Eraser, 
  Square, 
  Type, 
  Undo2, 
  Redo2,
  PenTool
} from 'lucide-react';

export const WhiteboardView = () => (
  <div className="flex-1 flex flex-col gap-6 relative overflow-hidden h-full">
    {/* Problem Statement (Pinned) */}
    <div className="glass-panel rounded-3xl p-6 shadow-lg shadow-blue-900/5 border border-white/40 bg-white/60 shrink-0">
      <div className="flex items-center flex-col gap-3">
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-800 mb-1">Design a Distributed Rate Limiter</h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-3xl">
            Create a high-level architecture for a system that limits requests per user across multiple server clusters. Consider latency, consistency, and storage efficiency. Use the whiteboard to sketch the flow.
          </p>
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full text-blue-600 bg-blue-50 border border-blue-100">
          SYSTEM DESIGN
        </span>
      </div>
    </div>

    {/* Drawing Canvas Panel */}
    <div className="flex-1 glass-panel rounded-3xl shadow-xl shadow-blue-900/5 border border-white/40 whiteboard-grid relative flex flex-col overflow-hidden group">
      {/* Floating Toolbar */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 bg-white/80 backdrop-blur-xl shadow-2xl shadow-blue-900/10 p-3 rounded-3xl z-30 border border-white">
        <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-200 transition-all active:scale-90">
          <Edit3 size={20} />
        </button>
        <button className="w-12 h-12 flex items-center justify-center rounded-2xl text-slate-400 hover:bg-slate-50 transition-colors">
          <Eraser size={20} />
        </button>
        <button className="w-12 h-12 flex items-center justify-center rounded-2xl text-slate-400 hover:bg-slate-50 transition-colors">
          <Square size={20} />
        </button>
        <button className="w-12 h-12 flex items-center justify-center rounded-2xl text-slate-400 hover:bg-slate-50 transition-colors">
          <Type size={20} />
        </button>
        <div className="w-8 h-[1px] bg-slate-100 mx-auto my-1" />
        <button className="w-12 h-12 flex items-center justify-center rounded-2xl text-slate-400 hover:bg-slate-50 transition-colors">
          <Undo2 size={20} />
        </button>
        <button className="w-12 h-12 flex items-center justify-center rounded-2xl text-slate-400 hover:bg-slate-50 transition-colors">
          <Redo2 size={20} />
        </button>
      </div>

      {/* Canvas Mock Elements */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
        <div className="text-slate-400 flex flex-col items-center gap-4">
          <PenTool size={64} strokeWidth={1.5} />
          <p className="font-bold text-lg tracking-tight">Sketch your architecture here</p>
        </div>
      </div>
    </div>

    <style dangerouslySetInnerHTML={{ __html: `
      .whiteboard-grid {
        background-image: radial-gradient(circle, #e2e8f0 1px, transparent 1px);
        background-size: 32px 32px;
      }
    `}} />
  </div>
);
