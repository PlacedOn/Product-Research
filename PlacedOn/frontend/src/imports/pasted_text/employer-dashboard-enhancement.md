Below is a paste-ready package for Figma AI / Figma Make to add the missing employer dashboard behavior.

## Master Prompt

```text
Upgrade the PlacedOn employer dashboard into a high-volume HR operations workspace.

Goal:
Make the dashboard useful for recruiters handling hundreds or thousands of candidates across many roles.

Fix these missing/unmapped actions:
- Role “More options” menu does nothing.
- Candidate row click does not open evidence/profile details.
- Bulk actions only clear/log selection instead of mutating candidate state.
- Health nudge buttons do not navigate or filter.
- Search does not include visible anonymous candidate IDs.
- Job creation allows blank publish.
- Saved/published jobs do not flow back into dashboard roles.
- Pipeline view has unused table/kanban code but no visible toggle.
- Role close/archive lacks confirmation.
- Dashboard has invalid nested button markup.

Design constraints:
- No cards inside cards.
- Use dense rows, panels, drawers, tables, tabs, dividers, and compact badges.
- Keep the UI calm and ATS-like.
- Default desktop experience should support fast review of many candidates.
```

## Feature Prompt: Evidence Drawer

```text
Add a right-side candidate evidence drawer to the employer pipeline.

Trigger:
Clicking any candidate row or chevron opens the drawer.

Drawer content:
- Candidate identity: anonymous ID unless opted in.
- Role, location, availability, owner, stage.
- Fit score and evidence confidence.
- “Why this match” summary.
- Top evidence tags.
- Evidence breakdown grouped by technical, communication, ownership, collaboration, learning.
- Main uncertainty / needs validation.
- Recruiter notes.
- Actions: Save, Assign owner, Move stage, Request intro, Pass, Compare.

Rules:
Do not navigate away from the pipeline. Drawer must be scrollable and closable. No raw transcript text.
```

```tsx
const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

const selectedCandidate = useMemo(
  () => candidates.find((c) => c.id === selectedCandidateId) ?? null,
  [candidates, selectedCandidateId]
);

function openCandidate(candidate: EmployerCandidate) {
  setSelectedCandidateId(candidate.id);
}
```

```tsx
<button
  onClick={() => openCandidate(candidate)}
  className="w-full text-left px-5 py-4 hover:bg-[#F3F2F0]/60"
>
  <CandidateRow candidate={candidate} />
</button>

{selectedCandidate && (
  <CandidateEvidenceDrawer
    candidate={selectedCandidate}
    onClose={() => setSelectedCandidateId(null)}
    onUpdate={updateCandidate}
  />
)}
```

## Feature Prompt: Real Bulk Actions

```text
Make bulk actions mutate candidate state.

When candidates are selected, show a sticky bulk action bar:
- Assign reviewer
- Move stage
- Request intro
- Pass / reject
- Add tag
- Clear selection

Each action should visibly update selected rows and stage counts.
Pass/reject must ask for a rejection reason before moving to Rejected.
Assign reviewer should open a small popover or modal with reviewer options.
Move stage should open a stage selector.
Request intro should move candidates to Intro Requested and set intro status to requested.
```

```ts
function bulkMoveStage(stage: PipelineStage) {
  setCandidates((prev) =>
    prev.map((c) =>
      selectedIds.includes(c.id)
        ? { ...c, stage, lastActivity: "Today", nextAction: getNextAction(stage) }
        : c
    )
  );
  setSelectedIds([]);
}

function bulkAssign(owner: string) {
  setCandidates((prev) =>
    prev.map((c) =>
      selectedIds.includes(c.id)
        ? { ...c, owner, lastActivity: "Today" }
        : c
    )
  );
  setSelectedIds([]);
}

function bulkRequestIntro() {
  setCandidates((prev) =>
    prev.map((c) =>
      selectedIds.includes(c.id)
        ? {
            ...c,
            stage: "intro_requested",
            introStatus: "requested",
            nextAction: "Awaiting candidate response",
            lastActivity: "Today",
          }
        : c
    )
  );
  setSelectedIds([]);
}
```

## Feature Prompt: Better Search

