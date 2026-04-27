from __future__ import annotations

"""Static demo API used by the frontend investor-demo shell.

These endpoints keep demo copy and candidate data in one backend contract so the
frontend can be refactored away from screen-local hardcoded arrays before the
Supabase schema is finalized.
"""

from copy import deepcopy
from typing import Any

from fastapi import APIRouter

router = APIRouter(prefix="/demo", tags=["demo"])

DEMO_CANDIDATE_ID = "demo-candidate-aisha-sharma"
DEMO_CANDIDATE_NAME = "Aisha Sharma"
DEMO_TARGET_ROLE = "Frontend Engineer"
DEMO_LOCATION = "Bengaluru, India"


def _response(payload: dict[str, Any]) -> dict[str, Any]:
    return deepcopy(payload)


def _frontend_candidate() -> dict[str, Any]:
    payload = _response(_CANDIDATE)
    candidate = payload["candidate"]
    profile = payload["profile"]
    payload.update(
        {
            "name": candidate["name"],
            "target_role": candidate["selected_role"],
            "location": candidate["location"],
            "availability": candidate["availability"],
            "profile_status": candidate["profile_status"],
            "visibility": profile["visibility"],
            "share_url": profile["share_url"],
        }
    )
    return payload


def _frontend_hcv() -> dict[str, Any]:
    payload = _response(_HCV)
    dimensions_by_key = payload.pop("dimensions")
    dimensions = []
    for key, dimension in dimensions_by_key.items():
        dimensions.append(
            {
                "id": key,
                "dimension": dimension["label"],
                "score": dimension["score"],
                "confidence": dimension["confidence"],
                "uncertainty": dimension["uncertainty"],
                "label": dimension["label"],
                "evidence_snippets": dimension["evidence"],
            }
        )

    payload["summary"] = payload["summary"]["label"]
    payload["embedding_metadata"] = {
        "model": payload["embedding"]["model"],
        "dimension_count": payload["embedding"]["dimension_count"],
        "last_updated": "2026-04-26T18:30:00+05:30",
    }
    payload["dimensions"] = dimensions
    payload["dimensions_by_key"] = dimensions_by_key
    return payload


def _frontend_dashboard() -> dict[str, Any]:
    payload = _response(_DASHBOARD)
    payload["next_best_action"].update(
        {
            "type": "start_interview",
            "title": payload["next_best_action"]["label"],
            "cta_label": payload["next_best_action"]["cta"],
            "cta_route": payload["next_best_action"]["route"],
            "priority": "high",
        }
    )
    payload["profile_snapshot"].update(
        {
            "completion": 92,
            "evidence_strength": "Strong Evidence",
            "skills_count": 18,
            "interviews_completed": 3,
        }
    )
    payload["matches_summary"].update(
        {
            "total": payload["matches_summary"]["total_matches"],
            "new_count": payload["matches_summary"]["new_this_week"],
            "strong_fits": payload["matches_summary"]["strong_matches"],
        }
    )
    payload["pipeline_summary"].update(
        {
            "upcoming_interviews": payload["pipeline_summary"]["interviews_scheduled"],
            "pending_responses": payload["pipeline_summary"]["employer_interests"],
        }
    )
    payload["growth_activity"] = {
        "recent_improvements": [
            "Added stronger frontend execution evidence from structured interview snippets.",
            "Improved collaboration confidence with cross-functional communication signals.",
            "Clarified growth plan around accessibility and larger-system ownership.",
        ],
        "next_milestones": [
            "Complete GrowthCart prep before the technical screen.",
            "Add one more design systems evidence example.",
            "Review employer interest before requesting intros.",
        ],
    }
    return payload


def _frontend_applications() -> dict[str, Any]:
    payload = _response(_APPLICATIONS)
    for stage in payload["stages"]:
        stage["stage"] = stage["label"]
    for application in payload["applications"]:
        application["last_updated"] = application["updated_at"]
        application["evidence_used"] = [
            "Frontend execution evidence",
            "Collaboration clarity signal",
            "Growth and ownership interview snippet",
        ]
    return payload


