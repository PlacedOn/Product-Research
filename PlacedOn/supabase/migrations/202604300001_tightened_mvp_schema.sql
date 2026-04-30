-- Tightened PlacedOn MVP schema.
-- Supabase/Postgres owns persistence; FastAPI owns privacy filtering,
-- score normalization, and frontend read-model assembly.
--
-- Privacy notes:
-- - Raw transcript rows are not employer-facing.
-- - Employers only receive profile_evidence_snippets.display_text and ai_summary.
-- - Raw profile embeddings and job vectors are backend-only.
-- - Candidate identity markers and accommodations are separated from AoT state.
-- - Candidate private notes are never visible to employers.

create extension if not exists pgcrypto;
create extension if not exists vector;

create table public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email text not null unique,
  user_type text not null check (user_type in ('candidate', 'employer', 'admin')),
  terms_accepted_at timestamptz,
  privacy_accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.candidates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  full_name text,
  phone text,
  location_city text,
  location_country text,
  timezone text,
  target_roles jsonb not null default '[]'::jsonb,
  experience_years numeric(4,1),
  availability_status text,
  work_mode_preferences jsonb not null default '{}'::jsonb,
  visibility_status text not null default 'private' check (visibility_status in ('private', 'anonymous', 'limited', 'matched_only', 'public')),
  profile_status text not null default 'not_started' check (profile_status in ('not_started', 'interview_pending', 'generating', 'published', 'paused')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.competency_dimensions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key in (
    'technical_execution',
    'problem_solving',
    'communication',
    'collaboration',
    'ownership',
    'learning_velocity',
    'ambiguity_tolerance',
    'product_judgment',
    'leadership',
    'customer_empathy'
  )),
  label text not null,
  category text not null check (category in ('technical', 'behavioral', 'role_specific')),
  description text not null,
  applies_to_roles jsonb not null default '[]'::jsonb,
  is_core boolean not null default true,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.competency_dimensions
  (key, label, category, description, applies_to_roles, is_core, active)
values
  ('technical_execution', 'Technical Execution', 'technical', 'Ability to turn technical requirements into reliable, maintainable implementation.', '["engineering", "data", "product"]'::jsonb, true, true),
  ('problem_solving', 'Problem Solving', 'technical', 'Ability to frame ambiguous problems, evaluate tradeoffs, and reach practical decisions.', '["engineering", "product", "operations"]'::jsonb, true, true),
  ('communication', 'Communication', 'behavioral', 'Clarity, structure, and audience awareness in written and spoken collaboration.', '["all"]'::jsonb, true, true),
  ('collaboration', 'Collaboration', 'behavioral', 'Ability to work across functions, incorporate feedback, and move shared work forward.', '["all"]'::jsonb, true, true),
  ('ownership', 'Ownership', 'behavioral', 'Accountability for outcomes, follow-through, and handling issues without avoidance.', '["all"]'::jsonb, true, true),
  ('learning_velocity', 'Learning Velocity', 'behavioral', 'Speed and quality of learning from new information, feedback, and unfamiliar domains.', '["all"]'::jsonb, true, true),
  ('ambiguity_tolerance', 'Ambiguity Tolerance', 'behavioral', 'Ability to act responsibly when goals, constraints, or evidence are incomplete.', '["all"]'::jsonb, true, true),
  ('product_judgment', 'Product Judgment', 'role_specific', 'Ability to reason about user value, product tradeoffs, and business context.', '["product", "engineering", "design"]'::jsonb, false, true),
  ('leadership', 'Leadership', 'behavioral', 'Ability to create direction, raise standards, and influence outcomes through others.', '["management", "senior", "all"]'::jsonb, false, true),
  ('customer_empathy', 'Customer Empathy', 'role_specific', 'Ability to understand customer context and make user-centered decisions.', '["product", "design", "sales", "support"]'::jsonb, false, true)
on conflict (key) do update
set
  label = excluded.label,
  category = excluded.category,
  description = excluded.description,
  applies_to_roles = excluded.applies_to_roles,
  is_core = excluded.is_core,
  active = excluded.active;

