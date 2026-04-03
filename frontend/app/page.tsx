"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, Cog, FileText, LayoutGrid, Shield, Timer } from "lucide-react";

import Background from "@/components/Background";
import ControlDock from "@/components/ControlDock";
import Persona from "@/components/Persona";
import QuestionCard from "@/components/QuestionCard";
import TranscriptPanel from "@/components/TranscriptPanel";
import { useInterviewSocket } from "@/lib/useInterviewSocket";

const navItems = [
  { label: "Overview", icon: LayoutGrid },
  { label: "Transcript", icon: FileText, active: true },
  { label: "Analysis", icon: BarChart3 },
  { label: "Settings", icon: Cog },
];

export default function InterviewPage() {
  const [questionTimer, setQuestionTimer] = useState(180);
  const { state, toggleMic, toggleCam, pushToTalk, endInterview } = useInterviewSocket("candidate-live-1");

  useEffect(() => {
    const timer = setInterval(() => {
      setQuestionTimer((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setQuestionTimer(180);
  }, [state.turn]);

  const progress = useMemo(() => Math.min(state.turn / 5, 1), [state.turn]);
  const remaining = useMemo(() => questionTimer, [questionTimer]);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const questionIndex = state.turn > 0 ? state.turn : 1;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0f16] text-textPrimary">
      <Background />

      <div className="relative z-10 mx-auto min-h-screen w-full max-w-[1500px] p-3 md:p-5">
        <div className="grid min-h-[calc(100vh-24px)] grid-cols-1 gap-3 rounded-2xl border border-white/15 bg-[#111319]/90 p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_80px_rgba(0,0,0,0.55)] lg:grid-cols-[230px_1fr]">
          <aside className="hidden rounded-xl border border-white/5 bg-[#14161d] p-4 lg:flex lg:flex-col">
            <div>
              <div className="mb-4 flex items-center gap-2 text-slate-200">
                <Shield className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium">Vale AI Interviewer</span>
              </div>
              <div className="mb-8 rounded-lg border border-white/5 bg-black/20 p-3">
                <p className="text-sm font-semibold text-slate-100">The Sentinel</p>
                <p className="text-[11px] text-slate-500">AI-Powered Evaluation</p>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition ${
                        item.active
                          ? "border-l border-blue-300/70 bg-white/5 text-slate-50"
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <button
              onClick={endInterview}
              className="mt-auto rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-red-50 transition hover:bg-red-600"
            >
              End Interview
            </button>
          </aside>

          <section className="relative flex min-h-[80vh] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#090d13]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_52%,rgba(29,213,121,0.22),rgba(40,80,145,0.12)_42%,transparent_70%)]" />

            <header className="relative z-10 flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <p className="inline-block rounded-sm bg-white/10 px-2 py-1 text-xl font-semibold leading-none tracking-tight text-slate-200 md:text-3xl lg:text-4xl">
                  Stitch - Design with AI
                </p>
                <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">Current Milestone</p>
                <p className="text-2xl font-bold text-white">Question {questionIndex}/5</p>
                {state.error ? <p className="mt-2 text-xs text-rose-300">{state.error}</p> : null}
              </div>

              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-slate-300">
                  <Timer className="h-3.5 w-3.5" />
                  {mm}:{ss} remaining
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
            </header>

            <div className="relative z-10 flex flex-1 flex-col items-center justify-end px-4 pb-8 pt-6 md:px-6">
              <div className="mb-8 mt-auto">
                <Persona state={state.personaState} />
              </div>

              <QuestionCard question={state.question} tags={state.questionTags} />

              <div className="mt-7">
                <ControlDock
                  micOn={state.micOn}
                  camOn={state.camOn}
                  onToggleMic={toggleMic}
                  onToggleCam={toggleCam}
                  onPushToTalk={pushToTalk}
                  onEnd={endInterview}
                />
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-28 right-4 z-20 hidden w-[290px] md:right-6 lg:block">
              <div className="mb-2 ml-auto h-10 w-28 rounded-xl border border-sky-400/20 bg-[#0e2034]/70" />
              <TranscriptPanel items={state.transcript} className="pointer-events-auto" progress={progress} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
