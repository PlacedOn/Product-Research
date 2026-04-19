"""Tests for Day 1-2 API endpoints: CSV ingestion, rating, JSONL export."""

import asyncio
import json
import os
from pathlib import Path

import pytest

# Inline test since we can't easily start the full FastAPI app
# (requires Redis etc). We test the route handler logic directly.


def test_csv_payload_validation():
    """Verify the CSV payload model validates correctly."""
    from backend.app.api_routes import CSVUploadPayload, WorkHistoryItem

    payload = CSVUploadPayload(
        candidate_id="test-001",
        work_history=[
            WorkHistoryItem(title="SDE", company="Flipkart", start_date="2024-01", end_date="2025-06"),
            WorkHistoryItem(title="Intern", company="Google", start_date="2023-06"),
        ],
    )

    assert payload.candidate_id == "test-001"
    assert len(payload.work_history) == 2
    assert payload.work_history[0].title == "SDE"
    assert payload.work_history[1].end_date == "Present"


def test_rating_payload_validation():
    """Verify the rating payload model validates correctly."""
    from backend.app.api_routes import RatingPayload

    payload = RatingPayload(
        candidate_id="test-001",
        rating="green",
        employer_id="emp-xyz",
        notes="Strong performance in first 90 days",
    )

    assert payload.rating == "green"
    assert payload.candidate_id == "test-001"
    assert payload.employer_id == "emp-xyz"


def test_csv_ingest_endpoint():
    """Test the /ingest/csv endpoint handler directly."""
    from backend.app.api_routes import CSVUploadPayload, WorkHistoryItem, ingest_linkedin_csv

    payload = CSVUploadPayload(
        candidate_id="test-csv-001",
        work_history=[
            WorkHistoryItem(title="Backend Engineer", company="Razorpay", start_date="2024-03", end_date="Present"),
        ],
    )

    result = asyncio.run(ingest_linkedin_csv(payload))
    assert result["status"] == "success"
    assert result["roles_parsed"] == 1
    assert result["verified_badge_active"] is True


def test_rating_endpoint():
    """Test the /rating endpoint handler directly."""
    from backend.app.api_routes import RatingPayload, submit_rating

    payload = RatingPayload(candidate_id="test-rate-001", rating="green")
    result = asyncio.run(submit_rating(payload))

    assert result["status"] == "success"
    assert result["rating_recorded"]["rating"] == "green"


def test_rating_rejects_invalid():
    """Test that invalid ratings are rejected."""
    from backend.app.api_routes import RatingPayload, submit_rating
    from fastapi import HTTPException

    payload = RatingPayload(candidate_id="test-rate-002", rating="purple")

    with pytest.raises(HTTPException) as exc_info:
        asyncio.run(submit_rating(payload))

    assert exc_info.value.status_code == 400


def test_jsonl_export(tmp_path, monkeypatch):
    """Test the JSONL exporter writes correctly."""
    from backend.app import api_routes
    from backend.app.api_routes import InterviewExportPayload, export_interview_jsonl

    monkeypatch.setattr(api_routes, "_JSONL_DIR", tmp_path)

    payload = InterviewExportPayload(
        candidate_id="test-export-001",
        interview_data={
            "turns": 8,
            "hcv_scores": {"block_4_grit": 0.72, "block_6_social": 0.65},
            "completion": True,
        },
    )

    result = asyncio.run(export_interview_jsonl(payload))
    assert result["status"] == "success"

    # Verify the file was written
    jsonl_files = list(tmp_path.glob("*.jsonl"))
    assert len(jsonl_files) == 1

    with open(jsonl_files[0]) as f:
        record = json.loads(f.readline())
        assert record["candidate_id"] == "test-export-001"
        assert record["turns"] == 8
        assert record["hcv_scores"]["block_4_grit"] == 0.72
