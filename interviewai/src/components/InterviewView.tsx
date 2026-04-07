import React from 'react';
import { motion } from 'motion/react';
import { AIBlob } from './AIBlob';

export const InterviewView = () => (
  <div className="flex-1 glass-panel rounded-3xl flex flex-col items-center justify-center relative overflow-hidden border border-white/40 shadow-xl shadow-blue-900/5">
    <AIBlob />
    
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 text-center max-w-3xl px-8"
    >
      <h2 className="text-4xl font-bold text-slate-800 leading-tight tracking-tight mb-6">
        "Tell me about a time you handled a conflict."
      </h2>
      <div className="flex items-center justify-center gap-3 text-slate-400 font-bold text-xs tracking-widest uppercase">
        <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        AI Mentor is listening and taking notes ...
      </div>
    </motion.div>
  </div>
);
