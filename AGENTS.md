<claude-mem-context>
# Memory Context

# [08-PlacedOn] recent context, 2026-05-01 2:11am GMT+5:30

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 50 obs (19,149t read) | 2,079,953t work | 99% savings

### Apr 27, 2026
217 9:11p ⚖️ PlacedOn — Backend Demo JSON API + Frontend Data Decoupling Plan Defined
219 9:12p 🔵 PlacedOn Backend Architecture — FastAPI Entry Point and Existing Test Pattern Confirmed
222 9:14p 🟣 PlacedOn Backend — Demo API Router Implemented (8 Endpoints, Aisha Sharma Persona)
223 " 🔵 PlacedOn Backend — sentence_transformers Not Installed, Blocks main.py Import in Tests
225 9:17p 🔴 PlacedOn Backend — main.py Made Import-Safe When sentence_transformers Is Absent
226 " 🟣 PlacedOn — Frontend Handoff Doc and Full Verification Complete for Demo API Slice
228 9:19p 🔵 PlacedOn Backend — uvicorn Requires Escalated Sandbox Permission to Bind Port 8000
230 9:30p 🔵 PlacedOn Backend — Not Running, Connection Refused on Port 8000
231 " 🔵 PlacedOn Backend — Confirmed Running, Both Endpoints Return HTTP 200
232 9:39p 🔵 PlacedOn Backend — All Three Demo API Endpoints Confirmed Responding HTTP 200
233 " 🔵 PlacedOn Backend — Full Demo API Surface Confirmed (8 Endpoints All HTTP 200)
234 9:41p 🔵 PlacedOn Backend — Settings Architecture and CORS Configuration Fully Mapped
235 " 🔵 PlacedOn Frontend — Zero fetch() Calls, Demo API Not Yet Wired Into Any Component
236 " 🔵 PlacedOn Backend CORS — Correctly Responding to Both localhost and 127.0.0.1 Origins for Port 5173
239 9:42p ✅ PlacedOn Frontend — Vite Proxy for /demo Routes Removed from vite.config.ts
241 9:46p 🔵 PlacedOn Frontend — Entire Source Tree Deleted from Git Working Tree
242 9:51p 🟣 PlacedOn Frontend — Demo API Client Layer Implemented with Full TypeScript Contracts
243 " 🔵 PlacedOn — Backend /demo/* Response Shape Mismatches Frontend TypeScript Contract
246 9:52p 🔵 PlacedOn Frontend — UserDashboard Crashes at Runtime Due to Backend Contract Field Name Mismatch
249 9:54p 🔴 PlacedOn Backend — demo_routes.py Fixed to Emit Frontend TypeScript Contract Shape
250 9:59p ⚖️ PlacedOn — Replace Frontend Hardcoding With Backend Demo JSON API (Implementation Plan)
### Apr 28, 2026
262 8:52p 🔵 PlacedOn Repo — On proposed-frontend Branch with Gone Remote Tracking
263 " 🔵 PlacedOn Git Branch State — proposed-frontend 3 Commits Ahead of Local main, Already Merged to origin/main via PR
264 " 🔵 PlacedOn Git Operations Blocked — .git Directory on Read-Only Filesystem
267 " 🔵 Git Fetch Succeeded with Escalated Sandbox Permissions
268 " 🔵 PlacedOn proposed-frontend — 6 Files Ahead of origin/main Not Yet Merged
271 8:53p 🔵 Git Write Operations Still Blocked — .git/index.lock Cannot Be Created Without Escalated Permissions
272 8:55p ✅ PlacedOn Branch Switched to main — Pulled, Cherry-Picked, and Pushed Successfully
273 8:57p 🔵 PlacedOn Frontend — Vite Dev Server Running at 127.0.0.1:5173 for UI Audit
274 9:51p 🔵 PlacedOn Git Branch Switch — Requested: proposed-frontend → main with Pull/Push
### Apr 29, 2026
275 1:33a 🔵 PlacedOn Employer Portal — Visual Inspection via Playwright
276 1:34a 🔵 PlacedOn EmployerDashboard.tsx — Full Implementation Mapped
277 " 🔵 Vite Dev Server Not Running on Port 5173 — Needed Manual Restart
278 " 🔵 Playwright MCP Browser Conflict — Single Instance Limitation
281 1:36a 🔵 PlacedOn EmployerDashboard.tsx — Full 460-Line Implementation Mapped
282 " 🔵 Vite Dev Server Started on 127.0.0.1:5173 — Playwright Browser Blocked by Existing Instance
283 1:39a 🔵 PlacedOn Employer Page — Full Visual Inspection via Playwright at Mobile and Desktop Viewports
284 " 🔵 PlacedOn Employer Page — Console Errors: FastAPI Backend Unreachable, Mock Fallback Active
285 " 🔵 PlacedOn Employer Page — Interactive Behaviors Verified: Pass, Request Intro, Search Filter All Work
286 " 🔵 PlacedOn Frontend Build — Production Build Succeeds with Bundle Size Warning
287 1:56a ⚖️ PlacedOn Employer Dashboard — UX Design Direction Initiated
288 " 🔵 PlacedOn Employer Dashboard — Full Design Spec and Persona Documented
290 1:57a 🔵 PlacedOn Employer Dashboard — Full Product Spec and Route Contract Read
295 " ⚖️ PlacedOn Employer Dashboard — Primary Audience Set to Recruiter / HR Ops
296 2:03a 🔵 PlacedOn Employer Dashboard Brainstorm — Horizon Question Aborted by User
### Apr 30, 2026
298 1:52a ⚖️ Supabase Integration — Architecture Decision for Real-Time Full-Stack Sync
299 1:55a ⚖️ PlacedOn — Supabase Integration Proposed to Replace Mock Data and Enable Real-Time Sync
304 1:56a 🔵 PlacedOn Frontend — demoApi.ts Mock Fallback Architecture Fully Mapped
305 " 🔵 PlacedOn Frontend — Full Route Map and Mock Data Distribution Confirmed
306 " ⚖️ PlacedOn Supabase Integration — Guided Slices Build Mode Selected

