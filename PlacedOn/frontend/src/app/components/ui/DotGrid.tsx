interface DotGridProps {
  color?: string;
  size?: number;
  spacing?: number;
  opacity?: number;
  className?: string;
}

export function DotGrid({
  color = "#1F2430",
  size = 1.5,
  spacing = 24,
  opacity = 0.08,
  className = "",
}: DotGridProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle at ${size}px ${size}px, ${color} ${size}px, transparent 0)`,
        backgroundSize: `${spacing}px ${spacing}px`,
        opacity,
      }}
    />
  );
}
