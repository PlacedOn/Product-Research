"use client";

import { motion } from "framer-motion";

import type { PersonaState } from "@/lib/types";

const stateMap: Record<PersonaState, { color: string; label: string; hint: string; shadow: string }> = {
  idle: {
    color: "#7C8AA0",
    label: "Waiting",
    hint: "Preparing your next role-aligned question.",
    shadow: "0 0 46px rgba(124,138,160,0.35)",
  },
  listening: {
    color: "#27D782",
    label: "Listening",
    hint: "I am capturing your answer and key decisions.",
    shadow: "0 0 80px rgba(39,215,130,0.45)",
  },
  thinking: {
    color: "#4B8DF8",
    label: "Thinking",
    hint: "Evaluating depth, trade-offs, and technical clarity.",
    shadow: "0 0 84px rgba(75,141,248,0.5)",
  },
  speaking: {
    color: "#28C7F5",
    label: "Speaking",
    hint: "Delivering your next progressive interview question.",
    shadow: "0 0 80px rgba(40,199,245,0.48)",
  },
};

export default function Persona({ state }: { state: PersonaState }) {
  const conf = stateMap[state];
  const isActive = state === "listening" || state === "speaking" || state === "thinking";

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="rounded-full border border-white/15 bg-black/25 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-slate-300">
        Vale Interviewer • Sentinel
      </div>

      <motion.div
        className="relative flex h-36 w-36 items-center justify-center rounded-full border bg-[#05080f] md:h-44 md:w-44"
        animate={{
          scale: state === "thinking" ? [1, 1.05, 1] : state === "speaking" ? [1, 1.035, 1] : [1, 1.01, 1],
          boxShadow: [conf.shadow, conf.shadow],
        }}
        transition={{ repeat: Infinity, duration: 1.45, ease: "easeInOut" }}
        style={{ borderColor: `${conf.color}cc` }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: `radial-gradient(circle at 50% 45%, ${conf.color}22, transparent 70%)` }}
          animate={{ opacity: [0.35, 0.82, 0.35] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute -inset-2 rounded-full border"
          style={{ borderColor: `${conf.color}33` }}
          animate={{ opacity: isActive ? [0.25, 0.9, 0.25] : [0.2, 0.35, 0.2], scale: [1, 1.06, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        />

        <div className="relative z-10 flex flex-col items-center gap-2 text-center">
          <p className="text-5xl font-semibold leading-none text-emerald-100/85">V</p>
          <div className="flex items-end gap-1">
            {[10, 16, 24, 16].map((bar, idx) => (
              <motion.span
                key={`bar-${idx}`}
                className="w-[3px] rounded-full bg-emerald-300"
                animate={{ height: state === "idle" ? [6, 8, 6] : [6, bar, 8] }}
                transition={{ repeat: Infinity, duration: 1.1, delay: idx * 0.12, ease: "easeInOut" }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.4em] text-emerald-300/90">{conf.label}</p>
        <p className="max-w-[340px] text-xs leading-relaxed text-slate-300">{conf.hint}</p>
      </div>
    </div>
  );
}
