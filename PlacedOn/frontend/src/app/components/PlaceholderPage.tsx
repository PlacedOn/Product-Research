import { useNavigate } from 'react-router';
import { ArrowLeft, Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#F8F7F5] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="glass-card rounded-[2rem] p-8 md:p-10 border border-white/80 shadow-[0_16px_40px_rgba(30,35,60,0.04)] text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#3E63F5]/10 flex items-center justify-center text-[#3E63F5]">
            <Construction className="w-8 h-8" />
          </div>

          <h1 className="font-[Manrope,sans-serif] text-[28px] font-extrabold text-[#1F2430] mb-3">
            {title}
          </h1>

          <p className="text-[15px] text-[#1F2430]/70 font-medium mb-8">
            {description}
          </p>

          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#3E63F5] text-white text-[14px] font-bold shadow-[0_4px_16px_rgba(62,99,245,0.25)] hover:bg-[#2A44B0] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>

      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
        }
      `}</style>
    </div>
  );
}
