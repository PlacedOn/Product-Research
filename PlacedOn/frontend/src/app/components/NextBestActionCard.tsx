import { Play, RotateCcw, Search, Eye, Share, Briefcase, Code, FileText, ArrowRight, Clock, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

export type NextActionState = 
  | 'start_interview'
  | 'recover_interview'
  | 'review_profile'
  | 'publish_profile'
  | 'respond_employer_interest'
  | 'complete_follow_up'
  | 'review_offer';

interface NextBestActionCardProps {
  state: NextActionState;
}

const actionData: Record<NextActionState, {
  title: string;
  description: string;
  buttonText: string;
  buttonIcon: React.ReactNode;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  buttonBg: string;
  bgGradient: string;
  glowColor: string;
  iconBg: string;
  icon: React.ReactNode;
  tagText: string;
  timeEstimate?: string;
}> = {
  start_interview: {
    title: 'Ready for your technical interview',
    description: 'Complete a 30-minute conversation with our AI interviewer to generate your verified profile. No trick questions, just deep technical discussions.',
    buttonText: 'Start Interview',
    buttonIcon: <Play className="w-5 h-5 fill-current" />,
    accentColor: 'text-[#3E63F5]',
    accentBg: 'bg-[#3E63F5]',
    accentBorder: 'border-[#3E63F5]',
    buttonBg: 'bg-[#3E63F5]',
    bgGradient: 'from-[#3E63F5]/10 to-[#3E63F5]/[0.02]',
    glowColor: 'from-[#3E63F5] to-[#B392F0]',
    iconBg: 'bg-[#3E63F5]/10 border-[#3E63F5]/20',
    icon: <Play className="w-6 h-6 text-[#3E63F5] fill-current" />,
    tagText: 'High Priority',
    timeEstimate: '30 mins'
  },
  recover_interview: {
    title: 'Resume your interview',
    description: 'It looks like you got disconnected. You can resume your Frontend Engineering interview right where you left off without losing progress.',
    buttonText: 'Resume Interview',
    buttonIcon: <RotateCcw className="w-5 h-5" />,
    accentColor: 'text-[#F59E0B]',
    accentBg: 'bg-[#F59E0B]',
    accentBorder: 'border-[#F59E0B]',
    buttonBg: 'bg-[#F59E0B]',
    bgGradient: 'from-[#F59E0B]/10 to-[#F59E0B]/[0.02]',
    glowColor: 'from-[#F59E0B] to-[#FCD34D]',
    iconBg: 'bg-[#F59E0B]/10 border-[#F59E0B]/20',
    icon: <RotateCcw className="w-6 h-6 text-[#F59E0B]" />,
    tagText: 'Action Required',
    timeEstimate: '15 mins remaining'
  },
  review_profile: {
    title: 'Your profile is ready for review',
    description: 'We have finished extracting skills and evidence from your interview. Review the results before making your profile visible to employers.',
    buttonText: 'Review Profile',
    buttonIcon: <Search className="w-5 h-5" />,
    accentColor: 'text-[#8B5CF6]',
    accentBg: 'bg-[#8B5CF6]',
    accentBorder: 'border-[#8B5CF6]',
    buttonBg: 'bg-[#8B5CF6]',
    bgGradient: 'from-[#8B5CF6]/10 to-[#8B5CF6]/[0.02]',
    glowColor: 'from-[#8B5CF6] to-[#C4B5FD]',
    iconBg: 'bg-[#8B5CF6]/10 border-[#8B5CF6]/20',
    icon: <Eye className="w-6 h-6 text-[#8B5CF6]" />,
    tagText: 'Needs Review',
    timeEstimate: '5 mins'
  },
  publish_profile: {
    title: 'Publish your verified profile',
    description: 'Your profile is complete but currently hidden. Publish it to start receiving inbound interest from matching companies.',
    buttonText: 'Publish Profile',
    buttonIcon: <Share className="w-5 h-5" />,
    accentColor: 'text-[#10B981]',
    accentBg: 'bg-[#10B981]',
    accentBorder: 'border-[#10B981]',
    buttonBg: 'bg-[#10B981]',
    bgGradient: 'from-[#10B981]/10 to-[#10B981]/[0.02]',
    glowColor: 'from-[#10B981] to-[#6EE7B7]',
    iconBg: 'bg-[#10B981]/10 border-[#10B981]/20',
    icon: <Share className="w-6 h-6 text-[#10B981]" />,
    tagText: 'Next Step',
  },
  respond_employer_interest: {
    title: 'New match from Linear',
    description: 'Linear is interested in your Frontend Engineering profile. Review their pitch and decide if you want to share your full profile.',
    buttonText: 'Review Interest',
    buttonIcon: <Briefcase className="w-5 h-5" />,
    accentColor: 'text-[#3E63F5]',
    accentBg: 'bg-[#3E63F5]',
    accentBorder: 'border-[#3E63F5]',
    buttonBg: 'bg-[#3E63F5]',
    bgGradient: 'from-[#3E63F5]/10 to-[#3E63F5]/[0.02]',
    glowColor: 'from-[#3E63F5] to-[#93C5FD]',
    iconBg: 'bg-[#3E63F5]/10 border-[#3E63F5]/20',
    icon: <Briefcase className="w-6 h-6 text-[#3E63F5]" />,
    tagText: 'New Match'
  },
  complete_follow_up: {
    title: 'Complete Stripe\'s challenge',
    description: 'Stripe has requested a brief follow-up technical challenge specifically focused on API idempotency to finalize their evaluation.',
    buttonText: 'Start Challenge',
    buttonIcon: <Code className="w-5 h-5" />,
    accentColor: 'text-[#F43F5E]',
    accentBg: 'bg-[#F43F5E]',
    accentBorder: 'border-[#F43F5E]',
    buttonBg: 'bg-[#F43F5E]',
    bgGradient: 'from-[#F43F5E]/10 to-[#F43F5E]/[0.02]',
    glowColor: 'from-[#F43F5E] to-[#FDA4AF]',
    iconBg: 'bg-[#F43F5E]/10 border-[#F43F5E]/20',
    icon: <Code className="w-6 h-6 text-[#F43F5E]" />,
    tagText: 'Employer Request',
    timeEstimate: '20 mins'
  },
  review_offer: {
    title: 'You received an offer!',
    description: 'Vercel has extended an offer for the Engineering Lead, Developer Experience position. Review the compensation details and team information.',
    buttonText: 'Review Offer Details',
    buttonIcon: <FileText className="w-5 h-5" />,
    accentColor: 'text-[#10B981]',
    accentBg: 'bg-[#10B981]',
    accentBorder: 'border-[#10B981]',
    buttonBg: 'bg-[#10B981]',
    bgGradient: 'from-[#10B981]/10 to-[#10B981]/[0.02]',
    glowColor: 'from-[#10B981] to-[#34D399]',
    iconBg: 'bg-[#10B981]/10 border-[#10B981]/20',
    icon: <Star className="w-6 h-6 text-[#10B981]" />,
    tagText: 'Action Required',
  }
};

export function NextBestActionCard({ state }: NextBestActionCardProps) {
  const navigate = useNavigate();
  const data = actionData[state];

  const handleAction = () => {
    if (state === 'start_interview' || state === 'recover_interview') navigate('/pre-interview');
    else if (state === 'review_profile' || state === 'publish_profile') navigate('/candidate/profile');
    else if (state === 'respond_employer_interest') navigate('/candidate/matches');
    else if (state === 'complete_follow_up' || state === 'review_offer') navigate('/candidate/applications');
  };

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] glass-card p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 group border border-white/80 shadow-[0_16px_40px_rgba(30,35,60,0.06)] min-h-[300px]">
      {/* Background Gradient & Glow */}
      <div className={`absolute inset-0 bg-gradient-to-r ${data.bgGradient} pointer-events-none opacity-50`} />
      <div className={`absolute top-1/2 left-[10%] -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-tr ${data.glowColor} rounded-full blur-[100px] opacity-10 pointer-events-none animate-pulse-glow`} />
      
      {/* Content */}
      <div className="relative z-10 flex-1 w-full">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="px-3 py-1.5 rounded-full bg-[#1F2430]/5 text-[#1F2430]/70 text-[12px] font-bold uppercase tracking-wider border border-[#1F2430]/10 flex items-center gap-1.5 backdrop-blur-sm">
            <span className={`w-2 h-2 rounded-full ${data.accentBg} animate-pulse`} />
            Next Best Action
          </div>
          <div className={`px-3 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-sm ${data.accentColor} border ${data.accentBorder} bg-white/50`}>
            {data.tagText}
          </div>
          {data.timeEstimate && (
            <div className="px-3 py-1.5 rounded-full bg-white/50 text-[#1F2430]/60 text-[12px] font-bold tracking-wider flex items-center gap-1.5 border border-white">
              <Clock className="w-3.5 h-3.5" />
              {data.timeEstimate}
            </div>
          )}
        </div>
        
        <h2 className="font-[Manrope,sans-serif] text-3xl md:text-[40px] font-bold text-[#1F2430] tracking-tight mb-4 leading-[1.1]">
          {data.title}
        </h2>
        
        <p className="text-[16px] md:text-[18px] text-[#1F2430]/70 font-medium max-w-2xl leading-relaxed mb-8 text-pretty">
          {data.description}
        </p>
        
        <div className="flex flex-wrap items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            onClick={handleAction}
            className={`px-8 py-4 rounded-2xl ${data.buttonBg} text-white text-[16px] font-bold shadow-[0_8px_24px_rgba(30,35,60,0.15)] hover:brightness-110 transition-all flex items-center justify-center gap-2 group/btn`}
          >
            {data.buttonIcon}
            {data.buttonText}
          </motion.button>
          
          <button
            onClick={() => navigate('/candidate')}
            className="px-6 py-4 rounded-2xl bg-white/60 text-[#1F2430]/60 text-[15px] font-bold shadow-sm border border-white hover:bg-white hover:text-[#1F2430] transition-colors flex items-center gap-2 group/skip"
          >
            Skip for now
          </button>
        </div>
      </div>
      
      {/* Visual Accent Icon */}
      <div className="relative z-10 shrink-0 hidden md:flex items-center justify-center">
        <div className={`w-32 h-32 rounded-full ${data.iconBg} border-[4px] border-white/50 flex items-center justify-center shadow-inner backdrop-blur-md relative`}>
          {data.icon}
          
          <div className="absolute inset-0 rounded-full border border-white/80 scale-110 opacity-50 animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-0 rounded-full border border-white/40 scale-125 opacity-20 animate-[spin_15s_linear_infinite_reverse]" />
        </div>
      </div>
    </div>
  );
}