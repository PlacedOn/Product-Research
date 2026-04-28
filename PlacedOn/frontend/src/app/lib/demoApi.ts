// Demo API client for PlacedOn backend
// Base URL configuration with fallback to local development

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

// Feature flag to use mock data (set to false to use real backend)
const USE_MOCK_DATA = false;

// Type definitions for API responses

export interface CandidateIdentity {
  name: string;
  target_role: string;
  location: string;
  availability: string;
  profile_status: string;
  visibility: string;
  share_url: string;
}

export interface EvidenceDimension {
  dimension: string;
  score: number;
  confidence: number;
  uncertainty: number;
  evidence_snippets: string[];
}

export interface HCVResponse {
  summary: string;
  embedding_metadata: {
    model: string;
    dimension_count: number;
    last_updated: string;
  };
  dimensions: EvidenceDimension[];
}

export interface ProfileSnapshot {
  completion: number;
  evidence_strength: string;
  skills_count: number;
  interviews_completed: number;
}

export interface MatchesSummary {
  total: number;
  new_count: number;
  strong_fits: number;
}

export interface PipelineSummary {
  active_applications: number;
  upcoming_interviews: number;
  pending_responses: number;
}

export interface GrowthActivity {
  recent_improvements: string[];
  next_milestones: string[];
}

export interface NextBestAction {
  type: string;
  title: string;
  description: string;
  cta_label: string;
  cta_route?: string;
  priority: string;
}

export interface DashboardResponse {
  next_best_action: NextBestAction;
  profile_snapshot: ProfileSnapshot;
  matches_summary: MatchesSummary;
  pipeline_summary: PipelineSummary;
  growth_activity: GrowthActivity;
}

export interface Match {
  id: string;
  company: string;
  company_logo?: string;
  role: string;
  location: string;
  match_label: string;
  evidence_reason: string;
  action_type: string;
  salary_range?: string;
  posted_date?: string;
}

export interface MatchesResponse {
  matches: Match[];
}

export interface ApplicationStage {
  stage: string;
  count: number;
}

export interface Application {
  id: string;
  company: string;
  company_logo?: string;
  role: string;
  stage: string;
  last_updated: string;
  evidence_used: string[];
  next_step?: string;
}

export interface ApplicationsResponse {
  stages: ApplicationStage[];
  applications: Application[];
}

export interface Interview {
  id: string;
  company: string;
  company_logo?: string;
  role: string;
  type: string;
  scheduled_time: string;
  duration: string;
  interviewer?: string;
  prep_notes: string[];
  join_url?: string;
  status: string;
}

export interface InterviewsResponse {
  upcoming: Interview[];
  past: Interview[];
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  posted_date: string;
  applicants_count: number;
  status: string;
}

export interface DiscoveryCandidate {
  id: string;
  name: string;
  target_role: string;
  location: string;
  match_score: number;
  evidence_strength: string;
  key_signals: string[];
  available_from: string;
}

export interface ShortlistCandidate {
  id: string;
  name: string;
  role: string;
  saved_date: string;
  match_score: number;
  status: string;
}

export interface IntroRequest {
  candidate_id: string;
  status: string;
  requested_date?: string;
}

export interface EmployerResponse {
  jobs: Job[];
  discovery_feed: DiscoveryCandidate[];
  shortlist: ShortlistCandidate[];
  intro_requests: IntroRequest[];
}

export interface SettingControl {
  id: string;
  label: string;
  description: string;
  type: 'toggle' | 'select' | 'text';
  value: boolean | string;
  options?: string[];
}

export interface SettingGroup {
  group: string;
  description: string;
  controls: SettingControl[];
}

export interface SettingsResponse {
  groups: SettingGroup[];
}

// Error class for API errors
export class DemoAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'DemoAPIError';
  }
}

