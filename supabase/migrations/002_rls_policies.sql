-- ============================================================
-- Migration 002: Row-Level Security policies
--
-- ARCHITECTURE DECISION:
-- We use three types of access:
--   1. Authenticated user — can only see/modify their own rows
--   2. Service role — bypasses RLS entirely (used by n8n webhook)
--   3. Anonymous — can only read published reports with a valid
--      active share link (for the /share/:token page)
--
-- Policy naming convention: tablename_action_description
-- ============================================================

-- Enable RLS on every table
alter table public.users enable row level security;
alter table public.jobs enable row level security;
alter table public.reports enable row level security;
alter table public.report_versions enable row level security;
alter table public.research_sources enable row level security;
alter table public.messages enable row level security;
alter table public.feedback enable row level security;
alter table public.workflow_runs enable row level security;
alter table public.share_links enable row level security;
alter table public.notifications enable row level security;

-- ============================================================
-- USERS table policies
-- ============================================================

-- Users can read their own profile
create policy "users_select_own"
  on public.users for select
  to authenticated
  using (auth.uid() = id);

-- Users can update their own profile
create policy "users_update_own"
  on public.users for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- The new user trigger (migration 003) runs as the service role,
-- so insert is handled there — no insert policy needed for users.

-- ============================================================
-- JOBS table policies
-- ============================================================

-- Users can read their own jobs
create policy "jobs_select_own"
  on public.jobs for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can create jobs (the API route validates this further)
create policy "jobs_insert_own"
  on public.jobs for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can update their own jobs (e.g. archiving)
create policy "jobs_update_own"
  on public.jobs for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- REPORTS table policies
-- ============================================================

-- Authenticated users can read their own reports
create policy "reports_select_own"
  on public.reports for select
  to authenticated
  using (auth.uid() = user_id);

-- Anonymous users can read a report if a valid active share link exists.
-- This is what powers the /share/:token public page.
-- The token is passed as a Postgres session variable by the API route.
create policy "reports_select_via_share_link"
  on public.reports for select
  to anon
  using (
    exists (
      select 1 from public.share_links sl
      where sl.report_id = id
        and sl.token = current_setting('app.share_token', true)
        and sl.is_active = true
        and (sl.expires_at is null or sl.expires_at > now())
    )
  );

-- Users can update their own reports
create policy "reports_update_own"
  on public.reports for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- REPORT VERSIONS table policies
-- ============================================================

-- Users can read versions of their own reports
create policy "report_versions_select_own"
  on public.report_versions for select
  to authenticated
  using (
    exists (
      select 1 from public.reports r
      where r.id = report_id
        and r.user_id = auth.uid()
    )
  );

-- Anonymous users can read versions of shared reports
create policy "report_versions_select_via_share"
  on public.report_versions for select
  to anon
  using (
    exists (
      select 1 from public.reports r
      join public.share_links sl on sl.report_id = r.id
      where r.id = report_id
        and sl.token = current_setting('app.share_token', true)
        and sl.is_active = true
        and (sl.expires_at is null or sl.expires_at > now())
    )
  );

-- ============================================================
-- RESEARCH SOURCES table policies
-- ============================================================

-- Users can read sources for their own jobs
create policy "research_sources_select_own"
  on public.research_sources for select
  to authenticated
  using (
    exists (
      select 1 from public.jobs j
      where j.id = job_id
        and j.user_id = auth.uid()
    )
  );

-- ============================================================
-- MESSAGES table policies
-- ============================================================

-- Users can read their own messages
create policy "messages_select_own"
  on public.messages for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can insert their own messages
create policy "messages_insert_own"
  on public.messages for insert
  to authenticated
  with check (auth.uid() = user_id);

-- ============================================================
-- FEEDBACK table policies
-- ============================================================

-- Users can read their own feedback
create policy "feedback_select_own"
  on public.feedback for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can insert feedback on their own reports
create policy "feedback_insert_own"
  on public.feedback for insert
  to authenticated
  with check (auth.uid() = user_id);

-- ============================================================
-- WORKFLOW RUNS table policies
-- ============================================================
-- Users can view workflow runs for their own jobs (for observability UI)
create policy "workflow_runs_select_own"
  on public.workflow_runs for select
  to authenticated
  using (
    exists (
      select 1 from public.jobs j
      where j.id = job_id
        and j.user_id = auth.uid()
    )
  );

-- ============================================================
-- SHARE LINKS table policies
-- ============================================================

-- Users can read their own share links
create policy "share_links_select_own"
  on public.share_links for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can create share links for their own reports
create policy "share_links_insert_own"
  on public.share_links for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can deactivate their own share links
create policy "share_links_update_own"
  on public.share_links for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- NOTIFICATIONS table policies
-- ============================================================

-- Users can read their own notifications
create policy "notifications_select_own"
  on public.notifications for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can mark their own notifications as read
create policy "notifications_update_own"
  on public.notifications for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);