# Unit Economics

## Per-Interview Cost

### Voice Pipeline Costs (30-minute interview)

The interview is voice-based, which adds significant cost beyond LLM calls:

```
Speech-to-text (Whisper API, $0.006/min × 30 min):     $0.18
Text-to-speech (ElevenLabs or similar, 30 min output):  $0.15–0.30
```

**Voice infrastructure alone costs $0.33–0.48 per interview.** This is the dominant cost — not LLM calls.

Ways to reduce voice costs at scale:
- Self-host Whisper on GPU (~$0.05/interview at 10K+ interviews/month)
- Use cheaper TTS (Google TTS is nearly free but lower quality)
- Voice API prices are dropping — expect 30-50% reduction within 12 months

### LLM Costs: Markovian Approach (AoT)

```
Interview structure:
  - 6 segments of ~5 minutes each
  - Each segment: decompose + question + contract + judge
  - 4 LLM calls per segment = 24 LLM calls per interview
  - 6 bias check calls = 30 total LLM calls

Per LLM call (GPT-4o-mini backbone):
  - Average input: ~800 tokens (Markov state + prompt template)
  - Average output: ~400 tokens
  - Cost: $0.15/1M input + $0.60/1M output
  - Per call: ~$0.00036

LLM cost breakdown:
  - 24 core calls × $0.00036 = $0.009
  - 6 bias checks × $0.00036  = $0.002
  - Total LLM cost: $0.011 per interview
```

### With Stronger Judge Model (Recommended)

```
  - 18 calls on GPT-4o-mini:   $0.007
  - 6 judge calls on GPT-4o:   $0.015
  - 6 bias checks on 4o-mini:  $0.002
  - Total LLM cost: ~$0.024 per interview
```

### Total Cost Per Interview (Voice + LLM)

| Component | Low estimate | High estimate |
|---|---|---|
| Voice (STT + TTS) | $0.33 | $0.48 |
| LLM (Markovian, mixed models) | $0.024 | $0.024 |
| **Total** | **$0.35** | **$0.50** |

### With Self-Hosted Voice (At Scale)

| Component | Cost |
|---|---|
| Self-hosted Whisper (GPU amortized) | ~$0.05 |
| Cheaper TTS | ~$0.05 |
| LLM (Markovian) | $0.024 |
| **Total** | **~$0.12** |

### Cost Comparison: Markovian vs. Standard

LLM costs only (voice costs are the same regardless of approach):

| Approach | LLM Cost/Interview | At 100K interviews/month |
|---|---|---|
| Standard (full context) | $0.10 | $10,000/month |
| Markovian (GPT-4o-mini only) | $0.011 | $1,100/month |
| Markovian (mixed models) | $0.024 | $2,400/month |

**Markovian approach saves 4-9x on LLM costs.** At scale, voice costs dominate — self-hosting STT/TTS becomes the priority optimization.

### Comparison to Alternatives

| Method | Cost per candidate assessment |
|---|---|
| Human interviewer (30 min) | $50–200 |
| HireVue | $25–50 (estimated per assessment) |
| PlacedOn (voice, API-based) | $0.35–0.50 |
| PlacedOn (voice, self-hosted) | ~$0.12 |

Still **100-400x cheaper than a human interviewer** even with voice costs.

## Monthly Operating Costs

### Early Stage (0-1K interviews/month)

| Item                                      | Cost/month   |
| ----------------------------------------- | ------------ |
| Cloud hosting (API gateway, DB, auth)     | $200-500     |
| LLM API costs                             | $15-32       |
| Storage (profiles, encrypted transcripts) | $20          |
| Monitoring & logging                      | $50          |
| Domain, SSL, misc tools                   | $30          |
| **Total infrastructure**                  | **$315-632** |

### Growth Stage (10K interviews/month)

| Item                     | Cost/month     |
| ------------------------ | -------------- |
| Cloud hosting (scaled)   | $500-1,000     |
| LLM API costs            | $150-320       |
| Storage                  | $100           |
| Monitoring               | $100           |
| CDN, security            | $100           |
| **Total infrastructure** | **$950-1,620** |

### Scale Stage (100K interviews/month)

| Item                     | Cost/month       |
| ------------------------ | ---------------- |
| Cloud hosting            | $2,000-4,000     |
| LLM API costs            | $1,500-3,200     |
| Storage                  | $500             |
| Monitoring & security    | $500             |
| **Total infrastructure** | **$4,500-8,200** |

## Team Costs

### Phase 1: MVP (Months 1-6)

