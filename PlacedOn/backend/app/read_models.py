from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, StrictInt, model_validator


class ReadModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class CandidateIdentity(ReadModel):
    name: str
    target_role: str
    location: str
    availability: str
    profile_status: str
    visibility: str
    share_url: str


class EmbeddingMetadata(ReadModel):
    model: str
    dimension_count: StrictInt = Field(ge=1)
    last_updated: str


class EvidenceDimension(ReadModel):
    dimension: str
    score: float = Field(ge=0.0, le=1.0)
    confidence: float = Field(ge=0.0, le=1.0)
    uncertainty: float = Field(ge=0.0, le=1.0)
    evidence_snippets: list[str] = Field(default_factory=list)


class HCVResponse(ReadModel):
    summary: str
    embedding_metadata: EmbeddingMetadata
    dimensions: list[EvidenceDimension]


class ProfileSnapshot(ReadModel):
    completion: StrictInt = Field(ge=0, le=100)
    evidence_strength: str
    skills_count: StrictInt = Field(ge=0)
    interviews_completed: StrictInt = Field(ge=0)


class MatchesSummary(ReadModel):
    total: StrictInt = Field(ge=0)
    new_count: StrictInt = Field(ge=0)
    strong_fits: StrictInt = Field(ge=0)


class PipelineSummary(ReadModel):
    active_applications: StrictInt = Field(ge=0)
    upcoming_interviews: StrictInt = Field(ge=0)
    pending_responses: StrictInt = Field(ge=0)


class GrowthActivity(ReadModel):
    recent_improvements: list[str] = Field(default_factory=list)
    next_milestones: list[str] = Field(default_factory=list)


class NextBestAction(ReadModel):
    type: str
    title: str
    description: str = ""
    cta_label: str
    cta_route: str | None = None
    priority: Literal["high", "medium", "low"]


class DashboardResponse(ReadModel):
    next_best_action: NextBestAction
    profile_snapshot: ProfileSnapshot
    matches_summary: MatchesSummary
    pipeline_summary: PipelineSummary
    growth_activity: GrowthActivity


MatchLabel = Literal["weak", "possible", "good", "strong"]


class MatchItem(ReadModel):
    id: str
    company: str
    company_logo: str | None = None
    role: str
    location: str
    fit_score: StrictInt = Field(ge=0, le=100)
    match_label: MatchLabel
    evidence_reason: str
    action_type: Literal["apply", "interest", "save", "pass", "view"]
    salary_range: str | None = None
    posted_date: str | None = None


class MatchesResponse(ReadModel):
    matches: list[MatchItem]


class ApplicationStage(ReadModel):
    stage: str
    count: StrictInt = Field(ge=0)


class ApplicationItem(ReadModel):
    id: str
    company: str
    company_logo: str | None = None
    role: str
    stage: str
    last_updated: str
    evidence_used: list[str] = Field(default_factory=list)
    next_step: str | None = None


class ApplicationsResponse(ReadModel):
    stages: list[ApplicationStage]
    applications: list[ApplicationItem]


class InterviewItem(ReadModel):
    id: str
    company: str
    company_logo: str | None = None
    role: str
    type: str
    scheduled_time: str
    duration: str
    interviewer: str | None = None
    prep_notes: list[str] = Field(default_factory=list)
    join_url: str | None = None
    status: str


class InterviewsResponse(ReadModel):
    upcoming: list[InterviewItem]
    past: list[InterviewItem]


class SettingControl(ReadModel):
    id: str
    label: str
    description: str
    type: Literal["toggle", "select", "text"]
    value: bool | str
    options: list[str] | None = None


class SettingGroup(ReadModel):
    group: str
    description: str
    controls: list[SettingControl]


class SettingsResponse(ReadModel):
    groups: list[SettingGroup]


class EmployerJob(ReadModel):
    id: str
    title: str
    department: str
    location: str
    posted_date: str
    applicants_count: StrictInt = Field(ge=0)
    status: str


class EmployerCandidate(ReadModel):
    id: str
    anonymous_id: str | None = None
    name: str | None = None
    target_role: str
    location: str
    match_score: StrictInt = Field(ge=0, le=100)
    evidence_strength: str
    key_signals: list[str] = Field(default_factory=list)
    available_from: str


class EmployerDashboardResponse(ReadModel):
    jobs: list[EmployerJob]
    discovery_feed: list[EmployerCandidate]


class EmployerJobsResponse(ReadModel):
    jobs: list[EmployerJob]


class EmployerPipelineItem(ReadModel):
    id: str
    candidate_id: str
    anonymous_id: str | None = None
    candidate_name: str | None = None
    job_id: str
    stage: Literal[
        "new",
        "reviewed",
        "shortlisted",
        "hiring_manager_review",
        "intro_requested",
        "candidate_accepted",
        "interviewing",
        "offer",
        "hired",
        "rejected",
    ]
    owner_user_id: str | None = None
    last_activity_at: str
    next_action: str | None = None
    age_in_stage_days: StrictInt = Field(ge=0)
    sla_status: Literal["on_time", "approaching", "overdue"]


class EmployerPipelineResponse(ReadModel):
    items: list[EmployerPipelineItem]


class EvidenceItem(ReadModel):
    id: str
    dimension: str
    display_text: str
    ai_summary: str
    visibility: Literal["employer_limited", "employer_matched"]
    bias_checked: bool
    redaction_status: Literal["not_needed", "redacted"]

    @model_validator(mode="after")
    def require_employer_safe_evidence(self) -> "EvidenceItem":
        if not self.bias_checked:
            raise ValueError("employer evidence must be bias-checked before exposure")
        return self


class EmployerCandidateDetailResponse(ReadModel):
    anonymous_id: str
    candidate_name: str | None = None
    contact_email: str | None = None
    target_role: str
    match_id: str
    fit_score: StrictInt = Field(ge=0, le=100)
    evidence: list[EvidenceItem] = Field(default_factory=list)
