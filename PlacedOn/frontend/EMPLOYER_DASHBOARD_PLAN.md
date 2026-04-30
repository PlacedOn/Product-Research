# Employer Dashboard Redesign - Implementation Plan

## Overview
Redesign the PlacedOn employer dashboard as a dense, high-volume ATS-style hiring operations hub for recruiters and HR teams. This is a complete redesign moving away from card-based layouts to clean app shell with tables, panels, and drawers.

## Design Principles
- **NO card-inside-card layouts** - use app shell, rows, tables, panels, drawers
- **Dense, scannable** - show 8+ candidates in viewport
- **Task-focused** - answer "which candidates need action now?"
- **Operational, not marketing** - calm, simple, professional

## Color Palette
- Text: `#1F2430`
- Primary blue: `#3E63F5`
- Trust green: `#10B981`
- Deep employer green: `#0A6847`
- Background: `#F8F7F5`
- Surface: `#FFFFFF`

## Architecture Overview

### Desktop Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Top App Bar (fixed)                                        │
├──────────────┬─────────────────────────────┬────────────────┤
│              │                             │                │
│  Left Rail   │   Center Candidate Queue    │  Right Panel   │
│              │   (dense table/list)        │  (evidence)    │
│  - Roles     │                             │                │
│  - Views     │   8+ rows visible           │  Selected      │
│  - Pipeline  │                             │  candidate     │
│              │                             │  details       │
└──────────────┴─────────────────────────────┴────────────────┘
```

### Mobile Layout
- Feed-first candidate cards
- Role selector dropdown at top
- Filters in drawer
- Evidence in bottom sheet
- No horizontal overflow

---

## Phase 1: Core Shell & Data Structure
**Goal:** Build the foundational layout and data types

### Tasks:
1. **Create new data types** (`src/app/lib/employerTypes.ts`)
   - `EmployerCandidate` with all fields
   - `Role` with counts and health metrics
   - `SavedView` type
   - `PipelineStage` enum
   - `EvidenceItem` structure

2. **Create app shell component** (`src/app/components/employer/EmployerShell.tsx`)
   - Fixed top app bar (logo, search, notifications, account)
   - Three-column layout wrapper
   - Responsive grid system
   - No decorative elements

3. **Create left rail** (`src/app/components/employer/LeftRail.tsx`)
   - Roles section with compact rows (not cards)
   - Saved views section
   - Pipeline stages section
   - Active state styling
   - Click handlers for filtering

4. **Mock data generator** (`src/app/lib/mockEmployerData.ts`)
   - Generate 50+ mock candidates
   - Multiple roles
   - Various stages
   - Evidence items
   - Use Aisha Sharma persona

**Deliverable:** Working shell with navigation, no candidate data yet

---

## Phase 2: Dense Candidate Queue
**Goal:** Build the core candidate table/list view

### Tasks:
1. **Candidate table component** (`src/app/components/employer/CandidateTable.tsx`)
   - Dense table layout (not cards)
   - Columns: checkbox, candidate, role, fit, evidence, stage, location, availability, owner, last activity, next action
   - Row hover and selected states
   - Show 8+ rows in viewport
   - Sortable columns
   - Clean dividers

2. **Candidate row** (`src/app/components/employer/CandidateRow.tsx`)
   - Checkbox for selection
   - Candidate name/ID
   - Fit score badge (94%)
   - Evidence confidence badge (Strong/Moderate/Needs validation)
   - One-line "why match"
   - Top 2 evidence tags
   - All metadata fields
   - Click to select (highlight row)

3. **Compact metric strip** (`src/app/components/employer/MetricStrip.tsx`)
   - Above table
   - New candidates, Awaiting review, High-fit, Intro replies, Stale reviews
   - Horizontal row, not cards

4. **Filtering logic**
   - Filter by role (from left rail)
   - Filter by stage
   - Filter by saved view
   - Search functionality
   - Show filtered count

**Deliverable:** Working dense table with 50+ candidates, filtering, selection

---

## Phase 3: Evidence Panel
**Goal:** Show detailed candidate evidence in right panel

### Tasks:
1. **Evidence panel component** (`src/app/components/employer/EvidencePanel.tsx`)
   - Appears when candidate selected
   - Does NOT navigate away from queue
   - Fixed width right panel (360px)
   - Sections with dividers, not nested cards

2. **Panel sections:**
   - **Header:** name, role, fit score, evidence confidence, stage
   - **Match summary:** AI explanation
   - **Evidence breakdown:** skill/trait sections with signal strength, confidence, summary
   - **Risk/uncertainty:** areas needing validation
   - **Recruiter workflow:** owner, stage dropdown, notes, tags, assign, request intro
   - **Privacy block:** compact reminder
   - **Actions:** Save, Compare, Pass, Request intro

3. **Empty state** (`src/app/components/employer/EmptyEvidencePanel.tsx`)
   - When no candidate selected
   - Show role health, queue summary, privacy reminder, next action

**Deliverable:** Clicking row shows evidence panel, all sections working

---

## Phase 4: Bulk Actions & Selection
**Goal:** Enable high-volume operations

### Tasks:
1. **Selection state management**
   - Track selected candidate IDs
   - Select all checkbox in header
   - Individual row checkboxes
   - Shift+click range selection

2. **Bulk action bar** (`src/app/components/employer/BulkActionBar.tsx`)
   - Sticky bar above table when selection active
   - Show "X selected"
   - Actions: Assign owner, Move stage, Shortlist, Request intro, Pass, Add tag, Export
   - Compact, practical design

3. **Bulk action handlers**
   - Modals/dropdowns for each action
   - Apply to all selected
   - Success/error feedback
   - Clear selection after action

**Deliverable:** Full bulk operations working

---

## Phase 5: Pipeline View
**Goal:** Stage-based candidate management

### Tasks:
1. **Pipeline view component** (`src/app/components/employer/PipelineView.tsx`)
   - Dense table grouped by stage
   - Collapsible stage sections
   - Stage headers with counts
   - SLA/age in stage column

2. **Pipeline health alerts** (`src/app/components/employer/PipelineAlerts.tsx`)
   - Slim banner alerts (not cards)
   - "42 high-fit candidates not reviewed"
   - "8 intro replies need scheduling"
   - "Role may be too strict"

3. **Optional Kanban view**
   - Toggle between table and kanban
   - Only for shortlisted+ stages
   - Drag and drop
   - Compact columns

**Deliverable:** Pipeline view with health alerts, stage filtering

---

## Phase 6: Compare Mode
**Goal:** Side-by-side candidate comparison

### Tasks:
1. **Compare mode** (`src/app/components/employer/CompareMode.tsx`)
   - Triggered from bulk actions when 2-3 selected
   - Side-by-side table layout
   - Rows: fit, evidence, technical depth, communication, ownership, collaboration, learning velocity, availability, location, main strength, main uncertainty, next step

2. **Recommendation strip**
   - Top of comparison
   - Best overall, Strongest technical, Fastest available, Needs review
   - Compact badges

3. **Exit compare mode**
   - Back to table view
   - Clear comparison selection

**Deliverable:** Working comparison for 2-3 candidates

---

## Phase 7: Role Calibration Integration
**Goal:** Connect role calibration to main dashboard

### Tasks:
1. **Update existing RoleCalibration.tsx**
   - Ensure matches new visual style
   - Remove any card-based layouts
   - Use clean form sections

2. **Add role creation flow**
   - "New role" button in left rail
   - Navigate to calibration
   - Return to dashboard with new role

3. **Edit role**
   - Click role in left rail to edit
   - Update criteria
   - Refresh candidate pool

**Deliverable:** Role management integrated

---

## Phase 8: Mobile Optimization
**Goal:** Feed-first mobile experience

### Tasks:
1. **Mobile layout** (`src/app/components/employer/MobileEmployerView.tsx`)
   - Feed of candidate cards (simple cards OK here)
   - Role selector dropdown
   - Tab navigation
   - Essential info per card

2. **Mobile filters drawer**
   - Full-screen drawer
   - All filter options
   - Apply/clear actions

3. **Mobile evidence sheet**
   - Bottom sheet
   - Full evidence details
   - Swipe to close

4. **Responsive breakpoints**
   - 360px, 390px, 430px widths
   - No horizontal overflow
   - No text clipping
   - 44px touch targets

**Deliverable:** Full mobile experience

---

## Phase 9: Polish & Interactions
**Goal:** Smooth UX and visual refinement

### Tasks:
1. **Animations**
   - Row selection
   - Panel slide in/out
   - Bulk bar appear/disappear
   - Stage transitions

2. **Keyboard navigation**
   - Arrow keys to navigate rows
   - Enter to select
   - Escape to deselect
   - Shortcuts for actions

3. **Loading states**
   - Skeleton rows
   - Progressive loading
   - Optimistic updates

4. **Error handling**
   - Failed actions
   - Network errors
   - Retry logic

5. **Empty states**
   - No candidates
   - No results from filter
   - No roles yet

**Deliverable:** Polished, production-ready experience

---

## Phase 10: Integration & Testing
**Goal:** Connect to backend, QA, launch

### Tasks:
1. **Backend integration**
   - Replace mock data with API calls
   - Real-time updates
   - Pagination
   - Search endpoint

2. **State management**
   - Optimize re-renders
   - Cache candidate data
   - Sync selection state

3. **Testing**
   - Test with 1000+ candidates
   - Test all filters
   - Test bulk actions
   - Test on mobile devices

4. **Performance**
   - Virtual scrolling for large lists
   - Lazy load evidence panel
   - Debounce search

5. **Accessibility**
   - Screen reader support
   - Keyboard navigation
   - ARIA labels
   - Focus management

**Deliverable:** Production-ready, tested, performant dashboard

---

## File Structure
```
src/app/
├── lib/
│   ├── employerTypes.ts          (new data types)
│   └── mockEmployerData.ts       (mock generator)
├── components/
│   └── employer/                 (new directory)
│       ├── EmployerShell.tsx
│       ├── LeftRail.tsx
│       ├── CandidateTable.tsx
│       ├── CandidateRow.tsx
│       ├── MetricStrip.tsx
│       ├── EvidencePanel.tsx
│       ├── EmptyEvidencePanel.tsx
│       ├── BulkActionBar.tsx
│       ├── PipelineView.tsx
│       ├── PipelineAlerts.tsx
│       ├── CompareMode.tsx
│       └── MobileEmployerView.tsx
└── routes.tsx                    (update route)
```

---

## Critical Decisions

### 1. Replace or Coexist?
**Decision:** Create new route `/employer/v2` during development
- Safe parallel development
- Can compare old vs new
- Switch `/employer` to new version when Phase 9 complete

### 2. Desktop vs Mobile Components
**Decision:** Separate desktop and mobile components
- Cleaner code
- Easier to optimize each
- Route to correct version based on screen size

### 3. State Management
**Decision:** React Context for employer state
- Context for: selection, filters, active candidate, view mode
- Good for app-wide state without prop drilling

---

## Success Metrics
- Show 8+ candidates in viewport (desktop)
- Row height ≤ 60px
- Click to evidence panel < 100ms
- Bulk action on 50 candidates < 500ms
- Mobile: no horizontal scroll, 44px touch targets
- Zero nested card layouts
- All routes working without errors

---

## Timeline Estimate
- Phase 1: 2 hours (shell + types)
- Phase 2: 3 hours (table + rows)
- Phase 3: 2 hours (evidence panel)
- Phase 4: 2 hours (bulk actions)
- Phase 5: 2 hours (pipeline)
- Phase 6: 1.5 hours (compare)
- Phase 7: 1.5 hours (role calibration updates)
- Phase 8: 2 hours (mobile)
- Phase 9: 2 hours (polish)
- Phase 10: 2 hours (integration)

**Total: ~20 hours of implementation**

---

## Ready to Begin

This plan creates a complete, dense, ATS-style employer dashboard that handles high-volume recruiting operations. Each phase builds on the previous one and delivers a working increment.

**Next step:** Begin Phase 1 - Core Shell & Data Structure
