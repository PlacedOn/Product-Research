"use client";

import type { TranscriptItem } from "@/lib/types";

interface TranscriptPanelProps {
  items: TranscriptItem[];
  className?: string;
  progress?: number;
}

export default function TranscriptPanel({ items, className = "", progress = 0 }: TranscriptPanelProps) {
  return (
    <aside
      className={`flex min-h-[420px] rounded-2xl border border-white/10 bg-gradient-to-b from-slate-800/85 to-slate-900/88 p-4 backdrop-blur-xl ${className}`}
    >
      <div className="flex w-full flex-col">
        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Live Transcript</h3>
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
        </div>

        <div className="scrollbar-slim flex-1 space-y-3 overflow-y-auto pr-1">
          {items.length === 0 ? (
            <p className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-400">Waiting for speech input...</p>
          ) : (
            items.slice(-6).map((item) => (
              <div
                key={item.id}
                className={`rounded-lg border px-3 py-2.5 ${
                  item.role === "ai"
                    ? "border-slate-500/20 bg-slate-900/40"
                    : item.role === "user"
                      ? "border-slate-500/30 bg-black/20"
                      : "border-emerald-400/30 bg-emerald-500/10"
                }`}
              >
                <div className="mb-1.5 flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-slate-400">
                  <span>{item.role === "ai" ? "Vale (AI)" : item.role === "user" ? "Candidate" : "System"}</span>
                  <span>{item.timestamp}</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-200">{item.text}</p>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 border-t border-white/10 pt-3">
          <div className="border-l-2 border-emerald-400/60 pl-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-300">
              Candidate Eval-Time {Math.max(3, Math.round(progress * 10))}
            </p>
            <p className="text-xs italic leading-relaxed text-slate-300">
              Strong ownership and system-level thinking across responses.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
