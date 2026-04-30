export type JobStatus =
  | "draft"
  | "active"
  | "needs_calibration"
  | "paused"
  | "closed"
  | "archived";

export type WorkMode = "onsite" | "hybrid" | "remote";
export type EmploymentType = "full_time" | "contract" | "internship";
export type SeniorityLevel =
  | "intern" | "fresher" | "junior" | "mid" | "senior" | "staff" | "manager";
export type HiringPriority = "low" | "normal" | "urgent";
export type RoleHealth =
  | "healthy" | "too_strict" | "too_broad" | "low_signal" | "needs_review";

export interface RoleWeighting {
  technicalDepth: number;
  problemSolving: number;
  communication: number;
  ownership: number;
  collaboration: number;
  learningVelocity: number;
  ambiguityTolerance: number;
  leadership: number;
  customerEmpathy: number;
  executionSpeed: number;
}

export interface CompensationRange {
  min: number;
  max: number;
  currency: string;
  isPublic: boolean;
  equityMin?: number;
  equityMax?: number;
  bonus?: string;
  benefits?: string;
  noticePeriod?: string;
}

export interface MatchingCriteria {
  requiredSkills: string[];
  preferredSkills: string[];
  mustHaveTraits: string[];
  niceToHaveTraits: string[];
  disqualifiers: string[];
  minimumExperienceYears: number;
  domainExperience: string[];
  educationRequirement?: string;
  availabilityRequirement?: string;
  languageRequirement?: string[];
}

export interface PipelineStageConfig {
  id: string;
  label: string;
  ownerRole?: string;
  slaHours?: number;
}

export interface JobListing {
  id: string;
  title: string;
  department: string;
  team: string;
  level: SeniorityLevel;
  employmentType: EmploymentType;
  openings: number;
  hiringPriority: HiringPriority;
  recruiterOwner: string;
  hiringManager: string;
  collaborators: string[];

  country: string;
  city: string;
  workMode: WorkMode;
  timezone?: string;
  relocationSupport: boolean;
  visaSponsorship: boolean;
  travelRequired?: string;
  officeDays?: number;

  compensation: CompensationRange;

  publicJobDescription: string;
  responsibilities: string[];
  successIn90Days: string;
  requiredQualifications: string[];
  preferredQualifications: string[];
  interviewProcess: string;
  companyPitch: string;

  matchingCriteria: MatchingCriteria;
  weighting: RoleWeighting;

  status: JobStatus;
  applicantsCount: number;
  newCandidatesCount: number;
  highFitCount: number;
  shortlistedCount: number;
  introRequestedCount: number;
  acceptedCount: number;
  interviewingCount: number;
  offerCount: number;

  postedDate?: Date;
  lastActivity: Date;
  roleHealth: RoleHealth;
  healthMessage?: string;
  nextAction: string;
  pipelineStages: PipelineStageConfig[];
  rejectionReasons: string[];
  requireRejectionNote: boolean;
}

export const STATUS_LABELS: Record<JobStatus, string> = {
  draft: "Draft",
  active: "Active",
  needs_calibration: "Needs calibration",
  paused: "Paused",
  closed: "Closed",
  archived: "Archived",
};

export const STATUS_COLORS: Record<JobStatus, { bg: string; fg: string }> = {
  draft: { bg: "rgba(31,36,48,0.06)", fg: "rgba(31,36,48,0.7)" },
  active: { bg: "rgba(16,185,129,0.1)", fg: "#059669" },
  needs_calibration: { bg: "rgba(245,158,11,0.12)", fg: "#B45309" },
  paused: { bg: "rgba(99,102,241,0.1)", fg: "#4F46E5" },
  closed: { bg: "rgba(31,36,48,0.06)", fg: "rgba(31,36,48,0.55)" },
  archived: { bg: "rgba(31,36,48,0.04)", fg: "rgba(31,36,48,0.45)" },
};

export const HEALTH_LABELS: Record<RoleHealth, string> = {
  healthy: "Healthy",
  too_strict: "Too strict",
  too_broad: "Too broad",
  low_signal: "Low signal",
  needs_review: "Needs review",
};

export const HEALTH_COLORS: Record<RoleHealth, string> = {
  healthy: "#10B981",
  too_strict: "#EF4444",
  too_broad: "#F59E0B",
  low_signal: "#F59E0B",
  needs_review: "#6366F1",
};

export const DEFAULT_WEIGHTING: RoleWeighting = {
  technicalDepth: 70,
  problemSolving: 70,
  communication: 60,
  ownership: 60,
  collaboration: 50,
  learningVelocity: 50,
  ambiguityTolerance: 40,
  leadership: 30,
  customerEmpathy: 40,
  executionSpeed: 50,
};

export const DEFAULT_PIPELINE_STAGES: PipelineStageConfig[] = [
  { id: "new", label: "New", slaHours: 48 },
  { id: "reviewed", label: "Reviewed", slaHours: 72 },
  { id: "shortlisted", label: "Shortlisted", slaHours: 72 },
  { id: "hiring_manager_review", label: "Hiring Manager Review", slaHours: 96 },
  { id: "intro_requested", label: "Intro Requested", slaHours: 72 },
  { id: "candidate_accepted", label: "Candidate Accepted", slaHours: 48 },
  { id: "interviewing", label: "Interviewing", slaHours: 168 },
  { id: "offer", label: "Offer", slaHours: 96 },
  { id: "hired", label: "Hired" },
  { id: "rejected", label: "Rejected" },
];

export const DEFAULT_REJECTION_REASONS = [
  "Misalignment with role brief",
  "Below required experience",
  "Compensation mismatch",
  "Not opted in",
  "Better candidates available",
  "Other",
];

import employerSeed from "../../imports/placedon_lively_seed_employer.json";

// Source job listings from the seed dataset. Dates are ISO strings in JSON
// and the type expects `Date`, so convert during mapping. Filter out null
// `slaHours` so the type's optional number stays valid.
export const MOCK_JOB_LISTINGS: JobListing[] = (
  (employerSeed as any).employer.jobs as any[]
).map((j) => ({
  ...j,
  level: j.level as SeniorityLevel,
  employmentType: j.employmentType as EmploymentType,
  hiringPriority: j.hiringPriority as HiringPriority,
  workMode: j.workMode as WorkMode,
  status: j.status as JobStatus,
  roleHealth: j.roleHealth as RoleHealth,
  postedDate: j.postedDate ? new Date(j.postedDate) : undefined,
  lastActivity: new Date(j.lastActivity),
  pipelineStages: (j.pipelineStages as any[]).map((s) => ({
    id: s.id,
    label: s.label,
    ownerRole: s.ownerRole,
    slaHours: s.slaHours ?? undefined,
  })),
})) as JobListing[];


export function getMockJobListings(): JobListing[] {
  return MOCK_JOB_LISTINGS;
}
