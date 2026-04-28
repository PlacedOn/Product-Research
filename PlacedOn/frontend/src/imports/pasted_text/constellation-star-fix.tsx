Prompt 1: Fix Clicking With Large Stable Hit Targets

  Fix the constellation click bug caused by the repel interaction.

  Root cause:
  The star button is only as large as the tiny 8-12px visual core, and repel moves that tiny click target away from the cursor. Make each star have a large invisible hit area while keeping the visible star small.

  Implementation requirements:
  - Each star button must have a fixed 52px x 52px clickable hit target.
  - The visible dot/glow stays centered inside that 52px target.
  - The label stays centered under the star.
  - The glow and label remain pointer-events-none.
  - The button itself must receive clicks.
  - Use onPointerDown or onClick to select the trait.
  - Stop propagation on the star button so the sky pointer handlers do not interfere with click selection.
  - When a star is hovered, focused, selected, or pointer-down, freeze its repel offset to { x: 0, y: 0 } so it does not run away while being clicked.
  - Keep the repel movement for nearby non-hovered stars.

  Do not remove the repel effect. Make it click-safe.

  Use this code shape for ConstellationStar:

  function ConstellationStar({
    star,
    selected,
    hovered,
    onHover,
    onLeave,
    onSelect,
    offset,
  }: {
    star: StarPoint;
    selected: boolean;
    hovered: boolean;
    onHover: () => void;
    onLeave: () => void;
    onSelect: () => void;
    offset: { x: number; y: number };
  }) {
    const reduceMotion = useReducedMotion();
    const color = star.family === "technical" ? TECH_COLOR : WARM_COLOR;
    const haloOpacity = selected ? Math.min(1, star.glowOpacity + 0.25) : star.glowOpacity;
    const haloSize = selected ? star.glowRadius + 18 : star.glowRadius;

    return (
      <motion.button
        type="button"
        style={{
          left: `${star.x}%`,
          top: `${star.y}%`,
          width: 52,
          height: 52,
        }}
        className="
          absolute -translate-x-1/2 -translate-y-1/2
          flex items-center justify-center rounded-full
          pointer-events-auto touch-manipulation
          focus:outline-none focus-visible:ring-2
          focus-visible:ring-offset-2 focus-visible:ring-[#3E63F5]/40
        "
        animate={{ x: offset.x, y: offset.y }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 150, damping: 20, mass: 0.35 }
        }
        onPointerEnter={onHover}
        onPointerLeave={onLeave}
        onFocus={onHover}
        onBlur={onLeave}
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        aria-label={`${star.dim.dimension}, ${getSignalBand(star.dim.score).toLowerCase()} signal, ${getConfidenceBand(star.dim.confidence).toLowerCase()} confidence. Open trait details.`}
        aria-pressed={selected}
      >
        <span
          aria-hidden
          className="absolute rounded-full pointer-events-none"
          style={{
            width: haloSize,
            height: haloSize,
            opacity: haloOpacity,
            background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
          }}
        />

        {star.isGap ? (
          <span
            className="relative rounded-full bg-[#FFFCF6] pointer-events-none"
            style={{
              width: star.coreSize,
              height: star.coreSize,
              border: `1.5px dashed ${color}`,
            }}
          />
        ) : (
          <span
            className="relative rounded-full pointer-events-none"
            style={{
              width: star.coreSize,
              height: star.coreSize,
              background: color,
              boxShadow: selected ? `0 0 14px ${color}` : `0 0 6px ${color}`,
            }}
          />
        )}

        <span
          className={`
            absolute top-[44px] left-1/2 -translate-x-1/2
            whitespace-nowrap text-[11px] font-bold pointer-events-none
            transition-opacity
            ${selected || hovered ? "opacity-90 text-[#1F2430]" : "opacity-45 text-[#1F2430]/80"}
          `}
        >
          {star.dim.dimension}
        </span>
      </motion.button>
    );
  }

  Then update the parent:

  const [hoveredTrait, setHoveredTrait] = useState<string | null>(null);

  function getStarOffset(star: StarPoint, idx: number): { x: number; y: number } {
    if (
      reduceMotion ||
      !pointer ||
      idx === selectedIdx ||
      hoveredTrait === star.dim.dimension
    ) {
      return { x: 0, y: 0 };
    }

    // existing repel logic here
  }

  And render:

  <ConstellationStar
    key={s.dim.dimension}
    star={s}
    selected={i === selectedIdx}
    hovered={hoveredTrait === s.dim.dimension}
    offset={getStarOffset(s, i)}
    onHover={() => setHoveredTrait(s.dim.dimension)}
    onLeave={() => setHoveredTrait(null)}
    onSelect={() => onSelectTrait(s.dim)}
  />