def _frontend_matches() -> dict[str, Any]:
    payload = _response(_MATCHES)
    label_map = {
        "Strong match": "Strong Match",
        "Stretch match": "Possible Match",
    }
    action_map = {
        "apply_with_profile": "apply",
        "express_interest": "interest",
        "view_prep": "interest",
    }
    for match in payload["matches"]:
        match["match_label"] = label_map.get(match["match_label"], match["match_label"])
        match["action_type"] = action_map.get(match["action_type"], match["action_type"])
    return payload


def _frontend_interviews() -> dict[str, Any]:
    payload = _response(_INTERVIEWS)
    for interview in payload["upcoming"]:
        interview["type"] = interview["format"]
        interview["scheduled_time"] = interview["starts_at"]
        interview["duration"] = "45 minutes"
        interview["join_url"] = interview["join_room_action"]["route"]
        interview["status"] = "scheduled"
    for interview in payload["past"]:
        interview["type"] = "Completed assessment"
        interview["scheduled_time"] = interview["completed_at"]
        interview["duration"] = "35 minutes"
        interview["prep_notes"] = []
        interview["status"] = "completed"
    return payload


def _frontend_employer() -> dict[str, Any]:
    payload = _response(_EMPLOYER)
    for job in payload["jobs"]:
        job["department"] = "Product Engineering"
        job["posted_date"] = "2026-04-20"
        job["applicants_count"] = job["candidate_matches"]

    discovery_feed = []
    for index, candidate in enumerate(payload["candidate_discovery_feed"], start=1):
        discovery_feed.append(
            {
                "id": candidate["candidate_id"],
                "name": candidate["candidate_name"],
                "target_role": candidate["role_fit"],
                "location": candidate["location"],
                "match_score": 91 if index == 1 else 78,
                "evidence_strength": candidate["match_label"],
                "key_signals": [
                    "Frontend execution",
                    "Collaboration clarity",
                    "Candidate-controlled evidence",
                ],
                "available_from": "Immediately" if index == 1 else "In 2 weeks",
            }
        )
    payload["discovery_feed"] = discovery_feed
    payload["shortlist"] = [
        {
            "id": candidate["candidate_id"],
            "name": candidate["candidate_name"],
            "role": candidate["saved_for_job"],
            "saved_date": "2026-04-26",
            "match_score": 91,
            "status": "saved",
        }
        for candidate in payload["saved_shortlist"]
    ]
    payload["intro_requests"] = [
        {
            "candidate_id": payload["intro_request_state"]["candidate_id"],
            "status": payload["intro_request_state"]["status"],
        }
    ]
    return payload


def _frontend_settings() -> dict[str, Any]:
    payload = _response(_SETTINGS)
    for group in payload["groups"]:
        group["group"] = group["label"]
        group["description"] = f"{group['label']} settings for the demo profile."
        group["controls"] = [
            {
                "id": setting["id"],
                "label": setting["label"],
                "description": f"Current value: {setting['value']}",
                "type": "text",
                "value": setting["value"],
            }
            for setting in group["settings"]
        ]
    return payload


_CANDIDATE: dict[str, Any] = {
    "candidate": {
        "id": DEMO_CANDIDATE_ID,
        "name": DEMO_CANDIDATE_NAME,
        "selected_role": DEMO_TARGET_ROLE,
        "location": DEMO_LOCATION,
        "availability": "Available for interviews",
        "profile_status": "Published demo profile",
        "visibility": "Visible to matched employers",
        "headline": "Overlooked high-potential frontend engineer with evidence-backed collaboration signals.",
        "core_message": (
            "PlacedOn reveals human competency beyond resumes by combining candidate control, "
            "structured interview evidence, and employer-ready competency signals."
        ),
    },
    "profile": {
        "status": "Ready for employer review",
        "visibility": "Candidate-controlled",
        "completion_percent": 92,
        "share_url": "https://demo.placedon.ai/profile/aisha-sharma",
        "last_updated": "2026-04-26T18:30:00+05:30",
    },
}


