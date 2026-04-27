from __future__ import annotations

"""Tests for the investor-demo JSON API contract."""

import asyncio
import json


def _flatten_text(payload: object) -> str:
    return json.dumps(payload, sort_keys=True)


def test_demo_routes_are_mounted_on_fastapi_app():
    from backend.app.main import app

    paths = {route.path for route in app.routes}

    assert "/demo/candidate" in paths
    assert "/demo/hcv" in paths
    assert "/demo/dashboard" in paths
    assert "/demo/matches" in paths
    assert "/demo/applications" in paths
    assert "/demo/interviews" in paths
    assert "/demo/employer" in paths
    assert "/demo/settings" in paths


def test_candidate_contract_uses_a_single_demo_identity():
    from backend.app.demo_routes import get_demo_candidate

    candidate = asyncio.run(get_demo_candidate())

    assert candidate["candidate"]["id"] == "demo-candidate-aisha-sharma"
    assert candidate["candidate"]["name"] == "Aisha Sharma"
    assert candidate["candidate"]["selected_role"] == "Frontend Engineer"
    assert candidate["candidate"]["location"] == "Bengaluru, India"
    assert candidate["candidate"]["availability"] == "Available for interviews"
    assert candidate["profile"]["visibility"] == "Candidate-controlled"
    assert "Alex Chen" not in _flatten_text(candidate)


def test_hcv_contract_exposes_evidence_not_raw_vector():
    from backend.app.demo_routes import get_demo_hcv

    hcv = asyncio.run(get_demo_hcv())

    assert hcv["candidate_id"] == "demo-candidate-aisha-sharma"
    assert hcv["embedding"]["provider"] == "sentence-transformers"
    assert hcv["embedding"]["dimension_count"] == 384
    assert "vector" not in hcv["embedding"]

    dimensions = hcv["dimensions"]
    assert {dimension["id"] for dimension in dimensions} == {
        "technical",
        "behavioral",
        "communication",
        "growth",
    }
    assert set(hcv["dimensions_by_key"]) == {"technical", "behavioral", "communication", "growth"}
    for dimension in dimensions:
        assert 0 <= dimension["score"] <= 100
        assert 0 <= dimension["confidence"] <= 1
        assert 0 <= dimension["uncertainty"] <= 1
        assert dimension["evidence_snippets"]


def test_candidate_dashboard_contract_has_next_action_and_summaries():
    from backend.app.demo_routes import get_demo_dashboard

    dashboard = asyncio.run(get_demo_dashboard())

    assert dashboard["candidate_id"] == "demo-candidate-aisha-sharma"
    assert dashboard["next_best_action"]["type"] == "start_interview"
    assert dashboard["profile_snapshot"]["headline"].startswith("Evidence-backed Frontend Engineer")
    assert dashboard["matches_summary"]["strong_matches"] >= 1
    assert dashboard["pipeline_summary"]["active_applications"] >= 1
    assert dashboard["growth_activity"]


def test_matches_applications_and_interviews_share_candidate_context():
    from backend.app.demo_routes import (
        get_demo_applications,
        get_demo_interviews,
        get_demo_matches,
    )

    matches = asyncio.run(get_demo_matches())
    applications = asyncio.run(get_demo_applications())
    interviews = asyncio.run(get_demo_interviews())

    assert matches["candidate_id"] == "demo-candidate-aisha-sharma"
    assert applications["candidate_id"] == "demo-candidate-aisha-sharma"
    assert interviews["candidate_id"] == "demo-candidate-aisha-sharma"
    assert matches["matches"][0]["action_type"] == "apply"
    assert applications["stages"]
    assert applications["applications"][0]["candidate_name"] == "Aisha Sharma"
    assert interviews["upcoming"][0]["join_room_action"]["enabled"] is True


