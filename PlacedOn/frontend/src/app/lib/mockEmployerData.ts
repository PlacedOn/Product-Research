import type {
  EmployerCandidate,
  Role,
  SavedView,
  EvidenceItem,
  PipelineStage,
  EvidenceConfidence,
  MetricData,
  PipelineStageInfo,
} from "./employerTypes";

// Helper to generate random data
function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function formatLastActivity(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 14) return "1w ago";
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

// Mock roles
export const MOCK_ROLES: Role[] = [
  {
    id: "role-1",
    title: "Senior Backend Engineer",
    department: "Engineering",
    level: "Senior",
    isActive: true,
    counts: {
      newCandidates: 187,
      highFit: 42,
      pendingIntros: 8,
      total: 312,
    },
    healthStatus: "healthy",
    createdAt: daysAgo(45),
  },
  {
    id: "role-2",
    title: "Frontend Engineer",
    department: "Engineering",
    level: "Mid-level",
    isActive: true,
    counts: {
      newCandidates: 311,
      highFit: 65,
      pendingIntros: 14,
      total: 423,
    },
    healthStatus: "healthy",
    createdAt: daysAgo(60),
  },
  {
    id: "role-3",
    title: "Engineering Manager",
    department: "Engineering",
    level: "Senior",
    isActive: true,
    counts: {
      newCandidates: 92,
      highFit: 11,
      pendingIntros: 3,
      total: 156,
    },
    healthStatus: "needs_attention",
    healthMessage: "High-fit rate below target; consider adjusting criteria",
    createdAt: daysAgo(30),
  },
  {
    id: "role-4",
    title: "Full Stack Developer",
    department: "Engineering",
    level: "Mid-level",
    isActive: true,
    counts: {
      newCandidates: 224,
      highFit: 58,
      pendingIntros: 11,
      total: 387,
    },
    healthStatus: "healthy",
    createdAt: daysAgo(50),
  },
  {
    id: "role-5",
    title: "DevOps Engineer",
    department: "Infrastructure",
    level: "Senior",
    isActive: true,
    counts: {
      newCandidates: 143,
      highFit: 34,
      pendingIntros: 6,
      total: 245,
    },
    healthStatus: "healthy",
    createdAt: daysAgo(38),
  },
];

// Evidence templates
const TECHNICAL_EVIDENCE = [
  {
    skill: "Distributed Systems",
    summaries: [
      "Demonstrated hands-on experience designing and debugging event-driven architectures in production environments.",
      "Clear understanding of consensus algorithms and partition tolerance trade-offs.",
      "Built multi-region deployment strategies with demonstrated failure recovery patterns.",
    ],
  },
  {
    skill: "System Design",
    summaries: [
      "Articulated scalable architecture decisions with clear reasoning about CAP theorem trade-offs.",
      "Designed high-throughput API gateway patterns with rate limiting and circuit breaker strategies.",
      "Strong grasp of caching strategies, database sharding, and load balancing approaches.",
    ],
  },
  {
    skill: "API Architecture",
    summaries: [
      "Built RESTful and GraphQL APIs with versioning strategies and backward compatibility considerations.",
      "Designed API contracts with strong focus on developer experience and documentation.",
      "Experience with API rate limiting, authentication flows, and error handling patterns.",
    ],
  },
  {
    skill: "Frontend Systems",
    summaries: [
      "Strong React patterns including hooks, context, and performance optimization techniques.",
      "Experience with component libraries, design systems, and accessibility standards.",
      "Built complex state management solutions with Redux/Zustand and async data flows.",
    ],
  },
  {
    skill: "Testing & Quality",
    summaries: [
      "Advocates for comprehensive testing strategies including unit, integration, and E2E coverage.",
      "Experience with test-driven development and behavior-driven testing frameworks.",
      "Built CI/CD pipelines with automated quality gates and deployment validation.",
    ],
  },
  {
    skill: "Database Design",
    summaries: [
      "Designed normalized and denormalized schemas with clear reasoning about query patterns.",
      "Experience with PostgreSQL, MongoDB, and Redis for different use cases.",
      "Strong understanding of indexing strategies, query optimization, and migration patterns.",
    ],
  },
  {
    skill: "Cloud Infrastructure",
    summaries: [
      "Hands-on experience with AWS services including EC2, RDS, S3, Lambda, and CloudFormation.",
      "Built auto-scaling infrastructure with monitoring, alerting, and cost optimization.",
      "Experience with Docker, Kubernetes, and container orchestration patterns.",
    ],
  },
  {
    skill: "Security Practices",
    summaries: [
      "Implemented authentication and authorization patterns including OAuth2, JWT, and RBAC.",
      "Experience with security scanning, vulnerability management, and compliance requirements.",
      "Strong understanding of encryption, secure coding practices, and threat modeling.",
    ],
  },
];

