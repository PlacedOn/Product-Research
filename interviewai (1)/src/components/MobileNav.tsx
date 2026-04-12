import React from 'react';
import { Video, MessageSquare, Layers } from 'lucide-react';
import { cn } from '../lib/utils';

interface MobileNavProps {
  currentView: 'interview' | 'ide' | 'whiteboard';
  onViewChange: (view: 'interview' | 'ide' | 'whiteboard') => void;
}

export const MobileNav = ({ currentView, onViewChange }: MobileNavProps) => (
  <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel h-20 px-6 flex justify-around items-center z-50 border-t border-slate-200">
    {[
      { id: 'interview', label: 'Interview', icon: Video },
      { id: 'ide', label: 'IDE', icon: MessageSquare },
      { id: 'whiteboard', label: 'Whiteboard', icon: Layers }
    ].map((item) => (
      <button 
        key={item.id}
        onClick={() => onViewChange(item.id as any)}
        className={cn(
          "flex flex-col items-center gap-1 transition-colors",
          currentView === item.id ? "text-blue-600" : "text-slate-400"
        )}
      >
        <item.icon size={20} />
        <span className="text-[10px] font-bold">{item.label}</span>
      </button>
    ))}
  </nav>
);
