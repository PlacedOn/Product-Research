from __future__ import annotations

import pytest
from pydantic import ValidationError


def test_hcv_read_model_uses_normalized_scores_and_no_raw_vectors():
    from backend.app.read_models import EvidenceDimension, HCVResponse

    response = HCVResponse(
        summary="Evidence-backed frontend profile",
        embedding_metadata={
            "model": "all-MiniLM-L6-v2",
            "dimension_count": 384,
            "last_updated": "2026-04-30T00:00:00+05:30",
        },
        dimensions=[
            EvidenceDimension(
                dimension="Technical execution",
                score=0.82,
                confidence=0.74,
                uncertainty=0.18,
                evidence_snippets=["Explained a migration rollback plan."],
            )
        ],
    )

    dumped = response.model_dump()

    assert dumped["dimensions"][0]["score"] == 0.82
    assert "vector" not in str(dumped).lower()

    with pytest.raises(ValidationError):
        EvidenceDimension(
            dimension="Technical execution",
            score=82,
            confidence=0.74,
            uncertainty=0.18,
            evidence_snippets=["Would incorrectly mix 0-100 HCV scoring."],
        )


def test_match_read_model_uses_fit_score_0_to_100():
    from backend.app.read_models import MatchItem

    match = MatchItem(
        id="match_1",
        company="GrowthCart",
        role="Frontend Engineer",
        location="Bengaluru, India",
        fit_score=91,
        match_label="strong",
        evidence_reason="Strong role-aligned evidence.",
        action_type="apply",
    )

    assert match.fit_score == 91

    with pytest.raises(ValidationError):
        MatchItem(
            id="match_2",
            company="GrowthCart",
            role="Frontend Engineer",
            location="Bengaluru, India",
            fit_score=0.91,
            match_label="strong",
            evidence_reason="Incorrect normalized match score.",
            action_type="apply",
        )


def test_employer_candidate_detail_exposes_safe_evidence_not_raw_identity():
    from backend.app.read_models import EmployerCandidateDetailResponse, EvidenceItem

    detail = EmployerCandidateDetailResponse(
        anonymous_id="anon_aisha_001",
        candidate_name=None,
        contact_email=None,
        target_role="Frontend Engineer",
        match_id="match_1",
        fit_score=91,
        evidence=[
            EvidenceItem(
                id="evidence_1",
                dimension="Communication",
                display_text="Clarified tradeoffs before committing to an implementation path.",
                ai_summary="Clear tradeoff communication.",
                visibility="employer_matched",
                bias_checked=True,
                redaction_status="not_needed",
            )
        ],
    )

    dumped = detail.model_dump()

    assert dumped["anonymous_id"] == "anon_aisha_001"
    assert dumped["candidate_name"] is None
    assert dumped["contact_email"] is None
    assert "source_text" not in dumped["evidence"][0]

    with pytest.raises(ValidationError):
        EvidenceItem(
            id="evidence_2",
            dimension="Communication",
            display_text="Unreviewed transcript excerpt.",
            ai_summary="Unsafe evidence.",
            visibility="candidate_only",
            bias_checked=False,
            redaction_status="not_needed",
        )
