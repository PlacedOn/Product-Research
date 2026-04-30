import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { X, ChevronLeft, ChevronRight, Sparkles, Save, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import {
  DEFAULT_PIPELINE_STAGES,
  DEFAULT_REJECTION_REASONS,
  DEFAULT_WEIGHTING,
  type EmploymentType,
  type HiringPriority,
  type JobListing,
  type MatchingCriteria,
  type PipelineStageConfig,
  type RoleWeighting,
  type SeniorityLevel,
  type WorkMode,
} from "../lib/jobListingTypes";

const STEPS = [
  "Basics",
  "Location",
  "Compensation",
  "Description",
  "Matching criteria",
  "Weighting",
  "AI calibration",
  "Pipeline",
  "Publish",
] as const;

export const CRITERIA_ONLY_STEPS = [
  "Matching criteria",
  "Weighting",
  "AI calibration",
] as const;

type StepId = typeof STEPS[number];

interface DraftState {
  title: string;
  department: string;
  team: string;
  level: SeniorityLevel;
  employmentType: EmploymentType;
  openings: number;
  hiringPriority: HiringPriority;
  recruiterOwner: string;
  hiringManager: string;
  collaborators: string;

  country: string;
  city: string;
  workMode: WorkMode;
  timezone: string;
  relocationSupport: boolean;
  visaSponsorship: boolean;
  travelRequired: string;
  officeDays: number;

  salaryMin: number;
  salaryMax: number;
  currency: string;
  salaryPublic: boolean;
  equityMin: number;
  equityMax: number;
  bonus: string;
  benefits: string;
  noticePeriod: string;

  publicJobDescription: string;
  responsibilities: string;
  successIn90Days: string;
  requiredQualifications: string;
  preferredQualifications: string;
  interviewProcess: string;
  companyPitch: string;

  matching: MatchingCriteria;
  weighting: RoleWeighting;

  pipelineStages: PipelineStageConfig[];
  rejectionReasons: string[];
  requireRejectionNote: boolean;
}

function freshDraft(existing: JobListing | null): DraftState {
  if (existing) {
    return {
      title: existing.title,
      department: existing.department,
      team: existing.team,
      level: existing.level,
      employmentType: existing.employmentType,
      openings: existing.openings,
      hiringPriority: existing.hiringPriority,
      recruiterOwner: existing.recruiterOwner,
      hiringManager: existing.hiringManager,
      collaborators: existing.collaborators.join(", "),
      country: existing.country,
      city: existing.city,
      workMode: existing.workMode,
      timezone: existing.timezone ?? "",
      relocationSupport: existing.relocationSupport,
      visaSponsorship: existing.visaSponsorship,
      travelRequired: existing.travelRequired ?? "",
      officeDays: existing.officeDays ?? 0,
      salaryMin: existing.compensation.min,
      salaryMax: existing.compensation.max,
      currency: existing.compensation.currency,
      salaryPublic: existing.compensation.isPublic,
      equityMin: existing.compensation.equityMin ?? 0,
      equityMax: existing.compensation.equityMax ?? 0,
      bonus: existing.compensation.bonus ?? "",
      benefits: existing.compensation.benefits ?? "",
      noticePeriod: existing.compensation.noticePeriod ?? "",
      publicJobDescription: existing.publicJobDescription,
      responsibilities: existing.responsibilities.join("\n"),
      successIn90Days: existing.successIn90Days,
      requiredQualifications: existing.requiredQualifications.join("\n"),
      preferredQualifications: existing.preferredQualifications.join("\n"),
      interviewProcess: existing.interviewProcess,
      companyPitch: existing.companyPitch,
      matching: existing.matchingCriteria,
      weighting: existing.weighting,
      pipelineStages: existing.pipelineStages,
      rejectionReasons: existing.rejectionReasons,
      requireRejectionNote: existing.requireRejectionNote,
    };
  }
  return {
    title: "", department: "Engineering", team: "", level: "mid",
    employmentType: "full_time", openings: 1, hiringPriority: "normal",
    recruiterOwner: "", hiringManager: "", collaborators: "",
    country: "Canada", city: "", workMode: "hybrid", timezone: "",
    relocationSupport: false, visaSponsorship: false, travelRequired: "", officeDays: 0,
    salaryMin: 0, salaryMax: 0, currency: "CAD", salaryPublic: true,
    equityMin: 0, equityMax: 0, bonus: "", benefits: "", noticePeriod: "",
    publicJobDescription: "", responsibilities: "", successIn90Days: "",
    requiredQualifications: "", preferredQualifications: "",
    interviewProcess: "", companyPitch: "",
    matching: {
      requiredSkills: [], preferredSkills: [], mustHaveTraits: [],
      niceToHaveTraits: [], disqualifiers: [], minimumExperienceYears: 0,
      domainExperience: [],
    },
    weighting: { ...DEFAULT_WEIGHTING },
    pipelineStages: DEFAULT_PIPELINE_STAGES,
    rejectionReasons: DEFAULT_REJECTION_REASONS,
    requireRejectionNote: true,
  };
}

export function CreateJobForm({
  existing,
  onCancel,
  onSubmit,
  cancelLabel = "Close",
  className = "",
  steps,
  title,
  submitLabel,
  showSaveDraft = true,
}: {
  existing: JobListing | null;
  onCancel: () => void;
  onSubmit: (job: JobListing) => void;
  cancelLabel?: string;
  className?: string;
  steps?: readonly StepId[];
  title?: string;
  submitLabel?: string;
  showSaveDraft?: boolean;
}) {
  const activeSteps = (steps ?? STEPS) as readonly StepId[];
  const [draft, setDraft] = useState<DraftState>(() => freshDraft(existing));
  const [stepIdx, setStepIdx] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const step: StepId = activeSteps[stepIdx];
  const isCriteriaOnly = !!steps;

  const set = <K extends keyof DraftState>(key: K, value: DraftState[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const calibration = useMemo(() => calibrateDraft(draft), [draft]);

  const buildJob = (status: "draft" | "active"): JobListing => {
    const base: JobListing = existing
      ? { ...existing }
      : ({
          id: `job-${Date.now()}`,
          applicantsCount: 0, newCandidatesCount: 0, highFitCount: 0,
          shortlistedCount: 0, introRequestedCount: 0, acceptedCount: 0,
          interviewingCount: 0, offerCount: 0,
          postedDate: status === "active" ? new Date() : undefined,
          lastActivity: new Date(),
          roleHealth: "needs_review",
          nextAction: "Review applicants",
        } as unknown as JobListing);

    return {
      ...base,
      title: draft.title || "Untitled role",
      department: draft.department,
      team: draft.team,
      level: draft.level,
      employmentType: draft.employmentType,
      openings: draft.openings,
      hiringPriority: draft.hiringPriority,
      recruiterOwner: draft.recruiterOwner,
      hiringManager: draft.hiringManager,
      collaborators: draft.collaborators
        .split(",").map((s) => s.trim()).filter(Boolean),
      country: draft.country, city: draft.city, workMode: draft.workMode,
      timezone: draft.timezone || undefined,
      relocationSupport: draft.relocationSupport,
      visaSponsorship: draft.visaSponsorship,
      travelRequired: draft.travelRequired || undefined,
      officeDays: draft.workMode === "hybrid" ? draft.officeDays : undefined,
      compensation: {
        min: draft.salaryMin, max: draft.salaryMax, currency: draft.currency,
        isPublic: draft.salaryPublic,
        equityMin: draft.equityMin || undefined,
        equityMax: draft.equityMax || undefined,
        bonus: draft.bonus || undefined,
        benefits: draft.benefits || undefined,
        noticePeriod: draft.noticePeriod || undefined,
      },
      publicJobDescription: draft.publicJobDescription,
      responsibilities: splitLines(draft.responsibilities),
      successIn90Days: draft.successIn90Days,
      requiredQualifications: splitLines(draft.requiredQualifications),
      preferredQualifications: splitLines(draft.preferredQualifications),
      interviewProcess: draft.interviewProcess,
      companyPitch: draft.companyPitch,
      matchingCriteria: draft.matching,
      weighting: draft.weighting,
      status,
      lastActivity: new Date(),
      postedDate: status === "active" ? (base.postedDate ?? new Date()) : base.postedDate,
      roleHealth: calibration.health,
      healthMessage: calibration.warnings[0],
      nextAction: status === "draft" ? "Finalize JD and publish" : "Review new applicants",
      pipelineStages: draft.pipelineStages,
      rejectionReasons: draft.rejectionReasons,
      requireRejectionNote: draft.requireRejectionNote,
    };
  };

  return (
    <div className={`bg-white flex flex-col font-[Inter,sans-serif] ${className}`}>
        {/* Header */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: "rgba(31,36,48,0.1)" }}
        >
          <div>
            <h2 style={{ color: "#1F2430" }}>{title ?? (existing ? "Edit job" : "Create job")}</h2>
            <p className="text-xs" style={{ color: "#1F2430", opacity: 0.6 }}>
              Step {stepIdx + 1} of {activeSteps.length} · {step}
            </p>
          </div>
          <button onClick={onCancel} className="p-1 rounded hover:bg-black/5" aria-label={cancelLabel}>
            <X className="w-5 h-5" style={{ color: "#1F2430" }} />
          </button>
        </div>

        {/* Step nav */}
        <div
          className="flex items-center gap-1 px-3 py-2 border-b overflow-x-auto"
          style={{ borderColor: "rgba(31,36,48,0.08)" }}
        >
          {activeSteps.map((s, i) => {
            const active = i === stepIdx;
            const done = i < stepIdx;
            return (
              <button
                key={s}
                onClick={() => setStepIdx(i)}
                className="text-xs px-2.5 py-1.5 rounded-md whitespace-nowrap transition-colors"
                style={{
                  backgroundColor: active ? "#1F2430" : "transparent",
                  color: active ? "#FFFFFF" : done ? "#3E63F5" : "rgba(31,36,48,0.7)",
                }}
              >
                {i + 1}. {s}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === "Basics" && <BasicsStep draft={draft} set={set} />}
          {step === "Location" && <LocationStep draft={draft} set={set} />}
          {step === "Compensation" && <CompensationStep draft={draft} set={set} />}
          {step === "Description" && <DescriptionStep draft={draft} set={set} />}
          {step === "Matching criteria" && <MatchingStep draft={draft} set={set} />}
          {step === "Weighting" && <WeightingStep draft={draft} set={set} />}
          {step === "AI calibration" && <CalibrationStep calibration={calibration} draft={draft} />}
          {step === "Pipeline" && <PipelineStep draft={draft} set={set} />}
          {step === "Publish" && <PublishStep draft={draft} calibration={calibration} />}
        </div>

        {validationErrors.length > 0 && (
          <div
            className="px-6 py-3 border-t bg-red-50"
            style={{ borderColor: "rgba(239,68,68,0.25)" }}
          >
            <p className="text-xs mb-1.5" style={{ color: "#B91C1C" }}>
              Fix these before publishing:
            </p>
            <ul className="text-xs space-y-0.5" style={{ color: "#B91C1C" }}>
              {validationErrors.map((e) => (
                <li key={e}>· {e}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div
          className="px-6 py-4 border-t flex items-center justify-between gap-2"
          style={{ borderColor: "rgba(31,36,48,0.1)" }}
        >
          <Button
            variant="ghost"
            disabled={stepIdx === 0}
            onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="flex gap-2">
            {showSaveDraft && (
              <Button
                variant="outline"
                onClick={() => {
                  setValidationErrors([]);
                  onSubmit(buildJob("draft"));
                }}
              >
                <Save className="w-4 h-4 mr-1.5" /> Save draft
              </Button>
            )}
            {stepIdx < activeSteps.length - 1 ? (
              <Button
                onClick={() => setStepIdx((i) => Math.min(activeSteps.length - 1, i + 1))}
                className="text-white"
                style={{ backgroundColor: "#3E63F5" }}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  if (isCriteriaOnly) {
                    onSubmit(buildJob(existing?.status ?? "active"));
                    return;
                  }
                  const errs = validateJobForPublish(draft);
                  if (errs.length > 0) {
                    setValidationErrors(errs);
                    return;
                  }
                  setValidationErrors([]);
                  onSubmit(buildJob(existing?.status ?? "active"));
                }}
                className="text-white"
                style={{ backgroundColor: "#3E63F5" }}
              >
                <Send className="w-4 h-4 mr-1.5" />
                {submitLabel ?? (existing ? "Save & publish" : "Publish")}
              </Button>
            )}
          </div>
        </div>
    </div>
  );
}

export function CreateJobDrawer(props: {
  existing: JobListing | null;
  onCancel: () => void;
  onSubmit: (job: JobListing) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex font-[Inter,sans-serif]">
      <div className="flex-1 bg-black/40" onClick={props.onCancel} />
      <motion.aside
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-3xl flex"
        style={{ boxShadow: "-12px 0 32px rgba(0,0,0,0.08)" }}
      >
        <CreateJobForm {...props} className="flex-1 h-full" />
      </motion.aside>
    </div>
  );
}

export function EditCriteriaDrawer({
  existing,
  onCancel,
  onSubmit,
}: {
  existing: JobListing;
  onCancel: () => void;
  onSubmit: (job: JobListing) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex font-[Inter,sans-serif]">
      <div className="flex-1 bg-black/40" onClick={onCancel} />
      <motion.aside
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-3xl flex"
        style={{ boxShadow: "-12px 0 32px rgba(0,0,0,0.08)" }}
      >
        <CreateJobForm
          existing={existing}
          onCancel={onCancel}
          onSubmit={onSubmit}
          steps={CRITERIA_ONLY_STEPS}
          title="Tune matching criteria"
          submitLabel="Save changes"
          showSaveDraft={false}
          className="flex-1 h-full"
        />
      </motion.aside>
    </div>
  );
}

/* ============== Steps ============== */

function BasicsStep({
  draft, set,
}: { draft: DraftState; set: <K extends keyof DraftState>(k: K, v: DraftState[K]) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Job title" full>
        <TextInput value={draft.title} onChange={(v) => set("title", v)} placeholder="e.g. Senior Backend Engineer" />
      </Field>
      <Field label="Department">
        <Select value={draft.department} onChange={(v) => set("department", v)}
          options={["Engineering", "Design", "Product", "Data", "Operations", "Marketing", "Sales"]} />
      </Field>
      <Field label="Team">
        <TextInput value={draft.team} onChange={(v) => set("team", v)} placeholder="e.g. Platform" />
      </Field>
      <Field label="Employment type">
        <Select value={draft.employmentType} onChange={(v) => set("employmentType", v as EmploymentType)}
          options={[
            { value: "full_time", label: "Full-time" },
            { value: "contract", label: "Contract" },
            { value: "internship", label: "Internship" },
          ]} />
      </Field>
      <Field label="Seniority">
        <Select value={draft.level} onChange={(v) => set("level", v as SeniorityLevel)}
          options={["intern", "fresher", "junior", "mid", "senior", "staff", "manager"]} />
      </Field>
      <Field label="Number of openings">
        <NumberInput value={draft.openings} min={1} onChange={(v) => set("openings", v)} />
      </Field>
      <Field label="Hiring priority">
        <Select value={draft.hiringPriority} onChange={(v) => set("hiringPriority", v as HiringPriority)}
          options={["low", "normal", "urgent"]} />
      </Field>
      <Field label="Recruiter owner">
        <TextInput value={draft.recruiterOwner} onChange={(v) => set("recruiterOwner", v)} placeholder="Name" />
      </Field>
      <Field label="Hiring manager">
        <TextInput value={draft.hiringManager} onChange={(v) => set("hiringManager", v)} placeholder="Name" />
      </Field>
      <Field label="Collaborators / reviewers" full>
        <TextInput value={draft.collaborators} onChange={(v) => set("collaborators", v)}
          placeholder="Comma-separated names" />
      </Field>
    </div>
  );
}

function LocationStep({ draft, set }: { draft: DraftState; set: any }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Country"><TextInput value={draft.country} onChange={(v) => set("country", v)} /></Field>
      <Field label="City"><TextInput value={draft.city} onChange={(v) => set("city", v)} placeholder="e.g. Toronto" /></Field>
      <Field label="Work mode">
        <Select value={draft.workMode} onChange={(v) => set("workMode", v as WorkMode)}
          options={["onsite", "hybrid", "remote"]} />
      </Field>
      <Field label="Time zone overlap"><TextInput value={draft.timezone} onChange={(v) => set("timezone", v)} placeholder="e.g. EST overlap" /></Field>
      {draft.workMode === "hybrid" && (
        <Field label="Office days / week">
          <NumberInput value={draft.officeDays} min={0} max={7} onChange={(v) => set("officeDays", v)} />
        </Field>
      )}
      <Field label="Travel requirement"><TextInput value={draft.travelRequired} onChange={(v) => set("travelRequired", v)} placeholder="e.g. up to 10%" /></Field>
      <ToggleField label="Relocation support" checked={draft.relocationSupport} onChange={(v) => set("relocationSupport", v)} />
      <ToggleField label="Visa sponsorship" checked={draft.visaSponsorship} onChange={(v) => set("visaSponsorship", v)} />
    </div>
  );
}

function CompensationStep({ draft, set }: { draft: DraftState; set: any }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Salary min"><NumberInput value={draft.salaryMin} onChange={(v) => set("salaryMin", v)} /></Field>
      <Field label="Salary max"><NumberInput value={draft.salaryMax} onChange={(v) => set("salaryMax", v)} /></Field>
      <Field label="Currency"><Select value={draft.currency} onChange={(v) => set("currency", v)} options={["CAD", "USD", "EUR", "GBP", "INR"]} /></Field>
      <ToggleField label="Show compensation publicly" checked={draft.salaryPublic} onChange={(v) => set("salaryPublic", v)} />
      <Field label="Equity min (%)"><NumberInput value={draft.equityMin} step={0.01} onChange={(v) => set("equityMin", v)} /></Field>
      <Field label="Equity max (%)"><NumberInput value={draft.equityMax} step={0.01} onChange={(v) => set("equityMax", v)} /></Field>
      <Field label="Bonus / incentives" full><TextInput value={draft.bonus} onChange={(v) => set("bonus", v)} placeholder="e.g. 10% annual" /></Field>
      <Field label="Benefits" full><TextInput value={draft.benefits} onChange={(v) => set("benefits", v)} placeholder="Health, dental, RRSP…" /></Field>
      <Field label="Notice period preference"><TextInput value={draft.noticePeriod} onChange={(v) => set("noticePeriod", v)} placeholder="≤ 4 weeks" /></Field>
    </div>
  );
}

function DescriptionStep({ draft, set }: { draft: DraftState; set: any }) {
  return (
    <div className="space-y-4">
      <Field label="Public job description">
        <TextArea value={draft.publicJobDescription} onChange={(v) => set("publicJobDescription", v)} rows={4} />
      </Field>
      <Field label="Responsibilities (one per line)">
        <TextArea value={draft.responsibilities} onChange={(v) => set("responsibilities", v)} rows={4} />
      </Field>
      <Field label="What success looks like in 90 days">
        <TextArea value={draft.successIn90Days} onChange={(v) => set("successIn90Days", v)} rows={3} />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Required qualifications (one per line)">
          <TextArea value={draft.requiredQualifications} onChange={(v) => set("requiredQualifications", v)} rows={5} />
        </Field>
        <Field label="Preferred qualifications">
          <TextArea value={draft.preferredQualifications} onChange={(v) => set("preferredQualifications", v)} rows={5} />
        </Field>
      </div>
      <Field label="Interview process summary">
        <TextArea value={draft.interviewProcess} onChange={(v) => set("interviewProcess", v)} rows={2} />
      </Field>
      <Field label="Candidate-facing pitch">
        <TextArea value={draft.companyPitch} onChange={(v) => set("companyPitch", v)} rows={3} />
      </Field>
    </div>
  );
}

function MatchingStep({ draft, set }: { draft: DraftState; set: any }) {
  const update = (k: keyof MatchingCriteria, v: any) =>
    set("matching", { ...draft.matching, [k]: v });
  return (
    <div className="space-y-4">
      <ChipField label="Required skills" values={draft.matching.requiredSkills} onChange={(v) => update("requiredSkills", v)} />
      <ChipField label="Preferred skills" values={draft.matching.preferredSkills} onChange={(v) => update("preferredSkills", v)} />
      <ChipField label="Must-have traits" values={draft.matching.mustHaveTraits} onChange={(v) => update("mustHaveTraits", v)} />
      <ChipField label="Nice-to-have traits" values={draft.matching.niceToHaveTraits} onChange={(v) => update("niceToHaveTraits", v)} />
      <ChipField label="Disqualifiers" values={draft.matching.disqualifiers} onChange={(v) => update("disqualifiers", v)} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Minimum experience (years)">
          <NumberInput value={draft.matching.minimumExperienceYears} min={0} max={20}
            onChange={(v) => update("minimumExperienceYears", v)} />
        </Field>
        <Field label="Education requirement (optional)">
          <TextInput value={draft.matching.educationRequirement ?? ""}
            onChange={(v) => update("educationRequirement", v)} />
        </Field>
        <Field label="Availability">
          <TextInput value={draft.matching.availabilityRequirement ?? ""}
            onChange={(v) => update("availabilityRequirement", v)}
            placeholder="e.g. ≤ 6 weeks notice" />
        </Field>
        <ChipField label="Domain experience" values={draft.matching.domainExperience}
          onChange={(v) => update("domainExperience", v)} />
        <ChipField label="Languages" values={draft.matching.languageRequirement ?? []}
          onChange={(v) => update("languageRequirement", v)} />
      </div>
    </div>
  );
}

function WeightingStep({ draft, set }: { draft: DraftState; set: any }) {
  const keys = Object.keys(draft.weighting) as (keyof RoleWeighting)[];
  return (
    <div className="space-y-3">
      <p className="text-sm" style={{ color: "#1F2430", opacity: 0.7 }}>
        Tune how candidates are ranked. Higher weight means stronger influence on fit.
      </p>
      {keys.map((k) => (
        <div key={k}>
          <div className="flex justify-between text-xs mb-1">
            <span className="capitalize" style={{ color: "#1F2430" }}>{prettyKey(k)}</span>
            <span style={{ color: "#1F2430", opacity: 0.6 }}>{draft.weighting[k]}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={draft.weighting[k]}
            onChange={(e) =>
              set("weighting", { ...draft.weighting, [k]: Number(e.target.value) })
            }
            className="w-full accent-[#3E63F5]"
          />
        </div>
      ))}
    </div>
  );
}

function CalibrationStep({
  draft, calibration,
}: { draft: DraftState; calibration: ReturnType<typeof calibrateDraft> }) {
  return (
    <div className="space-y-4">
      <div
        className="rounded-lg p-4 flex items-start gap-3"
        style={{
          backgroundColor:
            calibration.health === "healthy" ? "rgba(16,185,129,0.08)" :
            calibration.health === "too_strict" ? "rgba(239,68,68,0.08)" :
            "rgba(245,158,11,0.1)",
        }}
      >
        <Sparkles className="w-5 h-5 mt-0.5" style={{ color: "#3E63F5" }} />
        <div>
          <p className="text-sm" style={{ color: "#1F2430" }}>
            Calibration: <span className="capitalize">{calibration.health.replace("_", " ")}</span>
          </p>
          <p className="text-xs" style={{ color: "#1F2430", opacity: 0.7 }}>
            Estimated candidate pool: ~{calibration.estimatedPool}
          </p>
        </div>
      </div>

      <Section title="Parsed signals">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <Row label="Title" value={draft.title || "—"} />
          <Row label="Level" value={draft.level} />
          <Row label="Required skills" value={draft.matching.requiredSkills.join(", ") || "—"} />
          <Row label="Preferred skills" value={draft.matching.preferredSkills.join(", ") || "—"} />
          <Row label="Must-have traits" value={draft.matching.mustHaveTraits.join(", ") || "—"} />
          <Row label="Min experience" value={`${draft.matching.minimumExperienceYears} yrs`} />
        </div>
      </Section>

      <Section title="Suggested adjustments">
        {calibration.warnings.length === 0 ? (
          <p className="text-sm" style={{ color: "#1F2430", opacity: 0.7 }}>
            No issues detected. Criteria look balanced.
          </p>
        ) : (
          <ul className="space-y-2">
            {calibration.warnings.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: "#F59E0B" }} />
                <span style={{ color: "#1F2430", opacity: 0.85 }}>{w}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

function PipelineStep({ draft, set }: { draft: DraftState; set: any }) {
  return (
    <div className="space-y-5">
      <Section title="Stages">
        <div className="space-y-2">
          {draft.pipelineStages.map((s, i) => (
            <div
              key={s.id}
              className="grid grid-cols-[1fr_140px_120px] gap-2 items-center px-3 py-2 rounded-lg border"
              style={{ borderColor: "rgba(31,36,48,0.1)" }}
            >
              <span className="text-sm" style={{ color: "#1F2430" }}>
                <span className="text-xs mr-2" style={{ color: "#1F2430", opacity: 0.5 }}>{i + 1}.</span>
                {s.label}
              </span>
              <TextInput
                placeholder="Owner role"
                value={s.ownerRole ?? ""}
                onChange={(v) => {
                  const next = [...draft.pipelineStages];
                  next[i] = { ...s, ownerRole: v };
                  set("pipelineStages", next);
                }}
              />
              <NumberInput
                value={s.slaHours ?? 0}
                onChange={(v) => {
                  const next = [...draft.pipelineStages];
                  next[i] = { ...s, slaHours: v };
                  set("pipelineStages", next);
                }}
                placeholder="SLA hrs"
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Rejection reasons">
        <ChipField
          label=""
          values={draft.rejectionReasons}
          onChange={(v) => set("rejectionReasons", v)}
        />
      </Section>

      <ToggleField
        label="Require review note before rejecting a candidate"
        checked={draft.requireRejectionNote}
        onChange={(v) => set("requireRejectionNote", v)}
      />
    </div>
  );
}

function PublishStep({
  draft, calibration,
}: { draft: DraftState; calibration: ReturnType<typeof calibrateDraft> }) {
  return (
    <div className="space-y-4">
      <Section title="Review">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <Row label="Title" value={draft.title || "—"} />
          <Row label="Department / Team" value={`${draft.department} · ${draft.team || "—"}`} />
          <Row label="Level" value={draft.level} />
          <Row label="Location" value={`${draft.city}, ${draft.country} · ${draft.workMode}`} />
          <Row label="Owner" value={draft.recruiterOwner || "—"} />
          <Row label="Hiring manager" value={draft.hiringManager || "—"} />
          <Row
            label="Compensation"
            value={
              draft.salaryMin || draft.salaryMax
                ? `${draft.currency} ${draft.salaryMin}–${draft.salaryMax}`
                : "—"
            }
          />
          <Row label="Calibration" value={calibration.health.replace("_", " ")} />
        </div>
      </Section>
      <Section title="Required skills">
        <div className="flex flex-wrap gap-1.5">
          {draft.matching.requiredSkills.length === 0 ? (
            <span className="text-xs" style={{ color: "#1F2430", opacity: 0.6 }}>None</span>
          ) : (
            draft.matching.requiredSkills.map((s) => (
              <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
            ))
          )}
        </div>
      </Section>
      <p className="text-xs" style={{ color: "#1F2430", opacity: 0.6 }}>
        Click "Publish" to activate matching, or "Save draft" to keep editing.
      </p>
    </div>
  );
}

/* ============== Field primitives ============== */
function Field({
  label, children, full,
}: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      {label && (
        <span className="text-xs mb-1.5 block" style={{ color: "#1F2430", opacity: 0.7 }}>
          {label}
        </span>
      )}
      {children}
    </label>
  );
}

function TextInput({
  value, onChange, placeholder,
}: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-[#3E63F5]"
      style={{ borderColor: "rgba(31,36,48,0.15)", color: "#1F2430" }}
    />
  );
}

function TextArea({
  value, onChange, rows,
}: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows ?? 3}
      className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-[#3E63F5] resize-y"
      style={{ borderColor: "rgba(31,36,48,0.15)", color: "#1F2430" }}
    />
  );
}

function NumberInput({
  value, onChange, min, max, step, placeholder,
}: {
  value: number; onChange: (v: number) => void;
  min?: number; max?: number; step?: number; placeholder?: string;
}) {
  return (
    <input
      type="number"
      value={value}
      min={min} max={max} step={step}
      placeholder={placeholder}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-[#3E63F5]"
      style={{ borderColor: "rgba(31,36,48,0.15)", color: "#1F2430" }}
    />
  );
}

function Select({
  value, onChange, options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<string | { value: string; label: string }>;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-[#3E63F5] capitalize"
      style={{ borderColor: "rgba(31,36,48,0.15)", color: "#1F2430" }}
    >
      {options.map((o) =>
        typeof o === "string" ? (
          <option key={o} value={o} className="capitalize">{o}</option>
        ) : (
          <option key={o.value} value={o.value}>{o.label}</option>
        )
      )}
    </select>
  );
}

function ToggleField({
  label, checked, onChange,
}: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer self-end">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(Boolean(v))} />
      <span className="text-sm" style={{ color: "#1F2430" }}>{label}</span>
    </label>
  );
}

function ChipField({
  label, values, onChange,
}: { label: string; values: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => {
    const t = input.trim();
    if (!t) return;
    if (values.includes(t)) { setInput(""); return; }
    onChange([...values, t]);
    setInput("");
  };
  return (
    <div>
      {label && (
        <label className="text-xs mb-1.5 block" style={{ color: "#1F2430", opacity: 0.7 }}>
          {label}
        </label>
      )}
      <div
        className="flex flex-wrap items-center gap-1.5 rounded-lg border bg-white px-2 py-1.5 min-h-[40px]"
        style={{ borderColor: "rgba(31,36,48,0.15)" }}
      >
        {values.map((v) => (
          <Badge key={v} variant="secondary" className="text-xs flex items-center gap-1">
            {v}
            <button
              onClick={() => onChange(values.filter((x) => x !== v))}
              className="hover:text-red-600"
              aria-label={`Remove ${v}`}
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); add(); }
            else if (e.key === "Backspace" && !input && values.length) {
              onChange(values.slice(0, -1));
            }
          }}
          placeholder="Type and press Enter"
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm py-0.5"
          style={{ color: "#1F2430" }}
        />
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-xs uppercase tracking-wide mb-2" style={{ color: "#1F2430", opacity: 0.55 }}>
        {title}
      </h3>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span style={{ color: "#1F2430", opacity: 0.6 }}>{label}</span>
      <span className="text-right" style={{ color: "#1F2430" }}>{value}</span>
    </div>
  );
}

/* ============== Helpers ============== */
function validateJobForPublish(d: DraftState): string[] {
  const errors: string[] = [];
  if (!d.title.trim()) errors.push("Job title is required.");
  if (!d.department.trim()) errors.push("Department is required.");
  if (!d.team.trim()) errors.push("Team is required.");
  if (!d.recruiterOwner.trim()) errors.push("Recruiter owner is required.");
  if (!d.hiringManager.trim()) errors.push("Hiring manager is required.");
  if (!d.city.trim() && d.workMode !== "remote") errors.push("City is required (or set work mode to remote).");
  if (!d.publicJobDescription.trim()) errors.push("Public job description is required.");
  if (!d.responsibilities.trim()) errors.push("Responsibilities are required.");
  if (!d.requiredQualifications.trim()) errors.push("Required qualifications are required.");
  if (d.matching.requiredSkills.length < 2) errors.push("Add at least 2 required skills.");
  if (d.matching.mustHaveTraits.length < 1) errors.push("Add at least 1 must-have trait.");
  if (d.salaryPublic && (!d.salaryMin || !d.salaryMax)) {
    errors.push("Set a salary range, or mark compensation as not public.");
  }
  if (!d.pipelineStages || d.pipelineStages.length === 0) {
    errors.push("Pipeline stages are required.");
  }
  return errors;
}

function splitLines(s: string): string[] {
  return s.split("\n").map((l) => l.trim()).filter(Boolean);
}

function prettyKey(k: string) {
  return k.replace(/([A-Z])/g, " $1").toLowerCase();
}

function calibrateDraft(d: DraftState): {
  health: "healthy" | "too_strict" | "too_broad" | "low_signal" | "needs_review";
  estimatedPool: number;
  warnings: string[];
} {
  const warnings: string[] = [];
  const requiredCount = d.matching.requiredSkills.length;
  const minExp = d.matching.minimumExperienceYears;
  const disqualifiers = d.matching.disqualifiers.length;

  if (requiredCount > 6) warnings.push("Many required skills can shrink the pool — consider moving some to preferred.");
  if (minExp >= 8) warnings.push("Minimum experience over 8 years may exclude strong mid-level talent.");
  if (d.weighting.leadership > 70 && (d.level === "junior" || d.level === "fresher" || d.level === "intern")) {
    warnings.push("Leadership weighted high for a junior role — verify this is intentional.");
  }
  if (d.weighting.technicalDepth > 80 && d.level === "junior") {
    warnings.push("System / technical depth weighted high for a junior role.");
  }
  if (disqualifiers === 0 && requiredCount === 0) {
    warnings.push("No required skills set — pool may be too broad to rank meaningfully.");
  }
  if (/(?:school|university|prestige|brand)/i.test(d.matching.educationRequirement ?? "")) {
    warnings.push("Avoid using school or company prestige as a matching criterion.");
  }

  let estimatedPool = 1200;
  estimatedPool -= requiredCount * 110;
  estimatedPool -= minExp * 40;
  estimatedPool -= disqualifiers * 60;
  if (d.matching.languageRequirement && d.matching.languageRequirement.length > 0) {
    estimatedPool -= 100;
  }
  estimatedPool = Math.max(8, estimatedPool);

  let health: "healthy" | "too_strict" | "too_broad" | "low_signal" | "needs_review" = "healthy";
  if (requiredCount === 0 && minExp < 1) health = "too_broad";
  else if (estimatedPool < 40) health = "too_strict";
  else if (warnings.length > 0) health = "needs_review";

  return { health, estimatedPool, warnings };
}
