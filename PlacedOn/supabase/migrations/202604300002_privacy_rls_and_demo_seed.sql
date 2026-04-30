-- Privacy enforcement and minimal demo graph for PlacedOn MVP.
-- FastAPI should use service-role access for backend-only assembly. Direct
-- authenticated access is constrained here so raw transcripts, private notes,
-- accommodations, and vector columns are not exposed to employer/front-end roles.

create or replace function public.current_app_user_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from public.users
  where auth_user_id = auth.uid()
  limit 1
$$;

create or replace function public.current_candidate_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from public.candidates
  where user_id = public.current_app_user_id()
  limit 1
$$;

create or replace function public.is_candidate_owner(target_candidate_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.candidates c
    where c.id = target_candidate_id
      and c.user_id = public.current_app_user_id()
  )
$$;

create or replace function public.is_employer_member(target_employer_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.employer_users eu
    where eu.employer_id = target_employer_id
      and eu.user_id = public.current_app_user_id()
      and eu.status = 'active'
  )
$$;

grant execute on function public.current_app_user_id() to authenticated;
grant execute on function public.current_candidate_id() to authenticated;
grant execute on function public.is_candidate_owner(uuid) to authenticated;
grant execute on function public.is_employer_member(uuid) to authenticated;

alter table public.users enable row level security;
alter table public.candidates enable row level security;
alter table public.interviews enable row level security;
alter table public.interview_turns enable row level security;
alter table public.interview_state_snapshots enable row level security;
alter table public.interview_decomposition_steps enable row level security;
alter table public.interview_judge_results enable row level security;
alter table public.interview_consensus_checks enable row level security;
alter table public.interview_bias_checks enable row level security;
alter table public.interview_integrity_checks enable row level security;
alter table public.interview_turn_analysis enable row level security;
alter table public.interview_workspace_artifacts enable row level security;
alter table public.interview_session_events enable row level security;
alter table public.candidate_profile_versions enable row level security;
alter table public.candidate_atomic_traits enable row level security;
alter table public.profile_evidence_snippets enable row level security;
alter table public.interview_consents enable row level security;
alter table public.candidate_accommodations enable row level security;
alter table public.interview_readiness_checks enable row level security;
alter table public.candidate_dashboard_snapshots enable row level security;
alter table public.next_best_actions enable row level security;
alter table public.candidate_role_alignment enable row level security;
alter table public.candidate_profile_validation enable row level security;
alter table public.candidate_profile_notes enable row level security;
alter table public.candidate_availability_history enable row level security;
alter table public.candidate_education enable row level security;
alter table public.candidate_achievements enable row level security;
alter table public.candidate_settings enable row level security;
alter table public.scheduled_interviews enable row level security;
alter table public.interview_prep_notes enable row level security;
alter table public.company_specific_challenges enable row level security;
alter table public.employers enable row level security;
alter table public.employer_users enable row level security;
alter table public.job_listings enable row level security;
alter table public.job_compensation enable row level security;
alter table public.job_matching_criteria enable row level security;
alter table public.job_role_calibrations enable row level security;
alter table public.job_pipeline_stage_config enable row level security;
alter table public.job_role_dashboard_stats enable row level security;
alter table public.job_status_history enable row level security;
alter table public.candidate_job_matches enable row level security;
alter table public.applications enable row level security;
alter table public.pipeline_items enable row level security;
alter table public.candidate_match_actions enable row level security;
alter table public.application_stage_history enable row level security;
alter table public.application_evidence_links enable row level security;
alter table public.intro_requests enable row level security;
alter table public.saved_candidates enable row level security;
alter table public.pipeline_stage_history enable row level security;
alter table public.candidate_tags enable row level security;
alter table public.candidate_owner_assignments enable row level security;
alter table public.employer_candidate_notes enable row level security;
alter table public.employer_candidate_actions enable row level security;
alter table public.candidate_comparison_sets enable row level security;

revoke select (profile_embedding) on public.candidate_profile_versions from anon, authenticated;
revoke select (role_vector) on public.job_role_calibrations from anon, authenticated;
revoke select (turn_embedding) on public.interview_turn_analysis from anon, authenticated;
revoke select (source_text) on public.profile_evidence_snippets from anon, authenticated;
revoke select (raw_question, candidate_answer_text) on public.interview_turns from anon, authenticated;

