// Core types for the dense ATS-style employer dashboard

export type PipelineStage =
  | "new"
  | "reviewed"
  | "shortlisted"
  | "hiring_manager_review"
  | "intro_requested"
  | "candidate_accepted"
  | "interviewing"
  | "offer"
  | "hired"
  | "rejected";

export type EvidenceConfidence = "Strong" | "Moderate" | "Needs validation";

export type SavedViewId =
  | "needs_review"
  | "high_fit"
  | "waiting_for_hm"
  | "intro_replies"
  | "stale";

export interface EvidenceItem {
  id: string;
  skillOrTrait: string;
  signalStrength: "Strong" | "Moderate" | "Weak";
  confidence: EvidenceConfidence;
  summary: string;
  category: "technical" | "communication" | "ownership" | "collaboration" | "learning";
}

export interface EmployerCandidate {
  id: string;
  name: string;
  anonymousId: string; // Used before candidate opts in
  targetRole: string;
  fitScore: number; // 0-100
  evidenceConfidence: EvidenceConfidence;
  whyMatch: string; // One-line explanation
  topTwoTags: string[]; // Top 2 evidence-backed strengths
  stage: PipelineStage;
  location: string;
  availability: string;
  owner: string | null;
  lastActivity: string; // e.g., "Today", "2d ago"
  lastActivityTimestamp: Date;
  nextAction: string;
  evidenceItems: EvidenceItem[];
  uncertainty: string; // Main area needing validation
  interviewFreshness: string; // e.g., "Interviewed 2d ago"
  ageInStage: number; // Days in current stage
  slaStatus: "on_time" | "approaching" | "overdue";
  tags: string[];
  notes: string;
  hasOptedIn: boolean; // Whether candidate has accepted intro
  introStatus?: "none" | "requested" | "accepted" | "declined";
  rejectionReason?: string;
}

export interface Role {
  id: string;
  title: string;
  department: string;
  level: string; // e.g., "Senior", "Mid-level", "Junior"
  isActive: boolean;
  counts: {
    newCandidates: number;
    highFit: number; // Fit >= 85
    pendingIntros: number;
    total: number;
  };
  healthStatus: "healthy" | "needs_attention" | "critical";
  healthMessage?: string;
  createdAt: Date;
}

export interface SavedView {
  id: SavedViewId;
  label: string;
  description: string;
  filterFn: (candidate: EmployerCandidate) => boolean;
}

export interface MetricData {
  label: string;
  value: number;
  trend?: "up" | "down" | "flat";
  trendValue?: string;
}

export interface PipelineStageInfo {
  id: PipelineStage;
  label: string;
  count: number;
  slaCritical?: number; // Number overdue
}

export interface ComparisonCandidate {
  candidate: EmployerCandidate;
  scores: {
    overallFit: number;
    technicalDepth: number;
    communicationClarity: number;
    ownership: number;
    collaboration: number;
    learningVelocity: number;
  };
  mainStrength: string;
  mainUncertainty: string;
  recommendedNextStep: string;
}

export interface BulkAction {
  id: string;
  label: string;
  icon: string;
  requiresInput?: boolean;
  destructive?: boolean;
}

// Helper functions
export function getStageName(stage: PipelineStage): string {
  const stageNames: Record<PipelineStage, string> = {
    new: "New",
    reviewed: "Reviewed",
    shortlisted: "Shortlisted",
    hiring_manager_review: "Hiring Manager Review",
    intro_requested: "Intro Requested",
    candidate_accepted: "Candidate Accepted",
    interviewing: "Interviewing",
    offer: "Offer",
    hired: "Hired",
    rejected: "Rejected",
  };
  return stageNames[stage];
}

export function getStageColor(stage: PipelineStage): string {
  const colors: Record<PipelineStage, string> = {
    new: "bg-blue-50 text-blue-700 border-blue-200",
    reviewed: "bg-purple-50 text-purple-700 border-purple-200",
    shortlisted: "bg-indigo-50 text-indigo-700 border-indigo-200",
    hiring_manager_review: "bg-violet-50 text-violet-700 border-violet-200",
    intro_requested: "bg-amber-50 text-amber-700 border-amber-200",
    candidate_accepted: "bg-cyan-50 text-cyan-700 border-cyan-200",
    interviewing: "bg-teal-50 text-teal-700 border-teal-200",
    offer: "bg-green-50 text-green-700 border-green-200",
    hired: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-gray-50 text-gray-700 border-gray-200",
  };
  return colors[stage];
}

export function getConfidenceBadgeColor(confidence: EvidenceConfidence): string {
  const colors: Record<EvidenceConfidence, string> = {
    Strong: "bg-green-50 text-green-700 border-green-200",
    Moderate: "bg-amber-50 text-amber-700 border-amber-200",
    "Needs validation": "bg-orange-50 text-orange-700 border-orange-200",
  };
  return colors[confidence];
}

export function getSLAStatusColor(status: "on_time" | "approaching" | "overdue"): string {
  const colors = {
    on_time: "text-green-600",
    approaching: "text-amber-600",
    overdue: "text-red-600",
  };
  return colors[status];
}
