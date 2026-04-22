import json
import os
from datetime import datetime
from typing import Any

from layer5.models import InterviewTurn


class InterviewExporter:
    def __init__(self, export_dir: str = "data/interviews") -> None:
        self.export_dir = export_dir
        os.makedirs(self.export_dir, exist_ok=True)

    def export_session(self, session_id: str, turns: list[InterviewTurn], metadata: dict[str, Any] | None = None) -> str:
        """
        Exports an interview session to a JSONL file.
        Each line is a turn, ready for fine-tuning ingestion.
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"interview_{session_id}_{timestamp}.jsonl"
        filepath = os.path.join(self.export_dir, filename)

        with open(filepath, "w", encoding="utf-8") as f:
            for idx, turn in enumerate(turns):
                record = {
                    "session_id": session_id,
                    "turn_index": idx,
                    "timestamp": datetime.now().isoformat(),
                    "question": turn.question,
                    "answer": turn.answer,
                    "skills_assessed": list(turn.skills.keys()),
                    "score_delta": {s: turn.skills[s].score for s in turn.skills},
                    "confidence": turn.confidence,
                    "metadata": metadata or {},
                }
                f.write(json.dumps(record) + "\n")

        return filepath