| Role | Cost/month | Notes |
|---|---|---|
| Founder (you) | $0 | Equity compensation |
| 1 contract ML engineer | $2,000-4,000 | Part-time, India rates |
| **Total** | **$2,000-4,000** | |

### Phase 2: Growth (Months 7-18)

| Role | Cost/month | Notes |
|---|---|---|
| Founder | $0-$3,000 | Small salary if funded |
| 1 full-time engineer | $4,000-6,000 | India, full-time |
| 1 part-time designer | $1,000-2,000 | Contract |
| **Total** | **$5,000-11,000** | |

### Phase 3: Scale (Months 18+)

| Role | Cost/month | Notes |
|---|---|---|
| Founder | $5,000 | |
| 3 engineers | $15,000 | |
| 1 designer | $3,000 | |
| 1 sales/BD | $4,000 | |
| **Total** | **$27,000** | |

## Revenue Per Unit

### B2B SaaS Model

| Tier | Price/month | Profiles included | Cost to serve (voice, API) | Cost to serve (self-hosted) | Gross margin (API) | Gross margin (self-hosted) |
|---|---|---|---|---|---|---|
| Starter | $299 | 50 | $17.50–25.00 | $6.00 | 92–94% | 98% |
| Growth | $799 | 200 | $70–100 | $24 | 87–91% | 97% |
| Enterprise | $2,000+ | Unlimited (est. 1000) | $350–500 | $120 | 75–82% | 94% |

### Per-Hire Fee Model (Alternative)

| Metric | Value |
|---|---|
| Fee per successful hire | $200-500 |
| Average cost-per-hire (industry) | $4,700 |
| Your cost to facilitate | $0.03 (interview) + $5 (matching/overhead) |
| Gross margin per hire | ~98% |
| Value proposition | "10x cheaper than traditional recruitment" |

## Financial Projections

### Year 1 (Build + Early Revenue)

```
Months 1-3:   MVP development
  Revenue:     $0
  Costs:       $3,500/month × 3 = $10,500

Months 4-6:   Beta launch, free pilots
  Revenue:     $0
  Costs:       $3,500/month × 3 = $10,500

Months 7-9:   First paying customers
  Revenue:     5 companies × $299 = $1,495/month × 3 = $4,485
  Costs:       $4,000/month × 3 = $12,000

Months 10-12: Growing
  Revenue:     15 companies × avg $400 = $6,000/month × 3 = $18,000
  Costs:       $5,000/month × 3 = $15,000

Year 1 Total:
  Revenue:     $22,485
  Costs:       $48,000
  Net:         -$25,515 (need ~$25K seed/savings to survive)
```

### Year 2 (Growth)

```
  Customers:   25 → 100 companies (avg $500/month)
  Revenue:     ~$50,000/month by end of year
  Annual:      ~$600,000
  Costs:       ~$15,000/month = $180,000
  Net:         ~$420,000
  Margin:      70%
```

### Year 3 (Scale)

```
  Customers:   500 companies (avg $700/month)
  Revenue:     $350,000/month = $4.2M/year
  Costs:       $50,000/month = $600K/year
  Net:         ~$3.6M
  Margin:      85%
```

## Key Metrics to Track

| Metric | Target | Why it matters |
|---|---|---|
| Cost per interview (voice) | <$0.50 (API), <$0.15 (self-hosted) | Ensures margins stay high |
| Interview completion rate | >80% | Candidates must finish for profile to be useful |
| Profile accuracy (human-verified) | >85% | Trust depends on accuracy |
| Employer conversion (trial→paid) | >20% | Standard B2B SaaS benchmark |
| Hiring outcome correlation | Positive | The ultimate proof that profiles work |
| ABLEIST harm detection rate | <5% of profiles | Bias must stay low |
| Monthly churn | <5% | Standard SaaS health |

## Break-Even Analysis

```
Monthly fixed costs (early stage): ~$4,000
Average revenue per customer: $400/month
Variable cost per customer: ~$25/month (voice API) or ~$6/month (self-hosted)

Break-even customers = $4,000 / ($400 - $25) = ~11 customers (unchanged — voice costs don't materially affect break-even)

Timeline to 11 customers: ~8-10 months from launch
```

## Funding Requirements

| Stage | Amount Needed | Purpose |
|---|---|---|
| Pre-seed (optional) | $25,000-50,000 | Runway to build MVP and reach first revenue |
| Seed (if scaling fast) | $500K-1M | Hire team, sales, marketing |
| Series A (Year 3) | $5-10M | Scale to multiple markets, build moat |

**Can this be bootstrapped?** Yes, if you keep costs lean and reach 11 paying customers within 10 months. The $25K pre-revenue gap can come from savings or a small angel check.