create policy "users read own row"
on public.users
for select
to authenticated
using (auth_user_id = auth.uid());

create policy "candidates read own row"
on public.candidates
for select
to authenticated
using (public.is_candidate_owner(id));

create policy "candidates update own row"
on public.candidates
for update
to authenticated
using (public.is_candidate_owner(id))
with check (public.is_candidate_owner(id));

create policy "candidate interviews read own"
on public.interviews
for select
to authenticated
using (public.is_candidate_owner(candidate_id));

create policy "candidate turns read own"
on public.interview_turns
for select
to authenticated
using (
  exists (
    select 1
    from public.interviews i
    where i.id = interview_id
      and public.is_candidate_owner(i.candidate_id)
  )
);

create policy "candidate snapshots read own"
on public.interview_state_snapshots
for select
to authenticated
using (
  exists (
    select 1
    from public.interviews i
    where i.id = interview_id
      and public.is_candidate_owner(i.candidate_id)
  )
);

create policy "candidate interview analysis read own"
on public.interview_turn_analysis
for select
to authenticated
using (
  exists (
    select 1
    from public.interviews i
    where i.id = interview_id
      and public.is_candidate_owner(i.candidate_id)
  )
);

create policy "candidate interview artifacts read own"
on public.interview_workspace_artifacts
for select
to authenticated
using (
  exists (
    select 1
    from public.interviews i
    where i.id = interview_id
      and public.is_candidate_owner(i.candidate_id)
  )
);

create policy "candidate profile versions read own"
on public.candidate_profile_versions
for select
to authenticated
using (public.is_candidate_owner(candidate_id));

create policy "employers read matched published profiles"
on public.candidate_profile_versions
for select
to authenticated
using (
  status = 'published'
  and exists (
    select 1
    from public.candidate_job_matches m
    where m.profile_id = id
      and public.is_employer_member(m.employer_id)
  )
);

create policy "candidate traits read own"
on public.candidate_atomic_traits
for select
to authenticated
using (
  exists (
    select 1
    from public.candidate_profile_versions p
    where p.id = profile_id
      and public.is_candidate_owner(p.candidate_id)
  )
);

create policy "employers read matched traits"
on public.candidate_atomic_traits
for select
to authenticated
using (
  exists (
    select 1
    from public.candidate_profile_versions p
    join public.candidate_job_matches m on m.profile_id = p.id
    where p.id = profile_id
      and p.status = 'published'
      and public.is_employer_member(m.employer_id)
  )
);

create policy "candidate evidence read own"
on public.profile_evidence_snippets
for select
to authenticated
using (public.is_candidate_owner(candidate_id));

create policy "employers read safe matched evidence"
on public.profile_evidence_snippets
for select
to authenticated
using (
  visibility in ('employer_limited', 'employer_matched')
  and redaction_status <> 'blocked'
  and bias_check_id is not null
  and exists (
    select 1
    from public.candidate_job_matches m
    where m.profile_id = profile_id
      and public.is_employer_member(m.employer_id)
  )
);

create policy "candidate notes read own"
on public.candidate_profile_notes
for select
to authenticated
using (public.is_candidate_owner(candidate_id));

create policy "candidate settings read own"
on public.candidate_settings
for select
to authenticated
using (public.is_candidate_owner(candidate_id));

create policy "candidate dashboard read own"
on public.candidate_dashboard_snapshots
for select
to authenticated
using (public.is_candidate_owner(candidate_id));

create policy "candidate actions read own"
on public.next_best_actions
for select
to authenticated
using (public.is_candidate_owner(candidate_id));

create policy "candidate applications read own"
on public.applications
for select
to authenticated
using (public.is_candidate_owner(candidate_id));

create policy "candidate matches read own"
on public.candidate_job_matches
for select
to authenticated
using (public.is_candidate_owner(candidate_id));

create policy "candidate intro requests read own"
on public.intro_requests
for select
to authenticated
using (public.is_candidate_owner(candidate_id));

create policy "candidate accommodations read own"
on public.candidate_accommodations
for select
to authenticated
using (public.is_candidate_owner(candidate_id));

create policy "employer users read memberships"
on public.employer_users
for select
to authenticated
using (public.is_employer_member(employer_id) or user_id = public.current_app_user_id());

create policy "employers read own company"
on public.employers
for select
to authenticated
using (public.is_employer_member(id));

