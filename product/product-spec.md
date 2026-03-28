# Product Specification

## Overview

PlacedOn is an AI-powered interviewer that conducts adaptive 30-40 minute conversations with candidates to build behavioral trait profiles that capture what resumes cannot.

## User Types

### 1. Candidate
- Signs up, completes an AI interview
- Receives their profile, can add context
- Profile is shared with employers on the platform

### 2. Employer (Hiring Manager)
- Signs up with company account
- Browses candidate profiles
- Filters by role, traits, experience
- Initiates contact with candidates

### 3. Admin (Internal)
- Monitors system health
- Reviews flagged profiles (bias, quality)
- Manages billing and accounts

## Core Features

### Feature 1: AI Interview

**User:** Candidate

**Flow:**
1. Candidate signs up → minimal onboarding (name, email, role seeking)
2. Interview starts with warm-up ("Tell me about yourself")
3. AI adaptively asks questions based on Markovian reasoning loop:
   - Decompose remaining assessment goals
   - Select highest-priority independent goal
   - Ask targeted question
   - Listen, observe, record
   - Contract candidate state
   - Judge fidelity + bias check
4. Interview ends when:
   - 40 minutes elapsed, OR
   - All assessment goals are sufficiently covered, OR
   - Judge detects quality degradation (rare)
5. Profile is generated and shown to candidate

**Interface:** Voice-based conversational interview (primary). Text-based fallback for accessibility.

**Interview Structure:**
- 6 segments of ~5 minutes each
- Phase 1 (5 min): Warm-up with open-ended question — gets candidate comfortable, establishes communication style
- Phase 2 (15 min): 2-3 situational scenarios relevant to role but accessible to freshers — assesses problem-solving, decision-making, ambiguity handling
- Phase 3 (8 min): Depth probe on area with strongest signal — where atomic traits crystallize
- Phase 4 (2 min): Warm close and explanation of what happens next

