import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  Sparkles, Lock, ShieldCheck, CheckCircle2, Share2, Clock, Loader2,
  AlertCircle, X, GraduationCap, Briefcase, Eye, RefreshCw, FileText,
  Target, Info, Star, ChevronRight
} from "lucide-react";
import { AnimatedContent } from "./ui/AnimatedContent";
import { demoApi, type HCVResponse, type EvidenceDimension, getDemoModeActive } from "../lib/demoApi";
import { toast } from "sonner";

// Identity (kept stable per product intent)
const IDENTITY = {
  name: "Aisha Sharma",
  target_role: "Frontend Engineer",
  location: "Bengaluru, India",
};

const PROFILE_DATA = {
  role_alignment: {
    primary_fit: "Frontend Engineer",
    fit_label: "Strong Signal Match",
    adjacent_roles: ["UI Engineer", "Product Engineer", "Design Engineer"],
  },
  achievements_and_education: [
    {
      type: "Education" as const,
      title: "B.Tech, Computer Science",
      source: "RV College of Engineering",
      verification: "Self-Reported" as const,
    },
    {
      type: "Experience" as const,
      title: "Frontend Intern",
      source: "Early-stage startup",
      verification: "Signal Verified" as const,
    },
  ],
};

function shortenToSentences(text: string, max = 2): string {
  const parts = text.match(/[^.!?]+[.!?]+(\s|$)/g);
  if (!parts) return text;
  return parts.slice(0, max).join("").trim();
}

// ---------- Signal helpers (one source of truth) ----------
type SignalBand = "Strong" | "Moderate" | "Needs more evidence";
type ConfidenceBand = "High" | "Moderate" | "Low";
type TraitFamily = "behavioral" | "technical";

function getSignalBand(score: number): SignalBand {
  if (score >= 0.8) return "Strong";
  if (score >= 0.6) return "Moderate";
  return "Needs more evidence";
}

function getConfidenceBand(confidence: number): ConfidenceBand {
  if (confidence >= 0.85) return "High";
  if (confidence >= 0.7) return "Moderate";
  return "Low";
}

function isGapTrait(dim: EvidenceDimension) {
  return dim.confidence < 0.7 || dim.score < 0.55 || dim.evidence_snippets.length === 0;
}

function getTraitFamily(name: string): TraitFamily {
  const technicalWords = [
    "react", "typescript", "component", "state", "debug", "api",
    "testing", "performance", "system", "frontend", "architecture",
    "technical", "execution", "problem", "engineering", "code",
  ];
  const normalized = name.toLowerCase();
  return technicalWords.some((word) => normalized.includes(word)) ? "technical" : "behavioral";
}

function getTraitSentence(dim: EvidenceDimension) {
  const signal = getSignalBand(dim.score).toLowerCase();
  const confidence = getConfidenceBand(dim.confidence).toLowerCase();
  if (isGapTrait(dim)) {
    return `PlacedOn needs more interview evidence before presenting ${dim.dimension} as a confident signal.`;
  }
  return `${dim.dimension} shows up as a ${signal} signal with ${confidence} confidence, based on observed interview behavior.`;
}

const TECH_COLOR = "#3E63F5"; // cool blue
const WARM_COLOR = "#F59E0B"; // warm gold

// ---------- Constellation positioning ----------
const TRAIT_POSITIONS: Record<string, { x: number; y: number }> = {
  "Component Architecture": { x: 21, y: 32 },
  "Debugging Approach": { x: 42, y: 23 },
  "Product Communication": { x: 66, y: 34 },
  "State Management": { x: 31, y: 58 },
  "Responsive UI": { x: 55, y: 62 },
  "API Integration": { x: 74, y: 54 },
  "Testing Discipline": { x: 22, y: 74 },
  "Performance Optimization": { x: 83, y: 72 },
  "System Design Breadth": { x: 48, y: 79 },
  // Mock HCV defaults
  "Technical Execution": { x: 70, y: 28 },
  "System Design": { x: 82, y: 56 },
  "Problem Solving": { x: 56, y: 70 },
  "Collaboration": { x: 22, y: 40 },
  "Communication": { x: 32, y: 70 },
};

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function getTraitPosition(name: string): { x: number; y: number } {
  if (TRAIT_POSITIONS[name]) return TRAIT_POSITIONS[name];
  const h = hashString(name);
  const family = getTraitFamily(name);
  // Behavioral biased to left half (10–48), technical biased to right (52–90).
  const x = family === "behavioral" ? 12 + (h % 36) : 54 + ((h >> 3) % 36);
  const y = 18 + ((h >> 5) % 64);
  return { x, y };
}

type GraphNode = {
  id: string;
  kind: "candidate" | "trait" | "evidence";
  label: string;
  trait?: EvidenceDimension;
  family?: TraitFamily;
  parentId?: string;
  radius: number;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
};

type GraphEdge = {
  source: string;
  target: string;
  kind: "candidate-trait" | "trait-evidence" | "trait-trait";
  family?: TraitFamily;
};

