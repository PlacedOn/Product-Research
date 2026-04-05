import React from 'react';
import { Settings, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavbarProps {
  currentView: 'interview' | 'ide' | 'whiteboard';
  onViewChange: (view: 'interview' | 'ide' | 'whiteboard') => void;
}

export const Navbar = ({ currentView, onViewChange }: NavbarProps) => (
  <header className="flex justify-between items-center w-full px-8 h-16 sticky top-0 z-50 glass-panel border-b border-slate-200/50">
    <div className="flex items-center gap-8">
      <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent tracking-tight">
        InterviewAI
      </span>
      <nav className="hidden md:flex gap-8">
        {[
          { id: 'interview', label: 'Interview' },
          { id: 'ide', label: 'IDE' },
          { id: 'whiteboard', label: 'Whiteboard' }
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id as any)}
            className={cn(
              "font-medium transition-all pb-1",
              currentView === view.id 
                ? "text-blue-600 border-b-2 border-blue-600 font-bold" 
                : "text-slate-500 hover:text-blue-600"
            )}
          >
            {view.label}
          </button>
        ))}
      </nav>
    </div>
    <div className="flex items-center gap-4">
      <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-all">
        <Settings size={20} />
      </button>
      <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-all">
        <HelpCircle size={20} />
      </button>
      <button className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 text-sm">
        End Interview
      </button>
      <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border border-slate-200 shadow-sm ml-2">
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
