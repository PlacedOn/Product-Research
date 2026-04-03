from backend.pipeline.context_builder import build_context
from backend.pipeline.question_strategy import decide_question_type


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


def test_case2_strong_candidate_pushes_deep_dive() -> None:
    strategy = decide_question_type(
        {
            "round": 3,
            "last_score": 0.91,
            "covered_skills": ["caching"],
        }
    )
    assert strategy == "deep_dive"


def test_case3_weak_answer_forces_follow_up() -> None:
    strategy = decide_question_type(
        {
            "round": 2,
            "last_score": 0.4,
            "covered_skills": ["api design"],
        }
    )
    assert strategy == "follow_up"
