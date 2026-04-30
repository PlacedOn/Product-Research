-- Supabase grants broad table privileges to API roles by default. Column-level
-- REVOKE alone does not override an existing table-level SELECT grant, so these
-- sensitive tables first lose table SELECT and then grant only frontend-safe
-- columns back to authenticated users. The service_role keeps backend access.

revoke select on public.candidate_profile_versions from anon, authenticated;
grant select (
  id,
  candidate_id,
  source_interview_id,
  target_role,
  headline,
  summary,
  overall_confidence,
  overall_uncertainty,
  embedding_model,
  embedding_generated_at,
  generation_status,
  status,
  share_url,
  generated_at,
  published_at,
  created_at,
  updated_at
) on public.candidate_profile_versions to authenticated;

revoke select on public.job_role_calibrations from anon, authenticated;
grant select (
  id,
  job_id,
  calibrated_by_user_id,
  embedding_model,
  calibration_notes,
  calibration_json,
  created_at,
  updated_at
) on public.job_role_calibrations to authenticated;

revoke select on public.interview_turn_analysis from anon, authenticated;
grant select (
  id,
  interview_id,
  turn_id,
  extracted_skills,
  extracted_traits,
  evidence_candidates,
  embedding_model,
  embedding_generated_at,
  created_at
) on public.interview_turn_analysis to authenticated;

revoke select on public.profile_evidence_snippets from anon, authenticated;
grant select (
  id,
  candidate_id,
  profile_id,
  atomic_trait_id,
  interview_id,
  turn_id,
  display_text,
  ai_summary,
  visibility,
  redaction_status,
  bias_check_id,
  created_at
) on public.profile_evidence_snippets to authenticated;

revoke select on public.interview_turns from anon, authenticated;
grant select (
  id,
  interview_id,
  turn_index,
  phase,
  mode,
  target_skill,
  difficulty,
  safe_question,
  used_guardrail_fallback,
  answer_excerpt,
  off_record_requested,
  created_at
) on public.interview_turns to authenticated;
