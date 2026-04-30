 ## Figma AI Master Prompt

  Redesign the PlacedOn employer dashboard as a dense, simple, high-volume ATS-style hiring operations hub for recruiters and HR teams reviewing thousands of applications.

  Primary user:
  A recruiter or HR ops person at a large company who needs to review, filter, triage, compare, assign, and move many candidates quickly.

  Core UX goal:
  Help the employer answer:
  “Which candidates need action now, why are they recommended, and what is the next hiring step?”

  Important visual rule:
  Do NOT create a card-inside-card layout. Avoid nested cards, decorative glass panels, and heavy floating boxes. Use a clean app shell with rows, tables, side panels, drawers, tabs, dividers, and compact grouped
  sections. Cards may be used only for top-level repeated candidate items in mobile/card mode.

  Visual style:
  Use PlacedOn’s existing premium hiring identity but make this employer surface simpler, calmer, and more operational.
  Colors:
  - Text: #1F2430
  - Primary blue: #3E63F5
  - Trust green: #10B981
  - Deep employer green: #0A6847
  - Background: #F8F7F5
  - Surface: #FFFFFF
  Avoid purple-heavy gradients, decorative orbs, bokeh, busy dot backgrounds, and marketing-style hero layouts.

  Desktop layout:
  - Fixed top app bar.
  - Left navigation rail for roles, saved views, and pipeline stages.
  - Center dense candidate queue/table.
  - Right evidence drawer/panel for the selected candidate.
  - Keep everything scannable and task-focused.

  Mobile layout:
  - Feed-first.
  - Role selector at top.
  - Filters open as a drawer.
  - Candidate details open as a bottom sheet.
  - No horizontal overflow.
  - No text overlap.

  ## Main Dashboard Prompt

  Create the main employer dashboard screen.

  Top app bar:
  Left: PlacedOn logo and “Employer workspace”.
  Center: global candidate search.
  Right: notifications, team members, company menu.

  Left rail:
  Section 1: Roles
  Show active roles with compact counts:
  - Senior Full-Stack Engineer — 187 new, 42 high fit, 8 pending intros
  - Frontend Engineer — 311 new, 65 high fit, 14 pending intros
  - Engineering Manager — 92 new, 11 high fit, 3 pending intros

  Each role row should be compact, not a card. Use active row background only.

  Section 2: Saved views
  - Needs review
  - High-fit candidates
  - Waiting for hiring manager
  - Intro replies
  - Stale candidates

  Section 3: Pipeline
  - New
  - Reviewed
  - Shortlisted
  - Hiring Manager Review
  - Intro Requested
  - Candidate Accepted
  - Interviewing
  - Offer
  - Hired
  - Rejected

  Main content:
  Header: “Candidate operations”
  Subtext: “Triage evidence-backed candidates and move the strongest matches forward.”

  Use compact metric strips, not large cards:
  - New candidates
  - Awaiting review
  - High-fit
  - Intro replies
  - Stale reviews

  Candidate queue:
  Use a dense table/list as the default view. Show at least 8 candidates in the desktop viewport.

  Columns:
  - Select checkbox
  - Candidate
  - Role
  - Fit
  - Evidence
  - Stage
  - Location
  - Availability
  - Owner
  - Last activity
  - Next action

  Rows should be clean, with subtle dividers, hover state, and selected state. Avoid large vertical candidate cards.

  Right panel:
  When no candidate is selected, show:
  - Role health
  - Queue summary
  - Privacy reminder
  - Next recommended action

  When candidate is selected, show the evidence panel.

  ## Candidate Row Prompt

  Design the dense candidate row for high-volume screening.

  Each row must include:
  - Checkbox for bulk selection
  - Candidate identity: anonymous ID or candidate name depending on visibility stage
  - Target role
  - Fit score, e.g. 94%
  - Evidence confidence: Strong, Moderate, Needs validation
  - One-line “why this match”
  - Top two evidence tags
  - Stage
  - Location
  - Availability
  - Owner
  - Last activity
  - Primary next action

  Do not use a card inside the row. Use table cells, badges, icons, and text hierarchy.

  Example row content:
  Candidate: Alex Rivera
  Role: Senior Full-Stack Engineer
  Fit: 94%
  Evidence: Strong
  Why match: “Strong frontend systems work with clear ownership signals.”
  Tags: React systems, API design
  Stage: New
  Location: San Francisco
  Availability: 2 weeks
  Owner: Priya
  Last activity: Today
  Action: Review evidence

  ## Evidence Panel Prompt

  Design the right-side candidate evidence panel.

  This panel appears when a recruiter selects a candidate row. It should not navigate away from the queue.

  Structure:
  1. Candidate header
  - Name or anonymous ID
  - Target role
  - Fit score
  - Evidence confidence
  - Current stage

  2. Match summary
  A short explanation of why PlacedOn recommends the candidate.

  3. Evidence breakdown
  Use clean sections with dividers, not nested cards.
  Each evidence item:
  - Skill or trait name
  - Signal strength
  - Confidence
  - AI-generated evidence summary
  - No raw transcript quotes

  4. Risk / uncertainty
  Show one or two areas needing validation.

  5. Recruiter workflow
  - Owner
  - Stage dropdown
  - Notes field
  - Tags
  - Assign reviewer
  - Request intro

  6. Privacy block
  Compact reminder:
  “Processed evidence only. No raw transcript. Candidate identity and contact unlock after opt-in.”

  Actions:
  - Save
  - Compare
  - Pass
  - Request intro

  ## Bulk Actions Prompt

  Design bulk actions for high-volume HR review.

  When one or more candidates are selected, show a sticky bulk action bar above the candidate queue.

  Bulk actions:
  - Assign owner
  - Move stage
  - Shortlist
  - Request intro
  - Pass
  - Add tag
  - Export shortlist

  The bar should show:
  “12 selected”

  Keep the design compact and practical. Do not use large cards or modal-heavy interactions unless required.

  ## Pipeline Prompt

  Create a pipeline view for the employer dashboard.

  The pipeline must support large-volume HR operations.

  Default view:
  Dense table grouped by stage.

  Optional secondary view:
  Kanban, but only for shortlisted or later-stage candidates.

  Stages:
  New
  Reviewed
  Shortlisted
  Hiring Manager Review
  Intro Requested
  Candidate Accepted
  Interviewing
  Offer
  Hired
  Rejected

  Each candidate row:
  - Candidate
  - Role
  - Fit
  - Evidence
  - Owner
  - Last activity
  - SLA / age in stage
  - Next action

  Add pipeline health alerts as slim banners, not cards:
  - “42 high-fit candidates have not been reviewed.”
  - “8 intro replies need scheduling.”
  - “Frontend Engineer role may be too strict; high-fit rate is below target.”

  ## Compare Mode Prompt

  Design candidate comparison mode.

  Use a side-by-side comparison table for 2 or 3 selected candidates.

  Rows:
  - Overall fit
  - Evidence confidence
  - Technical depth
  - Communication clarity
  - Ownership
  - Collaboration
  - Learning velocity
  - Availability
  - Location
  - Main strength
  - Main uncertainty
  - Recommended next step

  At the top, show a compact recommendation strip:
  - Best overall match
  - Strongest technical signal
  - Fastest available
  - Needs deeper review

  Do not make each candidate a large card. Use columns in a structured comparison table.

  ## Role Calibration Prompt

  Design the role calibration screen for employers.

  Purpose:
  Help HR create a role that PlacedOn can match candidates against.

  Flow:
  1. Paste job description.
  2. AI extracts structured criteria.
  3. Recruiter edits requirements.
  4. Recruiter adjusts importance weights.
  5. System previews candidate pool quality.

  Fields:
  - Role title
  - Department
  - Level
  - Location / remote policy
  - Required skills
  - Preferred skills
  - Experience range
  - Availability
  - Compensation range if available

  Importance weights:
  - Technical depth
  - Problem solving
  - Communication
  - Ownership
  - Collaboration
  - Ambiguity tolerance

  Warnings:
  - “This role may be too strict for early-career candidates.”
  - “High system design weighting may reduce the candidate pool.”
  - “Availability requirement excludes many high-fit candidates.”

  Use a clean form layout with sections and dividers. Avoid nested cards.

