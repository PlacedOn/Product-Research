# PlacedOn Documentation Index

**Last Updated:** March 22, 2026

This is the complete map of PlacedOn's product, research, and business documentation.

---

## Quick Navigation

### I Want To...

**...understand the big picture**
→ Start with `README.md` then `RESEARCH-SUMMARY.md`

**...build the MVP**
→ Read `CLAUDE.md` → `IMPLEMENTATION-ROADMAP.md` → `product/interviewer-model.md`

**...understand the Markov engine**
→ Read `Markovian-Reasoning/AoT-for-AI-Interviewer.md`

**...plan the go-to-market**
→ Read `business/go-to-market.md` → `business/unit-economics.md`

**...understand the risks**
→ Read `problems/critical-risks.md`

**...know everything**
→ Read in this order (below)

---

## Complete Reading Order (Full Context)

### Foundation (1-2 hours)
1. `README.md` — what PlacedOn is
2. `RESEARCH-SUMMARY.md` — all findings from product research
3. `CLAUDE.md` — guidance for future Claude sessions

### Product & Interviewer (2-3 hours)
4. `product/product-spec.md` — features, flows, MVP scope, validation strategy
5. `product/interviewer-model.md` — how the AI actually behaves
6. `Markovian-Reasoning/AoT-for-AI-Interviewer.md` — technical implementation

### Technical & Safety (1-2 hours)
7. `product/architecture.md` — system design, tech stack
8. `product/bias-safety.md` — ABLEIST framework, bias prevention
9. `IMPLEMENTATION-ROADMAP.md` — phased build plan, risks, costs

### Business & Market (1-2 hours)
10. `business/go-to-market.md` — launch strategy, college partnerships
11. `business/unit-economics.md` — costs, margins, financial projections
12. `business/competitive-analysis.md` — competitors, positioning
13. `business/market-analysis.md` — TAM/SAM/SOM, market opportunity

### Critique & Reality Check (30 min)
14. `problems/critical-risks.md` — honest assessment of what can fail

### Reference (as needed)
15. `research/notes/paper-summaries.md` — AoT and ABLEIST paper summaries
16. `research/notes/ABLEIST-deep-dive.md` — detailed bias framework analysis

---

## File Structure

```
/home/intelligentape/Life/08-PlacedOn/
│
├── README.md                           ← Project overview
├── CLAUDE.md                           ← Guidance for Claude sessions
├── IMPLEMENTATION-ROADMAP.md           ← Build plan & priorities
├── RESEARCH-SUMMARY.md                 ← This session's findings
├── INDEX.md                            ← (You are here)
│
├── product/
│   ├── product-spec.md                 ← Features, flows, MVP scope
│   ├── interviewer-model.md            ← AI behavior, edge cases
│   ├── architecture.md                 ← System design, tech stack
│   └── bias-safety.md                  ← ABLEIST framework
│
├── business/
│   ├── go-to-market.md                 ← Launch strategy
│   ├── unit-economics.md               ← Costs, margins, projections
│   ├── competitive-analysis.md         ← Competitors vs PlacedOn
│   └── market-analysis.md              ← Market size, opportunity
│
├── Markovian-Reasoning/
│   └── AoT-for-AI-Interviewer.md       ← Technical deep-dive
│
├── problems/
│   └── critical-risks.md               ← Honest critique
│
└── research/
    └── notes/
        ├── paper-summaries.md          ← Key papers summary
        └── ABLEIST-deep-dive.md        ← Bias framework details
```

---

## Key Documents by Purpose

### Product Definition
- `product/product-spec.md` — what the product does
- `product/interviewer-model.md` — how the core AI behaves
- `RESEARCH-SUMMARY.md` sections 1, 5, 6 — features and differentiation

### Technical Implementation
- `Markovian-Reasoning/AoT-for-AI-Interviewer.md` — core engine
- `product/architecture.md` — system design
- `product/bias-safety.md` — bias detection
- `IMPLEMENTATION-ROADMAP.md` — build order

### Go-to-Market
- `business/go-to-market.md` — launch phases
- `business/market-analysis.md` — who to target
- `RESEARCH-SUMMARY.md` section 5 — Indian market opportunity
- `RESEARCH-SUMMARY.md` section 4 — validation strategy

### Business Viability
- `business/unit-economics.md` — costs and margins
- `business/competitive-analysis.md` — positioning
- `RESEARCH-SUMMARY.md` section 9 — revenue model

### Risk & Reality Check
- `problems/critical-risks.md` — 7 major risk areas
- `RESEARCH-SUMMARY.md` section 7 — detailed critique
- `IMPLEMENTATION-ROADMAP.md` — tech risks and mitigations

---

## Key Numbers to Remember

| Metric | Value | Where |
|---|---|---|
| Cost per interview (voice, API) | $0.35–0.50 | unit-economics.md |
| Cost per interview (self-hosted) | ~$0.12 | unit-economics.md |
| Break-even customers | ~11 @ $400/month | unit-economics.md |
| Year 1 net | -$25K (need runway) | unit-economics.md |
| Year 2 net | $420K | unit-economics.md |
| Year 3 net | $3.6M | unit-economics.md |
| Indian fresher supply | 1.5M/year | market-analysis.md |
| Time to MVP (text) | 4-6 weeks | IMPLEMENTATION-ROADMAP.md |
| Time to voice | +3-4 weeks | IMPLEMENTATION-ROADMAP.md |
| Interview length | 30 min (6 × 5-min segments) | product-spec.md |
| Gross margin | 87–98% | unit-economics.md |

---

## Critical Success Factors

1. **Markov contraction quality** — See `Markovian-Reasoning/AoT-for-AI-Interviewer.md` Part 2 & 3
2. **Predictive validity** — See `product/product-spec.md` Validation section
3. **Voice latency <2 sec** — See `IMPLEMENTATION-ROADMAP.md` Phase 2
4. **Indian fresher market fit** — See `business/go-to-market.md` Phase 1
5. **Bias protection at scale** — See `product/bias-safety.md`

---

## Open Questions for Next Session

1. College partnership strategy — which tier 2-3 colleges?
2. Predictive validity baseline — what counts as proof?
3. Hinglish support — how to handle in real-time?
4. Profile gaming — how to test robustness?
5. DPDP Act compliance — what's required under Indian law?

See `RESEARCH-SUMMARY.md` final section for details.

---

## Document Maintenance

When updating this repo:
1. Update the relevant document (product/, business/, etc.)
2. Update `RESEARCH-SUMMARY.md` if findings change
3. Update `CLAUDE.md` if guidance changes
4. Update `IMPLEMENTATION-ROADMAP.md` if priorities change
5. Keep this `INDEX.md` in sync with file structure

---

**Next Steps:**

- [ ] Read `CLAUDE.md` to understand the product direction
- [ ] Read `IMPLEMENTATION-ROADMAP.md` to understand the build plan
- [ ] Start with `product/interviewer-model.md` and `Markovian-Reasoning/AoT-for-AI-Interviewer.md` for implementation
- [ ] Read `business/go-to-market.md` for strategy
- [ ] Read `problems/critical-risks.md` to understand what can go wrong

Good luck building.