Access 2080k tokens of past work via get_observations([IDs]) or mem-search skill.
</claude-mem-context>

<placedon-supabase-verification-protocol>
# PlacedOn Supabase / Database Verification Protocol

These checks are mandatory for any agent working on Supabase, database migrations,
RLS/privacy policies, seeded data, FastAPI DB-backed read models, or frontend/API
integration that depends on Supabase data.

Core rule: do not ask the user to trust explanations. Provide repeatable command
evidence, test counts, and explicit privacy-field checks before saying the work is
correct, complete, safe, migrated, wired, or ready.

## 1. Migration Check

For any Supabase migration or remote DB change, run from:

```bash
cd /home/intelligentape/Life/08-PlacedOn/PlacedOn
npx -y supabase migration list
npx -y supabase db push --dry-run
```

Expected evidence:
- `migration list` shows all local migrations also present on remote.
- `db push --dry-run` says `Remote database is up to date`.
- If either command fails, do not claim the DB is migrated or current.

## 2. Contract Test Check

For schema, privacy, read-model, or demo-route changes, run:

```bash
PYTHONPATH=PlacedOn:PlacedOn/backend python3 -m pytest \
  PlacedOn/backend/tests/test_privacy_seed_contract.py \
  PlacedOn/backend/tests/test_database_schema_contract.py \
  PlacedOn/backend/tests/test_read_models.py \
  PlacedOn/backend/tests/test_demo_routes.py -q
```

Expected evidence:
- Report the exact pass count from pytest.
- If tests fail, report the failure and fix it before claiming completion.

## 3. Seed Data Check

When seed data is created or changed, verify the remote database contains the
expected demo graph. At minimum, confirm:
- `candidates` contains `Aisha Sharma`.
- `employers` contains `GrowthCart`.
- `job_listings` contains `Frontend Engineer`.
- `candidate_job_matches` contains fit score `91`.
- `profile_evidence_snippets` contains employer-safe `display_text` and `ai_summary`.