**Technical notes:**
- Each interview = ~30 LLM calls (decompose, contract, judge, bias check per segment)
- Cost breakdown: $0.35–0.50 per interview (voice) with API; ~$0.12 self-hosted at scale
- Candidate state is saved after each segment (enables resume if disconnected)
- Interview can end early if all goals covered (don't pad with filler)

### Feature 2: Candidate Profile

**User:** Candidate + Employer

**Contents:**
```
Candidate Profile
├── Summary (2-3 sentence overview)
├── Atomic Traits
│   ├── Technical Thinking
│   │   └── "Approaches system design by first mapping constraints,
│   │       then evaluating trade-offs verbally. Stronger at breadth
│   │       than depth in algorithms."
│   ├── Communication Style
│   │   └── "Clear and structured. Asks clarifying questions before
│   │       answering. Becomes more expressive when discussing topics
│   │       they're passionate about."
│   ├── Problem-Solving Approach
│   │   └── "Prefers to think aloud. When stuck, reframes the problem
│   │       rather than brute-forcing. Comfortable saying 'I don't know.'"
│   ├── Collaboration Signals
│   │   └── "Naturally credits team members. Describes past work as 'we'
│   │       not 'I'. When asked about conflict, gives specific examples
│   │       rather than generic answers."
│   └── Growth Indicators
│       └── "Actively seeks feedback. Described a specific instance of
│           changing their approach based on a code review comment.
│           Curious about domains outside their expertise."
├── Confidence Score (how confident the AI is in this profile)
├── Evidence Links (which interview segments support each trait)
└── Candidate's Own Notes (optional additions by the candidate)
```

**Key design principle:** Every trait must be grounded in specific observed behavior, not vague adjectives.

### Feature 3: Employer Search & Browse

**User:** Employer

**Functionality:**
- Search by role type, experience level, location
- Filter by specific traits ("shows strong system thinking", "comfortable with ambiguity")
- Sort by relevance to their open role
- View full candidate profiles
- Shortlist candidates
- Request to connect (candidate must accept)

### Feature 4: Candidate Profile Review

**User:** Candidate

**Functionality:**
- View their own generated profile
- See what the AI observed (with evidence from the interview)
- Add context or clarification to any trait
- Flag any trait they disagree with (triggers human review)
- Re-interview option (max once per 3 months)

### Feature 5: Bias Dashboard

**User:** Admin + Employer

**Functionality:**
- Aggregate ABLEIST metrics across all interviews
- Breakdown by disability, gender, nationality, caste
- Alert if any metric exceeds threshold
- Comparison: profile trait distribution across demographic groups (should be similar)
- Exportable for regulatory compliance audits

### Feature 6: Employer Mobile App (LinkedIn-style)

**User:** Employer (Hiring Manager)

**Concept:** A LinkedIn-style mobile app where employers browse AI-generated candidate profiles. Candidates interview once; their atomic trait profile lives on the platform permanently and is discoverable by employers.

**Home Screen:**
- Tabs across the top — one per active job listing (e.g., "Backend Eng", "PM")
- Active tab shows a scrollable feed of candidate cards filtered to that role
- Trait filter bar below tabs — filter by specific atomic traits
- Each candidate card shows:
  - 3–4 atomic traits (the primary signal)
  - Experience level + domain (one line)
  - Interview date (freshness)
  - Inline Save / Pass actions

**Other Screens:**
- **Saved** — shortlisted candidates per job tab
- **Candidate Profile** — opens on card tap; full atomic trait breakdown + AI-generated interview summary

**Design principle:** No clutter. These three views (feed, saved, profile) are the complete scope. Everything else is a later addition.

### Feature 7: Candidate Mobile App

**User:** Candidate

**Screens:**

**Home — Job Matches**
- Ranked by trait fit to the candidate's atomic profile (not keyword matching)

**Profile**
- Atomic traits (generated from AI interview)
- Verified Achievements — proof-backed accomplishments, strictly moderated before appearing; not a feed, a section on the profile page
- Availability toggle — Open to opportunities / Not looking
- Optional candidate notes

**DMs**
- Employer outreach lands here; candidate accepts or ignores

**Notifications**
- Free: new job matches
- Premium: notified when a company saves their profile; notified when a company they're saved by views a new achievement they post

**No user-to-user connections.** The only relationship on the platform is candidate ↔ employer. Connections would reintroduce network-based bias that the platform is designed to eliminate.

**Design principle:** The profile should feel worth maintaining — atomic traits + verified achievements together represent a candidate more honestly than a LinkedIn profile. Retention comes from candidates keeping this up to date, not from engagement loops.

### Feature 8: Premium Tiers

**Candidate Premium**
- Notified when a company saves their profile
- Notified when a saved company views their new achievement
- Effect: awareness of who's watching + ability to stay top-of-mind through achievement posts

**Employer Premium**
- Priority placement in candidate job matches feed
- See which candidates viewed their job listing

**Design principle:** Free candidates still get discovered and contacted. Premium adds awareness and timing, not pay-to-win visibility. The platform remains fair to all candidates regardless of tier.

## Validation & Proof Strategy

The core product claim — "AI-generated atomic trait profiles predict job performance better than resumes" — requires evidence.

### Phase 1: Internal Consistency (Weeks 1-2)
- Run 20 candidates through two interviews 2 weeks apart
- Do atomic trait profiles converge?
- If no convergence, system is unreliable — refine prompts before continuing

### Phase 2: Human Benchmark (Weeks 3-8)
- Run 50 candidates through both PlacedOn AND an experienced hiring manager
- Compare profiles blind — where do they agree?
- When they diverge, which was more useful for the actual hiring decision?
- This is the key proof to sell with early employers

### Phase 3: Predictive Validity (Months 6-12)
- Track candidates hired through PlacedOn pilots
- Collect manager feedback at 3, 6, 12 months
- Correlate atomic traits to performance
- Even 30-50 hires with positive correlation is powerful proof

### Phase 4: Candidate Self-Validation (Immediate)
- After profile generation, ask: "Does this feel accurate?"
- Track agreement rate — 80%+ agreement signals the assessment isn't random

---

## MVP Scope (What to Build First)

### Must Have (MVP)
- [ ] AI interview (text-based, 30-40 min) — **Build this first**
- [ ] Markovian reasoning loop (decompose, contract, judge)
- [ ] Candidate profile generation (atomic traits)
- [ ] Candidate can view their own profile and flag disagreements
- [ ] Basic employer dashboard (job listings, candidate feed, save/pass)
- [ ] ABLEIST bias check on every state contraction
- [ ] Profile validation: candidate self-validation (does this feel accurate?)

### Nice to Have (V2)
- [ ] Voice interview (convert text to voice with STT/TTS)
  - Speech-to-text: Whisper API or self-hosted
  - Text-to-speech: ElevenLabs or Google TTS
  - Latency: <2 seconds response time for conversational feel
  - Handle Indian accents and code-switching (Hinglish)
- [ ] Employer trait filtering (search by specific atomic traits)
- [ ] Candidate profile editing (add achievements, notes)
- [ ] Premium tiers (notifications, visibility boosting)
- [ ] ATS integration
- [ ] Analytics dashboard

### Later (V3+)
- [ ] Multi-language support
- [ ] Industry-specific trait frameworks
- [ ] Outcome tracking (hire → performance correlation)
- [ ] API for third-party integrations

## Technical Requirements

### Performance
- Interview response latency: <3 seconds per AI message
- Profile generation: <60 seconds after interview ends
- Search results: <2 seconds

### Reliability
- 99.5% uptime (interview in progress must not drop)
- Auto-save candidate state every segment (enables resume after disconnect)

### Security
- All transcripts encrypted at rest
- Candidate data deletion on request (GDPR compliance)
- No raw transcripts shared with employers (only processed profiles)
- SOC 2 Type 1 by month 18

### Privacy
- Candidates explicitly consent before interview
- Candidates control who sees their profile
- Employers see profile only, never raw transcript
- Clear data retention policy (profiles kept for 12 months, then archived)