create policy "employers read own jobs"
on public.job_listings
for select
to authenticated
using (public.is_employer_member(employer_id));

create policy "employers manage own jobs"
on public.job_listings
for all
to authenticated
using (public.is_employer_member(employer_id))
with check (public.is_employer_member(employer_id));

create policy "employers read job compensation"
on public.job_compensation
for select
to authenticated
using (
  exists (
    select 1
    from public.job_listings j
    where j.id = job_id
      and public.is_employer_member(j.employer_id)
  )
);

create policy "employers read matching criteria"
on public.job_matching_criteria
for select
to authenticated
using (
  exists (
    select 1
    from public.job_listings j
    where j.id = job_id
      and public.is_employer_member(j.employer_id)
  )
);

create policy "employers read role calibrations"
on public.job_role_calibrations
for select
to authenticated
using (
  exists (
    select 1
    from public.job_listings j
    where j.id = job_id
      and public.is_employer_member(j.employer_id)
  )
);

create policy "employers read matches"
on public.candidate_job_matches
for select
to authenticated
using (public.is_employer_member(employer_id));

create policy "employers read applications"
on public.applications
for select
to authenticated
using (
  exists (
    select 1
    from public.job_listings j
    where j.id = job_id
      and public.is_employer_member(j.employer_id)
  )
);

create policy "employers read pipeline"
on public.pipeline_items
for select
to authenticated
using (public.is_employer_member(employer_id));

create policy "employers manage pipeline"
on public.pipeline_items
for all
to authenticated
using (public.is_employer_member(employer_id))
with check (public.is_employer_member(employer_id));

create policy "employers read intro requests"
on public.intro_requests
for select
to authenticated
using (public.is_employer_member(employer_id));

create policy "employers read saved candidates"
on public.saved_candidates
for select
to authenticated
using (public.is_employer_member(employer_id));

create policy "employers read candidate tags"
on public.candidate_tags
for select
to authenticated
using (public.is_employer_member(employer_id));

create policy "employers read candidate notes"
on public.employer_candidate_notes
for select
to authenticated
using (public.is_employer_member(employer_id));

create policy "employers read candidate actions"
on public.employer_candidate_actions
for select
to authenticated
using (public.is_employer_member(employer_id));

create policy "employers read comparison sets"
on public.candidate_comparison_sets
for select
to authenticated
using (public.is_employer_member(employer_id));

insert into public.users (
  id,
  auth_user_id,
  email,
  user_type,
  terms_accepted_at,
  privacy_accepted_at
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    '11111111-1111-4111-9111-111111111111',
    'demo-candidate-aisha@placedon.ai',
    'candidate',
    now(),
    now()
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    '33333333-3333-4333-9333-333333333333',
    'demo-recruiter@growthcart.example',
    'employer',
    now(),
    now()
  )
on conflict (id) do update
set
  auth_user_id = excluded.auth_user_id,
  email = excluded.email,
  user_type = excluded.user_type,
  terms_accepted_at = excluded.terms_accepted_at,
  privacy_accepted_at = excluded.privacy_accepted_at,
  updated_at = now();

insert into public.candidates (
  id,
  user_id,
  full_name,
  phone,
  location_city,
  location_country,
  timezone,
  target_roles,
  experience_years,
  availability_status,
  work_mode_preferences,
  visibility_status,
  profile_status
)
values (
  '22222222-2222-4222-8222-222222222222',
  '11111111-1111-4111-8111-111111111111',
  'Aisha Sharma',
  '+91-90000-00000',
  'Bengaluru',
  'India',
  'Asia/Kolkata',
  '["Frontend Engineer"]'::jsonb,
  3.5,
  'Available for interviews',
  '{"remote": true, "hybrid": true, "onsite": false}'::jsonb,
  'matched_only',
  'published'
)
on conflict (id) do update
set
  full_name = excluded.full_name,
  phone = excluded.phone,
  location_city = excluded.location_city,
  location_country = excluded.location_country,
  timezone = excluded.timezone,
  target_roles = excluded.target_roles,
  experience_years = excluded.experience_years,
  availability_status = excluded.availability_status,
  work_mode_preferences = excluded.work_mode_preferences,
  visibility_status = excluded.visibility_status,
  profile_status = excluded.profile_status,
  updated_at = now();