const SOFT_SKILLS_EVIDENCE = [
  {
    skill: "Communication Clarity",
    summaries: [
      "Explains technical concepts clearly, adjusting depth based on audience expertise level.",
      "Documents decisions with clear rationale and considers cross-team communication needs.",
      "Asks clarifying questions before diving into implementation details.",
    ],
  },
  {
    skill: "Ownership",
    summaries: [
      "Takes responsibility for end-to-end delivery including monitoring, alerts, and on-call rotation.",
      "Proactively identifies edge cases and potential failure modes before deployment.",
      "Follows up on incidents with post-mortems and preventive measures.",
    ],
  },
  {
    skill: "Collaboration",
    summaries: [
      "Works effectively with cross-functional teams including product, design, and QA.",
      "Shares knowledge through code reviews, documentation, and mentoring sessions.",
      "Resolves technical disagreements through data-driven discussion and prototyping.",
    ],
  },
  {
    skill: "Problem Solving",
    summaries: [
      "Breaks down complex problems into manageable components with clear success criteria.",
      "Considers multiple solution approaches with trade-off analysis before implementation.",
      "Debugs production issues systematically with hypothesis testing and log analysis.",
    ],
  },
  {
    skill: "Learning Velocity",
    summaries: [
      "Demonstrates ability to quickly ramp up on new technologies and frameworks.",
      "Seeks feedback actively and incorporates it into future work.",
      "Shows curiosity about adjacent domains and cross-functional collaboration opportunities.",
    ],
  },
];

const UNCERTAINTY_TEMPLATES = [
  "Needs validation: scale of system-design experience in production environments",
  "Needs validation: leadership scope and mentorship experience on cross-team projects",
  "Needs validation: depth of testing and observability practices in distributed systems",
  "Needs validation: data modeling decisions under high load and complex query patterns",
  "Needs validation: experience with incident response and production debugging at scale",
  "Needs validation: frontend performance optimization techniques for large-scale applications",
  "Needs validation: security practices and compliance knowledge for regulated environments",
  "Needs validation: experience with legacy system migration and incremental refactoring",
  "Needs validation: API design decisions for public-facing developer platforms",
  "Needs validation: infrastructure cost optimization and resource management at scale",
];

const LOCATIONS = [
  "Toronto, ON",
  "San Francisco, CA",
  "New York, NY",
  "London, UK",
  "Berlin, Germany",
  "Remote (US)",
  "Remote (Canada)",
  "Remote (Europe)",
  "Seattle, WA",
  "Austin, TX",
  "Boston, MA",
  "Vancouver, BC",
];

const AVAILABILITY = [
  "Available now",
  "2 weeks notice",
  "1 month notice",
  "Available in 3 weeks",
  "Flexible timing",
  "Immediate start",
];

const OWNERS = [
  "Sarah Chen",
  "Marcus Liu",
  "Priya Patel",
  "Jordan Kim",
  "Alex Rivera",
  null, // Unassigned
];

const STAGES: PipelineStage[] = [
  "new",
  "reviewed",
  "shortlisted",
  "hiring_manager_review",
  "intro_requested",
  "candidate_accepted",
  "interviewing",
  "offer",
];

function generateEvidenceItems(roleTitle: string): EvidenceItem[] {
  const items: EvidenceItem[] = [];
  const numItems = randomInt(4, 7);

  // Pick random technical skills
  const technicalCount = randomInt(2, 4);
  for (let i = 0; i < technicalCount; i++) {
    const evidence = randomItem(TECHNICAL_EVIDENCE);
    items.push({
      id: `evidence-${items.length}`,
      skillOrTrait: evidence.skill,
      signalStrength: randomItem(["Strong", "Moderate"] as const),
      confidence: randomItem(["Strong", "Moderate"] as const),
      summary: randomItem(evidence.summaries),
      category: "technical",
    });
  }

  // Pick random soft skills
  const softSkillCount = numItems - technicalCount;
  for (let i = 0; i < softSkillCount; i++) {
    const evidence = randomItem(SOFT_SKILLS_EVIDENCE);
    items.push({
      id: `evidence-${items.length}`,
      skillOrTrait: evidence.skill,
      signalStrength: randomItem(["Strong", "Moderate"] as const),
      confidence: randomItem(["Strong", "Moderate"] as const),
      summary: randomItem(evidence.summaries),
      category: randomItem(["communication", "ownership", "collaboration", "learning"] as const),
    });
  }

  return items;
}

function generateWhyMatch(roleTitle: string, evidenceItems: EvidenceItem[]): string {
  const templates = [
    `Strong ${evidenceItems[0].skillOrTrait.toLowerCase()} work with clear ${evidenceItems[1].skillOrTrait.toLowerCase()} signals.`,
    `Verified delivery on ${roleTitle.toLowerCase()} fundamentals — strong on ${evidenceItems[0].skillOrTrait.toLowerCase()}.`,
    `Evidence aligns with role brief; consistent signals across ${evidenceItems.length} verified strengths.`,
    `Hands-on track record matches calibration; recent interview validates ${evidenceItems[0].skillOrTrait.toLowerCase()}.`,
    `Clear demonstration of ${evidenceItems[0].skillOrTrait.toLowerCase()} with production-scale experience.`,
  ];
  return randomItem(templates);
}

