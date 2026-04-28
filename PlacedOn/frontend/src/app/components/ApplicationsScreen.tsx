import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileCheck, Eye, Heart, Target, Users, Trophy, Archive, 
  ArrowRight, Clock, MapPin, Building2, PlayCircle, Star, AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { AnimatedContent } from "./ui/AnimatedContent";
import { demoApi, Application as APIApplication, getDemoModeActive } from "../lib/demoApi";

type ApplicationStage = 'applied' | 'reviewing' | 'interest' | 'follow-up' | 'interviewing' | 'offer' | 'closed';

const STAGES: { id: ApplicationStage; label: string; icon: any; color: string; bgColor: string }[] = [
  { id: 'applied', label: 'Applied', icon: <FileCheck className="w-4 h-4" />, color: 'text-[#1F2430]/60', bgColor: 'bg-white/40' },
  { id: 'reviewing', label: 'Reviewing', icon: <Eye className="w-4 h-4" />, color: 'text-[#3B82F6]', bgColor: 'bg-[#3B82F6]/10' },
  { id: 'interest', label: 'Interest Received', icon: <Heart className="w-4 h-4" />, color: 'text-[#EC4899]', bgColor: 'bg-[#EC4899]/10' },
  { id: 'follow-up', label: 'Follow-up Requested', icon: <Target className="w-4 h-4" />, color: 'text-[#F59E0B]', bgColor: 'bg-[#F59E0B]/10' },
  { id: 'interviewing', label: 'Interviewing', icon: <Users className="w-4 h-4" />, color: 'text-[#8B5CF6]', bgColor: 'bg-[#8B5CF6]/10' },
  { id: 'offer', label: 'Offer', icon: <Trophy className="w-4 h-4" />, color: 'text-[#10B981]', bgColor: 'bg-[#10B981]/10' },
  { id: 'closed', label: 'Closed', icon: <Archive className="w-4 h-4" />, color: 'text-[#1F2430]/40', bgColor: 'bg-[#1F2430]/5' },
];

export function ApplicationsScreen() {
  const navigate = useNavigate();
  const [apps, setApps] = useState<APIApplication[]>([]);
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
    async function loadApplications() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await demoApi.getApplications();
        setApps(data.applications);
      } catch (err) {
        console.error('Failed to load applications:', err);
        setError('Unable to load applications data. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    }
    loadApplications();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col h-full min-h-[calc(100vh-140px)]">
        <div className="rounded-[2.5rem] glass-card p-8 h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#3E63F5]/20 border-t-[#3E63F5] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[14px] font-medium text-[#1F2430]/60">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col h-full min-h-[calc(100vh-140px)]">
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

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-140px)] animate-[pulse-glow_0.5s_ease-out]">
      
      {isDemoMode && (
        <div className="bg-[#1F2430] text-white px-4 py-3 rounded-xl flex items-center justify-between shadow-lg mb-6">
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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 z-20">
        <div>
          <h2 className="font-[Manrope,sans-serif] text-[32px] font-extrabold text-[#1F2430] tracking-tight leading-tight">
            Application Pipeline
          </h2>
          <p className="text-[15px] font-medium text-[#1F2430]/60 mt-1">
            Track your matches and active hiring stages.
          </p>
        </div>
      </div>

      {/* Horizontal Pipeline Board */}
      <div className="flex-1 w-full overflow-x-auto pb-12 snap-x snap-mandatory hide-scrollbar relative">
        
        {/* Visual Connector Line (behind columns) */}
        <div className="absolute top-[38px] left-[150px] right-[150px] h-[2px] bg-gradient-to-r from-transparent via-[#1F2430]/10 to-transparent pointer-events-none hidden md:block" />

        <div className="flex gap-6 min-w-max px-2 relative z-10">
          {STAGES.map((stage, index) => {
            const stageApps = apps.filter(app => app.stage.toLowerCase() === stage.id);
            
            return (
              <AnimatedContent 
                key={stage.id} 
                direction="horizontal" 
                distance={20} 
                delay={index * 0.05}
                className="w-[85vw] max-w-[320px] shrink-0 snap-center flex flex-col"
              >
                {/* Stage Column Header */}
                <div className={`glass-card rounded-[1.5rem] p-4 border border-white/60 mb-5 relative flex items-center justify-between shadow-sm`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${stage.bgColor} ${stage.color} border border-white/40 shadow-inner`}>
                      {stage.icon}
                    </div>
                    <span className="font-[Manrope,sans-serif] font-bold text-[15px] text-[#1F2430]">
                      {stage.label}
                    </span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white border border-[#1F2430]/5 flex items-center justify-center text-[12px] font-extrabold text-[#1F2430]/50 shadow-sm">
                    {stageApps.length}
                  </div>
                </div>

                {/* Cards Container */}
                <div className="flex flex-col gap-4 flex-1">
                  <AnimatePresence>
                    {stageApps.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-24 rounded-[1.5rem] border-2 border-dashed border-[#1F2430]/10 flex items-center justify-center bg-white/20"
                      >
                        <span className="text-[13px] font-bold text-[#1F2430]/30">No active roles</span>
                      </motion.div>
                    ) : (
                      stageApps.map((app, i) => (
                        <motion.div
                          key={app.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + (i * 0.05) }}
                          className="glass-card rounded-[1.5rem] p-5 border border-white/80 shadow-[0_4px_16px_rgba(30,35,60,0.03)] hover:shadow-[0_12px_32px_rgba(30,35,60,0.06)] hover:-translate-y-1 transition-all duration-300 group cursor-default relative overflow-hidden"
                        >
                          {/* Accent Gradient based on Stage */}
                          {app.stage.toLowerCase() === 'interest' && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#EC4899] to-[#F472B6]" />}
                          {app.stage.toLowerCase() === 'follow-up' && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]" />}
                          {app.stage.toLowerCase() === 'offer' && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#10B981] to-[#34D399]" />}
                          {app.stage.toLowerCase() === 'interviewing' && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]" />}

                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-[1rem] bg-white border border-[#1F2430]/10 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                              {app.company_logo ? (
                                <ImageWithFallback src={app.company_logo} alt={app.company} className="w-8 h-8 object-cover rounded-full" />
                              ) : (
                                <Building2 className="w-6 h-6 text-[#1F2430]/30" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-[#1F2430] text-[16px] leading-tight">{app.company}</h4>
                              <p className="font-semibold text-[#1F2430]/60 text-[13px] mt-0.5">{app.role}</p>
                            </div>
                          </div>

                          {/* Meta Information Tags */}
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/60 border border-[#1F2430]/5 text-[11px] font-bold text-[#1F2430]/70">
                              <Clock className="w-3 h-3 text-[#1F2430]/40" /> {app.last_updated}
                            </div>
                            {app.evidence_used && app.evidence_used.length > 0 && (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 text-[11px] font-bold text-[#10B981]">
                                <Star className="w-3 h-3" /> {app.evidence_used.length} skills matched
                              </div>
                            )}
                          </div>

                          {/* Next Step Info */}
                          {app.next_step && (
                            <div className="pt-4 border-t border-[#1F2430]/10">
                              <p className="text-[12px] text-[#1F2430]/60 font-medium">
                                <strong className="text-[#1F2430]">Next:</strong> {app.next_step}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </AnimatedContent>
            );
          })}
        </div>
      </div>
      
      {/* Global Style for hiding scrollbar visually but keeping functionality */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}