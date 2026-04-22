from __future__ import annotations
from typing import Optional
"""
PlacedOn API Routes — Day 1-2 Endpoints

/ingest/csv  — LinkedIn CSV upload → work history into Supabase
/rating      — 90-day employer rating (green/yellow/red)
"""


import json
import os
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# ---------------------------------------------------------------------------
# 1. LinkedIn CSV Ingestion
# ---------------------------------------------------------------------------

class WorkHistoryItem(BaseModel):
    title: str
    company: str
    start_date: str
    end_date: Optional[str] = "Present"


class CSVUploadPayload(BaseModel):
    candidate_id: str
    work_history: list[WorkHistoryItem]


@router.post("/ingest/csv")
async def ingest_linkedin_csv(payload: CSVUploadPayload):
    """Accept parsed LinkedIn CSV data and store it."""
    if not payload.work_history:
        raise HTTPException(status_code=400, detail="work_history is empty")

    enriched_history = [
        {
            "job_title": item.title,
            "company_name": item.company,
            "start": item.start_date,
            "end": item.end_date,
            "verified_source": "LinkedIn_Export",
        }
        for item in payload.work_history
    ]

    # TODO: Wire to Supabase when credentials are configured
    # supabase.table('candidate_profiles').update({
    #     "work_history": enriched_history,
    #     "bgc_verified": True
    # }).eq("id", payload.candidate_id).execute()

    return {
        "status": "success",
        "candidate_id": payload.candidate_id,
        "roles_parsed": len(enriched_history),
        "verified_badge_active": True,
    }


# ---------------------------------------------------------------------------
# 2. 90-Day Employer Rating
# ---------------------------------------------------------------------------

class RatingPayload(BaseModel):
    candidate_id: str
    rating: str  # green / yellow / red
    employer_id: Optional[str] = None
    notes: Optional[str] = None


@router.post("/rating")
async def submit_rating(payload: RatingPayload):
    """Accept employer rating for a candidate (90-day feedback loop)."""
    if payload.rating not in {"green", "yellow", "red"}:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid rating '{payload.rating}'. Must be green, yellow, or red.",
        )

    rating_record = {
        "candidate_id": payload.candidate_id,
        "rating": payload.rating,
        "employer_id": payload.employer_id,
        "notes": payload.notes,
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
    }

    # TODO: Wire to Supabase when credentials are configured
    # supabase.table('ratings').insert(rating_record).execute()

    return {
        "status": "success",
        "rating_recorded": rating_record,
    }


# ---------------------------------------------------------------------------
# 3. JSONL Interview Exporter
# ---------------------------------------------------------------------------

_JSONL_DIR = Path("data/interviews")


class InterviewExportPayload(BaseModel):
    candidate_id: str
    interview_data: dict


@router.post("/export/jsonl")
async def export_interview_jsonl(payload: InterviewExportPayload):
    """Export a completed interview to JSONL for training data."""
    _JSONL_DIR.mkdir(parents=True, exist_ok=True)

    today = datetime.now(timezone.utc).strftime("%y%m%d")
    filepath = _JSONL_DIR / f"{today}.jsonl"

    record = {
        "candidate_id": payload.candidate_id,
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        **payload.interview_data,
    }

    with open(filepath, "a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")

    return {
        "status": "success",
        "file": str(filepath),
        "candidate_id": payload.candidate_id,
    }
