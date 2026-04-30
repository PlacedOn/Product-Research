import { AlertTriangle, X } from "lucide-react";
import { Button } from "../ui/button";

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 font-[Inter,sans-serif]">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div
          className="px-5 py-4 border-b flex items-start justify-between gap-3"
          style={{ borderColor: "rgba(31,36,48,0.1)" }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{
                backgroundColor: destructive ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.12)",
              }}
            >
              <AlertTriangle
                className="w-4 h-4"
                style={{ color: destructive ? "#EF4444" : "#B45309" }}
              />
            </div>
            <div>
              <h2 style={{ color: "#1F2430" }}>{title}</h2>
              <p className="text-sm mt-1" style={{ color: "#1F2430", opacity: 0.7 }}>
                {description}
              </p>
            </div>
          </div>
          <button onClick={onCancel} className="p-1 rounded hover:bg-black/5" aria-label="Close">
            <X className="w-4 h-4" style={{ color: "#1F2430" }} />
          </button>
        </div>
        <div
          className="px-5 py-4 flex items-center justify-end gap-2"
          style={{ borderTop: "1px solid rgba(31,36,48,0.08)" }}
        >
          <Button variant="outline" onClick={onCancel} className="h-9">
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            className="h-9 text-white"
            style={{ backgroundColor: destructive ? "#EF4444" : "#3E63F5" }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
