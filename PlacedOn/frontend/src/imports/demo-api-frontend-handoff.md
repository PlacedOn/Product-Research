# Demo API Frontend Handoff

Use the backend demo API as the only source of demo application data. Do not keep screen-local candidate names, company arrays, match cards, interview cards, application cards, or employer discovery candidates in React components.

Backend base URL for local development:

```text
http://127.0.0.1:8000
```

## Endpoint Map

- `GET /demo/candidate`: candidate identity, selected role, location, availability, profile status, visibility, share URL.
- `GET /demo/hcv`: Human Competency Vector summary, embedding metadata, score/confidence/uncertainty by dimension, evidence snippets. This response intentionally does not expose the raw vector.
- `GET /demo/dashboard`: next-best-action state, profile snapshot, matches summary, pipeline summary, growth activity.
- `GET /demo/matches`: candidate match list with company, role, match label, evidence reason, and action type.
- `GET /demo/applications`: application stages and cards.
- `GET /demo/interviews`: upcoming and past interviews, prep notes, join-room action.
- `GET /demo/employer`: employer jobs, candidate discovery feed, saved shortlist, intro request state.
- `GET /demo/settings`: settings groups and candidate-controlled privacy controls.

## Required Frontend Refactor

Create a small API helper, for example `src/app/lib/demoApi.ts`, with typed fetch functions for each endpoint. Use a single configurable base URL, ideally `VITE_API_BASE_URL` with `http://127.0.0.1:8000` as the local fallback.

Refactor these components to fetch from the backend demo endpoints:

- `DashboardLayout`
- `UserDashboard`
- `ProfileScreen`
- `MatchesScreen`
- `ApplicationsScreen`
- `InterviewsScreen`
- `SettingsScreen`
- `EmployerDashboard`
- `EmployerInterestScreen`
- `FollowUpChallengeScreen`
- `ChoosePathScreen`
- `PreInterviewScreen`

Preserve the current visual design. Only replace the data source and clean fake actions.

## Identity Rules

Use one coherent demo candidate everywhere:

- Name: Aisha Sharma
- Target role: Frontend Engineer
- Location: Bengaluru, India
- Message: overlooked high-potential candidate with strong evidence-backed frontend and collaboration signals.

Remove inconsistent identities such as `Alex Chen` from the dashboard shell, cards, and profile screens.

## Loading And Error States

Every screen that fetches demo data should show:

- A polished skeleton or existing loading treatment while the request is pending.
- A graceful unavailable state if the backend is down. The unavailable state should preserve layout quality and explain that demo data could not be loaded.
- No blank screens and no raw exception text.

## Button Cleanup

Wire or disable obvious fake actions:

- `Share Profile`: copy the backend `profile.share_url` value and show a toast.
- `Publish Profile`: update local UI state to published until a write endpoint exists.
- `Apply with Profile`: show a submitted state for that match/application.
- `Express Interest`: show a submitted state.
- `Request Intro`: show a requested state.
- `Pass`: remove that candidate from the current employer discovery feed locally.
- `Sign Out`: route to `/auth` until real auth lands.
- Footer dead links: remove them or route to simple placeholder pages. Do not leave primary links with `href="#"`.

Remove dev-only controls such as `Toggle Zero State`.

## Acceptance Checklist For Figma AI

- Frontend build passes with `npm run build`.
- Candidate dashboard, profile, matches, applications, interviews, settings, and employer dashboard render from backend JSON.
- No screen-local hardcoded people/company arrays remain in the listed screen components.
- No visible `Toggle Zero State`.
- No inconsistent `Alex Chen` identity remains.
- No primary action uses `href="#"`.
- Backend-down state is usable and visually consistent.
- Product message remains intact: PlacedOn reveals human competency beyond resumes, with candidate control and evidence.
