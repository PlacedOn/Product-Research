import { useState } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, Video, MapPin, Building2, ChevronRight, CheckCircle, AlertCircle, Play, MoreHorizontal } from "lucide-react";
import { AnimatedContent } from "./ui/AnimatedContent";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type InterviewStatus = "upcoming" | "completed" | "cancelled";

interface Interview {
  id: number;
  company: string;
  logo: string;
  role: string;
  type: string;
  date: string;
  time: string;
  duration: string;
  status: InterviewStatus;
  interviewers: string[];
  platform: string;
}

const interviews: Interview[] = [
  {
    id: 1,
    company: "Stripe",
    logo: "https://logo.clearbit.com/stripe.com",
    role: "Senior Frontend Engineer",
    type: "Technical Screen",
    date: "Today",
    time: "2:00 PM PST",
    duration: "45 min",
    status: "upcoming",
    interviewers: ["Sarah Kim", "David Park"],
    platform: "Google Meet",
  },
  {
    id: 2,
    company: "Vercel",
    logo: "https://logo.clearbit.com/vercel.com",
    role: "Staff Engineer, DX",
    type: "System Design",
    date: "Apr 22",
    time: "10:00 AM PST",
    duration: "60 min",
    status: "upcoming",
    interviewers: ["Lee Robinson"],
    platform: "Zoom",
  },
  {
    id: 3,
    company: "Linear",
    logo: "https://logo.clearbit.com/linear.app",
    role: "Frontend Engineer",
    type: "Culture Fit",
    date: "Apr 24",
    time: "11:30 AM PST",
    duration: "30 min",
    status: "upcoming",
    interviewers: ["Karri Saarinen"],
    platform: "Google Meet",
  },
  {
    id: 4,
    company: "Figma",
    logo: "https://logo.clearbit.com/figma.com",
    role: "Senior Product Engineer",
    type: "AI Micro-Interview",
    date: "Apr 15",
    time: "3:00 PM PST",
    duration: "20 min",
    status: "completed",
    interviewers: ["PlacedOn AI"],
    platform: "PlacedOn",
  },
  {
    id: 5,
    company: "Notion",
    logo: "https://logo.clearbit.com/notion.so",
    role: "Frontend Engineer, Editor",
    type: "Phone Screen",
    date: "Apr 12",
    time: "1:00 PM PST",
    duration: "30 min",
    status: "cancelled",
    interviewers: ["Ivan Zhao"],
    platform: "Phone",
  },
];

const statusConfig: Record<InterviewStatus, { color: string; bg: string; border: string; icon: React.ReactNode; label: string }> = {
  upcoming: { color: "#3E63F5", bg: "#3E63F5/10", border: "#3E63F5/20", icon: <Clock className="w-3.5 h-3.5" />, label: "Upcoming" },
  completed: { color: "#10B981", bg: "#10B981/10", border: "#10B981/20", icon: <CheckCircle className="w-3.5 h-3.5" />, label: "Completed" },
  cancelled: { color: "#EF4444", bg: "#EF4444/10", border: "#EF4444/20", icon: <AlertCircle className="w-3.5 h-3.5" />, label: "Cancelled" },
};

const tabs = ["All", "Upcoming", "Completed"] as const;

export function InterviewsScreen() {
  const [activeTab, setActiveTab] = useState<string>("All");

  const filtered = activeTab === "All" ? interviews : interviews.filter((i) => i.status === activeTab.toLowerCase());

  return (
    <div className="space-y-8">
      {/* Header */}
      <AnimatedContent direction="vertical" distance={20} delay={0}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3E63F5] to-[#8C9EFF] flex items-center justify-center shadow-[0_4px_16px_rgba(62,99,245,0.3)]">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h2 className="font-[Manrope,sans-serif] text-[1.75rem] font-extrabold text-[#1F2430] leading-none">
                Interviews
              </h2>
            </div>
            <p className="text-[14px] text-[#1F2430]/55 font-medium ml-[52px]">
              Manage your scheduled interviews and review past sessions
            </p>
          </div>

          {/* Tab Filter */}
          <div className="flex items-center gap-1 p-1 glass-card rounded-xl ml-[52px] md:ml-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${activeTab === tab ? "text-white" : "text-[#1F2430]/55 hover:text-[#1F2430]"}`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="interviewTab"
                    className="absolute inset-0 rounded-lg bg-[#1F2430]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>
      </AnimatedContent>

      {/* Interview Cards */}
      <div className="space-y-4">
        {filtered.map((interview, i) => {
          const status = statusConfig[interview.status];
          const isToday = interview.date === "Today";
          return (
            <AnimatedContent key={interview.id} direction="vertical" distance={20} delay={0.05 * i}>
              <motion.div
                className={`glass-card rounded-[1.5rem] p-5 md:p-6 group cursor-pointer ${isToday ? "ring-2 ring-[#3E63F5]/20" : ""}`}
                whileHover={{ y: -2, boxShadow: "0 16px 48px rgba(30,35,60,0.08)" }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Date Block */}
                  <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 ${isToday ? "bg-[#3E63F5] text-white shadow-[0_4px_16px_rgba(62,99,245,0.3)]" : "bg-white/80 text-[#1F2430] border border-white/80 shadow-sm"}`}>
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-70">
                      {isToday ? "Today" : interview.date.split(" ")[0]}
                    </span>
                    {!isToday && (
                      <span className="text-[1.25rem] font-extrabold leading-none">
                        {interview.date.split(" ")[1]}
                      </span>
                    )}
                    {isToday && <Clock className="w-5 h-5 mt-0.5" />}
                  </div>

                  {/* Company Logo */}
                  <div className="w-12 h-12 rounded-xl bg-white border border-white/80 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                    <ImageWithFallback src={interview.logo} alt={interview.company} className="w-7 h-7 object-contain" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-[Manrope,sans-serif] font-bold text-[#1F2430] truncate">
                        {interview.type}
                      </h3>
                      <span
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold"
                        style={{
                          background: `${status.color}15`,
                          color: status.color,
                          border: `1px solid ${status.color}25`,
                        }}
                      >
                        {status.icon} {status.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[#1F2430]/55 font-medium">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" /> {interview.company} · {interview.role}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {interview.time} · {interview.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Video className="w-3.5 h-3.5" /> {interview.platform}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-[12px] text-[#1F2430]/45 font-medium">
                      With: {interview.interviewers.join(", ")}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {interview.status === "upcoming" && isToday && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3E63F5] text-white text-[13px] font-bold shadow-[0_4px_16px_rgba(62,99,245,0.3)] hover:shadow-[0_8px_24px_rgba(62,99,245,0.4)] transition-shadow"
                      >
                        <Play className="w-4 h-4" /> Join
                      </motion.button>
                    )}
                    {interview.status === "upcoming" && !isToday && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1F2430] text-white text-[13px] font-bold shadow-[0_4px_16px_rgba(31,36,48,0.2)] transition-shadow"
                      >
                        Prepare <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    )}
                    {interview.status === "completed" && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/60 border border-white/80 text-[#1F2430] text-[13px] font-bold shadow-sm transition-shadow"
                      >
                        Review <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatedContent>
          );
        })}
      </div>
    </div>
  );
}
