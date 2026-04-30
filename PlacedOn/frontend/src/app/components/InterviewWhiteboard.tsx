import { useEffect, useRef, useState } from "react";
import { Pencil, Square, Type, Eraser, Undo2, Trash2 } from "lucide-react";

type Tool = "pen" | "rect" | "text" | "eraser";

interface Stroke {
  tool: Tool;
  color: string;
  size: number;
  points: { x: number; y: number }[];
  text?: string;
}

const COLORS = ["#1F2430", "#3E63F5", "#D97B94", "#10B981", "#F59E0B"];

export function InterviewWhiteboard() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState<string>(COLORS[1]);
  const [size, setSize] = useState<number>(3);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const strokesRef = useRef<Stroke[]>([]);
  strokesRef.current = strokes;
  const drawingRef = useRef<Stroke | null>(null);
  const [, force] = useState(0);
  const [pendingTextPoint, setPendingTextPoint] = useState<{ x: number; y: number } | null>(null);
  const [textDraft, setTextDraft] = useState("");
  const textInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pendingTextPoint) {
      textInputRef.current?.focus();
    }
  }, [pendingTextPoint]);

  const commitText = () => {
    const value = textDraft.trim();
    if (!pendingTextPoint || !value) {
      setPendingTextPoint(null);
      setTextDraft("");
      return;
    }
    setStrokes((prev) => [
      ...prev,
      {
        tool: "text",
        color,
        size,
        points: [pendingTextPoint],
        text: value,
      },
    ]);
    setPendingTextPoint(null);
    setTextDraft("");
  };

  const cancelText = () => {
    setPendingTextPoint(null);
    setTextDraft("");
  };

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const all = drawingRef.current
      ? [...strokesRef.current, drawingRef.current]
      : strokesRef.current;
    for (const s of all) {
      if (!s) continue;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = s.size;
      ctx.strokeStyle = s.tool === "eraser" ? "#FFFFFF" : s.color;
      ctx.fillStyle = s.color;
      if (s.tool === "rect" && s.points.length >= 2) {
        const [a, b] = [s.points[0], s.points[s.points.length - 1]];
        ctx.strokeRect(a.x, a.y, b.x - a.x, b.y - a.y);
      } else if (s.tool === "text" && s.text && s.points[0]) {
        ctx.font = `600 ${Math.max(14, s.size * 5)}px Inter, sans-serif`;
        ctx.fillText(s.text, s.points[0].x, s.points[0].y);
      } else if (s.points.length > 0) {
        ctx.beginPath();
        ctx.moveTo(s.points[0].x, s.points[0].y);
        for (let i = 1; i < s.points.length; i++) {
          ctx.lineTo(s.points[i].x, s.points[i].y);
        }
        ctx.stroke();
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const fit = () => {
      const r = wrapper.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      const ctx = canvas.getContext("2d");
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      redraw();
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    redraw();
  });

  const getPoint = (e: React.PointerEvent) => {
    const canvas = canvasRef.current!;
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = getPoint(e);

    if (tool === "text") {
      setPendingTextPoint(p);
      setTextDraft("");
      return;
    }

    e.currentTarget.setPointerCapture(e.pointerId);

    drawingRef.current = {
      tool,
      color,
      size: tool === "eraser" ? Math.max(size * 4, 16) : size,
      points: [p],
    };
    force((n) => n + 1);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawingRef.current) return;
    const p = getPoint(e);
    if (drawingRef.current.tool === "rect") {
      drawingRef.current.points = [drawingRef.current.points[0], p];
    } else {
      drawingRef.current.points.push(p);
    }
    force((n) => n + 1);
  };

  const finishDrawing = (e?: React.PointerEvent<HTMLCanvasElement>) => {
    const completedStroke = drawingRef.current;
    if (!completedStroke) return;

    drawingRef.current = null;

    if (e && e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    setStrokes((prev) => [
      ...prev,
      {
        ...completedStroke,
        points: completedStroke.points.map((point) => ({ ...point })),
      },
    ]);
  };

  const undo = () => setStrokes((prev) => prev.slice(0, -1));
  const clear = () => setStrokes([]);

  const toolBtn = (id: Tool, Icon: any, label: string) => (
    <button
      key={id}
      onClick={() => setTool(id)}
      aria-label={label}
      title={label}
      className={`p-2.5 rounded-xl transition-colors ${
        tool === id
          ? "bg-[#EEF1F8] text-[#3E63F5] shadow-[0_2px_4px_rgba(62,99,245,0.1),inset_0_1px_1px_rgba(255,255,255,0.9)] ring-1 ring-[#3E63F5]/10"
          : "text-[#1F2430]/50 hover:text-[#1F2430] hover:bg-white"
      }`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );

  return (
    <>
      {/* Toolbar */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 p-2 bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_24px_rgba(30,35,60,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] ring-1 ring-[#1F2430]/[0.03] z-20">
        {toolBtn("pen", Pencil, "Pen")}
        {toolBtn("rect", Square, "Rectangle")}
        {toolBtn("text", Type, "Text")}
        <div className="w-6 h-[1px] bg-[#1F2430]/[0.06] mx-auto my-1" />
        {toolBtn("eraser", Eraser, "Eraser")}
        <div className="w-6 h-[1px] bg-[#1F2430]/[0.06] mx-auto my-1" />
        <div className="flex flex-col items-center gap-1.5 py-1">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              aria-label={`Color ${c}`}
              className="w-5 h-5 rounded-full transition-transform hover:scale-110"
              style={{
                backgroundColor: c,
                outline: color === c ? `2px solid ${c}` : "none",
                outlineOffset: 2,
              }}
            />
          ))}
        </div>
        <div className="w-6 h-[1px] bg-[#1F2430]/[0.06] mx-auto my-1" />
        <input
          type="range"
          min={1}
          max={10}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="w-10 accent-[#3E63F5]"
          aria-label="Stroke size"
        />
        <div className="w-6 h-[1px] bg-[#1F2430]/[0.06] mx-auto my-1" />
        <button
          onClick={undo}
          aria-label="Undo"
          title="Undo"
          className="p-2.5 rounded-xl text-[#1F2430]/50 hover:text-[#1F2430] hover:bg-white transition-colors"
        >
          <Undo2 className="w-5 h-5" />
        </button>
        <button
          onClick={clear}
          aria-label="Clear board"
          title="Clear board"
          className="p-2.5 rounded-xl text-[#1F2430]/50 hover:text-red-600 hover:bg-white transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Canvas */}
      <div
        ref={wrapperRef}
        className="relative flex-1 rounded-[1.5rem] border border-dashed border-[#1F2430]/10 bg-white/60 shadow-[inset_0_2px_12px_rgba(30,35,60,0.02)] backdrop-blur-sm z-10 overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={finishDrawing}
          onPointerCancel={finishDrawing}
          onLostPointerCapture={finishDrawing}
          className="absolute inset-0 touch-none"
          style={{ cursor: tool === "text" ? "text" : "crosshair" }}
        />
        {pendingTextPoint && (
          <input
            ref={textInputRef}
            value={textDraft}
            onChange={(e) => setTextDraft(e.target.value)}
            onBlur={commitText}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitText();
              if (e.key === "Escape") cancelText();
            }}
            className="absolute z-30 min-w-[160px] rounded-lg border border-[#3E63F5]/30 bg-white px-3 py-2 text-sm font-semibold text-[#1F2430] shadow-[0_8px_24px_rgba(30,35,60,0.12)] outline-none ring-2 ring-[#3E63F5]/10"
            style={{
              left: pendingTextPoint.x,
              top: pendingTextPoint.y,
            }}
            placeholder="Type text"
          />
        )}
      </div>
    </>
  );
}