insert into public.employers (
  id,
  company_name,
  company_slug,
  website,
  industry,
  company_size,
  headquarters_city,
  headquarters_country,
  plan_name,
  billing_status
)
values (
  '44444444-4444-4444-8444-444444444444',
  'GrowthCart',
  'growthcart',
  'https://growthcart.example',
  'Commerce infrastructure',
  '51-200',
  'Bengaluru',
  'India',
  'mvp_demo',
  'trial'
)
on conflict (id) do update
set
  company_name = excluded.company_name,
  company_slug = excluded.company_slug,
  website = excluded.website,
  industry = excluded.industry,
  company_size = excluded.company_size,
  headquarters_city = excluded.headquarters_city,
  headquarters_country = excluded.headquarters_country,
  plan_name = excluded.plan_name,
  billing_status = excluded.billing_status,
  updated_at = now();

insert into public.employer_users (
  id,
  employer_id,
  user_id,
  full_name,
  role,
  timezone,
  status
)
values (
  '55555555-5555-4555-8555-555555555555',
  '44444444-4444-4444-8444-444444444444',
  '33333333-3333-4333-8333-333333333333',
  'Priya Nair',
  'recruiter',
  'Asia/Kolkata',
  'active'
)
on conflict (id) do update
set
  employer_id = excluded.employer_id,
  user_id = excluded.user_id,
  full_name = excluded.full_name,
  role = excluded.role,
  timezone = excluded.timezone,
  status = excluded.status,
  updated_at = now();

insert into public.interviews (
  id,
  candidate_id,
  target_role,
  mode,
  status,
  started_at,
  completed_at,
  duration_seconds,
  turn_count,
  segments_completed,
  completion_reason,
  latest_trust_score,
  anomaly_flag,
  avg_confidence,
  skill_coverage
)
values (
  '66666666-6666-4666-8666-666666666666',
  '22222222-2222-4222-8222-222222222222',
  'Frontend Engineer',
  'text',
  'completed',
  now() - interval '2 days',
  now() - interval '2 days' + interval '38 minutes',
  2280,
  2,
  4,
  'demo_profile_ready',
  0.94,
  false,
  0.83,
  0.72
)
on conflict (id) do update
set
  status = excluded.status,
  completed_at = excluded.completed_at,
  duration_seconds = excluded.duration_seconds,
  turn_count = excluded.turn_count,
  segments_completed = excluded.segments_completed,
  completion_reason = excluded.completion_reason,
  latest_trust_score = excluded.latest_trust_score,
  anomaly_flag = excluded.anomaly_flag,
  avg_confidence = excluded.avg_confidence,
  skill_coverage = excluded.skill_coverage,
  updated_at = now();

insert into public.interview_turns (
  id,
  interview_id,
  turn_index,
  phase,
  mode,
  target_skill,
  difficulty,
  raw_question,
  safe_question,
  used_guardrail_fallback,
  candidate_answer_text,
  answer_excerpt,
  off_record_requested
)
values
  (
    '77777777-7777-4777-8777-777777777777',
    '66666666-6666-4666-8666-666666666666',
    0,
    'situational',
    'new',
    'technical_execution',
    'medium',
    'Describe a time you improved a fragile frontend system.',
    'Describe a time you improved a fragile frontend system.',
    false,
    'I split a risky checkout migration into reversible steps, added instrumentation, and kept rollback criteria visible to product and QA.',
    'Split a risky checkout migration into reversible steps with instrumentation and rollback criteria.',
    false
  ),
  (
    '77777777-7777-4777-8777-777777777778',
    '66666666-6666-4666-8666-666666666666',
    1,
    'depth_probe',
    'probe',
    'communication',
    'hard',
    'How did you handle disagreement during the rollout?',
    'How did you handle disagreement during the rollout?',
    false,
    'I wrote down the tradeoffs, confirmed the risk tolerance with stakeholders, and proposed a smaller first release.',
    'Clarified tradeoffs, confirmed risk tolerance, and proposed a smaller release.',
    false
  )
on conflict (id) do update
set
  safe_question = excluded.safe_question,
  candidate_answer_text = excluded.candidate_answer_text,
  answer_excerpt = excluded.answer_excerpt,
  used_guardrail_fallback = excluded.used_guardrail_fallback;

