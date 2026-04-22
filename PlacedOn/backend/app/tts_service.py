from __future__ import annotations

import base64
import logging
import shutil
import subprocess  # nosec B404
import tempfile
from pathlib import Path

LOGGER = logging.getLogger(__name__)


class TTSServiceError(Exception):
    pass


class MacTTSService:
    @staticmethod
    def _resolve_binary(command: str) -> str:
        binary_path = shutil.which(command)
        if not binary_path:
            raise TTSServiceError(f"Required system command '{command}' is unavailable")
        return binary_path

    @staticmethod
    def list_voices() -> list[str]:
        try:
            say_path = MacTTSService._resolve_binary("say")
            # Absolute path, no shell, and no user control over the executable path.
            result = subprocess.run(  # nosec B603
                [say_path, "-v", "?"],
                check=True,
                capture_output=True,
                text=True,
            )
        except (FileNotFoundError, subprocess.CalledProcessError, OSError) as exc:
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

        say_path = cls._resolve_binary("say")
        afconvert_path = shutil.which("afconvert")
        voices = cls.list_voices()
        selected_voice = cls.resolve_voice(voice, voices)
        rate_value = max(120, min(280, int(rate)))

        tmp_path: Path | None = None
        wav_path: Path | None = None
        try:
            with tempfile.NamedTemporaryFile(suffix=".aiff", delete=False) as tmp:
                tmp_path = Path(tmp.name)
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as wav_tmp:
                wav_path = Path(wav_tmp.name)

            # Voice is selected from system voices, rate is bounded, and the command never uses a shell.
            subprocess.run(  # nosec B603
                [say_path, "-v", selected_voice, "-r", str(rate_value), "-o", str(tmp_path), stripped_text],
                check=True,
                capture_output=True,
                text=True,
            )

            mime_type = "audio/aiff"
            data = tmp_path.read_bytes()

            if afconvert_path:
                try:
                    # Conversion uses an absolute binary path and internal temp files only.
                    subprocess.run(  # nosec B603
                        [
                            afconvert_path,
                            "-f",
                            "WAVE",
                            "-d",
                            "LEI16",
                            str(tmp_path),
                            str(wav_path),
                        ],
                        check=True,
                        capture_output=True,
                        text=True,
                    )
                    wav_data = wav_path.read_bytes()
                    if wav_data:
                        data = wav_data
                        mime_type = "audio/wav"
                except (subprocess.CalledProcessError, OSError) as exc:
                    LOGGER.debug("afconvert failed; serving AIFF output instead: %s", exc)
            else:
                LOGGER.debug("afconvert not available; serving AIFF output")

            if not data:
                raise TTSServiceError("Generated audio is empty")

            return {
                "audio_base64": base64.b64encode(data).decode("utf-8"),
                "mime_type": mime_type,
                "voice": selected_voice,
            }
        except (FileNotFoundError, subprocess.CalledProcessError, OSError) as exc:
            raise TTSServiceError("Failed to synthesize speech with system voice") from exc
        finally:
            if tmp_path and tmp_path.exists():
                tmp_path.unlink(missing_ok=True)
            if wav_path and wav_path.exists():
                wav_path.unlink(missing_ok=True)
