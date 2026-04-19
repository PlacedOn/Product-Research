import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { 
  ArrowRight, ShieldCheck, CheckCircle2,
  Play, Sparkles, Briefcase, Eye, Award, TrendingUp,
  BarChart, Lock, UserCheck, Check
} from 'lucide-react';

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
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/candidate')} className="text-[14px] font-medium text-[#1F2430] hover:text-[#3E63F5] transition-colors hidden sm:block">Log In</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/pre-interview')} className="px-5 py-2.5 rounded-xl bg-[#1F2430] text-white text-[14px] font-semibold hover:bg-[#2A3040] transition-colors shadow-sm flex items-center gap-2 group">
              Start Interview <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </div>
        </nav>

        {/* 2. Hero Section */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20 md:mb-28">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/60 mb-8 shadow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[13px] font-bold text-[#1F2430] uppercase tracking-wider">The New Standard for Hiring</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-[Manrope,sans-serif] text-[40px] md:text-[72px] font-extrabold text-[#1F2430] tracking-tight leading-[1.1] mb-6"
          >
            Your skills should get you hired.<br className="hidden md:block" /> Not your resume.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-[22px] text-[#1F2430]/70 font-medium mb-10 max-w-2xl leading-relaxed"
          >
            Take a conversational AI interview. Get a verified skill profile. Let companies discover you based on demonstrated ability.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mb-6"
          >
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/pre-interview')} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#3E63F5] text-white text-[16px] font-bold hover:bg-[#2A44B0] transition-all shadow-[0_8px_24px_rgba(62,99,245,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2 group">
              Start Free Interview 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-card text-[#1F2430] text-[16px] font-bold hover:bg-white/80 transition-all shadow-sm">
              I'm Hiring
            </motion.button>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-[13px] font-medium text-[#1F2430]/50 flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Role-based interview. No trick questions. Takes ~30 mins.
          </motion.p>
        </div>

        {/* 3. Hero Visual / Sample Profile */}
        <div className="relative max-w-5xl mx-auto mb-24 md:mb-32 perspective-[1000px]">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.15, 0.25, 0.15],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-tr from-[#3E63F5] to-[#B392F0] rounded-[3rem] blur-[100px] pointer-events-none" 
          />
          <div className="relative glass-card rounded-[2.5rem] p-6 md:p-12 shadow-[0_24px_64px_rgba(30,35,60,0.08)] transform-style-3d hover:-translate-y-2 transition-transform duration-700">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
              
              {/* Interview Interaction */}
              <div className="w-full md:w-5/12 flex flex-col gap-4 relative">
                 <div className="absolute top-1/2 -right-8 w-16 h-1 border-b-2 border-dashed border-[#3E63F5]/30 hidden md:block">
                    <motion.div 
                      initial={{ left: 0, opacity: 0 }}
                      animate={{ left: "100%", opacity: [0, 1, 0] }}
                      transition={{ duration: 1, delay: 1.2, ease: "easeInOut" }}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center border border-[#3E63F5]/20 z-10"
                    >
                      <Sparkles className="w-4 h-4 text-[#3E63F5]" />
                    </motion.div>
                 </div>

                 <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ duration: 0.5, delay: 0.5 }}
                   className="p-5 rounded-3xl bg-white shadow-sm rounded-bl-none border border-black/5 animate-float-slow"
                 >
                   <div className="flex items-center gap-2 mb-2">
                     <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#3E63F5] to-[#8C9EFF] flex items-center justify-center text-[10px] font-bold text-white">AI</div>
                     <span className="text-[12px] font-bold text-[#1F2430]/40">System Architecture</span>
                   </div>
                   <p className="text-[14px] text-[#1F2430]/90 font-medium">"Walk me through how you handled state management in that high-traffic e-commerce project."</p>
                 </motion.div>
                 
                 <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ duration: 0.5, delay: 0.7 }}
                   className="p-5 rounded-3xl bg-[#3E63F5] shadow-sm rounded-br-none ml-8 relative"
                 >
                   <div className="flex items-center gap-2 mb-2 justify-end">
                     <span className="text-[12px] font-bold text-white/60">Candidate</span>
                     <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white">You</div>
                   </div>
                   <p className="text-[14px] text-white font-medium">"We used Redux for the global cart state, but kept local UI state in React context to prevent unnecessary full-page re-renders..."</p>
                 </motion.div>
              </div>

              {/* Verified Profile Output */}
              <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.6, delay: 1.5, type: "spring", bounce: 0.4 }}
                 className="w-full md:w-7/12 bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white p-6 md:p-8 shadow-[0_16px_40px_rgba(30,35,60,0.06)] relative overflow-hidden"
              >
                 <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-xl bg-[#10B981] text-white text-[12px] font-bold flex items-center gap-1.5 shadow-[0_8px_16px_rgba(16,185,129,0.3)] z-10">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Profile
                 </div>
                 
                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1F2430] to-[#3E63F5] p-[2px] flex-shrink-0">
                      <div className="w-full h-full rounded-[14px] bg-white border border-white flex items-center justify-center overflow-hidden">
                        <UserCheck className="w-8 h-8 text-[#1F2430]/30" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-[Manrope,sans-serif] text-[22px] font-bold text-[#1F2430] leading-tight">Senior Frontend Engineer</h3>
                      <p className="text-[14px] text-[#1F2430]/60 font-medium">Top 5% Match for Architecture & State Management</p>
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                   <div className="p-5 rounded-2xl bg-[#F3F2F0]/80 border border-white">
                     <p className="text-[12px] font-bold text-[#1F2430]/50 uppercase tracking-wider mb-3">Verified Strengths</p>
                     <div className="flex flex-wrap gap-2.5">
                       {['React Performance', 'System Architecture', 'API Integration'].map(s => (
                         <span key={s} className="px-3 py-1.5 rounded-lg bg-white text-[#3E63F5] text-[13px] font-bold border border-[#3E63F5]/10 shadow-sm flex items-center gap-1.5">
                           <Check className="w-3.5 h-3.5 text-[#10B981]" /> {s}
                         </span>
                       ))}
                     </div>
                   </div>
                   
                   <div className="flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-white shadow-sm">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                         <Play className="w-4 h-4 text-[#10B981] ml-0.5" />
                       </div>
                       <div>
                         <p className="text-[14px] font-bold text-[#1F2430]">Evidence Clip</p>
                         <p className="text-[12px] text-[#1F2430]/50">State Management Answer</p>
                       </div>
                     </div>
                     <span className="text-[12px] font-bold text-[#1F2430]/40">1:45</span>
                   </div>
                 </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* 4. Social Proof / Credibility Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-24 md:mb-32 border-y border-[#1F2430]/5 py-10">
          {[
            { icon: <ShieldCheck />, title: "Verified Skills", desc: "No resume fluff" },
            { icon: <Lock />, title: "Bias-checked", desc: "Fair assessment" },
            { icon: <Eye />, title: "You Control Visibility", desc: "Stay anonymous" },
            { icon: <BarChart />, title: "Evidence-backed", desc: "Real project context" },
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

        {/* 5. How it works */}
        <div id="how" className="mb-24 md:mb-32">
          <div className="text-center mb-16">
            <h2 className="font-[Manrope,sans-serif] text-3xl md:text-4xl font-bold text-[#1F2430] mb-4">How PlacedOn works</h2>
            <p className="text-[18px] text-[#1F2430]/60 max-w-2xl mx-auto font-medium">Three simple steps to bypass the resume pile and get hired for what you can actually do.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { num: "01", title: "Choose Role & Start", desc: "Select your target position and begin a conversational AI interview that adapts to your experience." },
              { num: "02", title: "Get a Verified Profile", desc: "Our system turns your answers into a high-signal profile highlighting your actual strengths and skills." },
              { num: "03", title: "Companies Find You", desc: "Hirers searching for your exact skill profile will send you interview requests and offers directly." }
            ].map((step, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="glass-card rounded-[2rem] p-8 lg:p-10 relative overflow-hidden group hover:bg-white/60 transition-colors"
              >
                <div className="absolute -right-4 -top-4 text-[120px] font-bold text-[#1F2430]/[0.03] font-[Manrope,sans-serif] leading-none pointer-events-none group-hover:scale-110 transition-transform duration-500">
                  {step.num}
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#3E63F5]/10 text-[#3E63F5] flex items-center justify-center font-[Manrope,sans-serif] font-bold text-xl mb-6 border border-[#3E63F5]/20 shadow-inner">
                  {step.num}
                </div>
                <h3 className="font-[Manrope,sans-serif] text-xl font-bold text-[#1F2430] mb-3">{step.title}</h3>
                <p className="text-[15px] text-[#1F2430]/70 leading-relaxed font-medium">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 6. Why candidates should trust this */}
        <div id="trust" className="bg-[#1F2430] rounded-[3rem] p-8 md:p-16 mb-24 md:mb-32 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#3E63F5]/20 to-transparent pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="font-[Manrope,sans-serif] text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">Designed for you, not just for employers.</h2>
              <p className="text-[18px] text-white/70 mb-10 font-medium">We built PlacedOn because the standard hiring process is broken. Resumes don't show capability, and take-home tests are unpaid labor.</p>
              
              <div className="space-y-8">
                {[
                  { title: "Evidence, not guesswork", desc: "You are evaluated on actual problem-solving, not keyword matching." },
                  { title: "You control what employers see", desc: "Stay completely anonymous until you decide to accept an interview request." },
                  { title: "Retake as you grow", desc: "Learned a new skill? Do a micro-interview to update your profile anytime." }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.15 }}
                    className="flex gap-5"
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
              className="glass-dark rounded-[2.5rem] p-8 md:p-10 border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.3)]"
            >
               <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/10">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                     <ShieldCheck className="w-6 h-6 text-[#10B981]" />
                   </div>
                   <div>
                     <p className="text-[16px] font-bold text-white">Profile Visibility</p>
                     <p className="text-[13px] text-[#10B981] font-medium flex items-center gap-1.5">
                       <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" /> Anonymous Mode Active
                     </p>
                   </div>
                 </div>
                 <div className="w-14 h-7 rounded-full bg-[#10B981] p-1 flex justify-end shadow-inner cursor-pointer">
                   <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                 </div>
               </div>
               <p className="text-[15px] text-white/80 leading-relaxed italic font-medium">
                 "Your identity is hidden from employers. They only see your verified skills and match percentage. You decide when to reveal yourself."
               </p>
            </motion.div>
          </div>
        </div>

        {/* 7. For Candidates */}
        <div id="candidates" className="mb-24 md:mb-32">
          <div className="mb-12 md:mb-16">
            <h2 className="font-[Manrope,sans-serif] text-3xl md:text-4xl font-bold text-[#1F2430] mb-4 text-center">Everything you need to stand out</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Sparkles className="w-5 h-5" />, title: "AI-inferred skills", desc: "We extract real capability from your project stories." },
              { icon: <Award className="w-5 h-5" />, title: "Generated summary", desc: "A professional summary written for you based on evidence." },
              { icon: <TrendingUp className="w-5 h-5" />, title: "Growth over time", desc: "Update your profile with micro-interviews as you learn." },
              { icon: <Eye className="w-5 h-5" />, title: "Visibility controls", desc: "Stay hidden from current employers." },
              { icon: <Briefcase className="w-5 h-5" />, title: "Offer tracking", desc: "Manage all your interview requests in one place." },
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

        {/* 8. For Companies */}
        <div id="companies" className="mb-24 md:mb-32 glass-card rounded-[3rem] p-8 md:p-16 border-l-[6px] border-l-[#10B981] relative overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.08, 0.15, 0.08]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-64 h-64 bg-[#10B981] blur-[100px] pointer-events-none" 
          />
          <div className="mb-12 relative z-10">
            <span className="inline-block px-3 py-1.5 rounded-lg bg-[#10B981]/10 text-[13px] font-bold text-[#10B981] uppercase tracking-wider mb-4 border border-[#10B981]/20">For Employers</span>
            <h2 className="font-[Manrope,sans-serif] text-3xl md:text-4xl font-bold text-[#1F2430] mb-4">Hire signal, not noise.</h2>
            <p className="text-[18px] text-[#1F2430]/70 max-w-2xl font-medium">Stop screening resumes. Start comparing verified capabilities.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12 relative z-10">
            {[
              { title: "Hire based on evidence", desc: "Review candidates based on actual interview performance." },
              { title: "Role-specific matching", desc: "Find exact fits for your specific tech stack and architectural needs." },
              { title: "Beyond keyword screening", desc: "Discover hidden gems that don't have perfect resumes but have perfect skills." },
              { title: "Candidate comparison", desc: "Compare technical strengths side-by-side with objective metrics." },
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-4 items-start"
              >
                <div className="w-2 h-2 mt-2.5 rounded-full bg-[#10B981] flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <div>
                  <h4 className="font-[Manrope,sans-serif] text-[18px] font-bold text-[#1F2430] mb-2">{feature.title}</h4>
                  <p className="text-[15px] text-[#1F2430]/70 font-medium">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            className="relative z-10 px-8 py-4 rounded-2xl bg-white text-[#1F2430] text-[16px] font-bold shadow-sm border border-white/60 hover:bg-white/80 transition-colors flex items-center gap-2"
          >
            Start Hiring <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* 9. Final CTA */}
        <div className="glass-card rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden bg-gradient-to-b from-white/40 to-white/20">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.08, 0.15, 0.08],
              rotate: [0, 10, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[300px] bg-[#3E63F5] rounded-full blur-[120px] pointer-events-none" 
          />
          
          <h2 className="relative z-10 font-[Manrope,sans-serif] text-3xl md:text-5xl font-extrabold text-[#1F2430] tracking-tight mb-6 leading-tight">
            Start with one interview.<br />Let your skills do the talking.
          </h2>
          <p className="relative z-10 text-[18px] md:text-[20px] text-[#1F2430]/70 mb-10 max-w-xl mx-auto font-medium">
            Join thousands of candidates getting hired based on merit. It's free, secure, and takes ~30 minutes.
          </p>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              onClick={() => navigate('/pre-interview')} 
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-[#1F2430] text-white text-[16px] font-bold hover:bg-[#2A3040] transition-all shadow-[0_8px_24px_rgba(30,35,48,0.2)] hover:-translate-y-1 flex items-center justify-center gap-2 group"
            >
              Start Free Interview 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white/60 text-[#1F2430] text-[16px] font-bold hover:bg-white transition-all shadow-sm border border-white"
            >
              Learn How It Works
            </motion.button>
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
            <a href="#" className="hover:text-[#1F2430] transition-colors">About</a>
            <a href="#candidates" className="hover:text-[#1F2430] transition-colors">Candidates</a>
            <a href="#companies" className="hover:text-[#1F2430] transition-colors">Companies</a>
            <a href="#trust" className="hover:text-[#1F2430] transition-colors">Trust</a>
            <a href="#" className="hover:text-[#1F2430] transition-colors">Pricing</a>
            <a href="#" className="hover:text-[#1F2430] transition-colors">Contact</a>
          </div>
          
          <p className="text-[13px] text-[#1F2430]/40 font-medium">© 2026 PlacedOn Inc.</p>
        </footer>

      </div>
    </div>
  );
}