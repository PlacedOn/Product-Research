-- Correct employer-facing RLS policies that need explicit outer-table
-- references. Without qualification, Postgres can resolve column names inside
-- subqueries to the inner relation, widening employer reads.

drop policy if exists "employers read matched published profiles" on public.candidate_profile_versions;
drop policy if exists "employers read matched traits" on public.candidate_atomic_traits;
drop policy if exists "employers read safe matched evidence" on public.profile_evidence_snippets;

create policy "employers read matched published profiles"
on public.candidate_profile_versions
for select
to authenticated
using (
  status = 'published'
  and exists (
    select 1
    from public.candidate_job_matches m
    where m.profile_id = public.candidate_profile_versions.id
      and public.is_employer_member(m.employer_id)
  )
);

create policy "employers read matched traits"
on public.candidate_atomic_traits
for select
to authenticated
using (
  exists (
    select 1
    from public.candidate_profile_versions p
    join public.candidate_job_matches m on m.profile_id = p.id
    where p.id = public.candidate_atomic_traits.profile_id
      and p.status = 'published'
      and public.is_employer_member(m.employer_id)
  )
);

create policy "employers read safe matched evidence"
on public.profile_evidence_snippets
for select
to authenticated
using (
  visibility in ('employer_limited', 'employer_matched')
  and redaction_status <> 'blocked'
  and bias_check_id is not null
  and exists (
    select 1
    from public.candidate_job_matches m
    where m.profile_id = public.profile_evidence_snippets.profile_id
      and public.is_employer_member(m.employer_id)
  )
);
