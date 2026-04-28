import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, Clock, Video, FileText, CheckCircle2, XCircle, 
  PlayCircle, AlertCircle, ChevronRight, Check, ListChecks, 
  MoreHorizontal, BrainCircuit, Activity, Building2
} from "lucide-react";
import { AnimatedContent } from "./ui/AnimatedContent";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNavigate } from "react-router";
import { demoApi, Interview, getDemoModeActive } from "../lib/demoApi";

export function InterviewsScreen() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [upcoming, setUpcoming] = useState<Interview[]>([]);
  const [past, setPast] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPrepNotes, setShowPrepNotes] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(getDemoModeActive());

  useEffect(() => {
    const handleDemoModeChange = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setIsDemoMode(customEvent.detail);
    };

    window.addEventListener('demo-mode-changed', handleDemoModeChange);
    setIsDemoMode(getDemoModeActive());

    return () => {
      window.removeEventListener('demo-mode-changed', handleDemoModeChange);
    };
  }, []);

  useEffect(() => {
    async function loadInterviews() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await demoApi.getInterviews();
        setUpcoming(data.upcoming);
        setPast(data.past);
      } catch (err) {
        console.error('Failed to load interviews:', err);
        setError('Unable to load interviews data. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    }
    loadInterviews();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 pb-12">
        <div className="rounded-[2.5rem] glass-card p-8 h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#3E63F5]/20 border-t-[#3E63F5] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[14px] font-medium text-[#1F2430]/60">Loading interviews...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col gap-6 pb-12">
        <div className="rounded-[2.5rem] glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start md:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B] shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-[Manrope,sans-serif] text-[18px] font-bold text-[#1F2430] mb-1">
                Demo Data Unavailable
              </h3>
              <p className="text-[14px] text-[#1F2430]/60">{error}</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full md:w-auto px-6 py-3 md:py-2.5 rounded-xl bg-[#3E63F5] text-white text-[15px] md:text-[14px] font-bold shadow-sm hover:bg-[#2A44B0] transition-colors whitespace-nowrap shrink-0 mt-2 md:mt-0"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const displayUpcoming = filter === 'all' || filter === 'upcoming';
  const displayPast = filter === 'all' || filter === 'past';

  return (
    <div className="flex flex-col gap-6 animate-[pulse-glow_0.5s_ease-out] pb-12">
      
      {isDemoMode && (
        <div className="bg-[#1F2430] text-white px-4 py-3 rounded-xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
            <div>
              <p className="text-[14px] font-bold">Demo Data</p>
              <p className="text-[13px] text-white/70">Backend connection unavailable. Showing fallback preview data.</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[13px] font-medium transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 z-20">
        <div>
          <h2 className="font-[Manrope,sans-serif] text-[32px] font-extrabold text-[#1F2430] tracking-tight leading-tight">
            Interview Operations
          </h2>
          <p className="text-[15px] font-medium text-[#1F2430]/60 mt-1">
            Manage your schedule, preparation, and active sessions.
          </p>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 p-1 bg-white/50 border border-white/60 rounded-xl shadow-sm w-full md:w-fit overflow-x-auto hide-scrollbar">
          {(['all', 'upcoming', 'past'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2.5 rounded-lg text-[13px] sm:text-[14px] font-bold capitalize transition-all whitespace-nowrap flex-1 md:flex-none text-center ${
                filter === tab 
                  ? 'bg-white text-[#1F2430] shadow-sm' 
                  : 'text-[#1F2430]/50 hover:text-[#1F2430]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {displayUpcoming && upcoming.length > 0 && (
        <>
          <AnimatedContent direction="vertical" distance={20} delay={0.1}>
            <h3 className="text-[14px] font-extrabold text-[#1F2430]/40 uppercase tracking-wider mb-4">
              {filter === 'upcoming' ? 'Scheduled Interviews' : 'Up Next'}
            </h3>
            
            {upcoming[0] && (
              <div className="glass-card rounded-[2rem] p-6 md:p-8 border border-[#10B981]/30 bg-gradient-to-br from-white via-white/80 to-[#10B981]/10 relative overflow-hidden shadow-[0_16px_48px_rgba(16,185,129,0.08)]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#10B981]/20 to-transparent pointer-events-none rounded-bl-[4rem]" />
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                  <div className="flex items-start gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-[#1F2430]/10 shadow-sm flex items-center justify-center overflow-hidden shrink-0 relative">
                      <div className="absolute inset-0 bg-[#10B981]/10 animate-pulse" />
                      {upcoming[0].company_logo ? (
                        <ImageWithFallback src={upcoming[0].company_logo} alt={upcoming[0].company} className="w-10 h-10 object-cover rounded-full" />
                      ) : (
                        <Building2 className="w-10 h-10 text-[#1F2430]/30" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#10B981]/10 border border-[#10B981]/20 text-[12px] font-extrabold text-[#10B981] uppercase tracking-wide">
                          <Activity className="w-3.5 h-3.5" /> {upcoming[0].scheduled_time}
                        </span>
                      </div>
                      <h4 className="font-[Manrope,sans-serif] text-[24px] font-bold text-[#1F2430] leading-tight">
                        {upcoming[0].type}
                      </h4>
                      <p className="text-[15px] font-semibold text-[#1F2430]/60 mt-1">
                        {upcoming[0].company} • {upcoming[0].role}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={() => setShowPrepNotes(!showPrepNotes)}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white text-[#1F2430] text-[15px] font-bold shadow-sm hover:bg-[#F8F9FC] transition-colors flex items-center justify-center gap-2 border border-[#1F2430]/10"
                    >
                      <ListChecks className="w-5 h-5" /> {showPrepNotes ? 'Hide' : 'Show'} Prep Notes
                    </button>
                    {upcoming[0].join_url && (
                      <button 
                        onClick={() => navigate('/pre-interview')}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#10B981] text-white text-[15px] font-bold shadow-[0_4px_16px_rgba(16,185,129,0.3)] hover:bg-[#059669] transition-all flex items-center justify-center gap-2"
                      >
                        <Video className="w-5 h-5" /> Join Room
                      </button>
                    )}
                  </div>
                </div>

                {/* Prep Notes */}
                {showPrepNotes && upcoming[0].prep_notes && upcoming[0].prep_notes.length > 0 && (
                  <div className="mt-6 bg-[#3E63F5]/5 border border-[#3E63F5]/10 rounded-xl p-4">
                    <h5 className="text-[14px] font-bold text-[#1F2430] mb-2">Preparation Notes:</h5>
                    <ul className="space-y-1">
                      {upcoming[0].prep_notes.map((note, i) => (
                        <li key={i} className="text-[13px] text-[#1F2430]/70 font-medium flex items-start gap-2">
                          <span className="text-[#3E63F5] mt-1">•</span>
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </AnimatedContent>

          {upcoming.length > 1 && (
            <AnimatedContent direction="vertical" distance={20} delay={0.2}>
              <h3 className="text-[14px] font-extrabold text-[#1F2430]/40 uppercase tracking-wider mb-4 mt-8">Scheduled Queue</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcoming.slice(1).map((interview, i) => (
                  <div key={interview.id} className="glass-card rounded-[1.5rem] p-6 border border-white/80 hover:shadow-[0_8px_24px_rgba(30,35,60,0.04)] transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {interview.company_logo ? (
                          <ImageWithFallback src={interview.company_logo} alt={interview.company} className="w-8 h-8 rounded-full border border-[#1F2430]/10" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#1F2430]/10 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-[#1F2430]/50" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-[#1F2430] text-[16px]">{interview.company}</h4>
                          <p className="text-[13px] font-medium text-[#1F2430]/60">{interview.type}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/60 border border-[#1F2430]/5 text-[12px] font-bold text-[#1F2430]/70">
                        <Clock className="w-3.5 h-3.5 opacity-60" /> {interview.scheduled_time}
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/60 border border-[#1F2430]/5 text-[12px] font-bold text-[#1F2430]/70">
                        {interview.duration}
                      </div>
                    </div>

                    {interview.prep_notes && interview.prep_notes.length > 0 && (
                      <div className="bg-[#3E63F5]/5 border border-[#3E63F5]/10 rounded-xl p-4 flex items-start gap-3">
                        <BrainCircuit className="w-5 h-5 text-[#3E63F5] shrink-0 mt-0.5" />
                        <div>
                          <h5 className="text-[14px] font-bold text-[#1F2430]">Needs Preparation</h5>
                          <p className="text-[13px] text-[#1F2430]/70 font-medium mt-1">{interview.prep_notes[0]}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </AnimatedContent>
          )}
        </>
      )}

      {displayPast && past.length > 0 && (
        <AnimatedContent direction="vertical" distance={20} delay={0.3}>
          <h3 className="text-[14px] font-extrabold text-[#1F2430]/40 uppercase tracking-wider mb-4 mt-8">Past Interviews</h3>
          
          <div className="space-y-3">
            {past.map((interview) => (
              <div key={interview.id} className="glass-card rounded-[1.5rem] p-5 border border-white/60 flex items-center justify-between group hover:bg-white/60 transition-all">
                <div className="flex items-center gap-4">
                  {interview.company_logo ? (
                    <ImageWithFallback src={interview.company_logo} alt={interview.company} className="w-10 h-10 rounded-full border border-[#1F2430]/10" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#1F2430]/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-[#1F2430]/50" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-[#1F2430] text-[16px]">{interview.company}</h4>
                    <p className="text-[13px] font-medium text-[#1F2430]/60">{interview.type} • {interview.scheduled_time}</p>
                  </div>
                </div>
                
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-bold ${
                  interview.status === 'completed' 
                    ? 'bg-[#10B981]/10 text-[#10B981]'
                    : 'bg-[#1F2430]/10 text-[#1F2430]/60'
                }`}>
                  {interview.status === 'completed' ? (
                    <><CheckCircle2 className="w-4 h-4" /> Completed</>
                  ) : (
                    <>{interview.status}</>
                  )}
                </div>
              </div>
            ))}
          </div>
        </AnimatedContent>
      )}

      {displayUpcoming && upcoming.length === 0 && (
        <div className="glass-card rounded-[2rem] p-12 text-center">
          <Calendar className="w-12 h-12 text-[#1F2430]/20 mx-auto mb-4" />
          <h3 className="font-[Manrope,sans-serif] text-[20px] font-bold text-[#1F2430] mb-2">
            No Upcoming Interviews
          </h3>
          <p className="text-[14px] text-[#1F2430]/60">
            When you schedule interviews, they'll appear here.
          </p>
        </div>
      )}
    </div>
  );
}