function buildProfileGraph(dimensions: EvidenceDimension[]): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Circular layout: behavioral on the left semicircle, technical on the right.
  const behavioralDims = dimensions
    .filter((d) => getTraitFamily(d.dimension) === "behavioral")
    .sort((a, b) => a.dimension.localeCompare(b.dimension));
  const technicalDims = dimensions
    .filter((d) => getTraitFamily(d.dimension) === "technical")
    .sort((a, b) => a.dimension.localeCompare(b.dimension));
  const cx = 50;
  const cy = 50;
  const rx = 26;
  const ry = 28;
  const positions = new Map<string, { x: number; y: number }>();
  // Left arc spans from top (-π/2) through left (π) down to bottom (π/2), going counter-clockwise.
  behavioralDims.forEach((dim, i) => {
    const t = behavioralDims.length === 1 ? 0.5 : i / (behavioralDims.length - 1);
    const angle = -Math.PI / 2 - t * Math.PI; // -π/2 → -3π/2 (top → left → bottom)
    positions.set(dim.dimension, { x: cx + Math.cos(angle) * rx, y: cy + Math.sin(angle) * ry });
  });
  // Right arc spans from top through right down to bottom, going clockwise.
  technicalDims.forEach((dim, i) => {
    const t = technicalDims.length === 1 ? 0.5 : i / (technicalDims.length - 1);
    const angle = -Math.PI / 2 + t * Math.PI;
    positions.set(dim.dimension, { x: cx + Math.cos(angle) * rx, y: cy + Math.sin(angle) * ry });
  });
  const ordered = [...behavioralDims, ...technicalDims];

  ordered.forEach((dim) => {
    const family = getTraitFamily(dim.dimension);
    const pos = positions.get(dim.dimension)!;
    const isGap = isGapTrait(dim);

    // Trait node radius scales with score, 6-10px
    const radius = isGap ? 5 : 6 + Math.round(dim.score * 4);

    const traitId = `trait-${dim.dimension.replace(/\s+/g, '-')}`;
    nodes.push({
      id: traitId,
      kind: "trait",
      label: dim.dimension,
      trait: dim,
      family,
      radius,
      x: pos.x,
      y: pos.y,
      baseX: pos.x,
      baseY: pos.y,
    });

  });

  // Add trait-to-trait edges (same family, non-gap, nearest neighbors)
  const traitNodes = nodes.filter((n) => n.kind === "trait");
  traitNodes.forEach((traitA) => {
    if (!traitA.trait || isGapTrait(traitA.trait)) return;

    const candidates = traitNodes
      .filter((traitB) =>
        traitB.id !== traitA.id &&
        traitB.trait &&
        !isGapTrait(traitB.trait) &&
        traitB.family === traitA.family
      )
      .map((traitB) => ({
        node: traitB,
        distance: Math.hypot(traitB.x - traitA.x, traitB.y - traitA.y),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2);

    candidates.forEach(({ node }) => {
      const edgeKey = [traitA.id, node.id].sort().join('-');
      if (!edges.find((e) => [e.source, e.target].sort().join('-') === edgeKey)) {
        edges.push({
          source: traitA.id,
          target: node.id,
          kind: "trait-trait",
          family: traitA.family,
        });
      }
    });
  });

  return { nodes, edges };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function relaxGraphLayout(nodes: GraphNode[], edges: GraphEdge[]): GraphNode[] {
  const out = nodes.map((n) => ({ ...n }));
  const byId = new Map(out.map((n, i) => [n.id, i]));
  const iterations = 120;

  for (let step = 0; step < iterations; step++) {
    const force = out.map(() => ({ x: 0, y: 0 }));

    // All-pairs repulsion (no overlaps)
    for (let i = 0; i < out.length; i++) {
      for (let j = i + 1; j < out.length; j++) {
        const a = out[i];
        const b = out[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let d = Math.max(0.01, Math.hypot(dx, dy));
        const minDist = a.radius + b.radius + 3;

        if (d < minDist) {
          const push = (minDist - d) * 0.04;
          const nx = dx / d;
          const ny = dy / d;
          force[i].x -= nx * push;
          force[i].y -= ny * push;
          force[j].x += nx * push;
          force[j].y += ny * push;
        }
      }
    }

    // Edge spring forces pull connected nodes
    edges.forEach((edge) => {
      const aIndex = byId.get(edge.source);
      const bIndex = byId.get(edge.target);
      if (aIndex == null || bIndex == null) return;

      const a = out[aIndex];
      const b = out[bIndex];
      const desired = edge.kind === "trait-evidence" ? 9 : edge.kind === "candidate-trait" ? 28 : 24;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.max(0.01, Math.hypot(dx, dy));
      const strength = edge.kind === "candidate-trait" ? 0.003 : 0.012;
      const pull = (d - desired) * strength;
      const nx = dx / d;
      const ny = dy / d;

      if (a.kind !== "candidate") {
        force[aIndex].x += nx * pull;
        force[aIndex].y += ny * pull;
      }
      if (b.kind !== "candidate") {
        force[bIndex].x -= nx * pull;
        force[bIndex].y -= ny * pull;
      }
    });

    // Apply forces with bounds
    out.forEach((n, i) => {
      // Candidate stays near center
      if (n.kind === "candidate") {
        force[i].x += (50 - n.x) * 0.08;
        force[i].y += (50 - n.y) * 0.08;
      }

      // Anchor to base position (organic drift from curated spots)
      if (n.kind === "trait") {
        force[i].x += (n.baseX - n.x) * 0.01;
        force[i].y += (n.baseY - n.y) * 0.01;

        // Family clustering
        if (n.family) {
          const familyAnchorX = n.family === "technical" ? 61 : 39;
          force[i].x += (familyAnchorX - n.x) * 0.002;
        }
      }

      // Evidence nodes anchor to their parent
      if (n.kind === "evidence") {
        force[i].x += (n.baseX - n.x) * 0.02;
        force[i].y += (n.baseY - n.y) * 0.02;
      }

      // Apply force and clamp to bounds
      n.x = Math.max(7, Math.min(93, n.x + force[i].x));
      n.y = Math.max(10, Math.min(88, n.y + force[i].y));
    });
  }

  return out;
}

// ---------- Deterministic label placement (Obsidian-style annotations) ----------
type LabelPlacement = "bottom" | "top" | "right" | "left" | "bottom-right" | "bottom-left" | "top-right" | "top-left";

type PlacedLabel = {
  id: string;
  placement: LabelPlacement;
  box: { x: number; y: number; w: number; h: number };
  anchor: "middle" | "start" | "end";
  clean: boolean;
};

const LABEL_PLACEMENTS: Array<{
  placement: LabelPlacement;
  dx: number;
  dy: number;
  anchor: "middle" | "start" | "end";
}> = [
  { placement: "bottom", dx: 0, dy: 20, anchor: "middle" },
];

function boxesOverlap(a: PlacedLabel["box"], b: PlacedLabel["box"]) {
  return !(a.x + a.w < b.x || b.x + b.w < a.x || a.y + a.h < b.y || b.y + b.h < a.y);
}

function estimateLabelWidth(label: string) {
  // Width is in percent units of the sky region; tuned for compact annotations
  return Math.min(38, Math.max(14, label.length * 1.7));
}

function placeGraphLabels(nodes: GraphNode[]): Map<string, PlacedLabel> {
  const placed: PlacedLabel[] = [];
  const traitNodes = nodes
    .filter((n) => n.kind === "trait")
    .sort((a, b) => (b.trait?.score ?? 1) - (a.trait?.score ?? 1));

  // Bounding boxes for all trait blobs (so labels never sit on top of any blob).
  // Trait radii are in px; convert to a % footprint with a small buffer.
  const blobBoxes = traitNodes.map((n) => {
    const rPct = (n.radius + 2) / 4.2;
    return { x: n.x - rPct, y: n.y - rPct, w: rPct * 2, h: rPct * 2 };
  });

  for (const node of traitNodes) {
    const w = estimateLabelWidth(node.label);
    const h = 4; // % height for a single line of 11px text
    let chosen: PlacedLabel | null = null;

    for (const option of LABEL_PLACEMENTS) {
      const box = {
        x: node.x + option.dx * 0.18 - (option.anchor === "middle" ? w / 2 : option.anchor === "end" ? w : 0),
        y: node.y + option.dy * 0.22 - h / 2,
        w,
        h,
      };
      const insideBounds = box.x >= 1 && box.y >= 2 && box.x + box.w <= 99 && box.y + box.h <= 96;
      const collidesWithLabel = placed.some((p) => boxesOverlap(box, p.box));
      const collidesWithBlob = blobBoxes.some((b) => boxesOverlap(box, b));
      if (insideBounds && !collidesWithLabel && !collidesWithBlob) {
        chosen = { id: node.id, placement: option.placement, box, anchor: option.anchor, clean: true };
        break;
      }
    }

    if (!chosen) {
      chosen = {
        id: node.id,
        placement: "bottom",
        box: {
          x: Math.max(1, Math.min(99 - w, node.x - w / 2)),
          y: Math.max(2, Math.min(96 - h, node.y + 4)),
          w,
          h,
        },
        anchor: "middle",
        clean: false,
      };
    }
    placed.push(chosen);
  }

  return new Map(placed.map((p) => [p.id, p]));
}

function GraphNodeComponent({
  node,
  selected,
  hovered,
  inNeighborhood,
  faded,
  onHover,
  onLeave,
  onSelect,
  offset,
}: {
  node: GraphNode;
  selected: boolean;
  hovered: boolean;
  inNeighborhood: boolean;
  faded: boolean;
  onHover: () => void;
  onLeave: () => void;
  onSelect: () => void;
  offset: { x: number; y: number };
}) {
  const reduceMotion = useReducedMotion();

  // Candidate node (center) - non-interactive
  if (node.kind === "candidate") {
    return (
      <div
        style={{
          left: `${node.x}%`,
          top: `${node.y}%`,
        }}
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      >
        <div
          className="rounded-full bg-white border-2 border-[#1F2430]/15 flex items-center justify-center font-[Manrope,sans-serif] font-extrabold text-[#1F2430] text-[9px]"
          style={{ width: node.radius * 2, height: node.radius * 2 }}
        >
          {node.label}
        </div>
      </div>
    );
  }

  // Evidence node (small gray dots) - clickable, selects parent
  if (node.kind === "evidence") {
    const isActive = selected || hovered || inNeighborhood;
    const dotOpacity = faded ? 0.15 : isActive ? 0.7 : 0.4;
    const dotColor = isActive ? "#6B7280" : "#9CA3AF";

    return (
      <motion.button
        type="button"
        style={{
          left: `${node.x}%`,
          top: `${node.y}%`,
          width: 44,
          height: 44,
        }}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center pointer-events-auto touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#3E63F5]/40"
        animate={{ x: offset.x, y: offset.y, opacity: dotOpacity }}
        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 150, damping: 20, mass: 0.35, opacity: { duration: 0.25 } }}
        onPointerEnter={onHover}
        onPointerLeave={onLeave}
        onFocus={onHover}
        onBlur={onLeave}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        aria-label="Evidence node, click to view parent trait"
      >
        <div
          className="rounded-full pointer-events-none"
          style={{
            width: node.radius * 2,
            height: node.radius * 2,
            background: dotColor,
            boxShadow: isActive ? `0 0 4px ${dotColor}` : 'none',
          }}
        />
      </motion.button>
    );
  }

  // Trait node
  const trait = node.trait!;
  const family = node.family!;
  const isGap = isGapTrait(trait);
  const color = family === "technical" ? TECH_COLOR : WARM_COLOR;
  const isActive = selected || hovered;

  // Brightness scales with score, base opacity with confidence
  const brightness = 0.6 + trait.score * 0.4; // 0.6..1.0
  const baseOpacity = trait.confidence;
  const nodeOpacity = faded ? Math.min(baseOpacity, 0.25) : inNeighborhood ? baseOpacity : baseOpacity;

  // Glow for active nodes
  const glowRadius = node.radius * 2 + (isActive ? 16 : 10);
  const glowOpacity = isActive ? 0.45 : inNeighborhood ? 0.2 : 0.1;

  return (
    <motion.button
      type="button"
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
        width: 44,
        height: 44,
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center pointer-events-auto touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#3E63F5]/40"
      animate={{ x: offset.x, y: offset.y, opacity: nodeOpacity }}
      transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 150, damping: 20, mass: 0.35, opacity: { duration: 0.25 } }}
      onPointerEnter={onHover}
      onPointerLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      aria-label={`${trait.dimension}, ${getSignalBand(trait.score).toLowerCase()} signal, ${getConfidenceBand(trait.confidence).toLowerCase()} confidence. Open trait details.`}
      aria-pressed={selected}
    >
      {/* Glow halo */}
      <span
        aria-hidden
        className="absolute rounded-full pointer-events-none transition-all duration-300"
        style={{
          width: glowRadius,
          height: glowRadius,
          opacity: glowOpacity,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
      />
      {/* Core node */}
      {isGap ? (
        <span
          className="relative rounded-full bg-[#FFFCF6] pointer-events-none transition-all duration-300"
          style={{
            width: node.radius * 2,
            height: node.radius * 2,
            border: `1.5px dashed #9CA3AF`,
            filter: `brightness(${brightness})`,
            boxShadow: isActive ? `0 0 12px #9CA3AF` : 'none',
          }}
        />
      ) : (
        <motion.span
          className="relative rounded-full pointer-events-none transition-all duration-300"
          style={{
            width: node.radius * 2,
            height: node.radius * 2,
            background: color,
            filter: `brightness(${brightness})`,
            boxShadow: isActive ? `0 0 12px ${color}` : `0 0 4px ${color}`,
          }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: isActive ? 1 : [0.85, 1, 0.85] }}
          transition={reduceMotion ? { duration: 0 } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </motion.button>
  );
}

interface ProfileConstellationProps {
  dimensions: EvidenceDimension[];
  selectedTrait: EvidenceDimension | null;
  onSelectTrait: (trait: EvidenceDimension) => void;
}

export function ProfileConstellation({ dimensions, selectedTrait, onSelectTrait }: ProfileConstellationProps) {
  const { nodes: rawNodes, edges: rawEdges } = useMemo(() => buildProfileGraph(dimensions), [dimensions]);
  const nodes = useMemo(() => relaxGraphLayout(rawNodes, rawEdges), [rawNodes, rawEdges]);
  const edges = rawEdges;
  const labelMap = useMemo(() => placeGraphLabels(nodes), [nodes]);

  // Auto-center: shift the graph so the trait-node bounding box is centered
  // inside the sky region (so left/right gaps and top/bottom gaps match).
  const centerOffset = useMemo(() => {
    const traits = nodes.filter((n) => n.kind === "trait");
    if (traits.length === 0) return { x: 0, y: 0 };
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const n of traits) {
      const r = n.radius / 4.2; // approx px→% footprint
      if (n.x - r < minX) minX = n.x - r;
      if (n.x + r > maxX) maxX = n.x + r;
      if (n.y - r < minY) minY = n.y - r;
      if (n.y + r > maxY) maxY = n.y + r;
    }
    return { x: 50 - (minX + maxX) / 2, y: 50 - (minY + maxY) / 2 };
  }, [nodes]);

  const selectedNodeId = selectedTrait
    ? `trait-${selectedTrait.dimension.replace(/\s+/g, '-')}`
    : null;

  const reduceMotion = useReducedMotion();
  const skyRef = useRef<HTMLDivElement | null>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [interactive, setInteractive] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ x: number; y: number; pan: { x: number; y: number } } | null>(null);
  const ZOOM_MIN = 0.55;
  const ZOOM_MAX = 2.5;
  const clampZoom = (z: number) => Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z));

  // Attach a non-passive wheel listener so we can preventDefault when interactive.
  useEffect(() => {
    const el = skyRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (!interactive) return;
      e.preventDefault();
      const delta = -e.deltaY * 0.0015;
      setZoom((z) => clampZoom(z + delta * z));
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [interactive]);

  // When leaving interactive mode, smoothly revert to the centered default view.
  useEffect(() => {
    if (!interactive) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [interactive]);

  // Escape, or a click outside both the sky AND any open drawer, exits interactive mode.
  // The first click that dismisses the trait drawer is ignored so the graph stays interactive;
  // a subsequent click outside the sky then deactivates it.
  useEffect(() => {
    if (!interactive) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (skyRef.current && target && skyRef.current.contains(target)) return;
      const drawerOpen = !!document.querySelector('[role="dialog"][aria-modal="true"]');
      if (drawerOpen) return;
      setInteractive(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInteractive(false);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [interactive]);

  // Label LOD: rank traits by score so strongest reveal first.
  const labelThresholds = useMemo(() => {
    const traits = nodes.filter((n) => n.kind === "trait");
    const ranked = [...traits].sort((a, b) => (b.trait?.score ?? 0) - (a.trait?.score ?? 0));
    const N = Math.max(1, ranked.length - 1);
    const map = new Map<string, number>();
    ranked.forEach((n, i) => {
      // strongest visible at 0.65, weakest at ~1.55
      map.set(n.id, 0.65 + (i / N) * 0.9);
    });
    return map;
  }, [nodes]);

  // Build a node map for quick lookup
  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  // Helper to find parent trait for evidence nodes
  const findParentTrait = (node: GraphNode): EvidenceDimension | null => {
    if (node.kind === "trait") return node.trait ?? null;
    if (node.kind === "evidence" && node.parentId) {
      const parent = nodeById.get(node.parentId);
      return parent?.trait ?? null;
    }
    return null;
  };

  // Determine which nodes are in the active neighborhood (selected OR hovered)
  const activeNodeId = selectedNodeId ?? hoveredNodeId;
  const neighborhood = useMemo(() => {
    const inNeighborhood = new Set<string>();
    if (activeNodeId) {
      inNeighborhood.add(activeNodeId);
      // Add all connected nodes
      edges.forEach((edge) => {
        if (edge.source === activeNodeId) inNeighborhood.add(edge.target);
        if (edge.target === activeNodeId) inNeighborhood.add(edge.source);
      });
    }
    return inNeighborhood;
  }, [activeNodeId, edges]);

  function getNodeOffset(node: GraphNode): { x: number; y: number } {
    // Freeze hovered, selected, or candidate nodes
    if (
      reduceMotion ||
      !pointer ||
      node.kind === "candidate" ||
      node.id === selectedNodeId ||
      node.id === hoveredNodeId
    ) {
      return { x: 0, y: 0 };
    }

    const nodePx = (node.x / 100) * pointer.w;
    const nodePy = (node.y / 100) * pointer.h;
    const dx = nodePx - pointer.x;
    const dy = nodePy - pointer.y;
    const distance = Math.hypot(dx, dy);
    const RADIUS = 120;

    if (distance >= RADIUS || distance < 0.5) return { x: 0, y: 0 };

    // Subtle repel, max 8-10px movement
    const force = (1 - distance / RADIUS) * 8;
    const isGap = node.trait && isGapTrait(node.trait);
    const gapBoost = isGap ? 1.1 : 1;
    const magnitude = force * gapBoost;

    return {
      x: clamp((dx / distance) * magnitude, -10, 10),
      y: clamp((dy / distance) * magnitude, -10, 10),
    };
  }

  // Sparse background dots — deterministic so no layout shift
  const bgDots = useMemo(() => {
    const out: Array<{ x: number; y: number; r: number }> = [];
    let h = 7;
    for (let i = 0; i < 30; i++) {
      h = (h * 1103515245 + 12345) & 0x7fffffff;
      out.push({
        x: (h % 1000) / 10,
        y: ((h >> 7) % 1000) / 10,
        r: 0.4 + ((h >> 13) % 10) / 20,
      });
    }
    return out;
  }, []);

  return (
    <section
      aria-label="Your evidence graph"
      className="relative w-full rounded-[1.75rem] overflow-hidden"
      style={{
        background: "#F3F2F0",
        border: "1px solid rgba(31,36,48,0.08)",
        minHeight: 560,
        height: "70vh",
        maxHeight: 720,
      }}
    >
      {/* Slim title block */}
      <div className="px-6 sm:px-8 pt-7 pb-2 relative z-10">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1F2430]/45">
          <Sparkles className="w-3.5 h-3.5" /> Profile
        </div>
        <h2 className="font-[Manrope,sans-serif] text-[22px] sm:text-[26px] font-extrabold text-[#1F2430] tracking-tight mt-1.5 leading-tight">
          Your Evidence Graph
        </h2>
        <p className="text-[13px] sm:text-[14px] text-[#1F2430]/60 font-medium mt-1.5 max-w-2xl leading-relaxed">
          Each node is a trait inferred from interview behavior. Small dots show supporting evidence.
        </p>
      </div>

      {/* Sky region */}
      <div
        ref={skyRef}
        onPointerLeave={() => setPointer(null)}
        onMouseDown={(e) => {
          if (e.button === 0 && !interactive) {
            // Activate interactive mode on left click; don't toggle off here so the
            // global outside-click handler can manage deactivation.
            setInteractive(true);
          }
        }}
        onContextMenu={(e) => {
          // Suppress browser context menu so right-click can be used for panning.
          e.preventDefault();
        }}
        onPointerDown={(e) => {
          if (e.button === 2) {
            e.preventDefault();
            (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
            panStartRef.current = { x: e.clientX, y: e.clientY, pan: { ...pan } };
            setIsPanning(true);
          }
        }}
        onPointerMove={(e) => {
          if (isPanning && panStartRef.current) {
            const dx = e.clientX - panStartRef.current.x;
            const dy = e.clientY - panStartRef.current.y;
            setPan({ x: panStartRef.current.pan.x + dx, y: panStartRef.current.pan.y + dy });
            return;
          }
          if (reduceMotion) return;
          const rect = e.currentTarget.getBoundingClientRect();
          setPointer({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            w: rect.width,
            h: rect.height,
          });
        }}
        onPointerUp={(e) => {
          if (isPanning) {
            setIsPanning(false);
            panStartRef.current = null;
            try { (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId); } catch {}
          }
        }}
        onPointerCancel={() => {
          if (isPanning) {
            setIsPanning(false);
            panStartRef.current = null;
          }
        }}
        className={`absolute inset-0 top-[120px] sm:top-[128px] bottom-[88px] sm:bottom-[72px] overflow-hidden transition-shadow ${
          interactive ? "ring-2 ring-[#3E63F5]/30 ring-inset" : ""
        } ${isPanning ? "cursor-grabbing" : interactive ? "cursor-grab" : "cursor-pointer"}`}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) translate(${centerOffset.x}%, ${centerOffset.y}%) scale(${zoom})`,
            transformOrigin: "50% 50%",
            transition: reduceMotion || isPanning ? "none" : "transform 450ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
        {/* Sparse background dots */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
          {bgDots.map((d, i) => (
            <circle key={i} cx={`${d.x}%`} cy={`${d.y}%`} r={d.r} fill="#1F2430" fillOpacity={0.04} />
          ))}

          {/* Graph edges */}
          {edges.map((edge, i) => {
            const sourceNode = nodes.find((n) => n.id === edge.source);
            const targetNode = nodes.find((n) => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            // Edge is "hot" if either endpoint is selected/hovered
            const isHot = activeNodeId && (edge.source === activeNodeId || edge.target === activeNodeId);
            const isCandidateEdge = edge.kind === "candidate-trait";
            const isEvidenceEdge = edge.kind === "trait-evidence";
            const isTraitEdge = edge.kind === "trait-trait";

            let stroke = "#9CA3AF"; // neutral gray default
            if (isTraitEdge && edge.family) {
              stroke = edge.family === "technical" ? TECH_COLOR : WARM_COLOR;
            } else if (isEvidenceEdge) {
              const parentNode = sourceNode.kind === "trait" ? sourceNode : targetNode;
              stroke = parentNode.family === "technical" ? TECH_COLOR : WARM_COLOR;
            }

            const strokeWidth = isCandidateEdge ? 0.3 : isEvidenceEdge ? 0.5 : 0.6;
            const strokeOpacity = isCandidateEdge
              ? 0.03
              : isEvidenceEdge
              ? (isHot ? 0.35 : 0.06)
              : (isHot ? 0.4 : 0.1);

            return (
              <line
                key={`edge-${i}`}
                x1={`${sourceNode.x}%`}
                y1={`${sourceNode.y}%`}
                x2={`${targetNode.x}%`}
                y2={`${targetNode.y}%`}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeOpacity={strokeOpacity}
                style={{ transition: "stroke-opacity 250ms ease, stroke-width 250ms ease" }}
              />
            );
          })}
        </svg>

        {/* Render all nodes */}
        {nodes.map((node) => {
          const selected = node.id === selectedNodeId;
          const hovered = node.id === hoveredNodeId;
          const inNeighborhood = neighborhood.has(node.id);
          const faded = activeNodeId ? !inNeighborhood : false;

          return (
            <GraphNodeComponent
              key={node.id}
              node={node}
              selected={selected}
              hovered={hovered}
              inNeighborhood={inNeighborhood}
              faded={faded}
              offset={getNodeOffset(node)}
              onHover={() => setHoveredNodeId(node.id)}
              onLeave={() => setHoveredNodeId(null)}
              onSelect={() => {
                const trait = findParentTrait(node);
                if (trait) {
                  onSelectTrait(trait);
                }
              }}
            />
          );
        })}

        {/* Trait label layer — annotations anchored to nodes */}
        {nodes.map((node) => {
          if (node.kind !== "trait") return null;
          const placement = labelMap.get(node.id);
          if (!placement) return null;
          const selected = node.id === selectedNodeId;
          const hovered = node.id === hoveredNodeId;
          const inNeighborhood = neighborhood.has(node.id);
          const isActive = selected || hovered;
          const faded = activeNodeId ? !inNeighborhood : false;
          // If the label has a clean (collision-free) placement, always show it.
          // Otherwise apply Google-Maps-style LOD: stronger traits reveal first as you zoom in.
          const threshold = labelThresholds.get(node.id) ?? 1;
          const lodOpacity = isActive || placement.clean
            ? 1
            : Math.max(0, Math.min(1, (zoom - (threshold - 0.18)) / 0.32));
          if (lodOpacity <= 0.01 && !isActive) return null;
          const baseAlpha = isActive ? 1 : faded ? 0.4 : 0.7;
          const finalOpacity = baseAlpha * lodOpacity;
          const justify =
            placement.anchor === "middle" ? "center" : placement.anchor === "end" ? "flex-end" : "flex-start";
          // Counter-scale text so labels stay readable as the graph zooms.
          const counterScale = 1 / zoom;
          const transformOrigin =
            placement.anchor === "end" ? "100% 50%" : placement.anchor === "start" ? "0% 50%" : "50% 50%";
          return (
            <div
              key={`label-${node.id}`}
              className="absolute pointer-events-none flex"
              style={{
                left: `${placement.box.x}%`,
                top: `${placement.box.y}%`,
                width: `${placement.box.w}%`,
                justifyContent: justify,
                opacity: finalOpacity,
                transition: "opacity 180ms ease",
                color: "#1F2430",
              }}
            >
              <span
                className="whitespace-nowrap overflow-hidden text-ellipsis text-[11px] font-bold leading-none"
                style={{
                  textShadow: "0 1px 4px rgba(255,252,246,0.95), 0 0 6px rgba(255,252,246,0.85)",
                  maxWidth: "100%",
                  transform: `scale(${counterScale})`,
                  transformOrigin,
                }}
              >
                {node.label}
              </span>
            </div>
          );
        })}
        </div>

        {/* Zoom controls */}
      </div>

      {/* Legend */}
      <div className="absolute left-0 right-0 bottom-0 px-6 sm:px-8 py-4 flex flex-wrap items-center gap-x-5 gap-y-2 z-10 bg-gradient-to-t from-[#F3F2F0] via-[#F3F2F0]/90 to-transparent">
        <div className="flex items-center gap-2 text-[11px] sm:text-[12px] font-bold text-[#1F2430]/70">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: WARM_COLOR }} /> Gold = behavioral
        </div>
        <div className="flex items-center gap-2 text-[11px] sm:text-[12px] font-bold text-[#1F2430]/70">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: TECH_COLOR }} /> Blue = technical
        </div>
        <div className="flex items-center gap-2 text-[11px] sm:text-[12px] font-bold text-[#1F2430]/70">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF]" /> Gray = insufficient evidence
        </div>
        <div className="flex items-center gap-2 text-[11px] sm:text-[12px] font-bold text-[#1F2430]/70">
          {interactive ? "Scroll to zoom · Right-click to pan" : "Click to interact"}
        </div>
      </div>
    </section>
  );
}

// ---------- Signal ring (SVG) ----------
// Outer arc = score, inner arc = confidence. Color follows trait family.
function SignalRing({
  score,
  confidence,
  family,
  size = 132,
}: {
  score: number;
  confidence: number;
  family: TraitFamily;
  size?: number;
}) {
  const familyColor = family === "technical" ? TECH_COLOR : WARM_COLOR;
  const stroke = 8;
  const innerStroke = 5;
  const r1 = size / 2 - stroke / 2 - 2;
  const r2 = r1 - stroke - 4;
  const cx = size / 2;
  const cy = size / 2;
  const c1 = 2 * Math.PI * r1;
  const c2 = 2 * Math.PI * r2;
  const scoreClamped = Math.max(0, Math.min(1, score));
  const confidenceClamped = Math.max(0, Math.min(1, confidence));
  const signalLabel = getSignalBand(score);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        {/* Outer track */}
        <circle cx={cx} cy={cy} r={r1} fill="none" stroke="rgba(31,36,48,0.08)" strokeWidth={stroke} />
        {/* Outer arc — score */}
        <circle
          cx={cx}
          cy={cy}
          r={r1}
          fill="none"
          stroke={familyColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${c1 * scoreClamped} ${c1}`}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        {/* Inner track */}
        <circle cx={cx} cy={cy} r={r2} fill="none" stroke="rgba(31,36,48,0.06)" strokeWidth={innerStroke} />
        {/* Inner arc — confidence */}
        <circle
          cx={cx}
          cy={cy}
          r={r2}
          fill="none"
          stroke="#10B981"
          strokeWidth={innerStroke}
          strokeLinecap="round"
          strokeDasharray={`${c2 * confidenceClamped} ${c2}`}
          transform={`rotate(-90 ${cx} ${cy})`}
          opacity={0.85}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1F2430]/45">Signal</div>
        <div className="font-[Manrope,sans-serif] font-extrabold text-[#1F2430] leading-tight text-[15px] mt-0.5">
          {signalLabel}
        </div>
      </div>
    </div>
  );
}

