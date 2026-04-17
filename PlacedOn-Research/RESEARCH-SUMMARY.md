# Research Summary

This document captures all research findings from the product development session and where each finding is documented.

---

## Conversation Topics & Findings

### 1. Interview Format & Candidate Interaction

**Research Question:** How should the AI interviewer behave? What does a good 30-40 minute interview look like?

**Findings:**
- Voice-based is better than text for reducing typing bias and feeling more natural
- Interview should have 4 phases: warm-up (5 min) → scenarios (15 min) → depth probe (8 min) → close (2 min)
- Open-ended opener ("What are you thinking about?") works better for freshers than "Tell me about yourself"
- Situational scenarios without trick questions reveal problem-solving approach
- The interviewer should disclose it's AI, use warm tone, not make promises, adapt but never lower standards

**Documented In:**
- `product/interviewer-model.md` (complete behavioral spec)
- `product/product-spec.md` (updated to voice, phases structure)

---

### 2. Cost Impact of Voice

**Research Question:** How much does adding voice to the interview cost?

**Findings:**
- Speech-to-text (Whisper): ~$0.18 for 30 min
- Text-to-speech (ElevenLabs): ~$0.15–0.30 for 30 min
- Total voice cost: **$0.33–0.48 per interview**
- This is 10-15x more expensive than the initial $0.03 LLM-only estimate
- But still 100-400x cheaper than human interviewer ($50–200)
- Self-hosting voice (GPU) can reduce to ~$0.12 at scale

**Margins Impact:**
- With API: 87–94% gross margin (still very strong)
- With self-hosted: 94–98% gross margin
- Break-even moves from <$0.05 to <$0.50 per interview — still viable

**Documented In:**
- `business/unit-economics.md` (full cost breakdown, revised projections)
- `product/product-spec.md` (cost implications in technical notes)

---

### 3. Build Sequencing

**Research Question:** What should be built first?

**Findings:**
- Build text-based MVP first, add voice in Phase 2
- Text-first lets you validate the Markov engine logic without voice latency pressure
- Voice adds complexity (STT errors, TTS latency, accent handling) that shouldn't block core validation
- 3-month timeline for text MVP is realistic
- Voice adds 3-4 weeks of engineering

**Documented In:**
- `IMPLEMENTATION-ROADMAP.md` (phased build plan)
- `product/product-spec.md` (MVP scope updated)
- `CLAUDE.md` (implementation priority order)

---

### 4. Validation & Proof Strategy

**Research Question:** How do we prove the product works?

**Findings:**
- 4-layer validation approach:
  1. **Internal consistency** (weeks 1-2): run 20 candidates twice, profiles should converge
  2. **Human benchmark** (weeks 3-8): compare 50 PlacedOn profiles vs. experienced hiring manager profiles
  3. **Predictive validity** (months 6-12): track hires, correlate traits to performance
  4. **Candidate self-validation** (immediate): ask candidates "does this feel accurate?" — target 80%+

- The critical validation: at month 9, show that AI profiles predict job performance better than resumes
- Without this proof, product has no moat and scaling is premature

**Documented In:**
- `product/product-spec.md` (validation strategy section)
- `IMPLEMENTATION-ROADMAP.md` (success criteria for each phase)
- `problems/critical-risks.md` (validation gap as critical risk)

---

### 5. Indian Market Opportunity

**Research Question:** Why is the Indian market specifically good for PlacedOn?

**Findings:**
- 1.5M engineers graduate annually, most with weak resumes
- Campus placements and referrals dominate — no AI tool has cracked fresher hiring yet
- Incumbents (HireVue $100M+, Mercor $32M) focus on contract work or enterprises
- $299/month is attractive vs. $25K+ HireVue or higher Mercor pricing
- Cost sensitivity + large fresher supply = perfect market fit

**Challenges:**
- Hiring is relationship-driven (referrals dominate)
- Indian startups churn fast (revenue stability risk)
- Campus placement cells control fresher pipelines (need to work with them, not compete)
- Employers don't buy for bias compliance yet (but should, given regulatory tailwinds)

