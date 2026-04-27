// Mock data for demo API endpoints
// This data is used when the backend is not available

import {
  CandidateIdentity,
  DashboardResponse,
  HCVResponse,
  MatchesResponse,
  ApplicationsResponse,
  InterviewsResponse,
  EmployerResponse,
  SettingsResponse,
} from './demoApi';

export const mockCandidate: CandidateIdentity = {
  name: 'Aisha Sharma',
  target_role: 'Frontend Engineer',
  location: 'Bengaluru, India',
  availability: 'Available in 2 weeks',
  profile_status: 'Active',
  visibility: 'Public',
  share_url: 'https://placedon.com/profile/aisha-sharma-blr-2024',
};

export const mockHCV: HCVResponse = {
  summary: 'Strong evidence across technical execution, system design, and collaborative problem-solving. Demonstrated depth in React ecosystem, API architecture, and cross-functional collaboration.',
  embedding_metadata: {
    model: 'text-embedding-ada-002',
    dimension_count: 1536,
    last_updated: '2026-04-25T10:30:00Z',
  },
  dimensions: [
    {
      dimension: 'Technical Execution',
      score: 0.87,
      confidence: 0.92,
      uncertainty: 0.08,
      evidence_snippets: [
        'Implemented real-time data sync using WebSockets, reducing latency by 40%',
        'Refactored legacy codebase to TypeScript, improving type safety across 50+ components',
        'Built CI/CD pipeline that reduced deployment time from 45min to 8min',
      ],
    },
    {
      dimension: 'System Design',
      score: 0.82,
      confidence: 0.88,
      uncertainty: 0.12,
      evidence_snippets: [
        'Architected microservices migration strategy for monolith serving 2M users',
        'Designed event-driven system handling 10K events/sec with 99.9% reliability',
        'Created database sharding strategy that improved query performance by 65%',
      ],
    },
    {
      dimension: 'Problem Solving',
      score: 0.85,
      confidence: 0.90,
      uncertainty: 0.10,
      evidence_snippets: [
        'Debugged critical memory leak affecting 30% of users in production',
        'Optimized algorithm reducing compute cost by $15K/month',
        'Identified and fixed security vulnerability before public disclosure',
      ],
    },
    {
      dimension: 'Collaboration',
      score: 0.79,
      confidence: 0.85,
      uncertainty: 0.15,
      evidence_snippets: [
        'Led cross-team initiative coordinating 4 engineering teams',
        'Mentored 3 junior engineers through production feature launches',
        'Facilitated technical design reviews with product and design teams',
      ],
    },
    {
      dimension: 'Communication',
      score: 0.76,
      confidence: 0.83,
      uncertainty: 0.17,
      evidence_snippets: [
        'Presented technical roadmap to C-suite executives',
        'Wrote comprehensive API documentation adopted by 50+ developers',
        'Conducted effective code reviews with constructive feedback',
      ],
    },
  ],
};

export const mockDashboard: DashboardResponse = {
  next_best_action: {
    type: 'start_interview',
    title: 'Complete Your Leadership Evidence',
    description: 'Answer 3 questions about times you led technical projects. Takes ~8 minutes and strengthens your profile for senior roles.',
    cta_label: 'Start Interview',
    cta_route: '/interviews/new',
    priority: 'high',
  },
  profile_snapshot: {
    completion: 78,
    evidence_strength: 'Strong Evidence',
    skills_count: 24,
    interviews_completed: 5,
  },
  matches_summary: {
    total: 12,
    new_count: 3,
    strong_fits: 5,
  },
  pipeline_summary: {
    active_applications: 4,
    upcoming_interviews: 2,
    pending_responses: 1,
  },
  growth_activity: {
    recent_improvements: [
      'Added evidence for System Design (+12% strength)',
      'Completed Technical Leadership interview',
      'Enhanced API Architecture examples',
    ],
    next_milestones: [
      'Complete 2 more interviews to reach 85% profile strength',
      'Add evidence for scalability and performance optimization',
      'Review and respond to 3 new employer matches',
    ],
  },
};

export const mockMatches: MatchesResponse = {
  matches: [
    {
      id: 'match-1',
      company: 'Stripe',
      role: 'Senior Software Engineer, Platform',
      location: 'San Francisco, CA',
      match_label: 'Strong Match',
      evidence_reason: 'Your API design experience aligns with their platform infrastructure needs',
      action_type: 'new',
      salary_range: '$180K - $240K',
      posted_date: '2026-04-20',
    },
    {
      id: 'match-2',
      company: 'Notion',
      role: 'Full-Stack Engineer, Collaboration',
      location: 'Remote (US)',
      match_label: 'Strong Match',
      evidence_reason: 'Your real-time sync expertise matches their collaboration features roadmap',
      action_type: 'new',
      salary_range: '$170K - $230K',
      posted_date: '2026-04-22',
    },
    {
      id: 'match-3',
      company: 'Vercel',
      role: 'Engineering Lead, Developer Experience',
      location: 'Remote (Global)',
      match_label: 'Good Match',
      evidence_reason: 'Your CI/CD and developer tooling experience aligns with their DX focus',
      action_type: 'responded',
      salary_range: '$190K - $250K',
      posted_date: '2026-04-18',
    },
    {
      id: 'match-4',
      company: 'Linear',
      role: 'Senior Frontend Engineer',
      location: 'San Francisco, CA / Remote',
      match_label: 'Strong Match',
      evidence_reason: 'Your TypeScript and React expertise matches their high-performance UI needs',
      action_type: 'viewed',
      salary_range: '$165K - $220K',
      posted_date: '2026-04-15',
    },
    {
      id: 'match-5',
      company: 'Anthropic',
      role: 'Full-Stack Engineer, Product',
      location: 'San Francisco, CA',
      match_label: 'Good Match',
      evidence_reason: 'Your system design skills align with their scaling challenges',
      action_type: 'new',
      salary_range: '$175K - $235K',
      posted_date: '2026-04-24',
    },
  ],
};

