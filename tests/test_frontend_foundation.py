from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FRONTEND_APP = ROOT / "PlacedOn" / "frontend" / "src" / "app"
FRONTEND_DOCS = ROOT / "PlacedOn" / "frontend" / "guidelines"


def read_frontend(path: str) -> str:
    return (FRONTEND_APP / path).read_text(encoding="utf-8")


def read_doc(path: str) -> str:
    return (FRONTEND_DOCS / path).read_text(encoding="utf-8")


def test_route_contract_is_documented_without_visual_implementation() -> None:
    route_contract = read_doc("frontend-route-contract.md")

    for route in [
        "/",
        "/candidate",
        "/candidate/profile",
        "/candidate/matches",
        "/candidate/applications",
        "/candidate/interviews",
        "/candidate/settings",
        "/pre-interview",
        "/interview",
        "/employer",
        "/employer/jobs",
        "/employer/candidates",
        "/employer/saved",
    ]:
        assert route in route_contract


def test_shared_types_and_mock_data_exist_for_frontend_foundation() -> None:
    types = read_frontend("types.ts")
    mock_data = read_frontend("mock/placedonData.ts")

    for exported_type in [
        "CandidateProfile",
        "JobProfile",
        "InterviewState",
        "CandidateMatch",
        "CandidateInterview",
        "EmployerCandidate",
    ]:
        assert f"export interface {exported_type}" in types

    for exported_value in [
        "mockCandidate",
        "mockJobs",
        "mockInterviewState",
        "mockCandidateMatches",
        "mockCandidateInterviews",
        "mockEmployerCandidates",
    ]:
        assert f"export const {exported_value}" in mock_data


def test_services_expose_mock_backed_contracts() -> None:
    expected_services = {
        "services/candidateService.ts": [
            "getCandidateProfile",
            "getCandidateMatches",
            "getCandidateInterviews",
        ],
        "services/interviewService.ts": [
            "getInterviewState",
            "getPreInterviewContext",
        ],
        "services/employerService.ts": [
            "getEmployerCandidates",
            "getEmployerJobs",
        ],
    }

    for path, functions in expected_services.items():
        service = read_frontend(path)
        assert "placedonData" in service
        for function_name in functions:
            assert f"export async function {function_name}" in service


def test_figma_ai_page_specs_exist_for_missing_surfaces() -> None:
    for path, required_phrases in {
        "figma-spec-candidate-matches.md": [
            "Route: `/candidate/matches`",
            "Match Cards",
            "Empty State",
            "Responsive Behavior",
        ],
        "figma-spec-candidate-interviews.md": [
            "Route: `/candidate/interviews`",
            "Upcoming Section",
            "Profile Interview Status",
            "Responsive Behavior",
        ],
        "figma-spec-employer-dashboard.md": [
            "Route: `/employer`",
            "Candidate Feed",
            "Trait Filter Bar",
            "Responsive Behavior",
        ],
    }.items():
        spec = read_doc(path)
        for phrase in required_phrases:
            assert phrase in spec
