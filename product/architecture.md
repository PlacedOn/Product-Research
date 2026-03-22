# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                       │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Candidate   │  │  Employer    │  │   Admin      │  │
│  │  Web/Mobile  │  │  Dashboard   │  │  Dashboard   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼─────────────────┼─────────────────┼───────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────┐
│                      API GATEWAY                        │
│            (Auth, Rate Limiting, Routing)                │
└─────────────────────────┬───────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌────────────────┐ ┌────────────┐ ┌──────────────────┐
│   INTERVIEW    │ │  PROFILE   │ │    EMPLOYER       │
│   SERVICE      │ │  SERVICE   │ │    SERVICE        │
│                │ │            │ │                   │
│ - Markov Engine│ │ - Generate │ │ - Search/Browse   │
│ - Decompose    │ │ - Store    │ │ - Filter          │
│ - Contract     │ │ - Update   │ │ - Shortlist       │
│ - Judge        │ │            │ │                   │
│ - Bias Check   │ │            │ │                   │
└───────┬────────┘ └─────┬──────┘ └────────┬──────────┘
        │                │                 │
        ▼                ▼                 ▼
┌─────────────────────────────────────────────────────────┐
│                     DATA LAYER                          │
│                                                         │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Postgres │  │  Profile     │  │  Encrypted       │  │
│  │ (Users,  │  │  Store       │  │  Transcript      │  │
│  │  Billing)│  │  (Profiles,  │  │  Store           │  │
│  │          │  │   Traits)    │  │  (S3/equivalent) │  │
│  └──────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                     │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │  LLM API     │  │  Auth        │                    │
│  │  (OpenAI /   │  │  (Clerk /    │                    │
│  │   Anthropic) │  │   Auth0)     │                    │
│  └──────────────┘  └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

## The Markov Interview Engine (Core Component)

This is the most critical piece — where AoT is implemented.

```
┌─────────────────────────────────────────────────────┐
│              MARKOV INTERVIEW ENGINE                │
│                                                     │
│  Input: Candidate message + Current State Qᵢ        │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ Step 1: PROCESS RESPONSE                    │    │
│  │ - Parse candidate's answer                  │    │
│  │ - Extract observations                      │    │
│  └──────────────────┬──────────────────────────┘    │
│                     ▼                               │
│  ┌─────────────────────────────────────────────┐    │
│  │ Step 2: CONTRACT (LLM Call)                 │    │
│  │ - Input: Qᵢ + new observations              │    │
│  │ - Output: Qᵢ₊₁ (updated candidate state)    │    │
│  │ - Resolves assessed goals                   │    │
│  │ - Bakes findings into state                 │    │
│  └──────────────────┬──────────────────────────┘    │
│                     ▼                               │
│  ┌─────────────────────────────────────────────┐    │
│  │ Step 3: JUDGE (LLM Call)                    │    │
│  │ - Compare Qᵢ, observations, Qᵢ₊₁            │    │
│  │ - Verify fidelity to actual responses       │    │
│  │ - If drift detected: revert to Qᵢ           │    │
│  └──────────────────┬──────────────────────────┘    │
│                     ▼                               │
│  ┌─────────────────────────────────────────────┐    │
│  │ Step 4: BIAS CHECK (LLM Call)               │    │
│  │ - Run ABLEIST 8-metric check on Qᵢ₊₁        │    │
│  │ - Flag any detected harms                   │    │
│  │ - Reword if necessary                       │    │
│  └──────────────────┬──────────────────────────┘    │
│                     ▼                               │
│  ┌─────────────────────────────────────────────┐    │
│  │ Step 5: DECOMPOSE (LLM Call)                │    │
│  │ - Input: Qᵢ₊₁                               │    │
│  │ - Map remaining assessment goals            │    │
│  │ - Identify independent goals (DAG)          │    │
│  │ - Select next priority                      │    │
│  └──────────────────┬──────────────────────────┘    │
│                     ▼                               │
│  ┌─────────────────────────────────────────────┐    │
│  │ Step 6: GENERATE QUESTION (LLM Call)        │    │
│  │ - Input: Qᵢ₊₁ + selected goal               │    │
│  │ - Output: Natural, conversational question  │    │
│  │ - Must feel like a real conversation        │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Output: Next question + Updated State Qᵢ₊₁         │
└─────────────────────────────────────────────────────┘
```

