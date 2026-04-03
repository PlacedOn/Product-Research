"use client";

import { motion } from "framer-motion";

import type { PersonaState } from "@/lib/types";

const stateMap: Record<PersonaState, { color: string; label: string; shadow: string }> = {
  idle: {
    color: "#7C8AA0",
    label: "Waiting",
    shadow: "0 0 46px rgba(124,138,160,0.35)",
  },
  listening: {
    color: "#27D782",
    label: "Listening",
    shadow: "0 0 80px rgba(39,215,130,0.45)",
  },
  thinking: {
    color: "#4B8DF8",
    label: "Thinking",
    shadow: "0 0 84px rgba(75,141,248,0.5)",
  },
  speaking: {
    color: "#28C7F5",
    label: "Speaking",
    shadow: "0 0 80px rgba(40,199,245,0.48)",
  },
};

export default function Persona({ state }: { state: PersonaState }) {
  const conf = stateMap[state];

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className="relative flex h-36 w-36 items-center justify-center rounded-full border bg-[#05080f] md:h-44 md:w-44"
        animate={{
          scale: state === "thinking" ? [1, 1.04, 1] : state === "speaking" ? [1, 1.03, 1] : [1, 1.01, 1],
          boxShadow: [conf.shadow, conf.shadow],
        }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        style={{ borderColor: `${conf.color}cc` }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: `radial-gradient(circle at 50% 45%, ${conf.color}22, transparent 70%)` }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        />

        <div className="relative z-10 flex flex-col items-center gap-2 text-center">
          <p className="text-5xl font-semibold leading-none text-emerald-100/85">V</p>
          <div className="flex items-end gap-1">
            {[10, 16, 24, 16].map((bar, idx) => (
              <motion.span
                key={`bar-${idx}`}
                className="w-[3px] rounded-full bg-emerald-300"
                animate={{ height: [6, bar, 8] }}
                transition={{ repeat: Infinity, duration: 1.1, delay: idx * 0.12, ease: "easeInOut" }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <p className="text-xs font-medium uppercase tracking-[0.45em] text-emerald-300/90">{conf.label}</p>
    </div>
  );
}
