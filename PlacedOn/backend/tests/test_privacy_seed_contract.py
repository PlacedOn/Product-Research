from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
MIGRATION = ROOT / "supabase" / "migrations" / "202604300002_privacy_rls_and_demo_seed.sql"
POLICY_FIX = ROOT / "supabase" / "migrations" / "202604300003_fix_employer_policy_outer_references.sql"
COLUMN_GRANTS = ROOT / "supabase" / "migrations" / "202604300004_restrict_sensitive_column_grants.sql"


def _migration_sql() -> str:
    return MIGRATION.read_text(encoding="utf-8")


def test_privacy_migration_enables_rls_on_sensitive_tables():
    sql = _migration_sql().lower()

    for table in [
        "users",
        "candidates",
        "interviews",
        "interview_turns",
        "candidate_profile_versions",
        "candidate_atomic_traits",
        "profile_evidence_snippets",
        "candidate_profile_notes",
        "candidate_accommodations",
        "employers",
        "employer_users",
        "job_listings",
        "candidate_job_matches",
        "applications",
        "pipeline_items",
    ]:
        assert f"alter table public.{table} enable row level security;" in sql

    assert "create or replace function public.current_app_user_id()" in sql
    assert "create or replace function public.is_employer_member(target_employer_id uuid)" in sql


def test_privacy_migration_blocks_raw_and_vector_columns_from_frontend_roles():
    sql = _migration_sql().lower()

    assert "revoke select (profile_embedding) on public.candidate_profile_versions from anon, authenticated;" in sql
    assert "revoke select (role_vector) on public.job_role_calibrations from anon, authenticated;" in sql
    assert "revoke select (turn_embedding) on public.interview_turn_analysis from anon, authenticated;" in sql
    assert "revoke select (source_text) on public.profile_evidence_snippets from anon, authenticated;" in sql
    assert "revoke select (raw_question, candidate_answer_text) on public.interview_turns from anon, authenticated;" in sql


def test_privacy_migration_limits_employer_evidence_to_redacted_checked_rows():
    sql = _migration_sql().lower()

    assert 'create policy "employers read safe matched evidence"' in sql
    assert "visibility in ('employer_limited', 'employer_matched')" in sql
    assert "redaction_status <> 'blocked'" in sql
    assert "bias_check_id is not null" in sql
    assert "source_text" not in sql.split('create policy "employers read safe matched evidence"', 1)[1].split(";", 1)[0]


def test_demo_seed_creates_complete_candidate_employer_match_graph():
    sql = _migration_sql()

    for marker in [
        "demo-candidate-aisha@placedon.ai",
        "Aisha Sharma",
        "GrowthCart",
        "Frontend Engineer",
        "candidate_profile_versions",
        "candidate_atomic_traits",
        "profile_evidence_snippets",
        "interview_bias_checks",
        "candidate_job_matches",
        "applications",
        "pipeline_items",
        "intro_requests",
        "candidate_dashboard_snapshots",
        "next_best_actions",
    ]:
        assert marker in sql

    assert "0.86" in sql
    assert "91" in sql
    assert "employer_matched" in sql
    assert "on conflict (id) do update" in sql.lower()


def test_policy_fix_uses_qualified_outer_references_for_employer_reads():
    sql = POLICY_FIX.read_text(encoding="utf-8").lower()

    assert 'drop policy if exists "employers read matched published profiles"' in sql
    assert 'drop policy if exists "employers read matched traits"' in sql
    assert 'drop policy if exists "employers read safe matched evidence"' in sql
    assert "m.profile_id = public.candidate_profile_versions.id" in sql
    assert "p.id = public.candidate_atomic_traits.profile_id" in sql
    assert "m.profile_id = public.profile_evidence_snippets.profile_id" in sql


def test_column_grant_fix_removes_table_select_then_grants_safe_columns():
    sql = COLUMN_GRANTS.read_text(encoding="utf-8").lower()

    for table in [
        "candidate_profile_versions",
        "job_role_calibrations",
        "interview_turn_analysis",
        "profile_evidence_snippets",
        "interview_turns",
    ]:
        assert f"revoke select on public.{table} from anon, authenticated;" in sql

    assert "grant select (" in sql
    assert "source_text" not in sql.split("grant select (", 1)[1].split(") on public.profile_evidence_snippets", 1)[0]
    assert "profile_embedding" not in sql.split(") on public.candidate_profile_versions", 1)[0]
    assert "role_vector" not in sql.split(") on public.job_role_calibrations", 1)[0]
    assert "turn_embedding" not in sql.split(") on public.interview_turn_analysis", 1)[0]
    assert "raw_question" not in sql.split(") on public.interview_turns", 1)[0]
    assert "candidate_answer_text" not in sql.split(") on public.interview_turns", 1)[0]
