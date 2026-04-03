from aot_layer.models import QuestionOutput, QuestionRequest
from backend.llm.generator import generate_question


class QuestionGenerator:
    async def generate(self, request: QuestionRequest) -> QuestionOutput:
        generated = await generate_question(
            context={
                "candidate": {
                    "name": "AoT Candidate",
                    "experience_years": 2,
                    "skills": [request.target_skill],
                    "projects": [],
                    "education": "",
                },
                "job": {
                    "role": "Backend Engineer",
                    "level": "mid",
                    "required_skills": [request.target_skill],
                    "preferred_skills": [],
                },
                "focus_skill": request.target_skill,
            },
            strategy="conceptual",
            previous_qna=[{"mode": request.mode}],
        )
        return QuestionOutput(
            question=generated.question,
            skill=generated.skill,
            difficulty=request.difficulty,
        )