export const mockApplications: ApplicationsResponse = {
  stages: [
    { stage: 'Applied', count: 2 },
    { stage: 'Phone Screen', count: 1 },
    { stage: 'Technical', count: 1 },
    { stage: 'Final Round', count: 1 },
  ],
  applications: [
    {
      id: 'app-1',
      company: 'Stripe',
      role: 'Senior Software Engineer, Platform',
      stage: 'Technical',
      last_updated: '2026-04-23',
      evidence_used: [
        'API Architecture examples',
        'Microservices migration experience',
        'System scaling evidence',
      ],
      next_step: 'Technical interview scheduled for Apr 29',
    },
    {
      id: 'app-2',
      company: 'Notion',
      role: 'Full-Stack Engineer, Collaboration',
      stage: 'Phone Screen',
      last_updated: '2026-04-25',
      evidence_used: [
        'Real-time sync implementation',
        'React component architecture',
        'Team collaboration examples',
      ],
      next_step: 'Awaiting recruiter follow-up',
    },
    {
      id: 'app-3',
      company: 'Vercel',
      role: 'Engineering Lead, Developer Experience',
      stage: 'Final Round',
      last_updated: '2026-04-22',
      evidence_used: [
        'CI/CD pipeline optimization',
        'Developer tooling projects',
        'Technical leadership evidence',
      ],
      next_step: 'Final interview with CTO on May 1',
    },
    {
      id: 'app-4',
      company: 'Anthropic',
      role: 'Full-Stack Engineer, Product',
      stage: 'Applied',
      last_updated: '2026-04-26',
      evidence_used: [
        'Full-stack project examples',
        'TypeScript expertise',
        'Problem-solving examples',
      ],
    },
  ],
};

export const mockInterviews: InterviewsResponse = {
  upcoming: [
    {
      id: 'interview-1',
      company: 'Stripe',
      role: 'Senior Software Engineer, Platform',
      type: 'Technical Interview',
      scheduled_time: '2026-04-29T14:00:00Z',
      duration: '90 minutes',
      interviewer: 'Alex Rivera, Engineering Manager',
      prep_notes: [
        'Review API design patterns and RESTful best practices',
        'Prepare examples of scaling distributed systems',
        'Be ready to discuss trade-offs in microservices architecture',
      ],
      join_url: 'https://stripe.zoom.us/j/12345',
      status: 'confirmed',
    },
    {
      id: 'interview-2',
      company: 'Vercel',
      role: 'Engineering Lead, Developer Experience',
      type: 'Leadership Interview',
      scheduled_time: '2026-05-01T11:00:00Z',
      duration: '60 minutes',
      interviewer: 'Sarah Chen, CTO',
      prep_notes: [
        'Prepare stories about leading cross-functional teams',
        'Think about your philosophy on developer experience',
        'Be ready to discuss strategic technical decisions',
      ],
      join_url: 'https://vercel.zoom.us/j/67890',
      status: 'confirmed',
    },
  ],
  past: [
    {
      id: 'interview-3',
      company: 'Notion',
      role: 'Full-Stack Engineer, Collaboration',
      type: 'Phone Screen',
      scheduled_time: '2026-04-25T10:00:00Z',
      duration: '30 minutes',
      interviewer: 'Jamie Park, Recruiter',
      prep_notes: [],
      status: 'completed',
    },
    {
      id: 'interview-4',
      company: 'Linear',
      role: 'Senior Frontend Engineer',
      type: 'Initial Chat',
      scheduled_time: '2026-04-20T15:00:00Z',
      duration: '30 minutes',
      interviewer: 'Morgan Liu, Head of Engineering',
      prep_notes: [],
      status: 'completed',
    },
  ],
};