// Generic fetch wrapper with error handling
async function fetchAPI<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new DemoAPIError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        endpoint
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof DemoAPIError) {
      throw error;
    }

    // Network or parsing error
    throw new DemoAPIError(
      `Failed to fetch from ${endpoint}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      endpoint
    );
  }
}

// Fetch wrapper with automatic fallback to mock data when backend is unreachable
// This allows Figma preview to render populated screens even without backend access
export let demoModeActive = false;

export function getDemoModeActive() {
  return demoModeActive;
}

async function fetchWithFallback<T>(
  endpoint: string,
  mockData: T | null,
  delayMs: number = 300
): Promise<T> {
  try {
    // Try real backend first
    const res = await fetchAPI<T>(endpoint);
    if (demoModeActive) {
      demoModeActive = false;
      window.dispatchEvent(new CustomEvent('demo-mode-changed', { detail: false }));
    }
    return res;
  } catch (error) {
    // If backend is unreachable (network error, connection refused, etc.),
    // fall back to mock data so Figma preview renders populated screens
    console.warn(`Backend unreachable at ${endpoint}, using mock data fallback`);
    
    if (!demoModeActive) {
      demoModeActive = true;
      window.dispatchEvent(new CustomEvent('demo-mode-changed', { detail: true }));
    }
    
    await delay(delayMs); // Simulate network delay for consistency
    
    if (!mockData) {
      throw new DemoAPIError("Demo data unavailable. Please connect to a real backend or provide mock data.", 503, endpoint);
    }
    
    return mockData;
  }
}

// Mock data delay to simulate network latency
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Import mock data
import {
  mockCandidate,
  mockHCV,
  mockDashboard,
  mockMatches,
  mockApplications,
  mockInterviews,
  mockEmployer,
  mockSettings,
} from './mockData';

// API endpoint functions

export const demoApi = {
  /**
   * Get candidate identity and profile metadata
   */
  async getCandidate(): Promise<CandidateIdentity> {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockCandidate;
    }
    return fetchWithFallback('/demo/candidate', mockCandidate, 300);
  },

  /**
   * Get Human Competency Vector summary and evidence
   */
  async getHCV(): Promise<HCVResponse> {
    if (USE_MOCK_DATA) {
      await delay(400);
      return mockHCV;
    }
    return fetchWithFallback('/demo/hcv', mockHCV, 400);
  },

  /**
   * Get dashboard overview with next actions and summaries
   */
  async getDashboard(): Promise<DashboardResponse> {
    if (USE_MOCK_DATA) {
      await delay(350);
      return mockDashboard;
    }
    return fetchWithFallback('/demo/dashboard', mockDashboard, 350);
  },

  /**
   * Get candidate match list
   */
  async getMatches(): Promise<MatchesResponse> {
    if (USE_MOCK_DATA) {
      await delay(320);
      return mockMatches;
    }
    return fetchWithFallback('/demo/matches', mockMatches, 320);
  },

  /**
   * Get application stages and cards
   */
  async getApplications(): Promise<ApplicationsResponse> {
    if (USE_MOCK_DATA) {
      await delay(280);
      return mockApplications;
    }
    return fetchWithFallback('/demo/applications', mockApplications, 280);
  },

  /**
   * Get upcoming and past interviews
   */
  async getInterviews(): Promise<InterviewsResponse> {
    if (USE_MOCK_DATA) {
      await delay(310);
      return mockInterviews;
    }
    return fetchWithFallback('/demo/interviews', mockInterviews, 310);
  },

  /**
   * Get employer dashboard data
   */
  async getEmployer(): Promise<EmployerResponse> {
    if (USE_MOCK_DATA) {
      await delay(380);
      return mockEmployer;
    }
    return fetchWithFallback('/demo/employer', mockEmployer, 380);
  },

  /**
   * Get settings and privacy controls
   */
  async getSettings(): Promise<SettingsResponse> {
    if (USE_MOCK_DATA) {
      await delay(290);
      return mockSettings;
    }
    return fetchWithFallback('/demo/settings', mockSettings, 290);
  },
};