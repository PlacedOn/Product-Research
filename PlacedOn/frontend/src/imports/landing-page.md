# Landing Page Spec

Route: `/`

## Goal

Make a first-time candidate understand PlacedOn in 5-10 seconds and feel enough trust to start an interview. Employers are secondary; they should be reassured without taking over the page.

## Product Message

PlacedOn helps candidates get hired through an AI interview that generates a verified skill profile. Companies discover candidates based on demonstrated ability, not resume claims.

## First-Viewport Requirements

The first viewport must communicate:

1. PlacedOn replaces resume-first screening with an AI interview.
2. The interview becomes a verified profile.
3. Companies discover candidates based on evidence.
4. The primary action is to start an interview now.

## Visual Direction

The landing page should be cleaner and more trustworthy than the candidate dashboard. Use a minimal premium SaaS style with warm confidence.

Use:

- Strong whitespace
- Clear reading flow
- Soft surfaces
- Product UI storytelling
- Subtle motion only where useful
- High contrast and readable copy

Avoid:

- Neon, cyberpunk, or generic AI startup styling
- Busy bento overload
- Stock photos
- Robot illustrations
- Heavy glassmorphism
- Purple/blue futuristic dominance
- Equal candidate/employer hero split
- Vague copy like `revolutionize hiring with AI`

## Palette Direction

Prefer:

- Deep green: `#0A6847`
- Bright green: `#16A34A`
- Mint: `#DCFCE7`
- Pale green background: `#F0FDF4`
- White: `#FFFFFF`
- Near-black text: `#1A1A1A` or existing `#1F2430`
- Warm gray: `#F5F5F5`
- Secondary text slate: `#64748B`
- Optional soft gold accent: `#FACC15`

Use existing PlacedOn dashboard colors where needed, but the landing page should move toward a more grounded trust palette.

## Typography

- Use Manrope or Plus Jakarta Sans.
- Headings should be bold, crisp, and direct.
- Body copy must be highly readable.
- The page should feel premium, not playful.

## Page Structure

### 1. Navbar

Include:

- PlacedOn logo
- Links: `How It Works`, `For Candidates`, `For Companies`, `Trust`, `Pricing`
- Right actions:
  - `Log In`
  - `Start Interview`

Behavior:

- Sticky header
- White or warm-white background
- Subtle bottom border
- Mobile menu must be clean and simple

### 2. Hero

Headline:

`Your skills should get you hired. Not your resume.`

Subheadline:

Explain that PlacedOn interviews the candidate, builds a verified skill profile, and helps companies discover them based on demonstrated ability.

Primary CTA:

- `Start Interview`

Secondary CTA:

- `I'm Hiring`

Trust micro-line:

- `Role-based interview. No trick questions. Takes about 30 minutes.`

Hero visual:

- Show AI interview conversation
- Show skill signals being extracted
- Show verified profile card being generated
- Make it product-like and explanatory, not decorative

### 3. Credibility Strip

Show trust elements:

- Verified skill profile
- Evidence-backed assessment
- Bias-checked system
- Candidate-controlled visibility

Do not use fake customer logos unless clearly marked as placeholders.

### 4. How It Works

Three steps:

1. Choose your role and start the interview.
2. AI turns your answers into a verified profile.
3. Companies discover you based on fit.

Each step needs:

- Short title
- One-sentence explanation
- Simple visual or icon

This section must be extremely easy to scan.

### 5. Sample Profile / Proof Section

This is one of the most important sections.

Show what the candidate receives after the interview:

- Professional summary
- Top strengths
- Confidence indicators
- Evidence-backed skills
- Verified achievements tag
- Visibility status

The user should think: `This is what I get if I start.`

### 6. Trust Section

Address skepticism directly.

Trust blocks:

- Evidence, not guesswork
- Bias-checked assessment
- You control what employers see
- Retake as you grow

Tone should be transparent, calm, and product-focused.

### 7. For Candidates

Focus on benefits:

- AI-inferred skills
- Professional summary generated from evidence
- Growth over time
- Visibility controls
- Application and offer tracking
- Verified achievements

Keep copy short and benefit-led.

### 8. For Companies

Shorter than candidate section.

Include:

- Hire based on evidence
- Role-specific fit matching
- Better than keyword screening
- Candidate comparison with proof

CTA:

- `I'm Hiring`

### 9. Final CTA

Use a dark green section with white text.

Headline:

`Start with one interview. Let your skills do the talking.`

Actions:

- Primary: `Start Interview`
- Secondary: `Learn How It Works` or `I'm Hiring`

### 10. Footer

Simple product-company footer.

Links:

- About
- Candidates
- Companies
- Trust
- Pricing
- Contact

## Interaction Guidance

- Above the fold must be simple and decisive.
- Keep max content width controlled.
- Use generous spacing between sections.
- Make mobile layout feel first-class.
- CTA styling must stay consistent.
- Cards should share radius, border, shadow, and spacing rules.

## Success Criteria

The final page should make a first-time candidate feel:

- I understand what this is.
- This feels credible.
- This seems better than applying with a resume.
- I want to start the interview now.

## Implementation Notes

- Do not change backend files.
- Do not introduce unrelated frontend dependencies.
- Do not use external stock images.
- If using sample company names or logos, mark them as sample/demo.
- Keep the public route at `/`.