function generateNextAction(stage: PipelineStage): string {
  const actions: Record<PipelineStage, string[]> = {
    new: ["Review evidence", "Assign reviewer", "Quick screen"],
    reviewed: ["Move to shortlist", "Request more info", "Schedule call"],
    shortlisted: ["Share with HM", "Request intro", "Technical screen"],
    hiring_manager_review: ["Await HM feedback", "Schedule HM call", "Prepare interview"],
    intro_requested: ["Awaiting candidate", "Follow up", "Check status"],
    candidate_accepted: ["Schedule interview", "Send calendar invite", "Prep interview team"],
    interviewing: ["Collect feedback", "Schedule next round", "Debrief team"],
    offer: ["Prepare offer letter", "Salary negotiation", "Close candidate"],
    hired: ["Onboarding", "Complete", "Archive"],
    rejected: ["Send rejection", "Add to talent pool", "Archive"],
  };
  return randomItem(actions[stage]);
}

function generateSLAStatus(ageInStage: number, stage: PipelineStage): "on_time" | "approaching" | "overdue" {
  const slaThresholds: Record<PipelineStage, number> = {
    new: 3,
    reviewed: 5,
    shortlisted: 7,
    hiring_manager_review: 5,
    intro_requested: 7,
    candidate_accepted: 3,
    interviewing: 14,
    offer: 5,
    hired: 0,
    rejected: 0,
  };

  const threshold = slaThresholds[stage];
  if (ageInStage >= threshold) return "overdue";
  if (ageInStage >= threshold * 0.75) return "approaching";
  return "on_time";
}

// Generate mock candidates
export function generateMockCandidates(count: number = 60): EmployerCandidate[] {
  const candidates: EmployerCandidate[] = [];

  for (let i = 0; i < count; i++) {
    const role = randomItem(MOCK_ROLES);
    const evidenceItems = generateEvidenceItems(role.title);
    const stage = randomItem(STAGES);
    const fitScore = randomInt(70, 98);
    const evidenceConfidence: EvidenceConfidence =
      fitScore >= 90 ? "Strong" : fitScore >= 80 ? randomItem(["Strong", "Moderate"]) : "Moderate";
    const ageInStage = randomInt(0, 20);
    const lastActivityDays = randomInt(0, ageInStage);
    const interviewDays = randomInt(2, 30);

    candidates.push({
      id: `cand-${i + 1}`,
      name: "Aisha Sharma",
      anonymousId: `ANON-${1000 + i}`,
      targetRole: role.title,
      fitScore,
      evidenceConfidence,
      whyMatch: generateWhyMatch(role.title, evidenceItems),
      topTwoTags: evidenceItems.slice(0, 2).map((e) => e.skillOrTrait),
      stage,
      location: randomItem(LOCATIONS),
      availability: randomItem(AVAILABILITY),
      owner: stage === "new" ? null : randomItem(OWNERS),
      lastActivity: formatLastActivity(lastActivityDays),
      lastActivityTimestamp: daysAgo(lastActivityDays),
      nextAction: generateNextAction(stage),
      evidenceItems,
      uncertainty: randomItem(UNCERTAINTY_TEMPLATES),
      interviewFreshness: `Interviewed ${interviewDays}d ago`,
      ageInStage,
      slaStatus: generateSLAStatus(ageInStage, stage),
      tags: [],
      notes: "",
      hasOptedIn: stage !== "new" && stage !== "reviewed",
    });
  }

  return candidates;
}

// Saved views
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
    filterFn: (c) => c.fitScore >= 85 && c.stage !== "rejected" && c.stage !== "hired",
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

// Generate metrics from candidates
export function generateMetrics(candidates: EmployerCandidate[]): MetricData[] {
  const newCount = candidates.filter((c) => c.stage === "new").length;
  const awaitingReview = candidates.filter((c) => c.stage === "new" && c.fitScore >= 85).length;
  const highFit = candidates.filter((c) => c.fitScore >= 85 && c.stage !== "rejected" && c.stage !== "hired").length;
  const introReplies = candidates.filter((c) => c.stage === "candidate_accepted").length;
  const stale = candidates.filter((c) => c.slaStatus === "overdue").length;

  return [
    { label: "New candidates", value: newCount, trend: "up", trendValue: "+12" },
    { label: "Awaiting review", value: awaitingReview, trend: "up", trendValue: "+5" },
    { label: "High-fit", value: highFit, trend: "flat" },
    { label: "Intro replies", value: introReplies, trend: "up", trendValue: "+3" },
    { label: "Stale reviews", value: stale, trend: "down", trendValue: "-2" },
  ];
}

// Generate pipeline stage info
export function generatePipelineStages(candidates: EmployerCandidate[]): PipelineStageInfo[] {
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
      label: stage.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      count: stageCandidates.length,
      slaCritical: overdue > 0 ? overdue : undefined,
    };
  });
}

// Mock data singleton
let mockCandidates: EmployerCandidate[] | null = null;

export function getMockCandidates(): EmployerCandidate[] {
  if (!mockCandidates) {
    mockCandidates = generateMockCandidates(60);
  }
  return mockCandidates;
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
