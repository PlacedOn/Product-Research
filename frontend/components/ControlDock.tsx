"use client";

import { Camera, Hand, Mic, PhoneOff } from "lucide-react";

interface Props {
  micOn: boolean;
  camOn: boolean;
  ttsVoices: string[];
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onPushToTalk: () => void;
  onEnd: () => void;
}

export default function ControlDock({
  micOn,
  camOn,
  ttsVoices,
  selectedVoice,
  onVoiceChange,
  onToggleMic,
  onToggleCam,
  onPushToTalk,
  onEnd,
}: Props) {
  return (
    <div className="rounded-[1.8rem] border border-white/20 bg-[#212832]/82 px-3 py-2.5 shadow-[0_18px_46px_rgba(0,0,0,0.42)] backdrop-blur-xl md:px-3.5">
      {ttsVoices.length > 0 ? (
        <div className="mb-2 flex items-center justify-center gap-2">
          <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-slate-300">Voice</span>
          <select
            value={selectedVoice}
            onChange={(event) => onVoiceChange(event.target.value)}
            className="max-w-[170px] rounded-md border border-white/15 bg-black/30 px-2 py-1 text-[10px] text-slate-200 outline-none transition focus:border-sky-300/40"
          >
            {ttsVoices.map((voice) => (
              <option key={voice} value={voice} className="bg-slate-900">
                {voice}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="flex items-center gap-2 md:gap-2.5">
        <button
          onClick={onToggleMic}
          className={`flex min-w-[72px] flex-col items-center gap-0.5 rounded-xl border px-2.5 py-2 text-[9px] font-medium uppercase tracking-[0.1em] transition md:min-w-[76px] ${
            micOn
              ? "border-emerald-300/20 bg-emerald-500/15 text-emerald-200"
              : "border-white/10 bg-slate-700/50 text-slate-300"
          }`}
        >
          <Mic className="h-3.5 w-3.5" />
          {micOn ? "Mic On" : "Muted"}
        </button>

        <button
          onClick={onPushToTalk}
          className="flex min-w-[126px] flex-col items-center gap-0.5 rounded-full border border-indigo-100/35 bg-gradient-to-b from-indigo-100/85 to-slate-300 px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.11em] text-slate-900 shadow-[0_8px_24px_rgba(148,163,184,0.23)] transition hover:from-indigo-50 hover:to-slate-200 md:min-w-[140px]"
        >
          <Hand className="h-3.5 w-3.5" />
          Push To Talk
        </button>

        <button
          onClick={onToggleCam}
          className={`flex min-w-[72px] flex-col items-center gap-0.5 rounded-xl border px-2.5 py-2 text-[9px] font-medium uppercase tracking-[0.1em] transition md:min-w-[76px] ${
            camOn ? "border-sky-300/20 bg-sky-500/15 text-sky-200" : "border-white/10 bg-slate-700/50 text-slate-300"
          }`}
        >
          <Camera className="h-3.5 w-3.5" />
          {camOn ? "Cam On" : "Cam Off"}
        </button>

        <button
          onClick={onEnd}
          className="flex min-w-[72px] flex-col items-center gap-0.5 rounded-xl border border-rose-300/20 bg-rose-500/15 px-2.5 py-2 text-[9px] font-medium uppercase tracking-[0.1em] text-rose-200 transition hover:bg-rose-500/25 md:min-w-[76px]"
        >
          <PhoneOff className="h-3.5 w-3.5" />
          Leave
        </button>
      </div>
    </div>
  );
}
