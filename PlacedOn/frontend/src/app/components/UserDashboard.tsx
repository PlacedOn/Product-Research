import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Sparkles, ChevronRight, Briefcase, Zap, Shield, ArrowRight, Play, 
  Search, Code2, LayoutTemplate, Database, LineChart, ShieldCheck,
  BrainCircuit, Lock, Link2, Copy, BarChart3, TrendingUp, Clock, Eye, Send, FileText, AlertCircle
} from 'lucide-react';
import { AnimatedContent } from './ui/AnimatedContent';
import { BlurText } from './ui/BlurText';
import { motion } from 'motion/react';
import { NextBestActionCard, NextActionState } from './NextBestActionCard';
import { demoApi, CandidateIdentity, DashboardResponse, getDemoModeActive } from '../lib/demoApi';
import { toast } from 'sonner';

export function UserDashboard() {
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<CandidateIdentity | null>(null);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    async function loadDashboard() {
      try {
        setIsLoading(true);
        setError(null);
        const [candidateData, dashboardData] = await Promise.all([
          demoApi.getCandidate(),
          demoApi.getDashboard(),
        ]);
        setCandidate(candidateData);
        setDashboard(dashboardData);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setError('Unable to load dashboard data. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const handleShareProfile = async () => {
    if (candidate?.share_url) {
      try {
        await navigator.clipboard.writeText(candidate.share_url);
        toast.success('Profile link copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy link');
      }
    }
  };

  const handleEmailShare = () => {
    if (candidate?.share_url) {
      const subject = encodeURIComponent(`Check out my PlacedOn profile - ${candidate.name}`);
      const body = encodeURIComponent(`I'd like to share my verified technical profile with you:\n\n${candidate.share_url}\n\nThis profile was generated through AI-powered technical interviews and shows evidence-backed skills.`);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-[pulse-glow_0.5s_ease-out]">
        <div className="rounded-[2.5rem] glass-card p-8 h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#3E63F5]/20 border-t-[#3E63F5] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[14px] font-medium text-[#1F2430]/60">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !dashboard || !candidate) {
    return (
      <div className="flex flex-col gap-6">
        <div className="rounded-[2.5rem] glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start md:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B] shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-[Manrope,sans-serif] text-[18px] font-bold text-[#1F2430] mb-1">
                Demo Data Unavailable
              </h3>
              <p className="text-[14px] text-[#1F2430]/60">
                {error || 'Could not connect to the backend. Please ensure the server is running.'}
              </p>
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

  return (
    <div className="flex flex-col gap-6 animate-[pulse-glow_0.5s_ease-out]">
      
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

      {/* Top Header / Stage Aware Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 z-20 relative">
        <div>
          <h1 className="font-[Manrope,sans-serif] text-[28px] font-bold text-[#1F2430] tracking-tight">
            <BlurText 
              text={`Welcome back, ${candidate.name.split(' ')[0]}`}
              delay={0.03}
              animateBy="words"
              direction="bottom"
            />
          </h1>
          <p className="text-[15px] font-medium text-[#1F2430]/60 mt-1">
            Your profile is currently <strong className="text-[#1F2430]">{candidate.visibility}</strong>. {dashboard.profile_snapshot.completion < 100 ? 'Complete your review to get matched.' : 'You\'re ready for matches!'}
          </p>
        </div>
        
        {/* Subtle Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative group/search">
            <Search className="w-4 h-4 text-[#1F2430]/40 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within/search:text-[#3E63F5] transition-colors" />
            <input 
              type="text"
              placeholder="Search companies, roles..."
              className="w-full md:w-64 bg-white/60 backdrop-blur-md border border-[#1F2430]/10 rounded-xl py-2.5 pl-9 pr-4 text-[13px] font-medium text-[#1F2430] placeholder:text-[#1F2430]/40 focus:outline-none focus:ring-2 focus:ring-[#3E63F5]/20 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* 1. Next Best Action */}
      <AnimatedContent direction="vertical" distance={20} delay={0.1}>
        <NextBestActionCard state={dashboard.next_best_action.type as NextActionState} />
      </AnimatedContent>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. Profile Snapshot */}
        <AnimatedContent direction="vertical" distance={20} delay={0.15} className="lg:col-span-2 flex flex-col">
          <div className="h-full rounded-[2.5rem] glass-card p-6 md:p-8 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#3E63F5]/10 to-transparent pointer-events-none rounded-tr-[2.5rem]" />
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-[Manrope,sans-serif] text-[20px] font-bold text-[#1F2430] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#10B981]" /> Profile Snapshot
              </h3>
              <button onClick={() => navigate('/candidate/profile')} className="text-[13px] font-bold text-[#3E63F5] hover:text-[#2A44B0] transition-colors flex items-center gap-1">
                View Full <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#EEF1F8] to-[#EAEAFE] flex items-center justify-center shrink-0 border border-[#3E63F5]/10 shadow-inner text-[#3E63F5] text-2xl font-bold tracking-tighter">
                AC
              </div>
              <div>
                <h4 className="text-[18px] font-bold text-[#1F2430] mb-1">{candidate.name}</h4>
                <p className="text-[14px] font-medium text-[#1F2430]/70 mb-3">{candidate.target_role} • {candidate.location}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-md bg-[#10B981]/10 text-[#10B981] text-[11px] font-bold tracking-wide">{dashboard.profile_snapshot.evidence_strength}</span>
                  <span className="px-2 py-1 rounded-md bg-[#1F2430]/5 text-[#1F2430]/70 text-[11px] font-bold tracking-wide border border-[#1F2430]/10">{dashboard.profile_snapshot.skills_count} Skills</span>
                  <span className="px-2 py-1 rounded-md bg-[#1F2430]/5 text-[#1F2430]/70 text-[11px] font-bold tracking-wide border border-[#1F2430]/10">{dashboard.profile_snapshot.interviews_completed} Interviews</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#1F2430]/[0.04] mt-auto">
              <p className="text-[13px] text-[#1F2430]/70 font-medium italic leading-relaxed">
                "Aisha is a frontend-focused engineer who explains technical decisions clearly and approaches UI problems with structure. Shows strong thinking around component reuse and state management."
              </p>
            </div>
          </div>
        </AnimatedContent>

        {/* 3. Share Profile */}
        <AnimatedContent direction="vertical" distance={20} delay={0.2} className="flex flex-col">
          <div className="h-full rounded-[2.5rem] glass-card p-6 md:p-8 flex flex-col border-[#3E63F5]/20 bg-gradient-to-b from-white/60 to-[#F8F9FC]/80 shadow-[0_8px_32px_rgba(62,99,245,0.05)]">
            <div className="w-12 h-12 rounded-xl bg-[#3E63F5]/10 border border-[#3E63F5]/20 flex items-center justify-center text-[#3E63F5] mb-4">
              <Link2 className="w-6 h-6" />
            </div>
            <h3 className="font-[Manrope,sans-serif] text-[20px] font-bold text-[#1F2430] mb-2">Share Profile</h3>
            <p className="text-[14px] text-[#1F2430]/60 font-medium mb-6 flex-1">
              Send your verified profile directly to recruiters to bypass initial technical screens.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-[#1F2430]/10 shadow-sm relative overflow-hidden group">
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white to-transparent" />
                <span className="text-[13px] font-medium text-[#1F2430]/60 truncate select-all pl-1">{candidate.share_url}</span>
                <button 
                  onClick={handleShareProfile}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#F8F9FC] hover:bg-[#EEF1F8] flex items-center justify-center text-[#1F2430] transition-colors border border-[#1F2430]/10 shadow-sm opacity-0 group-hover:opacity-100"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={handleEmailShare}
                className="w-full py-3 rounded-xl bg-white text-[#1F2430] text-[13px] font-bold shadow-sm border border-[#1F2430]/[0.06] hover:bg-[#F3F2F0] transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send via Email
              </button>
            </div>
          </div>
        </AnimatedContent>

        {/* 4. Matches */}
        <AnimatedContent direction="vertical" distance={20} delay={0.25} className="flex flex-col">
          <div className="h-full rounded-[2.5rem] glass-card p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-[Manrope,sans-serif] text-[18px] font-bold text-[#1F2430] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#3E63F5]" /> Matches
              </h3>
              <span className="w-6 h-6 rounded-full bg-[#3E63F5] text-white text-[12px] font-bold flex items-center justify-center">{dashboard.matches_summary.total}</span>
            </div>
            
            <div className="space-y-3 flex-1">
              <div className="text-center py-8 text-[13px] text-[#1F2430]/60 font-medium">
                <Sparkles className="w-8 h-8 text-[#3E63F5]/40 mx-auto mb-2" />
                {dashboard.matches_summary.new_count} new matches available
              </div>
              <button 
                onClick={() => navigate('/candidate/matches')}
                className="w-full py-2.5 rounded-xl bg-[#3E63F5] text-white text-[12px] font-bold shadow-sm hover:bg-[#2A44B0] transition-colors"
              >
                View All Matches
              </button>
            </div>
          </div>
        </AnimatedContent>

        {/* 5. Pipeline */}
        <AnimatedContent direction="vertical" distance={20} delay={0.3} className="flex flex-col">
          <div className="h-full rounded-[2.5rem] glass-card p-6 flex flex-col">
            <h3 className="font-[Manrope,sans-serif] text-[18px] font-bold text-[#1F2430] flex items-center gap-2 mb-6">
              <Briefcase className="w-4 h-4 text-[#8B5CF6]" /> Pipeline
            </h3>
            <div className="flex-1 flex flex-col justify-center gap-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#1F2430]/5">
                <span className="text-[13px] font-medium text-[#1F2430]/70 flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Active Applications</span>
                <span className="text-[14px] font-bold text-[#1F2430]">{dashboard.pipeline_summary.active_applications}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#1F2430]/5">
                <span className="text-[13px] font-medium text-[#1F2430]/70 flex items-center gap-2"><Code2 className="w-3.5 h-3.5" /> Upcoming Interviews</span>
                <span className="text-[14px] font-bold text-[#1F2430]">{dashboard.pipeline_summary.upcoming_interviews}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-medium text-[#1F2430]/70 flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> Pending Responses</span>
                <span className="text-[14px] font-bold text-[#10B981]">{dashboard.pipeline_summary.pending_responses}</span>
              </div>
            </div>
            <button onClick={() => navigate('/candidate/applications')} className="mt-6 w-full py-2.5 rounded-xl bg-white/60 text-[#1F2430] text-[12px] font-bold shadow-sm border border-white hover:bg-white transition-colors">
              View All Applications
            </button>
          </div>
        </AnimatedContent>

        {/* 6. Activity & Growth (Combined or Split) */}
        <AnimatedContent direction="vertical" distance={20} delay={0.35} className="flex flex-col">
          <div className="h-full rounded-[2.5rem] glass-card p-6 flex flex-col relative overflow-hidden">
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#F59E0B]/10 rounded-full blur-[30px] pointer-events-none" />
            <h3 className="font-[Manrope,sans-serif] text-[18px] font-bold text-[#1F2430] flex items-center gap-2 mb-6">
              <TrendingUp className="w-4 h-4 text-[#F59E0B]" /> Growth Activity
            </h3>
            
            <div className="space-y-4 flex-1">
              {dashboard.growth_activity.recent_improvements.slice(0, 3).map((improvement, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`w-8 h-8 rounded-full ${
                    i === 0 ? 'bg-[#10B981]/10 text-[#10B981]' :
                    i === 1 ? 'bg-[#3E63F5]/10 text-[#3E63F5]' :
                    'bg-[#8B5CF6]/10 text-[#8B5CF6]'
                  } flex items-center justify-center shrink-0`}>
                    {i === 0 ? <Eye className="w-4 h-4" /> :
                     i === 1 ? <BarChart3 className="w-4 h-4" /> :
                     <BrainCircuit className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-[#1F2430]">{improvement}</div>
                    <div className="text-[11px] font-medium text-[#1F2430]/50">Recently</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedContent>

      </div>
    </div>
  );
}