// Mock data for demo API endpoints, sourced from the lively seed dataset.
// Re-exports the candidate_api section of the seed JSON, casting to the
// types declared in ./demoApi so consumer call sites continue to type-check.

import candidateSeed from '../../imports/placedon_lively_seed_candidate.json';

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

const api = (candidateSeed as any).candidate_api;

export const mockCandidate: CandidateIdentity = api.candidate as CandidateIdentity;
export const mockHCV: HCVResponse = api.hcv as HCVResponse;
export const mockDashboard: DashboardResponse = api.dashboard as DashboardResponse;
export const mockMatches: MatchesResponse = api.matches as MatchesResponse;
export const mockApplications: ApplicationsResponse = api.applications as ApplicationsResponse;
export const mockInterviews: InterviewsResponse = api.interviews as InterviewsResponse;
export const mockSettings: SettingsResponse = api.settings as SettingsResponse;

export const mockEmployer: EmployerResponse = (candidateSeed as any).legacy_employer_api as EmployerResponse;
