"use client";

import { Camera, Mic } from "lucide-react";

export default function VideoPanel({ micOn, camOn }: { micOn: boolean; camOn: boolean }) {
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-slate-900/55 p-3 backdrop-blur-xl lg:w-[320px]">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Candidate Video</p>
        <span className="rounded-full bg-slate-700/70 px-2 py-1 text-[10px] text-slate-300">Mock Feed</span>
      </div>

      <div className="h-36 rounded-xl border border-slate-700/70 bg-gradient-to-br from-slate-800 to-slate-900 md:h-40">
        <div className="flex h-full items-center justify-center text-sm text-slate-500">Camera Preview</div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs">
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${micOn ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-700 text-slate-400"}`}>
          <Mic className="h-3.5 w-3.5" /> {micOn ? "Mic On" : "Mic Off"}
        </span>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${camOn ? "bg-sky-500/20 text-sky-300" : "bg-slate-700 text-slate-400"}`}>
          <Camera className="h-3.5 w-3.5" /> {camOn ? "Cam On" : "Cam Off"}
        </span>
      </div>
    </div>
  );
}
