Use this as the content/data spec for the `profile-generating` screen and the final candidate profile.

**Generation Screen**
Show 4 transparent progress steps:

- `Analyzing your answers`
- `Extracting verified skill signals`
- `Building your profile summary`
- `Preparing your privacy and sharing controls`

Show this copy block:

- `Your profile is being built from what you demonstrated in the interview.`
- `Raw transcript is never shown publicly.`
- `You will review everything before your profile is visible to companies.`

Show 4 preview cards on the screen:

- `AI Summary`
  Preview text: `A concise overview of how you think, communicate, and solve problems.`
- `Top Strengths`
  Preview text: `Your strongest signals, backed by interview evidence.`
- `Verified Skills`
  Preview text: `Skills inferred from the interview, not self-reported claims.`
- `Privacy & Visibility`
  Preview text: `You control what is public, what is private, and when companies can view your profile.`

**Candidate Profile: Must-Show Sections**
This is what the full candidate profile should contain.

- `Profile Status`
  Generated, last updated, freshness, visibility state, version
- `Candidate Identity`
  Name, target role, role track, location, work preference, availability
- `AI Summary`
  2-3 sentence profile summary
- `Top Strengths`
  3 strongest signals with confidence label and short evidence reason
- `Verified Skills`
  Role-relevant skill tags inferred from interview
- `How You Work`
  Communication, problem-solving, collaboration, growth mindset, technical thinking
- `Skills To Strengthen`
  Framed constructively, not as failures
- `Role Alignment`
  Primary role fit and adjacent role fits
- `Evidence Highlights`
  Short evidence summaries tied to interview moments
- `Achievements & Education`
  Candidate-added items with verification state
- `Privacy & Sharing`
  Public summary, PlacedOn visibility, full profile access rules, share link controls
- `Candidate Notes`
  Optional candidate context
- `Interview Details`
  Interview date, duration, role assessed, retake eligibility
- `Trust Signals`
  Bias audit passed, transcript privacy, evidence-backed profile messaging

**Do Not Show**
Remove these from the candidate profile:

- Raw transcript as default profile content
- Global rank like `Top 5% Developer`
- Universal leaderboard language
- Exact internal scoring mechanics
- Judge history
- Bias flags unless the candidate needs to act on something
- Harsh “weakness” framing

**Example Candidate Profile Data**
Use this as the first realistic content fixture for Figma:

```json
{
  "profile_status": {
    "state": "Ready for review",
    "visibility": "Private until you publish",
    "generated_at": "Today, 4:12 PM",
    "last_updated": "Today, 4:12 PM",
    "version": 1,
    "freshness_label": "New profile"
  },
  "identity": {
    "name": "Aisha Sharma",
    "target_role": "Frontend Engineer",
    "role_track": "Software Engineering",
    "experience_level": "Early-career",
    "location": "Bengaluru, India",
    "work_preference": "Remote or Bengaluru",
    "availability": "Open to opportunities"
  },
  "summary": "Aisha is a frontend-focused engineer who explains technical decisions clearly and approaches UI problems with structure. She showed strong thinking around component reuse, state management, and debugging under constraints. Her profile suggests she is ready for frontend product teams that value clarity, ownership, and user-facing quality.",
  "top_strengths": [
    {
      "title": "Component Architecture",
      "confidence": "High confidence",
      "reason": "Explained how she breaks interfaces into reusable components and manages shared state.",
      "evidence_count": 3
    },
    {
      "title": "Debugging Approach",
      "confidence": "High confidence",
      "reason": "Walked through isolating a UI bug step by step instead of guessing fixes.",
      "evidence_count": 2
    },
    {
      "title": "Product Communication",
      "confidence": "Medium-high confidence",
      "reason": "Connected technical tradeoffs to user experience and team collaboration.",
      "evidence_count": 2
    }
  ],
  "verified_skills": [
    "React",
    "TypeScript",
    "State Management",
    "Responsive UI",
    "API Integration",
    "Component Design",
    "Debugging",
    "Accessibility Basics"
  ],
  "work_style": {
    "technical_thinking": "Maps the problem before proposing implementation details.",
    "communication_style": "Clear, structured, and comfortable thinking aloud.",
    "problem_solving": "Breaks issues into smaller parts and validates assumptions before acting.",
    "collaboration": "Explains tradeoffs in a way that would work well with design and product teams.",
    "growth_mindset": "Shows willingness to improve and reflects on what could be done better."
  },
  "skills_to_strengthen": [
    {
      "title": "Testing Discipline",
      "note": "Needs more evidence around automated testing strategy and edge-case coverage."
    },
    {
      "title": "Performance Depth",
      "note": "Showed awareness of performance, but needs more evidence in optimization at scale."
    },
    {
      "title": "System Design Breadth",
      "note": "Strong for frontend architecture, but broader cross-system reasoning needs more evidence."
    }
  ],
  "role_alignment": {
    "primary_fit": "Frontend Engineer",
    "adjacent_roles": [
      "UI Engineer",
      "Product Engineer",
      "Design Engineer"
    ],
    "fit_label": "Strong fit for frontend product teams"
  },
  "evidence_highlights": [
    {
      "skill": "State Management",
      "highlight": "Described separating global cart state from local UI state to reduce unnecessary re-renders."
    },
    {
      "skill": "Debugging",
      "highlight": "Explained how she narrowed a rendering bug by checking data flow, component boundaries, and timing."
    },
    {
      "skill": "Communication",
      "highlight": "Spoke in clear steps and tied technical choices back to user experience."
    }
  ],
  "achievements_and_education": [
    {
      "type": "Education",
      "title": "B.Tech in Computer Science",
      "source": "RV College of Engineering",
      "verification": "Self-added"
    },
    {
      "type": "Experience",
      "title": "Frontend Intern",
      "source": "Startup internship",
      "verification": "Discussed in interview"
    },
    {
      "type": "Project",
      "title": "E-commerce UI rebuild",
      "source": "Personal / internship project",
      "verification": "Verified through interview"
    }
  ],
  "privacy_and_sharing": {
    "public_summary_link": "Off",
    "visible_to_matching_companies": "Off until published",
    "full_profile_access": "Only after candidate approval",
    "raw_transcript_visibility": "Private"
  },
  "candidate_notes": "",
  "interview_details": {
    "interview_date": "Today",
    "duration": "23 minutes",
    "role_assessed": "Frontend Engineer",
    "retake_eligible_in": "7 days"
  },
  "trust_signals": {
    "evidence_backed": true,
    "bias_audit_passed": true,
    "candidate_reviews_before_publish": true
  }
}
```

**Best Visual Grouping For Figma**
Tell Figma to structure the candidate profile in this exact order:

1. `Profile status + visibility`
2. `Name + target role + freshness`
3. `AI summary`
4. `Top strengths`
5. `Verified skills`
6. `How you work`
7. `Skills to strengthen`
8. `Role alignment`
9. `Evidence highlights`
10. `Achievements and education`
11. `Privacy and sharing`
12. `Interview details + retake eligibility`

**Figma AI Prompt**
```text
Design the PlacedOn candidate profile using this data structure.

The profile should feel like a verified career asset, not a leaderboard and not a resume.

Use these sections in order:
- Profile status and visibility
- Candidate identity
- AI summary
- Top strengths
- Verified skills
- How you work
- Skills to strengthen
- Role alignment
- Evidence highlights
- Achievements and education
- Privacy and sharing
- Interview details

Important design rules:
- Use “High confidence”, “Strong signal”, and “Needs more evidence” instead of percentile or leaderboard language.
- Do not show raw transcript as part of the main profile.
- Make privacy and visibility extremely clear.
- Show evidence-backed reasoning, not vague praise.
- Keep the current PlacedOn warm glassmorphism language, but make the information hierarchy calmer and more credible.
```

If you want, I can next generate:
- `3 more sample candidate profiles` for different roles, or
- `exact UI card copy for each section` so Figma has ready-to-drop text.