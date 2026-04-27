import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Video, Mic, Wifi, Shield, ArrowRight, Keyboard, Pencil, Eye, RefreshCw, CheckCircle2, Sparkles, MessageSquare, Clock, AlertCircle } from 'lucide-react';

export function PreInterviewScreen() {
  const navigate = useNavigate();
  const [consentReady, setConsentReady] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-start md:items-center justify-center p-4 py-8 sm:p-8 bg-[#F3F2F0] relative overflow-x-hidden overflow-y-auto font-[Inter,sans-serif]">
      {/* Soft Ambient Background Washes */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#EEF1F8] rounded-full mix-blend-multiply filter blur-[100px] opacity-70 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-[#F3EFEA] rounded-full mix-blend-multiply filter blur-[100px] opacity-60 pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-[#E6EAF5] rounded-full mix-blend-multiply filter blur-[100px] opacity-40 pointer-events-none" />
      
      {/* App Shell */}
      <div className="w-full max-w-[1440px] h-auto md:h-[90vh] md:min-h-[700px] md:max-h-[940px] bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_24px_80px_rgba(30,35,60,0.06),inset_0_2px_4px_rgba(255,255,255,0.9)] ring-1 ring-[#1F2430]/[0.04] flex flex-col md:flex-row relative z-10 my-auto">
        
        {/* Left Column: Content & Process */}
        <div className="w-full md:w-[60%] lg:w-[65%] md:h-full md:overflow-y-auto px-6 py-10 md:px-16 md:py-16 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#1F2430]/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#1F2430]/20 flex flex-col relative z-20">
          
          {/* Header */}
          <header className="flex items-center justify-between mb-16 shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3E63F5] to-[#7190FF] shadow-[0_4px_12px_rgba(62,99,245,0.2)] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white opacity-90" />
              </div>
              <div>
                <h2 className="font-[Manrope,sans-serif] font-bold text-[#1F2430] text-[17px] tracking-tight">PlacedOn</h2>
                <div className="flex items-center gap-2 text-[13px] font-medium text-[#1F2430]/50">
                  <span>Frontend Engineer</span>
                  <div className="w-1 h-1 rounded-full bg-[#1F2430]/20" />
                  <span>Technical Interview</span>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-3 px-4 py-2.5 bg-white/60 rounded-full ring-1 ring-[#1F2430]/[0.04] shadow-[0_2px_8px_rgba(30,35,60,0.02)]">
              <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#1F2430]/60">
                <RefreshCw className="w-3.5 h-3.5" />
                AI-Led
              </div>
              <div className="w-[1px] h-3 bg-[#1F2430]/10" />
              <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#10B981]">
                <Clock className="w-3.5 h-3.5" />
                ~35-40 min
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <div className="max-w-[680px] shrink-0 mb-auto">
            <h1 className="font-[Manrope,sans-serif] text-3xl md:text-[42px] leading-[1.15] font-extrabold text-[#1F2430] tracking-tight mb-5">
              Before you begin
            </h1>
            <p className="text-[17px] md:text-[18px] leading-[1.6] text-[#1F2430]/70 font-medium mb-12 text-balance">
              You're about to start an adaptive conversation. There are no trick questions—we just want to understand how you think and build. 
            </p>

            {/* Visual Preview / Rules of the Road */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* Visual Preview */}
              <div className="rounded-[1.5rem] bg-gradient-to-b from-[#F9F8F6] to-[#F0F2F5] border border-[#1F2430]/[0.04] overflow-hidden p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-5 h-5 text-[#3E63F5]" />
                  <h3 className="font-[Manrope,sans-serif] text-[15px] font-bold text-[#1F2430]">What it looks like</h3>
                </div>
                <div className="flex-1 rounded-xl bg-white shadow-sm border border-white flex flex-col p-4 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#3E63F5]/10 flex items-center justify-center"><Sparkles className="w-4 h-4 text-[#3E63F5]" /></div>
                    <div className="h-4 bg-[#F3F4F6] rounded flex-1 max-w-[120px]"></div>
                  </div>
                  <div className="h-16 bg-[#F8F9FC] rounded-lg mt-2 border border-[#F3F4F6]"></div>
                  <div className="flex items-center gap-2 mt-auto self-end">
                     <div className="w-24 h-8 rounded-full bg-[#1F2430]/5"></div>
                     <div className="w-8 h-8 rounded-full bg-[#3E63F5]/10"></div>
                  </div>
                </div>
                <p className="text-[13px] text-[#1F2430]/50 mt-4 font-medium leading-relaxed">
                  A split-screen view with a conversational AI and a shared technical workspace.
                </p>
              </div>

              {/* No Pause Rule & Tips */}
              <div className="rounded-[1.5rem] bg-gradient-to-b from-white to-[#F9F8F6] border border-[#1F2430]/[0.04] p-6 shadow-[0_4px_16px_rgba(30,35,60,0.02)] flex flex-col">
                 <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-[#8B7355]" />
                  <h3 className="font-[Manrope,sans-serif] text-[15px] font-bold text-[#1F2430]">Interview flow</h3>
                </div>
                <div className="space-y-4 flex-1">
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3E63F5]/40 mt-2 shrink-0" />
                    <p className="text-[14px] text-[#1F2430]/70 font-medium leading-relaxed">
                      <strong>It flows like a real call.</strong> To maintain a realistic environment, you cannot pause or step away once started.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3E63F5]/40 mt-2 shrink-0" />
                    <p className="text-[14px] text-[#1F2430]/70 font-medium leading-relaxed">
                      <strong>Think out loud.</strong> We care more about your problem-solving process than getting syntax perfectly right.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Consolidated Privacy Agreement */}
            <div className="p-6 md:p-8 rounded-[1.75rem] bg-white border border-[#1F2430]/[0.06] shadow-sm">
              <h3 className="font-[Manrope,sans-serif] text-[16px] font-bold text-[#1F2430] mb-4">Privacy & Data Usage</h3>
              <p className="text-[14px] text-[#1F2430]/70 font-medium leading-relaxed mb-5">
                We record this AI conversation to generate your verified candidate profile. Employers will only ever see your high-level profile analysis, never the raw transcript or audio. You control who sees your profile.
              </p>
              <ConsentItem 
                checked={consentReady} 
                onChange={() => setConsentReady(!consentReady)} 
                label="I understand the data usage and confirm I am ready for an uninterrupted 40-minute session." 
              />
            </div>
            
            <div className="h-8" />
          </div>
        </div>

        {/* Right Column: Readiness Panel */}
        <div className="w-full md:w-[40%] lg:w-[35%] md:h-full bg-white/95 md:border-l border-[#1F2430]/[0.04] shadow-[[-20px_0_40px_rgba(30,35,60,0.02)]] flex flex-col relative z-30 border-t md:border-t-0">
          <div className="flex-1 px-6 py-10 md:px-12 md:py-12 flex flex-col">
            
            <div className="mb-10">
              <h2 className="font-[Manrope,sans-serif] text-[24px] font-bold text-[#1F2430] mb-2.5 tracking-tight">System Checks</h2>
              <p className="text-[14px] text-[#1F2430]/60 font-medium leading-relaxed">We've verified your hardware. You're good to go.</p>
            </div>

            {/* Readiness Checks */}
            <div className="flex flex-col gap-3 mb-10">
              {/* System & Network */}
              <div className="group flex items-center justify-between p-4 rounded-2xl bg-[#F8F9FC]/70 border border-[#EEF1F8]/60 transition-all hover:bg-[#F3F5FA]">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-white shadow-[0_2px_8px_rgba(30,35,60,0.06)] ring-2 ring-[#F8F9FC] group-hover:ring-[#F3F5FA] transition-colors flex items-center justify-center text-[#1F2430]/50 relative z-30"><Video className="w-3.5 h-3.5" /></div>
                    <div className="w-8 h-8 rounded-full bg-white shadow-[0_2px_8px_rgba(30,35,60,0.06)] ring-2 ring-[#F8F9FC] group-hover:ring-[#F3F5FA] transition-colors flex items-center justify-center text-[#1F2430]/50 relative z-20"><Mic className="w-3.5 h-3.5" /></div>
                    <div className="w-8 h-8 rounded-full bg-white shadow-[0_2px_8px_rgba(30,35,60,0.06)] ring-2 ring-[#F8F9FC] group-hover:ring-[#F3F5FA] transition-colors flex items-center justify-center text-[#1F2430]/50 relative z-10"><Wifi className="w-3.5 h-3.5" /></div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[14px] font-semibold text-[#1F2430]/80 leading-none">System & Network</span>
                    <span className="text-[12px] font-medium text-[#1F2430]/50 leading-none">Camera, mic & connection ready</span>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-[#10B981] drop-shadow-[0_2px_4px_rgba(16,185,129,0.2)] shrink-0" />
              </div>

              {/* Workspace & Tools */}
              <div className="group flex items-center justify-between p-4 rounded-2xl bg-[#F8F9FC]/70 border border-[#EEF1F8]/60 transition-all hover:bg-[#F3F5FA]">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-white shadow-[0_2px_8px_rgba(30,35,60,0.06)] ring-2 ring-[#F8F9FC] group-hover:ring-[#F3F5FA] transition-colors flex items-center justify-center text-[#1F2430]/50 relative z-30"><Shield className="w-3.5 h-3.5" /></div>
                    <div className="w-8 h-8 rounded-full bg-white shadow-[0_2px_8px_rgba(30,35,60,0.06)] ring-2 ring-[#F8F9FC] group-hover:ring-[#F3F5FA] transition-colors flex items-center justify-center text-[#1F2430]/50 relative z-20"><Pencil className="w-3.5 h-3.5" /></div>
                    <div className="w-8 h-8 rounded-full bg-white shadow-[0_2px_8px_rgba(30,35,60,0.06)] ring-2 ring-[#F8F9FC] group-hover:ring-[#F3F5FA] transition-colors flex items-center justify-center text-[#1F2430]/50 relative z-10"><MessageSquare className="w-3.5 h-3.5" /></div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[14px] font-semibold text-[#1F2430]/80 leading-none">Workspace Tools</span>
                    <span className="text-[12px] font-medium text-[#1F2430]/50 leading-none">Permissions & tools available</span>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-[#10B981] drop-shadow-[0_2px_4px_rgba(16,185,129,0.2)] shrink-0" />
              </div>
            </div>

          </div>

          {/* CTA Footer (Fixed) */}
          <div className="p-8 md:px-12 md:py-8 bg-white border-t border-[#1F2430]/[0.04] shrink-0 shadow-[0_-8px_32px_rgba(30,35,60,0.02)]">
            <button 
              onClick={() => navigate('/interview')}
              disabled={!consentReady}
              className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-[16px] transition-all duration-300 ${
                consentReady 
                  ? 'bg-[#3E63F5] text-white hover:bg-[#2A44B0] hover:scale-[1.01] active:scale-[0.99] shadow-[0_8px_24px_rgba(62,99,245,0.24),inset_0_1px_1px_rgba(255,255,255,0.2)] cursor-pointer' 
                  : 'bg-[#EEF1F8] text-[#1F2430]/30 shadow-none cursor-not-allowed'
              }`}
            >
              Start interview
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <div className="mt-6 flex items-center justify-center gap-4 text-[14px] font-semibold">
              <button onClick={() => navigate('/candidate')} className="text-[#1F2430]/60 hover:text-[#1F2430] transition-colors">Return to Dashboard</button>
            </div>
            
          </div>

        </div>
      </div>
    </div>
  );
}

function ConsentItem({ checked, onChange, label }: { checked: boolean, onChange: () => void, label: string }) {
  return (
    <label className="flex items-start gap-3.5 cursor-pointer group bg-[#F8F9FC]/70 p-4 rounded-2xl border border-[#EEF1F8] hover:bg-[#F3F5FA] transition-colors">
      <div className="relative flex items-center justify-center mt-[2px] shrink-0">
        <input 
          type="checkbox" 
          className="peer sr-only" 
          checked={checked}
          onChange={onChange}
        />
        <div className={`w-[22px] h-[22px] rounded-lg border transition-all duration-200 flex items-center justify-center ${
          checked 
            ? 'bg-[#3E63F5] border-[#3E63F5] text-white shadow-[0_4px_12px_rgba(62,99,245,0.3)]' 
            : 'bg-white border-[#1F2430]/20 text-transparent group-hover:border-[#3E63F5]/50 shadow-sm'
        }`}>
          <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
        </div>
      </div>
      <span className={`text-[14px] leading-[1.5] font-semibold transition-colors duration-200 ${checked ? 'text-[#1F2430]' : 'text-[#1F2430]/70 group-hover:text-[#1F2430]/90'}`}>
        {label}
      </span>
    </label>
  );
}
