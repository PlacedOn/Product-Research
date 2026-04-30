import { useState } from "react";
import { motion } from "motion/react";
import {
  CheckCircle2, ChevronDown, Mail, Tag, ThumbsDown, UserPlus, X, ArrowRightCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { getStageName, type PipelineStage } from "../../lib/employerTypes";

const STAGES: PipelineStage[] = [
  "new", "reviewed", "shortlisted", "hiring_manager_review",
  "intro_requested", "candidate_accepted", "interviewing", "offer", "hired",
];

export function BulkActionBar({
  count,
  ownerOptions,
  onMoveStage,
  onAssign,
  onRequestIntro,
  onPass,
  onAddTag,
  onClear,
}: {
  count: number;
  ownerOptions: string[];
  onMoveStage: (stage: PipelineStage) => void;
  onAssign: (owner: string) => void;
  onRequestIntro: () => void;
  onPass: () => void;
  onAddTag: (tag: string) => void;
  onClear: () => void;
}) {
  const [tagInput, setTagInput] = useState("");
  if (count === 0) return null;
  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 60, opacity: 0 }}
      className="sticky bottom-4 z-30 mx-3 sm:mx-6 my-3"
    >
      <div
        className="rounded-xl bg-white border shadow-lg flex items-center gap-2 px-3 py-2 overflow-x-auto"
        style={{ borderColor: "rgba(31,36,48,0.12)" }}
      >
        <div className="flex items-center gap-2 px-2 py-1 rounded-md shrink-0" style={{ backgroundColor: "rgba(62,99,245,0.1)" }}>
          <CheckCircle2 className="w-4 h-4" style={{ color: "#3E63F5" }} />
          <span className="text-xs whitespace-nowrap" style={{ color: "#1F2430" }}>
            {count} selected
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 shrink-0">
              <ArrowRightCircle className="w-4 h-4 mr-1.5" /> Move stage
              <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            <DropdownMenuLabel>Move to</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {STAGES.map((s) => (
              <DropdownMenuItem key={s} onClick={() => onMoveStage(s)}>
                {getStageName(s)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 shrink-0">
              <UserPlus className="w-4 h-4 mr-1.5" /> Assign
              <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52 max-h-72 overflow-y-auto">
            <DropdownMenuLabel>Assign owner</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ownerOptions.length === 0 ? (
              <div className="px-2 py-1.5 text-xs" style={{ color: "#1F2430", opacity: 0.6 }}>
                No reviewers available
              </div>
            ) : (
              ownerOptions.map((o) => (
                <DropdownMenuItem key={o} onClick={() => onAssign(o)}>
                  {o}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="sm"
          className="h-9 shrink-0"
          onClick={onRequestIntro}
        >
          <Mail className="w-4 h-4 mr-1.5" /> Request intro
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 shrink-0">
              <Tag className="w-4 h-4 mr-1.5" /> Tag
              <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 p-2">
            <input
              autoFocus
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && tagInput.trim()) {
                  onAddTag(tagInput.trim());
                  setTagInput("");
                }
              }}
              placeholder="Type and press Enter"
              className="w-full rounded-md border bg-white px-2 py-1.5 text-sm outline-none focus:border-[#3E63F5]"
              style={{ borderColor: "rgba(31,36,48,0.15)", color: "#1F2430" }}
            />
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="sm"
          className="h-9 shrink-0"
          style={{ color: "#B91C1C", borderColor: "rgba(239,68,68,0.3)" }}
          onClick={onPass}
        >
          <ThumbsDown className="w-4 h-4 mr-1.5" /> Pass
        </Button>

        <div className="flex-1" />

        <Button
          variant="ghost"
          size="sm"
          className="h-9 shrink-0"
          onClick={onClear}
        >
          <X className="w-4 h-4 mr-1.5" /> Clear
        </Button>
      </div>
    </motion.div>
  );
}
