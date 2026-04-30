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

function daysAgo(d: number): Date {
  const dt = new Date();
  dt.setDate(dt.getDate() - d);
  return dt;
}

export const MOCK_JOB_LISTINGS: JobListing[] = [
  {
    id: "job-1",
    title: "Senior Backend Engineer",
    department: "Engineering",
    team: "Platform",
    level: "senior",
    employmentType: "full_time",
    openings: 2,
    hiringPriority: "urgent",
    recruiterOwner: "Sarah Chen",
    hiringManager: "Marcus Liu",
    collaborators: ["Priya Patel"],
    country: "Canada",
    city: "Toronto",
    workMode: "hybrid",
    timezone: "EST overlap",
    relocationSupport: true,
    visaSponsorship: true,
    officeDays: 2,
    compensation: {
      min: 165000, max: 210000, currency: "CAD", isPublic: true,
      equityMin: 0.05, equityMax: 0.15, bonus: "10% annual",
      benefits: "Health, dental, RRSP", noticePeriod: "≤4 weeks",
    },
    publicJobDescription:
      "Build distributed services that power our matching engine at scale.",
    responsibilities: [
      "Design and ship backend services in Go/Python",
      "Lead architecture decisions on event-driven systems",
      "Mentor mid-level engineers on the platform team",
    ],
    successIn90Days:
      "Own a critical service end-to-end and ship one major reliability improvement.",
    requiredQualifications: [
      "5+ years backend engineering",
      "Production distributed systems experience",
      "Strong system design",
    ],
    preferredQualifications: ["Kafka or similar event streaming", "Kubernetes"],
    interviewProcess:
      "Recruiter screen → System design → Coding → HM final (4 stages, ~5 hours)",
    companyPitch:
      "Join the team rebuilding how talent gets discovered using verified evidence.",
    matchingCriteria: {
      requiredSkills: ["Distributed systems", "Go or Python", "System design"],
      preferredSkills: ["Kafka", "Kubernetes", "PostgreSQL"],
      mustHaveTraits: ["Ownership", "Technical depth"],
      niceToHaveTraits: ["Mentorship"],
      disqualifiers: [],
      minimumExperienceYears: 5,
      domainExperience: ["B2B SaaS"],
      availabilityRequirement: "≤6 weeks notice",
      languageRequirement: ["English"],
    },
    weighting: { ...DEFAULT_WEIGHTING, technicalDepth: 85, ownership: 75, leadership: 50 },
    status: "active",
    applicantsCount: 312, newCandidatesCount: 187, highFitCount: 42,
    shortlistedCount: 14, introRequestedCount: 8, acceptedCount: 5,
    interviewingCount: 3, offerCount: 1,
    postedDate: daysAgo(14), lastActivity: daysAgo(0),
    roleHealth: "healthy", nextAction: "Review 8 new high-fit candidates",
    pipelineStages: DEFAULT_PIPELINE_STAGES,
    rejectionReasons: DEFAULT_REJECTION_REASONS, requireRejectionNote: true,
  },
  {
    id: "job-2",
    title: "Frontend Engineer",
    department: "Engineering",
    team: "Product",
    level: "mid",
    employmentType: "full_time",
    openings: 3,
    hiringPriority: "normal",
    recruiterOwner: "Sarah Chen",
    hiringManager: "Aisha Khan",
    collaborators: [],
    country: "Canada", city: "Remote", workMode: "remote",
    relocationSupport: false, visaSponsorship: false,
    compensation: {
      min: 120000, max: 150000, currency: "CAD", isPublic: false,
      benefits: "Health, dental, RRSP",
    },
    publicJobDescription:
      "Ship delightful, accessible UI for our hiring platform.",
    responsibilities: ["Build React components", "Own UX polish across the app"],
    successIn90Days: "Lead a feature ship and own its quality bar.",
    requiredQualifications: ["3+ years React", "Strong CSS fundamentals"],
    preferredQualifications: ["Tailwind", "Motion / animation experience"],
    interviewProcess: "Recruiter → Take-home → Pairing → HM",
    companyPitch: "Help redesign hiring for the modern candidate.",
    matchingCriteria: {
      requiredSkills: ["React", "TypeScript", "CSS"],
      preferredSkills: ["Tailwind", "Motion"],
      mustHaveTraits: ["Communication clarity", "Ownership"],
      niceToHaveTraits: ["Design sense"],
      disqualifiers: [],
      minimumExperienceYears: 3,
      domainExperience: [],
    },
    weighting: { ...DEFAULT_WEIGHTING, technicalDepth: 65, communication: 75 },
    status: "needs_calibration",
    applicantsCount: 487, newCandidatesCount: 311, highFitCount: 28,
    shortlistedCount: 9, introRequestedCount: 4, acceptedCount: 2,
    interviewingCount: 1, offerCount: 0,
    postedDate: daysAgo(21), lastActivity: daysAgo(2),
    roleHealth: "too_broad",
    healthMessage: "High applicant volume but only 6% high-fit — tighten required skills.",
    nextAction: "Recalibrate matching criteria",
    pipelineStages: DEFAULT_PIPELINE_STAGES,
    rejectionReasons: DEFAULT_REJECTION_REASONS, requireRejectionNote: true,
  },
  {
    id: "job-3",
    title: "Engineering Manager, Infra",
    department: "Engineering",
    team: "Infra",
    level: "manager",
    employmentType: "full_time",
    openings: 1,
    hiringPriority: "urgent",
    recruiterOwner: "Priya Patel",
    hiringManager: "Marcus Liu",
    collaborators: ["Sarah Chen"],
    country: "Canada", city: "Toronto", workMode: "hybrid",
    relocationSupport: true, visaSponsorship: true, officeDays: 3,
    compensation: { min: 200000, max: 245000, currency: "CAD", isPublic: false },
    publicJobDescription: "Lead our infra team across reliability and platform.",
    responsibilities: ["Manage 6 engineers", "Own roadmap & growth"],
    successIn90Days: "Build trust with team; ship one platform-level win.",
    requiredQualifications: ["5+ years engineering", "2+ years management"],
    preferredQualifications: ["Infra background"],
    interviewProcess: "Recruiter → Leadership panel → Cross-functional → HM",
    companyPitch: "Shape the engineering culture as we scale.",
    matchingCriteria: {
      requiredSkills: ["People management", "Infra fundamentals"],
      preferredSkills: ["Kubernetes", "Observability"],
      mustHaveTraits: ["Leadership", "Communication clarity"],
      niceToHaveTraits: [],
      disqualifiers: [],
      minimumExperienceYears: 7,
      domainExperience: ["Infra / platform"],
    },
    weighting: { ...DEFAULT_WEIGHTING, leadership: 85, communication: 80, technicalDepth: 60 },
    status: "active",
    applicantsCount: 84, newCandidatesCount: 22, highFitCount: 6,
    shortlistedCount: 3, introRequestedCount: 2, acceptedCount: 1,
    interviewingCount: 1, offerCount: 0,
    postedDate: daysAgo(30), lastActivity: daysAgo(1),
    roleHealth: "low_signal",
    healthMessage: "Few high-fit candidates this week. Consider broadening domain criteria.",
    nextAction: "Broaden domain experience criteria",
    pipelineStages: DEFAULT_PIPELINE_STAGES,
    rejectionReasons: DEFAULT_REJECTION_REASONS, requireRejectionNote: true,
  },
  {
    id: "job-4",
    title: "Full Stack Developer",
    department: "Engineering",
    team: "Growth",
    level: "mid",
    employmentType: "full_time",
    openings: 2,
    hiringPriority: "normal",
    recruiterOwner: "Sarah Chen",
    hiringManager: "Aisha Khan",
    collaborators: [],
    country: "Canada", city: "Toronto", workMode: "hybrid",
    relocationSupport: false, visaSponsorship: false, officeDays: 2,
    compensation: { min: 115000, max: 145000, currency: "CAD", isPublic: true },
    publicJobDescription: "Build full-stack features end-to-end across our platform.",
    responsibilities: ["Ship full-stack features", "Run experiments"],
    successIn90Days: "Own and ship two growth experiments.",
    requiredQualifications: ["3+ years full-stack", "Node + React"],
    preferredQualifications: ["A/B testing experience"],
    interviewProcess: "Recruiter → Coding → System design → HM",
    companyPitch: "Help us reach 10× more talent through evidence-based discovery.",
    matchingCriteria: {
      requiredSkills: ["React", "Node.js", "REST APIs"],
      preferredSkills: ["Experimentation", "Postgres"],
      mustHaveTraits: ["Execution speed", "Ownership"],
      niceToHaveTraits: [],
      disqualifiers: [],
      minimumExperienceYears: 3,
      domainExperience: [],
    },
    weighting: { ...DEFAULT_WEIGHTING, executionSpeed: 75, ownership: 70 },
    status: "draft",
    applicantsCount: 0, newCandidatesCount: 0, highFitCount: 0,
    shortlistedCount: 0, introRequestedCount: 0, acceptedCount: 0,
    interviewingCount: 0, offerCount: 0,
    lastActivity: daysAgo(0),
    roleHealth: "needs_review",
    healthMessage: "Draft — publish to start matching.",
    nextAction: "Finalize JD and publish",
    pipelineStages: DEFAULT_PIPELINE_STAGES,
    rejectionReasons: DEFAULT_REJECTION_REASONS, requireRejectionNote: true,
  },
  {
    id: "job-5",
    title: "DevOps Engineer",
    department: "Engineering",
    team: "Infra",
    level: "senior",
    employmentType: "full_time",
    openings: 1,
    hiringPriority: "low",
    recruiterOwner: "Priya Patel",
    hiringManager: "Marcus Liu",
    collaborators: [],
    country: "Canada", city: "Remote", workMode: "remote",
    relocationSupport: false, visaSponsorship: false,
    compensation: { min: 140000, max: 175000, currency: "CAD", isPublic: false },
    publicJobDescription: "Own CI/CD, observability, and reliability.",
    responsibilities: ["Run CI/CD", "Build observability"],
    successIn90Days: "Cut p95 deploy time in half.",
    requiredQualifications: ["5+ years DevOps", "Kubernetes"],
    preferredQualifications: ["Terraform", "GCP"],
    interviewProcess: "Recruiter → Systems → HM",
    companyPitch: "Be the backbone of our shipping speed.",
    matchingCriteria: {
      requiredSkills: ["Kubernetes", "CI/CD", "IaC"],
      preferredSkills: ["Terraform", "Observability"],
      mustHaveTraits: ["Ownership", "Technical depth"],
      niceToHaveTraits: [],
      disqualifiers: [],
      minimumExperienceYears: 5,
      domainExperience: [],
    },
    weighting: { ...DEFAULT_WEIGHTING, technicalDepth: 80, ownership: 75 },
    status: "paused",
    applicantsCount: 96, newCandidatesCount: 12, highFitCount: 5,
    shortlistedCount: 2, introRequestedCount: 1, acceptedCount: 0,
    interviewingCount: 0, offerCount: 0,
    postedDate: daysAgo(45), lastActivity: daysAgo(7),
    roleHealth: "needs_review",
    healthMessage: "Paused while priorities shift.",
    nextAction: "Resume or close",
    pipelineStages: DEFAULT_PIPELINE_STAGES,
    rejectionReasons: DEFAULT_REJECTION_REASONS, requireRejectionNote: true,
  },
];

export function getMockJobListings(): JobListing[] {
  return MOCK_JOB_LISTINGS;
}
