import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { ChevronRight, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import {
  getStageName,
  getConfidenceBadgeColor,
  type EmployerCandidate,
} from "../../lib/employerTypes";

export function PipelineTableView({
  candidates,
  selectedIds,
  onToggle,
  onToggleAll,
  onOpen,
}: {
  candidates: EmployerCandidate[];
  selectedIds: string[];
  onToggle: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  onOpen: (candidate: EmployerCandidate) => void;
}) {
  const allSelected = candidates.length > 0 && candidates.every((c) => selectedIds.includes(c.id));
  const someSelected = candidates.some((c) => selectedIds.includes(c.id));

  if (candidates.length === 0) {
    return (
      <div
        className="rounded-2xl border border-dashed py-16 text-center bg-white/40"
        style={{ borderColor: "rgba(31,36,48,0.2)" }}
      >
        <p className="text-sm" style={{ color: "#1F2430", opacity: 0.7 }}>
          No candidates match the current filters.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border bg-white overflow-hidden"
      style={{ borderColor: "rgba(31,36,48,0.08)" }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr
              className="text-left text-[11px] uppercase tracking-wide"
              style={{
                color: "rgba(31,36,48,0.6)",
                backgroundColor: "rgba(31,36,48,0.02)",
                borderBottom: "1px solid rgba(31,36,48,0.08)",
              }}
            >
              <th className="px-4 py-2.5 w-8">
                <Checkbox
                  checked={allSelected || (someSelected && "indeterminate")}
                  onCheckedChange={(v) => onToggleAll(Boolean(v))}
                  aria-label="Select all"
                />
              </th>
              <th className="px-3 py-2.5">Candidate</th>
              <th className="px-3 py-2.5">Role</th>
              <th className="px-3 py-2.5">Stage</th>
              <th className="px-3 py-2.5">Fit</th>
              <th className="px-3 py-2.5">Confidence</th>
              <th className="px-3 py-2.5">Owner</th>
              <th className="px-3 py-2.5">Location</th>
              <th className="px-3 py-2.5">Avail.</th>
              <th className="px-3 py-2.5">Age</th>
              <th className="px-3 py-2.5">SLA</th>
              <th className="px-3 py-2.5">Last activity</th>
              <th className="px-3 py-2.5 w-8" />
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => {
              const selected = selectedIds.includes(c.id);
              const display = c.hasOptedIn ? c.name : c.anonymousId;
              return (
                <tr
                  key={c.id}
                  onClick={() => onOpen(c)}
                  className="cursor-pointer hover:bg-[#F3F2F0]/60 transition-colors"
                  style={{
                    borderTop: "1px solid rgba(31,36,48,0.06)",
                    backgroundColor: selected ? "rgba(62,99,245,0.04)" : undefined,
                  }}
                >
                  <td
                    className="px-4 py-2.5 align-middle"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={selected}
                      onCheckedChange={(v) => onToggle(c.id, Boolean(v))}
                      aria-label={`Select ${display}`}
                    />
                  </td>
                  <td className="px-3 py-2.5 align-middle">
                    <div className="flex flex-col min-w-0">
                      <span className="truncate" style={{ color: "#1F2430" }}>{display}</span>
                      <span className="text-[11px] truncate" style={{ color: "#1F2430", opacity: 0.55 }}>
                        {c.topTwoTags.slice(0, 2).join(" · ")}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 align-middle whitespace-nowrap" style={{ color: "#1F2430", opacity: 0.85 }}>
                    {c.targetRole}
                  </td>
                  <td className="px-3 py-2.5 align-middle whitespace-nowrap">
                    <span
                      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "rgba(31,36,48,0.05)", color: "#1F2430" }}
                    >
                      {getStageName(c.stage)}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 align-middle whitespace-nowrap" style={{ color: "#1F2430" }}>
                    {c.fitScore}
                  </td>
                  <td className="px-3 py-2.5 align-middle whitespace-nowrap">
                    <Badge variant="outline" className={`text-[11px] ${getConfidenceBadgeColor(c.evidenceConfidence)}`}>
                      {c.evidenceConfidence}
                    </Badge>
                  </td>
                  <td className="px-3 py-2.5 align-middle whitespace-nowrap" style={{ color: "#1F2430", opacity: 0.85 }}>
                    {c.owner ?? <span style={{ color: "#B45309" }}>Unassigned</span>}
                  </td>
                  <td className="px-3 py-2.5 align-middle whitespace-nowrap" style={{ color: "#1F2430", opacity: 0.75 }}>
                    {c.location}
                  </td>
                  <td className="px-3 py-2.5 align-middle whitespace-nowrap" style={{ color: "#1F2430", opacity: 0.75 }}>
                    {c.availability}
                  </td>
                  <td className="px-3 py-2.5 align-middle whitespace-nowrap" style={{ color: "#1F2430", opacity: 0.75 }}>
                    {c.ageInStage}d
                  </td>
                  <td className="px-3 py-2.5 align-middle whitespace-nowrap">
                    <SLAIndicator status={c.slaStatus} />
                  </td>
                  <td className="px-3 py-2.5 align-middle whitespace-nowrap" style={{ color: "#1F2430", opacity: 0.6 }}>
                    {c.lastActivity}
                  </td>
                  <td className="px-3 py-2.5 align-middle">
                    <ChevronRight className="w-4 h-4" style={{ color: "#1F2430", opacity: 0.3 }} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SLAIndicator({ status }: { status: "on_time" | "approaching" | "overdue" }) {
  if (status === "overdue") {
    return (
      <span className="inline-flex items-center gap-1 text-xs" style={{ color: "#B91C1C" }}>
        <AlertTriangle className="w-3 h-3" /> Overdue
      </span>
    );
  }
  if (status === "approaching") {
    return (
      <span className="inline-flex items-center gap-1 text-xs" style={{ color: "#B45309" }}>
        <Clock className="w-3 h-3" /> Soon
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs" style={{ color: "#047857" }}>
      <CheckCircle2 className="w-3 h-3" /> On time
    </span>
  );
}