Use Supabase dashboard, `supabase db dump --data-only`, or another direct DB query.
Do not rely only on local migration file contents.

## 4. Privacy Check

Before accepting any employer-facing or frontend-facing DB/API work, show a test
or direct verification proving the response does not expose:

```text
source_text
candidate_answer_text
raw_question
profile_embedding
role_vector
turn_embedding
phone
email
private notes
```

Employer APIs may expose only employer-safe evidence fields such as
`display_text`, `ai_summary`, visibility/redaction metadata, and approved match
or pipeline read models. If there is no test for this, the work is not complete.

## 5. Frontend Check

When DB-backed APIs are wired into the frontend, verify the actual app behavior:
- candidate profile renders,
- matches render,
- employer dashboard renders,
- employer evidence drawer shows snippets/summaries, not raw transcripts,
- no console/runtime errors indicate broken API contracts.

Use the local dev server and browser/Playwright verification where appropriate.

## 6. Completion Reporting Standard

Every "done" claim for Supabase/database/API work must include:
- migration command result,
- test command result and pass count,
- seed verification result when seed data changed,
- exact privacy fields checked,
- any known gaps or commands that could not be run.

If a command requires credentials or fails due to environment issues, say that
plainly and do not imply the unchecked part is verified.
</placedon-supabase-verification-protocol>

<placedon-guided-slice-protocol>
# PlacedOn Guided Slice Execution Protocol

These instructions are mandatory for any agent working on PlacedOn frontend
actions, FastAPI endpoints, Supabase-backed data, employer/candidate workflows,
realtime updates, or mock-data removal.

Core rule: do not "wire everything" in one pass. Build one user-visible workflow
at a time, verify it end-to-end, and only then move to the next workflow.

## Default Build Mode

Use Guided Slices by default. A slice is complete only when one workflow works
from user action to backend write/read to refreshed frontend state, with tests
and privacy checks.

Each slice must have:
- one clear user-facing workflow,
- one stable FastAPI read/write contract,
- Supabase persistence for the relevant state,
- frontend behavior that visibly reflects the backend state,
- tests proving the contract and privacy guarantees.

## Recommended Slice Order

Unless the user explicitly chooses a different order, implement DB-backed product
work in this sequence:

1. DB-backed candidate dashboard
2. DB-backed HCV/profile page
3. DB-backed candidate matches
4. Employer pipeline read model
5. Employer actions
6. Candidate notifications
7. Realtime updates
8. Remove mock fallback route-by-route

Do not skip ahead to broad realtime, mock removal, or multi-screen rewrites until
the earlier read/write foundations are working.

## Required Agent Instruction For Each Slice

Before implementing a slice, restate this operating instruction in the working
notes and follow it:

```text
Implement only this workflow. Do not touch unrelated screens. Use FastAPI as the
read/write layer and Supabase as storage. Add contract and privacy tests. Run the
AGENTS.md Supabase verification protocol before claiming completion.
```

## Slice Acceptance Checklist

Every completed slice must report:
- the workflow implemented,
- migration status or "no migration needed",
- exact pytest command and pass count,
- frontend/manual behavior check,
- privacy fields checked,
- known gaps or commands that could not be run.

If any item is missing, the slice is not complete.

## Mock Data Removal Rule

Remove hardcoded/mock data only route-by-route after the replacement route has a
DB-backed FastAPI response, frontend integration, contract tests, privacy tests,
and a browser/manual check. Never delete broad mock data just because one screen
has been wired.

## Privacy And Data Flow Defaults

Use FastAPI for sensitive writes and read-model assembly. Supabase stores data
and may emit safe realtime events, but the frontend must not directly write
high-trust hiring actions to arbitrary tables.

Employer-facing and frontend-facing responses must not expose:

```text
source_text
candidate_answer_text
raw_question
profile_embedding
role_vector
turn_embedding
phone
email
private notes
```

When in doubt, expose a smaller safe read model and keep raw data backend-only.
</placedon-guided-slice-protocol>
