import { useState } from "react";
import { X, ThumbsDown } from "lucide-react";
import { Button } from "../ui/button";

const DEFAULT_REASONS = [
  "Misaligned role fit",
  "Insufficient evidence",
  "Availability mismatch",
  "Compensation mismatch",
  "Candidate declined",
  "Better candidates available",
  "Other",
];

export function RejectionReasonModal({
  open,
  count,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  count: number;
  onCancel: () => void;
  onConfirm: (reason: string, note?: string) => void;
}) {
  const [reason, setReason] = useState<string>(DEFAULT_REASONS[0]);
  const [note, setNote] = useState("");

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 font-[Inter,sans-serif]">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div
          className="px-5 py-4 border-b flex items-start justify-between"
          style={{ borderColor: "rgba(31,36,48,0.1)" }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(239,68,68,0.1)" }}
            >
              <ThumbsDown className="w-4 h-4" style={{ color: "#EF4444" }} />
            </div>
            <div>
              <h2 style={{ color: "#1F2430" }}>
                Pass on {count} candidate{count === 1 ? "" : "s"}
              </h2>
              <p className="text-sm mt-1" style={{ color: "#1F2430", opacity: 0.7 }}>
                Capture a reason and optional note. They'll move to Rejected.
              </p>
            </div>
          </div>
          <button onClick={onCancel} className="p-1 rounded hover:bg-black/5" aria-label="Close">
            <X className="w-4 h-4" style={{ color: "#1F2430" }} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs mb-1.5 block" style={{ color: "#1F2430", opacity: 0.7 }}>
              Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-[#3E63F5]"
              style={{ borderColor: "rgba(31,36,48,0.15)", color: "#1F2430" }}
            >
              {DEFAULT_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs mb-1.5 block" style={{ color: "#1F2430", opacity: 0.7 }}>
              Internal note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Visible to your team only"
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-[#3E63F5] resize-none"
              style={{ borderColor: "rgba(31,36,48,0.15)", color: "#1F2430" }}
            />
          </div>
        </div>
        <div
          className="px-5 py-4 flex items-center justify-end gap-2"
          style={{ borderTop: "1px solid rgba(31,36,48,0.08)" }}
        >
          <Button variant="outline" onClick={onCancel} className="h-9">
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(reason, note.trim() || undefined)}
            className="h-9 text-white"
            style={{ backgroundColor: "#EF4444" }}
          >
            Pass {count} candidate{count === 1 ? "" : "s"}
          </Button>
        </div>
      </div>
    </div>
  );
}
