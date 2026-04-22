from __future__ import annotations
import asyncio

from layer2.adapter import CapabilityAdapter
from layer2.ast_evaluator import ASTEvaluator
from layer2.behavioral import BehavioralSignalTracker
from layer2.models import Layer2Output


async def _run_flow() -> tuple[Layer2Output, int]:
    answers = [
        "I owned a missed deadline and aligned stakeholders on the recovery plan.",
        "Under pressure, I stayed calm, clarified priorities, and followed through every day.",
        "def f(items):\n    for x in items:\n        if x > 0:\n            return x\n    return None",
        "After the retro, I asked for feedback and changed the rollout checklist for the next launch.",
    ]

    adapter = CapabilityAdapter()
    ast_eval = ASTEvaluator()
    behavioral = BehavioralSignalTracker()

    history = []
    code_hits = 0
    for answer in answers:
        adapted = await adapter.process(answer)
        history.append(adapted)
        analysis = await ast_eval.analyze(answer)
        if analysis is not None and analysis.active:
            code_hits += 1

    signals = await behavioral.track(history)
    output = Layer2Output(
        skills=history[-1].skills,
        embedding=history[-1].embedding,
        behavioral_signals=signals,
        code_analysis=await ast_eval.analyze(answers[2]),
    )
    return output, code_hits


def test_full_flow_tracks_embeddings_and_behavior() -> None:
    output, code_hits = asyncio.run(_run_flow())

    assert output.embedding
    assert "block_8_ownership" in output.skills
    assert output.behavioral_signals.confidence_signal > 0.0
    assert code_hits >= 1
    assert output.code_analysis is not None
