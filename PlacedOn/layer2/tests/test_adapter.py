import asyncio

from layer2.adapter import CapabilityAdapter


def test_adapter_generates_embedding_and_skill_scores() -> None:
    adapter = CapabilityAdapter()
    output = asyncio.run(
        adapter.process(
            "I took ownership of a delayed launch, aligned the team on recovery, and followed up until we shipped."
        )
    )

    assert output.embedding
    assert "block_8_ownership" in output.skills
    assert 0.0 <= output.skills["block_8_ownership"].score <= 1.0


def test_behavioral_answers_raise_relevant_skill_scores_over_unrelated_text() -> None:
    adapter = CapabilityAdapter()
    related_a = asyncio.run(
        adapter.process(
            "I took responsibility for a missed deadline, aligned stakeholders, and kept the recovery plan moving."
        )
    )
    related_b = asyncio.run(
        adapter.process(
            "I owned the recovery plan, aligned the team and stakeholders, and followed through until the deadline risk closed."
        )
    )
    unrelated = asyncio.run(adapter.process("I like cooking and football stories on weekends."))

    assert related_a.skills["block_8_ownership"].score > unrelated.skills["block_8_ownership"].score
    assert related_b.skills["block_8_ownership"].score > unrelated.skills["block_8_ownership"].score


def test_uncertainty_updates_down_with_high_confidence_signal() -> None:
    adapter = CapabilityAdapter()
    first = asyncio.run(adapter.process("basic answer"))
    second = asyncio.run(
        adapter.process(
            "First I clarified the risk, then I aligned the team, and because the deadline mattered I followed up daily."
        )
    )

    assert second.skills["block_8_ownership"].uncertainty <= first.skills["block_8_ownership"].uncertainty
