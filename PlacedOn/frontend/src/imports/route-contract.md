# Frontend Route Contract

## Public

- `/` - Public landing page. Candidate-first conversion with secondary employer CTA.

## Candidate

- `/candidate` - Candidate home dashboard.
- `/candidate/profile` - Candidate verified profile.
- `/candidate/matches` - Candidate role/company matches.
- `/candidate/applications` - Candidate application pipeline.
- `/candidate/interviews` - Candidate interview hub.
- `/candidate/settings` - Candidate account, privacy, visibility, and accessibility settings.

## Interview

- `/pre-interview` - Readiness, consent, interview mode, and accommodations.
- `/interview` - Live interview room.

## Employer

- `/employer` - Employer dashboard and candidate discovery MVP.
- `/employer/jobs` - Job criteria management, later route.
- `/employer/candidates` - Candidate discovery feed, later route.
- `/employer/saved` - Saved candidate shortlist, later route.

## Current Build Rule

If a route is specified here but not implemented yet, generate a page component that matches the existing PlacedOn visual identity before wiring the route.
