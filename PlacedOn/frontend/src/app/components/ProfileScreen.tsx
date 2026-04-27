import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Shield, Sparkles, EyeOff, Calendar, MapPin, Briefcase, ChevronRight,
  GraduationCap, Link2, CheckCircle, AlertCircle, Info, Lock, ShieldCheck,
  CheckCircle2, Share2, Download, Target, Activity, FileCheck2, Fingerprint,
  MoreHorizontal, Clock, Loader2
} from 'lucide-react';
import { AnimatedContent } from "./ui/AnimatedContent";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { demoApi, type HCVResponse, type EvidenceDimension, getDemoModeActive } from "../lib/demoApi";
import { toast } from "sonner";

const PROFILE_DATA = {
  profile_status: {
    state: "Verified Candidate Profile",
    visibility: "Private until published",
    generated_at: "Today, 4:12 PM",
    last_updated: "Today, 4:12 PM",
    version: 1,
    freshness_label: "Fresh Signal (Updated Today)"
  },
  identity: {
    name: "Aisha Sharma",
    target_role: "Frontend Engineer",
    role_track: "Software Engineering",
    experience_level: "Early-career",
    location: "Bengaluru, India",
    work_preference: "Remote or Bengaluru",
    availability: "Open to opportunities"
  },
  summary: "Aisha is a frontend-focused engineer who explains technical decisions clearly and approaches UI problems with structure. She showed strong thinking around component reuse, state management, and debugging under constraints. This profile is an evidence-led synthesis of her verified micro-interview performances, confirming she is ready for frontend product teams that value clarity, ownership, and user-facing quality.",
  top_strengths: [
    {
      title: "Component Architecture",
      confidence: "High Confidence",
      signal: "Strong Signal",
      reason: "Consistently explained how she breaks complex interfaces into reusable components and manages shared state without prop drilling.",
    },
    {
      title: "Debugging Approach",
      confidence: "High Confidence",
      signal: "Strong Signal",
      reason: "Walked through isolating a UI bug step-by-step instead of guessing fixes, demonstrating systematic problem solving.",
    },
    {
      title: "Product Communication",
      confidence: "High Confidence",
      signal: "Moderate Signal",
      reason: "Connected technical tradeoffs to user experience and cross-functional team collaboration during the system design phase.",
    }
  ],
  evidence_backed_skills: [
    { name: "React", signal: "Strong Signal" },
    { name: "TypeScript", signal: "Strong Signal" },
    { name: "State Management", signal: "Strong Signal" },
    { name: "Responsive UI", signal: "High Confidence" },
    { name: "API Integration", signal: "Moderate Signal" },
    { name: "Component Design", signal: "Strong Signal" },
    { name: "Debugging", signal: "High Confidence" },
    { name: "Accessibility", signal: "Needs More Evidence" }
  ],
  work_style: {
    technical_thinking: "Maps the problem out verbally before proposing implementation details.",
    communication_style: "Clear, structured, and comfortable thinking aloud when blocked.",
    problem_solving: "Breaks issues into smaller parts and validates assumptions before acting.",
    collaboration: "Explains technical tradeoffs in a way that aligns perfectly with design and product teams.",
  },
  skills_to_strengthen: [
    {
      title: "Testing Discipline",
      label: "Needs More Evidence",
      note: "Current micro-interviews lack sufficient data around automated testing strategy and edge-case coverage."
    },
    {
      title: "Performance Optimization",
      label: "Needs More Evidence",
      note: "Showed awareness of performance basics, but requires more evidence in optimizing large-scale rendering bottlenecks."
    },
    {
      title: "System Design Breadth",
      label: "Needs More Evidence",
      note: "Strong for frontend component architecture, but broader cross-system infrastructure reasoning needs more signals."
    }
  ],
  role_alignment: {
    primary_fit: "Frontend Engineer",
    adjacent_roles: ["UI Engineer", "Product Engineer", "Design Engineer"],
    fit_label: "Strong Signal Match"
  },
  evidence_highlights: [
    {
      skill: "State Management",
      session: "Technical Screen &#8226; Apr 18",
      highlight: "Described separating global cart state from local UI state to reduce unnecessary re-renders across the product catalog."
    },
    {
      skill: "Debugging",
      session: "Deep Dive &#8226; Apr 20",
      highlight: "Explained how she narrowed a critical rendering bug by methodically checking data flow, component boundaries, and event timing."
    }
  ],
  achievements_and_education: [
    {
      type: "Education",
      title: "B.Tech in Computer Science",
      source: "RV College of Engineering",
      verification: "Self-Reported"
    },
    {
      type: "Experience",
      title: "Frontend Intern",
      source: "Startup internship",
      verification: "Signal Verified"
    }
  ],
  privacy_and_sharing: {
    public_summary_link: "Off",
    visible_to_matching_companies: "Off until published",
    full_profile_access: "Only after candidate approval",
    raw_transcript_visibility: "Private"
  }
};