insert into public.interview_bias_checks (
  id,
  interview_id,
  turn_id,
  checked_text,
  risk_level,
  flagged_categories,
  mitigation,
  passed
)
values
  (
    '88888888-8888-4888-8888-888888888888',
    '66666666-6666-4666-8666-666666666666',
    '77777777-7777-4777-8777-777777777777',
    'Split a risky checkout migration into reversible steps with instrumentation and rollback criteria.',
    'none',
    '[]'::jsonb,
    null,
    true
  ),
  (
    '88888888-8888-4888-8888-888888888889',
    '66666666-6666-4666-8666-666666666666',
    '77777777-7777-4777-8777-777777777778',
    'Clarified tradeoffs, confirmed risk tolerance, and proposed a smaller release.',
    'none',
    '[]'::jsonb,
    null,
    true
  )
on conflict (id) do update
set
  checked_text = excluded.checked_text,
  risk_level = excluded.risk_level,
  flagged_categories = excluded.flagged_categories,
  mitigation = excluded.mitigation,
  passed = excluded.passed;

insert into public.candidate_profile_versions (
  id,
  candidate_id,
  source_interview_id,
  target_role,
  headline,
  summary,
  overall_confidence,
  overall_uncertainty,
  profile_embedding,
  embedding_model,
  embedding_generated_at,
  generation_status,
  status,
  share_url,
  generated_at,
  published_at
)
values (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '22222222-2222-4222-8222-222222222222',
  '66666666-6666-4666-8666-666666666666',
  'Frontend Engineer',
  'Evidence-backed Frontend Engineer with strong migration and collaboration signals.',
  'Aisha shows strong frontend execution, clear stakeholder communication, and ownership under ambiguity.',
  0.84,
  0.16,
  null,
  'sentence-transformers/all-MiniLM-L6-v2',
  now(),
  'complete',
  'published',
  'https://demo.placedon.ai/profile/aisha-sharma',
  now(),
  now()
)
on conflict (id) do update
set
  headline = excluded.headline,
  summary = excluded.summary,
  overall_confidence = excluded.overall_confidence,
  overall_uncertainty = excluded.overall_uncertainty,
  embedding_model = excluded.embedding_model,
  embedding_generated_at = excluded.embedding_generated_at,
  generation_status = excluded.generation_status,
  status = excluded.status,
  share_url = excluded.share_url,
  generated_at = excluded.generated_at,
  published_at = excluded.published_at,
  updated_at = now();

insert into public.candidate_atomic_traits (
  id,
  profile_id,
  dimension_id,
  trait_text,
  score,
  confidence,
  uncertainty,
  signal_strength,
  rank_order,
  low_evidence_reason
)
values
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    (select id from public.competency_dimensions where key = 'technical_execution'),
    'Plans high-risk frontend migrations as reversible, instrumented releases.',
    0.86,
    0.86,
    0.14,
    'strong',
    1,
    null
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbc',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    (select id from public.competency_dimensions where key = 'communication'),
    'Makes rollout tradeoffs explicit for product, QA, and engineering stakeholders.',
    0.88,
    0.89,
    0.11,
    'strong',
    2,
    null
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbd',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    (select id from public.competency_dimensions where key = 'ownership'),
    'Keeps rollback criteria and risk ownership visible during ambiguous launches.',
    0.82,
    0.81,
    0.19,
    'strong',
    3,
    null
  )
on conflict (id) do update
set
  trait_text = excluded.trait_text,
  score = excluded.score,
  confidence = excluded.confidence,
  uncertainty = excluded.uncertainty,
  signal_strength = excluded.signal_strength,
  rank_order = excluded.rank_order,
  low_evidence_reason = excluded.low_evidence_reason;

insert into public.profile_evidence_snippets (
  id,
  candidate_id,
  profile_id,
  atomic_trait_id,
  interview_id,
  turn_id,
  source_text,
  display_text,
  ai_summary,
  visibility,
  redaction_status,
  bias_check_id
)
values
  (
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    '22222222-2222-4222-8222-222222222222',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    '66666666-6666-4666-8666-666666666666',
    '77777777-7777-4777-8777-777777777777',
    'I split a risky checkout migration into reversible steps, added instrumentation, and kept rollback criteria visible to product and QA.',
    'Split a risky checkout migration into reversible steps with instrumentation and rollback criteria.',
    'Shows practical execution discipline on a high-risk frontend migration.',
    'employer_matched',
    'not_needed',
    '88888888-8888-4888-8888-888888888888'
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-cccccccccccd',
    '22222222-2222-4222-8222-222222222222',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbc',
    '66666666-6666-4666-8666-666666666666',
    '77777777-7777-4777-8777-777777777778',
    'I wrote down the tradeoffs, confirmed the risk tolerance with stakeholders, and proposed a smaller first release.',
    'Clarified tradeoffs, confirmed risk tolerance, and proposed a smaller release.',
    'Shows employer-safe communication evidence from a bias-checked interview excerpt.',
    'employer_matched',
    'not_needed',
    '88888888-8888-4888-8888-888888888889'
  )