def test_employer_and_settings_contracts_support_demo_ui_controls():
    from backend.app.demo_routes import get_demo_employer, get_demo_settings

    employer = asyncio.run(get_demo_employer())
    settings = asyncio.run(get_demo_settings())

    assert employer["candidate_discovery_feed"][0]["candidate_name"] == "Aisha Sharma"
    assert employer["candidate_discovery_feed"][0]["actions"] == [
        "express_interest",
        "request_intro",
        "pass",
    ]
    assert employer["intro_request_state"]["status"] == "not_requested"
    assert settings["candidate_id"] == "demo-candidate-aisha-sharma"
    assert any(group["id"] == "privacy" for group in settings["groups"])
    assert settings["privacy_controls"][0]["candidate_controlled"] is True


def test_demo_candidate_also_matches_current_frontend_contract():
    from backend.app.demo_routes import get_demo_candidate

    candidate = asyncio.run(get_demo_candidate())

    assert candidate["name"] == "Aisha Sharma"
    assert candidate["target_role"] == "Frontend Engineer"
    assert candidate["location"] == "Bengaluru, India"
    assert candidate["availability"]
    assert candidate["profile_status"]
    assert candidate["visibility"]
    assert candidate["share_url"].startswith("https://")


def test_demo_dashboard_also_matches_current_frontend_contract():
    from backend.app.demo_routes import get_demo_dashboard

    dashboard = asyncio.run(get_demo_dashboard())

    assert dashboard["next_best_action"]["type"] in {
        "start_interview",
        "recover_interview",
        "review_profile",
        "publish_profile",
        "respond_employer_interest",
        "complete_follow_up",
        "review_offer",
    }
    assert dashboard["next_best_action"]["title"]
    assert dashboard["next_best_action"]["cta_label"]
    assert dashboard["next_best_action"]["priority"] in {"high", "medium", "low"}
    assert dashboard["profile_snapshot"]["completion"] >= 0
    assert dashboard["profile_snapshot"]["evidence_strength"]
    assert dashboard["profile_snapshot"]["skills_count"] >= 0
    assert dashboard["profile_snapshot"]["interviews_completed"] >= 0
    assert dashboard["matches_summary"]["total"] >= 0
    assert dashboard["matches_summary"]["new_count"] >= 0
    assert dashboard["matches_summary"]["strong_fits"] >= 0
    assert dashboard["pipeline_summary"]["upcoming_interviews"] >= 0
    assert dashboard["pipeline_summary"]["pending_responses"] >= 0
    assert dashboard["growth_activity"]["recent_improvements"]
    assert dashboard["growth_activity"]["next_milestones"]


def test_demo_collection_endpoints_match_current_frontend_contract():
    from backend.app.demo_routes import (
        get_demo_applications,
        get_demo_employer,
        get_demo_hcv,
        get_demo_interviews,
        get_demo_matches,
        get_demo_settings,
    )

    hcv = asyncio.run(get_demo_hcv())
    matches = asyncio.run(get_demo_matches())
    applications = asyncio.run(get_demo_applications())
    interviews = asyncio.run(get_demo_interviews())
    employer = asyncio.run(get_demo_employer())
    settings = asyncio.run(get_demo_settings())

    assert hcv["summary"]
    assert hcv["embedding_metadata"]["dimension_count"] == 384
    assert hcv["dimensions"][0]["dimension"]
    assert hcv["dimensions"][0]["evidence_snippets"]

    assert matches["matches"][0]["match_label"] in {"Strong Match", "Good Match", "Possible Match"}
    assert matches["matches"][0]["action_type"] in {"apply", "interest"}

    assert applications["stages"][0]["stage"]
    assert applications["applications"][0]["last_updated"]
    assert applications["applications"][0]["evidence_used"]

    assert interviews["upcoming"][0]["type"]
    assert interviews["upcoming"][0]["scheduled_time"]
    assert interviews["upcoming"][0]["duration"]
    assert interviews["upcoming"][0]["status"]

    assert employer["discovery_feed"][0]["name"]
    assert employer["shortlist"][0]["saved_date"]
    assert employer["intro_requests"][0]["status"]

    assert settings["groups"][0]["group"]
    assert settings["groups"][0]["description"]
    assert settings["groups"][0]["controls"][0]["type"] in {"toggle", "select", "text"}
