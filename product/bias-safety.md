# Bias & Safety Framework

## Why This Matters

The ABLEIST paper (Phutane et al., 2025) found that **99.7% of LLM-generated hiring conversations** involving disabled candidates contained at least one form of ableist harm. Existing safety tools (Perspective API, OpenAI Moderation, Azure AI Safety, Detoxify) detected **none of it**.

For an AI interviewer, bias isn't a nice-to-have concern — it's existential:
- **Legal risk:** NYC LL144, EU AI Act, Illinois AIPA require bias audits
- **Reputation risk:** One viral example of biased AI interviewing kills trust
- **Ethical risk:** You're directly affecting people's livelihoods
- **Product risk:** Biased profiles are inaccurate profiles — they hurt employers too

## The ABLEIST Framework (Integrated)

### 8 Metrics to Check

**Ableism-Specific (5):**

| Metric | What to Watch For | Example in Interview Context |
|---|---|---|
| One-Size-Fits-All Ableism | Treating a disability as monolithic | AI assumes all blind candidates need screen readers |
| Infantilization | Depicting candidate as dependent | AI asks simpler questions after learning about disability |
| Technoableism | Framing tech as the "fix" | Profile says "with assistive tools, can be just as productive" |
| Anticipated Ableism | Worrying about others' reactions | Profile notes "clients might be uncomfortable" |
| Ability Saviorism | Offering unsolicited help framing | Profile suggests "team could provide extra support" |

**Intersectional (3):**

| Metric | What to Watch For | Example in Interview Context |
|---|---|---|
| Inspiration Porn | Framing identity as inherently admirable | "Despite being blind, she showed remarkable skill" |
| Superhumanization | Attributing extraordinary traits to identity | "His autism gives him exceptional attention to detail" |
| Tokenism | Valuing for diversity, not qualifications | "Would add diversity to the engineering team" |

### When to Check

Bias checks run at **every state contraction** (every ~5 minutes of interview):

```
Candidate responds → Extract observations → Update state →
→ BIAS CHECK on updated state →
→ If harm detected: reword observation, flag for review
→ If clean: proceed to next question
```

Also run a **final comprehensive check** on the completed profile before it's visible to employers.

## Implementation

### Level 1: LLM-Based Check (MVP)

At every contraction, run the bias check prompt (see Markovian-Reasoning/AoT-for-AI-Interviewer.md for full template).

- Fast, cheap ($0.00036 per check)
- Catches most overt and subtle harms
- Not perfect — LLMs can miss what they themselves produce

### Level 2: Distilled Detection Model (Growth Phase)

The ABLEIST paper fine-tuned Llama-3.1-8B-Instruct as a dedicated harm detector:
- Macro F1 = 0.75-0.94 across all 8 metrics
- Open-weight, can be self-hosted
- Cheaper and more consistent than API calls
- Deploy as a sidecar service that reviews every profile

### Level 3: Human Review (Scale Phase)

- Random sample 5% of profiles for human bias audit
- All flagged profiles get human review before going live
- Quarterly aggregate analysis across demographics
- Annual third-party bias audit (for enterprise customers and regulatory compliance)

## Legitimate Assessment vs. Ableism — The Critical Distinction

The hardest design challenge in a fair AI interviewer is distinguishing between **legitimate job-relevant assessment** and **ableist assumptions**. These feel similar but are fundamentally different.

### The Difference Is in the Reasoning Process

```
ABLEIST REASONING (never acceptable):
  Disability diagnosis → Assumed limitation → Negative assessment
  "She's blind → blind people can't monitor classrooms → poor fit for teaching"

LEGITIMATE REASONING (always acceptable):
  Job requirement → Observed behavior → Evidence-based assessment
  "Role requires classroom management → candidate described using spatial
   audio cues and student helpers → demonstrates creative problem-solving"
```

The first shortcuts from diagnosis to conclusion. The second evaluates what the candidate actually demonstrated, regardless of disability status.

### The Core Principle: Assess Behavior, Never Diagnosis

A blind teacher CAN teach effectively — many do, using alternative methods. An autistic developer CAN collaborate — many do, often preferring async communication that benefits the whole team.

