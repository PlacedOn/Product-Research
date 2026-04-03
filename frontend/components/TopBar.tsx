"use client";

import { Wifi, WifiOff } from "lucide-react";

export default function TopBar({ elapsedSeconds, progress, connected }: { elapsedSeconds: number; progress: number; connected: boolean }) {
  const mm = String(Math.floor(elapsedSeconds / 60)).padStart(2, "0");
  const ss = String(elapsedSeconds % 60).padStart(2, "0");

  return (
    <header className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/45 px-4 py-3 backdrop-blur-xl">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Timer</p>
        <p className="text-lg font-semibold text-slate-100">{mm}:{ss}</p>
      </div>

      <div className="flex-1 px-2">
        <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
          <span>Interview Progress</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all"
            style={{ width: `${Math.min(Math.max(progress * 100, 0), 100)}%` }}
          />
        </div>
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-800/70 px-3 py-1 text-xs text-slate-300">
        {connected ? <Wifi className="h-3.5 w-3.5 text-emerald-400" /> : <WifiOff className="h-3.5 w-3.5 text-red-400" />}
        {connected ? "Realtime Connected" : "Disconnected"}
      </div>
    </header>
  );
}
