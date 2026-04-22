from layer5.scorer import ScoringEngine


class _FakeKAN:
    def __init__(self, *args, **kwargs) -> None:
        self.loaded_state = None
        self.eval_called = False

    def load_state_dict(self, state_dict) -> None:
        self.loaded_state = state_dict

    def eval(self) -> None:
        self.eval_called = True


def test_scoring_engine_uses_weights_only_torch_load(monkeypatch, tmp_path) -> None:
    model_path = tmp_path / "basic_model.kan"
    model_path.write_bytes(b"stub")

    fake_model = _FakeKAN()
    captured: dict[str, object] = {}

    def fake_torch_load(path, *, map_location, weights_only):
        captured["path"] = path
        captured["weights_only"] = weights_only
        captured["map_location"] = map_location
        return {"weights": [1, 2, 3]}

    monkeypatch.setattr("layer5.scorer.KAN", lambda *args, **kwargs: fake_model)
    monkeypatch.setattr("layer5.scorer.torch.load", fake_torch_load)

    engine = ScoringEngine(model_path=str(model_path))

    assert engine.model is fake_model
    assert captured["path"] == str(model_path)
    assert captured["weights_only"] is True
    assert fake_model.loaded_state == {"weights": [1, 2, 3]}
    assert fake_model.eval_called is True
