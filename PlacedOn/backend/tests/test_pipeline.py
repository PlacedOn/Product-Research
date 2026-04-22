from __future__ import annotations
import asyncio
import json

from backend.pipeline.context_builder import build_context
from backend.pipeline.conversation_orchestrator import generate_intro
from backend.pipeline.planner import plan_next_step
from backend.schemas.generator_schema import CandidateProfile, JobProfile


def test_case1_backend_role_focus_not_frontend_heavy() -> None:
    context = build_context(
        candidate={
            "name": "A",
            "experience_years": 2,
            "skills": ["React", "Node"],
            "projects": [],
            "education": "",
        },
        job={
            "role": "Backend Engineer",
            "level": "mid",
            "required_skills": ["API design", "databases"],
            "preferred_skills": ["caching"],
        },
    )

    assert context["interview_focus"] == "backend systems"
    assert "api design" in context["skill_gaps"]
    assert "databases" in context["skill_gaps"]


def test_planner_returns_valid_plan(monkeypatch) -> None:
    plan = asyncio.run(
        plan_next_step(
            {
                "minimal_state": {
                    "last_score": 0.83,
                    "difficulty": "hard",
                },
                "candidate": {
                    "name": "A",
                    "experience_years": 5,
                    "skills": ["Leadership", "Ownership"],
                    "projects": ["Cross-functional launch"],
                    "education": "B.Tech",
                },
                "job": {
                    "role": "Operations Manager",
                    "company": "PlacedOn",
                    "level": "mid",
                    "required_skills": ["leadership", "ownership"],
                    "preferred_skills": ["resilience"],
                    "description": "Needs strong stakeholder management, ownership, and calm decision-making.",
                },
                "last_question": "Tell me about a time you led through ambiguity.",
                "last_answer": "I aligned the team, reset priorities, and kept stakeholders updated.",
                "evaluation": {
                    "score": 0.83,
                    "confidence": 0.79,
                    "strengths": ["clear stakeholder alignment"],
                    "weaknesses": ["none major"],
                    "missing_concepts": [],
                    "intent": "clear_understanding",
                    "depth": "strong",
                    "clarity": "clear",
                },
                "interview_state": {
                    "phase": "behavioral",
                    "history": [],
                    "covered_skills": ["block_8_ownership"],
                    "current_focus": "",
                    "skill_scores": {
                        "block_6_leadership": 0.35,
                        "block_8_ownership": 0.72,
                        "block_5_resilience": 0.4,
                    },
                },
            }
        )
    )
    assert plan.action == "challenge"
    assert plan.target_skill in {"block_6_social", "block_6_leadership"}
    assert plan.difficulty == "hard"


def test_intro_generation_returns_conversational_opener(monkeypatch) -> None:
    def fake_call_ollama(*_args, **_kwargs):
        return json.dumps(
            {
                "intro": "Hi A, welcome. We're interviewing for the Backend Engineer role at PlacedOn. We'll start with your experience and move into technical depth. Could you briefly introduce yourself?"
            }
        )

    monkeypatch.setattr("backend.pipeline.conversation_orchestrator.call_ollama", fake_call_ollama)

    intro = asyncio.run(
        generate_intro(
            candidate=CandidateProfile(
                name="A",
                experience_years=2,
                skills=["Node"],
                projects=["API platform"],
                education="B.Tech",
            ),
            job=JobProfile(
                role="Backend Engineer",
                company="PlacedOn",
                level="mid",
                required_skills=["api design"],
                preferred_skills=["caching"],
            ),
        )
    )
    assert "Backend Engineer" in intro
    assert "introduce" in intro.lower()