```text
Upgrade candidate search for HR usage.

Search must match:
- Anonymous ID
- Candidate name
- Target role
- Location
- Owner
- Stage
- Evidence tags
- Evidence skill names
- Why-match summary
```

```ts
function matchesCandidateSearch(candidate: EmployerCandidate, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  return [
    candidate.id,
    candidate.anonymousId,
    candidate.name,
    candidate.targetRole,
    candidate.location,
    candidate.owner ?? "",
    candidate.stage,
    candidate.whyMatch,
    ...candidate.topTwoTags,
    ...candidate.tags,
    ...candidate.evidenceItems.map((e) => e.skillOrTrait),
  ].some((value) => value.toLowerCase().includes(q));
}
```

## Feature Prompt: Role More Options

```text
Wire the role card More options menu.

Important:
Fix invalid nested buttons. The role card should be a div/article with an explicit “Open pipeline” button, not a button containing another button.

More options menu:
- Open pipeline
- Edit job
- Duplicate role
- Tune matching
- Pause role
- Close role
- Archive role
```

```tsx
<article className="rounded-2xl border bg-white p-5">
  <button onClick={onOpenPipeline} className="text-left w-full">
    <RoleSummary role={role} />
  </button>

  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button aria-label="More options" className="p-1.5 rounded-md">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem onClick={onOpenPipeline}>Open pipeline</DropdownMenuItem>
      <DropdownMenuItem onClick={onEditJob}>Edit job</DropdownMenuItem>
      <DropdownMenuItem onClick={onDuplicateRole}>Duplicate role</DropdownMenuItem>
      <DropdownMenuItem onClick={onTuneMatching}>Tune matching</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={onPauseRole}>Pause role</DropdownMenuItem>
      <DropdownMenuItem onClick={onCloseRole}>Close role</DropdownMenuItem>
      <DropdownMenuItem onClick={onArchiveRole}>Archive role</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</article>
```

## Feature Prompt: Job Validation

```text
Prevent blank job publishing.

Allow incomplete jobs to be saved as draft.
Block publishing unless required fields are complete.

Required to publish:
- Job title
- Department
- Team
- Recruiter owner
- Hiring manager
- Country/city or remote location
- Public job description
- Responsibilities
- Required qualifications
- At least 2 required skills
- At least 1 must-have trait
- Salary range or explicit “not public”
- Pipeline stages present
```

```ts
function validateJobForPublish(draft: DraftState): string[] {
  const errors: string[] = [];

  if (!draft.title.trim()) errors.push("Job title is required.");
  if (!draft.team.trim()) errors.push("Team is required.");
  if (!draft.recruiterOwner.trim()) errors.push("Recruiter owner is required.");
  if (!draft.hiringManager.trim()) errors.push("Hiring manager is required.");
  if (!draft.city.trim() && draft.workMode !== "remote") errors.push("City is required.");
  if (!draft.publicJobDescription.trim()) errors.push("Job description is required.");
  if (!draft.responsibilities.trim()) errors.push("Responsibilities are required.");
  if (!draft.requiredQualifications.trim()) errors.push("Required qualifications are required.");
  if (draft.matching.requiredSkills.length < 2) errors.push("Add at least 2 required skills.");
  if (draft.matching.mustHaveTraits.length < 1) errors.push("Add at least 1 must-have trait.");

  return errors;
}
```

```tsx
function handlePublish() {
  const errors = validateJobForPublish(draft);
  if (errors.length > 0) {
    setValidationErrors(errors);
    return;
  }
  onSubmit(buildJob("active"));
}
```

## Feature Prompt: Shared Employer State

```text
Create shared employer state so actions persist across employer routes.

The dashboard, job listings, and pipeline should read/write the same local employer store.

State must include:
- jobListings
- roles
- candidates
- selectedRole
- role statuses
- candidate stages
- intro statuses
- owners
- notes
```

