import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Mail, ArrowLeft } from 'lucide-react';
import { AnimatedContent } from './ui/AnimatedContent';
import { BlurText } from './ui/BlurText';

export function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    // Simulate magic link sending
    setTimeout(() => {
      navigate('/candidate');
    }, 1000);
  };

  const handleGoogle = () => {
    // Simulate google auth
    navigate('/candidate');
  };

  return (
    <div className="min-h-screen w-full bg-[#F3F2F0] relative overflow-hidden font-[Inter,sans-serif] selection:bg-[#3E63F5] selection:text-white flex flex-col">
      {/* Global CSS for background textures (Re-using LandingPage variables) */}
      <style>{`
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
      `}</style>

      {/* Ambient Background Washes */}
      <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-[#E3E8F8] rounded-full mix-blend-multiply blur-[120px] opacity-70 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-[#F4EBE3] rounded-full mix-blend-multiply blur-[120px] opacity-60 pointer-events-none" />
      
      {/* Texture Layers */}
      <div className="dot-grid pointer-events-none" />
      <div className="noise-overlay pointer-events-none" />

      {/* Top Nav (Minimal) */}
      <div className="relative z-10 w-full p-6 md:p-8 flex justify-between items-center">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-[#1F2430]/60 hover:text-[#1F2430] transition-colors font-medium text-[14px]"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-[#3E63F5] flex items-center justify-center text-white font-bold font-[Manrope,sans-serif]">P</div>
          <span className="font-[Manrope,sans-serif] text-xl font-bold text-[#1F2430] tracking-tight">PlacedOn</span>
        </div>
        <div className="w-20" /> {/* Spacer for centering */}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 pb-20">
        <AnimatedContent delay={0.1} direction="vertical" className="w-full max-w-[420px]">
          
          <div className="text-center mb-8">
            <h1 className="font-[Manrope,sans-serif] text-[32px] md:text-[40px] font-extrabold text-[#1F2430] tracking-tight leading-tight mb-3">
              <BlurText text="Start your interview" delay={0.03} />
            </h1>
            <p className="text-[16px] text-[#1F2430]/60 font-medium">
              No resumes or long forms. Just sign in and show us what you can do.
            </p>
          </div>

          <div className="glass-card rounded-[2rem] p-8 md:p-10 shadow-[0_16px_40px_rgba(30,35,60,0.06)] relative">
            
            {/* Primary: Google Login */}
            <motion.button 
              onClick={handleGoogle}
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white border border-[#1F2430]/10 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all text-[#1F2430] font-bold text-[16px] group"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="h-px bg-[#1F2430]/10 flex-1" />
              <span className="text-[12px] font-bold text-[#1F2430]/40 tracking-wider">OR</span>
              <div className="h-px bg-[#1F2430]/10 flex-1" />
            </div>

            {/* Secondary: Email Magic Link */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#1F2430]/30" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-5 py-4 rounded-2xl bg-white/60 border border-white/80 focus:bg-white focus:border-[#3E63F5] focus:ring-4 focus:ring-[#3E63F5]/10 outline-none transition-all placeholder:text-[#1F2430]/30 text-[#1F2430] font-medium shadow-inner"
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#1F2430] text-white font-bold text-[16px] hover:bg-[#2A3040] transition-colors group shadow-md disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    Send Magic Link <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>
          </div>

          <div className="mt-8 text-center">
             <p className="text-[13px] text-[#1F2430]/50 font-medium">
               By continuing, you agree to our <a href="/terms" className="underline hover:text-[#1F2430] transition-colors">Terms of Service</a> and <a href="/privacy" className="underline hover:text-[#1F2430] transition-colors">Privacy Policy</a>.
             </p>
          </div>
        </AnimatedContent>
      </div>
    </div>
  );
}
