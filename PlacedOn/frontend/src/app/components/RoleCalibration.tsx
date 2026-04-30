import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, Sparkles, FileText, ChevronLeft, ChevronRight, Loader2,
  CheckCircle2, AlertTriangle, Info, Zap, MapPin, Briefcase,
  TrendingUp, Calendar, DollarSign, Plus, Sliders, Eye,
} from "lucide-react";

type Step = 1 | 2 | 3 | 4;

interface ParsedCriteria {
  title: string;
  level: string;
  location: string;
  remotePolicy: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceMin: number;
  experienceMax: number;
  availability: string;
  salaryMin: string;
  salaryMax: string;
}

const DIMENSIONS: Array<{ id: keyof Weights; label: string; hint: string }> = [
  { id: "technicalDepth", label: "Technical depth", hint: "Hands-on system & tooling expertise" },
  { id: "problemSolving", label: "Problem solving", hint: "Reasoning under novel constraints" },
  { id: "communication", label: "Communication", hint: "Clarity, written and verbal" },
  { id: "ownership", label: "Ownership", hint: "Driving outcomes end-to-end" },
  { id: "ambiguityTolerance", label: "Ambiguity tolerance", hint: "Comfort with under-specified work" },
  { id: "collaboration", label: "Collaboration", hint: "Cross-functional partnership" },
];

interface Weights {
  technicalDepth: number;
  problemSolving: number;
  communication: number;
  ownership: number;
  ambiguityTolerance: number;
  collaboration: number;
}

const DEFAULT_WEIGHTS: Weights = {
  technicalDepth: 70,
  problemSolving: 70,
  communication: 60,
  ownership: 65,
  ambiguityTolerance: 55,
  collaboration: 60,
};

const SAMPLE_BRIEF = `We're hiring a Senior Full-Stack Engineer to lead the build-out of our applicant analytics surface. You'll own features end-to-end across our React/TypeScript front-end and our Node + Postgres back-end, partner closely with design and ML, and help shape technical direction as the team grows.

Must have: 5+ years of production engineering, strong React/TypeScript, comfortable with relational data modeling, experience shipping in a small team. Nice to have: prior work on hiring or HR products, exposure to vector search, observability practice. Remote-friendly across US/EU. Target start: within 30 days. Base $170k–$210k.`;

