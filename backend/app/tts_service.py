from __future__ import annotations

import base64
import subprocess
import tempfile
from pathlib import Path


class TTSServiceError(Exception):
    pass


class MacTTSService:
    @staticmethod
    def list_voices() -> list[str]:
        try:
            result = subprocess.run(["say", "-v", "?"], check=True, capture_output=True, text=True)
        except (FileNotFoundError, subprocess.CalledProcessError) as exc:
            raise TTSServiceError("Failed to list system voices via say command") from exc

        voices: list[str] = []
        for line in result.stdout.splitlines():
            stripped = line.strip()
            if not stripped:
                continue
            voice_name = stripped.split()[0]
            if voice_name and voice_name not in voices:
                voices.append(voice_name)
        return voices

    @staticmethod
    def resolve_voice(requested_voice: str | None, available_voices: list[str]) -> str:
        preferred = ["Samantha", "Allison", "Ava", "Daniel", "Alex"]
        if requested_voice and requested_voice in available_voices:
            return requested_voice
        for voice in preferred:
            if voice in available_voices:
                return voice
        if not available_voices:
            raise TTSServiceError("No system voices available")
        return available_voices[0]

    @classmethod
    def synthesize(cls, text: str, voice: str | None = None, rate: int = 185) -> dict[str, str]:
        stripped_text = text.strip()
        if not stripped_text:
            raise TTSServiceError("Text is required for speech synthesis")

        voices = cls.list_voices()
        selected_voice = cls.resolve_voice(voice, voices)

        tmp_path: Path | None = None
        try:
            with tempfile.NamedTemporaryFile(suffix=".aiff", delete=False) as tmp:
                tmp_path = Path(tmp.name)

            subprocess.run(
                ["say", "-v", selected_voice, "-r", str(rate), "-o", str(tmp_path), stripped_text],
                check=True,
                capture_output=True,
                text=True,
            )

            data = tmp_path.read_bytes()
            if not data:
                raise TTSServiceError("Generated audio is empty")

            return {
                "audio_base64": base64.b64encode(data).decode("utf-8"),
                "mime_type": "audio/aiff",
                "voice": selected_voice,
            }
        except (FileNotFoundError, subprocess.CalledProcessError, OSError) as exc:
            raise TTSServiceError("Failed to synthesize speech with system voice") from exc
        finally:
            if tmp_path and tmp_path.exists():
                tmp_path.unlink(missing_ok=True)
