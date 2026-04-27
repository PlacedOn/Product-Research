import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Sparkles, FileText, CheckCircle, Shield, Eye, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

const STEPS = [
  "Analyzing your answers",
  "Extracting verified skill signals",
  "Building your profile summary",
  "Preparing your privacy and sharing controls"
];

const PREVIEW_CARDS = [
  {
    title: "AI Summary",
    desc: "A concise overview of how you think, communicate, and solve problems."
  },
  {
    title: "Top Strengths",
    desc: "Your strongest signals, backed by interview evidence."
  },
  {
    title: "Verified Skills",
    desc: "Skills inferred from the interview, not self-reported claims."
  },
  {
    title: "Privacy & Visibility",
    desc: "You control what is public, what is private, and when companies can view your profile."
  }
];

export function ProfileGenerationScreen() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < STEPS.length) {
          return prev + 1;
        }
        clearInterval(timer);
        setTimeout(() => navigate('/candidate/profile'), 1000);
        return prev;
      });
    }, 2500);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-[#F3F2F0] relative overflow-hidden font-[Inter,sans-serif]">
      {/* Soft Ambient Background Washes */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#EEF1F8] rounded-full mix-blend-multiply filter blur-[100px] opacity-70" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-[#F3EFEA] rounded-full mix-blend-multiply filter blur-[100px] opacity-60" />
      
      <div className="w-full max-w-[1200px] bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_24px_80px_rgba(30,35,60,0.06),inset_0_2px_4px_rgba(255,255,255,0.9)] ring-1 ring-[#1F2430]/[0.04] p-8 md:p-16 flex flex-col md:flex-row gap-16 relative z-10">
        
        {/* Left Content */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3E63F5] to-[#7190FF] shadow-[0_4px_12px_rgba(62,99,245,0.2)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-[Manrope,sans-serif] font-bold text-[24px] text-[#1F2430] tracking-tight">Generating your profile</h2>
          </div>

          <div className="space-y-6 mb-12">
            {STEPS.map((step, idx) => {
              const isPast = idx < currentStep;
              const isActive = idx === currentStep;
              return (
                <div key={idx} className={`flex items-center gap-4 transition-all duration-500 ${isActive ? 'opacity-100 scale-105' : isPast ? 'opacity-60' : 'opacity-30'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 ${isPast ? 'bg-[#10B981] text-white' : isActive ? 'bg-[#3E63F5] text-white animate-pulse' : 'bg-[#1F2430]/10 text-transparent'}`}>
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className={`text-[16px] font-semibold transition-colors duration-500 ${isActive ? 'text-[#1F2430]' : 'text-[#1F2430]/70'}`}>{step}</span>
                </div>
              );
            })}
          </div>

          <div className="p-6 rounded-[1.5rem] bg-white border border-[#1F2430]/[0.06] shadow-sm">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#3E63F5]/40 shrink-0" />
                <span className="text-[14px] text-[#1F2430]/70 font-medium">Your profile is being built from what you demonstrated in the interview.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#3E63F5]/40 shrink-0" />
                <span className="text-[14px] text-[#1F2430]/70 font-medium">Raw transcript is never shown publicly.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#3E63F5]/40 shrink-0" />
                <span className="text-[14px] text-[#1F2430]/70 font-medium">You will review everything before your profile is visible to companies.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Preview Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 place-content-center">
          {PREVIEW_CARDS.map((card, idx) => (
             <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: currentStep >= idx ? 1 : 0.4, y: currentStep >= idx ? 0 : 20 }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-[1.5rem] bg-white/60 border border-[#1F2430]/[0.04] shadow-[0_4px_16px_rgba(30,35,60,0.02)] flex flex-col gap-3"
            >
              <h4 className="font-[Manrope,sans-serif] font-bold text-[#1F2430] text-[15px]">{card.title}</h4>
              <p className="text-[13px] text-[#1F2430]/60 font-medium leading-[1.5]">{card.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