```tsx
type EmployerStore = {
  jobs: JobListing[];
  candidates: EmployerCandidate[];
  updateJob: (job: JobListing) => void;
  updateCandidate: (candidate: EmployerCandidate) => void;
  bulkUpdateCandidates: (ids: string[], patch: Partial<EmployerCandidate>) => void;
};

const EmployerStoreContext = createContext<EmployerStore | null>(null);

export function EmployerStoreProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState(() => getMockJobListings());
  const [candidates, setCandidates] = useState(() => getMockCandidates());

  const updateJob = (job: JobListing) => {
    setJobs((prev) => [job, ...prev.filter((j) => j.id !== job.id)]);
  };

  const updateCandidate = (candidate: EmployerCandidate) => {
    setCandidates((prev) => prev.map((c) => (c.id === candidate.id ? candidate : c)));
  };

  const bulkUpdateCandidates = (ids: string[], patch: Partial<EmployerCandidate>) => {
    setCandidates((prev) =>
      prev.map((c) => (ids.includes(c.id) ? { ...c, ...patch } : c))
    );
  };

  return (
    <EmployerStoreContext.Provider value={{ jobs, candidates, updateJob, updateCandidate, bulkUpdateCandidates }}>
      {children}
    </EmployerStoreContext.Provider>
  );
}
```

## Feature Prompt: Table / Stage Toggle

```text
Expose a visible pipeline view toggle.

Views:
- Stage view: grouped by pipeline stage.
- Table view: dense ATS table for high-volume HR.
- Kanban view: optional, only for shortlisted and later-stage candidates.

Default:
Use table view for large-company HR.
```

```tsx
const [viewMode, setViewMode] = useState<"stage" | "table" | "kanban">("table");

<div className="flex rounded-lg border bg-white p-1">
  {["table", "stage", "kanban"].map((mode) => (
    <button
      key={mode}
      onClick={() => setViewMode(mode as typeof viewMode)}
      className={viewMode === mode ? "bg-[#1F2430] text-white" : "text-[#1F2430]"}
    >
      {mode}
    </button>
  ))}
</div>

{viewMode === "table" && <TableView candidates={filteredCandidates} />}
{viewMode === "stage" && <StageAccordion candidates={filteredCandidates} />}
{viewMode === "kanban" && <KanbanView candidates={filteredCandidates} />}
```

## Feature Prompt: HR Productivity Features

```text
Add HR productivity features that reduce repetitive work.

Features:
1. Saved views:
- Needs review
- High-fit
- Overdue
- Unassigned
- Intro replies
- Hiring manager review

2. SLA tracking:
Show overdue candidates by stage.
Highlight stale candidates.

3. Reviewer ownership:
Every candidate should have owner, reviewer, and last activity.

4. Rejection workflow:
Passing a candidate should require reason:
- Misaligned role fit
- Insufficient evidence
- Availability mismatch
- Compensation mismatch
- Candidate declined
- Better candidates available
- Other

5. Intro workflow:
Request intro should open a compose modal:
- Candidate
- Role
- Suggested message
- Availability slots
- Send request

6. Compare mode:
Allow selecting 2-3 candidates and compare:
- Fit
- Evidence confidence
- Skills
- Traits
- Availability
- Risks
- Recommended next step
```

## Feature Prompt: Confirmation Modals

```text
Add confirmation for destructive role actions.

Close role:
Warn that active candidate movement will stop, but history remains.

Archive role:
Warn that the role will leave active dashboards.

Reject/pass candidates:
Require rejection reason and optional internal note.

Do not use browser confirm(). Use app-native modal.
```

```tsx
type ConfirmAction =
  | { type: "close_role"; role: Role }
  | { type: "archive_role"; role: Role }
  | { type: "reject_candidates"; candidateIds: string[] }
  | null;

const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
```

## Final Figma AI Prompt

```text
Implement the missing employer dashboard mappings.

Required fixes:
- Replace nested button role cards with semantic article rows/cards and separate action buttons.
- Add working role More options menu.
- Add candidate evidence drawer on row click.
- Make anonymous IDs searchable.
- Make bulk actions mutate candidate state.
- Add assignment, move stage, request intro, pass/reject flows.
- Add validation to job publishing.
- Create shared employer state between dashboard, jobs, and pipeline.
- Add table/stage/kanban view toggle.
- Add confirmation modals for close/archive/reject.
- Map health nudge buttons to useful actions:
  - Review now filters to strong new candidates.
  - Follow up filters to stale intro requests.
  - Recalibrate opens tune matching drawer.

Keep the visual system simple:
No cards inside cards. Use dense rows, tables, drawers, modals, dividers, tabs, and compact badges. Optimize for HR teams reviewing thousands of candidates.
```