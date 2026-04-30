import { useState } from "react";
import { motion } from "motion/react";
import {
  X, MapPin, Calendar, User, Star, Mail, ThumbsDown, ArrowRightCircle,
  GitCompare, ShieldCheck, AlertTriangle, ChevronDown,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  getStageName,
  getConfidenceBadgeColor,
  type EmployerCandidate,
  type EvidenceItem,
  type PipelineStage,
} from "../lib/employerTypes";

const ALL_STAGES: PipelineStage[] = [
  "new", "reviewed", "shortlisted", "hiring_manager_review",
  "intro_requested", "candidate_accepted", "interviewing", "offer", "hired",
];

const CATEGORY_ORDER: Array<EvidenceItem["category"]> = [
  "technical", "communication", "ownership", "collaboration", "learning",
];

const CATEGORY_LABELS: Record<EvidenceItem["category"], string> = {
  technical: "Technical",
  communication: "Communication",
  ownership: "Ownership",
  collaboration: "Collaboration",
  learning: "Learning velocity",
};

export function CandidateEvidenceDrawer({
  candidate,
  ownerOptions,
  onClose,
  onMoveStage,
  onAssign,
  onRequestIntro,
  onPass,
  onCompare,
  onSaveNote,
}: {
  candidate: EmployerCandidate;
  ownerOptions: string[];
  onClose: () => void;
  onMoveStage: (stage: PipelineStage) => void;
  onAssign: (owner: string) => void;
  onRequestIntro: () => void;
  onPass: () => void;
  onCompare: () => void;
  onSaveNote: (note: string) => void;
}) {
  const [note, setNote] = useState(candidate.notes ?? "");
  const groupedEvidence = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: candidate.evidenceItems.filter((e) => e.category === cat),
  })).filter((g) => g.items.length > 0);

  const displayName = candidate.hasOptedIn ? candidate.name : candidate.anonymousId;

  return (
    <div className="fixed inset-0 z-50 flex font-[Inter,sans-serif]">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <motion.aside
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-xl bg-white flex flex-col"
        style={{ boxShadow: "-12px 0 32px rgba(0,0,0,0.08)" }}
      >
        {/* Header */}
        <div
          className="px-5 py-4 border-b flex items-start justify-between gap-3"
          style={{ borderColor: "rgba(31,36,48,0.1)" }}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="truncate" style={{ color: "#1F2430" }}>
                {displayName}
              </h2>
              {!candidate.hasOptedIn && (
                <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                  Anonymous
                </Badge>
              )}
            </div>
            <p className="text-sm" style={{ color: "#1F2430", opacity: 0.7 }}>
              {candidate.targetRole}
            </p>
            <div className="mt-2 flex items-center gap-3 text-xs flex-wrap" style={{ color: "#1F2430", opacity: 0.65 }}>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{candidate.location}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{candidate.availability}</span>
              <span className="flex items-center gap-1"><User className="w-3 h-3" />{candidate.owner ?? "Unassigned"}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-black/5 shrink-0" aria-label="Close">
            <X className="w-5 h-5" style={{ color: "#1F2430" }} />
          </button>
        </div>

        {/* Score row */}
        <div className="px-5 py-4 grid grid-cols-3 gap-3 border-b" style={{ borderColor: "rgba(31,36,48,0.08)" }}>
          <Stat label="Fit score" value={`${candidate.fitScore}`} accent="#3E63F5" />
          <div>
            <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: "#1F2430", opacity: 0.55 }}>
              Confidence
            </p>
            <Badge variant="outline" className={`text-xs ${getConfidenceBadgeColor(candidate.evidenceConfidence)}`}>
              {candidate.evidenceConfidence}
            </Badge>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: "#1F2430", opacity: 0.55 }}>
              Stage
            </p>
            <span className="text-sm" style={{ color: "#1F2430" }}>{getStageName(candidate.stage)}</span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          <Section title="Why this match" icon={<Star className="w-3.5 h-3.5" />}>
            <p className="text-sm" style={{ color: "#1F2430" }}>{candidate.whyMatch}</p>
          </Section>

          {candidate.topTwoTags.length > 0 && (
            <Section title="Top strengths">
              <div className="flex flex-wrap gap-1.5">
                {candidate.topTwoTags.map((t) => (
                  <Badge key={t} className="text-xs" style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#047857" }}>
                    {t}
                  </Badge>
                ))}
              </div>
            </Section>
          )}

          <Section title="Evidence breakdown" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
            {groupedEvidence.length === 0 ? (
              <p className="text-sm" style={{ color: "#1F2430", opacity: 0.6 }}>No evidence captured.</p>
            ) : (
              <div className="space-y-3">
                {groupedEvidence.map((g) => (
                  <div key={g.category}>
                    <p className="text-[10px] uppercase tracking-wide mb-1.5" style={{ color: "#1F2430", opacity: 0.55 }}>
                      {CATEGORY_LABELS[g.category]}
                    </p>
                    <ul className="space-y-1.5">
                      {g.items.map((it) => (
                        <li key={it.id} className="flex items-start gap-2 text-sm">
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                            style={{
                              backgroundColor:
                                it.signalStrength === "Strong" ? "#10B981" :
                                it.signalStrength === "Moderate" ? "#F59E0B" : "#94A3B8",
                            }}
                          />
                          <div className="min-w-0">
                            <span style={{ color: "#1F2430" }}>{it.skillOrTrait}</span>
                            <span className="ml-1.5 text-xs" style={{ color: "#1F2430", opacity: 0.6 }}>
                              · {it.signalStrength}
                            </span>
                            <p className="text-xs mt-0.5" style={{ color: "#1F2430", opacity: 0.7 }}>
                              {it.summary}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {candidate.uncertainty && (
            <Section title="Needs validation" icon={<AlertTriangle className="w-3.5 h-3.5" />}>
              <p className="text-sm" style={{ color: "#1F2430" }}>{candidate.uncertainty}</p>
            </Section>
          )}

          <Section title="Recruiter notes">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onBlur={() => onSaveNote(note)}
              rows={3}
              placeholder="Internal notes, only visible to your team"
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-[#3E63F5] resize-y"
              style={{ borderColor: "rgba(31,36,48,0.15)", color: "#1F2430" }}
            />
          </Section>
        </div>

        {/* Actions */}
        <div
          className="px-5 py-3 border-t flex flex-wrap items-center gap-2"
          style={{ borderColor: "rgba(31,36,48,0.1)" }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <ArrowRightCircle className="w-4 h-4 mr-1.5" /> Move
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Move to</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ALL_STAGES.map((s) => (
                <DropdownMenuItem key={s} onClick={() => onMoveStage(s)}>
                  {getStageName(s)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <User className="w-4 h-4 mr-1.5" /> Assign
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52 max-h-72 overflow-y-auto">
              <DropdownMenuLabel>Assign owner</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ownerOptions.length === 0 ? (
                <div className="px-2 py-1.5 text-xs" style={{ color: "#1F2430", opacity: 0.6 }}>
                  No reviewers
                </div>
              ) : (
                ownerOptions.map((o) => (
                  <DropdownMenuItem key={o} onClick={() => onAssign(o)}>
                    {o}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" className="h-9" onClick={onRequestIntro}>
            <Mail className="w-4 h-4 mr-1.5" /> Request intro
          </Button>
          <Button variant="outline" size="sm" className="h-9" onClick={onCompare}>
            <GitCompare className="w-4 h-4 mr-1.5" /> Compare
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 ml-auto"
            style={{ color: "#B91C1C", borderColor: "rgba(239,68,68,0.3)" }}
            onClick={onPass}
          >
            <ThumbsDown className="w-4 h-4 mr-1.5" /> Pass
          </Button>
        </div>
      </motion.aside>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "#1F2430", opacity: 0.55 }}>
        {label}
      </p>
      <p className="text-2xl" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}

function Section({
  title, children, icon,
}: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5" style={{ color: "#1F2430", opacity: 0.6 }}>
        {icon}
        {title}
      </h3>
      {children}
    </section>
  );
}
