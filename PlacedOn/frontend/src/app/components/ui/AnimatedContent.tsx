import { ReactNode } from "react";
import { motion } from "motion/react";

interface AnimatedContentProps {
  children: ReactNode;
  distance?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
  config?: { tension: number; friction: number };
  initialOpacity?: number;
  animateOpacity?: number;
  scale?: number;
  threshold?: number;
  delay?: number;
  className?: string;
}

export function AnimatedContent({
  children,
  distance = 20,
  direction = "vertical",
  reverse = false,
  initialOpacity = 0,
  animateOpacity = 1,
  scale = 1,
  delay = 0,
  className = "",
}: AnimatedContentProps) {
  const y = direction === "vertical" ? (reverse ? -distance : distance) : 0;
  const x = direction === "horizontal" ? (reverse ? -distance : distance) : 0;

  return (
    <motion.div
      initial={{ opacity: initialOpacity, y, x, scale }}
      animate={{ opacity: animateOpacity, y: 0, x: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, type: "spring", bounce: 0.4 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
