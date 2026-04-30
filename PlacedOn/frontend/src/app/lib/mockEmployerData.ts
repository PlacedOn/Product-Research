import type {
  EmployerCandidate,
  Role,
  SavedView,
  PipelineStage,
  MetricData,
  PipelineStageInfo,
} from "./employerTypes";

import employerSeed from "../../imports/placedon_lively_seed_employer.json";

const seed = (employerSeed as any).employer;

// ---------------------------------------------------------------------------
// Roles (seed shape already mirrors `Role`; createdAt is an ISO string).
// ---------------------------------------------------------------------------
export const MOCK_ROLES: Role[] = (seed.roles as any[]).map((r) => ({
  ...r,
  createdAt: new Date(r.createdAt),
})) as Role[];

// ---------------------------------------------------------------------------
// Candidates (seed shape mirrors `EmployerCandidate`; ISO timestamps).
// ---------------------------------------------------------------------------
const SEED_CANDIDATES: EmployerCandidate[] = (seed.candidates as any[]).map(
  (c) => ({
    ...c,
    stage: c.stage as PipelineStage,
    lastActivityTimestamp: new Date(c.lastActivityTimestamp),
    rejectionReason: c.rejectionReason ?? undefined,
  }),
) as EmployerCandidate[];

// ---------------------------------------------------------------------------
// Saved views — kept as filter functions, descriptions sourced from seed
// where labels match.
// ---------------------------------------------------------------------------
export const SAVED_VIEWS: SavedView[] = [
  {
    id: "needs_review",
    label: "Needs review",
    description: "High-fit candidates awaiting initial review",
    filterFn: (c) => c.stage === "new" && c.fitScore >= 85,
  },
  {
    id: "high_fit",
    label: "High-fit candidates",
    description: "Candidates with 85%+ fit score",
    filterFn: (c) =>
      c.fitScore >= 85 && c.stage !== "rejected" && c.stage !== "hired",
  },
  {
    id: "waiting_for_hm",
    label: "Waiting for hiring manager",
    description: "Shortlisted candidates pending HM review",
    filterFn: (c) => c.stage === "hiring_manager_review",
  },
  {
    id: "intro_replies",
    label: "Intro replies",
    description: "Candidates who accepted intro requests",
    filterFn: (c) => c.stage === "candidate_accepted",
  },
  {
    id: "stale",
    label: "Stale candidates",
    description: "Candidates overdue in current stage",
    filterFn: (c) => c.slaStatus === "overdue",
  },
];

// ---------------------------------------------------------------------------
// Metrics / pipeline stages.
//
// The seed includes precomputed `metrics` and `pipelineStages` blocks. We
// prefer those when present (they reflect the curated demo numbers) and fall
// back to derived values from the candidate list.
// ---------------------------------------------------------------------------
export function generateMetrics(candidates: EmployerCandidate[]): MetricData[] {
  if (Array.isArray(seed.metrics) && seed.metrics.length > 0) {
    return (seed.metrics as any[]).map((m) => ({
      label: m.label,
      value: m.value,
      trend: m.trend as MetricData["trend"],
      trendValue: m.trendValue,
    }));
  }
  const newCount = candidates.filter((c) => c.stage === "new").length;
  const awaitingReview = candidates.filter(
    (c) => c.stage === "new" && c.fitScore >= 85,
  ).length;
  const highFit = candidates.filter(
    (c) => c.fitScore >= 85 && c.stage !== "rejected" && c.stage !== "hired",
  ).length;
  const introReplies = candidates.filter((c) => c.stage === "candidate_accepted")
    .length;
  const stale = candidates.filter((c) => c.slaStatus === "overdue").length;
  return [
    { label: "New candidates", value: newCount, trend: "up", trendValue: "+12" },
    { label: "Awaiting review", value: awaitingReview, trend: "up", trendValue: "+5" },
    { label: "High-fit", value: highFit, trend: "flat" },
    { label: "Intro replies", value: introReplies, trend: "up", trendValue: "+3" },
    { label: "Stale reviews", value: stale, trend: "down", trendValue: "-2" },
  ];
}

export function generatePipelineStages(
  candidates: EmployerCandidate[],
): PipelineStageInfo[] {
  if (Array.isArray(seed.pipelineStages) && seed.pipelineStages.length > 0) {
    return (seed.pipelineStages as any[]).map((s) => ({
      id: s.id as PipelineStage,
      label: s.label,
      count: s.count,
      slaCritical: s.slaCritical ?? undefined,
    }));
  }
  const stages: PipelineStage[] = [
    "new",
    "reviewed",
    "shortlisted",
    "hiring_manager_review",
    "intro_requested",
    "candidate_accepted",
    "interviewing",
    "offer",
    "hired",
    "rejected",
  ];
  return stages.map((stage) => {
    const stageCandidates = candidates.filter((c) => c.stage === stage);
    const overdue = stageCandidates.filter((c) => c.slaStatus === "overdue").length;
    return {
      id: stage,
      label: stage
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      count: stageCandidates.length,
      slaCritical: overdue > 0 ? overdue : undefined,
    };
  });
}

// ---------------------------------------------------------------------------
// Public accessors (preserved signatures).
// ---------------------------------------------------------------------------
export function getMockCandidates(): EmployerCandidate[] {
  return SEED_CANDIDATES;
}

export function getMockRoles(): Role[] {
  return MOCK_ROLES;
}

export function getMockMetrics(): MetricData[] {
  return generateMetrics(getMockCandidates());
}

export function getMockPipelineStages(): PipelineStageInfo[] {
  return generatePipelineStages(getMockCandidates());
}
