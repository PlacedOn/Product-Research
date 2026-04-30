# Employer Dashboard Demo Data Summary

## Access the Demo

Visit `/employer/demo-data` to see an interactive preview of all the mock data.

You can also access it from the main employer dashboard by clicking the "Demo Data" button in the top right.

## What's Available

### 1. Type Definitions (`src/app/lib/employerTypes.ts`)

Complete TypeScript types for the ATS-style dashboard:

- **`EmployerCandidate`** - Full candidate record with 20+ fields
- **`Role`** - Job posting with health metrics and counts
- **`SavedView`** - Predefined filter views
- **`EvidenceItem`** - Individual skill/trait evidence
- **`PipelineStage`** - 10 stages from "new" to "hired"/"rejected"
- **`EvidenceConfidence`** - Strong, Moderate, Needs validation
- Helper functions for colors, badges, and formatting

### 2. Mock Data Generator (`src/app/lib/mockEmployerData.ts`)

Generates realistic, varied candidate data:

**60 Mock Candidates** using Aisha Sharma persona with:
- Fit scores: 70-98%
- Evidence confidence: Strong, Moderate, Needs validation
- All 10 pipeline stages represented
- 12 different locations (Toronto, SF, NYC, London, Berlin, Remote, etc.)
- Various availability windows
- Realistic "why match" explanations
- 4-7 evidence items per candidate
- SLA tracking (on time, approaching, overdue)

**5 Active Roles:**
1. Senior Backend Engineer (187 new, 42 high-fit, 8 pending intros)
2. Frontend Engineer (311 new, 65 high-fit, 14 pending intros)
3. Engineering Manager (92 new, 11 high-fit, 3 pending intros) - needs attention
4. Full Stack Developer (224 new, 58 high-fit, 11 pending intros)
5. DevOps Engineer (143 new, 34 high-fit, 6 pending intros)

**Evidence Categories:**
- Technical: Distributed Systems, System Design, API Architecture, Frontend Systems, Testing, Database Design, Cloud Infrastructure, Security
- Soft Skills: Communication, Ownership, Collaboration, Problem Solving, Learning Velocity

**5 Saved Views:**
- Needs review (high-fit awaiting initial review)
- High-fit candidates (85%+ fit)
- Waiting for hiring manager
- Intro replies (candidates who accepted)
- Stale candidates (overdue in stage)

**5 Key Metrics:**
- New candidates
- Awaiting review
- High-fit
- Intro replies
- Stale reviews

### 3. Demo Viewer (`src/app/components/EmployerDataDemo.tsx`)

Interactive data preview with 4 views:

**Candidates Table:**
- Shows 20 of 60 candidates
- Click row to expand and see full evidence
- All columns: candidate, role, fit, evidence, stage, location, owner, next action
- Color-coded badges for fit score, evidence confidence, pipeline stage

**Roles View:**
- All 5 roles with health status
- Counts for new candidates, high-fit, pending intros, total
- Health warnings (e.g., "High-fit rate below target")

**Metrics View:**
- 5 metric cards with trends
- Saved views with candidate counts

**Pipeline Stages View:**
- All 10 stages with counts
- SLA alerts showing overdue candidates per stage

## Data Characteristics

### Candidate Distribution by Stage
The 60 candidates are randomly distributed across stages:
- **New**: ~12-15 candidates (awaiting first review)
- **Reviewed**: ~8-10 candidates (initial review complete)
- **Shortlisted**: ~8-10 candidates (strong matches)
- **Hiring Manager Review**: ~5-7 candidates
- **Intro Requested**: ~5-7 candidates (waiting for response)
- **Candidate Accepted**: ~4-6 candidates (ready to interview)
- **Interviewing**: ~4-6 candidates (in process)
- **Offer**: ~2-4 candidates (offer stage)

### Fit Score Distribution
- **90-98%**: ~15 candidates (top tier, "Strong" evidence)
- **80-89%**: ~25 candidates (high fit, mixed evidence)
- **70-79%**: ~20 candidates (moderate fit, "Moderate" evidence)

### Evidence Realism
Each candidate has:
- 2-4 technical evidence items (e.g., "Demonstrated hands-on experience designing event-driven architectures")
- 2-3 soft skill evidence items (e.g., "Takes responsibility for end-to-end delivery including monitoring")
- 1 uncertainty/validation item (e.g., "Needs validation: scale of system-design experience")
- Evidence summaries are detailed and realistic, not generic

### SLA Tracking
Candidates have realistic age-in-stage:
- 0-20 days in current stage
- SLA status based on stage thresholds:
  - New: 3 days
  - Reviewed: 5 days
  - Intro requested: 7 days
  - Interviewing: 14 days
- ~10-15% of candidates overdue (realistic for busy recruiting teams)

### Owner Assignment
- New candidates: unassigned
- Later stages: randomly assigned to Sarah Chen, Marcus Liu, Priya Patel, Jordan Kim, or Alex Rivera

## Using This Data

### For Development
```typescript
import { getMockCandidates, getMockRoles } from '../lib/mockEmployerData';

const candidates = getMockCandidates(); // Returns 60 candidates
const roles = getMockRoles(); // Returns 5 roles
```

### For Filtering
```typescript
// High-fit candidates
const highFit = candidates.filter(c => c.fitScore >= 85);

// By stage
const newCandidates = candidates.filter(c => c.stage === "new");

// Overdue
const overdue = candidates.filter(c => c.slaStatus === "overdue");

// By role
const backendCandidates = candidates.filter(c => 
  c.targetRole === "Senior Backend Engineer"
);
```

### For Testing Views
All saved view filters are available:
```typescript
import { SAVED_VIEWS } from '../lib/mockEmployerData';

// Apply a saved view
const needsReview = candidates.filter(SAVED_VIEWS[0].filterFn);
```

## Data Quality

✅ **Realistic**: Evidence summaries based on real engineering interview patterns
✅ **Varied**: 60 unique combinations of role, stage, fit, evidence, location
✅ **Consistent**: Aisha Sharma persona throughout (no mixed candidates)
✅ **Complete**: All required fields populated
✅ **Testable**: Edge cases represented (overdue, low-fit, unassigned, etc.)

## Next Steps

Use this data to build the 10 phases of the employer dashboard:

1. **Phase 1**: Use `getMockRoles()` to populate left rail
2. **Phase 2**: Use `getMockCandidates()` for dense table
3. **Phase 3**: Use candidate `evidenceItems` for evidence panel
4. **Phase 4**: Test bulk actions with 10+ selected candidates
5. **Phase 5**: Use pipeline stage counts for pipeline view
6. **Phase 6**: Compare 2-3 candidates with full evidence
7. **Phases 7-10**: Mobile views, polish, testing

The data supports all planned features and edge cases.
