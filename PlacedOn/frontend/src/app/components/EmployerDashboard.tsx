import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Filter, Briefcase, Bookmark, UserPlus, ShieldCheck,
  ChevronRight, Lock, MapPin, Zap, CheckCircle2, TrendingUp, X, Loader2, AlertCircle
} from "lucide-react";
import { AnimatedContent } from "./ui/AnimatedContent";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { DotGrid } from "./ui/DotGrid";
import { Orb } from "./ui/Orb";
import { demoApi, type EmployerResponse, type Job, type DiscoveryCandidate, getDemoModeActive } from "../lib/demoApi";

export function EmployerDashboard() {
  const [employerData, setEmployerData] = useState<EmployerResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [savedCandidates, setSavedCandidates] = useState<string[]>([]);
  const [passedCandidates, setPassedCandidates] = useState<string[]>([]);
  const [requestedIntros, setRequestedIntros] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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
    async function loadEmployerData() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await demoApi.getEmployer();
        setEmployerData(data);

        // Set first job as active by default
        if (data.jobs.length > 0) {
          setActiveJobId(data.jobs[0].id);
        }

        // Initialize saved candidates from shortlist
        setSavedCandidates(data.shortlist.map(c => c.id));

        // Initialize requested intros
        setRequestedIntros(data.intro_requests.map(r => r.candidate_id));
      } catch (err) {
        console.error('Failed to load employer data:', err);
        setError('Unable to load employer dashboard');
      } finally {
        setIsLoading(false);
      }
    }
    loadEmployerData();
  }, []);

  const handleSave = (id: string) => {
    setSavedCandidates(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const handlePass = (id: string) => {
    setPassedCandidates(prev => [...prev, id]);
  };

  const handleRequestIntro = (id: string) => {
    setRequestedIntros(prev => [...prev, id]);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#F8F7F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#3E63F5] animate-spin" />
          <p className="text-[14px] font-semibold text-[#1F2430]/60">Loading employer dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !employerData) {
    return (
      <div className="min-h-screen w-full bg-[#F8F7F5] flex items-center justify-center p-4 md:p-6">
        <div className="glass-card rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-2xl w-full border border-white shadow-sm">
          <div className="flex items-start md:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B] shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-[Manrope,sans-serif] text-[18px] font-bold text-[#1F2430] mb-1">
                Demo Data Unavailable
              </h3>
              <p className="text-[14px] text-[#1F2430]/60">
                {error || 'Could not connect to the backend. Please check your connection and try again.'}
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

  // Filter out passed candidates from the discovery feed
  const candidates = employerData.discovery_feed.filter(c => !passedCandidates.includes(c.id));
  const jobs = employerData.jobs;

  return (
    <div className="min-h-screen w-full bg-[#F8F7F5] relative overflow-hidden font-[Inter,sans-serif] selection:bg-[#10B981] selection:text-white">
      {/* Background & Textures */}
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.9), 0 12px 40px rgba(30, 35, 60, 0.04);
        }
        .noise-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.15;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      {/* Corporate/Restrained ambient orbs */}
      <Orb color="#10B981" size={500} opacity={0.06} blur={130} className="top-[-10%] left-[-5%]" duration={25} />
      <Orb color="#3E63F5" size={400} opacity={0.04} blur={120} className="bottom-[10%] right-[-5%]" duration={20} />

      <DotGrid opacity={0.06} size={1} spacing={28} />
      <div className="noise-overlay" />

      {/* Top Navigation Bar */}
      <header className="relative z-10 w-full border-b border-[#1F2430]/5 bg-white/60 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#10B981] flex items-center justify-center text-white font-bold font-[Manrope,sans-serif] shadow-sm">P</div>
            <span className="font-[Manrope,sans-serif] text-[16px] font-bold text-[#1F2430] tracking-tight">PlacedOn</span>
            <span className="px-2 py-0.5 rounded-md bg-[#1F2430]/5 text-[#1F2430]/60 text-[11px] font-bold uppercase tracking-wider ml-2 hidden sm:block">Employer</span>
            {isDemoMode && (
              <span className="px-2 py-0.5 rounded-md bg-[#F59E0B]/10 text-[#F59E0B] text-[10px] font-bold uppercase tracking-wider border border-[#F59E0B]/20 ml-2">
                Demo Data
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 mr-4 text-[13px] font-semibold text-[#1F2430]/60">
              <span className="hover:text-[#1F2430] cursor-pointer transition-colors text-[#1F2430]">Discovery</span>
              <span className="hover:text-[#1F2430] cursor-pointer transition-colors">Interviews</span>
              <span className="hover:text-[#1F2430] cursor-pointer transition-colors">Settings</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1F2430] to-[#3E63F5] p-[1.5px] cursor-pointer">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-[#E2E8F0]" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-6 py-8">
        
        {/* Page Header */}
        <AnimatedContent direction="vertical" distance={20} delay={0}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="font-[Manrope,sans-serif] text-2xl md:text-3xl font-extrabold text-[#1F2430] mb-2 leading-tight">
                Evidence-backed candidate discovery
              </h1>
              <p className="text-[14px] text-[#1F2430]/60 font-medium">
                Find candidates based on verified interview performance, not resume claims.
              </p>
            </div>
            
            {/* Metrics */}
            <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              {[
                { label: "Open Jobs", value: jobs.length.toString(), icon: <Briefcase className="w-4 h-4" /> },
                { label: "Saved Profiles", value: savedCandidates.length.toString(), icon: <Bookmark className="w-4 h-4" /> },
                { label: "Intro Requests", value: employerData.intro_requests.length.toString(), icon: <UserPlus className="w-4 h-4" /> },
              ].map((metric, i) => (
                <div key={i} className="glass-card rounded-xl px-4 py-3 min-w-[130px] shrink-0 border border-white flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-[#1F2430]/50 mb-2">
                    {metric.icon}
                    <span className="text-[11px] font-bold uppercase tracking-wider">{metric.label}</span>
                  </div>
                  <span className="font-[Manrope,sans-serif] text-xl font-bold text-[#1F2430]">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedContent>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_300px] gap-6 xl:gap-8 items-start">
          
          {/* Left Sidebar: Job Selection */}
          <AnimatedContent direction="horizontal" distance={-20} delay={0.1} className="hidden lg:block sticky top-24">
            <div className="mb-4">
              <h3 className="text-[12px] font-bold text-[#1F2430]/50 uppercase tracking-wider mb-3 px-1">Active Roles</h3>
              <div className="space-y-1.5">
                {jobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => setActiveJobId(job.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all ${
                      activeJobId === job.id
                        ? "bg-white shadow-sm border border-white/80"
                        : "hover:bg-white/40 text-[#1F2430]/60 hover:text-[#1F2430]"
                    }`}
                  >
                    <div className="font-semibold text-[13px] truncate mb-0.5" style={{ color: activeJobId === job.id ? "#1F2430" : "inherit" }}>
                      {job.title}
                    </div>
                    <div className="text-[11px] font-medium opacity-60 flex items-center justify-between">
                      {job.department}
                      {activeJobId === job.id && <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />}
                    </div>
                  </button>
                ))}
              </div>
              <button className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-[#1F2430]/20 text-[13px] font-bold text-[#1F2430]/50 hover:bg-[#1F2430]/5 hover:text-[#1F2430] transition-colors">
                <Briefcase className="w-3.5 h-3.5" /> Add New Role
              </button>
            </div>
          </AnimatedContent>

          {/* Middle: Feed & Filters */}
          <div className="flex flex-col gap-5 min-w-0">
            
            {/* Filter Bar */}
            <AnimatedContent direction="vertical" distance={20} delay={0.15}>
              <div className="glass-card rounded-[1.25rem] p-2 flex flex-col md:flex-row items-center gap-2 shadow-sm border border-white sticky top-24 z-30">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1F2430]/40" />
                  <input 
                    type="text" 
                    placeholder="Search traits, skills, or locations..." 
                    className="w-full bg-white/50 border border-transparent focus:border-white/80 focus:bg-white focus:ring-2 focus:ring-[#10B981]/20 rounded-xl py-2 pl-10 pr-4 text-[13px] font-medium outline-none transition-all placeholder:text-[#1F2430]/40 text-[#1F2430]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 hide-scrollbar px-1">
                  <button className="px-3 py-2.5 rounded-lg bg-white/60 border border-white/80 text-[12px] font-bold text-[#1F2430]/70 hover:bg-white transition-colors whitespace-nowrap flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Match &gt; 90%
                  </button>
                  <button className="px-3 py-2.5 rounded-lg bg-white/60 border border-white/80 text-[12px] font-bold text-[#1F2430]/70 hover:bg-white transition-colors whitespace-nowrap">
                    Remote Only
                  </button>
                  <button className="px-3 py-2.5 rounded-lg bg-[#1F2430]/5 text-[12px] font-bold text-[#1F2430]/60 hover:bg-[#1F2430]/10 transition-colors whitespace-nowrap flex items-center gap-1.5 ml-auto">
                    <Filter className="w-3.5 h-3.5" /> All Filters
                  </button>
                </div>
              </div>
            </AnimatedContent>

            {/* Candidate Feed */}
            <div className="space-y-4 pb-20">
              {candidates.map((candidate, i) => (
                <AnimatedContent key={candidate.id} direction="vertical" distance={20} delay={0.2 + (i * 0.05)}>
                  <motion.div
                    className="glass-card rounded-[1.5rem] p-5 md:p-6 border border-white relative overflow-hidden group hover:shadow-[0_16px_48px_rgba(30,35,60,0.06)] transition-all"
                  >
                    {/* Top Row: Anonymous ID & Match Score */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1F2430] to-[#4A5568] flex items-center justify-center p-[2px] shadow-sm">
                          <div className="w-full h-full rounded-full bg-[#1F2430] border-2 border-white flex items-center justify-center">
                            <Lock className="w-4 h-4 text-white/50" />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-[Manrope,sans-serif] font-bold text-[#1F2430] text-[15px]">{candidate.name}</h3>
                            <span className="w-2 h-2 rounded-full bg-[#3E63F5] shadow-[0_0_8px_rgba(62,99,245,0.6)]" />
                          </div>
                          <p className="text-[12px] text-[#1F2430]/50 font-medium flex items-center gap-1.5 mt-0.5">
                            <TrendingUp className="w-3 h-3" /> {candidate.target_role}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20">
                          <Zap className="w-4 h-4 text-[#10B981]" />
                          <span className="font-bold text-[14px] text-[#10B981]">{candidate.match_score}% Fit</span>
                        </div>
                        <span className="text-[11px] font-bold text-[#1F2430]/40 uppercase tracking-wider mt-1.5 mr-1">{candidate.evidence_strength}</span>
                      </div>
                    </div>

                    {/* Middle Row: Key Signals */}
                    <div className="bg-white/50 rounded-2xl p-4 border border-white/60 mb-5">
                      <div>
                        <p className="text-[11px] font-bold text-[#1F2430]/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Key Signals
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {candidate.key_signals.map((signal, idx) => (
                            <span key={idx} className="px-2 py-1 rounded-md bg-white border border-[#1F2430]/5 text-[12px] font-bold text-[#1F2430]/80 shadow-sm">
                              {signal}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Metadata & Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-4 text-[12px] font-medium text-[#1F2430]/60 w-full sm:w-auto">
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {candidate.location}</span>
                        <span className="flex items-center gap-1.5">Available from {candidate.available_from}</span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                        <button
                          onClick={() => handlePass(candidate.id)}
                          className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/60 border border-white text-[#1F2430]/60 text-[13px] font-bold hover:bg-white hover:text-[#1F2430] transition-colors shadow-sm"
                        >
                          Pass
                        </button>
                        <button
                          onClick={() => handleSave(candidate.id)}
                          className={`flex-none w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-sm border ${
                            savedCandidates.includes(candidate.id)
                              ? "bg-[#1F2430] border-[#1F2430] text-white"
                              : "bg-white border-white/80 text-[#1F2430]/50 hover:text-[#1F2430]"
                          }`}
                        >
                          <Bookmark className="w-5 h-5" fill={savedCandidates.includes(candidate.id) ? "currentColor" : "none"} />
                        </button>
                        <button
                          onClick={() => handleRequestIntro(candidate.id)}
                          disabled={requestedIntros.includes(candidate.id)}
                          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                            requestedIntros.includes(candidate.id)
                              ? "bg-[#1F2430]/10 text-[#1F2430] border border-[#1F2430]/20 cursor-default"
                              : "bg-[#10B981] text-white shadow-[0_4px_16px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_24px_rgba(16,185,129,0.4)]"
                          }`}
                        >
                          {requestedIntros.includes(candidate.id) ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" /> Intro Requested
                            </>
                          ) : (
                            <>
                              Request Intro
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                  </motion.div>
                </AnimatedContent>
              ))}
            </div>

          </div>

          {/* Right Sidebar: Trust/Privacy & Shortlist */}
          <div className="hidden xl:flex flex-col gap-6 sticky top-24">
            
            <AnimatedContent direction="horizontal" distance={20} delay={0.2}>
              <div className="glass-card rounded-[1.5rem] p-5 border border-white shadow-[0_16px_40px_rgba(30,35,60,0.03)] bg-gradient-to-b from-white/60 to-white/30">
                <div className="w-10 h-10 rounded-xl bg-[#1F2430] text-white flex items-center justify-center mb-4 shadow-md">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-[Manrope,sans-serif] text-[15px] font-bold text-[#1F2430] mb-2">Evidence First, Bias Last</h3>
                <p className="text-[13px] text-[#1F2430]/60 font-medium leading-relaxed mb-4">
                  Candidates remain completely anonymous. You evaluate verified skills, match scores, and interview performance before seeing demographic data.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-[#1F2430]/70">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Processed profile, no raw transcript
                  </div>
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-[#1F2430]/70">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Identity hidden until candidate approval
                  </div>
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-[#1F2430]/70">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Two-way opt-in for intro requests
                  </div>
                </div>
              </div>
            </AnimatedContent>

            <AnimatedContent direction="horizontal" distance={20} delay={0.3}>
              <div className="glass-card rounded-[1.5rem] p-5 border border-white shadow-[0_8px_32px_rgba(30,35,60,0.03)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-[Manrope,sans-serif] text-[14px] font-bold text-[#1F2430]">Saved Shortlist</h3>
                  <span className="w-6 h-6 rounded-full bg-[#1F2430]/10 flex items-center justify-center text-[11px] font-bold text-[#1F2430]">{savedCandidates.length}</span>
                </div>
                
                {employerData.shortlist.length === 0 ? (
                  <div className="text-center py-6 text-[13px] font-medium text-[#1F2430]/40 border border-dashed border-[#1F2430]/10 rounded-xl bg-white/30">
                    No candidates saved yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {employerData.shortlist.map(candidate => (
                      <div key={candidate.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/60 border border-white shadow-sm group">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#1F2430] flex items-center justify-center">
                            <Lock className="w-3 h-3 text-white/50" />
                          </div>
                          <div>
                            <div className="text-[12px] font-bold text-[#1F2430]">{candidate.name}</div>
                            <div className="text-[10px] font-semibold text-[#10B981]">{candidate.match_score}% Fit</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleSave(candidate.id)}
                          className="w-6 h-6 rounded-md flex items-center justify-center text-[#1F2430]/30 hover:bg-[#1F2430]/10 hover:text-[#1F2430] transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {savedCandidates.length > 0 && (
                  <button className="w-full mt-4 py-2.5 rounded-xl bg-[#1F2430] text-white text-[12px] font-bold shadow-sm hover:shadow-md transition-shadow">
                    Review Shortlist
                  </button>
                )}
              </div>
            </AnimatedContent>

          </div>
        </div>

      </div>
    </div>
  );
}
