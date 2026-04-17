# Critical Risks and Problems

## 1. Cold Start Problem

Two-sided marketplace chicken-and-egg: employers won't pay until candidate pool is large enough, candidates won't interview until employers are hiring through the platform.

**Specific risk:** If the initial candidate pool is only freshers (via college partnerships), employers typecast PlacedOn as "the fresher platform," capping pricing power and making upmarket expansion difficult.

**Open question:** Who are the candidates in the free pilots? If the startup's existing applicants, PlacedOn is a screening tool, not a marketplace. If recruited externally, that requires acquisition budget.

## 2. Indian Market Realities

**Structural challenges:**
- Hiring is deeply relationship-driven. Referrals dominate at startups. First competitor isn't HireVue — it's "my CTO's college friend referred someone."
- Mass recruiters (TCS, Infosys, Wipro) have their own pipelines and campus drives. They won't adopt external tools.
- Indian startups churn fast. A startup paying $299/month may not exist in 6 months. Revenue base is unstable.
- $299/month is a real line item for a 15-person Indian startup. Many will want pay-per-hire, not SaaS.
- Campus placement cells are the dominant fresher hiring channel. Must work with them, not compete against them.

**Price sensitivity:**
- Candidate premium (paid tier) is weak in India. Job seekers are extremely price-sensitive. "See who saved your profile" works on LinkedIn because of brand trust and network effects. Day-one PlacedOn has neither.
- Employers already pay for Naukri (dominant job board) and LinkedIn Recruiter. PlacedOn is asking them to add a third platform spend.
- Break-even assumes $400/month average. Getting 11 Indian companies to pay this consistently is harder than the spreadsheet suggests.

## 3. Can Text Chat Assess Someone in 40 Minutes?

This is the core product risk. The entire thesis depends on it.

- **Typing speed bias.** Brilliant candidates who type slowly produce less signal. Fluent English typists seem more articulate. In India, English fluency varies enormously — risk of measuring language comfort, not capability.
- **Interview anxiety.** Talking to an AI in text for 40 minutes is unfamiliar. Candidates comfortable with chatbots outperform those who aren't, regardless of actual ability.
- **No body language, no tone.** A massive signal channel is lost. Atomic traits are text-derived traits, which is a subset of who someone actually is.
- **40 minutes is long for freshers.** A 21-year-old with no work history will run dry. What does the AI ask them for 40 minutes?

## 4. Validation Gap

The docs say "validate correlation between AI profiles and actual hiring outcomes" during pilots. This is hand-waved.

- Measuring profile accuracy requires waiting 6-12 months after someone is hired to know if the assessment was right.
- Until that data exists, PlacedOn is selling on faith. "Trust our AI's judgment about people" is a hard sell.
- If even one high-profile bad hire gets traced back to a PlacedOn profile, trust collapses.

**This is the single most important question:** Can PlacedOn prove, with data, that an atomic trait profile predicts job performance better than a resume + 30-minute human interview? Until answered with evidence, everything else is premature.

## 5. ABLEIST Framework — Differentiator vs. Overhead

- **Indian employers are not buying because of bias compliance.** NYC LL144 and EU AI Act don't apply to Bangalore startups. This solves a problem the buyer doesn't feel yet.
- **Adds latency and cost.** Running 8 bias metrics at every state contraction adds LLM calls. The $0.03/interview estimate may not account for this overhead.
- **False positives risk.** If the bias checker incorrectly flags a legitimate question, interview quality degrades.

## 6. Technical and Operational Failure Points

| Risk | What goes wrong |
|---|---|
| **Markov state contraction quality** | If the LLM loses information during contraction, trait profiles become shallow or wrong. One bad contraction compounds through the entire interview. |
| **Achievement moderation at scale** | Thousands of students posting achievements — who moderates? AI moderation has the same bias problems PlacedOn is trying to solve. Human moderation doesn't scale. |
| **Profile gaming** | Candidates will share "what to say in PlacedOn interviews" on Reddit/Telegram within weeks. The Markov engine must be robust to coached answers. |
| **LLM provider dependency** | The entire product is an API call to OpenAI. Price increase, rate limiting, or policy change can break economics overnight. |
| **Data privacy** | India's DPDP Act (2023) is still evolving. Storing AI-generated behavioral profiles is legally untested territory. |

## 7. The Student Market — Right Instinct, Hidden Traps

Freshers with no experience are the ideal candidate pool — they gain the most from trait-based profiling over resume screening. But:

**Do this right:**
- Partner with tier 2-3 engineering colleges (not IITs — those students already have access). 3,500+ engineering colleges in India produce graduates that employers can't efficiently filter.
- Make the interview available in Hinglish or regional languages eventually — English-only text chat excludes a massive chunk of capable candidates.
- Position to placement cells as "gives your students a verified profile they can share with any employer" — align with the college, don't compete.

**Don't do this:**
- Don't promise students jobs. Promise them a profile. The moment placement is promised, expectations become unmanageable and PlacedOn gets compared to placement agencies.
- Don't make it feel like another exam. Indian students are exam-fatigued. The interview should feel like a conversation, not a test.
