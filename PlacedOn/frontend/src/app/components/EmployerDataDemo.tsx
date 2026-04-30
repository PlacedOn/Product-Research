import { Fragment, useState } from "react";
import {
  getMockCandidates,
  getMockRoles,
  getMockMetrics,
  getMockPipelineStages,
  SAVED_VIEWS,
} from "../lib/mockEmployerData";
import {
  getStageName,
  getStageColor,
  getConfidenceBadgeColor,
  getSLAStatusColor,
} from "../lib/employerTypes";
import type { EmployerCandidate } from "../lib/employerTypes";
import { Badge } from "./ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function EmployerDataDemo() {
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null);

  const candidates = getMockCandidates();
  const roles = getMockRoles();
  const metrics = getMockMetrics();
  const pipelineStages = getMockPipelineStages();

  return (
    <div className="min-h-screen bg-[#F8F7F5] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl mb-2" style={{ color: "#1F2430" }}>
            Employer Dashboard Demo Data
          </h1>
          <p className="text-sm" style={{ color: "#1F2430", opacity: 0.7 }}>
            Preview of {candidates.length} mock candidates across {roles.length} roles
          </p>
        </div>

        <Tabs defaultValue="table" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="table">Candidates ({candidates.length})</TabsTrigger>
            <TabsTrigger value="roles">Roles ({roles.length})</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline Stages</TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="mt-0">
          <div className="bg-white rounded-lg border" style={{ borderColor: "#1F2430", borderOpacity: 0.1 }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F8F7F5] border-b" style={{ borderColor: "#1F2430", borderOpacity: 0.1 }}>
                  <tr>
                    <th className="px-4 py-3 text-left" style={{ color: "#1F2430" }}>Candidate</th>
                    <th className="px-4 py-3 text-left" style={{ color: "#1F2430" }}>Role</th>
                    <th className="px-4 py-3 text-left" style={{ color: "#1F2430" }}>Fit</th>
                    <th className="px-4 py-3 text-left" style={{ color: "#1F2430" }}>Evidence</th>
                    <th className="px-4 py-3 text-left" style={{ color: "#1F2430" }}>Stage</th>
                    <th className="px-4 py-3 text-left" style={{ color: "#1F2430" }}>Location</th>
                    <th className="px-4 py-3 text-left" style={{ color: "#1F2430" }}>Owner</th>
                    <th className="px-4 py-3 text-left" style={{ color: "#1F2430" }}>Next Action</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.slice(0, 20).map((candidate) => (
                    <Fragment key={candidate.id}>
                      <tr
                        className="border-b hover:bg-[#F8F7F5]/50 cursor-pointer transition-colors"
                        style={{ borderColor: "#1F2430", borderOpacity: 0.05 }}
                        onClick={() =>
                          setExpandedCandidate(
                            expandedCandidate === candidate.id ? null : candidate.id
                          )
                        }
                      >
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium" style={{ color: "#1F2430" }}>
                              {candidate.name}
                            </p>
                            <p className="text-xs" style={{ color: "#1F2430", opacity: 0.6 }}>
                              {candidate.anonymousId}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm" style={{ color: "#1F2430" }}>
                          {candidate.targetRole}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={candidate.fitScore >= 90 ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {candidate.fitScore}%
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={`text-xs border ${getConfidenceBadgeColor(candidate.evidenceConfidence)}`}>
                            {candidate.evidenceConfidence}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={`text-xs border ${getStageColor(candidate.stage)}`}>
                            {getStageName(candidate.stage)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm" style={{ color: "#1F2430" }}>
                          {candidate.location}
                        </td>
                        <td className="px-4 py-3 text-sm" style={{ color: "#1F2430", opacity: 0.7 }}>
                          {candidate.owner || "Unassigned"}
                        </td>
                        <td className="px-4 py-3 text-sm" style={{ color: "#1F2430", opacity: 0.7 }}>
                          {candidate.nextAction}
                        </td>
                        <td className="px-4 py-3">
                          {expandedCandidate === candidate.id ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </td>
                      </tr>
                      {expandedCandidate === candidate.id && (
                        <tr>
                          <td colSpan={9} className="px-4 py-4 bg-[#F8F7F5]/30">
                            <CandidateDetails candidate={candidate} />
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t text-sm text-center" style={{ color: "#1F2430", opacity: 0.6 }}>
              Showing 20 of {candidates.length} candidates
            </div>
          </div>
          </TabsContent>

          <TabsContent value="roles" className="mt-0">
          <div className="space-y-4">
            {roles.map((role) => (
              <div
                key={role.id}
                className="bg-white rounded-lg border p-6"
                style={{ borderColor: "#1F2430", borderOpacity: 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg mb-1" style={{ color: "#1F2430" }}>
                      {role.title}
                    </h3>
                    <p className="text-sm" style={{ color: "#1F2430", opacity: 0.6 }}>
                      {role.department} · {role.level}
                    </p>
                  </div>
                  <Badge
                    className={`${
                      role.healthStatus === "healthy"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : role.healthStatus === "needs_attention"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    } border`}
                  >
                    {role.healthStatus.replace("_", " ")}
                  </Badge>
                </div>
                {role.healthMessage && (
                  <div className="mb-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-900">
                    {role.healthMessage}
                  </div>
                )}
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs mb-1" style={{ color: "#1F2430", opacity: 0.6 }}>
                      New Candidates
                    </p>
                    <p className="text-xl" style={{ color: "#1F2430" }}>
                      {role.counts.newCandidates}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: "#1F2430", opacity: 0.6 }}>
                      High Fit
                    </p>
                    <p className="text-xl" style={{ color: "#1F2430" }}>
                      {role.counts.highFit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: "#1F2430", opacity: 0.6 }}>
                      Pending Intros
                    </p>
                    <p className="text-xl" style={{ color: "#1F2430" }}>
                      {role.counts.pendingIntros}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: "#1F2430", opacity: 0.6 }}>
                      Total
                    </p>
                    <p className="text-xl" style={{ color: "#1F2430" }}>
                      {role.counts.total}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </TabsContent>

          <TabsContent value="metrics" className="mt-0">
          <div className="space-y-6">
            <div className="grid grid-cols-5 gap-4">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="bg-white rounded-lg border p-4"
                  style={{ borderColor: "#1F2430", borderOpacity: 0.1 }}
                >
                  <p className="text-xs mb-2" style={{ color: "#1F2430", opacity: 0.6 }}>
                    {metric.label}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl" style={{ color: "#1F2430" }}>
                      {metric.value}
                    </p>
                    {metric.trend && metric.trendValue && (
                      <span
                        className={`text-xs ${
                          metric.trend === "up"
                            ? "text-green-600"
                            : metric.trend === "down"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {metric.trendValue}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg border p-6" style={{ borderColor: "#1F2430", borderOpacity: 0.1 }}>
              <h3 className="text-lg mb-4" style={{ color: "#1F2430" }}>
                Saved Views
              </h3>
              <div className="space-y-3">
                {SAVED_VIEWS.map((view) => {
                  const count = candidates.filter(view.filterFn).length;
                  return (
                    <div key={view.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm" style={{ color: "#1F2430" }}>
                          {view.label}
                        </p>
                        <p className="text-xs" style={{ color: "#1F2430", opacity: 0.6 }}>
                          {view.description}
                        </p>
                      </div>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          </TabsContent>

          <TabsContent value="pipeline" className="mt-0">
          <div className="bg-white rounded-lg border" style={{ borderColor: "#1F2430", borderOpacity: 0.1 }}>
            <div className="divide-y" style={{ borderColor: "#1F2430", borderOpacity: 0.1 }}>
              {pipelineStages.map((stage) => (
                <div key={stage.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm" style={{ color: "#1F2430" }}>
                        {stage.label}
                      </p>
                      {stage.slaCritical && stage.slaCritical > 0 && (
                        <Badge className="bg-red-50 text-red-700 border-red-200 border text-xs">
                          {stage.slaCritical} overdue
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {stage.count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function CandidateDetails({ candidate }: { candidate: EmployerCandidate }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h4 className="text-sm mb-3" style={{ color: "#1F2430" }}>
          Why this match
        </h4>
        <p className="text-sm mb-4" style={{ color: "#1F2430", opacity: 0.7 }}>
          {candidate.whyMatch}
        </p>

        <h4 className="text-sm mb-2" style={{ color: "#1F2430" }}>
          Top strengths
        </h4>
        <div className="flex gap-2 mb-4">
          {candidate.topTwoTags.map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <h4 className="text-sm mb-2" style={{ color: "#1F2430" }}>
          Details
        </h4>
        <div className="space-y-2 text-sm" style={{ color: "#1F2430", opacity: 0.7 }}>
          <p>Availability: {candidate.availability}</p>
          <p>Interview: {candidate.interviewFreshness}</p>
          <p>Age in stage: {candidate.ageInStage} days</p>
          <p className={getSLAStatusColor(candidate.slaStatus)}>
            SLA: {candidate.slaStatus.replace("_", " ")}
          </p>
        </div>
      </div>

      <div>
        <h4 className="text-sm mb-2" style={{ color: "#1F2430" }}>
          Evidence Items ({candidate.evidenceItems.length})
        </h4>
        <div className="space-y-3">
          {candidate.evidenceItems.slice(0, 3).map((evidence) => (
            <div key={evidence.id} className="text-sm">
              <div className="flex items-center gap-2 mb-1">
                <p style={{ color: "#1F2430" }}>{evidence.skillOrTrait}</p>
                <Badge className={`text-xs border ${getConfidenceBadgeColor(evidence.confidence)}`}>
                  {evidence.signalStrength}
                </Badge>
              </div>
              <p className="text-xs" style={{ color: "#1F2430", opacity: 0.6 }}>
                {evidence.summary}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
          {candidate.uncertainty}
        </div>
      </div>
    </div>
  );
}