The AI interviewer should never:
- Use a diagnosis as a proxy for ability
- Compare a candidate to a hypothetical "normal" person
- Assume what "people with X" typically can or can't do

The AI interviewer should always:
- Evaluate what the candidate actually said and demonstrated
- Apply the same standards regardless of disability status
- Note skill gaps as skill gaps, without attributing them to a diagnosis

### The Swap Test

Before recording any observation, the AI should apply this check:

> **"Would I write this observation about a candidate without this disability?"**

| Observation | Swap Test | Verdict |
|---|---|---|
| "Despite being blind, showed strong technical skills" | Would you say "despite being sighted, showed strong skills"? No. | Remove disability reference |
| "His autism gives him exceptional attention to detail" | Would you say "his neurotypicality gives him good communication"? No. | Attribute trait to the person, not the diagnosis |
| "Struggled to articulate teamwork experience" | Would you say this about anyone who struggled? Yes. | Legitimate observation |
| "She'd be such an inspiration to the students" | Would you say this about a non-disabled teacher? No. | Inspiration Porn — remove |
| "Gave a detailed, structured answer about system design" | Would you say this about anyone? Yes. | Legitimate observation |

### The Legal Framework: BFOQ and Reasonable Accommodation

Employment law provides a clear test:

```
Step 1: Define the ESSENTIAL functions of the job
        (genuinely essential, not "nice to have")

Step 2: Can the candidate perform these essential functions?

Step 3: If not directly, can they perform them WITH
        reasonable accommodation?

Step 4: Only if NO reasonable accommodation exists
        can disability be a relevant factor
```

Your AI interviewer should NEVER reach Step 4. It assesses demonstrated skills and thinking — it doesn't determine whether physical accommodations are possible. That's between the candidate and the employer.

### Hard Cases and How to Handle Them

**Case 1: Candidate's disability genuinely limits a demonstrated skill**

Example: An autistic candidate genuinely cannot engage in conversational back-and-forth needed to assess collaboration.

Response: Offer alternative formats first ("Would you prefer to answer in writing?", "Would you like to describe a past project instead?"). If after accommodation they still can't demonstrate the skill, record it as a behavioral observation without mentioning the diagnosis.

**Case 2: The AI notices a limitation but isn't sure if it's disability-related**

Response: It doesn't matter. "Candidate struggled to explain their teamwork approach" is valid regardless of cause. The AI should never speculate about WHY someone struggled.

**Case 3: Candidate self-discloses and attributes a strength to their disability**

Example: "My ADHD actually helps me context-switch between tasks really well."

Response: Record the demonstrated ability, not the attribution. Profile says "demonstrates strong context-switching ability" — not "ADHD helps them context-switch."

### Interview Accommodation Protocol

When a candidate discloses a disability, the AI should adapt its OWN process — not its assessment standards:

```
If candidate mentions visual impairment:
  → Describe any visual elements verbally
  → Don't reference visual scenarios in questions
  → Assessment standards: unchanged

If candidate mentions autism:
  → Allow more processing time before expecting response
  → Don't penalize literal interpretation of questions
  → Offer written response option for complex questions
  → Assessment standards: unchanged

If candidate mentions motor disability:
  → Allow more time for typed responses
  → Don't penalize typos or slow responses
  → Assessment standards: unchanged

For ALL disabilities:
  → Never adjust question DIFFICULTY
  → Never lower expectations
  → Never ask about the disability itself
  → Ask about accommodations for the ROLE only if relevant
```

### What the AI's Observations Should Look Like

```
WRONG (contains ableist patterns):
  {
    "observation": "Despite autism, candidate showed strong analytical
     thinking. His condition may give him an edge in pattern recognition
     but could make collaboration challenging for the team.",
    "concern": "Team members might need to adapt communication style"
  }

RIGHT (behavior-only assessment):
  {
    "observation": "Candidate demonstrated strong analytical thinking.
     Broke down a complex problem into components before solving. When
     asked about team projects, gave a specific example of using shared
     documents for async collaboration. Preferred written over verbal
     communication for complex topics.",
    "strength": "Structured analytical approach",
    "area_to_explore": "Comfort with real-time verbal collaboration"
  }
```

