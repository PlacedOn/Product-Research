import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { EmployerCandidate, PipelineStage, Role } from "./employerTypes";
import { getMockCandidates, getMockRoles } from "./mockEmployerData";
import {
  getMockJobListings,
  type JobListing,
  type JobStatus,
} from "./jobListingTypes";

export type RoleStatus = "active" | "paused" | "archived" | "closed";

export interface EmployerStore {
  jobs: JobListing[];
  candidates: EmployerCandidate[];
  roles: Role[];
  roleStatuses: Record<string, RoleStatus>;

  updateJob: (job: JobListing) => void;
  duplicateJob: (jobId: string) => JobListing | null;
  setJobStatus: (jobId: string, status: JobStatus) => void;

  updateRoleStatus: (roleTitle: string, status: RoleStatus) => void;

  updateCandidate: (candidate: EmployerCandidate) => void;
  patchCandidate: (id: string, patch: Partial<EmployerCandidate>) => void;
  bulkUpdateCandidates: (ids: string[], patch: Partial<EmployerCandidate>) => void;
  bulkMoveStage: (ids: string[], stage: PipelineStage) => void;
  bulkAssignOwner: (ids: string[], owner: string) => void;
  bulkRequestIntro: (ids: string[]) => void;
  bulkReject: (ids: string[], reason: string, note?: string) => void;
  bulkAddTag: (ids: string[], tag: string) => void;
}

const EmployerStoreContext = createContext<EmployerStore | null>(null);

const STAGE_NEXT_ACTIONS: Record<PipelineStage, string> = {
  new: "Review evidence",
  reviewed: "Decide on shortlist",
  shortlisted: "Send to hiring manager",
  hiring_manager_review: "Awaiting HM decision",
  intro_requested: "Awaiting candidate response",
  candidate_accepted: "Schedule interview",
  interviewing: "Capture interview feedback",
  offer: "Prepare offer package",
  hired: "Onboarding handoff",
  rejected: "—",
};

function getNextAction(stage: PipelineStage): string {
  return STAGE_NEXT_ACTIONS[stage];
}

