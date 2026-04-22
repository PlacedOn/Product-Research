from __future__ import annotations
from typing import Optional

from collections.abc import Awaitable, Callable

from aot_layer.config import AoTConfig
from aot_layer.models import InterviewState, QuestionRequest, StartInput
from aot_layer.orchestrator import AoTOrchestrator
from interview_system.models import FullStackResult, InterviewTurnTrace
from layer2.adapter import CapabilityAdapter
from layer2.ast_evaluator import ASTEvaluator
from layer2.behavioral import BehavioralSignalTracker
from layer2.models import Layer2Output
from layer3.bias_classifier import BiasEnforcer
from layer3.fallback import SafeQuestionPipeline
from layer3.integrity import BehavioralIntegrityEngine
from layer3.models import IntegrityInput
from layer5.aggregator import AggregationEngine
from layer5.matcher import FitMatcher
from layer5.models import FitInput, InterviewTurn, RenderInput, SkillTurnSignal
from layer5.renderer import ProfileRenderer
from layer5.storage import CandidateRepository
from backend.llm.consensus_judge import ConsensusJudge

AnswerProvider = Callable[[int, str, str, str], Awaitable[str]]


class FullStackInterviewOrchestrator:
    def __init__(self, config:Optional[ AoTConfig] = None, repository:Optional[ CandidateRepository] = None) -> None:
        self._aot = AoTOrchestrator(config=config or AoTConfig())

        self._adapter = CapabilityAdapter()
        self._ast = ASTEvaluator()
        self._behavioral = BehavioralSignalTracker()

        self._safe_pipeline = SafeQuestionPipeline(bias_enforcer=BiasEnforcer())
        self._integrity = BehavioralIntegrityEngine()

        self._aggregator = AggregationEngine()
        self._matcher = FitMatcher()
        self._renderer = ProfileRenderer()
        self._repo = repository or CandidateRepository()
        self._consensus_judge = ConsensusJudge()

    async def run(
        self,
        candidate_id: str,
        start_input: StartInput,
        answer_provider: AnswerProvider,
        role_vector:Optional[ list[float]] = None,
        preference_vector:Optional[ list[float]] = None,
        max_turns: int = 5,
    ) -> FullStackResult:
        state = await self._aot.initialize_state(start_input)

        mode = "new"
        traces: list[InterviewTurnTrace] = []
        adapter_history = []
        embedding_history: list[list[float]] = []
        layer5_turns: list[InterviewTurn] = []
        target_dim:Optional[ int] = None

        while len(traces) < max_turns and state.turn_index < self._aot.config.total_turn_limit:
            turn_mode = mode
            active_skill = state.current_skill
            state.current_difficulty = self._aot.controller.difficulty_for_skill(state, active_skill)

            question_out = await self._aot.generator.generate(
                QuestionRequest(
                    target_skill=active_skill,
                    difficulty=state.current_difficulty,
                    mode=turn_mode,
                )
            )

            guardrail = await self._safe_pipeline.validate(
                question=question_out.question,
                skill=question_out.skill,
                difficulty=question_out.difficulty,
            )
            safe_question = guardrail.question

            answer = await answer_provider(
                state.turn_index,
                safe_question,
                active_skill,
                turn_mode,
            )

            judge_result = await self._aot.judge.evaluate(active_skill, answer)

            adapter_out = await self._adapter.process(answer)
            adapter_history.append(adapter_out)
            embedding_history.append(adapter_out.embedding)

            behavioral = await self._behavioral.track(adapter_history)
            integrity = await self._integrity.evaluate(
                IntegrityInput(
                    embeddings=embedding_history,
                    consistency_score=behavioral.consistency_score,
                    drift_score=behavioral.drift_score,
                    confidence_signal=behavioral.confidence_signal,
                )
            )

            trust_factor = 0.7 + (0.3 * integrity.trust_score)
            adjusted_confidence = round(max(0.0, min(judge_result.confidence * trust_factor, 1.0)), 2)

            state.turn_index += 1
            state.turns_per_skill[active_skill] = state.turns_per_skill.get(active_skill, 0) + 1
            state.consecutive_turns[active_skill] = state.consecutive_turns.get(active_skill, 0) + 1
            
            # Phase 2: State Contraction (Atomic Update)
            state.skill_vector[active_skill] = adjusted_confidence
            state.sigma2[active_skill] = round(1.0 - adjusted_confidence, 2)

            # Phase 3: Consensus Judge (Drift Check)
            consensus = await self._consensus_judge.check_drift(
                question=safe_question,
                answer=answer,
                previous_state=state.compress_to_markov_state(), # Note: ideally this should be a snapshot before contraction
                proposed_state=state.compress_to_markov_state()
            )
            
            if consensus.any_drift_detected or consensus.best_match != "C":
                # Penalize confidence if state drift is detected
                drift_penalty = 1.0 - consensus.drift_score
                adjusted_confidence = round(adjusted_confidence * drift_penalty, 2)
                state.skill_vector[active_skill] = adjusted_confidence
                state.sigma2[active_skill] = round(1.0 - adjusted_confidence, 2)

            end_decision = await self._aot.controller.decide_end(state, judge_result)
            if end_decision.action == "probe":
                state.probes_per_skill[active_skill] = state.probes_per_skill.get(active_skill, 0) + 1
            elif end_decision.action == "retry":
                state.retries_per_skill[active_skill] = state.retries_per_skill.get(active_skill, 0) + 1
            else:
                if end_decision.next_skill != active_skill:
                    state.consecutive_turns[active_skill] = 0
                state.current_skill = end_decision.next_skill
                state.current_difficulty = self._aot.controller.difficulty_for_skill(state, end_decision.next_skill)
            mode = end_decision.next_mode

            code_analysis = await self._ast.analyze(answer)
            layer2_out = Layer2Output(
                skills=adapter_out.skills,
                embedding=adapter_out.embedding,
                behavioral_signals=behavioral,
                code_analysis=code_analysis,
            )

            if target_dim is None:
                target_dim = max(len(layer2_out.embedding), 1)
            fixed_embedding = self._fit_dimension(layer2_out.embedding, target_dim)

            layer5_turns.append(
                self._to_layer5_turn(
                    turn_index=state.turn_index,
                    layer2_out=layer2_out,
                    fixed_embedding=fixed_embedding,
                    active_skill=active_skill,
                    judge_evidence=judge_result.evidence,
                )
            )

            traces.append(
                InterviewTurnTrace(
                    turn=state.turn_index,
                    skill=active_skill,
                    mode=turn_mode,
                    raw_question=question_out.question,
                    safe_question=safe_question,
                    used_fallback=guardrail.used_fallback,
                    trust_score=integrity.trust_score,
                    anomaly_flag=integrity.anomaly_flag,
                    answer=answer,
                    judge_confidence=judge_result.confidence,
                    adjusted_confidence=adjusted_confidence,
                    drift_score=consensus.drift_score,
                    best_match=consensus.best_match,
                )
            )

        aggregate = await self._aggregator.aggregate(layer5_turns)

        candidate = await self._repo.save_from_aggregate(
            candidate_id=candidate_id,
            embedding=aggregate.embedding,
            skills=aggregate.skills,
            metadata={
                "turn_count": len(layer5_turns),
                "latest_trust": traces[-1].trust_score if traces else 0.0,
                "latest_anomaly": traces[-1].anomaly_flag if traces else False,
            },
        )

        role = self._fit_dimension(role_vector or aggregate.embedding, len(aggregate.embedding))
        preference = None
        if preference_vector is not None:
            preference = self._fit_dimension(preference_vector, len(aggregate.embedding))

        fit = await self._matcher.predict(
            FitInput(
                candidate_embedding=candidate.embedding,
                role_vector=role,
                preference_vector=preference,
            )
        )

        rendered_profile = await self._renderer.render(
            RenderInput(candidate_id=candidate_id, skills=candidate.skills),
            top_n=3,
        )

        return FullStackResult(
            candidate_id=candidate_id,
            final_state=state,
            turns=traces,
            candidate_profile=candidate,
            fit=fit,
            rendered_profile=rendered_profile,
        )

    def _fit_dimension(self, vector: list[float], target_dim: int) -> list[float]:
        if target_dim <= 0:
            return []
        if len(vector) == target_dim:
            return vector
        if len(vector) > target_dim:
            return vector[:target_dim]
        return vector + [0.0] * (target_dim - len(vector))

    def _to_layer5_turn(
        self,
        turn_index: int,
        layer2_out: Layer2Output,
        fixed_embedding: list[float],
        active_skill: str,
        judge_evidence: list[str],
    ) -> InterviewTurn:
        skill_signals: dict[str, SkillTurnSignal] = {}
        for skill, state in layer2_out.skills.items():
            confidence = round(max(0.05, min(1.0 - state.uncertainty, 1.0)), 4)
            evidence = [
                f"layer2:{skill}:score={state.score}",
                f"layer2:{skill}:uncertainty={state.uncertainty}",
            ]
            if skill == active_skill:
                evidence.extend(item for item in judge_evidence if item not in evidence)

            skill_signals[skill] = SkillTurnSignal(
                score=state.score,
                confidence=confidence,
                evidence=evidence,
            )

        return InterviewTurn(
            turn_index=turn_index,
            confidence=layer2_out.behavioral_signals.confidence_signal,
            embedding=fixed_embedding,
            skills=skill_signals,
        )
