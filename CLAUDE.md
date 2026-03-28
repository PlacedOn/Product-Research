# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repository Is

**PlacedOn** is a product specification and business plan for an AI-powered hiring platform — not a software implementation. All files are documentation: market analysis, product specs, architecture design, technical implementation guides, and business strategy.

The immediate next step is building an MVP. When implementation begins, the recommended stack is Next.js + FastAPI, PostgreSQL (Supabase), OpenAI API, and Vercel/Railway for hosting.

## Document Structure

**Strategy & Planning:**
- `IMPLEMENTATION-ROADMAP.md` — Phased build plan, tech risks, cost timeline, success criteria. **Read this to understand build order.**
- `problems/critical-risks.md` — Honest critique of the product, Indian market challenges, and what can fail
- `README.md` — Project overview and value proposition

**Product & Interviewer:**
- `product/product-spec.md` — Feature list, user flows, validation strategy, MVP scope
- `product/interviewer-model.md` — Behavioral spec of the AI interviewer: persona, constraints, how interviews actually flow, edge cases
- `Markovian-Reasoning/AoT-for-AI-Interviewer.md` — Technical implementation of the Markov engine. **Start here for code.**
- `product/architecture.md` — System design, microservices, data models, tech stack
- `product/bias-safety.md` — ABLEIST framework, how to prevent/detect bias, hard cases

**Business:**
- `business/go-to-market.md` — Launch strategy, college partnerships, pilot phase, scaling plan
- `business/unit-economics.md` — Cost per interview (voice: $0.35–0.50), margins, financial projections, break-even at 11 customers
- `business/competitive-analysis.md` — HireVue vs. Mercor vs. PlacedOn, our positioning in Indian market, moats
- `business/market-analysis.md` — TAM/SAM/SOM, target customers, market tailwinds

**Research:**
- `research/notes/paper-summaries.md` — Key findings from AoT (NeurIPS 2025) and ABLEIST papers
- `research/notes/ABLEIST-deep-dive.md` — Detailed analysis of disability bias in hiring

## Core Technical Architecture

### The Markov Interview Engine

The central innovation. Each ~5-minute interview segment runs this loop:

```
PROCESS RESPONSE → CONTRACT (update state Qᵢ₊₁) → JUDGE (verify fidelity)
→ BIAS CHECK (8 ABLEIST metrics) → DECOMPOSE (DAG of remaining goals)
→ GENERATE QUESTION
```

Key property: state complexity is O(1) not O(n) — only the current state `Qᵢ` and the new response feed into the next contraction, not the full transcript. This reduces cost from ~$0.10 to ~$0.03 per interview.

### ABLEIST Bias Framework

8-metric framework integrated at every state contraction. Catches subtle ableist harms that OpenAI Moderation and Perspective API miss entirely (those tools detect 0% of harms that ABLEIST catches). The 8 metrics: One-Size-Fits-All Ableism, Infantilization, Technoableism, Anticipated Ableism, Ability Saviorism, Inspiration Porn, Superhumanization, Tokenism.

### System Layers

```
Candidate/Employer UI (Next.js)
    ↓
API Gateway (auth, rate limiting)
    ↓
Microservices: Interview Service (Markov Engine) | Profile Service | Employer Service
    ↓
PostgreSQL (users/billing) + Profile Store + Encrypted Transcript Store (S3)
    ↓
LLM API (OpenAI GPT-4o-mini for contractions, GPT-4o for profile synthesis)
```

## Key Numbers to Keep in Mind

- $0.03 per interview (40 LLM calls × ~$0.00036/call with GPT-4o-mini)
- Break-even: ~11 paying customers at $400/month average
- MVP infrastructure budget: $200–500/month
- Target first customers: Indian tech startups (5–10 free pilots, then $299/month)

## Implementation Priority Order

**Phase 1 (MVP): Build Text-Based First**
1. Markov Interview Engine (decompose → contract → judge loop)
2. State schema and persistence (save after each ~5-min segment)
3. Candidate state update prompts
4. ABLEIST bias checker (runs at every contraction)
5. Profile generation from final state (extract atomic traits)
6. Text-based chat interface (web, simple)
7. Candidate self-validation ("Does this feel accurate?")

**Phase 2: Add Voice & Validation**
1. STT (Whisper API initially, self-host later)
2. TTS (ElevenLabs or Google, optimize for latency <2 sec)
3. Handle Indian accents and code-switching (Hinglish)
4. Employer web dashboard (basic: job listings, candidate feed, save/pass)
5. Track hiring outcomes (infrastructure to correlate profiles to hires)

**Phase 3: Mobile & Scaling**
1. Employer mobile app (React Native/Flutter)
2. Candidate mobile app (job matches, verified achievements)
3. Premium tiers (notifications, visibility)
4. Trait-based filtering and search

---

## Critical Success Factors

1. **Markov contraction quality** — if the LLM loses info at minute 10, every subsequent state is corrupted. Spend time on JUDGE mechanism and prompt tuning.

2. **Voice latency** — >2 second response time breaks conversational flow. Streaming STT/TTS is non-negotiable.

3. **Predictive validity** — by month 9, you must show that AI profiles predict actual job performance. This is the difference between "clever tool" and "product with a moat."

4. **Indian market focus** — 1.5M freshers graduate annually. Design for them: freshers have no work experience to draw from, so design scenarios and questions accordingly. Hinglish support isn't optional.