export function EmployerStoreProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<JobListing[]>(() => getMockJobListings());
  const [candidates, setCandidates] = useState<EmployerCandidate[]>(() => getMockCandidates());
  const [roles, setRoles] = useState<Role[]>(() => getMockRoles());
  const [roleStatuses, setRoleStatuses] = useState<Record<string, RoleStatus>>({});

  const updateJob = useCallback((job: JobListing) => {
    setJobs((prev) => {
      const exists = prev.some((j) => j.id === job.id);
      return exists ? prev.map((j) => (j.id === job.id ? job : j)) : [job, ...prev];
    });

    setRoles((prev) => {
      if (prev.some((r) => r.title === job.title)) return prev;
      const newRole: Role = {
        id: `role-${job.id}`,
        title: job.title,
        department: job.department,
        level: job.level,
        isActive: job.status === "active",
        counts: { newCandidates: 0, highFit: 0, pendingIntros: 0, total: 0 },
        healthStatus: "healthy",
        createdAt: new Date(),
      };
      return [newRole, ...prev];
    });
  }, []);

  const duplicateJob = useCallback((jobId: string): JobListing | null => {
    const source = jobs.find((j) => j.id === jobId);
    if (!source) return null;
    const copy: JobListing = {
      ...source,
      id: `job-${Date.now()}`,
      title: `${source.title} (Copy)`,
      status: "draft",
      postedDate: undefined,
      lastActivity: new Date(),
      applicantsCount: 0,
      newCandidatesCount: 0,
      highFitCount: 0,
      shortlistedCount: 0,
      introRequestedCount: 0,
      acceptedCount: 0,
      interviewingCount: 0,
      offerCount: 0,
    };
    setJobs((prev) => [copy, ...prev]);
    return copy;
  }, [jobs]);

  const setJobStatus = useCallback((jobId: string, status: JobStatus) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status, lastActivity: new Date() } : j))
    );
  }, []);

  const updateRoleStatus = useCallback((roleTitle: string, status: RoleStatus) => {
    setRoleStatuses((prev) => ({ ...prev, [roleTitle]: status }));
    setJobs((prev) =>
      prev.map((j) => {
        if (j.title !== roleTitle) return j;
        const jobStatus: JobStatus =
          status === "paused" ? "paused" :
          status === "closed" ? "closed" :
          status === "archived" ? "archived" :
          "active";
        return { ...j, status: jobStatus, lastActivity: new Date() };
      })
    );
  }, []);

  const updateCandidate = useCallback((candidate: EmployerCandidate) => {
    setCandidates((prev) => prev.map((c) => (c.id === candidate.id ? candidate : c)));
  }, []);

  const patchCandidate = useCallback((id: string, patch: Partial<EmployerCandidate>) => {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const bulkUpdateCandidates = useCallback((ids: string[], patch: Partial<EmployerCandidate>) => {
    setCandidates((prev) => prev.map((c) => (ids.includes(c.id) ? { ...c, ...patch } : c)));
  }, []);

  const bulkMoveStage = useCallback((ids: string[], stage: PipelineStage) => {
    setCandidates((prev) =>
      prev.map((c) =>
        ids.includes(c.id)
          ? {
              ...c,
              stage,
              lastActivity: "Today",
              lastActivityTimestamp: new Date(),
              ageInStage: 0,
              nextAction: getNextAction(stage),
            }
          : c
      )
    );
  }, []);

  const bulkAssignOwner = useCallback((ids: string[], owner: string) => {
    setCandidates((prev) =>
      prev.map((c) =>
        ids.includes(c.id)
          ? { ...c, owner, lastActivity: "Today", lastActivityTimestamp: new Date() }
          : c
      )
    );
  }, []);

  const bulkRequestIntro = useCallback((ids: string[]) => {
    setCandidates((prev) =>
      prev.map((c) =>
        ids.includes(c.id)
          ? {
              ...c,
              stage: "intro_requested",
              introStatus: "requested",
              nextAction: "Awaiting candidate response",
              lastActivity: "Today",
              lastActivityTimestamp: new Date(),
              ageInStage: 0,
            }
          : c
      )
    );
  }, []);

  const bulkReject = useCallback((ids: string[], reason: string, note?: string) => {
    setCandidates((prev) =>
      prev.map((c) =>
        ids.includes(c.id)
          ? {
              ...c,
              stage: "rejected",
              rejectionReason: reason,
              notes: note ? (c.notes ? `${c.notes}\n— ${note}` : note) : c.notes,
              nextAction: "—",
              lastActivity: "Today",
              lastActivityTimestamp: new Date(),
              ageInStage: 0,
            }
          : c
      )
    );
  }, []);

  const bulkAddTag = useCallback((ids: string[], tag: string) => {
    setCandidates((prev) =>
      prev.map((c) =>
        ids.includes(c.id) && !c.tags.includes(tag)
          ? { ...c, tags: [...c.tags, tag] }
          : c
      )
    );
  }, []);

  const value = useMemo<EmployerStore>(
    () => ({
      jobs,
      candidates,
      roles,
      roleStatuses,
      updateJob,
      duplicateJob,
      setJobStatus,
      updateRoleStatus,
      updateCandidate,
      patchCandidate,
      bulkUpdateCandidates,
      bulkMoveStage,
      bulkAssignOwner,
      bulkRequestIntro,
      bulkReject,
      bulkAddTag,
    }),
    [
      jobs, candidates, roles, roleStatuses,
      updateJob, duplicateJob, setJobStatus, updateRoleStatus,
      updateCandidate, patchCandidate, bulkUpdateCandidates,
      bulkMoveStage, bulkAssignOwner, bulkRequestIntro, bulkReject, bulkAddTag,
    ]
  );

  return (
    <EmployerStoreContext.Provider value={value}>{children}</EmployerStoreContext.Provider>
  );
}

export function useEmployerStore(): EmployerStore {
  const ctx = useContext(EmployerStoreContext);
  if (!ctx) throw new Error("useEmployerStore must be used within EmployerStoreProvider");
  return ctx;
}