_HCV: dict[str, Any] = {
    "candidate_id": DEMO_CANDIDATE_ID,
    "candidate_name": DEMO_CANDIDATE_NAME,
    "role_context": DEMO_TARGET_ROLE,
    "embedding": {
        "provider": "sentence-transformers",
        "model": "all-MiniLM-L6-v2",
        "dimension_count": 384,
        "storage": "Backend only; frontend receives metadata and evidence summaries.",
    },
    "summary": {
        "label": "Strong evidence-backed frontend and collaboration profile",
        "confidence": 0.84,
        "uncertainty_note": "Higher confidence in collaboration and frontend execution; moderate uncertainty on large-system leadership.",
    },
    "dimensions": {
        "technical": {
            "score": 86,
            "confidence": 0.86,
            "uncertainty": 0.14,
            "label": "Frontend execution",
            "evidence": [
                "Explained tradeoffs between optimistic UI, cache invalidation, and loading states in a product flow.",
                "Debugged a layout regression by isolating component state before changing styling.",
            ],
        },
        "behavioral": {
            "score": 82,
            "confidence": 0.81,
            "uncertainty": 0.19,
            "label": "Ownership under ambiguity",
            "evidence": [
                "Repeatedly clarified user impact before choosing implementation shortcuts.",
                "Described taking responsibility for a missed handoff and adding a checklist to prevent recurrence.",
            ],
        },
        "communication": {
            "score": 88,
            "confidence": 0.89,
            "uncertainty": 0.11,
            "label": "Collaborative clarity",
            "evidence": [
                "Translated technical constraints into design options without hiding tradeoffs.",
                "Used concise status updates while pairing with product and design stakeholders.",
            ],
        },
        "growth": {
            "score": 79,
            "confidence": 0.76,
            "uncertainty": 0.24,
            "label": "Learning velocity",
            "evidence": [
                "Turned interview feedback into a focused accessibility and testing practice plan.",
                "Connected prior customer-support work to frontend empathy and product judgment.",
            ],
        },
    },
}


_DASHBOARD: dict[str, Any] = {
    "candidate_id": DEMO_CANDIDATE_ID,
    "candidate_name": DEMO_CANDIDATE_NAME,
    "next_best_action": {
        "type": "prepare_interview",
        "label": "Prepare for GrowthCart interview",
        "description": "Review two evidence snippets and practice one architecture prompt before tomorrow's screen.",
        "cta": "Open prep room",
        "route": "/interviews",
    },
    "profile_snapshot": {
        "headline": "Evidence-backed Frontend Engineer ready for matched employer intros",
        "status": "Published",
        "visibility": "Candidate-controlled",
        "selected_role": DEMO_TARGET_ROLE,
        "location": DEMO_LOCATION,
        "last_signal": "Communication confidence increased after structured collaboration challenge.",
    },
    "matches_summary": {
        "total_matches": 5,
        "strong_matches": 3,
        "new_this_week": 2,
        "top_match": "GrowthCart",
    },
    "pipeline_summary": {
        "active_applications": 3,
        "interviews_scheduled": 1,
        "employer_interests": 2,
        "profile_views": 18,
    },
    "growth_activity": [
        {
            "id": "growth-accessibility",
            "label": "Accessibility polish",
            "status": "in_progress",
            "note": "Complete ARIA review for modal and keyboard flows.",
        },
        {
            "id": "growth-systems",
            "label": "System design practice",
            "status": "queued",
            "note": "Prepare a concise answer for real-time notification tradeoffs.",
        },
    ],
}


