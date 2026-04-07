import React from 'react';
import { motion } from 'motion/react';

export const AIBlob = () => (
  <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
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
      className="ai-blob-gradient w-56 h-56 md:w-72 md:h-72 rounded-full flex flex-col items-center justify-center gap-4 relative z-10"
    >
      <div className="flex gap-12 mb-4">
        <motion.div 
          animate={{ scaleY: [1, 0.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.2] }}
          className="w-4 h-4 bg-white/40 rounded-sm" 
        />
        <motion.div 
          animate={{ scaleY: [1, 0.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.2] }}
          className="w-4 h-4 bg-white/40 rounded-sm" 
        />
      </div>
      <div className="w-24 h-2 bg-white/30 rounded-full" />
    </motion.div>
    {/* Glow layers */}
    <div className="absolute inset-0 blur-[80px] rounded-full bg-blue-400/20 animate-pulse" />
    <div className="absolute inset-0 blur-[40px] rounded-full bg-blue-300/10" />
  </div>
);
