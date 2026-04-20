import { useState } from "react";
import { motion } from "motion/react";
import { Zap, MapPin, Building2, Star, ExternalLink, Bookmark, BookmarkCheck, TrendingUp, Clock, ChevronRight } from "lucide-react";
import { AnimatedContent } from "./ui/AnimatedContent";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const matches = [
  {
    id: 1,
    company: "Stripe",
    logo: "https://logo.clearbit.com/stripe.com",
    role: "Senior Frontend Engineer",
    location: "San Francisco, CA · Remote",
    matchScore: 96,
    salary: "$180k – $240k",
    tags: ["React", "TypeScript", "Design Systems"],
    matchedAt: "2 hours ago",
    saved: false,
  },
  {
    id: 2,
    company: "Vercel",
    logo: "https://logo.clearbit.com/vercel.com",
    role: "Staff Engineer, DX",
    location: "Remote",
    matchScore: 93,
    salary: "$200k – $260k",
    tags: ["Next.js", "Performance", "Open Source"],
    matchedAt: "5 hours ago",
    saved: true,
  },
  {
    id: 3,
    company: "Linear",
    logo: "https://logo.clearbit.com/linear.app",
    role: "Frontend Engineer",
    location: "Remote",
    matchScore: 91,
    salary: "$160k – $210k",
    tags: ["React", "WebGL", "Animation"],
    matchedAt: "1 day ago",
    saved: false,
  },
  {
    id: 4,
    company: "Figma",
    logo: "https://logo.clearbit.com/figma.com",
    role: "Senior Product Engineer",
    location: "San Francisco, CA · Hybrid",
    matchScore: 89,
    salary: "$190k – $250k",
    tags: ["Canvas", "WebAssembly", "TypeScript"],
    matchedAt: "1 day ago",
    saved: false,
  },
  {
    id: 5,
    company: "Notion",
    logo: "https://logo.clearbit.com/notion.so",
    role: "Frontend Engineer, Editor",
    location: "New York, NY · Hybrid",
    matchScore: 87,
    salary: "$170k – $220k",
    tags: ["React", "Rich Text", "Collaboration"],
    matchedAt: "2 days ago",
    saved: true,
  },
];

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 95 ? "#10B981" : score >= 90 ? "#3E63F5" : "#F59E0B";
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[13px]"
      style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}
    >
      <Zap className="w-3.5 h-3.5" />
      {score}%
    </div>
  );
}

export function MatchesScreen() {
  const [savedIds, setSavedIds] = useState<Set<number>>(
    new Set(matches.filter((m) => m.saved).map((m) => m.id))
  );

  const toggleSave = (id: number) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <AnimatedContent direction="vertical" distance={20} delay={0}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#F97316] flex items-center justify-center shadow-[0_4px_16px_rgba(245,158,11,0.3)]">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h2 className="font-[Manrope,sans-serif] text-[1.75rem] font-extrabold text-[#1F2430] leading-none">
                Your Matches
              </h2>
            </div>
            <p className="text-[14px] text-[#1F2430]/55 font-medium ml-[52px]">
              Companies that align with your verified profile and preferences
            </p>
          </div>
          <div className="flex items-center gap-2 ml-[52px] md:ml-0">
            <div className="px-4 py-2 glass-card rounded-xl flex items-center gap-2 text-[13px] font-bold text-[#1F2430]/70">
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
              {matches.length} new this week
            </div>
          </div>
        </div>
      </AnimatedContent>

      {/* Match Cards */}
      <div className="space-y-4">
        {matches.map((match, i) => (
          <AnimatedContent key={match.id} direction="vertical" distance={20} delay={0.05 * i}>
            <motion.div
              className="glass-card rounded-[1.5rem] p-5 md:p-6 cursor-pointer group"
              whileHover={{ y: -2, boxShadow: "0 16px 48px rgba(30,35,60,0.08)" }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Company Logo */}
                <div className="w-14 h-14 rounded-2xl bg-white border border-white/80 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                  <ImageWithFallback src={match.logo} alt={match.company} className="w-9 h-9 object-contain" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-[Manrope,sans-serif] font-bold text-[#1F2430] truncate">
                      {match.role}
                    </h3>
                    <ScoreBadge score={match.matchScore} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[#1F2430]/55 font-medium">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" /> {match.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {match.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {match.matchedAt}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {match.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg bg-[#3E63F5]/8 text-[#3E63F5] text-[11px] font-bold tracking-wide border border-[#3E63F5]/10"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="px-2.5 py-1 rounded-lg bg-[#10B981]/8 text-[#10B981] text-[11px] font-bold tracking-wide border border-[#10B981]/10">
                      {match.salary}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); toggleSave(match.id); }}
                    className="w-10 h-10 rounded-xl bg-white/60 border border-white/80 flex items-center justify-center text-[#1F2430]/50 hover:text-[#F59E0B] transition-colors shadow-sm"
                  >
                    {savedIds.has(match.id) ? (
                      <BookmarkCheck className="w-4.5 h-4.5 text-[#F59E0B]" />
                    ) : (
                      <Bookmark className="w-4.5 h-4.5" />
                    )}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1F2430] text-white text-[13px] font-bold shadow-[0_4px_16px_rgba(31,36,48,0.2)] hover:shadow-[0_8px_24px_rgba(31,36,48,0.3)] transition-shadow"
                  >
                    View <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatedContent>
        ))}
      </div>
    </div>
  );
}