_MATCHES: dict[str, Any] = {
    "candidate_id": DEMO_CANDIDATE_ID,
    "candidate_name": DEMO_CANDIDATE_NAME,
    "matches": [
        {
            "id": "match-growthcart-frontend",
            "company": "GrowthCart",
            "role": "Frontend Engineer",
            "location": "Bengaluru hybrid",
            "match_label": "Strong match",
            "match_score": 91,
            "evidence_reason": "High overlap with product UI execution, collaboration clarity, and customer empathy signals.",
            "action_type": "apply_with_profile",
        },
        {
            "id": "match-novabooks-ui",
            "company": "NovaBooks",
            "role": "Product UI Engineer",
            "location": "Remote India",
            "match_label": "Strong match",
            "match_score": 88,
            "evidence_reason": "Communication and iterative debugging evidence map well to a small product team.",
            "action_type": "express_interest",
        },
        {
            "id": "match-riverpay-design-systems",
            "company": "RiverPay",
            "role": "Design Systems Engineer",
            "location": "Bengaluru",
            "match_label": "Stretch match",
            "match_score": 76,
            "evidence_reason": "Frontend fundamentals are strong; larger-scale system ownership remains a growth area.",
            "action_type": "view_prep",
        },
    ],
}


_APPLICATIONS: dict[str, Any] = {
    "candidate_id": DEMO_CANDIDATE_ID,
    "candidate_name": DEMO_CANDIDATE_NAME,
    "stages": [
        {"id": "saved", "label": "Saved", "count": 2},
        {"id": "applied", "label": "Applied", "count": 2},
        {"id": "interview", "label": "Interview", "count": 1},
        {"id": "offer", "label": "Offer", "count": 0},
    ],
    "applications": [
        {
            "id": "app-growthcart",
            "candidate_name": DEMO_CANDIDATE_NAME,
            "company": "GrowthCart",
            "role": "Frontend Engineer",
            "stage": "interview",
            "status_label": "Interview scheduled",
            "updated_at": "2026-04-26T10:15:00+05:30",
            "next_step": "Complete prep notes before the technical screen.",
        },
        {
            "id": "app-novabooks",
            "candidate_name": DEMO_CANDIDATE_NAME,
            "company": "NovaBooks",
            "role": "Product UI Engineer",
            "stage": "applied",
            "status_label": "Profile submitted",
            "updated_at": "2026-04-25T16:00:00+05:30",
            "next_step": "Waiting for employer response.",
        },
        {
            "id": "app-riverpay",
            "candidate_name": DEMO_CANDIDATE_NAME,
            "company": "RiverPay",
            "role": "Design Systems Engineer",
            "stage": "saved",
            "status_label": "Saved for later",
            "updated_at": "2026-04-24T09:45:00+05:30",
            "next_step": "Review system ownership evidence before applying.",
        },
    ],
}


_INTERVIEWS: dict[str, Any] = {
    "candidate_id": DEMO_CANDIDATE_ID,
    "candidate_name": DEMO_CANDIDATE_NAME,
    "upcoming": [
        {
            "id": "interview-growthcart-tech",
            "company": "GrowthCart",
            "role": "Frontend Engineer",
            "starts_at": "2026-04-28T11:00:00+05:30",
            "format": "Live technical screen",
            "prep_notes": [
                "Open with the optimistic UI tradeoff example.",
                "Name uncertainty clearly when discussing large-system scaling.",
            ],
            "join_room_action": {
                "label": "Join room",
                "enabled": True,
                "route": "/interview-room/interview-growthcart-tech",
            },
        }
    ],
    "past": [
        {
            "id": "interview-placedon-hcv",
            "company": "PlacedOn demo assessment",
            "role": DEMO_TARGET_ROLE,
            "completed_at": "2026-04-24T14:30:00+05:30",
            "summary": "Generated high-confidence communication and frontend execution evidence.",
        }
    ],
}


