from aot_layer.mock_llm import generate_question_text
from aot_layer.models import QuestionOutput, QuestionRequest


class QuestionGenerator:
    async def generate(self, request: QuestionRequest) -> QuestionOutput:
        question = await generate_question_text(
            target_skill=request.target_skill,
            difficulty=request.difficulty,
            mode=request.mode,
        )
        return QuestionOutput(
            question=question,
            skill=request.target_skill,
            difficulty=request.difficulty,
        )
