import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Sparkles, ChevronRight, Briefcase, Zap, Shield, ArrowRight, Play, 
  Search, Code2, LayoutTemplate, Database, LineChart, ShieldCheck,
  BrainCircuit, Lock
} from 'lucide-react';
import { AnimatedContent } from './ui/AnimatedContent';
import { BlurText } from './ui/BlurText';
import { Stepper } from './ui/Stepper';
import { TiltedCard } from './ui/TiltedCard';
import { motion } from 'motion/react';

export function UserDashboard() {
  const navigate = useNavigate();

  const preparationSteps = [
    { title: 'Choose a track', description: 'Select a technical focus that best matches your expertise.' },
    { title: '30-minute conversation', description: 'Chat with our AI interviewer. No trick questions, just deep technical discussions.' },
    { title: 'Get verified', description: 'We generate an evidence-backed skill profile to send to top companies.' }
  ];

  const roleTracks = [
    { id: 'frontend', title: 'Frontend Engineer', icon: <LayoutTemplate className="w-5 h-5" />, color: 'text-[#3E63F5]', bg: 'bg-[#3E63F5]/10', border: 'border-[#3E63F5]/20', tags: ['React', 'Architecture', 'CSS'] },
    { id: 'backend', title: 'Backend Engineer', icon: <Database className="w-5 h-5" />, color: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/20', tags: ['Node.js', 'System Design', 'APIs'] },
    { id: 'fullstack', title: 'Full Stack Engineer', icon: <Code2 className="w-5 h-5" />, color: 'text-[#8B5CF6]', bg: 'bg-[#8B5CF6]/10', border: 'border-[#8B5CF6]/20', tags: ['End-to-end', 'Databases', 'UI'] },
    { id: 'data', title: 'Data Engineer', icon: <LineChart className="w-5 h-5" />, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/20', tags: ['Pipelines', 'SQL', 'Analytics'] },
  ];

  return (
    <div className="flex flex-col gap-6">
      
      {/* Global Search Bar (Pill style) */}
      <AnimatedContent direction="vertical" distance={10} delay={0.05}>
        <div className="mb-6 flex justify-center w-full z-20 relative">
          <div className="flex items-center w-full max-w-2xl bg-white/70 backdrop-blur-xl rounded-full p-2 border border-white/80 shadow-[0_16px_40px_rgba(30,35,60,0.06),inset_0_1px_1px_rgba(255,255,255,1)] transition-transform focus-within:scale-[1.01] duration-300">
            <input 
              type="text"
              placeholder="Search available roles and tracks..."
              className="flex-1 bg-transparent border-none outline-none pl-6 pr-4 py-3 text-[16px] font-medium text-[#1F2430] placeholder:text-[#1F2430]/40 font-[Manrope,sans-serif]"
            />
            <button className="w-12 h-12 rounded-full bg-[#1F2430] hover:bg-[#2A3040] transition-colors flex items-center justify-center text-white shadow-md flex-shrink-0">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </AnimatedContent>

      {/* Hero: Build Your Profile */}
      <AnimatedContent direction="vertical" distance={30} delay={0.15}>
        <div className="relative overflow-hidden rounded-[2.5rem] glass-card p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-12 group border border-white/80 shadow-[0_16px_40px_rgba(62,99,245,0.05)]">
          {/* Glowing action orb */}
          <div className="absolute top-1/2 left-[20%] -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-[#3E63F5] to-[#B392F0] rounded-full blur-[100px] opacity-20 pointer-events-none animate-pulse-glow" />
          
          {/* Left: Copy & CTAs */}
          <div className="relative z-10 lg:w-[55%]">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="px-3 py-1.5 rounded-full bg-[#3E63F5]/10 text-[#3E63F5] text-[12px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] border border-[#3E63F5]/20 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                First Steps
              </div>
            </div>
            
            <h2 className="font-[Manrope,sans-serif] text-3xl md:text-[44px] font-bold text-[#1F2430] tracking-tight mb-5 leading-[1.1]">
              <BlurText 
                text="Build your verified profile with one AI interview."
                delay={0.03}
                animateBy="words"
                direction="bottom"
              />
            </h2>
            <p className="text-[16px] md:text-[18px] text-[#1F2430]/70 font-medium mb-8 max-w-xl leading-relaxed">
              Choose a role, complete a 30-minute conversation, and PlacedOn turns your answers into an evidence-backed skill profile that top companies trust.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/pre-interview')}
                className="px-8 py-4 rounded-2xl bg-[#3E63F5] text-white text-[16px] font-bold shadow-[0_8px_24px_rgba(62,99,245,0.3)] hover:bg-[#2A44B0] transition-colors flex items-center justify-center gap-2 group/btn"
              >
                <Play className="w-5 h-5 fill-current" />
                Start Interview
              </motion.button>
              <button className="px-8 py-4 rounded-2xl bg-white/60 text-[#1F2430] text-[15px] font-bold shadow-sm border border-white hover:bg-white transition-colors flex items-center gap-2 group/browse">
                Browse Roles <ArrowRight className="w-4 h-4 group-hover/browse:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right: Abstract Profile Preview */}
          <div className="relative z-10 lg:w-[45%] flex justify-center lg:justify-end w-full perspective-[1000px]">
            <div className="w-full max-w-[380px] aspect-[4/3] rounded-[2rem] relative">
              <TiltedCard 
                imageSrc="https://images.unsplash.com/photo-1689028294160-e78a88abcb19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdsYXNzJTIwZ2VvbWV0cnl8ZW58MXx8fHwxNzc2NTk4NzA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                altText="Abstract Glass Geometry representing a verified profile"
                captionText="Sample Verified Profile"
                containerWidth="100%"
                containerHeight="100%"
                rotateAmplitude={8}
                scaleOnHover={1.02}
                showTooltip={true}
                displayOverlayContent={true}
                overlayContent={
                  <div className="flex flex-col items-center text-center w-full h-full justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/80 backdrop-blur-md shadow-xl flex items-center justify-center mb-4 border border-white">
                      <ShieldCheck className="w-8 h-8 text-[#10B981]" />
                    </div>
                    <div className="w-3/4 h-3 bg-white/60 rounded-full mb-2 blur-[1px]" />
                    <div className="w-1/2 h-3 bg-white/60 rounded-full mb-6 blur-[1px]" />
                    <div className="grid grid-cols-2 gap-2 w-full px-6">
                      <div className="h-12 bg-white/40 rounded-xl blur-[2px]" />
                      <div className="h-12 bg-white/40 rounded-xl blur-[2px]" />
                      <div className="h-12 bg-white/40 rounded-xl blur-[2px]" />
                      <div className="h-12 bg-white/40 rounded-xl blur-[2px]" />
                    </div>
                  </div>
                }
              />
              
              {/* Floating badges around the tilted card */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-4 top-10 px-4 py-2 bg-white/90 backdrop-blur-xl rounded-xl border border-white shadow-xl flex items-center gap-2 z-20"
              >
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-[12px] font-bold text-[#1F2430]">Top 5% Frontend</span>
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -left-6 bottom-12 px-4 py-2 bg-[#1F2430] rounded-xl shadow-xl flex items-center gap-2 z-20"
              >
                <BrainCircuit className="w-4 h-4 text-white" />
                <span className="text-[12px] font-bold text-white">System Design: Strong</span>
              </motion.div>
            </div>
          </div>
        </div>
      </AnimatedContent>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Role Selection Tracks */}
        <AnimatedContent direction="vertical" distance={30} delay={0.25} className="lg:col-span-2 flex flex-col">
          <div className="h-full rounded-[2.5rem] glass-card p-8 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-[Manrope,sans-serif] text-[20px] font-bold text-[#1F2430]">Choose a Track</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              {roleTracks.map((role) => (
                <div 
                  key={role.id}
                  className="group relative bg-white/50 backdrop-blur-sm border border-white/80 rounded-2xl p-5 hover:bg-white/80 transition-all cursor-pointer hover:shadow-[0_8px_24px_rgba(30,35,60,0.06)] hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/60 to-transparent pointer-events-none rounded-tr-2xl" />
                  
                  <div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className={`w-10 h-10 rounded-xl ${role.bg} ${role.color} ${role.border} border flex items-center justify-center shadow-sm`}>
                        {role.icon}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1F2430]/30 group-hover:text-[#1F2430] group-hover:bg-[#F3F2F0] transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                    <h4 className="text-[16px] font-bold text-[#1F2430] leading-tight mb-2 relative z-10">
                      {role.title}
                    </h4>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2 relative z-10">
                    {role.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 rounded-md bg-white/60 text-[#1F2430]/60 text-[11px] font-bold tracking-wide border border-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-[#1F2430]/5 flex items-center justify-between">
              <p className="text-[13px] font-medium text-[#1F2430]/60">Don't see your track?</p>
              <button className="text-[13px] font-bold text-[#3E63F5] hover:text-[#2A44B0] transition-colors">
                View all 12 tracks
              </button>
            </div>
          </div>
        </AnimatedContent>

        {/* Expectations & Trust */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <AnimatedContent direction="vertical" distance={30} delay={0.35} className="flex-1">
            <div className="h-full rounded-[2.5rem] glass-card p-8 flex flex-col">
              <h3 className="font-[Manrope,sans-serif] text-[20px] font-bold text-[#1F2430] mb-8">What to Expect</h3>
              <div className="flex-1">
                <Stepper steps={preparationSteps} currentStep={0} />
              </div>
            </div>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={30} delay={0.45}>
            <div className="rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/60 p-6 flex gap-4 shadow-sm items-center">
              <div className="w-10 h-10 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center flex-shrink-0 text-[#10B981]">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#1F2430] mb-0.5">Your data is private</h4>
                <p className="text-[12px] font-medium text-[#1F2430]/60 leading-snug">
                  Companies only see your profile after you approve their match request.
                </p>
              </div>
            </div>
          </AnimatedContent>
        </div>

      </div>
    </div>
  );
}