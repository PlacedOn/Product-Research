# Implementation Roadmap

This document consolidates research findings and translates them into engineering priorities.

---

## Phase 1: MVP (Months 1-3)

**Goal:** Validate that the Markov interview engine works and produces useful profiles.

### Build (Text-Based First)

| Component | Priority | Notes |
|---|---|---|
| Markov decompose/contract/judge loop | 🔴 Critical | Core engine — if this doesn't work, nothing works |
| Interview orchestration (state management) | 🔴 Critical | Save state per segment, enable resume-after-disconnect |
| Candidate profile generation | 🔴 Critical | Transform final state into atomic traits |
| Basic text chat UI | 🔴 Critical | Don't wait for voice — get the logic working first |
| ABLEIST bias check integration | 🔴 Critical | Run on every state contraction — catch bias early |
| Candidate self-validation flow | 🔴 Critical | "Does this profile feel accurate?" → essential for Phase 2 proof |

### Test (What Must Be Validated)

- [ ] Internal consistency: run 20 candidates twice, verify profiles converge
- [ ] Markov quality: judge mechanism successfully validates state updates
- [ ] Bias detection: ABLEIST checks trigger on test bias patterns; false positive rate <5%
- [ ] Interview completion: >80% of candidates complete full interview
- [ ] Profile usefulness: hiring manager can read profile and form an opinion

### NOT Building Yet
- ❌ Voice (add in Phase 2)
- ❌ Employer dashboard (focus on candidate side)
- ❌ Premium features
- ❌ Mobile app
- ❌ ATS integrations

---

## Phase 2: Validation & Voice (Months 4-6)

**Goal:** Prove predictive validity. Add voice. Run first pilots.

### Build

| Component | Priority | Notes |
|---|---|---|
| Voice pipeline (STT + TTS) | 🟡 High | Use Whisper + ElevenLabs initially; optimize later for cost |
| Latency optimization | 🟡 High | Must be <2 sec response time or interview feels broken |
| Indian accent handling | 🟡 High | Test extensively with Hinglish, regional accents |
| Employer web dashboard (basic) | 🟡 High | Job listings, candidate feed, save/pass actions |
| Hiring outcome tracking | 🟡 High | Infrastructure to correlate profiles to actual hires |

### Validation Research

- [ ] Human benchmark: run 50 candidates through PlacedOn + experienced hiring manager
- [ ] Compare profiles blind — where align/diverge?
- [ ] Free pilot with 5-10 Indian startups (50 candidates each)
- [ ] Track outcomes at 3-month mark
- [ ] College partnerships: sign up 2-3 tier 2-3 colleges for candidate sourcing

### Success Criteria

- >70% correlation between AI profiles and human interview results
- Pilot companies want to convert to paid
- Positive outcome correlation (at least for small sample)
- Voice interviews feel natural (candidate feedback >7/10)

---

## Phase 3: Scale & Polish (Months 7-12)

**Goal:** Build sustainable business. Scale to 25+ paying customers.

### Build

| Component | Priority | Notes |
|---|---|---|
| Mobile app (candidate + employer) | 🟡 High | React Native or Flutter for both platforms |
| Verified achievements feature | 🟡 High | Moderated achievement posts + strict moderation |
| Premium tiers | 🟡 High | Candidate notifications, employer visibility boosting |
| Employer trait filtering | 🟡 High | "Find candidates with high ambiguity tolerance" |
| Analytics dashboard | 🟢 Medium | For employers to track hiring outcomes |

### Business

- Convert 5-10 free pilots to paid customers
- Launch college recruitment program (acquire candidates from 20+ colleges)
- Build 50+ hiring outcome correlations for case studies
- Establish pricing model (SaaS tiers or per-hire fees)

### Success Criteria

- 25+ paying customers
- $50K MRR
- <5% monthly churn
- Positive outcome correlation proven on 50+ hires
- ABLEIST harm rate <2% across all profiles

---

## Key Technical Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| **Markov contraction loses information** | Profile is shallow/wrong | Rigorous JUDGE mechanism; test extensively before Phase 2 |
| **Voice latency >2 seconds** | Interview feels broken | Streaming STT/TTS; load testing early |
| **Indian accent STT fails** | Transcripts are garbage | Test Whisper on regional accents; self-host if needed |
| **Profiles don't predict performance** | Product has no moat | Validate early with human benchmark; iterate on prompts |
| **ABLEIST checks have false positives** | Interview quality degrades | Careful prompt design; human review of flagged profiles |
| **Candidates game the system** | Profiles become useless | JUDGE catches inconsistency; build robust evaluation |

---

## Cost Timeline

| Phase | Monthly Infra | Team Cost | Runway Needed |
|---|---|---|---|
| Phase 1 (MVP) | $315–632 | $2–4K (contract help) | $25–30K (6 months) |
| Phase 2 (Validation) | $500–1K | $4–6K (1 FT engineer) | Already in Phase 1 runway |
| Phase 3 (Scale) | $1–2K | $8–12K (engineers + design) | First revenue covers |

**Funding recommendation:** $25K–50K pre-seed (bootstrap MVP). If Phase 2 pilot conversions are strong, seek $500K seed for Phase 3.

---

## The Single Most Important Question

Before doing anything else: **Can you prove an atomic trait profile predicts job performance better than a resume + 30-minute human interview?**

- Yes → Product has a moat. Scale aggressively.
- No → Go back to interview design. The product hypothesis is wrong.
- Unclear → More validation needed. Don't scale yet.

The entire business hangs on answering this question by month 9 with real hiring data.

---

## What Success Looks Like by End of Year 1

- ✅ Text-based Markov interviewer working reliably
- ✅ Voice interviews deployed and feeling natural
- ✅ 25+ paying customers
- ✅ 50+ hires tracked with positive outcome correlation
- ✅ College partnerships sourcing 10% of candidates
- ✅ ABLEIST bias framework protecting interviews
- ✅ Clear roadmap to profitability