## Data Models

### Candidate State (Markov State)

```json
{
  "interview_id": "uuid",
  "candidate_id": "uuid",
  "state_version": 5,
  "role_applied": "Senior Backend Engineer",
  "minutes_elapsed": 22,
  "assessed_goals": [
    {
      "goal": "technical_depth",
      "status": "assessed",
      "confidence": 0.85,
      "observations": [
        "Strong system design thinking",
        "Weaker on algorithm complexity analysis",
        "Asks clarifying questions before designing"
      ]
    },
    {
      "goal": "communication_style",
      "status": "assessed",
      "confidence": 0.9,
      "observations": [
        "Clear and structured",
        "Thinks aloud naturally",
        "More expressive on topics of passion"
      ]
    }
  ],
  "remaining_goals": [
    {
      "goal": "collaboration_style",
      "status": "ready",
      "dependencies_met": true
    },
    {
      "goal": "growth_mindset",
      "status": "ready",
      "dependencies_met": true
    }
  ],
  "atomic_traits": [],
  "bias_flags": [],
  "judge_history": [
    {"version": 4, "selected": "new_state", "confidence": 0.92},
    {"version": 5, "selected": "new_state", "confidence": 0.88}
  ]
}
```

### Candidate Profile (Final Output)

```json
{
  "profile_id": "uuid",
  "candidate_id": "uuid",
  "created_at": "2025-03-21T14:30:00Z",
  "role_category": "Backend Engineering",
  "summary": "Methodical system thinker who leads with questions...",
  "atomic_traits": [
    {
      "category": "technical_thinking",
      "trait": "Approaches system design by first mapping constraints...",
      "confidence": 0.88,
      "evidence_segments": [3, 5, 7]
    }
  ],
  "overall_confidence": 0.85,
  "bias_audit": {
    "ableist_harms_detected": 0,
    "intersectional_harms_detected": 0,
    "audit_passed": true
  },
  "candidate_notes": "I'd like to add that...",
  "interview_metadata": {
    "duration_minutes": 37,
    "segments_completed": 8,
    "state_transitions": 7,
    "judge_reversals": 1
  }
}
```

## Technology Stack (Recommended for MVP)

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js + React | Fast to build, good DX, SSR for SEO |
| API | Next.js API routes or FastAPI | Depends on team comfort |
| Database | PostgreSQL (Supabase) | Reliable, free tier, auth built-in |
| LLM | OpenAI API (GPT-4o-mini + GPT-4o) | Best cost/quality ratio currently |
| File Storage | S3 or Supabase Storage | Encrypted transcript storage |
| Auth | Supabase Auth or Clerk | Quick setup, social login |
| Hosting | Vercel (frontend) + Railway (backend) | Simple deployment, scales |
| Monitoring | Sentry + Posthog | Error tracking + analytics |

**Estimated infrastructure cost for MVP: $200-500/month**

## Scaling Considerations

### When to Optimize (Don't Prematurely)

| Milestone | Action |
|---|---|
| 1K interviews/month | Current architecture is fine |
| 10K interviews/month | Add Redis caching for profiles, consider async interview processing |
| 50K interviews/month | Dedicated backend service, queue system for LLM calls |
| 100K+ interviews/month | Consider self-hosted LLM for bias checks (fine-tuned Llama), dedicated infrastructure |

### LLM Provider Strategy

- **MVP:** OpenAI (GPT-4o-mini for most calls, GPT-4o for judge)
- **Growth:** Add Anthropic Claude as fallback, compare quality
- **Scale:** Fine-tune open-source model (Llama) for decompose/contract steps (cheapest), keep proprietary model for judge only
- **Long-term:** If you fine-tune well, self-host everything — cost drops to near-zero per interview