_EMPLOYER: dict[str, Any] = {
    "employer": {
        "id": "demo-employer-growthcart",
        "company": "GrowthCart",
        "viewer_name": "Maya Rao",
        "active_role": "Frontend Engineer",
    },
    "jobs": [
        {
            "id": "job-growthcart-frontend",
            "title": "Frontend Engineer",
            "location": "Bengaluru hybrid",
            "status": "Active",
            "candidate_matches": 12,
        },
        {
            "id": "job-growthcart-ui-platform",
            "title": "UI Platform Engineer",
            "location": "Remote India",
            "status": "Draft",
            "candidate_matches": 5,
        },
    ],
    "candidate_discovery_feed": [
        {
            "candidate_id": DEMO_CANDIDATE_ID,
            "candidate_name": DEMO_CANDIDATE_NAME,
            "role_fit": "Frontend Engineer",
            "location": DEMO_LOCATION,
            "match_label": "High-fit overlooked candidate",
            "evidence_reason": "Frontend execution, collaboration clarity, and growth signals are backed by interview evidence.",
            "actions": ["express_interest", "request_intro", "pass"],
        },
        {
            "candidate_id": "demo-candidate-ruhan-mehta",
            "candidate_name": "Ruhan Mehta",
            "role_fit": "Frontend Engineer",
            "location": "Pune, India",
            "match_label": "Emerging fit",
            "evidence_reason": "Strong implementation pace with less evidence around stakeholder communication.",
            "actions": ["express_interest", "request_intro", "pass"],
        },
    ],
    "saved_shortlist": [
        {
            "candidate_id": DEMO_CANDIDATE_ID,
            "candidate_name": DEMO_CANDIDATE_NAME,
            "saved_for_job": "Frontend Engineer",
            "note": "Review profile with hiring manager.",
        }
    ],
    "intro_request_state": {
        "candidate_id": DEMO_CANDIDATE_ID,
        "status": "not_requested",
        "available_actions": ["request_intro", "express_interest", "pass"],
    },
}


_SETTINGS: dict[str, Any] = {
    "candidate_id": DEMO_CANDIDATE_ID,
    "candidate_name": DEMO_CANDIDATE_NAME,
    "groups": [
        {
            "id": "profile",
            "label": "Profile",
            "settings": [
                {"id": "selected_role", "label": "Selected role", "value": DEMO_TARGET_ROLE},
                {"id": "availability", "label": "Availability", "value": "Available for interviews"},
            ],
        },
        {
            "id": "privacy",
            "label": "Privacy",
            "settings": [
                {"id": "profile_visibility", "label": "Profile visibility", "value": "Matched employers only"},
                {"id": "evidence_sharing", "label": "Evidence sharing", "value": "Candidate-approved snippets"},
            ],
        },
        {
            "id": "notifications",
            "label": "Notifications",
            "settings": [
                {"id": "interview_reminders", "label": "Interview reminders", "value": "Enabled"},
                {"id": "employer_interest", "label": "Employer interest alerts", "value": "Enabled"},
            ],
        },
    ],
    "privacy_controls": [
        {
            "id": "employer_visibility",
            "label": "Matched employer visibility",
            "enabled": True,
            "candidate_controlled": True,
        },
        {
            "id": "share_profile_link",
            "label": "Shareable profile link",
            "enabled": True,
            "candidate_controlled": True,
        },
        {
            "id": "raw_vector_access",
            "label": "Raw HCV vector access",
            "enabled": False,
            "candidate_controlled": True,
            "note": "Frontend receives summaries and evidence only.",
        },
    ],
}


@router.get("/candidate")
async def get_demo_candidate() -> dict[str, Any]:
    return _frontend_candidate()


@router.get("/hcv")
async def get_demo_hcv() -> dict[str, Any]:
    return _frontend_hcv()


@router.get("/dashboard")
async def get_demo_dashboard() -> dict[str, Any]:
    return _frontend_dashboard()


@router.get("/matches")
async def get_demo_matches() -> dict[str, Any]:
    return _frontend_matches()


@router.get("/applications")
async def get_demo_applications() -> dict[str, Any]:
    return _frontend_applications()


@router.get("/interviews")
async def get_demo_interviews() -> dict[str, Any]:
    return _frontend_interviews()


@router.get("/employer")
async def get_demo_employer() -> dict[str, Any]:
    return _frontend_employer()


@router.get("/settings")
async def get_demo_settings() -> dict[str, Any]:
    return _frontend_settings()