**Strategy:**
- Partner with tier 2-3 colleges (not IITs) for candidate supply
- Target startups actively hiring (5-10 free pilots)
- Position to colleges as: "gives your students a verified profile they can share anywhere"
- Align with placement cells, don't compete against them

**Documented In:**
- `business/competitive-analysis.md` (Indian market section added)
- `business/go-to-market.md` (college partnerships as parallel track)
- `problems/critical-risks.md` (detailed Indian market challenges)

---

### 6. Product Differentiation

**Research Question:** What makes PlacedOn uniquely good?

**Findings:**
- **Only player combining:**
  1. Adaptive real-time conversation (not pre-recorded like HireVue)
  2. Markovian state management (3-5x LLM cost reduction, technical moat)
  3. Atomic trait profiles (irreducible insights, not vague skill scores)
  4. ABLEIST bias framework (8-metric validated approach; competitors detect 0%)
  5. Designed for freshers (1.5M annual supply in India)

- **Competitive positioning:**
  - Deep assessment + low cost (PlacedOn sweet spot)
  - vs. HireVue: 100x cheaper, adaptive, conversational
  - vs. Mercor: deeper assessment, full-time focused, bias protection
  - vs. Pymetrics: real conversation, not games, meaningful signal

**Documented In:**
- `business/competitive-analysis.md` (full comparison, positioning chart)
- `CLAUDE.md` (core differentiators section)

---

### 7. Honest Critique & Risks

**Research Question:** What can go wrong? What are the real weaknesses?

**Findings:**

**Can Text Chat Really Assess Someone?**
- Typing speed bias (slower typist seems less fluent)
- Interview anxiety (unfamiliar format for some)
- No body language (massive signal loss)
- 40 minutes is long for freshers with no work experience

**Validation Gap:**
- Can't prove profiles are accurate until 6-12 months after hiring
- Most critical unknown: does AI profile actually predict job performance?
- Without this proof, everything else is premature

**Technical Risks:**
- Markov state contraction can lose information, compounding through interview
- LLM hallucination during contraction
- Voice latency >2 sec breaks conversational feel
- STT struggles with Indian accents and Hinglish
- Achievement moderation doesn't scale (AI or human both have limits)

**Market Risks:**
- Cold start: who are candidates without employer demand?
- Incumbent inertia: referrals and campus drives dominate Indian hiring
- Profile gaming: Reddit/Telegram will share "how to answer PlacedOn interviews"
- LLM provider dependency: OpenAI price change breaks economics

**Documented In:**
- `problems/critical-risks.md` (comprehensive 7-section critique)
- `IMPLEMENTATION-ROADMAP.md` (tech risks and mitigations)
- `product/interviewer-model.md` (edge cases and how to handle them)

---

### 8. Complexity & Build Feasibility

**Research Question:** Is this actually buildable? How complex is it?

**Findings:**

**What's Hard:**
- Voice latency <2 sec (need streaming STT/TTS)
- Markov contraction quality (needs rigorous prompts and JUDGE mechanism)
- Indian accent handling (Whisper works okay but needs testing)
- Avoiding profile gaming (interview must be robust to coached answers)

**What's Not Hard:**
- Mobile app (standard CRUD + cards)
- Markov state management (JSON blob in PostgreSQL)
- Profile generation (single LLM call at end)
- Employer dashboard (search, filter, save)
- ABLEIST checking (extra LLM call or self-hosted Llama model)

**Timeline:**
- Text MVP: 4-6 weeks (solo developer or 2-person team)
- Voice integration: 3-4 weeks
- Mobile app: 4-6 weeks
- Premium features: 2-3 weeks
- **Total: 3-4 months to working product**

**Infrastructure Cost:**
- Early stage (0-1K interviews/month): $315–632/month
- Growth (10K interviews/month): $950–1,620/month
- Scale (100K interviews/month): $4.5–8.2K/month

**Documented In:**
- `IMPLEMENTATION-ROADMAP.md` (tech risks, cost timeline)
- Conversation history (this research session)

---

### 9. Business Viability

