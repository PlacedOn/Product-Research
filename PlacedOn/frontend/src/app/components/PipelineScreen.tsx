import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Filter, LayoutGrid, List, ChevronDown, Check, Users,
  AlertCircle, Clock, Mail, TrendingUp, ArrowRight, MoreVertical,
  Star, Eye, ThumbsDown, ChevronRight, Calendar, MapPin, Zap,
  Sparkles, ShieldCheck, GitCompare, AlertTriangle, Building2, ArrowLeft, Bell,
  Pause, Play, Archive, XCircle, SlidersHorizontal,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Checkbox } from "./ui/checkbox";
import { type JobListing } from "../lib/jobListingTypes";
import { EditCriteriaDrawer } from "./CreateJobDrawer";
import { getStageName, getStageColor, getConfidenceBadgeColor } from "../lib/employerTypes";
import type { EmployerCandidate, PipelineStage } from "../lib/employerTypes";
import { useEmployerStore } from "../lib/employerStore";
import { CandidateEvidenceDrawer } from "./CandidateEvidenceDrawer";
import { BulkActionBar } from "./employer/BulkActionBar";
import { RejectionReasonModal } from "./employer/RejectionReasonModal";
import { ConfirmModal } from "./employer/ConfirmModal";
import { PipelineTableView } from "./employer/PipelineTableView";

type ViewMode = "stage" | "table" | "kanban";

function matchesCandidateSearch(c: EmployerCandidate, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [
    c.id, c.anonymousId, c.name, c.targetRole, c.location,
    c.owner ?? "", c.stage, c.whyMatch,
    ...c.topTwoTags, ...c.tags,
    ...c.evidenceItems.map((e) => e.skillOrTrait),
  ].some((v) => v.toLowerCase().includes(q));
}

const STAGES: Array<{ id: PipelineStage; label: string; color: string }> = [
  { id: "new", label: "New", color: "bg-blue-50 border-blue-200 text-blue-900" },
  { id: "reviewed", label: "Reviewed", color: "bg-purple-50 border-purple-200 text-purple-900" },
  { id: "shortlisted", label: "Shortlisted", color: "bg-indigo-50 border-indigo-200 text-indigo-900" },
  { id: "hiring_manager_review", label: "HM Review", color: "bg-violet-50 border-violet-200 text-violet-900" },
  { id: "intro_requested", label: "Intro Requested", color: "bg-amber-50 border-amber-200 text-amber-900" },
  { id: "candidate_accepted", label: "Candidate Accepted", color: "bg-cyan-50 border-cyan-200 text-cyan-900" },
  { id: "interviewing", label: "Interviewing", color: "bg-teal-50 border-teal-200 text-teal-900" },
  { id: "offer", label: "Offer", color: "bg-green-50 border-green-200 text-green-900" },
  { id: "hired", label: "Hired", color: "bg-emerald-50 border-emerald-200 text-emerald-900" },
  { id: "rejected", label: "Rejected", color: "bg-gray-50 border-gray-200 text-gray-700" },
];

interface HealthNudge {
  id: string;
  type: "info" | "warning" | "success";
  message: string;
  action?: string;
}