export function ProfileScreen() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [hcvData, setHcvData] = useState<HCVResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
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
    async function loadHCV() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await demoApi.getHCV();
        setHcvData(data);
      } catch (err) {
        console.error('Failed to load HCV data:', err);
        setError('Unable to load profile data');
      } finally {
        setIsLoading(false);
      }
    }
    loadHCV();
  }, []);

  const handleShareProfile = async () => {
    const profileUrl = 'https://placedon.com/profile/aisha-sharma-blr-2024';
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success('Profile link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handlePublishProfile = () => {
    setIsPublished(true);
    toast.success('Profile published! Employers can now discover you.');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] font-[Inter,sans-serif] gap-4">
        <Loader2 className="w-10 h-10 text-[#3E63F5] animate-spin" />
        <p className="text-[14px] font-semibold text-[#1F2430]/60">Loading profile data...</p>
      </div>
    );
  }

  // Error state
  if (error || !hcvData) {
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
              <p className="text-[14px] text-[#1F2430]/60">
                {error || 'Unable to load profile. Please check your backend connection and try again.'}
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

  // Extract dimensions for display
  const topStrengths = hcvData.dimensions.slice(0, 3);
  const allSkills = hcvData.dimensions.map(d => ({
    name: d.dimension,
    signal: d.confidence > 0.85 ? 'Strong Signal' : d.confidence > 0.7 ? 'Moderate Signal' : 'Needs More Evidence'
  }));

  return (
    <div className="flex flex-col gap-6 font-[Inter,sans-serif] pb-12 animate-[pulse-glow_0.5s_ease-out]">
      
      {isDemoMode && (
        <div className="bg-[#1F2430] text-white px-4 py-3 rounded-xl flex items-center justify-between shadow-lg mx-auto w-full max-w-4xl">
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

      {/* Unified Profile Header */}
      <AnimatedContent direction="vertical" distance={20} delay={0}>
        <div className="glass-card rounded-[2rem] p-6 sm:p-8 border border-white/80 shadow-[0_4px_24px_rgba(30,35,60,0.03)] flex flex-col lg:flex-row gap-8 lg:items-center justify-between relative overflow-hidden bg-gradient-to-br from-white to-[#F8F9FC]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#3E63F5]/10 to-transparent pointer-events-none rounded-tr-[2rem]" />

          {/* Left Side: Identity & Meta */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-white to-[#EEF1F8] flex items-center justify-center border border-[#1F2430]/10 shadow-md text-[#1F2430] text-3xl font-[Manrope,sans-serif] font-extrabold">
                {PROFILE_DATA.identity.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#10B981] border-2 border-white flex items-center justify-center shadow-sm" title="Verified Profile">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
            </div>

            <div>
              <h1 className="font-[Manrope,sans-serif] text-[28px] sm:text-[32px] font-extrabold text-[#1F2430] leading-tight tracking-tight mb-1">
                {PROFILE_DATA.identity.name}
              </h1>
              <div className="text-[16px] font-semibold text-[#1F2430]/70 mb-3">
                {PROFILE_DATA.identity.target_role} &#8226; {PROFILE_DATA.identity.location}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 text-[13px] font-bold text-[#1F2430]/50">
                  <Clock className="w-3.5 h-3.5" /> Updated today
                </span>
                <span className="hidden sm:block w-1 h-1 rounded-full bg-[#1F2430]/20" />
                <span className="flex items-center gap-1.5 text-[13px] font-bold text-[#1F2430]/50">
                  <Lock className="w-3.5 h-3.5" /> Private until published
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Actions & Toggles */}
          <div className="flex flex-col gap-4 relative z-10 w-full lg:w-auto">
            {/* Availability Toggle */}
            <div className="flex items-center justify-between lg:justify-end gap-4 bg-white/60 px-4 py-2.5 rounded-xl border border-[#1F2430]/5 shadow-sm self-start lg:self-end w-full lg:w-auto">
              <span className="text-[13px] font-bold text-[#1F2430]/70">Open to offers</span>
              <button
                onClick={() => setIsAvailable(!isAvailable)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${isAvailable ? 'bg-[#10B981]' : 'bg-[#1F2430]/20'}`}
                aria-label="Toggle availability"
              >
                <motion.div
                  layout
                  className="w-4 h-4 bg-white rounded-full shadow-sm"
                  animate={{ x: isAvailable ? 20 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Primary Actions */}
            <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto">
              <button
                onClick={handleShareProfile}
                className="flex-1 lg:flex-none px-5 py-2.5 rounded-xl bg-white text-[#1F2430] text-[14px] font-bold shadow-sm border border-[#1F2430]/10 hover:bg-[#F8F9FC] transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" /> Share Profile
              </button>
              <button
                onClick={handlePublishProfile}
                disabled={isPublished}
                className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-[14px] font-bold shadow-[0_4px_16px_rgba(62,99,245,0.25)] transition-colors ${
                  isPublished
                    ? 'bg-[#10B981] text-white cursor-default'
                    : 'bg-[#3E63F5] text-white hover:bg-[#2A44B0]'
                }`}
              >
                {isPublished ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 inline mr-1.5" /> Published
                  </>
                ) : (
                  'Publish Profile'
                )}
              </button>
              {/* Export Overflow */}
              <button
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-white text-[#1F2430]/40 border border-[#1F2430]/10 hover:bg-[#F8F9FC] hover:text-[#1F2430] transition-colors shadow-sm shrink-0"
                title="More Options"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </AnimatedContent>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Main Flow) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* AI Summary Card (Editorial overview) */}
          <AnimatedContent direction="vertical" distance={20} delay={0.15}>
            <div className="glass-card rounded-[2rem] p-8 sm:p-10 border border-white/80 shadow-[0_4px_24px_rgba(30,35,60,0.03)] bg-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#3E63F5]" />
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#3E63F5]/5 rounded-full blur-[60px] pointer-events-none" />
              
              <h2 className="font-[Manrope,sans-serif] text-[24px] font-extrabold text-[#1F2430] tracking-tight mb-4 relative z-10 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-[#3E63F5]" /> The TL;DR
              </h2>
              <p className="text-[18px] leading-[1.8] font-medium text-[#1F2430]/80 text-pretty relative z-10 font-[serif] italic">
                "{hcvData.summary}"
              </p>
            </div>
          </AnimatedContent>

          {/* Top Strengths (Evidence-Backed) */}
          <AnimatedContent direction="vertical" distance={20} delay={0.2}>
            <h3 className="font-[Manrope,sans-serif] text-[15px] font-extrabold text-[#1F2430]/90 tracking-tight mb-4 px-1 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#10B981]" /> Verified Strengths
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {topStrengths.map((dim, i) => (
                <div key={i} className="p-6 rounded-[1.5rem] bg-white border border-[#1F2430]/[0.06] shadow-sm flex flex-col gap-4 hover:shadow-[0_8px_24px_rgba(30,35,60,0.04)] transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#10B981]/5 to-transparent pointer-events-none rounded-bl-full" />

                  <h4 className="font-[Manrope,sans-serif] font-extrabold text-[#1F2430] text-[18px] leading-tight z-10">{dim.dimension}</h4>

                  <div className="flex flex-col gap-1.5 self-start z-10">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#10B981]/10 text-[#10B981] text-[11px] font-bold uppercase tracking-wider">
                      <Target className="w-3.5 h-3.5" /> {dim.label || `Score: ${dim.score.toFixed(2)}`}
                    </div>
                  </div>

                  <p className="text-[14px] text-[#1F2430]/70 font-medium leading-[1.6] mt-auto pt-2 z-10">
                    {dim.evidence_snippets[0] || 'Strong evidence observed in verified micro-interviews.'}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedContent>

          {/* Verified Skills (Clean Layout) */}
          <AnimatedContent direction="vertical" distance={20} delay={0.25}>
            <div className="glass-card rounded-[2rem] p-8 border border-white/80 shadow-[0_4px_24px_rgba(30,35,60,0.03)] mt-2 bg-white/60">
              <h3 className="font-[Manrope,sans-serif] text-[16px] font-extrabold text-[#1F2430] mb-6">Skill Verification Stack</h3>
              <div className="flex flex-wrap gap-3">
                {allSkills.map((skill, i) => {
                  let signalLabel = skill.signal;
                  let colorClass = "bg-[#1F2430]/5 text-[#1F2430]/60 border-transparent";
                  
                  // Simplify the labels to max 3 states as requested
                  if (skill.signal === 'Strong Signal' || skill.signal === 'High Confidence') {
                    signalLabel = 'Strong signal';
                    colorClass = 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20';
                  } else if (skill.signal === 'Needs More Evidence') {
                    signalLabel = 'Needs more evidence';
                    colorClass = 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20';
                  } else {
                    signalLabel = 'Supported signal';
                    colorClass = 'bg-[#3E63F5]/10 text-[#3E63F5] border-[#3E63F5]/20';
                  }

                  return (
                    <div key={i} className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl bg-white border border-[#1F2430]/10 shadow-sm">
                      <span className="text-[#1F2430]/90 text-[14px] font-bold">{skill.name}</span>
                      <span className={`text-[11px] font-bold px-2 py-1 rounded-lg border ${colorClass}`}>
                        {signalLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </AnimatedContent>

          {/* Evidence Highlights */}
          <AnimatedContent direction="vertical" distance={20} delay={0.25}>
            <div className="glass-card rounded-[2rem] p-8 border border-white/80 shadow-[0_4px_24px_rgba(30,35,60,0.03)] mt-2">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-[#3E63F5]" />
                <h3 className="font-[Manrope,sans-serif] text-[20px] font-extrabold text-[#1F2430]">Direct Signal Highlights</h3>
              </div>
              <div className="space-y-6">
                {hcvData.dimensions.slice(0, 4).map((dim, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="w-10 h-10 rounded-xl bg-[#3E63F5]/10 border border-[#3E63F5]/20 text-[#3E63F5] flex items-center justify-center shrink-0">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-[Manrope,sans-serif] font-bold text-[#1F2430] text-[16px]">{dim.dimension}</h4>
                        <span className="text-[12px] font-bold text-[#1F2430]/40 px-2 py-0.5 rounded-md bg-[#1F2430]/5">
                          Score: {dim.score.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[15px] text-[#1F2430]/70 font-medium leading-relaxed bg-white/60 p-4 rounded-xl border border-white shadow-sm italic relative">
                        <span className="absolute -left-2 -top-2 text-4xl text-[#1F2430]/10 font-serif">"</span>
                        {dim.evidence_snippets[0] || 'Evidence captured from verified micro-interview performance.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedContent>

          {/* How You Work */}
          <AnimatedContent direction="vertical" distance={20} delay={0.3}>
            <div className="glass-card rounded-[2rem] p-8 border border-white/80 shadow-[0_4px_24px_rgba(30,35,60,0.03)] mt-2">
              <h3 className="font-[Manrope,sans-serif] text-[20px] font-extrabold text-[#1F2430] mb-8">Observed Working Style</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-10">
                {hcvData.dimensions.slice(0, 4).map((dim, idx) => (
                  <div key={idx}>
                    <div className="text-[13px] font-extrabold text-[#1F2430]/40 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Fingerprint className="w-3.5 h-3.5" /> {dim.dimension}
                    </div>
                    <p className="text-[15px] text-[#1F2430]/80 font-medium leading-relaxed">
                      {dim.evidence_snippets[0] || `Demonstrated competency with confidence ${(dim.confidence * 100).toFixed(0)}%`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedContent>

        </div>

        {/* Right Column (Sidebar Flow) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Compact Profile Overview */}
          <AnimatedContent direction="vertical" distance={20} delay={0.15}>
            <div className="glass-card rounded-[2rem] p-6 border border-white/80 bg-white/60 shadow-[0_4px_24px_rgba(30,35,60,0.03)] relative overflow-hidden flex flex-col gap-5">
              
              <div>
                <h3 className="font-[Manrope,sans-serif] text-[12px] font-extrabold text-[#1F2430]/40 uppercase tracking-wider mb-2">Role Match</h3>
                <div className="font-[Manrope,sans-serif] text-[20px] font-extrabold text-[#1F2430] leading-tight">
                  {PROFILE_DATA.role_alignment.primary_fit}
                </div>
                <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#10B981]/10 text-[#10B981] text-[12px] font-bold">
                  <Activity className="w-3.5 h-3.5" /> {PROFILE_DATA.role_alignment.fit_label}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#1F2430]/[0.06]">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[#1F2430]/60 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> Visibility
                  </span>
                  <span className="text-[13px] font-bold text-[#1F2430]">{PROFILE_DATA.profile_status.visibility}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[#1F2430]/60 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Last active
                  </span>
                  <span className="text-[13px] font-bold text-[#1F2430]">Updated today</span>
                </div>
              </div>

              <div className="bg-[#3E63F5]/5 border border-[#3E63F5]/10 rounded-xl p-4 flex items-start gap-3 mt-1">
                <ShieldCheck className="w-5 h-5 text-[#3E63F5] shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-[13px] font-bold text-[#1F2430]">Verified Asset</h5>
                  <p className="text-[12px] text-[#1F2430]/60 font-medium mt-0.5">This profile is generated strictly from micro-interview evidence.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-1">
                 <button
                   onClick={handleShareProfile}
                   className="py-2.5 rounded-xl bg-white text-[#1F2430] text-[13px] font-bold shadow-sm border border-[#1F2430]/10 hover:bg-[#F8F9FC] transition-colors"
                 >
                  Share
                 </button>
                 <button
                   onClick={handlePublishProfile}
                   disabled={isPublished}
                   className={`py-2.5 rounded-xl text-[13px] font-bold shadow-sm transition-colors ${
                     isPublished
                       ? 'bg-[#10B981] text-white cursor-default'
                       : 'bg-[#3E63F5] text-white hover:bg-[#2A44B0]'
                   }`}
                 >
                  {isPublished ? 'Published' : 'Publish'}
                 </button>
              </div>

            </div>
          </AnimatedContent>

          {/* Missing Evidence */}
          <AnimatedContent direction="vertical" distance={20} delay={0.25}>
            <div className="glass-card rounded-[2rem] p-6 border border-[#F59E0B]/20 bg-gradient-to-b from-[#F59E0B]/5 to-transparent">
              <div className="flex items-center gap-2 mb-5">
                <Info className="w-5 h-5 text-[#F59E0B]" />
                <h3 className="font-[Manrope,sans-serif] text-[18px] font-extrabold text-[#1F2430]">Missing Evidence</h3>
              </div>
              <div className="space-y-5">
                {hcvData.dimensions.filter(d => d.confidence < 0.7).slice(0, 3).map((dim, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-[Manrope,sans-serif] font-bold text-[#1F2430] text-[14px]">{dim.dimension}</h4>
                      <span className="text-[10px] font-extrabold uppercase tracking-wide bg-[#F59E0B]/10 text-[#F59E0B] px-2 py-0.5 rounded">
                        Needs More Evidence
                      </span>
                    </div>
                    <p className="text-[13px] text-[#1F2430]/60 font-medium leading-relaxed">
                      Current confidence: {(dim.confidence * 100).toFixed(0)}%. Additional micro-interviews needed to strengthen this signal.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedContent>

          {/* HCV Metadata */}
          <AnimatedContent direction="vertical" distance={20} delay={0.28}>
            <div className="glass-card rounded-[2rem] p-6 border border-white/80 shadow-sm bg-white/40">
              <h3 className="font-[Manrope,sans-serif] text-[18px] font-extrabold text-[#1F2430] mb-5">Vector Metadata</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[#1F2430]/60">Embedding Model</span>
                  <span className="text-[13px] font-bold text-[#1F2430]">{hcvData.embedding_metadata.model}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[#1F2430]/60">Dimensions</span>
                  <span className="text-[13px] font-bold text-[#1F2430]">{hcvData.embedding_metadata.dimension_count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[#1F2430]/60">Last Updated</span>
                  <span className="text-[13px] font-bold text-[#1F2430]">
                    {new Date(hcvData.embedding_metadata.last_updated).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </AnimatedContent>

          {/* Verification States */}
          <AnimatedContent direction="vertical" distance={20} delay={0.3}>
            <div className="glass-card rounded-[2rem] p-6 border border-white/80 shadow-sm bg-white/40">
              <h3 className="font-[Manrope,sans-serif] text-[18px] font-extrabold text-[#1F2430] mb-5">Verification Log</h3>
              <div className="space-y-4">
                {PROFILE_DATA.achievements_and_education.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-[#1F2430]/5 flex items-center justify-center shrink-0 text-[#1F2430]/40">
                      {item.type === 'Education' ? <GraduationCap className="w-5 h-5" /> : item.type === 'Project' ? <Link2 className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#1F2430] text-[14px] leading-tight mb-1">{item.title}</h4>
                      <div className="text-[13px] font-medium text-[#1F2430]/60 mb-2">{item.source}</div>
                      <div className="flex items-center justify-between">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-extrabold uppercase tracking-wide shadow-sm ${
                          item.verification === 'Self-Reported' 
                            ? 'bg-white border-[#1F2430]/10 text-[#1F2430]/40' 
                            : 'bg-[#10B981]/10 border-[#10B981]/20 text-[#10B981]'
                        }`}>
                          {item.verification === 'Self-Reported' ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                          {item.verification}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedContent>

        </div>
      </div>
    </div>
  );
}