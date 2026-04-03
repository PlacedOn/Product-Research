"use client";

import { motion } from "framer-motion";

export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.95, 1, 0.95] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(42% 38% at 50% 42%, rgba(99,102,241,0.28), rgba(34,197,94,0.08) 45%, transparent 80%)",
        }}
      />
      <div className="noise-overlay" />
    </div>
  );
}
