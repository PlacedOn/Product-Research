import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { InterviewView } from './components/InterviewView';
import { IDEView } from './components/IDEView';
import { WhiteboardView } from './components/WhiteboardView';
import { MobileNav } from './components/MobileNav';
import { VideoFeed } from './components/VideoFeed';
import { evaluateAnswer, generateQuestion, type CandidateProfile, type JobProfile } from './lib/interviewApi';

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeQuestion, setActiveQuestion] = useState('Connecting to interview backend...');
  const [answerDraft, setAnswerDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [timer, setTimer] = useState(764);

  const [sessionId] = useState(() => `session-${Date.now()}`);
  const candidate: CandidateProfile = {
    name: 'Alex Doe',
    experience_years: 3,
    skills: ['Python', 'System Design', 'APIs', 'Databases'],
    projects: ['Realtime interview platform', 'Scalable chat backend'],
    education: 'B.Tech in Computer Science',
  };
  const job: JobProfile = {
    role: 'Backend Engineer',
    company: 'PlacedOn',
    level: 'mid',
    required_skills: ['Python', 'System Design', 'Databases'],
    preferred_skills: ['FastAPI', 'Redis', 'PostgreSQL'],
  };

  const nowLabel = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  const pushMessage = (sender: Message['sender'], text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        sender,
        time: nowLabel(),
        text,
      },
    ]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const first = await generateQuestion({ sessionId, candidate, job });
        if (cancelled) {
          return;
        }
        setActiveQuestion(first.question);
        pushMessage('AI Mentor', first.question);
      } catch (err) {
        if (cancelled) {
          return;
        }
        const detail = err instanceof Error ? err.message : 'Unable to connect to backend';
        setError(detail);
        setActiveQuestion('Could not load interview question. Check backend connection.');
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const submitAnswer = async () => {
    const answer = answerDraft.trim();
    if (!answer || isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);
    pushMessage('You', answer);
    setAnswerDraft('');

    try {
      await evaluateAnswer({
        sessionId,
        question: activeQuestion,
        answer,
      });
      const next = await generateQuestion({ sessionId, candidate, job });
      setActiveQuestion(next.question);
      pushMessage('AI Mentor', next.question);
    } catch (err) {
      const detail = err instanceof Error ? err.message : 'Failed to send answer';
      setError(detail);
    } finally {
      setIsLoading(false);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'interview':
        return <InterviewView question={activeQuestion} isLoading={isLoading} />;
      case 'ide':
        return <IDEView />;
      case 'whiteboard':
        return <WhiteboardView />;
      default:
        return <InterviewView question={activeQuestion} isLoading={isLoading} />;
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
            timer={timer} 
            answerDraft={answerDraft}
            setAnswerDraft={setAnswerDraft}
            onSubmitAnswer={submitAnswer}
            isLoading={isLoading}
            error={error}
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
