# Candidate Matches Page

Route: `/candidate/matches`

## Goal

Show roles matched to the candidate's verified profile while preserving privacy and agency.

## Required Sections

1. Header
   - Eyebrow: `Candidate matches`
   - Title: `Your Matches`
   - Subtitle: `Roles matched to your verified skills, preferences, and availability.`
   - Status pill: `Profile visibility: Anonymous`

2. Summary cards
   - Role matches
   - High-intent companies
   - Strongest fit

3. Filters and search
   - Search placeholder: `Search companies, roles, or skills`
   - Chips: `All`, `Strong Fit`, `Remote`, `Recently Viewed`, `Needs Response`

4. Match cards
   - Company
   - Role
   - Match percentage
   - Location/work mode
   - Status
   - Why matched
   - Evidence chips
   - Actions: `View Details`, `Accept Intro`, `Save`, `Hide`

5. Visibility panel
   - Title: `What companies can see`
   - Visible: verified skills, role fit score, evidence-backed strengths, anonymous summary
   - Hidden until approved: name, photo, contact details, raw transcript

6. Empty state
   - Title: `Complete your first interview to unlock matches`
   - Body: `Your matches are generated from your verified profile, not resume keywords.`
   - CTA: `Start Interview`

## Responsive Behavior

Desktop: match list plus right-side visibility panel.

Mobile: stacked cards, horizontally scrollable filters, wrapped action buttons.