**Research Question:** Can this be a real business?

**Findings:**

**Revenue Model:**
- B2B SaaS: $299–2,000/month by company tier
- Gross margins: 87–98% depending on voice cost (API vs. self-hosted)
- Break-even: ~11 customers at $400/month average
- Year 1: -$25K (need seed runway)
- Year 2: $420K net profit
- Year 3: $3.6M net profit

**Funding Needs:**
- Pre-seed: $25–50K (bootstrap MVP, reach first revenue)
- Seed: $500K–1M (if pilot conversions strong)
- Series A: $5–10M (year 3, scale to multiple markets)

**Can be bootstrapped** if you hit 11 paying customers within 10 months.

**Documented In:**
- `business/unit-economics.md` (revised with voice costs)
- `business/go-to-market.md` (launch strategy, conversion targets)

---

### 10. Product Potential Assessment

**Research Question:** Does this have potential to be a very good product?

**Final Verdict:** Yes, with caveats.

**What Makes It Good:**
- Solves a real problem for 1.5M freshers annually in India alone
- Market timing is right (LLM costs falling, regulatory tailwinds, remote hiring normalized)
- Markovian architecture is a genuine technical advantage
- ABLEIST framework is differentiated (99.7% of LLM hiring has bias, competitors detect 0%)
- Mercor's $32M Series A + HireVue's $100M+ revenue proves the space is real
- Can be profitable at scale (>90% margins)

**What Makes It Risky:**
- Core hypothesis (AI profiles predict job performance) is unproven until month 6-12
- Execution risks are significant (voice latency, accent handling, contraction quality)
- Market risks are real (referral culture, startup churn, campus placement cell competition)
- First to market in India ≠ first to scale (incumbents will copy)

**What Determines Success:**
1. Can you prove predictive validity by month 9 with real hiring data?
2. Can you build voice that feels natural and handles Indian accents?
3. Can you acquire candidates without employer demand (college partnerships)?

If you solve #1, #2, #3 — this is a strong product with legs.

**Documented In:**
- This research summary (final assessment)
- All files above (evidence and details)

---

## How to Use This Research

### For First Implementation (Months 1-3)
- Read: `CLAUDE.md` → `IMPLEMENTATION-ROADMAP.md` → `product/interviewer-model.md` → `Markovian-Reasoning/AoT-for-AI-Interviewer.md`
- Focus: Build text MVP, validate Markov logic, run internal consistency test

### For Hiring First Pilots (Months 4-6)
- Read: `business/go-to-market.md` → `product/product-spec.md` (validation section)
- Focus: Free pilots with startups, college partnerships, human benchmark validation

### For Scaling (Months 7-12)
- Read: `business/unit-economics.md` → `business/competitive-analysis.md` → `IMPLEMENTATION-ROADMAP.md` (Phase 3)
- Focus: Convert pilots to paid, track hiring outcomes, build mobile app

### If Stuck
- Read: `problems/critical-risks.md` (is your blocker listed?)
- Read: `product/interviewer-model.md` (edge cases section)
- Read: `IMPLEMENTATION-ROADMAP.md` (tech risks & mitigations)

---

## Open Questions Still Requiring Answer

1. **College partnerships:** Which tier 2-3 colleges are accessible? How to position without competing with placement cells?

2. **Predictive validity baseline:** What counts as "proof"? 70% correlation? 80%? How many hires needed for statistical significance?

3. **Hinglish support:** How to handle code-switching in real-time? Fine-tune Whisper or post-process?

4. **Profile gaming:** How do you test interview robustness to coached answers? Red team internal?

5. **Regulatory compliance:** Under Indian DPDP Act, what's required for storing AI-generated behavioral profiles of candidates?

These are next-conversation topics, not blockers.

---

## Final Note

This research consolidates honest assessment, detailed planning, and clear-eyed risk analysis. The product has real potential IF execution is strong and the core hypothesis (profiles predict performance) holds up under testing.

The difference between success and failure is in the details: Markov prompt quality, voice latency optimization, Indian market relationships, and rigorous validation.

Go build.
