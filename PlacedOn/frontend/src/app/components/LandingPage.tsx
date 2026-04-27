import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { 
  ArrowRight, ShieldCheck, CheckCircle2,
  Play, Sparkles, Briefcase, Eye, Award, TrendingUp,
  BarChart, Lock, UserCheck, Check, Clock, Mic, 
  ChevronRight, ArrowDown, FileText, Search, Edit, Shield, CameraOff
} from 'lucide-react';
import { BlurText } from './ui/BlurText';
import { AnimatedContent } from './ui/AnimatedContent';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#F3F2F0] relative overflow-hidden font-[Inter,sans-serif] selection:bg-[#3E63F5] selection:text-white">
      {/* Global CSS for floating animations and noise */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 8s ease-in-out infinite; }
        
        .noise-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.25;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
        }

        .dot-grid {
          position: absolute;
          inset: 0;
          background-size: 24px 24px;
          background-image: radial-gradient(circle at 1px 1px, rgba(31,36,48,0.08) 1px, transparent 0);
          pointer-events: none;
          z-index: 0;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.9), 0 12px 40px rgba(30, 35, 60, 0.04);
        }
        
        .glass-dark {
          background: rgba(30, 35, 48, 0.85);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 20px 50px rgba(0, 0, 0, 0.2);
        }

        .transform-style-3d {
          transform-style: preserve-3d;
        }
      `}</style>

      {/* Ambient Background Washes */}
      <div className="absolute top-[-15%] left-[-10%] w-[60vw] h-[60vw] bg-[#E3E8F8] rounded-full mix-blend-multiply blur-[120px] opacity-70 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#F4EBE3] rounded-full mix-blend-multiply blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute top-[20%] right-[15%] w-[40vw] h-[40vw] bg-[#E9E4F5] rounded-full mix-blend-multiply blur-[100px] opacity-50 pointer-events-none" />
      
      {/* Texture Layers */}
      <div className="dot-grid pointer-events-none" />
      <div className="noise-overlay pointer-events-none" />

      {/* Main Content Wrapper */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 py-6 pb-32">
        
        {/* 1. Navbar */}
        <nav className="flex items-center justify-between py-4 mb-16 border-b border-[#1F2430]/5 pb-6 sticky top-0 bg-[#F3F2F0]/80 backdrop-blur-xl z-50">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="w-8 h-8 rounded-lg bg-[#3E63F5] flex items-center justify-center text-white font-bold font-[Manrope,sans-serif]">P</div>
            <span className="font-[Manrope,sans-serif] text-xl font-bold text-[#1F2430] tracking-tight">PlacedOn</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[14px] font-medium text-[#1F2430]/70">
            <a href="#how" className="hover:text-[#1F2430] transition-colors">How It Works</a>
            <a href="#candidates" className="hover:text-[#1F2430] transition-colors">For Candidates</a>
            <a href="#companies" className="hover:text-[#1F2430] transition-colors">For Companies</a>
            <a href="#trust" className="hover:text-[#1F2430] transition-colors">Trust</a>
          </div>
          <div className="flex items-center gap-4">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/auth')} className="text-[14px] font-medium text-[#1F2430] hover:text-[#3E63F5] transition-colors hidden sm:block">Log In</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/auth')} className="px-5 py-2.5 rounded-xl bg-[#1F2430] text-white text-[14px] font-semibold hover:bg-[#2A3040] transition-colors shadow-sm flex items-center gap-2 group">
              Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </div>
        </nav>

        {/* 2. Hero Section */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20 md:mb-28 pt-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/60 mb-8 shadow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[13px] font-bold text-[#1F2430] uppercase tracking-wider">The New Standard for Hiring</span>
          </motion.div>
          
          <div className="font-[Manrope,sans-serif] text-[40px] md:text-[72px] font-extrabold text-[#1F2430] tracking-tight leading-[1.1] mb-6 flex flex-col items-center">
            <BlurText text="Your skills should get you hired." delay={0.04} />
            <BlurText text="Not your resume." delay={0.04} className="text-[#1F2430]/90" />
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-[22px] text-[#1F2430]/70 font-medium mb-12 max-w-2xl leading-relaxed text-balance"
          >
            Have a friendly 35-minute conversation about your past work. We'll generate a verified, evidence-backed candidate dossier that helps you showcase your true capabilities to employers.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-5 w-full justify-center mb-6"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                onClick={() => navigate('/auth')} 
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-[#3E63F5] text-white text-[16px] font-bold hover:bg-[#2A44B0] transition-all shadow-[0_8px_32px_rgba(62,99,245,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2 group"
              >
                Start Free Conversation 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                onClick={() => document.getElementById('sample-profile')?.scrollIntoView({ behavior: 'smooth' })} 
                className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-2xl bg-white/70 text-[#1F2430] text-[16px] font-bold hover:bg-white transition-all shadow-sm border border-white/80 hover:-translate-y-1 flex items-center justify-center gap-2 backdrop-blur-md whitespace-nowrap"
              >
                Preview Sample Profile
                <Eye className="w-5 h-5 text-[#1F2430]/60 flex-shrink-0" />
              </motion.button>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-[13.5px] font-bold text-[#1F2430]/60 bg-white/40 px-6 py-3 rounded-2xl md:rounded-full border border-white/60 shadow-sm backdrop-blur-md text-center">
              <span className="flex items-center gap-1.5 text-[#1F2430]"><Sparkles className="w-4 h-4 text-[#10B981]" /> Role-based AI interview</span>
              <span className="hidden md:block w-1 h-1 rounded-full bg-[#1F2430]/20" />
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#10B981]" /> No trick questions</span>
              <span className="hidden md:block w-1 h-1 rounded-full bg-[#1F2430]/20" />
              <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-[#10B981]" /> Review your profile before employers see it</span>
            </div>
          </motion.div>
        </div>

        {/* 4. Social Proof / Credibility Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-24 md:mb-32 border-y border-[#1F2430]/5 py-10 px-4 max-w-6xl mx-auto w-full">
          {[
            { icon: <ShieldCheck />, title: "Verified Skills", desc: "No resume fluff" },
            { icon: <Lock />, title: "Standardized & Fair", desc: "Level playing field" },
            { icon: <Eye />, title: "You Control Visibility", desc: "Stay completely anonymous" },
            { icon: <BarChart />, title: "Evidence-backed", desc: "Showcases real project context" },
          ].map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-2"
            >
              <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-[#3E63F5] mb-2 shadow-sm">
                {item.icon}
              </div>
              <h4 className="font-[Manrope,sans-serif] text-[16px] font-bold text-[#1F2430]">{item.title}</h4>
              <p className="text-[14px] text-[#1F2430]/60 font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* 3. Hero Visual / Sample Profile */}
        <div className="relative max-w-6xl mx-auto mb-24 md:mb-32 perspective-[1000px]">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.15, 0.25, 0.15],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-tr from-[#3E63F5] to-[#B392F0] rounded-[3rem] blur-[100px] pointer-events-none" 
          />
          <div className="relative glass-card rounded-[2.5rem] p-6 md:p-10 shadow-[0_24px_64px_rgba(30,35,60,0.08)] transform-style-3d hover:-translate-y-2 transition-transform duration-700">
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-center justify-between">
              
              {/* Step 1: AI Interview */}
              <AnimatedContent delay={0.4} direction="horizontal" reverse className="w-full lg:w-1/3">
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-black/5 relative hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#3E63F5] to-[#8C9EFF] flex items-center justify-center text-[10px] font-bold text-white shadow-inner">AI</div>
                      <span className="text-[12px] font-bold text-[#1F2430]/50 uppercase tracking-wide">Conversation</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#1F2430]/5 text-[#1F2430]/40 text-[11px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" /> 14:22
                    </div>
                  </div>
                  <p className="text-[14px] text-[#1F2430]/90 font-medium leading-relaxed mb-4">
                    "Walk me through how you handled state management in that high-traffic financial application."
                  </p>
                  <div className="p-3 rounded-2xl bg-[#F3F2F0] border border-black/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Mic className="w-4 h-4 text-[#3E63F5]" />
                    </div>
                    <div className="flex-1 flex items-center gap-1 opacity-50">
                      {[...Array(8)].map((_, i) => (
                        <motion.div 
                          key={i} 
                          animate={{ height: [4, 12, 4] }} 
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                          className="w-1 rounded-full bg-[#3E63F5]" 
                        />
                      ))}
                      <span className="text-[12px] font-medium text-[#1F2430]/60 ml-2">Speaking...</span>
                    </div>
                  </div>
                </div>
              </AnimatedContent>

              <ChevronRight className="hidden lg:block w-8 h-8 text-[#1F2430]/20 flex-shrink-0" />
              <ArrowDown className="lg:hidden w-6 h-6 text-[#1F2430]/20 flex-shrink-0 my-[-10px] z-10 bg-[#F3F2F0] rounded-full p-1 border border-white" />

              {/* Step 2: Verified Profile */}
              <AnimatedContent delay={0.6} direction="vertical" className="w-full lg:w-1/3 relative z-10">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 shadow-[0_16px_40px_rgba(30,35,60,0.06)] border border-white scale-105">
                  <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] text-white text-[11px] font-bold flex items-center gap-1.5 shadow-[0_8px_16px_rgba(16,185,129,0.3)] z-10">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Candidate reviewed
                  </div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1F2430] to-[#3E63F5] p-[2px] flex-shrink-0">
                      <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-[#1F2430]/40" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-[Manrope,sans-serif] text-[16px] font-bold text-[#1F2430] leading-tight mb-1">Anonymous Profile</h3>
                      <p className="text-[12px] text-[#1F2430]/60 font-medium">Senior Frontend Engineer</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#3E63F5]/10 border border-[#3E63F5]/20">
                      <span className="text-[12px] font-bold text-[#3E63F5] flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Evidence Strength</span>
                      <span className="text-[13px] font-bold text-[#1F2430]">94%</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F3F2F0]/80 border border-white">
                      <p className="text-[11px] font-bold text-[#1F2430]/50 uppercase tracking-wider mb-2">Verified Signals</p>
                      <div className="flex flex-col gap-1.5">
                        {['Clarifies ambiguity', 'React state architecture', 'Explains trade-offs clearly'].map(s => (
                          <span key={s} className="px-2.5 py-1.5 rounded-lg bg-white text-[#1F2430]/80 text-[11.5px] font-bold border border-[#1F2430]/5 shadow-sm flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-[#3E63F5]" /> {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedContent>

              <ChevronRight className="hidden lg:block w-8 h-8 text-[#1F2430]/20 flex-shrink-0" />
              <ArrowDown className="lg:hidden w-6 h-6 text-[#1F2430]/20 flex-shrink-0 my-[-10px] z-10 bg-[#F3F2F0] rounded-full p-1 border border-white" />

              {/* Step 3: Employer Discovery */}
              <AnimatedContent delay={0.8} direction="horizontal" className="w-full lg:w-1/3">
                <div className="bg-[#1F2430] rounded-3xl p-5 shadow-lg border border-white/10 text-white relative hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white"><Search className="w-3 h-3" /></div>
                      <span className="text-[12px] font-bold text-white/50 uppercase tracking-wide">Employer Dashboard</span>
                    </div>
                    <span className="px-2 py-1 rounded-md bg-[#10B981]/20 text-[#10B981] text-[10px] font-bold border border-[#10B981]/30">New Match</span>
                  </div>
                  
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 mb-3 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-bold text-white">Strong Match</span>
                      <ChevronRight className="w-4 h-4 text-white/30 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-[12px] text-white/60 mb-3 leading-relaxed">
                      Matches your exact requirements for complex React state architecture.
                    </p>
                    
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-white/5 group-hover:bg-white/20 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.4)]">
                          <Play className="w-2.5 h-2.5 text-white ml-0.5" />
                        </div>
                        <span className="text-[11px] font-bold text-white">Play Evidence Clip</span>
                      </div>
                      <span className="text-[10px] font-bold text-white/40">1:45</span>
                    </div>
                  </div>
                </div>
              </AnimatedContent>

            </div>
          </div>
        </div>

        {/* New Section: Sample Verified Profile */}
        <div id="sample-profile" className="scroll-mt-32 mb-24 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 px-4"
          >
            <h2 className="font-[Manrope,sans-serif] text-3xl md:text-[40px] font-extrabold text-[#1F2430] mb-5 tracking-tight">Your interview becomes a profile you can actually use.</h2>
            <p className="text-[18px] text-[#1F2430]/70 max-w-3xl mx-auto font-medium leading-relaxed">
              PlacedOn turns your answers into an evidence-backed skill profile that you review, control, and share with employers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-7xl mx-auto px-4">
            
            {/* Left side: Polished Candidate Profile Card (Bento Grid) */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              
              {/* Main Identity Box */}
              <div className="md:col-span-2 glass-card p-6 md:p-8 rounded-3xl border border-white/60 shadow-[0_12px_40px_rgba(30,35,48,0.06)] bg-white/70 backdrop-blur-xl relative overflow-hidden group hover:shadow-[0_16px_50px_rgba(62,99,245,0.08)] transition-all duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#3E63F5]/10 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#1F2430] to-[#3E63F5] p-[2px] shadow-sm flex-shrink-0">
                    <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center">
                      <UserCheck className="w-8 h-8 text-[#1F2430]/40" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-[Manrope,sans-serif] text-[24px] font-bold text-[#1F2430] mb-2">Anonymous Candidate</h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[15px] font-bold text-[#3E63F5]">Frontend Engineer</span>
                      <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#1F2430]/20" />
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] text-[12px] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Candidate reviewed
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-5 rounded-2xl bg-white/50 border border-black/5 shadow-sm relative z-10">
                  <p className="text-[15px] leading-relaxed text-[#1F2430]/80 font-medium">
                    "Explains technical decisions clearly, breaks complex UI problems into manageable systems, and shows strong ownership when discussing past project trade-offs."
                  </p>
                </div>
              </div>

              {/* Verified Capabilities */}
              <div className="glass-card p-6 rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(30,35,48,0.04)] bg-white/70 backdrop-blur-xl hover:shadow-[0_12px_40px_rgba(30,35,48,0.08)] transition-shadow duration-300">
                <h4 className="text-[12px] font-bold text-[#1F2430]/50 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#3E63F5]" /> Verified Capabilities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['React architecture', 'State management', 'API integration', 'Debugging approach', 'Communication clarity'].map(skill => (
                    <span key={skill} className="px-3 py-1.5 rounded-xl bg-white text-[#1F2430]/90 text-[13px] font-bold border border-black/5 shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Evidence Strength */}
              <div className="glass-card p-6 rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(30,35,48,0.04)] bg-white/70 backdrop-blur-xl flex flex-col justify-center hover:shadow-[0_12px_40px_rgba(30,35,48,0.08)] transition-shadow duration-300">
                <h4 className="text-[12px] font-bold text-[#1F2430]/50 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-[#3E63F5]" /> Evidence Strength
                </h4>
                <div className="flex items-end gap-3 mt-2">
                  <span className="text-[42px] font-[Manrope,sans-serif] font-extrabold text-[#1F2430] leading-none tracking-tight">94%</span>
                  <span className="text-[13px] font-bold text-[#10B981] mb-1.5 flex items-center gap-1 bg-[#10B981]/10 px-2 py-1 rounded-lg">
                    <ShieldCheck className="w-3.5 h-3.5" /> Strong Evidence
                  </span>
                </div>
                <div className="mt-5 w-full h-2 bg-black/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '94%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#3E63F5] to-[#B392F0] rounded-full" 
                  />
                </div>
              </div>

              {/* Evidence Blocks */}
              <div className="md:col-span-2 glass-dark p-6 rounded-3xl border border-white/10 shadow-[0_12px_40px_rgba(30,35,48,0.2)] text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-white/5 to-transparent rounded-bl-full pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100" />
                <h4 className="text-[12px] font-bold text-white/50 uppercase tracking-wider mb-5 flex items-center gap-2 relative z-10">
                  <Play className="w-4 h-4 text-[#10B981]" /> Verified Evidence Clips
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                  {[
                    "State management trade-off",
                    "Debugging production issue",
                    "Explaining ambiguity"
                  ].map((clip, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/10 border border-white/5 hover:bg-white/15 transition-all duration-300 cursor-pointer hover:-translate-y-1 flex flex-col justify-between h-[110px]">
                      <span className="text-[13px] font-bold text-white/90 leading-snug">{clip}</span>
                      <div className="flex items-center justify-between mt-2">
                        <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                          <Play className="w-3.5 h-3.5 text-white ml-0.5" />
                        </div>
                        <span className="text-[11px] font-bold text-white/40">Evidence clip</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>

            {/* Right side: Explanation Cards (Candidate Controls) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-5 flex flex-col gap-4"
            >
              <div className="bg-white/80 backdrop-blur-md border border-white/60 shadow-sm hover:shadow-md transition-shadow rounded-3xl p-6 lg:p-7 flex gap-5 items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#3E63F5]/10 flex items-center justify-center border border-[#3E63F5]/20 flex-shrink-0">
                  <Eye className="w-5 h-5 text-[#3E63F5]" />
                </div>
                <div>
                  <h3 className="font-[Manrope,sans-serif] text-[18px] font-bold text-[#1F2430] mb-2">Review before publishing</h3>
                  <p className="text-[15px] text-[#1F2430]/70 font-medium leading-relaxed">
                    Listen to your own interview clips and read the AI's synthesis. If you don't feel it represents your best work, simply don't share it.
                  </p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md border border-white/60 shadow-sm hover:shadow-md transition-shadow rounded-3xl p-6 lg:p-7 flex gap-5 items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#3E63F5]/10 flex items-center justify-center border border-[#3E63F5]/20 flex-shrink-0">
                  <FileText className="w-5 h-5 text-[#3E63F5]" />
                </div>
                <div>
                  <h3 className="font-[Manrope,sans-serif] text-[18px] font-bold text-[#1F2430] mb-2">Add context</h3>
                  <p className="text-[15px] text-[#1F2430]/70 font-medium leading-relaxed">
                    Was there a technical constraint you forgot to mention? Add personal annotations to the generated profile before any employer sees it.
                  </p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md border border-white/60 shadow-sm hover:shadow-md transition-shadow rounded-3xl p-6 lg:p-7 flex gap-5 items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#3E63F5]/10 flex items-center justify-center border border-[#3E63F5]/20 flex-shrink-0">
                  <Lock className="w-5 h-5 text-[#3E63F5]" />
                </div>
                <div>
                  <h3 className="font-[Manrope,sans-serif] text-[18px] font-bold text-[#1F2430] mb-2">Stay anonymous & control visibility</h3>
                  <p className="text-[15px] text-[#1F2430]/70 font-medium leading-relaxed">
                    Your profile is fully anonymized. Employers see your verified skills and evidence clips, but you decide when to reveal your identity.
                  </p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md border border-white/60 shadow-sm hover:shadow-md transition-shadow rounded-3xl p-6 lg:p-7 flex gap-5 items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#3E63F5]/10 flex items-center justify-center border border-[#3E63F5]/20 flex-shrink-0">
                  <Shield className="w-5 h-5 text-[#3E63F5]" />
                </div>
                <div>
                  <h3 className="font-[Manrope,sans-serif] text-[18px] font-bold text-[#1F2430] mb-2">Dispute inaccuracies</h3>
                  <p className="text-[15px] text-[#1F2430]/70 font-medium leading-relaxed">
                    If our AI misinterprets an answer, you can flag it for human review or completely remove that specific insight from your dossier.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* 6. Why candidates should trust this */}
        <div id="trust" className="bg-[#1F2430] rounded-[3rem] p-8 md:p-12 lg:p-16 mb-24 md:mb-32 relative overflow-hidden shadow-xl mx-4 lg:mx-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#3E63F5]/20 to-transparent pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="font-[Manrope,sans-serif] text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">Candidate-first. Built on trust and control.</h2>
              <p className="text-[18px] text-white/70 mb-10 font-medium">We built PlacedOn because the standard hiring process is broken. Resumes don't show capability, and take-home tests are unpaid labor. You deserve better.</p>
              
              <div className="space-y-6 lg:space-y-8">
                {[
                  { title: "No surveillance or policing", desc: "No screen recording, no proctoring, and no eye-tracking. Just a relaxed conversation." },
                  { title: "You own your profile data", desc: "You decide if your dossier is published, kept private, or completely deleted. We never sell your data." },
                  { title: "You control your visibility", desc: "Stay completely anonymous until you actively choose to accept a direct interview request." }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.15 }}
                    className="flex gap-4 lg:gap-5"
                  >
                    <div className="w-7 h-7 mt-0.5 rounded-full bg-[#10B981]/20 flex items-center justify-center flex-shrink-0 border border-[#10B981]/30">
                      <Check className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-bold text-white mb-1.5">{item.title}</h4>
                      <p className="text-[14px] text-white/60 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Visual Trust Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass-dark rounded-[2rem] lg:rounded-[2.5rem] p-6 md:p-8 lg:p-10 border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.3)]"
            >
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 pb-8 border-b border-white/10">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 flex-shrink-0">
                     <ShieldCheck className="w-6 h-6 text-[#10B981]" />
                   </div>
                   <div>
                     <p className="text-[16px] font-bold text-white">Profile Visibility</p>
                     <p className="text-[13px] text-[#10B981] font-medium flex items-center gap-1.5">
                       <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse flex-shrink-0" /> Anonymous Mode Active
                     </p>
                   </div>
                 </div>
                 <div className="w-14 h-7 rounded-full bg-[#10B981] p-1 flex justify-end shadow-inner cursor-pointer flex-shrink-0 self-start sm:self-auto">
                   <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                 </div>
               </div>
               <p className="text-[14px] lg:text-[15px] text-white/80 leading-relaxed italic font-medium">
                 "Your identity is hidden from employers. They only see your verified skills and match percentage. You decide when to reveal yourself."
               </p>
            </motion.div>
          </div>
        </div>

        {/* Candidate Rights / Trust Strip */}
        <div className="mb-24 md:mb-32">
          <div className="text-center mb-12 px-4">
            <h2 className="font-[Manrope,sans-serif] text-3xl md:text-[36px] font-extrabold text-[#1F2430] mb-4 tracking-tight">You stay in control.</h2>
            <p className="text-[18px] text-[#1F2430]/70 max-w-2xl mx-auto font-medium">
              PlacedOn is built to help candidates be understood, not silently judged.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 max-w-6xl mx-auto px-4">
            {[
              { title: "Review before employers see it", desc: "You see your generated profile first.", icon: <Eye className="w-5 h-5 text-[#3E63F5]" /> },
              { title: "Add your own context", desc: "Clarify anything the AI missed.", icon: <Edit className="w-5 h-5 text-[#3E63F5]" /> },
              { title: "Dispute incorrect traits", desc: "Flag anything that does not feel accurate.", icon: <Shield className="w-5 h-5 text-[#3E63F5]" /> },
              { title: "Stay anonymous", desc: "Reveal your identity only when you choose.", icon: <Lock className="w-5 h-5 text-[#3E63F5]" /> },
              { title: "No facial analysis", desc: "We evaluate answers and evidence, not appearance.", icon: <CameraOff className="w-5 h-5 text-[#3E63F5]" /> },
              { title: "No trick questions", desc: "The interview is role-based and conversational.", icon: <CheckCircle2 className="w-5 h-5 text-[#3E63F5]" /> },
            ].map((trustCard, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white/70 backdrop-blur-xl border border-black/5 shadow-[0_4px_24px_rgba(30,35,48,0.03)] hover:shadow-[0_12px_40px_rgba(30,35,48,0.06)] p-5 lg:p-6 rounded-[1.5rem] lg:rounded-3xl flex items-start gap-4 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3E63F5]/10 to-[#3E63F5]/5 flex items-center justify-center flex-shrink-0 border border-[#3E63F5]/20">
                  {trustCard.icon}
                </div>
                <div>
                  <h4 className="font-[Manrope,sans-serif] text-[15px] lg:text-[16px] font-bold text-[#1F2430] mb-1">{trustCard.title}</h4>
                  <p className="text-[14px] text-[#1F2430]/70 font-medium leading-relaxed">{trustCard.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 5. How it works */}
        <div id="how" className="mb-24 md:mb-32">
          <div className="text-center mb-16">
            <h2 className="font-[Manrope,sans-serif] text-3xl md:text-4xl font-bold text-[#1F2430] mb-4">How PlacedOn works</h2>
            <p className="text-[18px] text-[#1F2430]/60 max-w-2xl mx-auto font-medium">Three steps to build an evidence-backed profile and showcase what you can actually do.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { 
                num: "01", 
                title: "Choose Path", 
                desc: "Select your target role and configure your baseline experience level. No resume upload required.",
                time: "Takes 2 mins",
                icon: <Briefcase className="w-6 h-6 text-[#3E63F5]" />
              },
              { 
                num: "02", 
                title: "Have a Conversation", 
                desc: "Chat with our AI about your past projects. No proctoring, no whiteboarding, and no trick questions. Just peer-to-peer discussion.",
                time: "35-40 mins",
                icon: <Mic className="w-6 h-6 text-[#3E63F5]" />
              },
              { 
                num: "03", 
                title: "Get Your Dossier", 
                desc: "Review your generated evidence-backed profile. You control who sees it. Stay anonymous and choose when interested employers can contact you.",
                time: "Instant",
                icon: <ShieldCheck className="w-6 h-6 text-[#3E63F5]" />
              }
            ].map((step, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="glass-card rounded-[2rem] p-8 lg:p-10 relative overflow-hidden group hover:bg-white/60 transition-colors flex flex-col h-full"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-[#3E63F5]/10 flex items-center justify-center border border-[#3E63F5]/20 shadow-inner group-hover:scale-105 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <span className="font-[Manrope,sans-serif] font-extrabold text-2xl text-[#1F2430]/10 group-hover:text-[#1F2430]/20 transition-colors">
                    {step.num}
                  </span>
                </div>
                
                <h3 className="font-[Manrope,sans-serif] text-[20px] font-bold text-[#1F2430] mb-3">{step.title}</h3>
                <p className="text-[15px] text-[#1F2430]/70 leading-relaxed font-medium flex-1">{step.desc}</p>
                
                <div className="mt-8 pt-6 border-t border-[#1F2430]/5 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#10B981]" />
                  <span className="text-[13px] font-bold text-[#1F2430]/60">{step.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 7. For Candidates */}
        <div id="candidates" className="mb-24 md:mb-32">
          <div className="mb-12 md:mb-16">
            <h2 className="font-[Manrope,sans-serif] text-3xl md:text-4xl font-bold text-[#1F2430] mb-4 text-center">Everything you need to stand out</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Sparkles className="w-5 h-5" />, title: "Evidence-backed skills", desc: "We extract real capability from your project stories." },
              { icon: <Award className="w-5 h-5" />, title: "Concrete Dossier", desc: "An evidence-backed candidate dossier written for you." },
              { icon: <TrendingUp className="w-5 h-5" />, title: "Growth over time", desc: "Update your dossier with quick micro-conversations as you learn." },
              { icon: <Eye className="w-5 h-5" />, title: "Visibility controls", desc: "Stay completely anonymous from current employers." },
              { icon: <Briefcase className="w-5 h-5" />, title: "Offer tracking", desc: "Manage all direct interview requests in one place." },
              { icon: <ShieldCheck className="w-5 h-5" />, title: "Verified achievements", desc: "Badges that prove you can actually do the work." },
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-8 rounded-[2rem] glass-card hover:bg-white/60 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-[#3E63F5]/10 text-[#3E63F5] flex items-center justify-center mb-6 shadow-inner">
                  {feature.icon}
                </div>
                <h4 className="font-[Manrope,sans-serif] text-[18px] font-bold text-[#1F2430] mb-3">{feature.title}</h4>
                <p className="text-[15px] text-[#1F2430]/70 font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 8. For Employers */}
        <div id="companies" className="mb-24 md:mb-32 max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            
            {/* Left side: Content */}
            <div className="lg:w-1/2">
              <span className="inline-block px-3 py-1.5 rounded-lg bg-[#3E63F5]/10 text-[13px] font-bold text-[#3E63F5] uppercase tracking-wider mb-4 border border-[#3E63F5]/20">For Employers</span>
              <h2 className="font-[Manrope,sans-serif] text-3xl md:text-4xl font-extrabold text-[#1F2430] mb-4 tracking-tight">Hire signal, not noise.</h2>
              <p className="text-[18px] text-[#1F2430]/70 font-medium mb-10 leading-relaxed">
                Review candidates through evidence-backed profiles instead of keyword-matched resumes.
              </p>
              
              <div className="space-y-6 mb-10">
                {[
                  { title: "See the evidence behind every claim", desc: "Each skill signal links back to interview moments.", icon: <Search className="w-5 h-5 text-[#3E63F5]" /> },
                  { title: "Compare candidates by role fit", desc: "Evaluate capabilities against the actual requirements of the role.", icon: <BarChart className="w-5 h-5 text-[#3E63F5]" /> },
                  { title: "Reduce resume screening time", desc: "Use PlacedOn before human interviews to surface stronger candidates faster.", icon: <Clock className="w-5 h-5 text-[#3E63F5]" /> },
                  { title: "Pilot with your own applicants", desc: "Run a small batch and compare PlacedOn profiles against your hiring team's judgment.", icon: <Award className="w-5 h-5 text-[#3E63F5]" /> },
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex gap-4 items-start"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 border border-black/5 shadow-sm">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-[Manrope,sans-serif] text-[16px] font-bold text-[#1F2430] mb-1">{item.title}</h4>
                      <p className="text-[14px] text-[#1F2430]/60 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                className="px-8 py-4 rounded-2xl bg-white text-[#1F2430] text-[15px] font-bold shadow-[0_4px_12px_rgba(30,35,48,0.05)] border border-black/10 hover:bg-gray-50 transition-colors flex items-center justify-center w-full sm:w-auto gap-2"
              >
                Pilot PlacedOn for Hiring <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
            
            {/* Right side: Dashboard Preview */}
            <div className="lg:w-1/2 w-full">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass-card rounded-[2rem] p-5 md:p-8 border border-white/60 shadow-[0_20px_60px_rgba(30,35,48,0.06)] bg-white/50 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="text-[12px] font-bold text-[#1F2430]/40 uppercase tracking-wider">Candidate Pipeline</div>
                  <div className="w-16" /> {/* Spacer */}
                </div>
                
                <div className="space-y-4">
                  {[
                    { role: "Frontend Engineer", match: "94%", id: "Candidate 84A", tag: "Strong Match", time: "1:45 clip" },
                    { role: "Frontend Engineer", match: "88%", id: "Candidate 29C", tag: "Solid Match", time: "2:10 clip" },
                    { role: "Frontend Engineer", match: "81%", id: "Candidate 55F", tag: "Potential", time: "1:30 clip" }
                  ].map((cand, i) => (
                    <div key={i} className="p-4 md:p-5 rounded-2xl bg-white border border-black/5 shadow-[0_4px_12px_rgba(30,35,48,0.03)] hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4 sm:items-center justify-between group cursor-default">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1F2430] to-[#3E63F5] p-[2px] flex-shrink-0 opacity-90 group-hover:opacity-100 transition-opacity">
                          <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center">
                            <UserCheck className="w-5 h-5 text-[#1F2430]/40" />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-[Manrope,sans-serif] text-[15px] font-bold text-[#1F2430]">{cand.id}</span>
                            <span className="hidden xs:inline-block px-2 py-0.5 rounded-full bg-[#3E63F5]/10 text-[#3E63F5] text-[10px] font-bold uppercase">{cand.tag}</span>
                          </div>
                          <div className="text-[13px] text-[#1F2430]/60 font-medium">{cand.role}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 sm:gap-6 justify-between sm:justify-end border-t border-black/5 sm:border-t-0 pt-3 sm:pt-0 mt-1 sm:mt-0">
                        <div className="text-left sm:text-center">
                          <div className="text-[11px] font-bold text-[#1F2430]/40 uppercase mb-0.5">Role Fit</div>
                          <div className="text-[16px] font-extrabold text-[#1F2430]">{cand.match}</div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#10B981]/10 text-[#10B981] group-hover:bg-[#10B981]/20 transition-colors cursor-pointer">
                          <Play className="w-3.5 h-3.5" />
                          <span className="text-[12px] font-bold">Evidence</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* 9. Final CTA */}
        <div className="bg-[#1F2430] rounded-[3rem] p-10 md:p-24 text-center relative overflow-hidden shadow-2xl">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.05, 0.1, 0.05],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] bg-[#10B981] rounded-full blur-[140px] pointer-events-none" 
          />
          
          <h2 className="relative z-10 font-[Manrope,sans-serif] text-3xl md:text-[48px] font-extrabold text-white tracking-tight mb-6 leading-tight">
            Start with one interview.<br className="hidden sm:block" /> Let your skills do the talking.
          </h2>
          <p className="relative z-10 text-[18px] md:text-[20px] text-white/70 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            Build an evidence-backed profile you control, then use it to be evaluated for what you can actually do.
          </p>
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto max-w-md sm:max-w-none">
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                onClick={() => navigate('/auth')} 
                className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-2xl bg-[#3E63F5] text-white text-[16px] font-bold hover:bg-[#2A44B0] transition-all shadow-[0_8px_32px_rgba(62,99,245,0.4)] hover:-translate-y-1 flex items-center justify-center gap-2 group whitespace-nowrap"
              >
                Start Free Interview 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                onClick={() => document.getElementById('sample-profile')?.scrollIntoView({ behavior: 'smooth' })} 
                className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-2xl bg-white/10 text-white text-[16px] font-bold hover:bg-white/20 transition-all border border-white/20 hover:-translate-y-1 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Preview Sample Profile
                <Eye className="w-5 h-5 text-white/60 flex-shrink-0" />
              </motion.button>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center items-center gap-3 md:gap-2 text-[13px] font-bold text-white/50 text-center">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#10B981]" /> No trick questions</span>
              <span className="hidden md:block w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Candidate-reviewed profile</span>
              <span className="hidden md:block w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-[#10B981]" /> Anonymous until you choose</span>
            </div>
          </div>
        </div>

        {/* 10. Footer */}
        <footer className="mt-24 border-t border-[#1F2430]/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#1F2430] flex items-center justify-center text-white font-bold font-[Manrope,sans-serif] text-sm">P</div>
              <span className="font-[Manrope,sans-serif] text-[18px] font-bold text-[#1F2430]">PlacedOn</span>
            </div>
            <p className="text-[14px] text-[#1F2430]/50 font-medium">The new standard for technical hiring.</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[14px] font-medium text-[#1F2430]/60">
            <a href="/about" className="hover:text-[#1F2430] transition-colors">About</a>
            <a href="#candidates" className="hover:text-[#1F2430] transition-colors">Candidates</a>
            <a href="#companies" className="hover:text-[#1F2430] transition-colors">Companies</a>
            <a href="#trust" className="hover:text-[#1F2430] transition-colors">Trust</a>
            <a href="/pricing" className="hover:text-[#1F2430] transition-colors">Pricing</a>
            <a href="/contact" className="hover:text-[#1F2430] transition-colors">Contact</a>
          </div>
          
          <p className="text-[13px] text-[#1F2430]/40 font-medium">© 2026 PlacedOn Inc.</p>
        </footer>

      </div>
    </div>
  );
}