create table public.assessment_role_catalog (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  role_family text not null,
  seniority text,
  target_competency_keys jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.interviews (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  target_role text not null,
  mode text not null default 'text' check (mode in ('text', 'voice')),
  status text not null default 'scheduled' check (status in ('scheduled', 'in_progress', 'completed', 'abandoned', 'failed')),
  started_at timestamptz,
  completed_at timestamptz,
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  turn_count integer not null default 0 check (turn_count >= 0),
  segments_completed integer not null default 0 check (segments_completed >= 0),
  completion_reason text,
  latest_trust_score numeric(4,3) check (latest_trust_score is null or latest_trust_score between 0.0 and 1.0),
  anomaly_flag boolean not null default false,
  avg_confidence numeric(4,3) check (avg_confidence is null or avg_confidence between 0.0 and 1.0),
  skill_coverage numeric(4,3) check (skill_coverage is null or skill_coverage between 0.0 and 1.0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.interview_turns (
  id uuid primary key default gen_random_uuid(),
  interview_id uuid not null references public.interviews(id) on delete cascade,
  turn_index integer not null check (turn_index >= 0),
  phase text not null check (phase in ('opening', 'situational', 'depth_probe', 'close')),
  mode text not null check (mode in ('new', 'probe', 'retry')),
  target_skill text,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  raw_question text,
  safe_question text not null,
  used_guardrail_fallback boolean not null default false,
  candidate_answer_text text,
  answer_excerpt text,
  off_record_requested boolean not null default false,
  created_at timestamptz not null default now(),
  unique (interview_id, turn_index)
);

create table public.interview_state_snapshots (
  id uuid primary key default gen_random_uuid(),
  interview_id uuid not null references public.interviews(id) on delete cascade,
  turn_id uuid references public.interview_turns(id) on delete set null,
  state_version integer not null check (state_version >= 1),
  previous_state_json jsonb not null default '{}'::jsonb,
  proposed_state_json jsonb not null default '{}'::jsonb,
  accepted_state_json jsonb not null default '{}'::jsonb,
  skill_vector jsonb not null default '{}'::jsonb,
  sigma2 jsonb not null default '{}'::jsonb,
  current_skill text,
  current_difficulty text check (current_difficulty is null or current_difficulty in ('easy', 'medium', 'hard')),
  assessed_goals jsonb not null default '[]'::jsonb,
  remaining_goals jsonb not null default '[]'::jsonb,
  new_observations jsonb not null default '[]'::jsonb,
  atomic_traits_identified jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.interview_decomposition_steps (
  id uuid primary key default gen_random_uuid(),
  interview_id uuid not null references public.interviews(id) on delete cascade,
  turn_id uuid references public.interview_turns(id) on delete cascade,
  step_index integer not null default 0 check (step_index >= 0),
  prompt_contract jsonb not null default '{}'::jsonb,
  decomposition_json jsonb not null default '{}'::jsonb,
  selected_goal text,
  created_at timestamptz not null default now()
);

create table public.interview_judge_results (
  id uuid primary key default gen_random_uuid(),
  interview_id uuid not null references public.interviews(id) on delete cascade,
  turn_id uuid references public.interview_turns(id) on delete cascade,
  judge_model text,
  rubric_json jsonb not null default '{}'::jsonb,
  scores jsonb not null default '{}'::jsonb,
  confidence numeric(4,3) check (confidence is null or confidence between 0.0 and 1.0),
  uncertainty numeric(4,3) check (uncertainty is null or uncertainty between 0.0 and 1.0),
  rationale text,
  created_at timestamptz not null default now()
);

create table public.interview_consensus_checks (
  id uuid primary key default gen_random_uuid(),
  interview_id uuid not null references public.interviews(id) on delete cascade,
  turn_id uuid references public.interview_turns(id) on delete cascade,
  judge_result_ids jsonb not null default '[]'::jsonb,
  agreement_score numeric(4,3) check (agreement_score is null or agreement_score between 0.0 and 1.0),
  consensus_status text not null default 'pending' check (consensus_status in ('pending', 'accepted', 'needs_review', 'rejected')),
  notes text,
  created_at timestamptz not null default now()
);

create table public.interview_bias_checks (
  id uuid primary key default gen_random_uuid(),
  interview_id uuid references public.interviews(id) on delete cascade,
  turn_id uuid references public.interview_turns(id) on delete cascade,
  checked_text text not null,
  risk_level text not null check (risk_level in ('none', 'low', 'medium', 'high', 'blocked')),
  flagged_categories jsonb not null default '[]'::jsonb,
  mitigation text,
  passed boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.interview_integrity_checks (
  id uuid primary key default gen_random_uuid(),
  interview_id uuid not null references public.interviews(id) on delete cascade,
  turn_id uuid references public.interview_turns(id) on delete cascade,
  trust_score numeric(4,3) not null check (trust_score between 0.0 and 1.0),
  anomaly_flag boolean not null default false,
  signals jsonb not null default '{}'::jsonb,
  action_taken text,
  created_at timestamptz not null default now()
);

create table public.interview_turn_analysis (
  id uuid primary key default gen_random_uuid(),
  interview_id uuid not null references public.interviews(id) on delete cascade,
  turn_id uuid not null references public.interview_turns(id) on delete cascade,
  extracted_skills jsonb not null default '[]'::jsonb,
  extracted_traits jsonb not null default '[]'::jsonb,
  evidence_candidates jsonb not null default '[]'::jsonb,
  turn_embedding vector(384),
  embedding_model text,
  embedding_generated_at timestamptz,
  created_at timestamptz not null default now(),
  unique (turn_id)
);

create table public.interview_workspace_artifacts (
  id uuid primary key default gen_random_uuid(),
  interview_id uuid not null references public.interviews(id) on delete cascade,
  turn_id uuid references public.interview_turns(id) on delete cascade,
  artifact_type text not null check (artifact_type in ('whiteboard', 'code', 'diagram', 'file', 'link')),
  title text,
  content_text text,
  content_json jsonb not null default '{}'::jsonb,
  storage_path text,
  visibility text not null default 'candidate_only' check (visibility in ('candidate_only', 'employer_limited', 'employer_matched')),
  created_at timestamptz not null default now()
);

create table public.interview_session_events (
  id uuid primary key default gen_random_uuid(),
  interview_id uuid not null references public.interviews(id) on delete cascade,
  turn_id uuid references public.interview_turns(id) on delete set null,
  event_type text not null,
  event_payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create table public.candidate_profile_versions (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  source_interview_id uuid references public.interviews(id) on delete set null,
  target_role text not null,
  headline text,
  summary text,
  overall_confidence numeric(4,3) check (overall_confidence is null or overall_confidence between 0.0 and 1.0),
  overall_uncertainty numeric(4,3) check (overall_uncertainty is null or overall_uncertainty between 0.0 and 1.0),
  profile_embedding vector(384),
  embedding_model text,
  embedding_generated_at timestamptz,
  generation_status text not null default 'pending' check (generation_status in ('pending', 'generating', 'complete', 'failed')),
  status text not null default 'draft' check (status in ('draft', 'candidate_review', 'published', 'archived')),
  share_url text,
  generated_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.candidate_atomic_traits (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.candidate_profile_versions(id) on delete cascade,
  dimension_id uuid not null references public.competency_dimensions(id),
  trait_text text not null,
  score numeric(4,3) not null check (score between 0.0 and 1.0),
  confidence numeric(4,3) not null check (confidence between 0.0 and 1.0),
  uncertainty numeric(4,3) not null check (uncertainty between 0.0 and 1.0),
  signal_strength text not null check (signal_strength in ('weak', 'moderate', 'strong')),
  rank_order integer not null default 0 check (rank_order >= 0),
  low_evidence_reason text,
  created_at timestamptz not null default now()
);

create table public.profile_evidence_snippets (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  profile_id uuid not null references public.candidate_profile_versions(id) on delete cascade,
  atomic_trait_id uuid references public.candidate_atomic_traits(id) on delete cascade,
  interview_id uuid references public.interviews(id) on delete set null,
  turn_id uuid references public.interview_turns(id) on delete set null,
  source_text text,
  display_text text not null,
  ai_summary text not null,
  visibility text not null default 'candidate_only' check (visibility in ('candidate_only', 'employer_limited', 'employer_matched')),
  redaction_status text not null default 'not_needed' check (redaction_status in ('not_needed', 'redacted', 'blocked')),
  bias_check_id uuid references public.interview_bias_checks(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.interview_consents (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  interview_id uuid references public.interviews(id) on delete cascade,
  consent_type text not null,
  accepted boolean not null,
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.candidate_accommodations (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  accommodation_type text not null,
  description text,
  visibility text not null default 'candidate_only' check (visibility in ('candidate_only', 'platform_support')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.interview_readiness_checks (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  interview_id uuid references public.interviews(id) on delete set null,
  check_payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'passed', 'failed', 'skipped')),
  created_at timestamptz not null default now()
);

create table public.candidate_dashboard_snapshots (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  profile_id uuid references public.candidate_profile_versions(id) on delete set null,
  snapshot_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.next_best_actions (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  action_type text not null,
  title text not null,
  description text,
  cta_label text,
  cta_route text,
  priority text not null default 'medium' check (priority in ('high', 'medium', 'low')),
  status text not null default 'open' check (status in ('open', 'completed', 'dismissed')),
  due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.candidate_role_alignment (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  role_catalog_id uuid references public.assessment_role_catalog(id) on delete set null,
  alignment_score numeric(4,3) check (alignment_score is null or alignment_score between 0.0 and 1.0),
  strengths jsonb not null default '[]'::jsonb,
  gaps jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.candidate_profile_validation (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  profile_id uuid not null references public.candidate_profile_versions(id) on delete cascade,
  validation_status text not null default 'pending' check (validation_status in ('pending', 'accepted', 'requested_changes', 'blocked')),
  validation_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.candidate_profile_notes (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  profile_id uuid references public.candidate_profile_versions(id) on delete cascade,
  note_text text not null,
  visibility text not null default 'private' check (visibility in ('private', 'candidate_support')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.candidate_availability_history (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  availability_status text not null,
  effective_from timestamptz not null default now(),
  effective_to timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

create table public.candidate_education (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  institution text not null,
  degree text,
  field_of_study text,
  start_year integer,
  end_year integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.candidate_achievements (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  title text not null,
  description text,
  evidence_url text,
  occurred_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.candidate_settings (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null unique references public.candidates(id) on delete cascade,
  notification_settings jsonb not null default '{}'::jsonb,
  privacy_settings jsonb not null default '{}'::jsonb,
  matching_settings jsonb not null default '{}'::jsonb,
  accessibility_settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.scheduled_interviews (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  interview_id uuid references public.interviews(id) on delete set null,
  scheduled_for timestamptz not null,
  duration_minutes integer not null default 45 check (duration_minutes > 0),
  join_url text,
  status text not null default 'scheduled' check (status in ('scheduled', 'rescheduled', 'completed', 'cancelled', 'missed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.interview_prep_notes (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  scheduled_interview_id uuid references public.scheduled_interviews(id) on delete cascade,
  title text not null,
  note_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.company_specific_challenges (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  company_name text not null,
  target_role text not null,
  challenge_payload jsonb not null default '{}'::jsonb,
  status text not null default 'available' check (status in ('available', 'started', 'submitted', 'reviewed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.employers (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  company_slug text not null unique,
  website text,
  industry text,
  company_size text,
  headquarters_city text,
  headquarters_country text,
  plan_name text,
  billing_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.employer_users (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.employers(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  full_name text,
  role text not null check (role in ('owner', 'admin', 'recruiter', 'hiring_manager', 'reviewer')),
  timezone text,
  status text not null default 'invited' check (status in ('invited', 'active', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (employer_id, user_id)
);

create table public.job_listings (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.employers(id) on delete cascade,
  source_job_id text,
  title text not null,
  department text,
  team text,
  level text,
  employment_type text,
  openings integer not null default 1 check (openings > 0),
  hiring_priority text,
  recruiter_owner_user_id uuid references public.employer_users(id) on delete set null,
  hiring_manager_user_id uuid references public.employer_users(id) on delete set null,
  collaborator_user_ids jsonb not null default '[]'::jsonb,
  country text,
  city text,
  work_mode text,
  timezone text,
  relocation_support boolean not null default false,
  visa_sponsorship boolean not null default false,
  office_days integer check (office_days is null or office_days between 0 and 7),
  public_job_description text,
  responsibilities jsonb not null default '[]'::jsonb,
  success_in_90_days text,
  required_qualifications jsonb not null default '[]'::jsonb,
  preferred_qualifications jsonb not null default '[]'::jsonb,
  interview_process text,
  company_pitch text,
  status text not null default 'draft',
  posted_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.job_compensation (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null unique references public.job_listings(id) on delete cascade,
  currency text not null default 'USD',
  min_amount integer,
  max_amount integer,
  period text not null default 'year' check (period in ('hour', 'month', 'year')),
  equity_range text,
  bonus_range text,
  visible_to_candidates boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (min_amount is null or max_amount is null or min_amount <= max_amount)
);

create table public.job_matching_criteria (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null unique references public.job_listings(id) on delete cascade,
  required_skills jsonb not null default '[]'::jsonb,
  preferred_skills jsonb not null default '[]'::jsonb,
  competency_weights jsonb not null default '{}'::jsonb,
  knockout_criteria jsonb not null default '[]'::jsonb,
  location_rules jsonb not null default '{}'::jsonb,
  work_authorization_rules jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.job_role_calibrations (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.job_listings(id) on delete cascade,
  calibrated_by_user_id uuid references public.employer_users(id) on delete set null,
  role_vector vector(384),
  embedding_model text,
  calibration_notes text,
  calibration_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.job_pipeline_stage_config (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.job_listings(id) on delete cascade,
  stage text not null,
  display_order integer not null,
  sla_days integer,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, stage)
);

create table public.job_role_dashboard_stats (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.job_listings(id) on delete cascade,
  stats_date date not null default current_date,
  open_pipeline_count integer not null default 0,
  strong_match_count integer not null default 0,
  intro_requested_count integer not null default 0,
  offer_count integer not null default 0,
  stats_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (job_id, stats_date)
);

create table public.job_status_history (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.job_listings(id) on delete cascade,
  previous_status text,
  new_status text not null,
  changed_by_user_id uuid references public.employer_users(id) on delete set null,
  reason text,
  created_at timestamptz not null default now()
);

create table public.candidate_job_matches (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  profile_id uuid references public.candidate_profile_versions(id) on delete set null,
  job_id uuid not null references public.job_listings(id) on delete cascade,
  employer_id uuid not null references public.employers(id) on delete cascade,
  fit_score integer not null check (fit_score between 0 and 100),
  match_label text not null check (match_label in ('weak', 'possible', 'good', 'strong')),
  why_matched text not null,
  main_uncertainty text,
  score_breakdown jsonb not null default '{}'::jsonb,
  source text not null check (source in ('application', 'recommendation', 'employer_search')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (candidate_id, job_id)
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  job_id uuid not null references public.job_listings(id) on delete cascade,
  match_id uuid references public.candidate_job_matches(id) on delete set null,
  status text not null default 'applied' check (status in ('applied', 'reviewing', 'interest', 'follow_up', 'interviewing', 'offer', 'closed')),
  applied_at timestamptz not null default now(),
  last_updated_at timestamptz not null default now(),
  unique (candidate_id, job_id)
);

create table public.pipeline_items (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.employers(id) on delete cascade,
  job_id uuid not null references public.job_listings(id) on delete cascade,
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  match_id uuid references public.candidate_job_matches(id) on delete set null,
  stage text not null check (stage in ('new', 'reviewed', 'shortlisted', 'hiring_manager_review', 'intro_requested', 'candidate_accepted', 'interviewing', 'offer', 'hired', 'rejected')),
  owner_user_id uuid references public.employer_users(id) on delete set null,
  last_activity_at timestamptz not null default now(),
  next_action text,
  age_in_stage_days integer not null default 0 check (age_in_stage_days >= 0),
  sla_status text not null default 'on_time' check (sla_status in ('on_time', 'approaching', 'overdue')),
  notes text,
  rejection_reason text,
  rejection_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, candidate_id)
);

create table public.candidate_match_actions (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  match_id uuid not null references public.candidate_job_matches(id) on delete cascade,
  action_type text not null,
  action_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.application_stage_history (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  previous_status text,
  new_status text not null,
  changed_by_user_id uuid references public.users(id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

create table public.application_evidence_links (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  evidence_snippet_id uuid not null references public.profile_evidence_snippets(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (application_id, evidence_snippet_id)
);

create table public.intro_requests (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.employers(id) on delete cascade,
  job_id uuid references public.job_listings(id) on delete cascade,
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  match_id uuid references public.candidate_job_matches(id) on delete set null,
  requested_by_user_id uuid references public.employer_users(id) on delete set null,
  status text not null default 'requested' check (status in ('requested', 'candidate_accepted', 'candidate_declined', 'expired', 'cancelled')),
  candidate_response_note text,
  requested_at timestamptz not null default now(),
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.saved_candidates (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.employers(id) on delete cascade,
  job_id uuid references public.job_listings(id) on delete cascade,
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  saved_by_user_id uuid references public.employer_users(id) on delete set null,
  match_id uuid references public.candidate_job_matches(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (employer_id, job_id, candidate_id)
);

create table public.pipeline_stage_history (
  id uuid primary key default gen_random_uuid(),
  pipeline_item_id uuid not null references public.pipeline_items(id) on delete cascade,
  previous_stage text,
  new_stage text not null,
  changed_by_user_id uuid references public.employer_users(id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

create table public.candidate_tags (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.employers(id) on delete cascade,
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  tag text not null,
  created_by_user_id uuid references public.employer_users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (employer_id, candidate_id, tag)
);

create table public.candidate_owner_assignments (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.employers(id) on delete cascade,
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  owner_user_id uuid not null references public.employer_users(id) on delete cascade,
  assigned_by_user_id uuid references public.employer_users(id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.employer_candidate_notes (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.employers(id) on delete cascade,
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  job_id uuid references public.job_listings(id) on delete cascade,
  author_user_id uuid references public.employer_users(id) on delete set null,
  note_text text not null,
  visibility text not null default 'employer_private' check (visibility in ('employer_private', 'hiring_team')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.employer_candidate_actions (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.employers(id) on delete cascade,
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  job_id uuid references public.job_listings(id) on delete cascade,
  actor_user_id uuid references public.employer_users(id) on delete set null,
  action_type text not null,
  action_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.candidate_comparison_sets (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.employers(id) on delete cascade,
  job_id uuid references public.job_listings(id) on delete cascade,
  created_by_user_id uuid references public.employer_users(id) on delete set null,
  title text not null,
  candidate_ids jsonb not null default '[]'::jsonb,
  comparison_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_candidate_profile_versions_candidate_status
  on public.candidate_profile_versions(candidate_id, status);

create index idx_candidate_profile_versions_embedding_hnsw
  on public.candidate_profile_versions
  using hnsw (profile_embedding vector_cosine_ops)
  where profile_embedding is not null;

create index idx_job_role_calibrations_role_vector_hnsw
  on public.job_role_calibrations
  using hnsw (role_vector vector_cosine_ops)
  where role_vector is not null;

create index idx_interviews_candidate_status
  on public.interviews(candidate_id, status);

create index idx_interview_turns_interview_turn_index
  on public.interview_turns(interview_id, turn_index);

create index idx_profile_evidence_profile_trait_visibility
  on public.profile_evidence_snippets(profile_id, atomic_trait_id, visibility);

create index idx_candidate_job_matches_job_fit
  on public.candidate_job_matches(job_id, fit_score desc);

create index idx_pipeline_items_job_stage_activity
  on public.pipeline_items(job_id, stage, last_activity_at);

create index idx_candidate_settings_privacy_gin
  on public.candidate_settings using gin (privacy_settings);

create index idx_candidate_settings_matching_gin
  on public.candidate_settings using gin (matching_settings);

create index idx_candidate_job_matches_score_breakdown_gin
  on public.candidate_job_matches using gin (score_breakdown);

create index idx_job_matching_criteria_required_skills_gin
  on public.job_matching_criteria using gin (required_skills);

create index idx_job_matching_criteria_preferred_skills_gin
  on public.job_matching_criteria using gin (preferred_skills);

create index idx_job_matching_criteria_competency_weights_gin
  on public.job_matching_criteria using gin (competency_weights);

create index idx_interview_state_snapshots_skill_vector_gin
  on public.interview_state_snapshots using gin (skill_vector);

create index idx_interview_turn_analysis_extracted_traits_gin
  on public.interview_turn_analysis using gin (extracted_traits);

create index idx_candidates_target_roles_gin
  on public.candidates using gin (target_roles);
