import { motion } from "motion/react";
import { Building2, Clock, ShieldCheck, EyeOff, Check, X, ArrowRight, Sparkles } from "lucide-react";
import { AnimatedContent } from "./ui/AnimatedContent";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNavigate } from "react-router";

export function EmployerInterestScreen() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <AnimatedContent direction="vertical" distance={20} delay={0}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#10B981]/10 text-[#10B981] mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-[Manrope,sans-serif] text-[2rem] font-extrabold text-[#1F2430] leading-tight">
            Employer Interest Request
          </h2>
          <p className="text-[16px] text-[#1F2430]/60 font-medium mt-2 max-w-lg mx-auto">
            A company has reviewed your verified technical signals and wants to connect directly with you.
          </p>
        </div>
      </AnimatedContent>

      <AnimatedContent direction="vertical" distance={20} delay={0.1}>
        <div className="glass-card rounded-[2.5rem] p-6 md:p-12 border border-white/80 shadow-[0_16px_48px_rgba(30,35,60,0.05)] relative overflow-hidden">
          {/* Background Accent */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#3E63F5]/10 to-transparent pointer-events-none rounded-tr-[2.5rem]" />
          
          <div className="flex flex-col lg:flex-row gap-10 relative z-10">
            {/* Left: Company & Role Info */}
            <div className="lg:w-[55%]">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-20 h-20 rounded-2xl bg-white border border-[#1F2430]/10 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                  <ImageWithFallback src="https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&h=200&fit=crop" alt="Linear" className="w-12 h-12 object-cover rounded-full" />
                </div>
                <div>
                  <h3 className="font-[Manrope,sans-serif] text-[28px] font-bold text-[#1F2430] leading-tight">
                    Senior Frontend Engineer
                  </h3>
                  <div className="flex items-center gap-2 text-[16px] font-bold text-[#1F2430]/70 mt-2">
                    <Building2 className="w-5 h-5" /> Linear
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[13px] font-bold text-[#1F2430]/40 uppercase tracking-wider mb-3">Why you matched</h4>
                  <div className="bg-white/60 p-5 rounded-2xl border border-white shadow-sm relative">
                    <Sparkles className="absolute top-5 right-5 w-5 h-5 text-[#3E63F5]/30" />
                    <p className="text-[15px] text-[#1F2430]/80 font-medium leading-relaxed pr-8">
                      "We were incredibly impressed by your TypeScript and React expertise, particularly your work on real-time features. Your technical depth in frontend performance optimization is exactly what we're looking for in our high-performance UI team."
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-[14px] font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-5 py-4 rounded-xl border border-[#F59E0B]/20 w-max">
                  <Clock className="w-5 h-5" /> Request expires in 7 days
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-[#1F2430]/10 to-transparent" />
            <div className="block lg:hidden h-px w-full bg-gradient-to-r from-transparent via-[#1F2430]/10 to-transparent" />

            {/* Right: Privacy & Actions */}
            <div className="lg:w-[45%] flex flex-col justify-between">
              <div>
                <h4 className="text-[13px] font-bold text-[#1F2430]/40 uppercase tracking-wider mb-5">What happens if you accept</h4>
                
                <div className="space-y-6 mb-10">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white border border-[#1F2430]/10 flex items-center justify-center shrink-0 shadow-sm">
                      <EyeOff className="w-5 h-5 text-[#3E63F5]" />
                    </div>
                    <div>
                      <h5 className="text-[16px] font-bold text-[#1F2430]">You remain anonymous</h5>
                      <p className="text-[14px] text-[#1F2430]/60 font-medium mt-1 leading-relaxed">They will only see your verified technical signals (Tier 2 Profile). Your name and current employer remain hidden until you choose to share them.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white border border-[#1F2430]/10 flex items-center justify-center shrink-0 shadow-sm">
                      <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                    </div>
                    <div>
                      <h5 className="text-[16px] font-bold text-[#1F2430]">Direct hiring manager access</h5>
                      <p className="text-[14px] text-[#1F2430]/60 font-medium mt-1 leading-relaxed">Accepting opens a direct chat with their VP of Engineering, skipping initial HR screens completely.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mt-auto pt-8 border-t border-[#1F2430]/10">
                <button 
                  onClick={() => navigate('/candidate')}
                  className="w-full py-4 rounded-xl bg-[#1F2430] text-white text-[16px] font-bold shadow-md hover:bg-[#2A3040] transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" /> Accept & Open Chat
                </button>
                <button 
                  onClick={() => navigate('/candidate')}
                  className="w-full py-4 rounded-xl bg-transparent text-[#1F2430]/60 hover:text-[#1F2430] text-[15px] font-bold transition-colors flex items-center justify-center gap-2 hover:bg-[#1F2430]/5"
                >
                  <X className="w-5 h-5" /> Decline this role
                </button>
              </div>
            </div>
          </div>
        </div>
      </AnimatedContent>
    </div>
  );
}