export function RoleCalibration({
  open,
  onClose,
  onActivate,
}: {
  open: boolean;
  onClose: () => void;
  onActivate: (role: { criteria: ParsedCriteria; weights: Weights }) => void;
}) {
  const [step, setStep] = useState<Step>(1);
  const [brief, setBrief] = useState("");
  const [parsing, setParsing] = useState(false);
  const [criteria, setCriteria] = useState<ParsedCriteria | null>(null);
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setStep(1);
      setBrief("");
      setCriteria(null);
      setWeights(DEFAULT_WEIGHTS);
      setParsing(false);
    }
  }, [open]);

  const parse = () => {
    setParsing(true);
    window.setTimeout(() => {
      setCriteria(parseBrief(brief));
      setParsing(false);
      setStep(2);
    }, 900);
  };

  const preview = useMemo(
    () => (criteria ? computePreview(criteria, weights) : null),
    [criteria, weights]
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-0 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Create new role"
        >
          <button
            aria-label="Close"
            className="absolute inset-0 bg-[#1F2430]/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", damping: 26, stiffness: 240 }}
            className="relative w-full sm:max-w-3xl h-full sm:h-[min(88vh,820px)] bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <header className="px-5 sm:px-6 py-4 border-b border-[#1F2430]/10 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#0A6847]/10 text-[#0A6847] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" aria-hidden />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-[Manrope,sans-serif] font-bold text-[15px] truncate">
                  Create role &amp; calibrate matching
                </h2>
                <p className="text-[12px] text-[#1F2430]/60 truncate">
                  PlacedOn turns a brief into structured hiring criteria you can tune.
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-8 h-8 rounded-md hover:bg-[#1F2430]/5 flex items-center justify-center text-[#1F2430]/60 focus:outline-none focus:ring-2 focus:ring-[#10B981]/40"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            {/* Stepper */}
            <Stepper step={step} />

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {step === 1 && (
                <Step1 brief={brief} setBrief={setBrief} parsing={parsing} />
              )}
              {step === 2 && criteria && (
                <Step2 criteria={criteria} setCriteria={setCriteria} />
              )}
              {step === 3 && (
                <Step3 weights={weights} setWeights={setWeights} />
              )}
              {step === 4 && criteria && preview && (
                <Step4 criteria={criteria} weights={weights} preview={preview} />
              )}
            </div>

            {/* Footer */}
            <footer className="px-5 sm:px-6 py-3 border-t border-[#1F2430]/10 bg-[#F8F7F5] flex items-center gap-2">
              {step > 1 ? (
                <button
                  onClick={() => setStep((s) => (s - 1) as Step)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#1F2430]/10 bg-white text-[12px] font-bold text-[#1F2430]/80 hover:bg-[#1F2430]/5 focus:outline-none focus:ring-2 focus:ring-[#10B981]/40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" aria-hidden /> Back
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#1F2430]/10 bg-white text-[12px] font-bold text-[#1F2430]/80 hover:bg-[#1F2430]/5 focus:outline-none focus:ring-2 focus:ring-[#10B981]/40"
                >
                  Cancel
                </button>
              )}
              <span className="text-[11px] text-[#1F2430]/50 ml-2 hidden sm:inline">
                Step {step} of 4
              </span>
              <div className="ml-auto flex items-center gap-2">
                {step === 1 && (
                  <button
                    onClick={parse}
                    disabled={brief.trim().length < 20 || parsing}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0A6847] text-white text-[12px] font-bold hover:bg-[#1F2430] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#10B981]/40"
                  >
                    {parsing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden />
                        Parsing…
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" aria-hidden /> Parse with AI
                      </>
                    )}
                  </button>
                )}
                {step === 2 && (
                  <button
                    onClick={() => setStep(3)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0A6847] text-white text-[12px] font-bold hover:bg-[#1F2430] focus:outline-none focus:ring-2 focus:ring-[#10B981]/40"
                  >
                    Adjust importance <ChevronRight className="w-3.5 h-3.5" aria-hidden />
                  </button>
                )}
                {step === 3 && (
                  <button
                    onClick={() => setStep(4)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0A6847] text-white text-[12px] font-bold hover:bg-[#1F2430] focus:outline-none focus:ring-2 focus:ring-[#10B981]/40"
                  >
                    Preview matches <ChevronRight className="w-3.5 h-3.5" aria-hidden />
                  </button>
                )}
                {step === 4 && criteria && (
                  <button
                    onClick={() => onActivate({ criteria, weights })}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#10B981] text-[#062b1d] text-[12px] font-bold hover:bg-[#0A6847] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#10B981]/40"
                  >
                    <Eye className="w-3.5 h-3.5" aria-hidden /> Activate role &amp; view matches
                  </button>
                )}
              </div>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -------------------- Stepper -------------------- */
function Stepper({ step }: { step: Step }) {
  const items: Array<{ id: Step; label: string }> = [
    { id: 1, label: "Brief" },
    { id: 2, label: "Criteria" },
    { id: 3, label: "Importance" },
    { id: 4, label: "Preview" },
  ];
  return (
    <div className="px-5 sm:px-6 py-3 border-b border-[#1F2430]/10 flex items-center gap-1.5 overflow-x-auto">
      {items.map((it, i) => {
        const active = step === it.id;
        const done = step > it.id;
        return (
          <div key={it.id} className="flex items-center gap-1.5 shrink-0">
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                active
                  ? "bg-[#0A6847] text-white"
                  : done
                  ? "bg-[#10B981]/10 text-[#0A6847]"
                  : "bg-[#1F2430]/5 text-[#1F2430]/55"
              }`}
            >
              <span className="tabular-nums">{done ? "✓" : it.id}</span>
              {it.label}
            </div>
            {i < items.length - 1 && (
              <ChevronRight className="w-3 h-3 text-[#1F2430]/30" aria-hidden />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* -------------------- Step 1: Brief -------------------- */
function Step1({
  brief,
  setBrief,
  parsing,
}: {
  brief: string;
  setBrief: (s: string) => void;
  parsing: boolean;
}) {
  return (
    <div className="px-5 sm:px-6 py-5 space-y-4">
      <div>
        <h3 className="font-[Manrope,sans-serif] font-bold text-[14px]">
          Paste a job description or write a brief
        </h3>
        <p className="text-[12.5px] text-[#1F2430]/65 mt-0.5">
          Anything works — internal hiring brief, JD, or a few bullet points. PlacedOn extracts
          structured criteria in the next step.
        </p>
      </div>
      <div className="relative">
        <FileText
          className="w-3.5 h-3.5 absolute top-3 left-3 text-[#1F2430]/40"
          aria-hidden
        />
        <textarea
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          rows={12}
          disabled={parsing}
          placeholder="Paste the job description here, or describe the role in your own words…"
          className="w-full bg-[#F8F7F5] border border-[#1F2430]/10 rounded-lg py-3 pl-9 pr-3 text-[13px] leading-relaxed outline-none focus:bg-white focus:border-[#0A6847]/40 focus:ring-2 focus:ring-[#10B981]/20 resize-none"
          aria-label="Role brief"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] text-[#1F2430]/55 tabular-nums">
          {brief.trim().length} characters · ≥ 20 to parse
        </span>
        <button
          onClick={() => setBrief(SAMPLE_BRIEF)}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3E63F5] hover:text-[#0A6847] focus:outline-none"
        >
          <Sparkles className="w-3 h-3" aria-hidden /> Use sample brief
        </button>
      </div>
      <div className="rounded-lg border border-[#3E63F5]/20 bg-[#3E63F5]/5 p-3 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-[#3E63F5] mt-0.5 shrink-0" aria-hidden />
        <p className="text-[12px] text-[#1F2430]/80 leading-relaxed">
          PlacedOn never publishes your brief externally. It's used only to calibrate matching for
          this role and stays inside your workspace.
        </p>
      </div>
    </div>
  );
}

/* -------------------- Step 2: Parsed criteria -------------------- */
function Step2({
  criteria,
  setCriteria,
}: {
  criteria: ParsedCriteria;
  setCriteria: (c: ParsedCriteria) => void;
}) {
  const [draftRequired, setDraftRequired] = useState("");
  const [draftPreferred, setDraftPreferred] = useState("");
  const update = (patch: Partial<ParsedCriteria>) =>
    setCriteria({ ...criteria, ...patch });

  return (
    <div className="px-5 sm:px-6 py-5 space-y-4">
      <div className="rounded-lg border border-[#10B981]/25 bg-[#10B981]/5 p-3 flex items-start gap-2">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#0A6847] mt-0.5 shrink-0" aria-hidden />
        <p className="text-[12px] text-[#1F2430]/80 leading-relaxed">
          Parsed by PlacedOn AI. Edit anything that's off — these criteria drive the candidate
          shortlist.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field icon={<Briefcase className="w-3.5 h-3.5" />} label="Role title">
          <input
            value={criteria.title}
            onChange={(e) => update({ title: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field icon={<TrendingUp className="w-3.5 h-3.5" />} label="Level">
          <select
            value={criteria.level}
            onChange={(e) => update({ level: e.target.value })}
            className={inputCls}
          >
            {["Junior", "Mid", "Senior", "Staff", "Principal", "Manager"].map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </Field>
        <Field icon={<MapPin className="w-3.5 h-3.5" />} label="Location">
          <input
            value={criteria.location}
            onChange={(e) => update({ location: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field icon={<MapPin className="w-3.5 h-3.5" />} label="Remote policy">
          <select
            value={criteria.remotePolicy}
            onChange={(e) => update({ remotePolicy: e.target.value })}
            className={inputCls}
          >
            {["Remote", "Hybrid", "On-site"].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
        <Field icon={<Calendar className="w-3.5 h-3.5" />} label="Availability">
          <select
            value={criteria.availability}
            onChange={(e) => update({ availability: e.target.value })}
            className={inputCls}
          >
            {["Now", "≤ 30 days", "≤ 60 days", "≤ 90 days"].map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </Field>
        <Field icon={<TrendingUp className="w-3.5 h-3.5" />} label="Experience (yrs)">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              value={criteria.experienceMin}
              onChange={(e) =>
                update({ experienceMin: Number(e.target.value) || 0 })
              }
              className={inputCls}
            />
            <span className="text-[#1F2430]/50 text-[12px]">to</span>
            <input
              type="number"
              min={0}
              value={criteria.experienceMax}
              onChange={(e) =>
                update({ experienceMax: Number(e.target.value) || 0 })
              }
              className={inputCls}
            />
          </div>
        </Field>
      </div>

      <Field icon={<DollarSign className="w-3.5 h-3.5" />} label="Salary range (optional)">
        <div className="flex items-center gap-2">
          <input
            value={criteria.salaryMin}
            onChange={(e) => update({ salaryMin: e.target.value })}
            placeholder="$ min"
            className={inputCls}
          />
          <span className="text-[#1F2430]/50 text-[12px]">to</span>
          <input
            value={criteria.salaryMax}
            onChange={(e) => update({ salaryMax: e.target.value })}
            placeholder="$ max"
            className={inputCls}
          />
        </div>
      </Field>

      <SkillEditor
        label="Required skills"
        tone="required"
        items={criteria.requiredSkills}
        draft={draftRequired}
        setDraft={setDraftRequired}
        onAdd={(t) => update({ requiredSkills: [...criteria.requiredSkills, t] })}
        onRemove={(t) =>
          update({
            requiredSkills: criteria.requiredSkills.filter((s) => s !== t),
          })
        }
      />
      <SkillEditor
        label="Preferred skills"
        tone="preferred"
        items={criteria.preferredSkills}
        draft={draftPreferred}
        setDraft={setDraftPreferred}
        onAdd={(t) =>
          update({ preferredSkills: [...criteria.preferredSkills, t] })
        }
        onRemove={(t) =>
          update({
            preferredSkills: criteria.preferredSkills.filter((s) => s !== t),
          })
        }
      />
    </div>
  );
}

const inputCls =
  "w-full bg-[#F8F7F5] border border-[#1F2430]/10 rounded-lg py-2 px-3 text-[13px] outline-none focus:bg-white focus:border-[#0A6847]/40 focus:ring-2 focus:ring-[#10B981]/20";

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#1F2430]/60 inline-flex items-center gap-1 mb-1">
        <span className="text-[#1F2430]/45">{icon}</span>
        {label}
      </span>
      {children}
    </label>
  );
}

function SkillEditor({
  label,
  tone,
  items,
  draft,
  setDraft,
  onAdd,
  onRemove,
}: {
  label: string;
  tone: "required" | "preferred";
  items: string[];
  draft: string;
  setDraft: (s: string) => void;
  onAdd: (t: string) => void;
  onRemove: (t: string) => void;
}) {
  const chipCls =
    tone === "required"
      ? "bg-[#0A6847]/8 text-[#0A6847] border-[#0A6847]/20"
      : "bg-[#3E63F5]/8 text-[#3E63F5] border-[#3E63F5]/20";
  const add = () => {
    const t = draft.trim();
    if (!t || items.includes(t)) return;
    onAdd(t);
    setDraft("");
  };
  return (
    <div>
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#1F2430]/60">
        {label}
      </span>
      <div className="mt-1 flex items-center gap-1.5">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Add a skill and press Enter"
          className={inputCls + " flex-1"}
        />
        <button
          onClick={add}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-[#1F2430]/10 bg-white text-[12px] font-bold text-[#1F2430]/80 hover:bg-[#1F2430]/5 focus:outline-none focus:ring-2 focus:ring-[#10B981]/40"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden /> Add
        </button>
      </div>
      {items.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {items.map((t) => (
            <span
              key={t}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-bold ${chipCls}`}
            >
              {t}
              <button
                onClick={() => onRemove(t)}
                aria-label={`Remove ${t}`}
                className="hover:text-[#1F2430]"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------- Step 3: Importance sliders -------------------- */
function Step3({
  weights,
  setWeights,
}: {
  weights: Weights;
  setWeights: (w: Weights) => void;
}) {
  return (
    <div className="px-5 sm:px-6 py-5 space-y-4">
      <div>
        <h3 className="font-[Manrope,sans-serif] font-bold text-[14px] inline-flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-[#0A6847]" aria-hidden />
          How should PlacedOn weight signals?
        </h3>
        <p className="text-[12.5px] text-[#1F2430]/65 mt-0.5">
          These dimensions influence which evidence dominates ranking. You can re-tune anytime.
        </p>
      </div>
      <div className="space-y-3">
        {DIMENSIONS.map((dim) => {
          const v = weights[dim.id];
          const tone =
            v >= 80
              ? "text-[#0A6847]"
              : v >= 55
              ? "text-[#3E63F5]"
              : "text-[#1F2430]/55";
          return (
            <div
              key={dim.id}
              className="rounded-lg border border-[#1F2430]/10 bg-white p-3"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="min-w-0">
                  <div className="font-[Manrope,sans-serif] font-bold text-[13px]">
                    {dim.label}
                  </div>
                  <div className="text-[11px] text-[#1F2430]/55">{dim.hint}</div>
                </div>
                <span className={`tabular-nums font-bold text-[13px] ${tone}`}>
                  {v}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={v}
                onChange={(e) =>
                  setWeights({ ...weights, [dim.id]: Number(e.target.value) })
                }
                aria-label={`${dim.label} importance`}
                className="w-full accent-[#0A6847]"
              />
              <div className="flex justify-between text-[10px] text-[#1F2430]/45 font-bold uppercase tracking-wider">
                <span>Low</span>
                <span>Balanced</span>
                <span>Critical</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------- Step 4: Preview -------------------- */
function Step4({
  criteria,
  weights,
  preview,
}: {
  criteria: ParsedCriteria;
  weights: Weights;
  preview: PreviewResult;
}) {
  return (
    <div className="px-5 sm:px-6 py-5 space-y-4">
      <div>
        <h3 className="font-[Manrope,sans-serif] font-bold text-[14px] inline-flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-[#0A6847]" aria-hidden />
          Candidate matching preview
        </h3>
        <p className="text-[12.5px] text-[#1F2430]/65 mt-0.5">
          Estimated based on your current talent graph and calibration weights.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <PreviewStat label="Est. matches" value={preview.estMatches.toString()} tone="green" />
        <PreviewStat label="Avg fit" value={`${preview.avgFit}%`} tone="blue" />
        <PreviewStat label="Strict bucket" value={`${preview.strictPct}%`} tone="ink" />
      </div>

      <div className="rounded-lg border border-[#1F2430]/10 bg-white p-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#1F2430]/55 mb-1.5">
          Expected match quality
        </div>
        <div className="h-2 rounded-full bg-[#1F2430]/8 overflow-hidden">
          <div
            className={`h-full ${
              preview.quality >= 75
                ? "bg-[#10B981]"
                : preview.quality >= 55
                ? "bg-[#3E63F5]"
                : "bg-[#F59E0B]"
            }`}
            style={{ width: `${preview.quality}%` }}
            role="progressbar"
            aria-valuenow={preview.quality}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Expected match quality"
          />
        </div>
        <div className="mt-1 text-[11px] text-[#1F2430]/55 tabular-nums">
          {preview.quality} / 100 — {preview.qualityLabel}
        </div>
      </div>

      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#1F2430]/55 mb-1.5">
          Calibration warnings
        </div>
        {preview.warnings.length === 0 ? (
          <div className="rounded-lg border border-[#10B981]/25 bg-[#10B981]/5 p-3 flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#0A6847] mt-0.5 shrink-0" aria-hidden />
            <p className="text-[12px] text-[#1F2430]/80 leading-relaxed">
              Calibration looks balanced. No conflicts detected against your role criteria.
            </p>
          </div>
        ) : (
          <ul className="space-y-2" role="list">
            {preview.warnings.map((w, i) => (
              <li
                key={i}
                className="rounded-lg border border-[#F59E0B]/25 bg-[#F59E0B]/5 p-3 flex items-start gap-2"
              >
                <AlertTriangle
                  className="w-3.5 h-3.5 text-[#B45309] mt-0.5 shrink-0"
                  aria-hidden
                />
                <p className="text-[12.5px] text-[#1F2430]/85 leading-relaxed">{w}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-lg border border-[#1F2430]/10 bg-[#F8F7F5] p-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#1F2430]/55 mb-1.5">
          Summary
        </div>
        <p className="text-[12.5px] text-[#1F2430]/80 leading-relaxed">
          <strong>{criteria.title}</strong> · {criteria.level} ·{" "}
          {criteria.remotePolicy} · {criteria.location} · {criteria.experienceMin}–
          {criteria.experienceMax} yrs · Available {criteria.availability}.{" "}
          {criteria.requiredSkills.length} required &amp; {criteria.preferredSkills.length}{" "}
          preferred skills. Top weight:{" "}
          <strong>
            {DIMENSIONS.reduce((top, d) =>
              weights[d.id] > weights[top.id] ? d : top
            ).label}
          </strong>
          .
        </p>
      </div>
    </div>
  );
}

function PreviewStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "green" | "blue" | "ink";
}) {
  const cls =
    tone === "green"
      ? "text-[#0A6847]"
      : tone === "blue"
      ? "text-[#3E63F5]"
      : "text-[#1F2430]";
  return (
    <div className="rounded-lg border border-[#1F2430]/10 bg-white px-3 py-2">
      <div className="text-[10px] font-bold uppercase tracking-wider text-[#1F2430]/55">
        {label}
      </div>
      <div
        className={`font-[Manrope,sans-serif] font-bold tabular-nums ${cls}`}
      >
        {value}
      </div>
    </div>
  );
}

/* -------------------- Helpers -------------------- */

function parseBrief(brief: string): ParsedCriteria {
  const lower = brief.toLowerCase();

  // Title heuristics
  const titleMatch =
    brief.match(/(senior|staff|principal|lead|junior)?\s*(full[- ]?stack|frontend|backend|product|design|data|ml|engineering|software)\s+(engineer|manager|designer|scientist)/i);
  const title = titleMatch ? capitalize(titleMatch[0].trim()) : "Senior Software Engineer";

  // Level
  const level = /staff|principal/.test(lower)
    ? "Staff"
    : /senior/.test(lower)
    ? "Senior"
    : /junior|new grad|entry/.test(lower)
    ? "Junior"
    : /manager|lead/.test(lower)
    ? "Manager"
    : "Mid";

  // Remote policy & location
  const remotePolicy = /remote/.test(lower)
    ? "Remote"
    : /hybrid/.test(lower)
    ? "Hybrid"
    : /on[- ]?site/.test(lower)
    ? "On-site"
    : "Hybrid";
  const locationMatch = brief.match(
    /(san francisco|new york|nyc|london|remote|us\/eu|us|eu|berlin|toronto|austin)/i
  );
  const location = locationMatch ? capitalize(locationMatch[0]) : "Remote";

  // Skills (simple keyword matching)
  const skillBank = [
    "React", "TypeScript", "JavaScript", "Node", "Postgres", "GraphQL", "Python",
    "Go", "Rust", "Kubernetes", "AWS", "GCP", "Tailwind", "Next.js", "System design",
    "REST APIs", "Vector search", "Observability", "Testing", "CI/CD",
  ];
  const required: string[] = [];
  const preferred: string[] = [];
  for (const s of skillBank) {
    const re = new RegExp(`\\b${s.replace(/\./g, "\\.").replace(/\+/g, "\\+")}\\b`, "i");
    if (re.test(brief)) required.push(s);
  }
  const niceMatch = brief.match(/nice to have:?([^.]+)/i);
  if (niceMatch) {
    for (const s of skillBank) {
      const re = new RegExp(`\\b${s.replace(/\./g, "\\.").replace(/\+/g, "\\+")}\\b`, "i");
      if (re.test(niceMatch[1])) {
        preferred.push(s);
        const idx = required.indexOf(s);
        if (idx >= 0) required.splice(idx, 1);
      }
    }
  }
  if (required.length === 0) required.push("React", "TypeScript");
  if (preferred.length === 0) preferred.push("Observability");

  // Experience
  const expMatch = brief.match(/(\d+)\+?\s*(?:years|yrs|y)/i);
  const minYrs = expMatch ? Number(expMatch[1]) : level === "Senior" ? 5 : level === "Staff" ? 8 : level === "Junior" ? 0 : 3;
  const maxYrs = minYrs + (level === "Junior" ? 3 : level === "Staff" ? 6 : 5);

  // Availability
  const availability = /(\b30 days\b|within 30)/i.test(brief)
    ? "≤ 30 days"
    : /60 days/i.test(brief)
    ? "≤ 60 days"
    : /asap|now|immediate/i.test(brief)
    ? "Now"
    : "≤ 60 days";

  // Salary
  const salaryMatch = brief.match(/\$?\s?(\d{2,3})k?\s?[–-]\s?\$?\s?(\d{2,3})k?/);
  const salaryMin = salaryMatch ? `$${salaryMatch[1]}k` : "";
  const salaryMax = salaryMatch ? `$${salaryMatch[2]}k` : "";

  return {
    title,
    level,
    location,
    remotePolicy,
    requiredSkills: required,
    preferredSkills: preferred,
    experienceMin: minYrs,
    experienceMax: maxYrs,
    availability,
    salaryMin,
    salaryMax,
  };
}

function capitalize(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

interface PreviewResult {
  estMatches: number;
  avgFit: number;
  strictPct: number;
  quality: number;
  qualityLabel: string;
  warnings: string[];
}

function computePreview(criteria: ParsedCriteria, weights: Weights): PreviewResult {
  const total =
    weights.technicalDepth +
    weights.problemSolving +
    weights.communication +
    weights.ownership +
    weights.ambiguityTolerance +
    weights.collaboration;
  const avg = total / 6;

  const strictness =
    (criteria.requiredSkills.length >= 6 ? 18 : 8) +
    (criteria.experienceMin >= 7 ? 18 : criteria.experienceMin >= 4 ? 10 : 4) +
    (weights.technicalDepth >= 85 ? 12 : 0);

  const baseMatches = 240;
  const estMatches = Math.max(
    8,
    Math.round(baseMatches * (1 - Math.min(0.85, strictness / 100)))
  );
  const avgFit = Math.round(70 + (avg - 60) * 0.25);
  const strictPct = Math.min(95, 30 + strictness);
  const quality = Math.max(20, Math.min(95, 90 - strictness * 0.5 + (avg - 60) * 0.4));
  const qualityLabel =
    quality >= 75 ? "Strong pool" : quality >= 55 ? "Workable pool" : "Narrow pool";

  const warnings: string[] = [];

  if (
    (criteria.level === "Junior" || criteria.experienceMin <= 1) &&
    weights.technicalDepth >= 80
  ) {
    warnings.push(
      "Technical depth is weighted high for an early-career role. This may filter out otherwise strong candidates — consider lowering it to 60–70."
    );
  }
  if (criteria.requiredSkills.length >= 8) {
    warnings.push(
      `You've listed ${criteria.requiredSkills.length} required skills. Roles with more than 6–7 required skills typically reduce candidate pools by 40%+. Consider moving some to "preferred".`
    );
  }
  if (criteria.experienceMin >= 7 && criteria.availability === "Now") {
    warnings.push(
      "Senior-level candidates with immediate availability are rare. Consider widening availability to ≤ 60 days."
    );
  }
  if (
    weights.communication < 40 &&
    (criteria.level === "Manager" || /manager|lead/i.test(criteria.title))
  ) {
    warnings.push(
      "Communication is weighted low for a leadership role. This may surface candidates who struggle with stakeholder work."
    );
  }
  if (weights.ambiguityTolerance >= 85 && criteria.level === "Junior") {
    warnings.push(
      "High ambiguity tolerance is unusual for a junior role and may bias toward over-qualified candidates."
    );
  }
  if (
    weights.ownership >= 80 &&
    weights.collaboration <= 35
  ) {
    warnings.push(
      "Ownership is weighted high while collaboration is low. Strong solo operators may surface, but team-fit signals will be muted."
    );
  }

  return {
    estMatches,
    avgFit,
    strictPct,
    quality: Math.round(quality),
    qualityLabel,
    warnings,
  };
}

export default RoleCalibration;
