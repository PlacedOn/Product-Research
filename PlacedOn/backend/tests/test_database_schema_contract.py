from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
MIGRATION = ROOT / "supabase" / "migrations" / "202604300001_tightened_mvp_schema.sql"


def _schema_sql() -> str:
    return MIGRATION.read_text(encoding="utf-8")


def _table_columns(sql: str, table: str) -> set[str]:
    match = re.search(
        rf"create table public\.{table}\s*\((.*?)\n\);",
        sql,
        flags=re.IGNORECASE | re.DOTALL,
    )
    assert match, f"missing table public.{table}"
    columns: set[str] = set()
    for raw_line in match.group(1).splitlines():
        line = raw_line.strip().rstrip(",")
        if not line or line.startswith("--"):
            continue
        name = line.split()[0].strip('"')
        if name.lower() not in {"constraint", "primary", "foreign", "unique", "check"}:
            columns.add(name)
    return columns


def test_migration_defines_hybrid_hcv_tables_and_constraints():
    sql = _schema_sql()

    assert "create extension if not exists vector" in sql.lower()
    assert "profile_embedding vector(384)" in sql
    assert "trait_text text not null" in sql
    assert "dimension_id uuid not null references public.competency_dimensions(id)" in sql
    assert "profile_evidence_snippets" in sql
    assert "candidate_only" in sql
    assert "employer_limited" in sql
    assert "employer_matched" in sql
    assert "raw transcript rows are not employer-facing" in sql.lower()

    assert _table_columns(sql, "competency_dimensions") >= {
        "id",
        "key",
        "label",
        "category",
        "description",
        "applies_to_roles",
        "is_core",
        "active",
        "created_at",
    }
    assert _table_columns(sql, "candidate_profile_versions") >= {
        "id",
        "candidate_id",
        "source_interview_id",
        "target_role",
        "headline",
        "summary",
        "overall_confidence",
        "overall_uncertainty",
        "profile_embedding",
        "embedding_model",
        "embedding_generated_at",
        "generation_status",
        "status",
        "share_url",
        "generated_at",
        "published_at",
    }
    assert _table_columns(sql, "candidate_atomic_traits") >= {
        "id",
        "profile_id",
        "dimension_id",
        "trait_text",
        "score",
        "confidence",
        "uncertainty",
        "signal_strength",
        "rank_order",
        "created_at",
    }


def test_migration_defines_interview_runtime_and_candidate_app_tables():
    sql = _schema_sql()

    for table in [
        "interviews",
        "interview_turns",
        "interview_state_snapshots",
        "interview_decomposition_steps",
        "interview_judge_results",
        "interview_consensus_checks",
        "interview_bias_checks",
        "interview_integrity_checks",
        "interview_turn_analysis",
        "interview_workspace_artifacts",
        "interview_session_events",
        "users",
        "candidates",
        "interview_consents",
        "candidate_accommodations",
        "candidate_dashboard_snapshots",
        "next_best_actions",
        "candidate_profile_notes",
        "candidate_settings",
    ]:
        assert f"create table public.{table}" in sql

    assert "skill_vector jsonb not null default '{}'::jsonb" in sql
    assert "atomic_traits_identified jsonb not null default '[]'::jsonb" in sql
    assert "visibility_status text not null default 'private'" in sql
    assert "private notes are never visible to employers" in sql.lower()


def test_migration_defines_employer_matching_pipeline_and_indexes():
    sql = _schema_sql()

    for table in [
        "employers",
        "employer_users",
        "job_listings",
        "job_compensation",
        "job_matching_criteria",
        "job_role_calibrations",
        "job_pipeline_stage_config",
        "job_role_dashboard_stats",
        "candidate_job_matches",
        "applications",
        "pipeline_items",
        "intro_requests",
        "saved_candidates",
        "candidate_tags",
        "employer_candidate_notes",
        "candidate_comparison_sets",
    ]:
        assert f"create table public.{table}" in sql

    assert "role_vector vector(384)" in sql
    assert "fit_score integer not null" in sql
    assert "check (fit_score between 0 and 100)" in sql
    assert "using hnsw (profile_embedding vector_cosine_ops)" in sql
    assert "using hnsw (role_vector vector_cosine_ops)" in sql
    assert "idx_candidate_job_matches_job_fit" in sql
    assert "idx_pipeline_items_job_stage_activity" in sql
    assert "using gin (score_breakdown)" in sql


def test_competency_dimensions_are_predefined_and_seeded():
    sql = _schema_sql()

    expected_keys = {
        "technical_execution",
        "problem_solving",
        "communication",
        "collaboration",
        "ownership",
        "learning_velocity",
        "ambiguity_tolerance",
        "product_judgment",
        "leadership",
        "customer_empathy",
    }
    for key in expected_keys:
        assert f"'{key}'" in sql

    assert "insert into public.competency_dimensions" in sql
    assert "on conflict (key) do update" in sql