on conflict (id) do update
set
  source_text = excluded.source_text,
  display_text = excluded.display_text,
  ai_summary = excluded.ai_summary,
  visibility = excluded.visibility,
  redaction_status = excluded.redaction_status,
  bias_check_id = excluded.bias_check_id;

insert into public.job_listings (
  id,
  employer_id,
  source_job_id,
  title,
  department,
  team,
  level,
  employment_type,
  openings,
  hiring_priority,
  recruiter_owner_user_id,
  country,
  city,
  work_mode,
  timezone,
  relocation_support,
  visa_sponsorship,
  office_days,
  public_job_description,
  responsibilities,
  success_in_90_days,
  required_qualifications,
  preferred_qualifications,
  interview_process,
  company_pitch,
  status,
  posted_at
)
values (
  '99999999-9999-4999-8999-999999999999',
  '44444444-4444-4444-8444-444444444444',
  'growthcart-fe-001',
  'Frontend Engineer',
  'Product Engineering',
  'Checkout',
  'Mid',
  'full_time',
  1,
  'high',
  '55555555-5555-4555-8555-555555555555',
  'India',
  'Bengaluru',
  'hybrid',
  'Asia/Kolkata',
  false,
  false,
  2,
  'Build reliable checkout and seller-facing frontend workflows for GrowthCart.',
  '["Own checkout UI quality", "Improve release safety", "Collaborate with product and QA"]'::jsonb,
  'Ship measurable checkout reliability improvements without slowing release cadence.',
  '["React", "TypeScript", "Frontend testing", "Release discipline"]'::jsonb,
  '["Design systems", "Experimentation", "Accessibility"]'::jsonb,
  'PlacedOn profile review, technical screen, team conversation.',
  'GrowthCart is scaling commerce infrastructure for fast-growing Indian brands.',
  'open',
  now() - interval '5 days'
)
on conflict (id) do update
set
  title = excluded.title,
  department = excluded.department,
  team = excluded.team,
  level = excluded.level,
  employment_type = excluded.employment_type,
  openings = excluded.openings,
  hiring_priority = excluded.hiring_priority,
  public_job_description = excluded.public_job_description,
  responsibilities = excluded.responsibilities,
  required_qualifications = excluded.required_qualifications,
  preferred_qualifications = excluded.preferred_qualifications,
  status = excluded.status,
  updated_at = now();

insert into public.job_compensation (
  id,
  job_id,
  currency,
  min_amount,
  max_amount,
  period,
  equity_range,
  bonus_range,
  visible_to_candidates
)
values (
  '12121212-1212-4212-8212-121212121212',
  '99999999-9999-4999-8999-999999999999',
  'INR',
  2200000,
  3200000,
  'year',
  'standard startup equity',
  'performance bonus',
  true
)
on conflict (id) do update
set
  currency = excluded.currency,
  min_amount = excluded.min_amount,
  max_amount = excluded.max_amount,
  period = excluded.period,
  equity_range = excluded.equity_range,
  bonus_range = excluded.bonus_range,
  visible_to_candidates = excluded.visible_to_candidates,
  updated_at = now();

insert into public.job_matching_criteria (
  id,
  job_id,
  required_skills,
  preferred_skills,
  competency_weights,
  knockout_criteria,
  location_rules,
  work_authorization_rules
)
values (
  '13131313-1313-4313-8313-131313131313',
  '99999999-9999-4999-8999-999999999999',
  '["React", "TypeScript", "Frontend testing"]'::jsonb,
  '["Design systems", "Accessibility"]'::jsonb,
  '{"technical_execution": 0.35, "communication": 0.25, "ownership": 0.25, "learning_velocity": 0.15}'::jsonb,
  '[]'::jsonb,
  '{"country": "India", "work_mode": "hybrid"}'::jsonb,
  '{"visa_sponsorship_required": false}'::jsonb
)
on conflict (id) do update
set
  required_skills = excluded.required_skills,
  preferred_skills = excluded.preferred_skills,
  competency_weights = excluded.competency_weights,
  knockout_criteria = excluded.knockout_criteria,
  location_rules = excluded.location_rules,
  work_authorization_rules = excluded.work_authorization_rules,
  updated_at = now();

