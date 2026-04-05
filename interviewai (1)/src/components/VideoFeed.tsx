import React from 'react';
import { Mic, Video } from 'lucide-react';

export const VideoFeed = () => (
  <div className="absolute bottom-6 right-6 w-64 aspect-video bg-slate-900 rounded-2xl border-4 border-white shadow-2xl overflow-hidden group z-40">
    <img 
      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=200" 
      alt="Candidate" 
      className="w-full h-full object-cover opacity-90"
      referrerPolicy="no-referrer"
    />
    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-lg text-[9px] font-bold text-white uppercase tracking-wider">
      <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
      You (Candidate)
    </div>
    <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
      <button className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20">
        <Mic size={12} />
      </button>
      <button className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20">
        <Video size={12} />
      </button>
    </div>
  </div>
);
