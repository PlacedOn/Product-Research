from aot_layer.models import InterviewState


class Decomposer:
    async def pick_skill(self, state: InterviewState) -> str:
        scored = [(skill, state.sigma2.get(skill, 0.0)) for skill in state.skills]
        max_sigma = max(value for _, value in scored)
        for skill, value in scored:
            if value == max_sigma:
                return skill
        return state.skills[0]
