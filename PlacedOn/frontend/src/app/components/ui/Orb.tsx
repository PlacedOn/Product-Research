import { motion } from "motion/react";

interface OrbProps {
  color?: string;
  size?: number;
  opacity?: number;
  blur?: number;
  className?: string;
  duration?: number;
}

export function Orb({
  color = "#3E63F5",
  size = 400,
  opacity = 0.3,
  blur = 100,
  className = "",
  duration = 15,
}: OrbProps) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        opacity: [opacity * 0.8, opacity, opacity * 0.8],
        rotate: [0, 5, -5, 0],
        x: [0, 10, -10, 0],
        y: [0, -10, 10, 0],
      }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        filter: `blur(${blur}px)`,
        opacity,
      }}
    />
  );
}
