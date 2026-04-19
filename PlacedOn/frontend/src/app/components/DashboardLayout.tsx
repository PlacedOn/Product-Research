import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { Bell, Shield, Home, Briefcase, User, Settings, CheckCircle, Zap, Crosshair, Calendar, FileText, AlignRight, Search, Activity, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DotGrid } from "./ui/DotGrid";
import { Orb } from "./ui/Orb";
import { AnimatedContent } from "./ui/AnimatedContent";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const dockItems = [
  { icon: <Home size={20} strokeWidth={2.5} />, label: "Home", path: "/candidate" },
  { icon: <User size={20} strokeWidth={2.5} />, label: "Profile", path: "/candidate/profile" },
  { icon: <Zap size={20} strokeWidth={2.5} />, label: "Matches", path: "/candidate/matches" },
  { icon: <FileText size={20} strokeWidth={2.5} />, label: "Applications", path: "/candidate/applications" },
  { icon: <Calendar size={20} strokeWidth={2.5} />, label: "Interviews", path: "/candidate/interviews" },
  { icon: <Settings size={20} strokeWidth={2.5} />, label: "Settings", path: "/candidate/settings" },
];

function PillNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 p-2 bg-white/70 backdrop-blur-xl rounded-full border border-white/60 shadow-[0_16px_40px_rgba(30,35,60,0.1),inset_0_1px_1px_rgba(255,255,255,1)]">
        {dockItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/candidate' && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="relative px-5 py-2.5 rounded-full flex flex-col items-center gap-1 transition-all group outline-none focus:outline-none"
            >
              {isActive && (
                <motion.div
                  layoutId="pillNavBackground"
                  className="absolute inset-0 rounded-full bg-[#1F2430]"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
              <div className={`relative z-10 flex items-center justify-center transition-colors duration-300 ${isActive ? "text-white" : "text-[#1F2430]/60 group-hover:text-[#1F2430]"}`}>
                {item.icon}
              </div>
              <span className={`relative z-10 text-[10px] font-bold tracking-wide transition-all duration-300 ${isActive ? "text-white opacity-100 h-auto mt-0.5" : "text-[#1F2430]/0 opacity-0 h-0 overflow-hidden"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DashboardLayout() {
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <div className="min-h-screen w-full bg-[#F8F7F5] relative overflow-hidden font-[Inter,sans-serif] selection:bg-[#3E63F5] selection:text-white">
      {/* Global CSS for basic styles */}
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.9), 0 12px 40px rgba(30, 35, 60, 0.04);
        }
        
        .noise-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.15;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      {/* Background Washes */}
      <Orb color="#3E63F5" size={600} opacity={0.12} blur={140} className="top-[-10%] left-[-5%]" duration={20} />
      <Orb color="#10B981" size={500} opacity={0.08} blur={120} className="top-[30%] right-[-10%]" duration={25} />
      <Orb color="#B392F0" size={550} opacity={0.12} blur={130} className="bottom-[-15%] left-[20%]" duration={18} />

      {/* Texture Layers */}
      <DotGrid opacity={0.06} size={1} spacing={28} />
      <div className="noise-overlay" />

      {/* Main Content Wrapper */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 md:px-10 pt-8 pb-32">
        
        {/* Top Header */}
        <AnimatedContent direction="vertical" distance={20} delay={0}>
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white/40 backdrop-blur-md border border-white/60 p-4 md:p-6 rounded-[2rem] shadow-[0_8px_32px_rgba(30,35,60,0.03)]">
            
            {/* Left: Avatar, Name, Status */}
            <div className="flex items-center gap-5">
              <div className="relative group cursor-pointer" onClick={() => navigate('/candidate/profile')}>
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-[#3E63F5] to-[#8C9EFF] p-[2px] shadow-[0_8px_24px_rgba(62,99,245,0.25)] transition-transform duration-300 group-hover:scale-105">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border-[2.5px] border-white">
                    <ImageWithFallback src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces&q=80" alt="Candidate" className="w-full h-full object-cover" />
                  </div>
                </div>
                {isAvailable && (
                  <div className="absolute bottom-0 right-0 w-4.5 h-4.5 bg-[#10B981] rounded-full border-[3px] border-white shadow-sm flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h1 className="font-[Manrope,sans-serif] text-xl md:text-2xl font-bold text-[#1F2430] leading-none">
                    Alex Chen
                  </h1>
                  <span className="px-2 py-0.5 rounded-md bg-[#10B981]/10 text-[#10B981] text-[11px] font-bold uppercase tracking-wider border border-[#10B981]/20 flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Verified
                  </span>
                </div>
                <p className="text-[14px] font-medium text-[#1F2430]/60 flex items-center gap-1.5">
                  Senior Frontend Engineer
                </p>
              </div>
            </div>

            {/* Right: Toggles & Actions */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Availability Toggle */}
              <div className="flex items-center gap-3 px-4 py-2 bg-white/60 rounded-xl border border-white/80 shadow-sm mr-2">
                <span className="text-[13px] font-bold text-[#1F2430]/80">Available</span>
                <button 
                  onClick={() => setIsAvailable(!isAvailable)}
                  className={`w-10 h-6 rounded-full transition-colors relative flex items-center shadow-inner ${isAvailable ? 'bg-[#10B981]' : 'bg-[#1F2430]/20'}`}
                >
                  <motion.div 
                    layout
                    className="w-4 h-4 bg-white rounded-full shadow-md ml-1"
                    animate={{ x: isAvailable ? 16 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* Notification Bell */}
              <button className="w-11 h-11 rounded-[1rem] bg-white/60 border border-white flex items-center justify-center text-[#1F2430]/70 hover:text-[#1F2430] hover:bg-white transition-all shadow-sm relative hover:-translate-y-0.5">
                <Bell className="w-5 h-5" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-[#F59E0B] rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" />
              </button>
              
              {/* Settings */}
              <button 
                className="w-11 h-11 rounded-[1rem] bg-white/60 border border-white flex items-center justify-center text-[#1F2430]/70 hover:text-[#1F2430] hover:bg-white transition-all shadow-sm hover:-translate-y-0.5"
                onClick={() => navigate('/candidate/settings')}
              >
                <Settings className="w-5 h-5" />
              </button>

            </div>
          </header>
        </AnimatedContent>

        {/* Dynamic Outlet Content */}
        <AnimatedContent direction="vertical" distance={30} delay={0.1}>
          <Outlet />
        </AnimatedContent>

      </div>

      {/* Floating Bottom Dock (PillNav) */}
      <AnimatedContent direction="vertical" distance={40} delay={0.2}>
        <PillNav />
      </AnimatedContent>
    </div>
  );
}