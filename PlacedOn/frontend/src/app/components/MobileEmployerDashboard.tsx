import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Bell, ChevronDown, Bookmark, ThumbsDown, Mail,
  Star, MapPin, Calendar, Zap, X, Filter, ChevronRight,
  ShieldCheck, Clock, Sparkles, Eye, ArrowRight, Check,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { getMockCandidates, getMockRoles } from "../lib/mockEmployerData";
import { getConfidenceBadgeColor, getStageName } from "../lib/employerTypes";
import type { EmployerCandidate, PipelineStage } from "../lib/employerTypes";

type TabType = "recommended" | "saved" | "intros" | "pipeline";

const PIPELINE_STAGES: Array<{ id: PipelineStage; label: string }> = [
  { id: "new", label: "New" },
  { id: "reviewed", label: "Reviewed" },
  { id: "shortlisted", label: "Shortlisted" },
  { id: "hiring_manager_review", label: "HM Review" },
  { id: "intro_requested", label: "Intro" },
  { id: "candidate_accepted", label: "Accepted" },
  { id: "interviewing", label: "Interview" },
  { id: "offer", label: "Offer" },
  { id: "hired", label: "Hired" },
  { id: "rejected", label: "Rejected" },
];

export function MobileEmployerDashboard() {
  const [activeRole, setActiveRole] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<TabType>("recommended");
  const [activeStage, setActiveStage] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [evidenceId, setEvidenceId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [passedIds, setPassedIds] = useState<string[]>([]);
  const [introIds, setIntroIds] = useState<string[]>([]);

  const allCandidates = useMemo(() => getMockCandidates(), []);

  const roles = useMemo(() => {
    const unique = Array.from(new Set(allCandidates.map((c) => c.targetRole)));
    return ["all", ...unique];
  }, [allCandidates]);

  const visibleCandidates = useMemo(() => {
    let candidates = allCandidates;

    // Filter by tab
    if (activeTab === "recommended") {
      candidates = candidates.filter(
        (c) => c.fitScore >= 85 && !savedIds.includes(c.id) && !passedIds.includes(c.id)
      );
    } else if (activeTab === "saved") {
      candidates = candidates.filter((c) => savedIds.includes(c.id));
    } else if (activeTab === "intros") {
      candidates = candidates.filter((c) => introIds.includes(c.id));
    } else if (activeTab === "pipeline") {
      candidates = candidates.filter((c) => !passedIds.includes(c.id));
    }

    // Search and filter
    const query = searchQuery.toLowerCase();
    candidates = candidates.filter((candidate) => {
      const matchesSearch =
        !searchQuery ||
        candidate.name.toLowerCase().includes(query) ||
        candidate.targetRole.toLowerCase().includes(query) ||
        candidate.topTwoTags.some((skill) => skill.toLowerCase().includes(query)) ||
        candidate.location.toLowerCase().includes(query);

      const matchesRole = activeRole === "all" || candidate.targetRole === activeRole;
      const matchesStage =
        activeTab !== "pipeline" || activeStage === "all" || candidate.stage === activeStage;

      return matchesSearch && matchesRole && matchesStage;
    });

    return candidates;
  }, [activeTab, activeRole, activeStage, searchQuery, savedIds, passedIds, introIds, allCandidates]);

  const handleSave = (id: string) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handlePass = (id: string) => {
    setPassedIds((prev) => [...prev, id]);
  };

  const handleIntro = (id: string) => {
    setIntroIds((prev) => [...prev, id]);
  };

  const evidenceCandidate = allCandidates.find((c) => c.id === evidenceId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Desktop notice */}
      <div className="hidden sm:block bg-blue-50 border-b border-blue-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-blue-900">
              This is the mobile-optimized employer dashboard. For the full desktop experience,{" "}
              <button
                onClick={() => window.history.back()}
                className="underline hover:no-underline"
              >
                go back
              </button>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-3 mb-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 flex-1 max-w-[240px] justify-between"
                >
                  <span className="truncate">
                    {activeRole === "all" ? "All roles" : activeRole}
                  </span>
                  <ChevronDown className="w-4 h-4 ml-2 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[240px]">
                {roles.map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => setActiveRole(role)}
                    className="flex items-center justify-between"
                  >
                    {role === "all" ? "All roles" : role}
                    {activeRole === role && <Check className="w-4 h-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchOpen(!searchOpen)}
                className="h-11 w-11 p-0"
              >
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-11 w-11 p-0 relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pb-3">
                  <Input
                    placeholder="Search candidates, skills, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11"
                    autoFocus
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto -mx-4 px-4 scrollbar-hide">
            {[
              { id: "recommended" as const, label: "Recommended", count: 3 },
              { id: "saved" as const, label: "Saved", count: savedIds.length },
              { id: "intros" as const, label: "Intros", count: introIds.length },
              { id: "pipeline" as const, label: "Pipeline" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 px-4 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`ml-1.5 px-1.5 py-0.5 rounded text-xs ${
                      activeTab === tab.id
                        ? "bg-primary-foreground/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Pipeline stage tabs */}
        {activeTab === "pipeline" && (
          <div className="border-t bg-muted/30">
            <div className="flex items-center gap-2 overflow-x-auto px-4 py-2 scrollbar-hide">
              <button
                onClick={() => setActiveStage("all")}
                className={`shrink-0 px-3 py-1.5 rounded-md text-xs transition-colors ${
                  activeStage === "all"
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              {PIPELINE_STAGES.map((stage) => {
                const count = allCandidates.filter(
                  (c) => c.stage === stage.id && !passedIds.includes(c.id)
                ).length;
                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStage(stage.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-md text-xs transition-colors ${
                      activeStage === stage.id
                        ? "bg-white text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {stage.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Filter and actions bar */}
      <div className="bg-white/80 backdrop-blur-sm border-b px-4 py-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {visibleCandidates.length} {visibleCandidates.length === 1 ? "candidate" : "candidates"}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterOpen(true)}
            className="h-11"
          >
            <Filter className="w-4 h-4 mr-1.5" />
            Filter
          </Button>
        </div>
      </div>

      {/* Candidate feed */}
      <div className="px-4 py-4 space-y-3 pb-20">
        <AnimatePresence mode="popLayout">
          {visibleCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isSaved={savedIds.includes(candidate.id)}
              hasIntro={introIds.includes(candidate.id)}
              onSave={() => handleSave(candidate.id)}
              onPass={() => handlePass(candidate.id)}
              onIntro={() => handleIntro(candidate.id)}
              onViewEvidence={() => setEvidenceId(candidate.id)}
            />
          ))}
        </AnimatePresence>

        {visibleCandidates.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No candidates found</p>
          </div>
        )}
      </div>

      {/* Filter drawer */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div>
              <label className="text-sm mb-2 block">Fit score</label>
              <div className="flex gap-2">
                {["90+", "80+", "70+"].map((score) => (
                  <Button key={score} variant="outline" size="sm" className="flex-1">
                    {score}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm mb-2 block">Evidence strength</label>
              <div className="space-y-2">
                {["Strong signal", "Moderate signal", "Needs validation"].map((strength) => (
                  <Button
                    key={strength}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    {strength}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm mb-2 block">Availability</label>
              <div className="space-y-2">
                {["Available now", "2 weeks notice", "1 month notice"].map((avail) => (
                  <Button
                    key={avail}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    {avail}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setFilterOpen(false)}>
              Clear
            </Button>
            <Button className="flex-1" onClick={() => setFilterOpen(false)}>
              Apply
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Evidence bottom sheet */}
      <Sheet open={!!evidenceId} onOpenChange={() => setEvidenceId(null)}>
        <SheetContent side="bottom" className="h-[85vh]">
          {evidenceCandidate && (
            <>
              <SheetHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <SheetTitle className="text-lg mb-1">
                      {evidenceCandidate.name}
                    </SheetTitle>
                    <p className="text-sm text-muted-foreground">
                      {evidenceCandidate.targetRole}
                    </p>
                  </div>
                  <Badge
                    variant={evidenceCandidate.fitScore >= 90 ? "default" : "secondary"}
                    className="text-base px-3 py-1"
                  >
                    {evidenceCandidate.fitScore}% fit
                  </Badge>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-6 pb-24 overflow-y-auto max-h-[calc(85vh-180px)]">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <h3 className="text-sm">Evidence strength</h3>
                  </div>
                  <Badge className={`border ${getConfidenceBadgeColor(evidenceCandidate.evidenceConfidence)}`}>
                    {evidenceCandidate.evidenceConfidence}
                  </Badge>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h3 className="text-sm">Why this match</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {evidenceCandidate.whyMatch}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-primary" />
                    <h3 className="text-sm">Verified strengths</h3>
                  </div>
                  <div className="space-y-2">
                    {evidenceCandidate.evidenceItems.slice(0, 5).map((evidence) => (
                      <div
                        key={evidence.id}
                        className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg"
                      >
                        <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm mb-1">{evidence.skillOrTrait}</p>
                          <p className="text-xs text-muted-foreground">{evidence.summary}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-amber-600" />
                    <h3 className="text-sm">Needs validation</h3>
                  </div>
                  <p className="text-sm text-muted-foreground bg-amber-50 border border-amber-200 rounded-lg p-3">
                    {evidenceCandidate.uncertainty}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <h3 className="text-sm">Location</h3>
                    </div>
                    <p className="text-sm">{evidenceCandidate.location}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <h3 className="text-sm">Availability</h3>
                    </div>
                    <p className="text-sm">{evidenceCandidate.availability}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-sm">Interview freshness</h3>
                  </div>
                  <p className="text-sm">{evidenceCandidate.interviewFreshness}</p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    handleSave(evidenceCandidate.id);
                    setEvidenceId(null);
                  }}
                >
                  <Bookmark
                    className={`w-4 h-4 mr-1.5 ${
                      savedIds.includes(evidenceCandidate.id) ? "fill-current" : ""
                    }`}
                  />
                  {savedIds.includes(evidenceCandidate.id) ? "Saved" : "Save"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    handlePass(evidenceCandidate.id);
                    setEvidenceId(null);
                  }}
                >
                  <ThumbsDown className="w-4 h-4 mr-1.5" />
                  Pass
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    handleIntro(evidenceCandidate.id);
                    setEvidenceId(null);
                  }}
                  disabled={introIds.includes(evidenceCandidate.id)}
                >
                  <Mail className="w-4 h-4 mr-1.5" />
                  {introIds.includes(evidenceCandidate.id) ? "Requested" : "Intro"}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

interface CandidateCardProps {
  candidate: EmployerCandidate;
  isSaved: boolean;
  hasIntro: boolean;
  onSave: () => void;
  onPass: () => void;
  onIntro: () => void;
  onViewEvidence: () => void;
}

function CandidateCard({
  candidate,
  isSaved,
  hasIntro,
  onSave,
  onPass,
  onIntro,
  onViewEvidence,
}: CandidateCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white border rounded-xl p-4 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base mb-1 truncate">{candidate.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{candidate.targetRole}</p>
        </div>
        <Badge
          variant={candidate.fitScore >= 90 ? "default" : "secondary"}
          className="shrink-0 text-sm px-2.5 py-1"
        >
          {candidate.fitScore}%
        </Badge>
      </div>

      {/* Top 2 strengths */}
      <div className="space-y-2 mb-3">
        {candidate.topTwoTags.map((tag, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground flex-1">{tag}</p>
          </div>
        ))}
      </div>

      {/* Meta info */}
      <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{candidate.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{candidate.availability}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onViewEvidence}
          className="flex-1 h-11"
        >
          <Eye className="w-4 h-4 mr-1.5" />
          Evidence
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          className={`h-11 w-11 p-0 ${isSaved ? "text-primary" : ""}`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
        </Button>
        <Button variant="ghost" size="sm" onClick={onPass} className="h-11 w-11 p-0">
          <ThumbsDown className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          onClick={onIntro}
          disabled={hasIntro}
          className="h-11 px-4"
        >
          <Mail className="w-4 h-4 mr-1.5" />
          {hasIntro ? "Sent" : "Intro"}
        </Button>
      </div>
    </motion.div>
  );
}