The second version is actually MORE useful to a hiring manager — it's specific, behavioral, and actionable. The first is vague, stereotype-driven, and speculative.

## Bias Prevention (Not Just Detection)

Detection is reactive. Prevention is better.

### Interview Design Safeguards

1. **Question parity:** The AI must ask questions of similar depth and difficulty regardless of candidate identity. Track: average question complexity score across demographic groups.

2. **Trait parity:** The distribution of trait categories should be similar across groups. If blind candidates disproportionately get "communication" traits while sighted candidates get "technical" traits, something is wrong.

3. **Follow-up parity:** The AI should probe deeper on interesting signals equally. Track: number of follow-up questions per demographic group.

4. **Language parity:** Profile language should not differ systematically by identity. "Shows resilience" for disabled candidates vs. "shows skill" for non-disabled candidates is a red flag.

### Prompt-Level Safeguards

All prompts include:
```
IMPORTANT: Your assessment must be based solely on the candidate's
demonstrated skills, thinking process, and communication — never on
their identity, disability status, gender, nationality, caste, or
any other demographic characteristic. If you notice yourself making
an observation that you would not make for a candidate without this
identity marker, remove it.
```

### State-Level Safeguards

The candidate state JSON should **never store identity markers** as assessment-relevant fields. Identity information (if disclosed by the candidate) is stored separately and is NOT passed to the decompose, contract, or question-generation prompts.

```
CORRECT:
  "observations": ["Asks clarifying questions before answering"]

WRONG:
  "observations": ["Despite being blind, asks clarifying questions"]
```

## Monitoring Dashboard

### Metrics to Track Continuously

| Metric | Target | Alert Threshold |
|---|---|---|
| ABLEIST harm rate (per profile) | <2% | >5% |
| Interview completion rate by demographic | Equal (±5%) | >10% gap |
| Average question difficulty by demographic | Equal (±0.5 std) | >1.0 std gap |
| Trait category distribution by demographic | Equal (±10%) | >20% gap |
| Profile confidence score by demographic | Equal (±5%) | >10% gap |
| Judge reversal rate by demographic | Equal (±5%) | >10% gap |

### Quarterly Audit Checklist

- [ ] Run aggregate ABLEIST analysis across all profiles
- [ ] Compare trait distributions across disability, gender, nationality, caste
- [ ] Review all flagged profiles from the quarter
- [ ] Check: Do employers shortlist candidates from different demographics at similar rates?
- [ ] Update bias check prompts if new harm patterns identified
- [ ] Document findings for regulatory compliance file

## Regulatory Compliance

### NYC Local Law 144 (US)

- Requires annual bias audit by independent auditor
- Must publish audit results
- Applies if your tool is used for hiring in NYC
- **Our compliance:** ABLEIST framework + quarterly audits + audit dashboard

### EU AI Act (Europe)

- AI hiring tools classified as "high-risk"
- Requires transparency, human oversight, bias testing
- Must maintain technical documentation
- **Our compliance:** Candidate sees own profile, human review option, full audit trail

### Illinois AIPA (US)

- Requires candidate consent before AI analysis
- Must explain how AI is used
- Candidate can request alternative assessment
- **Our compliance:** Consent flow before interview, explanation of process, human interview alternative

## Incident Response

If a bias incident is reported:

1. **Immediate:** Pull the flagged profile from employer view
2. **24 hours:** Human review of the profile and interview transcript
3. **48 hours:** Root cause analysis — was it a prompt issue, model issue, or edge case?
4. **1 week:** Fix deployed + regression test
5. **2 weeks:** Candidate notified of resolution, offered re-interview if desired
6. **Monthly:** Aggregate incident trends reviewed

## The Bottom Line

Bias protection isn't a feature — it's a **core architectural principle**. Every component of the system (prompts, state management, profile generation, employer-facing UI) must be designed with bias prevention in mind from day one.

The ABLEIST paper proves that bolting safety on after the fact doesn't work — Perspective API and OpenAI Moderation failed completely. We build it in from the ground up.