export function PipelineScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(initialRole);

  useEffect(() => {
    const r = searchParams.get("role");
    if (r) setSelectedRole(r);
  }, [searchParams]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [minFit, setMinFit] = useState(0);
  const [confidenceFilters, setConfidenceFilters] = useState<string[]>([]);
  const [availabilityFilter, setAvailabilityFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [slaFilter, setSlaFilter] = useState<string | null>(null);
  const [ownerFilter, setOwnerFilter] = useState<string | null>(null);
  const [optedInOnly, setOptedInOnly] = useState(false);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [savedView, setSavedView] = useState<string | null>(searchParams.get("view"));
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [rejectionTargets, setRejectionTargets] = useState<string[] | null>(null);
  const [editCriteriaJob, setEditCriteriaJob] = useState<JobListing | null>(null);
  const [confirmRoleAction, setConfirmRoleAction] = useState<"close" | "archive" | null>(null);

  const store = useEmployerStore();
  const {
    jobs: jobListings, candidates: allCandidates, roleStatuses,
    updateJob, setJobStatus, updateRoleStatus,
    patchCandidate, bulkMoveStage, bulkAssignOwner, bulkRequestIntro,
    bulkReject, bulkAddTag,
  } = store;

  const currentJobListing = useMemo(
    () => (selectedRole ? jobListings.find((j) => j.title === selectedRole) ?? null : null),
    [selectedRole, jobListings]
  );
  const currentRoleStatus = selectedRole ? roleStatuses[selectedRole] ?? "active" : "active";

  useEffect(() => {
    const v = searchParams.get("view");
    if (v) setSavedView(v);
  }, [searchParams]);

  const roles = useMemo(() => {
    const unique = Array.from(new Set(allCandidates.map((c) => c.targetRole)));
    return unique;
  }, [allCandidates]);

  const availabilityOptions = useMemo(
    () => Array.from(new Set(allCandidates.map((c) => c.availability))).sort(),
    [allCandidates]
  );
  const locationOptions = useMemo(
    () => Array.from(new Set(allCandidates.map((c) => c.location))).sort(),
    [allCandidates]
  );
  const ownerOptions = useMemo(
    () =>
      Array.from(
        new Set(allCandidates.map((c) => c.owner).filter(Boolean) as string[])
      ).sort(),
    [allCandidates]
  );
  const tagOptions = useMemo(
    () =>
      Array.from(new Set(allCandidates.flatMap((c) => c.topTwoTags))).sort(),
    [allCandidates]
  );

  const toggleConfidence = (v: string) =>
    setConfidenceFilters((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );

  const activeFilterCount =
    (selectedRole ? 1 : 0) +
    (minFit > 0 ? 1 : 0) +
    confidenceFilters.length +
    (availabilityFilter ? 1 : 0) +
    (locationFilter ? 1 : 0) +
    (slaFilter ? 1 : 0) +
    (ownerFilter ? 1 : 0) +
    (optedInOnly ? 1 : 0) +
    (tagFilter ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedRole(null);
    setMinFit(0);
    setConfidenceFilters([]);
    setAvailabilityFilter(null);
    setLocationFilter(null);
    setSlaFilter(null);
    setOwnerFilter(null);
    setOptedInOnly(false);
    setTagFilter(null);
  };

  const filteredCandidates = useMemo(() => {
    let list = allCandidates;
    if (selectedRole) list = list.filter((c) => c.targetRole === selectedRole);
    if (minFit > 0) list = list.filter((c) => c.fitScore >= minFit);
    if (confidenceFilters.length > 0)
      list = list.filter((c) => confidenceFilters.includes(c.evidenceConfidence));
    if (availabilityFilter)
      list = list.filter((c) => c.availability === availabilityFilter);
    if (locationFilter) list = list.filter((c) => c.location === locationFilter);
    if (slaFilter) list = list.filter((c) => c.slaStatus === slaFilter);
    if (ownerFilter) list = list.filter((c) => c.owner === ownerFilter);
    if (optedInOnly) list = list.filter((c) => c.hasOptedIn);
    if (tagFilter)
      list = list.filter((c) => c.topTwoTags.includes(tagFilter));
    if (searchQuery) list = list.filter((c) => matchesCandidateSearch(c, searchQuery));
    if (savedView === "needs_review") {
      list = list.filter(
        (c) =>
          c.stage === "new" &&
          c.fitScore >= 80 &&
          (c.evidenceConfidence === "Strong" || c.evidenceConfidence === "Moderate")
      );
    } else if (savedView === "high_fit") {
      list = list.filter((c) => c.fitScore >= 85);
    } else if (savedView === "stale_intros") {
      list = list.filter((c) => c.stage === "intro_requested" && c.ageInStage >= 3);
    } else if (savedView === "unassigned") {
      list = list.filter((c) => !c.owner);
    } else if (savedView === "overdue") {
      list = list.filter((c) => c.slaStatus === "overdue");
    }
    return list;
  }, [
    allCandidates,
    selectedRole,
    minFit,
    confidenceFilters,
    availabilityFilter,
    locationFilter,
    slaFilter,
    ownerFilter,
    optedInOnly,
    tagFilter,
    searchQuery,
    savedView,
  ]);

  const healthNudges = useMemo<HealthNudge[]>(() => {
    const nudges: HealthNudge[] = [];
    const newMatches = filteredCandidates.filter((c) => c.stage === "new");
    const strongNewMatches = newMatches.filter(
      (c) => c.fitScore >= 85 && c.evidenceConfidence === "Strong"
    );
    if (strongNewMatches.length > 0) {
      nudges.push({
        id: "strong-waiting",
        type: "warning",
        message: `${strongNewMatches.length} strong ${strongNewMatches.length === 1 ? "candidate" : "candidates"} waiting for review`,
        action: "Review now",
      });
    }

    const introPending = filteredCandidates.filter((c) => c.stage === "intro_requested");
    const oldIntros = introPending.filter((c) => c.ageInStage >= 3);
    if (oldIntros.length > 0) {
      nudges.push({
        id: "intro-stale",
        type: "warning",
        message: `${oldIntros.length} intro ${oldIntros.length === 1 ? "request" : "requests"} pending for over 3 days`,
        action: "Follow up",
      });
    }

    const lowFitCandidates = filteredCandidates.filter((c) => c.fitScore < 80);
    if (
      selectedRole &&
      filteredCandidates.length > 0 &&
      lowFitCandidates.length / filteredCandidates.length > 0.6
    ) {
      nudges.push({
        id: "low-fit",
        type: "info",
        message: "This role has low candidate fit; recalibrate criteria",
        action: "Recalibrate",
      });
    }

    return nudges;
  }, [filteredCandidates, selectedRole]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredCandidates.map((c) => c.id) : []);
  };

  const handleSelectCandidate = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  const handleBulkMoveStage = (stage: PipelineStage) => {
    bulkMoveStage(selectedIds, stage);
    setSelectedIds([]);
  };
  const handleBulkAssign = (owner: string) => {
    bulkAssignOwner(selectedIds, owner);
    setSelectedIds([]);
  };
  const handleBulkIntro = () => {
    bulkRequestIntro(selectedIds);
    setSelectedIds([]);
  };
  const handleBulkPass = () => {
    setRejectionTargets(selectedIds);
  };
  const handleBulkTag = (tag: string) => {
    bulkAddTag(selectedIds, tag);
  };
  const confirmRejection = (reason: string, note?: string) => {
    if (!rejectionTargets) return;
    bulkReject(rejectionTargets, reason, note);
    setRejectionTargets(null);
    setSelectedIds([]);
    setSelectedCandidateId(null);
  };

  const selectedCandidate = useMemo(
    () => allCandidates.find((c) => c.id === selectedCandidateId) ?? null,
    [allCandidates, selectedCandidateId]
  );

  const handleSingleMove = (stage: PipelineStage) => {
    if (!selectedCandidate) return;
    bulkMoveStage([selectedCandidate.id], stage);
  };
  const handleSingleAssign = (owner: string) => {
    if (!selectedCandidate) return;
    bulkAssignOwner([selectedCandidate.id], owner);
  };
  const handleSingleIntro = () => {
    if (!selectedCandidate) return;
    bulkRequestIntro([selectedCandidate.id]);
  };
  const handleSinglePass = () => {
    if (!selectedCandidate) return;
    setRejectionTargets([selectedCandidate.id]);
  };
  const handleSingleNote = (note: string) => {
    if (!selectedCandidate) return;
    patchCandidate(selectedCandidate.id, { notes: note });
  };

  const ownerNudgeAction = (id: string) => {
    if (id === "strong-waiting") setSavedView("needs_review");
    else if (id === "intro-stale") setSavedView("stale_intros");
    else if (id === "low-fit" && currentJobListing) setEditCriteriaJob(currentJobListing);
  };

  const updateRoleStatusLocal = (status: "active" | "paused" | "archived" | "closed") => {
    if (!selectedRole) return;
    if (status === "closed" || status === "archived") {
      setConfirmRoleAction(status);
      return;
    }
    updateRoleStatus(selectedRole, status);
    if (currentJobListing) {
      setJobStatus(currentJobListing.id, status);
    }
  };
  const confirmRoleStatus = () => {
    if (!selectedRole || !confirmRoleAction) return;
    updateRoleStatus(selectedRole, confirmRoleAction);
    if (currentJobListing) setJobStatus(currentJobListing.id, confirmRoleAction);
    setConfirmRoleAction(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/employer")}
                className="h-9 w-9 p-0 sm:w-auto sm:px-3"
              >
                <ArrowLeft className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
              <h1 className="text-lg sm:text-xl">Pipeline</h1>
            </div>
            <div className="flex items-center gap-2">
              {selectedRole && (
                <>
                  <span
                    className="hidden md:inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor:
                        currentRoleStatus === "active" ? "rgba(16,185,129,0.12)" :
                        currentRoleStatus === "paused" ? "rgba(245,158,11,0.14)" :
                        currentRoleStatus === "archived" ? "rgba(31,36,48,0.08)" :
                        "rgba(239,68,68,0.12)",
                      color:
                        currentRoleStatus === "active" ? "#10B981" :
                        currentRoleStatus === "paused" ? "#B45309" :
                        currentRoleStatus === "archived" ? "#1F2430" :
                        "#B91C1C",
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor:
                          currentRoleStatus === "active" ? "#10B981" :
                          currentRoleStatus === "paused" ? "#F59E0B" :
                          currentRoleStatus === "archived" ? "#1F2430" :
                          "#EF4444",
                      }}
                    />
                    {currentRoleStatus[0].toUpperCase() + currentRoleStatus.slice(1)}
                  </span>
                  {currentJobListing && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-3"
                      onClick={() => setEditCriteriaJob(currentJobListing)}
                      aria-label="Tune matching criteria"
                    >
                      <SlidersHorizontal className="w-4 h-4 sm:mr-1.5" />
                      <span className="hidden sm:inline">Tune matching</span>
                    </Button>
                  )}
                  {currentRoleStatus === "paused" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-3"
                      onClick={() => updateRoleStatusLocal("active")}
                      aria-label="Resume role"
                    >
                      <Play className="w-4 h-4 sm:mr-1.5" />
                      <span className="hidden sm:inline">Resume</span>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-3"
                      onClick={() => updateRoleStatusLocal("paused")}
                      disabled={currentRoleStatus !== "active"}
                      aria-label="Pause role"
                    >
                      <Pause className="w-4 h-4 sm:mr-1.5" />
                      <span className="hidden sm:inline">Pause</span>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-3"
                    onClick={() => updateRoleStatusLocal("closed")}
                    disabled={currentRoleStatus === "closed" || currentRoleStatus === "archived"}
                    aria-label="Close role"
                  >
                    <XCircle className="w-4 h-4 sm:mr-1.5" />
                    <span className="hidden sm:inline">Close</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-3"
                    onClick={() => updateRoleStatusLocal("archived")}
                    disabled={currentRoleStatus === "archived"}
                    aria-label="Archive role"
                  >
                    <Archive className="w-4 h-4 sm:mr-1.5" />
                    <span className="hidden sm:inline">Archive</span>
                  </Button>
                  <span className="w-px h-6 bg-black/10 mx-1" />
                </>
              )}
              <div
                className="hidden sm:inline-flex rounded-lg border overflow-hidden h-9"
                style={{ borderColor: "rgba(31,36,48,0.15)" }}
              >
                {([
                  { id: "table", icon: List, label: "Table" },
                  { id: "stage", icon: LayoutGrid, label: "Stage" },
                ] as const).map((v) => {
                  const Icon = v.icon;
                  const active = viewMode === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setViewMode(v.id)}
                      className="px-3 flex items-center gap-1.5 text-xs"
                      style={{
                        backgroundColor: active ? "#1F2430" : "transparent",
                        color: active ? "white" : "#1F2430",
                      }}
                      aria-label={v.label}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {v.label}
                    </button>
                  );
                })}
              </div>
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters((v) => !v)}
                className="h-9 px-3 relative"
                aria-label="Filters"
              >
                <Filter className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <span
                    className="ml-1.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] flex items-center justify-center text-white"
                    style={{ backgroundColor: "#3E63F5" }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              <Button
                variant={showAlerts ? "default" : "outline"}
                size="sm"
                onClick={() => setShowAlerts((v) => !v)}
                className="h-9 px-3 relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {healthNudges.length > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] flex items-center justify-center text-white"
                    style={{ backgroundColor: "#EF4444" }}
                  >
                    {healthNudges.length}
                  </span>
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 justify-between min-w-[140px]">
                  <span className="truncate">
                    {selectedRole || "All roles"}
                  </span>
                  <ChevronDown className="w-4 h-4 ml-2 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setSelectedRole(null)}>
                  All roles
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {roles.map((role) => (
                  <DropdownMenuItem key={role} onClick={() => setSelectedRole(role)}>
                    {role}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {showFilters && (
        <div
          className="px-3 sm:px-6 py-4 border-b bg-white/60 backdrop-blur-sm"
          style={{ borderColor: "rgba(31, 36, 48, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm" style={{ color: "#1F2430" }}>Filters</p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs"
                style={{ color: "#3E63F5" }}
              >
                Clear all ({activeFilterCount})
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <FilterSelect
              label="Role"
              value={selectedRole}
              onChange={setSelectedRole}
              options={roles}
            />
            <FilterSelect
              label="Availability"
              value={availabilityFilter}
              onChange={setAvailabilityFilter}
              options={availabilityOptions}
            />
            <FilterSelect
              label="Location"
              value={locationFilter}
              onChange={setLocationFilter}
              options={locationOptions}
            />
            <FilterSelect
              label="Owner"
              value={ownerFilter}
              onChange={setOwnerFilter}
              options={ownerOptions}
            />
            <FilterSelect
              label="SLA status"
              value={slaFilter}
              onChange={setSlaFilter}
              options={["on_time", "approaching", "overdue"]}
              formatLabel={(v) => v.replace("_", " ")}
            />
            <FilterSelect
              label="Top strength"
              value={tagFilter}
              onChange={setTagFilter}
              options={tagOptions}
            />
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: "#1F2430", opacity: 0.7 }}>
                Min fit score: {minFit}
              </label>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={minFit}
                onChange={(e) => setMinFit(Number(e.target.value))}
                className="w-full accent-[#3E63F5]"
              />
            </div>
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: "#1F2430", opacity: 0.7 }}>
                Evidence confidence
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(["Strong", "Moderate", "Needs validation"] as const).map((c) => {
                  const active = confidenceFilters.includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => toggleConfidence(c)}
                      className="text-xs px-2.5 py-1.5 rounded-full border transition-colors"
                      style={{
                        borderColor: active ? "#3E63F5" : "rgba(31, 36, 48, 0.15)",
                        backgroundColor: active ? "rgba(62, 99, 245, 0.08)" : "transparent",
                        color: active ? "#3E63F5" : "#1F2430",
                      }}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
            <label className="flex items-center gap-2 self-end cursor-pointer">
              <Checkbox
                checked={optedInOnly}
                onCheckedChange={(v) => setOptedInOnly(Boolean(v))}
              />
              <span className="text-sm" style={{ color: "#1F2430" }}>
                Opted-in only
              </span>
            </label>
          </div>
        </div>
      )}

      {showAlerts && healthNudges.length > 0 && (
        <div className="px-3 sm:px-6 py-3 space-y-2">
          {healthNudges.map((nudge) => (
            <motion.div
              key={nudge.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center justify-between gap-3 p-3 rounded-lg border ${
                nudge.type === "warning"
                  ? "bg-amber-50 border-amber-200"
                  : nudge.type === "success"
                  ? "bg-green-50 border-green-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <AlertCircle
                  className={`w-4 h-4 shrink-0 ${
                    nudge.type === "warning"
                      ? "text-amber-600"
                      : nudge.type === "success"
                      ? "text-green-600"
                      : "text-blue-600"
                  }`}
                />
                <p
                  className={`text-sm ${
                    nudge.type === "warning"
                      ? "text-amber-900"
                      : nudge.type === "success"
                      ? "text-green-900"
                      : "text-blue-900"
                  }`}
                >
                  {nudge.message}
                </p>
              </div>
              {nudge.action && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => ownerNudgeAction(nudge.id)}
                  className={`shrink-0 h-8 ${
                    nudge.type === "warning"
                      ? "text-amber-700 hover:bg-amber-100"
                      : nudge.type === "success"
                      ? "text-green-700 hover:bg-green-100"
                      : "text-blue-700 hover:bg-blue-100"
                  }`}
                >
                  {nudge.action}
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <div className="px-0 sm:px-0 pb-24 font-[Inter,sans-serif]">
        {viewMode === "table" ? (
          <div className="px-3 sm:px-6 py-3">
            <PipelineTableView
              candidates={filteredCandidates}
              selectedIds={selectedIds}
              onToggle={handleSelectCandidate}
              onToggleAll={handleSelectAll}
              onOpen={(c) => setSelectedCandidateId(c.id)}
            />
          </div>
        ) : (
          <StageAccordion
            candidates={filteredCandidates}
            selectedIds={selectedIds}
            onSelectCandidate={handleSelectCandidate}
            viewMode={viewMode}
            onSelectAll={handleSelectAll}
            onOpenCandidate={(id) => setSelectedCandidateId(id)}
          />
        )}
      </div>

      <BulkActionBar
        count={selectedIds.length}
        ownerOptions={ownerOptions}
        onMoveStage={handleBulkMoveStage}
        onAssign={handleBulkAssign}
        onRequestIntro={handleBulkIntro}
        onPass={handleBulkPass}
        onAddTag={handleBulkTag}
        onClear={() => setSelectedIds([])}
      />

      {selectedCandidate && (
        <CandidateEvidenceDrawer
          candidate={selectedCandidate}
          ownerOptions={ownerOptions}
          onClose={() => setSelectedCandidateId(null)}
          onMoveStage={handleSingleMove}
          onAssign={handleSingleAssign}
          onRequestIntro={handleSingleIntro}
          onPass={handleSinglePass}
          onCompare={() => setSelectedCandidateId(null)}
          onSaveNote={handleSingleNote}
        />
      )}

      <RejectionReasonModal
        open={!!rejectionTargets}
        count={rejectionTargets?.length ?? 0}
        onCancel={() => setRejectionTargets(null)}
        onConfirm={confirmRejection}
      />

      <ConfirmModal
        open={!!confirmRoleAction}
        title={confirmRoleAction === "archive" ? "Archive role?" : "Close role?"}
        description={
          confirmRoleAction === "archive"
            ? "Archived roles are removed from the active dashboard. You can restore them later."
            : "Closing this role stops new matches and pauses outreach. Hired candidates remain in the pipeline."
        }
        confirmLabel={confirmRoleAction === "archive" ? "Archive role" : "Close role"}
        destructive
        onCancel={() => setConfirmRoleAction(null)}
        onConfirm={confirmRoleStatus}
      />

      {editCriteriaJob && (
        <EditCriteriaDrawer
          existing={editCriteriaJob}
          onCancel={() => setEditCriteriaJob(null)}
          onSubmit={(updated) => {
            updateJob(updated);
            setEditCriteriaJob(null);
          }}
        />
      )}
    </div>
  );
}

interface KanbanViewProps {
  candidates: EmployerCandidate[];
  selectedIds: string[];
  onSelectCandidate: (id: string, checked: boolean) => void;
}

interface StageAccordionProps {
  candidates: EmployerCandidate[];
  selectedIds: string[];
  onSelectCandidate: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  viewMode: ViewMode;
  onOpenCandidate: (id: string) => void;
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  formatLabel,
}: {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
  options: string[];
  formatLabel?: (v: string) => string;
}) {
  return (
    <div>
      <label
        className="text-xs mb-1.5 block"
        style={{ color: "#1F2430", opacity: 0.7 }}
      >
        {label}
      </label>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-[#3E63F5]"
        style={{ borderColor: "rgba(31, 36, 48, 0.15)", color: "#1F2430" }}
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {formatLabel ? formatLabel(o) : o}
          </option>
        ))}
      </select>
    </div>
  );
}

function StageAccordion({ candidates, selectedIds, onSelectCandidate, onOpenCandidate }: StageAccordionProps) {
  const [activeStage, setActiveStage] = useState<PipelineStage>("new");

  const stagesWithCounts = STAGES.map((s) => ({
    ...s,
    items: candidates.filter((c) => c.stage === s.id),
  }));

  const activeStageData = stagesWithCounts.find((s) => s.id === activeStage)!;
  const dotColor = (id: PipelineStage) =>
    id === "new" ? "#3E63F5" :
    id === "shortlisted" ? "#6366F1" :
    id === "interviewing" ? "#0D9488" :
    id === "offer" || id === "hired" ? "#10B981" :
    id === "rejected" ? "#9CA3AF" :
    "#A78BFA";

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-[260px_1fr] md:h-[calc(100vh-140px)]">
      {/* Sidebar */}
      <aside
        className="border-r bg-white/70 backdrop-blur-sm p-2 md:h-full md:overflow-y-auto"
        style={{ borderColor: "rgba(31, 36, 48, 0.1)" }}
      >
        <p
          className="text-xs uppercase tracking-wide px-3 pt-2 pb-2"
          style={{ color: "#1F2430", opacity: 0.5 }}
        >
          Stages
        </p>
        <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
          {stagesWithCounts.map((stage) => {
            const isActive = stage.id === activeStage;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-left transition-colors whitespace-nowrap md:whitespace-normal"
                style={{
                  backgroundColor: isActive ? "rgba(62, 99, 245, 0.08)" : "transparent",
                  color: isActive ? "#3E63F5" : "#1F2430",
                }}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className="inline-block w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: dotColor(stage.id) }}
                  />
                  <span className="text-sm truncate">{stage.label}</span>
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: isActive ? "#3E63F5" : "rgba(31, 36, 48, 0.06)",
                    color: isActive ? "#FFFFFF" : "rgba(31, 36, 48, 0.65)",
                  }}
                >
                  {stage.items.length}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Right pane */}
      <section className="bg-white/40 md:h-full md:overflow-y-auto flex flex-col">
        <div
          className="px-5 py-4 border-b flex items-center gap-3 sticky top-0 bg-white/80 backdrop-blur-sm z-10"
          style={{ borderColor: "rgba(31, 36, 48, 0.08)" }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: dotColor(activeStageData.id) }}
          />
          <h3 style={{ color: "#1F2430" }}>{activeStageData.label}</h3>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "rgba(62, 99, 245, 0.08)", color: "#3E63F5" }}
          >
            {activeStageData.items.length}
          </span>
        </div>

        {activeStageData.items.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="text-sm" style={{ color: "#1F2430", opacity: 0.6 }}>
              No candidates in {activeStageData.label.toLowerCase()} yet.
            </p>
          </div>
        ) : (
          <div
            className="divide-y"
            style={{ borderColor: "rgba(31, 36, 48, 0.08)" }}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {activeStageData.items.map((candidate) => {
                const checked = selectedIds.includes(candidate.id);
                return (
                  <motion.div
                    key={candidate.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    onClick={() => onOpenCandidate(candidate.id)}
                    className="flex items-start gap-3 px-5 py-4 hover:bg-[#F3F2F0]/40 transition-colors cursor-pointer"
                  >
                    <div onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(v) =>
                          onSelectCandidate(candidate.id, Boolean(v))
                        }
                        className="mt-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span style={{ color: "#1F2430" }}>
                          {candidate.hasOptedIn ? candidate.name : candidate.anonymousId}
                        </span>
                        <Badge
                          className={`text-xs border ${getConfidenceBadgeColor(candidate.evidenceConfidence)}`}
                        >
                          {candidate.evidenceConfidence}
                        </Badge>
                      </div>
                      <p
                        className="text-sm mb-1"
                        style={{ color: "#1F2430", opacity: 0.7 }}
                      >
                        {candidate.targetRole}
                      </p>
                      <p
                        className="text-xs flex items-center gap-2 flex-wrap"
                        style={{ color: "#1F2430", opacity: 0.55 }}
                      >
                        <MapPin className="w-3 h-3" />
                        <span>{candidate.location}</span>
                        <span>·</span>
                        <span>{candidate.availability}</span>
                        <span>·</span>
                        <span>{candidate.lastActivity}</span>
                      </p>
                    </div>
                    <ChevronRight
                      className="w-4 h-4 mt-2 shrink-0"
                      style={{ color: "#1F2430", opacity: 0.4 }}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
}

function KanbanView({ candidates, selectedIds, onSelectCandidate }: KanbanViewProps) {
  return (
    <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
      <div className="inline-flex gap-3 min-w-full sm:grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        {STAGES.map((stage) => {
          const stageCandidates = candidates.filter((c) => c.stage === stage.id);
          return (
            <div
              key={stage.id}
              className="flex-shrink-0 w-[280px] sm:w-auto"
            >
              <div
                className={`rounded-t-lg border-b-2 px-3 py-2 mb-2 ${stage.color}`}
              >
                <h3 className="text-sm truncate">{stage.label}</h3>
                <p className="text-xs opacity-75 mt-0.5">
                  {stageCandidates.length}
                </p>
              </div>
              <div className="space-y-2 min-h-[400px]">
                <AnimatePresence>
                  {stageCandidates.map((candidate) => (
                    <motion.div
                      key={candidate.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Checkbox
                          checked={selectedIds.includes(candidate.id)}
                          onCheckedChange={(checked) =>
                            onSelectCandidate(candidate.id, checked as boolean)
                          }
                          className="mt-0.5"
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 ml-auto"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="w-4 h-4 mr-2" />
                              Assign
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              Request intro
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <ThumbsDown className="w-4 h-4 mr-2" />
                              Pass
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <h4 className="text-sm mb-1 truncate">{candidate.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2 truncate">
                        {candidate.targetRole}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant={
                            candidate.fitScore >= 90
                              ? "default"
                              : candidate.fitScore >= 80
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {candidate.fitScore}% fit
                        </Badge>
                        <Badge className={`text-xs border ${getConfidenceBadgeColor(candidate.evidenceConfidence)}`}>
                          {candidate.evidenceConfidence}
                        </Badge>
                      </div>
                      <div className="space-y-1.5 text-xs text-muted-foreground">
                        {candidate.owner && (
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{candidate.owner}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{candidate.lastActivity}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{candidate.nextAction}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface TableViewProps {
  candidates: EmployerCandidate[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectCandidate: (id: string, checked: boolean) => void;
}

function TableView({
  candidates,
  selectedIds,
  onSelectAll,
  onSelectCandidate,
}: TableViewProps) {
  const allSelected = candidates.length > 0 && selectedIds.length === candidates.length;

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b">
            <tr className="text-left text-xs">
              <th className="p-3 w-10">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onSelectAll}
                />
              </th>
              <th className="p-3 min-w-[160px]">Candidate</th>
              <th className="p-3 min-w-[160px]">Role</th>
              <th className="p-3 min-w-[80px]">Fit</th>
              <th className="p-3 min-w-[100px]">Evidence</th>
              <th className="p-3 min-w-[140px]">Stage</th>
              <th className="p-3 min-w-[120px]">Owner</th>
              <th className="p-3 min-w-[100px]">Last Activity</th>
              <th className="p-3 min-w-[180px]">Next Action</th>
              <th className="p-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, idx) => {
              const stage = STAGES.find((s) => s.id === candidate.stage)!;
              return (
                <motion.tr
                  key={candidate.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`border-b hover:bg-muted/30 transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-muted/10"
                  }`}
                >
                  <td className="p-3">
                    <Checkbox
                      checked={selectedIds.includes(candidate.id)}
                      onCheckedChange={(checked) =>
                        onSelectCandidate(candidate.id, checked as boolean)
                      }
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xs shrink-0">
                        {candidate.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm truncate">{candidate.name}</p>
                        <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {candidate.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="text-sm truncate">{candidate.targetRole}</p>
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={
                        candidate.fitScore >= 90
                          ? "default"
                          : candidate.fitScore >= 80
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {candidate.fitScore}%
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge className={`text-xs border ${getConfidenceBadgeColor(candidate.evidenceConfidence)}`}>
                      <ShieldCheck className="w-3 h-3 mr-1" />
                      {candidate.evidenceConfidence}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge className={`text-xs border ${getStageColor(candidate.stage)}`}>
                      {getStageName(candidate.stage)}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <p className="text-sm text-muted-foreground truncate">
                      {candidate.owner || "Unassigned"}
                    </p>
                  </td>
                  <td className="p-3">
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{candidate.lastActivity}</span>
                    </p>
                  </td>
                  <td className="p-3">
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{candidate.nextAction}</span>
                    </p>
                  </td>
                  <td className="p-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="w-4 h-4 mr-2" />
                          Assign
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Request intro
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <ThumbsDown className="w-4 h-4 mr-2" />
                          Pass
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {candidates.length === 0 && (
        <div className="p-12 text-center text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No candidates found</p>
        </div>
      )}
    </div>
  );
}
