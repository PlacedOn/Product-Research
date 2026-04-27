import { motion } from "motion/react";
import { Building2, Code2, Clock, Calendar, ShieldCheck, Play, CheckCircle2, X } from "lucide-react";
import { AnimatedContent } from "./ui/AnimatedContent";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNavigate } from "react-router";

export function FollowUpChallengeScreen() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-3xl mx-auto py-4">
      <AnimatedContent direction="vertical" distance={20} delay={0}>
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#3E63F5]/10 text-[#3E63F5] mb-4">
            <Code2 className="w-6 h-6" />
          </div>
          <h2 className="font-[Manrope,sans-serif] text-[2rem] font-extrabold text-[#1F2430] leading-tight mb-2">
            Company-Specific Challenge
          </h2>
          <p className="text-[16px] text-[#1F2430]/60 font-medium">
            A company wants to dive deeper into a specific skill before moving forward.
          </p>
        </div>
      </AnimatedContent>

      <AnimatedContent direction="vertical" distance={20} delay={0.1}>
        <div className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-white/80 shadow-[0_24px_56px_rgba(30,35,60,0.06)] relative overflow-hidden">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-10 border-b border-[#1F2430]/10">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white border border-[#1F2430]/10 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                <ImageWithFallback src="https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&h=200&fit=crop" alt="Stripe" className="w-10 h-10 object-cover rounded-full" />
              </div>
              <div>
                <h3 className="font-[Manrope,sans-serif] text-[24px] font-bold text-[#1F2430] leading-tight">
                  Stripe
                </h3>
                <div className="text-[15px] text-[#1F2430]/60 font-medium mt-1">
                  Requested by Engineering Leadership
                </div>
              </div>
            </div>
            <div className="bg-[#F8F9FC] px-5 py-3 rounded-2xl border border-white/60 shadow-sm text-center min-w-[120px]">
              <div className="text-[12px] font-bold text-[#1F2430]/40 uppercase tracking-wider mb-1">Duration</div>
              <div className="flex items-center justify-center gap-1.5 text-[18px] font-bold text-[#1F2430]">
                <Clock className="w-5 h-5 text-[#3E63F5]" /> 15 mins
              </div>
            </div>
          </div>

          {/* Challenge Details */}
          <div className="space-y-6 mb-10">
            <div className="bg-white/50 p-8 rounded-[2rem] border border-white shadow-sm">
              <h4 className="text-[13px] font-bold text-[#1F2430]/40 uppercase tracking-wider mb-3">Topic</h4>
              <div className="font-[Manrope,sans-serif] text-[26px] font-bold text-[#1F2430] leading-tight">
                Idempotency & Retry Logic
              </div>
              <p className="text-[16px] text-[#1F2430]/70 font-medium mt-4 leading-relaxed max-w-2xl">
                Stripe handles billions of transactions. They'd like to see how you approach building an idempotent API client wrapper that gracefully handles network failures and retries.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-5 mb-5">
              <div className="flex-1 flex items-start gap-4 p-5 bg-[#F8F9FC]/60 rounded-2xl border border-white/40 shadow-[0_4px_12px_rgba(30,35,60,0.02)]">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-[#1F2430]/5">
                  <Calendar className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <div>
                  <h5 className="text-[15px] font-bold text-[#1F2430]">Complete by Friday</h5>
                  <p className="text-[14px] text-[#1F2430]/60 font-medium mt-0.5">Deadline in 3 days</p>
                </div>
              </div>
              
              <div className="flex-1 flex items-start gap-4 p-5 bg-[#F8F9FC]/60 rounded-2xl border border-white/40 shadow-[0_4px_12px_rgba(30,35,60,0.02)]">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-[#1F2430]/5">
                  <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                </div>
                <div>
                  <h5 className="text-[15px] font-bold text-[#1F2430]">Private Assessment</h5>
                  <p className="text-[14px] text-[#1F2430]/60 font-medium mt-0.5">Shared only with Stripe</p>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="flex items-start gap-4 px-4 mb-10 p-5 rounded-2xl bg-[#10B981]/5 border border-[#10B981]/10 text-[14px] text-[#1F2430]/70 font-medium leading-relaxed">
            <div className="mt-0.5"><CheckCircle2 className="w-5 h-5 text-[#10B981]" /></div>
            <p>
              Unlike standard PlacedOn micro-interviews, <strong className="text-[#1F2430]">this challenge does not affect your global profile score</strong>. It is evaluated strictly for Stripe's internal hiring process.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse md:flex-row gap-5 pt-8 border-t border-[#1F2430]/10">
            <button 
              onClick={() => navigate('/candidate')}
              className="md:w-1/3 py-4 rounded-xl bg-transparent text-[#1F2430]/50 hover:text-[#1F2430] hover:bg-white/40 transition-colors text-[16px] font-bold flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" /> Decline
            </button>
            <button 
              onClick={() => navigate('/pre-interview')}
              className="flex-1 py-4 rounded-xl bg-[#3E63F5] hover:bg-[#2A44B0] text-white transition-colors text-[16px] font-bold shadow-[0_4px_16px_rgba(62,99,245,0.25)] flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" /> Start Assessment Now
            </button>
          </div>
        </div>
      </AnimatedContent>
    </div>
  );
}
