import asyncio
import json

from backend.llm.generator import generate_question


def test_generator_returns_valid_json_structure(monkeypatch) -> None:
    def fake_call_ollama(*_args, **_kwargs):
        return json.dumps(
            {
                "question": "How would you design cache invalidation for a read-heavy product catalog?",
                "skill": "caching",
                "difficulty": "hard",
                "type": "system_design",
            }
        )

    monkeypatch.setattr("backend.llm.generator.call_ollama", fake_call_ollama)

    result = asyncio.run(
        generate_question(
            context={
                "candidate": {
                    "name": "Sam",
                    "experience_years": 2,
                    "skills": ["node", "caching"],
                    "projects": ["catalog"],
                    "education": "B.Tech",
                },
                "job": {
                    "role": "Backend Engineer",
                    "level": "mid",
                    "required_skills": ["caching", "api design"],
                    "preferred_skills": ["distributed systems"],
                },
                "focus_skill": "caching",
            },
            strategy="system_design",
            previous_qna=[{"question": "What is TTL?"}],
        )
    )

    assert result.question.strip()
    assert result.skill == "caching"
    assert result.difficulty in {"easy", "medium", "hard"}
    assert result.type in {"conceptual", "system_design", "behavioral"}


def test_generator_raises_on_invalid_ollama_payload(monkeypatch) -> None:
    def invalid_call_ollama(*_args, **_kwargs):
        return "not json"

    monkeypatch.setattr("backend.llm.generator.call_ollama", invalid_call_ollama)

    try:
        asyncio.run(
            generate_question(
                context={
                    "candidate": {
                        "name": "Sam",
                        "experience_years": 1,
                        "skills": ["node"],
                        "projects": [],
                        "education": "",
                    },
                    "job": {
                        "role": "Backend Engineer",
                        "level": "junior",
                        "required_skills": ["api design"],
                        "preferred_skills": [],
                    },
                    "focus_skill": "api design",
                },
                strategy="conceptual",
                previous_qna=[],
            )
        )
        raise AssertionError("Expected ValueError for invalid JSON")
    except ValueError:
        pass
