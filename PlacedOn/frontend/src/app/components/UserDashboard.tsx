import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Sparkles, ChevronRight, User,
  Clock, Briefcase, Zap, Star, Shield, ArrowUpRight, 
  MapPin, CheckCircle2, TrendingUp, Calendar, ArrowRight, Activity, ZapOff, Check, AlertCircle, Play,
  Search
} from 'lucide-react';

export function UserDashboard() {
  const navigate = useNavigate();

  return (
    <>
      {/* Global Search Bar (Pill style) */}
      <div className="mb-10 flex justify-center w-full z-20 relative">
        <div className="flex items-center w-full max-w-2xl bg-white rounded-full p-2 shadow-[0_16px_40px_rgba(30,35,60,0.08)] transition-transform focus-within:scale-[1.01] duration-300">
          <input 
            type="text"
            placeholder="Search companies, roles..."
            className="flex-1 bg-transparent border-none outline-none pl-6 pr-4 py-3 text-[18px] font-medium text-[#1F2430] placeholder:text-[#1F2430]/40 font-[Manrope,sans-serif]"
          />
          <button className="w-14 h-14 rounded-full bg-[#2D2A26] hover:bg-[#1F2430] transition-colors flex items-center justify-center text-white shadow-md flex-shrink-0">
            <Search className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Top Bento Grid: AI Matchmaker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Hero 1: AI Matchmaker (Full width) */}
          <div className="lg:col-span-12 relative overflow-hidden rounded-[2.5rem] glass-card p-8 md:p-10 flex flex-col justify-between group">
            {/* Glowing Orb */}
            <div className="absolute top-1/2 left-[70%] -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-tr from-[#3E63F5] to-[#B392F0] rounded-full blur-[80px] opacity-30 animate-pulse-glow pointer-events-none" />
            
            <div className="relative z-10 w-full md:w-[65%] mb-8">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="px-3 py-1.5 rounded-full bg-[#3E63F5]/10 text-[#3E63F5] text-[12px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] border border-[#3E63F5]/20 backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  Top Matches Found
                </div>
              </div>
              
              <h2 className="font-[Manrope,sans-serif] text-3xl md:text-[38px] font-bold text-[#1F2430] tracking-tight mb-4 leading-[1.15]">
                Companies looking<br/>for your exact profile
              </h2>
              <p className="text-[16px] text-[#1F2430]/70 font-medium mb-8">
                Based on your deep-dive interview, your top 5% Frontend and Architecture skills match these open roles perfectly.
              </p>
            </div>

            {/* Floating 3D "Matches" Stack */}
            <div className="relative z-10 flex gap-4 mt-auto">
              {/* Match Card 1 */}
              <div className="relative w-[280px] rounded-[1.75rem] bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_16px_32px_rgba(30,35,60,0.06),inset_0_1px_1px_rgba(255,255,255,1)] p-5 animate-float-slow transform-style-3d hover:-translate-y-2 transition-transform cursor-pointer">
                {/* Floating pill breaking bounds */}
                <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-xl bg-[#10B981] text-white text-[12px] font-bold flex items-center gap-1.5 shadow-[0_8px_16px_rgba(16,185,129,0.3)] translate-z-[30px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 98% Match
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#635BFF] flex items-center justify-center text-white font-[Manrope,sans-serif] font-bold text-lg shadow-inner">
                    S
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#1F2430] leading-tight">Stripe</h3>
                    <p className="text-[13px] font-medium text-[#1F2430]/60">Frontend Engineer</p>
                  </div>
                </div>
                
                {/* Micro Sparkline Graphic */}
                <div className="w-full h-[40px] bg-gradient-to-b from-[#1F2430]/[0.02] to-transparent rounded-lg border border-[#1F2430]/[0.05] flex items-end overflow-hidden mb-4 relative">
                  <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M0 30 L10 20 L25 25 L40 10 L55 15 L70 5 L85 15 L100 2" fill="none" stroke="#3E63F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M0 30 L10 20 L25 25 L40 10 L55 15 L70 5 L85 15 L100 2 L100 30 L0 30" fill="url(#gradient)" opacity="0.1" />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3E63F5" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute right-2 top-2 w-1.5 h-1.5 bg-[#3E63F5] rounded-full shadow-[0_0_8px_rgba(62,99,245,0.8)] animate-pulse" />
                </div>
                
                <button className="w-full py-2.5 rounded-xl bg-[#1F2430] text-white text-[13px] font-bold hover:bg-[#2A3040] transition-colors shadow-sm flex items-center justify-center gap-2">
                  Send Verified Profile <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Match Card 2 (Partially hidden/stacked) */}
              <div className="relative w-[280px] rounded-[1.75rem] bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_16px_32px_rgba(30,35,60,0.04)] p-5 opacity-70 scale-95 origin-left -ml-16 animate-float-slow style={{animationDelay: '1.5s'}} pointer-events-none">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white font-[Manrope,sans-serif] font-bold text-lg">
                    V
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#1F2430] leading-tight">Vercel</h3>
                    <p className="text-[13px] font-medium text-[#1F2430]/60">Design Engineer</p>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-[#1F2430]/5 mb-2 overflow-hidden"><div className="w-[85%] h-full bg-[#1F2430]/20 rounded-full" /></div>
                <div className="w-full h-2 rounded-full bg-[#1F2430]/5 overflow-hidden"><div className="w-[60%] h-full bg-[#1F2430]/20 rounded-full" /></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bento Grid: Pipeline & Action Required */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Applications / Pipeline */}
          <div className="lg:col-span-2 rounded-[2.5rem] glass-card p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-[Manrope,sans-serif] text-[20px] font-bold text-[#1F2430]">Pipeline Activity</h3>
              <button className="text-[14px] font-semibold text-[#3E63F5] hover:text-[#2A44B0] flex items-center gap-1 transition-colors">
                View all <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { company: "OpenAI", role: "Frontend AI Integration", status: "Reviewing Profile", dotColor: "bg-[#F59E0B]", icon: "O", color: "bg-[#10A37F] text-white" },
                { company: "Linear", role: "Product Engineer", status: "Interviewing", dotColor: "bg-[#3E63F5]", icon: "L", color: "bg-[#5E6AD2] text-white" },
              ].map((app, i) => (
                <div key={i} className="group flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-white/60 shadow-[0_2px_8px_rgba(30,35,60,0.01)] hover:bg-white/80 transition-all cursor-pointer hover:shadow-[0_8px_24px_rgba(30,35,60,0.04)] hover:-translate-y-0.5">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${app.color} shadow-sm flex items-center justify-center text-[18px] font-bold font-[Manrope,sans-serif]`}>
                      {app.icon}
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-[#1F2430] leading-tight mb-1">{app.company}</h4>
                      <p className="text-[13px] font-medium text-[#1F2430]/60">{app.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-white shadow-sm">
                      <div className={`w-2 h-2 rounded-full ${app.dotColor} shadow-sm animate-pulse`} />
                      <span className="text-[13px] font-bold text-[#1F2430]/80">{app.status}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1F2430]/40 group-hover:text-[#1F2430] group-hover:bg-[#F3F2F0] transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Highlighted Offer Row */}
              <div className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#10B981]/10 to-transparent border border-[#10B981]/20 shadow-[0_2px_8px_rgba(16,185,129,0.05)] hover:bg-[#10B981]/20 transition-all cursor-pointer relative overflow-hidden">
                <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-[#10B981]/10 to-transparent" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-[#10B981] shadow-[0_4px_16px_rgba(16,185,129,0.3)] flex items-center justify-center text-white">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-[15px] font-bold text-[#1F2430] leading-tight">Vercel</h4>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#10B981] text-white uppercase tracking-wider">Offer</span>
                    </div>
                    <p className="text-[13px] font-medium text-[#1F2430]/60">Review by Friday</p>
                  </div>
                </div>
                <div className="relative z-10 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#10B981] group-hover:bg-[#10B981] group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Micro-Interviews / Action Required */}
          <div className="rounded-[2.5rem] glass-card p-8 relative overflow-hidden flex flex-col">
            {/* Subtle glow */}
            <div className="absolute bottom-[-10%] right-[-10%] w-[150px] h-[150px] bg-gradient-to-tr from-[#F59E0B] to-[#FCD34D] rounded-full blur-[50px] opacity-20 pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" />
              <h3 className="font-[Manrope,sans-serif] text-[16px] font-bold text-[#1F2430]">Action Required</h3>
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <div className="w-12 h-12 rounded-[1rem] bg-white/60 border border-white shadow-sm flex items-center justify-center text-[#F59E0B] mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-[Manrope,sans-serif] text-[20px] font-bold text-[#1F2430] mb-2 leading-tight">
                Stripe requested a Micro-Interview
              </h4>
              <p className="text-[14px] font-medium text-[#1F2430]/60 mb-6 leading-relaxed">
                They love your profile, but want to see your approach to API versioning. It takes 10 minutes.
              </p>
            </div>
            
            <button 
              onClick={() => navigate('/pre-interview')}
              className="w-full py-3.5 rounded-2xl bg-[#1F2430] text-white font-semibold text-[14px] shadow-[0_8px_20px_rgba(30,35,60,0.15)] hover:bg-[#2A3040] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              Start 10m Challenge <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
    </>
  );
}