export const mockEmployer: EmployerResponse = {
  jobs: [
    {
      id: 'job-1',
      title: 'Senior Full-Stack Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      posted_date: '2026-04-15',
      applicants_count: 23,
      status: 'active',
    },
    {
      id: 'job-2',
      title: 'Frontend Engineer',
      department: 'Product',
      location: 'Remote (US)',
      posted_date: '2026-04-10',
      applicants_count: 41,
      status: 'active',
    },
    {
      id: 'job-3',
      title: 'Engineering Manager',
      department: 'Engineering',
      location: 'New York, NY',
      posted_date: '2026-04-01',
      applicants_count: 12,
      status: 'active',
    },
  ],
  discovery_feed: [
    {
      id: 'candidate-1',
      name: 'Alex Rivera',
      target_role: 'Senior Full-Stack Engineer',
      location: 'San Francisco, CA',
      match_score: 94,
      evidence_strength: 'Strong Evidence',
      key_signals: [
        'Built scalable React applications serving 5M+ users',
        'Led migration from monolith to microservices',
        'Strong API design and GraphQL experience',
      ],
      available_from: '2 weeks',
    },
    {
      id: 'candidate-2',
      name: 'Jordan Lee',
      target_role: 'Full-Stack Engineer',
      location: 'Remote (US)',
      match_score: 89,
      evidence_strength: 'Strong Evidence',
      key_signals: [
        'Expertise in TypeScript and modern React patterns',
        'Built real-time collaboration features',
        'Strong system design fundamentals',
      ],
      available_from: 'Immediate',
    },
    {
      id: 'candidate-3',
      name: 'Sam Patel',
      target_role: 'Frontend Engineer',
      location: 'Austin, TX',
      match_score: 87,
      evidence_strength: 'Moderate Evidence',
      key_signals: [
        'Built high-performance UI components',
        'Strong CSS and design system experience',
        'Accessibility and performance optimization',
      ],
      available_from: '1 month',
    },
  ],
  shortlist: [
    {
      id: 'candidate-1',
      name: 'Alex Rivera',
      role: 'Senior Full-Stack Engineer',
      saved_date: '2026-04-22',
      match_score: 94,
      status: 'Reviewing',
    },
    {
      id: 'candidate-4',
      name: 'Taylor Chen',
      role: 'Frontend Engineer',
      saved_date: '2026-04-20',
      match_score: 91,
      status: 'Intro Requested',
    },
  ],
  intro_requests: [
    {
      candidate_id: 'candidate-4',
      status: 'pending',
      requested_date: '2026-04-24',
    },
  ],
};

export const mockSettings: SettingsResponse = {
  groups: [
    {
      group: 'Privacy & Visibility',
      description: 'Control who can see your profile and how your data is used',
      controls: [
        {
          id: 'profile-visibility',
          label: 'Profile Visibility',
          description: 'Make your profile visible to employers',
          type: 'toggle',
          value: true,
        },
        {
          id: 'anonymize-profile',
          label: 'Anonymous Mode',
          description: 'Hide your name and contact info until you approve a match',
          type: 'toggle',
          value: false,
        },
        {
          id: 'job-search-status',
          label: 'Job Search Status',
          description: 'Let employers know your availability',
          type: 'select',
          value: 'Actively looking',
          options: ['Actively looking', 'Open to offers', 'Not looking', 'Hidden'],
        },
      ],
    },
    {
      group: 'Evidence & Data',
      description: 'Manage your interview data and evidence',
      controls: [
        {
          id: 'auto-generate-evidence',
          label: 'Auto-Generate Evidence',
          description: 'Automatically extract skills and evidence from interviews',
          type: 'toggle',
          value: true,
        },
        {
          id: 'data-retention',
          label: 'Interview Data Retention',
          description: 'How long to keep your interview recordings and transcripts',
          type: 'select',
          value: '1 year',
          options: ['30 days', '90 days', '1 year', 'Forever'],
        },
        {
          id: 'allow-embeddings',
          label: 'Enable AI Analysis',
          description: 'Use AI to analyze interview responses and strengthen evidence',
          type: 'toggle',
          value: true,
        },
      ],
    },
    {
      group: 'Notifications',
      description: 'Choose what updates you want to receive',
      controls: [
        {
          id: 'new-matches',
          label: 'New Match Alerts',
          description: 'Get notified when new employers match with you',
          type: 'toggle',
          value: true,
        },
        {
          id: 'interview-reminders',
          label: 'Interview Reminders',
          description: 'Receive reminders before scheduled interviews',
          type: 'toggle',
          value: true,
        },
        {
          id: 'weekly-digest',
          label: 'Weekly Activity Digest',
          description: 'Summary of matches, applications, and profile improvements',
          type: 'toggle',
          value: false,
        },
      ],
    },
    {
      group: 'Target Preferences',
      description: 'Define your ideal role and work environment',
      controls: [
        {
          id: 'target-role',
          label: 'Target Role',
          description: 'Primary role you\'re seeking',
          type: 'text',
          value: 'Frontend Engineer',
        },
        {
          id: 'location-pref',
          label: 'Location Preference',
          description: 'Where you want to work',
          type: 'select',
          value: 'San Francisco, CA',
          options: ['San Francisco, CA', 'New York, NY', 'Remote (US)', 'Remote (Global)', 'Austin, TX'],
        },
        {
          id: 'min-salary',
          label: 'Minimum Salary',
          description: 'Minimum total compensation (annual)',
          type: 'text',
          value: '$180,000',
        },
      ],
    },
  ],
};