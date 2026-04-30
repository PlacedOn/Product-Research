import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { CreateJobForm } from "./CreateJobDrawer";
import { useEmployerStore } from "../lib/employerStore";

export function EmployerJobListings() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { jobs, updateJob } = useEmployerStore();

  const editId = searchParams.get("edit");
  const existing = useMemo(
    () => (editId ? jobs.find((j) => j.id === editId) ?? null : null),
    [editId, jobs]
  );

  const handleSubmit = (job: any) => {
    updateJob(job);
    navigate("/employer");
  };

  const handleCancel = () => navigate("/employer");

  return (
    <div
      className="min-h-screen font-[Inter,sans-serif] flex flex-col"
      style={{ backgroundColor: "#F3F2F0", color: "#1F2430" }}
    >
      <div
        className="flex items-center justify-between px-6 py-4 bg-white border-b"
        style={{ borderColor: "rgba(31,36,48,0.08)" }}
      >
        <button
          onClick={() => navigate("/employer")}
          className="flex items-center gap-2 text-sm hover:opacity-80"
          style={{ color: "#1F2430" }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </button>
        <span className="text-xs" style={{ color: "#1F2430", opacity: 0.55 }}>
          {existing ? `Edit · ${existing.title}` : "New job listing"}
        </span>
      </div>

      <div className="flex-1 flex justify-center px-4 py-6">
        <div
          className="w-full max-w-4xl rounded-2xl overflow-hidden border bg-white flex flex-col"
          style={{ borderColor: "rgba(31,36,48,0.08)", minHeight: "calc(100vh - 140px)" }}
        >
          <CreateJobForm
            existing={existing}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            cancelLabel="Back to dashboard"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
