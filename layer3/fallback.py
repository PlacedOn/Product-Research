from layer3.bias_classifier import BiasEnforcer
from layer3.config import Layer3Config
from layer3.models import GuardrailDecision


class FallbackGenerator:
    async def generate(self, skill: str, difficulty: str) -> str:
        skill_name = (skill or "this topic").strip()
        level = (difficulty or "medium").strip().lower()

        templates = {
            "easy": "Explain the basic approach you would use for {skill} in a real-world system.",
            "medium": "Explain how you would approach {skill} in a real-world system, including key trade-offs.",
            "hard": "Design a robust strategy for {skill} in a production system and justify your trade-offs.",
        }
        template = templates.get(level, templates["medium"])
        return template.format(skill=skill_name)


class SafeQuestionPipeline:
    def __init__(
        self,
        bias_enforcer: BiasEnforcer,
        fallback_generator: FallbackGenerator | None = None,
        config: Layer3Config | None = None,
    ) -> None:
        self._bias_enforcer = bias_enforcer
        self._fallback_generator = fallback_generator or FallbackGenerator()
        self._config = config or Layer3Config()

    async def validate(self, question: str, skill: str, difficulty: str) -> GuardrailDecision:
        initial_bias = await self._bias_enforcer.assess(question)
        if initial_bias.approved:
            return GuardrailDecision(
                question=question,
                initial_bias=initial_bias,
                final_bias=initial_bias,
                used_fallback=False,
                generic_fallback_used=False,
            )

        fallback_question = await self._fallback_generator.generate(skill=skill, difficulty=difficulty)
        fallback_bias = await self._bias_enforcer.assess(fallback_question)
        if fallback_bias.approved:
            return GuardrailDecision(
                question=fallback_question,
                initial_bias=initial_bias,
                final_bias=fallback_bias,
                used_fallback=True,
                generic_fallback_used=False,
            )

        generic = self._config.generic_safe_question
        generic_bias = await self._bias_enforcer.assess(generic)
        return GuardrailDecision(
            question=generic,
            initial_bias=initial_bias,
            final_bias=generic_bias,
            used_fallback=True,
            generic_fallback_used=True,
        )
