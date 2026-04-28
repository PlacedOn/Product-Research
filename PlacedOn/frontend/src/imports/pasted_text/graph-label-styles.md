  Keep trait labels visible by default. Do not hide all labels.

  Revise the Obsidian-style graph label behavior:

  Visible by default:
  - All main trait nodes must show their trait label.
  - Candidate center node may show “Aisha” or “AS”.
  - Evidence child nodes should not show labels by default.

  Label styling:
  - Trait labels should be small, readable, and low-noise.
  - Use 11-12px semibold text.
  - Use dark text around 55-70% opacity by default.
  - On hover/selected, label becomes full opacity.
  - Add a very subtle cream/white text halo or pill backdrop only if needed for readability.
  - Do not make labels look like heavy cards.

  Collision handling:
  - Labels must not overlap.
  - Add deterministic label placement around each node:
    - try bottom
    - then top
    - then right
    - then left
    - then diagonal positions
  - Pick the first position that does not collide with already-placed labels.
  - If a collision cannot be avoided, shorten label with ellipsis, but do not hide it.
  - Labels should stay inside the graph bounds.

  Interaction:
  - Hovering a trait brightens that trait label and connected labels.
  - Unrelated labels can fade slightly, but remain readable.
  - Selected trait label stays fully visible.
  - Evidence nodes remain unlabeled unless their parent trait is hovered/selected.

  Use this code direction:

  type LabelPlacement = "bottom" | "top" | "right" | "left" | "bottom-right" | "bottom-left" | "top-right" | "top-left";

  type PlacedLabel = {
    id: string;
    placement: LabelPlacement;
    box: { x: number; y: number; w: number; h: number };
  };

  const LABEL_PLACEMENTS: Array<{
    placement: LabelPlacement;
    dx: number;
    dy: number;
    anchor: "middle" | "start" | "end";
  }> = [
    { placement: "bottom", dx: 0, dy: 20, anchor: "middle" },
    { placement: "top", dx: 0, dy: -20, anchor: "middle" },
    { placement: "right", dx: 18, dy: 4, anchor: "start" },
    { placement: "left", dx: -18, dy: 4, anchor: "end" },
    { placement: "bottom-right", dx: 14, dy: 18, anchor: "start" },
    { placement: "bottom-left", dx: -14, dy: 18, anchor: "end" },
    { placement: "top-right", dx: 14, dy: -16, anchor: "start" },
    { placement: "top-left", dx: -14, dy: -16, anchor: "end" },
  ];

  function boxesOverlap(a: PlacedLabel["box"], b: PlacedLabel["box"]) {
    return !(
      a.x + a.w < b.x ||
      b.x + b.w < a.x ||
      a.y + a.h < b.y ||
      b.y + b.h < a.y
    );
  }

  function estimateLabelWidth(label: string) {
    return Math.min(150, Math.max(54, label.length * 6.4));
  }

  function placeGraphLabels(nodes: GraphNode[]) {
    const placed: PlacedLabel[] = [];

    const traitNodes = nodes
      .filter((n) => n.kind === "trait" || n.kind === "candidate")
      .sort((a, b) => {
        const aScore = a.trait?.score ?? 1;
        const bScore = b.trait?.score ?? 1;
        return bScore - aScore;
      });

    traitNodes.forEach((node) => {
      const w = estimateLabelWidth(node.label);
      const h = 16;

      for (const option of LABEL_PLACEMENTS) {
        const box = {
          x: node.x + option.dx - (option.anchor === "middle" ? w / 2 : option.anchor === "end" ? w : 0),
          y: node.y + option.dy - h / 2,
          w,
          h,
        };

        const insideBounds =
          box.x >= 2 &&
          box.y >= 4 &&
          box.x + box.w <= 98 &&
          box.y + box.h <= 94;

        const collides = placed.some((p) => boxesOverlap(box, p.box));

        if (insideBounds && !collides) {
          placed.push({ id: node.id, placement: option.placement, box });
          return;
        }
      }

      // Fallback: keep the label visible, shortened if necessary.
      placed.push({
        id: node.id,
        placement: "bottom",
        box: {
          x: Math.max(2, Math.min(82, node.x - 45)),
          y: Math.max(4, Math.min(94, node.y + 20)),
          w: 90,
          h,
        },
      });
    });

    return new Map(placed.map((p) => [p.id, p]));
  }

  Render trait labels like this:

  const labelPlacement = labelMap.get(node.id);
  const isTraitLabel = node.kind === "trait" || node.kind === "candidate";

  {isTraitLabel && labelPlacement && (
    <span
      className={`
        absolute pointer-events-none whitespace-nowrap
        text-[11px] font-bold leading-none
        transition-opacity duration-150
        ${isActive ? "opacity-100 text-[#1F2430]" : "opacity-65 text-[#1F2430]/70"}
      `}
      style={{
        left: `${labelPlacement.box.x}%`,
        top: `${labelPlacement.box.y}%`,
        maxWidth: `${labelPlacement.box.w}%`,
        textShadow: "0 1px 4px rgba(255,252,246,0.95)",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {node.label}
    </span>
  )}

  Also add this instruction:

  Do not turn labels into large pills/cards. The graph should still feel like a graph, not a dashboard of chips. Labels are annotations anchored to nodes.

  So the updated direction is: Obsidian-style graph structure, but candidate-readable labels stay visible for main traits.
