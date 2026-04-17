# PlacedOn Repo Restructure Design

**Date:** 2026-04-18

## Goal

Restructure the repository so the top-level project content is organized into two main folders:

- `PlacedOn/` for implementation code
- `PlacedOn-Research/` for research, product, business, and inspiration material

The root should remain minimal and keep only repository metadata and a small set of top-level control files.

## Approved Direction

Use a conservative two-folder split:

- move all implementation modules into `PlacedOn/`
- move all research and documentation material into `PlacedOn-Research/`
- keep repo metadata and a minimal set of root files at the top level
- update path references, docs, and runtime assumptions as part of the same migration

This avoids temporary shims and avoids a half-migrated state.

## Target Layout

### Root

The repository root should remain minimal. It will keep:

- `.git/` and normal Git metadata
- `.gitignore` if present
- agent and tool metadata files that are intended to live at repo root
- a small top-level `README.md` that explains the split

It should not continue to host the main product and research directories directly.

### `PlacedOn/`

This folder becomes the home for implementation code:

- `PlacedOn/backend/`
- `PlacedOn/interaction_layer/`
- `PlacedOn/interview_system/`
- `PlacedOn/aot_layer/`
- `PlacedOn/layer2/`
- `PlacedOn/layer3/`
- `PlacedOn/layer5/`
- `PlacedOn/tests/`
- `PlacedOn/training/`

### `PlacedOn-Research/`

This folder becomes the home for non-code project material:

- `PlacedOn-Research/business/`
- `PlacedOn-Research/product/`
- `PlacedOn-Research/research/`
- `PlacedOn-Research/personas/`
- `PlacedOn-Research/problems/`
- `PlacedOn-Research/Markovian-Reasoning/`
- `PlacedOn-Research/docs/`
- `PlacedOn-Research/INDEX.md`
- `PlacedOn-Research/RESEARCH-SUMMARY.md`
- `PlacedOn-Research/IMPLEMENTATION-ROADMAP.md`
- `PlacedOn-Research/START-HERE.md`
- `PlacedOn-Research/Inspo/`

## Files That Need Judgment During Move

### Keep at Root

These should stay at repo root unless inspection shows they must move:

- `README.md`
- `CLAUDE.md`
- `.mcp.json` if it is still part of the repo
- tool or agent config files that are expected at repo root

Reason: these files act as repository entrypoints or tool metadata, and moving them would create unnecessary breakage.

### Move to `PlacedOn-Research/`

These are documentation artifacts, not runtime code:

- `INDEX.md`
- `RESEARCH-SUMMARY.md`
- `IMPLEMENTATION-ROADMAP.md`
- `START-HERE.md`
- `docs/`

## Expected Breakage Surface

This migration will break any code or docs that assume the current repo root layout. The most likely breakpoints are:

1. Python imports or `sys.path` setup that assume code modules are one level below the repo root
2. README and setup commands that use old paths such as `cd backend`
3. `CLAUDE.md` references to active implementation and document locations
4. tests that assume current working directory conventions
5. scripts or manual commands that reference old relative paths

## Required Migration Updates

The restructure is only acceptable if these are updated in the same change.

### Code Path Updates

- inspect runtime files using explicit root-path manipulation
- update any `sys.path.append(...)` logic that depends on the old root structure
- verify that Python modules still import correctly from the new location under `PlacedOn/`

### Documentation Updates

- update root `README.md` to explain the two-folder structure
- update `CLAUDE.md` so the active implementation paths point to `PlacedOn/...`
- update setup and run commands from old paths to the new ones
- update any internal references in research docs where old paths are misleading or central

### Command Updates

Examples of expected command changes:

- from `cd backend` to `cd PlacedOn/backend`
- from `python3 -m pytest -q aot_layer/tests` to `python3 -m pytest -q PlacedOn/aot_layer/tests`

## Migration Plan

The restructure should happen in one controlled implementation pass:

1. create `PlacedOn/` and `PlacedOn-Research/`
2. move the approved code directories into `PlacedOn/`
3. move research and documentation directories/files into `PlacedOn-Research/`
4. update docs and path references
5. run a verification pass focused on path integrity
6. commit the migration cleanly

## Non-Goals

This change should not:

- refactor business logic
- redesign the code architecture
- clean up every test/import issue in the repo
- introduce temporary compatibility symlinks
- move Git metadata or break repository-level tooling

## Verification Standard

Success means:

1. the top-level layout clearly centers around `PlacedOn/` and `PlacedOn-Research/`
2. docs and commands no longer point to stale root-level code locations
3. Python path assumptions that would obviously break are updated
4. the worktree reflects a coherent migration rather than a raw file shuffle

## Risks

### Import Path Risk

The codebase already relies on path-sensitive imports and direct `sys.path` manipulation. A raw move without code updates would leave the runtime broken.

### Tooling Drift Risk

`CLAUDE.md` and other root guidance files are already partially stale. If they are not updated during the migration, the repo becomes harder to use immediately after the move.

### Mixed Worktree Risk

The repository currently has unrelated tracked changes. The migration commit must be staged carefully so unrelated edits are not mixed into the restructure.

## Recommendation

Proceed with a single migration commit that:

- creates the two target folders
- moves code into `PlacedOn/`
- moves research/docs into `PlacedOn-Research/`
- updates root guidance and path references

Do not add compatibility shims unless the move exposes a hard blocker that cannot be resolved in the same pass.
