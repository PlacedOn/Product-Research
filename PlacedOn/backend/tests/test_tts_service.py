import base64
import subprocess
from pathlib import Path

from backend.app.tts_service import MacTTSService


def test_list_voices_uses_resolved_say_binary(monkeypatch) -> None:
    seen: dict[str, list[str]] = {}

    def fake_which(command: str) -> str | None:
        if command == "say":
            return "/usr/bin/say"
        return None

    def fake_run(args: list[str], *, check: bool, capture_output: bool, text: bool):
        seen["args"] = args
        return subprocess.CompletedProcess(
            args=args,
            returncode=0,
            stdout="Samantha en_US # English (United States)\nAva en_US # English\n",
            stderr="",
        )

    monkeypatch.setattr("backend.app.tts_service.shutil.which", fake_which)
    monkeypatch.setattr("backend.app.tts_service.subprocess.run", fake_run)

    voices = MacTTSService.list_voices()

    assert voices == ["Samantha", "Ava"]
    assert seen["args"][0] == "/usr/bin/say"


def test_synthesize_prefers_wav_when_converter_is_available(monkeypatch) -> None:
    commands: list[list[str]] = []

    def fake_which(command: str) -> str | None:
        return {
            "say": "/usr/bin/say",
            "afconvert": "/usr/bin/afconvert",
        }.get(command)

    def fake_run(args: list[str], *, check: bool, capture_output: bool, text: bool):
        commands.append(args)
        if args[0] == "/usr/bin/say" and args[1:3] == ["-v", "?"]:
            return subprocess.CompletedProcess(args=args, returncode=0, stdout="Samantha en_US\n", stderr="")
        if args[0] == "/usr/bin/say":
            Path(args[6]).write_bytes(b"AIFF")
            return subprocess.CompletedProcess(args=args, returncode=0, stdout="", stderr="")
        if args[0] == "/usr/bin/afconvert":
            Path(args[6]).write_bytes(b"WAV")
            return subprocess.CompletedProcess(args=args, returncode=0, stdout="", stderr="")
        raise AssertionError(f"Unexpected command: {args}")

    monkeypatch.setattr("backend.app.tts_service.shutil.which", fake_which)
    monkeypatch.setattr("backend.app.tts_service.subprocess.run", fake_run)

    payload = MacTTSService.synthesize("Hello from HRX", voice="Samantha", rate=190)

    assert payload["mime_type"] == "audio/wav"
    assert base64.b64decode(payload["audio_base64"]) == b"WAV"
    assert commands[0][0] == "/usr/bin/say"
    assert commands[1][0] == "/usr/bin/say"
    assert commands[2][0] == "/usr/bin/afconvert"
