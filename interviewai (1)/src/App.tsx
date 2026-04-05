import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { InterviewView } from './components/InterviewView';
import { IDEView } from './components/IDEView';
import { WhiteboardView } from './components/WhiteboardView';
import { MobileNav } from './components/MobileNav';
import { VideoFeed } from './components/VideoFeed';

// --- Types ---
type View = 'interview' | 'ide' | 'whiteboard';

interface Message {
  id: string;
  sender: 'AI Mentor' | 'You';
  time: string;
  text: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>('interview');
  const [messages] = useState<Message[]>([
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
  const [timer, setTimer] = useState(764);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'interview':
        return <InterviewView />;
      case 'ide':
        return <IDEView />;
      case 'whiteboard':
        return <WhiteboardView />;
      default:
        return <InterviewView />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 flex p-4 gap-4 overflow-hidden pb-24 md:pb-4 relative">
        {/* Main Content Stage */}
        <section className="flex-[4] flex flex-col overflow-hidden h-full relative">
          {renderView()}
          <div className="hidden md:block">
            <VideoFeed />
          </div>
        </section>

        {/* Sidebar */}
        <div className="hidden md:flex flex-1 h-full overflow-hidden min-w-[320px]">
          <Sidebar 
            messages={messages} 
            isSpeaking={isSpeaking} 
            setIsSpeaking={setIsSpeaking} 
            timer={timer} 
          />
        </div>
      </main>

      <MobileNav currentView={currentView} onViewChange={setCurrentView} />

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
