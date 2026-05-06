import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Logo } from './Logo';

type Audience =
  | 'candidate'
  | 'employer'
  | 'hiring_manager'
  | 'investor'
  | 'press'
  | 'other';

interface AudienceOption {
  value: Audience;
  label: string;
  helper: string;
  Icon: React.ComponentType<{ active?: boolean }>;
}

const AUDIENCE: AudienceOption[] = [
  { value: 'candidate', label: 'Candidate', helper: 'Looking for your next role', Icon: CandidateIcon },
  { value: 'employer', label: 'Employer', helper: 'Building a hiring team', Icon: EmployerIcon },
  { value: 'hiring_manager', label: 'Hiring manager', helper: 'Reviewing shortlists', Icon: HiringManagerIcon },
  { value: 'investor', label: 'Investor / partner', helper: 'Exploring a relationship', Icon: InvestorIcon },
  { value: 'press', label: 'Press', helper: 'Media or interview request', Icon: PressIcon },
  { value: 'other', label: 'Other', helper: "Something we haven't listed", Icon: OtherIcon },
];

const TOTAL = 3;

export function ContactPage() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [audience, setAudience] = useState<Audience | ''>('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const validEmail = /\S+@\S+\.\S+/.test(email);
  const canContinue = useMemo(() => {
    if (step === 1) return !!audience;
    if (step === 2) return validEmail;
    return true;
  }, [step, audience, validEmail]);

  const go = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const handleSubmit = () => setSubmitted(true);

  const stepVariants = {
    enter: (dir: number) => ({ x: dir * 24, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir * -24, opacity: 0 }),
  };

  const transition = reduce
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 280, damping: 30 };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Soft ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute right-[-120px] top-1/3 h-[380px] w-[380px] rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute bottom-[-160px] left-[-80px] h-[420px] w-[420px] rounded-full bg-sky-200/40 blur-3xl" />
      </div>

      {/* Top nav */}
      <header className="relative z-10 border-b border-white/40 bg-white/40 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={32} />
            <span>PlacedOn</span>
          </Link>
          <Link
            to="/"
            className="flex min-h-11 items-center gap-1.5 rounded-full border border-white/60 bg-white/60 px-4 text-slate-600 backdrop-blur-md transition hover:bg-white/80 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to home</span>
            <span className="sm:hidden">Home</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-2xl flex-col px-4 pb-16 pt-10 sm:px-6 sm:pt-16">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: reduce ? 0 : 0.4, ease: 'easeOut' }}
            >
              {/* Hero */}
              <div className="mb-8 text-center sm:mb-10">
                <h1>Join PlacedOn early access</h1>
                <p className="mx-auto mt-2 max-w-md text-slate-600">
                  Tell us who you are and where to reach you.
                </p>
              </div>

              {/* Glass card */}
              <div className="relative rounded-3xl border border-white/60 bg-white/55 p-6 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.15)] backdrop-blur-xl sm:p-8">
                {/* Inner highlight */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-3xl bg-gradient-to-r from-transparent via-white/90 to-transparent"
                />

                {/* Step indicator */}
                <div className="mb-6 flex items-center justify-between text-slate-600">
                  <span>
                    Step {step} of {TOTAL}
                  </span>
                  <span className="text-slate-500">{stepLabel(step)}</span>
                </div>
                <div className="mb-8 h-1 overflow-hidden rounded-full bg-slate-200/60">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                    initial={false}
                    animate={{ width: `${(step / TOTAL) * 100}%` }}
                    transition={{ duration: reduce ? 0 : 0.5, ease: 'easeOut' }}
                  />
                </div>

                <div className="relative min-h-[280px]">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={transition}
                    >
                      {step === 1 && (
                        <Step1
                          value={audience}
                          onChange={setAudience}
                          reduce={!!reduce}
                        />
                      )}
                      {step === 2 && (
                        <Step2 email={email} onChange={setEmail} valid={validEmail} />
                      )}
                      {step === 3 && (
                        <Step3 message={message} onChange={setMessage} />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Actions */}
                <div className="mt-8 flex items-center justify-between gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => go(step - 1)}
                    disabled={step === 1}
                    className="min-h-11 rounded-full"
                  >
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    Back
                  </Button>
                  <div className="flex items-center gap-2">
                    {step === 3 && (
                      <Button
                        variant="ghost"
                        onClick={handleSubmit}
                        className="min-h-11 rounded-full text-slate-600 hover:text-slate-900"
                      >
                        Skip and send
                      </Button>
                    )}
                    {step < TOTAL ? (
                      <Button
                        onClick={() => go(step + 1)}
                        disabled={!canContinue}
                        className="min-h-11 rounded-full bg-blue-600 px-5 shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
                      >
                        Continue
                        <ArrowRight className="ml-1.5 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        className="min-h-11 rounded-full bg-blue-600 px-5 shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
                      >
                        Send request
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <SuccessState
              key="success"
              reduce={!!reduce}
              onHome={() => navigate('/')}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function stepLabel(step: number) {
  if (step === 1) return 'About you';
  if (step === 2) return 'Email';
  return 'Message';
}

/* -------------------- Steps -------------------- */

function Step1({
  value,
  onChange,
  reduce,
}: {
  value: Audience | '';
  onChange: (v: Audience) => void;
  reduce: boolean;
}) {
  return (
    <div>
      <h2>What best describes you?</h2>
      <p className="mt-1 text-slate-600">Pick the option closest to your situation.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {AUDIENCE.map((opt, i) => {
          const selected = value === opt.value;
          const Icon = opt.Icon;
          return (
            <motion.button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduce ? 0 : 0.32,
                delay: reduce ? 0 : i * 0.05,
                ease: 'easeOut',
              }}
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.985 }}
              className={`group relative flex min-h-16 items-start gap-3 overflow-hidden rounded-2xl border p-4 text-left backdrop-blur-md transition ${
                selected
                  ? 'border-blue-400/70 bg-white/80 shadow-[0_0_0_4px_rgba(37,99,235,0.12),0_8px_24px_-12px_rgba(37,99,235,0.45)]'
                  : 'border-white/60 bg-white/55 hover:bg-white/75'
              }`}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent"
              />
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${
                  selected
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                }`}
              >
                <Icon active={selected} />
              </div>
              <div className="flex-1">
                <div>{opt.label}</div>
                <div className="text-slate-600">{opt.helper}</div>
              </div>
              <AnimatePresence>
                {selected && (
                  <motion.span
                    key="check"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white"
                  >
                    <Check className="h-3 w-3" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function Step2({
  email,
  onChange,
  valid,
}: {
  email: string;
  onChange: (v: string) => void;
  valid: boolean;
}) {
  return (
    <div>
      <h2>Where should we reach you?</h2>
      <p className="mt-1 text-slate-600">We'll only use this to follow up.</p>
      <div className="mt-6">
        <Input
          type="email"
          inputMode="email"
          autoFocus
          value={email}
          onChange={(e) => onChange(e.target.value)}
          placeholder="you@gmail.com"
          className="min-h-12 rounded-xl border-white/70 bg-white/70 backdrop-blur-md"
        />
        {email && !valid && (
          <p className="mt-2 text-rose-600">Please enter a valid email.</p>
        )}
      </div>
    </div>
  );
}

function Step3({
  message,
  onChange,
}: {
  message: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <h2>Anything we should know?</h2>
      <p className="mt-1 text-slate-600">Optional — a sentence or two is plenty.</p>
      <Textarea
        value={message}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        className="mt-6 rounded-xl border-white/70 bg-white/70 backdrop-blur-md"
      />
    </div>
  );
}

function SuccessState({
  reduce,
  onHome,
}: {
  reduce: boolean;
  onHome: () => void;
}) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.4, ease: 'easeOut' }}
      className="relative mx-auto max-w-lg rounded-3xl border border-white/60 bg-white/60 p-10 text-center shadow-[0_8px_40px_-12px_rgba(15,23,42,0.15)] backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.1 }}
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30"
      >
        <motion.svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d="M5 12.5l4.5 4.5L19 7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.25, ease: 'easeOut' }}
          />
        </motion.svg>
      </motion.div>
      <h2 className="mt-5">You're on the list</h2>
      <p className="mx-auto mt-2 max-w-sm text-slate-600">
        Thanks. We'll reach out when there's a relevant next step.
      </p>
      <Button
        onClick={onHome}
        className="mt-7 min-h-11 rounded-full bg-blue-600 px-6 hover:bg-blue-700"
      >
        Back to homepage
      </Button>
    </motion.div>
  );
}

/* -------------------- Custom Icons -------------------- */

const ICON_PROPS = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function CandidateIcon() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="10" cy="8" r="3.2" />
      <path d="M4 19c1.2-3 3.6-4.5 6-4.5s4.8 1.5 6 4.5" />
      <circle cx="18" cy="6.5" r="2.6" fill="currentColor" stroke="none" opacity="0.18" />
      <path d="M16.6 6.5l1 1 1.8-1.9" />
    </svg>
  );
}

function EmployerIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M4 20V8.5l6-3 6 3V20" />
      <path d="M4 20h12" />
      <path d="M8 20v-4h4v4" />
      <path d="M7 11h2M7 14h2M11 11h2M11 14h2" />
      <circle cx="19" cy="7" r="2" fill="currentColor" stroke="none" opacity="0.2" />
      <path d="M19 5.2v3.6M17.2 7h3.6" />
    </svg>
  );
}

function HiringManagerIcon() {
  return (
    <svg {...ICON_PROPS}>
      <rect x="3.5" y="5" width="11" height="4" rx="1.2" />
      <rect x="3.5" y="11" width="11" height="4" rx="1.2" fill="currentColor" stroke="none" opacity="0.18" />
      <rect x="3.5" y="11" width="11" height="4" rx="1.2" />
      <path d="M6 7h2M6 13h2" />
      <circle cx="18.5" cy="9" r="2.2" />
      <path d="M15.5 17c.5-1.6 1.8-2.5 3-2.5s2.5.9 3 2.5" />
    </svg>
  );
}

function InvestorIcon() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="6" cy="17" r="2.2" />
      <circle cx="18" cy="7" r="2.2" fill="currentColor" stroke="none" opacity="0.18" />
      <circle cx="18" cy="7" r="2.2" />
      <path d="M7.6 15.6L16.4 8.4" />
      <path d="M4 20l4-2M16 4l4 2" />
      <path d="M11 13.5l1.5-1.5 1.5 1.5" opacity="0.6" />
    </svg>
  );
}

function PressIcon() {
  return (
    <svg {...ICON_PROPS}>
      <rect x="4" y="6" width="13" height="12" rx="1.6" />
      <path d="M17 9h3v7a2 2 0 0 1-2 2h-1" />
      <path d="M7 9h6M7 12h6M7 15h4" />
      <circle cx="14.5" cy="3.5" r="1.5" fill="currentColor" stroke="none" opacity="0.5" />
    </svg>
  );
}

function OtherIcon() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.5 9.5a2.5 2.5 0 0 1 4.8.8c0 1.7-2.3 1.9-2.3 3.4" />
      <circle cx="12" cy="16.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
