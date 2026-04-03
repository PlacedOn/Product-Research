"use client";

import { Camera, Hand, Mic, PhoneOff } from "lucide-react";

interface Props {
  micOn: boolean;
  camOn: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onPushToTalk: () => void;
  onEnd: () => void;
}

export default function ControlDock({ micOn, camOn, onToggleMic, onToggleCam, onPushToTalk, onEnd }: Props) {
  return (
    <div className="rounded-[2.2rem] border border-white/15 bg-[#2a2f37]/88 px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="flex items-end gap-2 md:gap-4">
        <button
          onClick={onToggleMic}
          className={`flex min-w-[62px] flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] uppercase tracking-[0.08em] transition ${
            micOn ? "bg-emerald-500/20 text-emerald-200" : "bg-slate-700/60 text-slate-300"
          }`}
        >
          <Mic className="h-4 w-4" />
          Mute
        </button>

        <button
          onClick={onPushToTalk}
          className="flex min-w-[88px] flex-col items-center gap-1 rounded-full border border-indigo-200/25 bg-gradient-to-b from-indigo-200/80 to-slate-400 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-900"
        >
          <Hand className="h-4 w-4" />
          Push To Talk
        </button>

        <button
          onClick={onToggleCam}
          className={`flex min-w-[62px] flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] uppercase tracking-[0.08em] transition ${
            camOn ? "bg-sky-500/20 text-sky-200" : "bg-slate-700/60 text-slate-300"
          }`}
        >
          <Camera className="h-4 w-4" />
          Camera
        </button>

        <button
          onClick={onEnd}
          className="flex min-w-[62px] flex-col items-center gap-1 rounded-xl bg-red-500/15 px-2 py-2 text-[10px] uppercase tracking-[0.08em] text-red-200 transition hover:bg-red-500/25"
        >
          <PhoneOff className="h-4 w-4" />
          Leave
        </button>
      </div>
    </div>
  );
}