insert into public.job_role_calibrations (
  id,
  job_id,
  calibrated_by_user_id,
  role_vector,
  embedding_model,
  calibration_notes,
  calibration_json
)
values (
  '14141414-1414-4414-8414-141414141414',
  '99999999-9999-4999-8999-999999999999',
  '55555555-5555-4555-8555-555555555555',
  null,
  'sentence-transformers/all-MiniLM-L6-v2',
  'Demo calibration emphasizes release safety, communication, and frontend execution.',
  '{"fit_threshold": 80, "strong_threshold": 90}'::jsonb
)
on conflict (id) do update
set
  calibrated_by_user_id = excluded.calibrated_by_user_id,
  embedding_model = excluded.embedding_model,
  calibration_notes = excluded.calibration_notes,
  calibration_json = excluded.calibration_json,
  updated_at = now();

insert into public.candidate_job_matches (
  id,
  candidate_id,
  profile_id,
  job_id,
  employer_id,
  fit_score,
  match_label,
  why_matched,
  main_uncertainty,
  score_breakdown,
  source
)
values (
  '123e4567-e89b-42d3-a456-426614174000',
  '22222222-2222-4222-8222-222222222222',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '99999999-9999-4999-8999-999999999999',
  '44444444-4444-4444-8444-444444444444',
  91,
  'strong',
  'Strong overlap on frontend execution, release safety, and stakeholder communication.',
  'Needs one more signal on accessibility depth.',
  '{"technical_execution": 0.86, "communication": 0.88, "ownership": 0.82, "role_fit": 91}'::jsonb,
  'recommendation'
)
on conflict (id) do update
set
  fit_score = excluded.fit_score,
  match_label = excluded.match_label,
  why_matched = excluded.why_matched,
  main_uncertainty = excluded.main_uncertainty,
  score_breakdown = excluded.score_breakdown,
  source = excluded.source,
  updated_at = now();

insert into public.applications (
  id,
  candidate_id,
  job_id,
  match_id,
  status,
  applied_at,
  last_updated_at
)
values (
  '15151515-1515-4515-8515-151515151515',
  '22222222-2222-4222-8222-222222222222',
  '99999999-9999-4999-8999-999999999999',
  '123e4567-e89b-42d3-a456-426614174000',
  'reviewing',
  now() - interval '1 day',
  now()
)
on conflict (id) do update
set
  status = excluded.status,
  last_updated_at = excluded.last_updated_at;

insert into public.pipeline_items (
  id,
  employer_id,
  job_id,
  candidate_id,
  match_id,
  stage,
  owner_user_id,
  last_activity_at,
  next_action,
  age_in_stage_days,
  sla_status,
  notes,
  rejection_reason,
  rejection_note
)
values (
  '16161616-1616-4616-8616-161616161616',
  '44444444-4444-4444-8444-444444444444',
  '99999999-9999-4999-8999-999999999999',
  '22222222-2222-4222-8222-222222222222',
  '123e4567-e89b-42d3-a456-426614174000',
  'shortlisted',
  '55555555-5555-4555-8555-555555555555',
  now(),
  'request_intro',
  1,
  'on_time',
  'Strong PlacedOn evidence for checkout release safety.',
  null,
  null
)
on conflict (id) do update
set
  stage = excluded.stage,
  owner_user_id = excluded.owner_user_id,
  last_activity_at = excluded.last_activity_at,
  next_action = excluded.next_action,
  age_in_stage_days = excluded.age_in_stage_days,
  sla_status = excluded.sla_status,
  notes = excluded.notes,
  updated_at = now();

