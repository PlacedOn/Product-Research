  # Employer Job Listings Screen Plan

  ## Summary

  Add a new employer-facing job listings screen at /employer/jobs where HR teams can create, manage, calibrate, publish, pause, and monitor job listings. This screen should be built for high-volume recruiting:
  many roles, many applicants, multiple owners, structured criteria, and evidence-backed candidate matching.

  The screen should not look like stacked cards. Use a clean ATS-style layout: table rows, split panels, drawers, tabs, forms, dividers, and compact status badges.

  ## Screen Structure

  - Top bar: Job listings, global search, Create job primary button, import JD button.
  - Left rail: role status filters:
      - All jobs
      - Drafts
      - Active
      - Needs calibration
      - Paused
      - Closed
      - Archived
  - Main area: dense jobs table with sortable columns.
  - Right panel / drawer: selected job details, role health, calibration summary, and quick actions.
  - Create/Edit flow: full-page form or wide drawer with step-based sections.

  ## Job Listings Table Data

  Each job row should show:

  - Job title
  - Department / team
  - Location / work mode
  - Level
  - Status: Draft, Active, Needs calibration, Paused, Closed, Archived
  - Applicants
  - New candidates
  - High-fit candidates
  - Shortlisted
  - Intro requested
  - Hiring manager
  - Recruiter owner
  - Posted date
  - Last activity
  - Role health indicator
  - Next action

  Recommended columns:

  interface JobListingRow {
    id: string;
    title: string;
    department: string;
    team: string;
    level: string;
    employmentType: string;
    location: string;
    workMode: "onsite" | "hybrid" | "remote";
    status: "draft" | "active" | "needs_calibration" | "paused" | "closed" | "archived";
    applicantsCount: number;
    newCandidatesCount: number;
    highFitCount: number;
    shortlistedCount: number;
    introRequestedCount: number;
    recruiterOwner: string;
    hiringManager: string;
    postedDate?: string;
    lastActivity: string;
    roleHealth: "healthy" | "too_strict" | "too_broad" | "low_signal" | "needs_review";
  }

  ## Create Job Flow

  Use a guided form with these steps:

  1. Job Basics

  - Job title
  - Department
  - Team
  - Employment type: full-time, contract, internship
  - Seniority level: intern, fresher, junior, mid, senior, staff, manager
  - Number of openings
  - Hiring priority: low, normal, urgent
  - Recruiter owner
  - Hiring manager
  - Collaborators / reviewers

  2. Location & Work Setup

  - Country
  - City
  - Work mode: onsite, hybrid, remote
  - Time zone expectations
  - Relocation support
  - Visa sponsorship
  - Travel requirements
  - Office days if hybrid

  3. Compensation

  - Salary range
  - Currency
  - Equity range if applicable
  - Bonus / incentives
  - Whether compensation is public
  - Benefits summary
  - Notice period preference

  4. Job Description

  - Public job description
  - Responsibilities
  - What success looks like in 90 days
  - Required qualifications
  - Preferred qualifications
  - Interview process summary
  - Candidate-facing company/team pitch

  5. Matching Criteria
     This is the most important PlacedOn-specific section:

  - Required skills
  - Preferred skills
  - Must-have traits
  - Nice-to-have traits
  - Disqualifiers
  - Minimum experience
  - Domain experience
  - Education requirement, if truly needed
  - Availability requirement
  - Language requirement

  6. Evidence Weighting
     HR should be able to tune how candidates are ranked:

  - Technical depth
  - Problem solving
  - Communication clarity
  - Ownership
  - Collaboration
  - Learning velocity
  - Ambiguity tolerance
  - Leadership
  - Customer empathy
  - Execution speed

  Use sliders or weighted selectors:

  interface RoleWeighting {
    technicalDepth: number;
    problemSolving: number;
    communication: number;
    ownership: number;
    collaboration: number;
    learningVelocity: number;
    ambiguityTolerance: number;
    leadership: number;
    customerEmpathy: number;
    executionSpeed: number;
  }

  7. AI Calibration Review
     After the employer pastes or writes a JD, PlacedOn should parse it and show:

  - Parsed role title
  - Parsed level
  - Parsed must-have skills
  - Parsed preferred skills
  - Parsed traits
  - Suggested weightings
  - Candidate pool warning
  - Bias / compliance warning
  - “Too strict” or “too broad” warnings

  Example warnings:

  - “This role may be too strict for fresher candidates.”
  - “You weighted system design high for a junior role.”
  - “This requirement may reduce candidate pool quality.”
  - “Avoid using school/company prestige as a matching criterion.”

  8. Pipeline Setup

  - Default stages:
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
  - Stage owners
  - SLA per stage
  - Auto-archive rules
  - Rejection reasons
  - Required review notes before rejection

  9. Publishing

  - Save draft
  - Preview candidate-facing listing
  - Activate matching
  - Publish internally only
  - Publish publicly
  - Pause job
  - Close job

  ## Selected Job Detail Panel

  When a job is selected, the right panel should show:

  - Job title and status
  - Role health
  - Candidate funnel:
      - applicants
      - new
      - reviewed
      - shortlisted
      - intro requested
      - accepted
      - interviewing
      - offers
  - High-fit count
  - Calibration summary
  - Top required skills
  - Top weighted traits
  - Hiring team
  - Recent activity
  - Quick actions:
      - View candidates
      - Edit criteria
      - Calibrate role
      - Pause job
      - Close job

  ## High-Value Features

  - JD import: paste JD and let AI structure it.
  - Role calibration score: shows whether criteria are too broad, too narrow, or healthy.
  - Candidate pool preview: estimate how many candidates match before publishing.
  - Skill/trait weighting: lets employers tune matching beyond keywords.
  - Bias guardrails: prevent demographic, prestige, or discriminatory filters.
  - Hiring team ownership: recruiter, hiring manager, reviewers.
  - SLA tracking: highlight stale jobs and stuck candidates.
  - Clone job: duplicate a similar role.
  - Bulk job actions: pause, close, assign owner, archive.
  - Saved templates: reusable role templates for common hiring.
  - Job analytics: fit distribution, intro acceptance, bottlenecks, time in stage.