// ---------- Trait Drawer ----------
interface TraitDrawerProps {
  trait: EvidenceDimension | null;
  onClose: () => void;
  onSelectNext?: () => void;
  onSelectPrevious?: () => void;
  onValidate?: (response: "feels_right" | "flag") => void;
  onScheduleRetake?: () => void;
}

function TraitDrawer({
  trait,
  onClose,
  onSelectNext,
  onSelectPrevious,
  onValidate,
  onScheduleRetake,
}: TraitDrawerProps) {
  const reduceMotion = useReducedMotion();
  // Close on Escape
  useEffect(() => {
    if (!trait) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && onSelectNext) onSelectNext();
      else if (e.key === "ArrowLeft" && onSelectPrevious) onSelectPrevious();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [trait, onClose, onSelectNext, onSelectPrevious]);

  return (
    <AnimatePresence>
      {trait && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-[#1F2430]/25 backdrop-blur-[2px]"
          />
          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label={`${trait.dimension} details`}
            initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            transition={reduceMotion ? { duration: 0.15 } : { type: "spring", damping: 30, stiffness: 280 }}
            className="
              fixed z-50 bg-[#FFFCF6] flex flex-col
              shadow-[-12px_0_40px_rgba(30,35,60,0.12)]
              left-0 right-0 bottom-0 max-h-[88vh] rounded-t-[1.5rem]
              sm:left-auto sm:max-h-none sm:rounded-t-none sm:top-0 sm:bottom-0 sm:w-[420px]
            "
          >
            {/* Mobile grab handle */}
            <div className="sm:hidden flex justify-center pt-2.5 pb-1 shrink-0">
              <span className="w-10 h-1.5 rounded-full bg-[#1F2430]/15" />
            </div>

            {/* Header: family chip + nav + close */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#1F2430]/[0.06] shrink-0">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={onSelectPrevious}
                  disabled={!onSelectPrevious}
                  aria-label="Previous trait"
                  className="min-h-[40px] min-w-[40px] rounded-lg flex items-center justify-center text-[#1F2430]/50 hover:text-[#1F2430] hover:bg-[#1F2430]/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={onSelectNext}
                  disabled={!onSelectNext}
                  aria-label="Next trait"
                  className="min-h-[40px] min-w-[40px] rounded-lg flex items-center justify-center text-[#1F2430]/50 hover:text-[#1F2430] hover:bg-[#1F2430]/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#1F2430]/50 hover:text-[#1F2430] hover:bg-[#1F2430]/5 transition-colors"
                aria-label="Close trait details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Swap content per trait without closing the drawer */}
            <AnimatePresence mode="wait">
              <motion.div
                key={trait.dimension}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="flex-1 overflow-y-auto"
              >
                <TraitDrawerBody trait={trait} onScheduleRetake={onScheduleRetake} onValidate={onValidate} />
              </motion.div>
            </AnimatePresence>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function TraitDrawerBody({
  trait,
  onScheduleRetake,
  onValidate,
}: {
  trait: EvidenceDimension;
  onScheduleRetake?: () => void;
  onValidate?: (response: "feels_right" | "flag") => void;
}) {
  const family = getTraitFamily(trait.dimension);
  const familyColor = family === "technical" ? TECH_COLOR : WARM_COLOR;
  const familyTint = family === "technical" ? "rgba(62,99,245,0.08)" : "rgba(245,158,11,0.10)";
  const familyText = family === "technical" ? "#3349B0" : "#8A5A0B";
  const gap = isGapTrait(trait);
  const signalLabel = getSignalBand(trait.score);
  const confidenceLabel = getConfidenceBand(trait.confidence);

  return (
    <div className="px-5 py-5 flex flex-col gap-5">
      {/* 1. Trait name + 2. family chip */}
      <div className="flex flex-col gap-2.5">
        <span
          className="self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
          style={{ background: familyTint, color: familyText }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: familyColor }} />
          {family === "technical" ? "Technical" : "Behavioral"}
        </span>
        <h3 className="font-[Manrope,sans-serif] text-[22px] font-extrabold text-[#1F2430] tracking-tight leading-tight">
          {trait.dimension}
        </h3>
        {gap && (
          <div className="inline-flex self-start items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F59E0B]/10 text-[#A46500] text-[11px] font-bold uppercase tracking-wider">
            <Info className="w-3 h-3" /> Needs more evidence
          </div>
        )}
      </div>

      {/* 3. Signal ring + 4. labels */}
      <div className="flex items-center gap-5">
        <SignalRing score={trait.score} confidence={trait.confidence} family={family} />
        <div className="flex flex-col gap-3 min-w-0">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1F2430]/45">Signal</div>
            <div className="font-[Manrope,sans-serif] font-extrabold text-[#1F2430] text-[16px] leading-tight">
              {signalLabel}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1F2430]/45">Confidence</div>
            <div className="font-[Manrope,sans-serif] font-extrabold text-[#1F2430] text-[16px] leading-tight">
              {confidenceLabel}
            </div>
          </div>
        </div>
      </div>

      {/* 5. How this shows up */}
      <div className="rounded-xl bg-white border border-[#1F2430]/[0.06] p-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1F2430]/45 mb-1.5">
          How this shows up
        </div>
        <p className="text-[14px] text-[#1F2430]/80 font-medium leading-relaxed">
          {getTraitSentence(trait)}
        </p>
      </div>

      {/* 6. Evidence */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1F2430]/45 mb-2">
          Evidence
        </div>
        {trait.evidence_snippets.length === 0 ? (
          <p className="text-[13px] text-[#1F2430]/55 italic">No direct evidence captured yet.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {trait.evidence_snippets.map((s, i) => (
              <div
                key={i}
                className="rounded-xl bg-white border border-[#1F2430]/[0.06] p-3 text-[13px] text-[#1F2430]/80 font-medium leading-relaxed"
              >
                <span className="text-[#1F2430]/30 mr-1">"</span>
                {s}
                <span className="text-[#1F2430]/30 ml-1">"</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. Gap CTA — only when isGapTrait */}
      {gap && (
        <div className="rounded-xl bg-[#F59E0B]/8 border border-[#F59E0B]/20 p-4 flex flex-col gap-3">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#A46500] mt-0.5 shrink-0" />
            <p className="text-[13px] text-[#1F2430]/80 font-medium leading-relaxed">
              More interview evidence can strengthen this signal.
            </p>
          </div>
          <button
            type="button"
            onClick={onScheduleRetake}
            className="self-start min-h-[44px] px-4 rounded-xl bg-[#1F2430] text-white text-[13px] font-bold hover:bg-[#1F2430]/90 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Schedule a retake
          </button>
        </div>
      )}

      {/* Subtle metadata (raw decimals only as secondary) */}
      <div className="text-[11px] text-[#1F2430]/40 font-medium flex items-center gap-3 pt-1 border-t border-[#1F2430]/[0.05]">
        <span>Score {trait.score.toFixed(2)}</span>
        <span>·</span>
        <span>Confidence {Math.round(trait.confidence * 100)}%</span>
        <span>·</span>
        <span>Uncertainty {Math.round(trait.uncertainty * 100)}%</span>
      </div>

      {/* 8. Validation footer */}
      <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => onValidate?.("feels_right")}
          className="flex-1 min-h-[44px] px-4 rounded-xl bg-[#10B981] text-white text-[14px] font-bold hover:bg-[#0E9E70] transition-colors inline-flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" /> This feels right
        </button>
        <button
          type="button"
          onClick={() => onValidate?.("flag")}
          className="flex-1 min-h-[44px] px-4 rounded-xl bg-white text-[#1F2430] text-[14px] font-bold border border-[#1F2430]/15 hover:bg-[#F8F9FC] transition-colors inline-flex items-center justify-center gap-2"
        >
          <AlertCircle className="w-4 h-4" /> Flag this trait
        </button>
      </div>
    </div>
  );
}

function ConfidenceBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full h-1.5 rounded-full bg-[#1F2430]/[0.06] overflow-hidden">
      <div
        className="h-full rounded-full transition-[width]"
        style={{ width: `${Math.round(value * 100)}%`, background: color }}
      />
    </div>
  );
}

export function ProfileScreen() {
  const [hcvData, setHcvData] = useState<HCVResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(getDemoModeActive());
  const [focusedDim, setFocusedDim] = useState<string | null>(null);
  const [validatedAccurate, setValidatedAccurate] = useState<null | "yes" | "needs_edit">(null);
  const [personalNote, setPersonalNote] = useState("");

  useEffect(() => {
    const handler = (e: Event) => setIsDemoMode((e as CustomEvent<boolean>).detail);
    window.addEventListener("demo-mode-changed", handler);
    setIsDemoMode(getDemoModeActive());
    return () => window.removeEventListener("demo-mode-changed", handler);
  }, []);

  async function loadHCV() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await demoApi.getHCV();
      setHcvData(data);
    } catch (err) {
      console.error("Failed to load HCV data:", err);
      setError("Unable to load profile data");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadHCV();
  }, []);

  const focused = useMemo<EvidenceDimension | null>(
    () => (hcvData ? hcvData.dimensions.find((d) => d.dimension === focusedDim) ?? null : null),
    [hcvData, focusedDim]
  );

  const focusedIndex = useMemo(
    () => (hcvData && focusedDim ? hcvData.dimensions.findIndex((d) => d.dimension === focusedDim) : -1),
    [hcvData, focusedDim]
  );

  const selectAdjacent = (delta: 1 | -1) => {
    if (!hcvData || focusedIndex < 0) return;
    const next = (focusedIndex + delta + hcvData.dimensions.length) % hcvData.dimensions.length;
    setFocusedDim(hcvData.dimensions[next].dimension);
  };

  const handleShareProfile = async () => {
    try {
      await navigator.clipboard.writeText("https://placedon.com/profile/aisha-sharma-blr-2024");
      toast.success("Profile link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handlePublishProfile = () => {
    setIsPublished(true);
    toast.success("Profile published! Employers can now discover you.");
  };

  const handlePreviewAsEmployer = () => {
    const target = document.getElementById("public-tier-preview");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleToggleAvailability = () => {
    setIsAvailable((prev) => {
      const next = !prev;
      toast(next ? "You're open to offers." : "You're paused — hidden from new matches.", {
        icon: next ? "✨" : "⏸",
      });
      return next;
    });
  };

  const lastUpdatedLabel = hcvData
    ? new Date(hcvData.embedding_metadata.last_updated).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : null;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] font-[Inter,sans-serif] gap-4">
        <Loader2 className="w-10 h-10 text-[#3E63F5] animate-spin" />
        <p className="text-[14px] font-semibold text-[#1F2430]/60">Loading profile data...</p>
      </div>
    );
  }

  if (error || !hcvData) {
    return (
      <div className="flex flex-col gap-6 pb-12">
        <div className="rounded-[2rem] glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start md:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B] shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-[Manrope,sans-serif] text-[18px] font-bold text-[#1F2430] mb-1">
                Profile data unavailable
              </h3>
              <p className="text-[14px] text-[#1F2430]/60">
                {error || "Unable to load profile. Please check your backend connection and try again."}
              </p>
            </div>
          </div>
          <button
            onClick={() => loadHCV()}
            className="w-full md:w-auto min-h-[44px] px-6 rounded-xl bg-[#3E63F5] text-white text-[15px] md:text-[14px] font-bold shadow-sm hover:bg-[#2A44B0] transition-colors whitespace-nowrap shrink-0"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Top 3 dimensions for "TL;DR strengths" line
  const gapTraits = hcvData.dimensions.filter(isGapTrait);

  return (
    <div className="flex flex-col gap-6 font-[Inter,sans-serif] pb-12 overflow-x-hidden">
      {isDemoMode && (
        <div className="bg-[#1F2430] text-white px-4 py-3 rounded-xl flex items-center justify-between shadow-lg w-full gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <AlertCircle className="w-5 h-5 text-[#F59E0B] shrink-0" />
            <div className="min-w-0">
              <p className="text-[14px] font-bold">Demo Data</p>
              <p className="text-[13px] text-white/70 truncate">Backend connection unavailable. Showing fallback preview data.</p>
            </div>
          </div>
          <button
            onClick={() => loadHCV()}
            className="min-h-[44px] px-3 bg-white/10 hover:bg-white/20 rounded-lg text-[13px] font-medium transition-colors shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* 1. STICKY SLIM PROFILE TOP STRIP */}
      <div className="sticky top-0 z-30 -mx-4 sm:mx-0 px-3 sm:px-4 py-2.5 backdrop-blur-md bg-[#FFFCF6]/85 border border-[#1F2430]/[0.06] rounded-none sm:rounded-2xl shadow-[0_2px_12px_rgba(30,35,60,0.04)] flex items-center gap-2 sm:gap-3 flex-wrap">
        {/* Avatar with verified badge */}
        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-white to-[#EEF1F8] border border-[#1F2430]/10 flex items-center justify-center font-[Manrope,sans-serif] font-extrabold text-[#1F2430] text-[13px]">
            {IDENTITY.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <span
            className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#10B981] border-2 border-[#FFFCF6] flex items-center justify-center"
            title="Verified profile"
            aria-label="Verified profile"
          >
            <ShieldCheck className="w-2.5 h-2.5 text-white" />
          </span>
        </div>

        {/* Identity */}
        <div className="min-w-0 flex-1">
          <div className="font-[Manrope,sans-serif] font-extrabold text-[#1F2430] text-[14px] leading-tight truncate">
            {IDENTITY.name}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#1F2430]/60 font-semibold truncate">
            <span className="truncate">{IDENTITY.target_role}</span>
            {lastUpdatedLabel && (
              <>
                <span className="hidden sm:inline text-[#1F2430]/30">·</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[#1F2430]/50">
                  <Clock className="w-3 h-3" /> Updated {lastUpdatedLabel}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Availability toggle */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white border border-[#1F2430]/[0.08] shrink-0">
          <span className="text-[11px] font-bold text-[#1F2430]/65">
            {isAvailable ? "Open" : "Paused"}
          </span>
          <button
            type="button"
            onClick={handleToggleAvailability}
            role="switch"
            aria-checked={isAvailable}
            aria-label="Toggle availability"
            className={`relative w-9 h-5 rounded-full transition-colors ${
              isAvailable ? "bg-[#10B981]" : "bg-[#1F2430]/20"
            }`}
          >
            <motion.span
              layout
              className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
              animate={{ x: isAvailable ? 18 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {/* Preview as employer */}
        <button
          type="button"
          onClick={handlePreviewAsEmployer}
          className="hidden lg:inline-flex items-center gap-1.5 min-h-[36px] px-2 text-[12px] font-bold text-[#1F2430]/65 hover:text-[#1F2430] transition-colors shrink-0"
        >
          <Eye className="w-3.5 h-3.5" /> Preview as employer
        </button>

        {/* Share */}
        <button
          type="button"
          onClick={handleShareProfile}
          className="inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-xl bg-white text-[#1F2430] text-[12px] font-bold border border-[#1F2430]/10 hover:bg-[#F8F9FC] transition-colors shrink-0"
          aria-label="Share profile link"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share</span>
        </button>

        {/* Publish */}
        <button
          type="button"
          onClick={handlePublishProfile}
          disabled={isPublished}
          className={`min-h-[40px] px-3 sm:px-4 rounded-xl text-[12px] font-bold transition-colors shrink-0 ${
            isPublished
              ? "bg-[#10B981] text-white cursor-default"
              : "bg-[#3E63F5] text-white hover:bg-[#2A44B0]"
          }`}
        >
          {isPublished ? (
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Published
            </span>
          ) : (
            "Publish"
          )}
        </button>
      </div>

      {/* Compact availability + preview row for narrow screens */}
      <div className="md:hidden flex items-center justify-between gap-3 px-1 -mt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleAvailability}
            role="switch"
            aria-checked={isAvailable}
            aria-label="Toggle availability"
            className={`relative w-9 h-5 rounded-full transition-colors ${
              isAvailable ? "bg-[#10B981]" : "bg-[#1F2430]/20"
            }`}
          >
            <motion.span
              layout
              className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
              animate={{ x: isAvailable ? 18 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
          <span className="text-[12px] font-bold text-[#1F2430]/70">
            {isAvailable ? "Open to offers" : "Paused"}
          </span>
        </div>
        <button
          type="button"
          onClick={handlePreviewAsEmployer}
          className="inline-flex items-center gap-1.5 min-h-[36px] px-2 text-[12px] font-bold text-[#1F2430]/65 hover:text-[#1F2430] transition-colors"
        >
          <Eye className="w-3.5 h-3.5" /> Preview as employer
        </button>
      </div>

      {/* 2. CONSTELLATION HERO */}
      <AnimatedContent direction="vertical" distance={20} delay={0.05}>
        <ProfileConstellation
          dimensions={hcvData.dimensions}
          selectedTrait={focused}
          onSelectTrait={(t) => setFocusedDim(t.dimension)}
        />
      </AnimatedContent>

      {/* 3. TRAIT DRAWER */}
      <TraitDrawer
        trait={focused}
        onClose={() => setFocusedDim(null)}
        onSelectNext={hcvData.dimensions.length > 1 ? () => selectAdjacent(1) : undefined}
        onSelectPrevious={hcvData.dimensions.length > 1 ? () => selectAdjacent(-1) : undefined}
        onValidate={(r) => {
          if (r === "feels_right") toast.success("Trait marked as accurate.");
          else toast("Trait flagged for review.", { icon: "⚑" });
        }}
        onScheduleRetake={() => toast("Retake flow coming up")}
      />

      {/* Below-fold readable column */}
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">

      {/* SECTION 1: TL;DR + Role match + Self-validation */}
      <AnimatedContent direction="vertical" distance={20} delay={0.1}>
        <section className="rounded-[1.75rem] bg-white border border-[#1F2430]/[0.06] shadow-[0_4px_24px_rgba(30,35,60,0.03)] p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* TL;DR */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1F2430]/45">
                <FileText className="w-3.5 h-3.5" /> TL;DR
              </div>
              <p className="text-[16px] sm:text-[17px] leading-[1.7] text-[#1F2430]/85 font-medium text-pretty">
                {hcvData.summary}
              </p>
            </div>
            {/* Role match */}
            <div className="flex flex-col gap-2 lg:border-l lg:border-[#1F2430]/[0.08] lg:pl-8">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1F2430]/45">
                <Target className="w-3.5 h-3.5" /> Role match
              </div>
              <div className="font-[Manrope,sans-serif] text-[20px] font-extrabold text-[#1F2430] leading-tight">
                {PROFILE_DATA.role_alignment.primary_fit}
              </div>
              <div className="inline-flex self-start items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#10B981]/10 text-[#0E7A5C] text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" /> {PROFILE_DATA.role_alignment.fit_label}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {PROFILE_DATA.role_alignment.adjacent_roles.map((r) => (
                  <span key={r} className="px-2.5 py-1 rounded-lg bg-[#1F2430]/[0.04] text-[12px] font-bold text-[#1F2430]/70">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Self-validation */}
          <div className="mt-6 pt-6 border-t border-[#1F2430]/[0.06] flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 justify-between">
            <div className="min-w-0">
              <div className="font-[Manrope,sans-serif] font-extrabold text-[#1F2430] text-[15px] leading-tight">
                Does this feel like you?
              </div>
              <p className="text-[13px] text-[#1F2430]/60 font-medium mt-0.5">
                Your validation is the final check before publishing.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => { setValidatedAccurate("yes"); toast.success("Profile marked as accurate."); }}
                className={`min-h-[44px] px-4 rounded-xl text-[14px] font-bold border transition-colors inline-flex items-center justify-center gap-2 ${
                  validatedAccurate === "yes"
                    ? "bg-[#10B981] text-white border-[#10B981]"
                    : "bg-white text-[#1F2430] border-[#1F2430]/15 hover:bg-[#F8F9FC]"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" /> Yes, this feels like me
              </button>
              <button
                type="button"
                onClick={() => { setValidatedAccurate("needs_edit"); toast("Flag a trait from the constellation to revisit it.", { icon: "⚑" }); }}
                className={`min-h-[44px] px-4 rounded-xl text-[14px] font-bold border transition-colors inline-flex items-center justify-center gap-2 ${
                  validatedAccurate === "needs_edit"
                    ? "bg-[#F59E0B] text-white border-[#F59E0B]"
                    : "bg-white text-[#1F2430] border-[#1F2430]/15 hover:bg-[#F8F9FC]"
                }`}
              >
                <AlertCircle className="w-4 h-4" /> Flag something
              </button>
            </div>
          </div>
        </section>
      </AnimatedContent>

      {/* SECTION 2: Public-tier preview */}
      <AnimatedContent direction="vertical" distance={20} delay={0.14}>
        <section
          id="public-tier-preview"
          className="rounded-[1.75rem] bg-gradient-to-br from-white to-[#F8F6EE] border border-[#1F2430]/[0.06] shadow-[0_4px_24px_rgba(30,35,60,0.03)] p-6 sm:p-8 scroll-mt-24"
        >
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1F2430]/45 mb-1">
            <Eye className="w-3.5 h-3.5" /> Public preview
          </div>
          <h3 className="font-[Manrope,sans-serif] text-[20px] font-extrabold text-[#1F2430] tracking-tight leading-tight mb-4">
            What employers will see
          </h3>

          <div className="rounded-2xl bg-white border border-[#1F2430]/[0.08] p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-[#EEF1F8] border border-[#1F2430]/10 flex items-center justify-center font-[Manrope,sans-serif] font-extrabold text-[#1F2430]">
                {IDENTITY.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="min-w-0">
                <div className="font-[Manrope,sans-serif] font-extrabold text-[#1F2430] text-[16px] truncate">
                  {IDENTITY.name}
                </div>
                <div className="text-[13px] text-[#1F2430]/60 font-semibold truncate">
                  {IDENTITY.target_role} · {IDENTITY.location}
                </div>
              </div>
              <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#10B981]/10 text-[#0E7A5C] text-[11px] font-bold uppercase tracking-wider shrink-0">
                <ShieldCheck className="w-3 h-3" /> Evidence-backed
              </span>
            </div>

            <p className="text-[14px] text-[#1F2430]/80 font-medium leading-relaxed">
              {shortenToSentences(hcvData.summary, 2)}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {hcvData.dimensions
                .filter((d) => !isGapTrait(d))
                .sort((a, b) => b.score - a.score)
                .slice(0, 3)
                .map((d) => {
                  const isTech = getTraitFamily(d.dimension) === "technical";
                  return (
                    <span
                      key={d.dimension}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-bold"
                      style={{
                        background: isTech ? "rgba(62,99,245,0.08)" : "rgba(245,158,11,0.10)",
                        color: isTech ? "#3349B0" : "#8A5A0B",
                      }}
                    >
                      <Star className="w-3 h-3" /> {d.dimension}
                    </span>
                  );
                })}
            </div>

            <div className="flex items-center gap-1.5 text-[12px] text-[#1F2430]/55 font-semibold pt-2 border-t border-[#1F2430]/[0.05]">
              <Lock className="w-3 h-3" /> Raw transcript stays private.
            </div>
          </div>
        </section>
      </AnimatedContent>

      {/* SECTION 3: Achievements & education */}
      <AnimatedContent direction="vertical" distance={20} delay={0.18}>
        <section className="rounded-[1.75rem] bg-white border border-[#1F2430]/[0.06] shadow-[0_4px_24px_rgba(30,35,60,0.03)] p-6 sm:p-8">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1F2430]/45 mb-4">
            <GraduationCap className="w-3.5 h-3.5" /> Achievements & education
          </div>
          <div className="flex flex-col divide-y divide-[#1F2430]/[0.06]">
            {PROFILE_DATA.achievements_and_education.map((item) => {
              const verified = item.verification === "Signal Verified";
              const Icon = item.type === "Education" ? GraduationCap : Briefcase;
              return (
                <div key={item.title} className="py-3 flex items-center gap-3 first:pt-0 last:pb-0">
                  <div className="w-9 h-9 rounded-xl bg-[#FFFCF6] border border-[#1F2430]/[0.08] flex items-center justify-center text-[#1F2430]/50 shrink-0">
                    <Icon className="w-[18px] h-[18px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1F2430]/45">
                      {item.type}
                    </div>
                    <div className="font-[Manrope,sans-serif] font-extrabold text-[#1F2430] text-[14px] leading-tight truncate">
                      {item.title}
                    </div>
                    <div className="text-[12px] text-[#1F2430]/60 font-semibold truncate">{item.source}</div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                      verified
                        ? "bg-[#10B981]/10 text-[#0E7A5C]"
                        : "bg-[#1F2430]/[0.04] text-[#1F2430]/55"
                    }`}
                  >
                    {verified ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {item.verification}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </AnimatedContent>

      {/* SECTION 4: Personal notes */}
      <AnimatedContent direction="vertical" distance={20} delay={0.22}>
        <section className="rounded-[1.75rem] bg-white border border-[#1F2430]/[0.06] shadow-[0_4px_24px_rgba(30,35,60,0.03)] p-6 sm:p-8">
          <label htmlFor="profile-personal-notes" className="block">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1F2430]/45 mb-1">
              <FileText className="w-3.5 h-3.5" /> Notes
            </div>
            <div className="font-[Manrope,sans-serif] font-extrabold text-[#1F2430] text-[15px] leading-tight mb-3">
              Your notes
            </div>
          </label>
          <textarea
            id="profile-personal-notes"
            value={personalNote}
            onChange={(e) => setPersonalNote(e.target.value)}
            placeholder="Add context you want to remember before publishing."
            className="w-full min-h-[120px] rounded-xl bg-[#FFFCF6] border border-[#1F2430]/10 p-3 text-[14px] text-[#1F2430] font-medium placeholder:text-[#1F2430]/35 focus:outline-none focus:border-[#3E63F5]/40 resize-y"
          />
          <div className="flex items-center justify-between mt-2 text-[12px] text-[#1F2430]/50 font-semibold">
            <span className="inline-flex items-center gap-1.5"><Lock className="w-3 h-3" /> Private to you</span>
            <span>{personalNote.length} chars</span>
          </div>
        </section>
      </AnimatedContent>

      {/* SECTION 5: Profile provenance (quiet footer row) */}
      <AnimatedContent direction="vertical" distance={20} delay={0.26}>
        <section className="rounded-[1.25rem] bg-[#FFFCF6] border border-[#1F2430]/[0.06] px-5 py-4">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[#1F2430]/65 font-semibold">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1F2430]/45" />
              Provenance
            </span>
            <span className="text-[#1F2430]/30">·</span>
            <span>Model: <span className="text-[#1F2430]">{hcvData.embedding_metadata.model}</span></span>
            <span className="text-[#1F2430]/30">·</span>
            <span>{hcvData.embedding_metadata.dimension_count.toLocaleString()} dimensions</span>
            <span className="text-[#1F2430]/30">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Updated {new Date(hcvData.embedding_metadata.last_updated).toLocaleDateString()}
            </span>
            <span className="text-[#1F2430]/30">·</span>
            <span className="inline-flex items-center gap-1">
              <Lock className="w-3 h-3" /> Private until published
            </span>
            <span className="text-[#1F2430]/30">·</span>
            <span>Transcript: private</span>
          </div>
        </section>
      </AnimatedContent>

      {/* SECTION 6: Retake CTA */}
      <AnimatedContent direction="vertical" distance={20} delay={0.3}>
        <section className="rounded-[1.75rem] bg-gradient-to-br from-[#EEF1F8] to-[#FFFCF6] border border-[#1F2430]/[0.06] shadow-[0_4px_24px_rgba(30,35,60,0.03)] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="min-w-0">
            <h3 className="font-[Manrope,sans-serif] text-[18px] font-extrabold text-[#1F2430] tracking-tight leading-tight">
              Want to strengthen this profile?
            </h3>
            <p className="text-[14px] text-[#1F2430]/70 font-medium mt-1 max-w-xl leading-relaxed">
              A follow-up interview can add evidence to dotted or low-confidence traits.
              {gapTraits.length > 0 && (
                <> Currently {gapTraits.length} trait{gapTraits.length === 1 ? "" : "s"} could use more signal.</>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => toast("Retake flow coming up")}
            className="min-h-[44px] px-5 rounded-xl bg-[#3E63F5] text-white text-[14px] font-bold hover:bg-[#2A44B0] transition-colors inline-flex items-center justify-center gap-2 shrink-0"
          >
            <RefreshCw className="w-4 h-4" /> Schedule a retake
          </button>
        </section>
      </AnimatedContent>

      </div>
    </div>
  );
}

export default ProfileScreen;
