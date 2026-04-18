from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
SCRIPT_PATH = REPO_ROOT / "scripts" / "sync_frontend.py"


def load_sync_module():
    spec = spec_from_file_location("sync_frontend", SCRIPT_PATH)
    module = module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def test_sync_tree_mirrors_source_without_git_metadata(tmp_path):
    sync_frontend = load_sync_module()

    source = tmp_path / "source"
    dest = tmp_path / "dest"

    (source / "app").mkdir(parents=True)
    (source / "public").mkdir(parents=True)
    (source / ".git").mkdir(parents=True)
    (source / "app" / "page.tsx").write_text("export default function Page() {}\n")
    (source / "public" / "logo.svg").write_text("<svg />\n")
    (source / ".git" / "config").write_text("[core]\n")

    (dest / "stale").mkdir(parents=True)
    (dest / "stale" / "old.txt").write_text("remove me\n")
    (dest / "public").mkdir(parents=True)
    (dest / "public" / "old-logo.svg").write_text("<svg>old</svg>\n")

    sync_frontend.sync_tree(source, dest)

    assert (dest / "app" / "page.tsx").read_text() == "export default function Page() {}\n"
    assert (dest / "public" / "logo.svg").read_text() == "<svg />\n"
    assert not (dest / "stale").exists()
    assert not (dest / "public" / "old-logo.svg").exists()
    assert not (dest / ".git").exists()