insert into public.intro_requests (
  id,
  employer_id,
  job_id,
  candidate_id,
  match_id,
  requested_by_user_id,
  status,
  candidate_response_note,
  requested_at,
  responded_at
)
values (
  '17171717-1717-4717-8717-171717171717',
  '44444444-4444-4444-8444-444444444444',
  '99999999-9999-4999-8999-999999999999',
  '22222222-2222-4222-8222-222222222222',
  '123e4567-e89b-42d3-a456-426614174000',
  '55555555-5555-4555-8555-555555555555',
  'requested',
  null,
  now(),
  null
)
on conflict (id) do update
set
  status = excluded.status,
  requested_by_user_id = excluded.requested_by_user_id,
  requested_at = excluded.requested_at,
  responded_at = excluded.responded_at,
  updated_at = now();

insert into public.saved_candidates (
  id,
  employer_id,
  job_id,
  candidate_id,
  saved_by_user_id,
  match_id
)
values (
  '18181818-1818-4818-8818-181818181818',
  '44444444-4444-4444-8444-444444444444',
  '99999999-9999-4999-8999-999999999999',
  '22222222-2222-4222-8222-222222222222',
  '55555555-5555-4555-8555-555555555555',
  '123e4567-e89b-42d3-a456-426614174000'
)
on conflict (id) do update
set
  saved_by_user_id = excluded.saved_by_user_id,
  match_id = excluded.match_id;

insert into public.candidate_tags (
  id,
  employer_id,
  candidate_id,
  tag,
  created_by_user_id
)
values (
  '19191919-1919-4919-8919-191919191919',
  '44444444-4444-4444-8444-444444444444',
  '22222222-2222-4222-8222-222222222222',
  'checkout-release-safety',
  '55555555-5555-4555-8555-555555555555'
)
on conflict (id) do update
set
  tag = excluded.tag,
  created_by_user_id = excluded.created_by_user_id;

insert into public.employer_candidate_notes (
  id,
  employer_id,
  candidate_id,
  job_id,
  author_user_id,
  note_text,
  visibility
)
values (
  '20202020-2020-4020-8020-202020202020',
  '44444444-4444-4444-8444-444444444444',
  '22222222-2222-4222-8222-222222222222',
  '99999999-9999-4999-8999-999999999999',
  '55555555-5555-4555-8555-555555555555',
  'Ask hiring manager to review Aisha for release-safety fit.',
  'hiring_team'
)
on conflict (id) do update
set
  note_text = excluded.note_text,
  visibility = excluded.visibility,
  updated_at = now();

insert into public.candidate_dashboard_snapshots (
  id,
  candidate_id,
  profile_id,
  snapshot_json
)
values (
  '21212121-2121-4121-8121-212121212121',
  '22222222-2222-4222-8222-222222222222',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '{"completion": 92, "evidence_strength": "Strong Evidence", "active_applications": 1, "strong_matches": 1}'::jsonb
)
on conflict (id) do update
set
  snapshot_json = excluded.snapshot_json;

insert into public.next_best_actions (
  id,
  candidate_id,
  action_type,
  title,
  description,
  cta_label,
  cta_route,
  priority,
  status,
  due_at
)
values (
  '22222222-aaaa-4aaa-8aaa-222222222222',
  '22222222-2222-4222-8222-222222222222',
  'respond_employer_interest',
  'Review GrowthCart intro request',
  'GrowthCart is ready to review your employer-safe profile evidence.',
  'Review intro',
  '/candidate/interest',
  'high',
  'open',
  now() + interval '2 days'
)
on conflict (id) do update
set
  title = excluded.title,
  description = excluded.description,
  cta_label = excluded.cta_label,
  cta_route = excluded.cta_route,
  priority = excluded.priority,
  status = excluded.status,
  due_at = excluded.due_at,
  updated_at = now();

insert into public.candidate_settings (
  id,
  candidate_id,
  notification_settings,
  privacy_settings,
  matching_settings,
  accessibility_settings
)
values (
  '23232323-2323-4323-8323-232323232323',
  '22222222-2222-4222-8222-222222222222',
  '{"interview_reminders": true, "employer_interest": true}'::jsonb,
  '{"raw_transcript_employer_visible": false, "evidence_requires_review": true, "visibility": "matched_only"}'::jsonb,
  '{"open_to_frontend_roles": true, "min_fit_score": 75}'::jsonb,
  '{}'::jsonb
)
on conflict (id) do update
set
  notification_settings = excluded.notification_settings,
  privacy_settings = excluded.privacy_settings,
  matching_settings = excluded.matching_settings,
  accessibility_settings = excluded.accessibility_settings,
  updated_at = now();
