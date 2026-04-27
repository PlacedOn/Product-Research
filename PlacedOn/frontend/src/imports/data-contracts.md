# Data Contracts

Frontend pages should avoid hardcoded page-local datasets when possible. Use service-like functions or a shared demo data file so backend integration can replace internals later.

## CandidateProfile

- `name`
- `experience_years`
- `skills`
- `projects`
- `education`
- `targetRole`
- `visibility`: `anonymous | limited | public`

## JobProfile

- `role`
- `company`
- `level`: `intern | junior | mid | senior`
- `required_skills`
- `preferred_skills`
- `location`
- `workMode`: `remote | hybrid | onsite`

## InterviewState

- `interview_id`
- `turn`
- `turn_count`
- `last_question`
- `last_answer`
- `skill_scores`
- `skill_coverage`
- `avg_confidence`
- `current_skill`
- `current_difficulty`
- `latest_trust_score`
- `anomaly_flag`
- `candidate_snapshot`

## CandidateMatch

- `id`
- `company`
- `role`
- `matchPercent`
- `location`
- `workMode`
- `status`
- `whyMatched`
- `evidence`

## EmployerCandidate

- `id`
- `displayName`
- `roleFitPercent`
- `targetRole`
- `experienceLabel`
- `topTraits`
- `verifiedSkills`
- `interviewFreshness`
- `visibility`
