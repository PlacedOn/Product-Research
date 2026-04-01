from interaction_layer.models import RecoveryAction


class RecoveryManager:
    async def on_silence(self) -> RecoveryAction:
        return RecoveryAction(
            action="reprompt",
            message="I did not catch that. Please continue your answer when ready.",
            retryable=True,
        )

    async def on_low_confidence(self) -> RecoveryAction:
        return RecoveryAction(
            action="clarify",
            message="I may have misheard you. Could you repeat that clearly?",
            retryable=True,
        )

    async def on_stt_failure(self) -> RecoveryAction:
        return RecoveryAction(
            action="retry",
            message="Voice processing failed. Retrying safely now.",
            retryable=True,
        )
