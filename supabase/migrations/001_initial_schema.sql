-- ============================================================
-- Migration 001: Initial schema
-- Creates all core tables for the Argus platform.
-- Each table has created_at / updated_at timestamps.
-- UUIDs are used for all primary keys (gen_random_uuid()).
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- for full-text search later

-- ============================================================
-- USERS
-- Public profile table. Mirrors auth.users.
-- Populated automatically via trigger (see migration 003).
-- Never insert into this table manually from the app —
-- always go through Supabase Auth.
-- ============================================================
create table public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null unique,
  full_name   text,
  avatar_url  text,
  settings    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.users is 'Public user profiles. Mirrors auth.users.';

-- ============================================================
-- JOBS
-- A job represents one company research request.
-- A job is the processing unit; a report is the output artifact.
-- They are separated so a job can fail and be retried
-- without creating a duplicate report.
-- ============================================================
create type public.job_status as enum (
  'PENDING',
  'PROCESSING',
  'RESEARCHING',
  'GENERATING',
  'REVIEWING',
  'REVISION_REQUESTED',
  'COMPLETED',
  'FAILED',
  'ARCHIVED'
);

create table public.jobs (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  company_name    text not null,
  company_url     text,
  status          public.job_status not null default 'PENDING',
  -- metadata holds arbitrary workflow data: progress percentage,
  -- current workflow step, retry count, etc.
  metadata        jsonb not null default '{}'::jsonb,
  error_message   text,
  started_at      timestamptz,
  completed_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.jobs is 'Company research jobs. Each job produces one report.';
comment on column public.jobs.metadata is 'Arbitrary workflow metadata: progress, step name, retry count.';

-- ============================================================
-- REPORTS
-- The user-facing artifact produced by a job.
-- A report has many versions (see report_versions).
-- current_version points to the version number currently shown.
-- ============================================================
create type public.report_status as enum (
  'DRAFT',
  'PUBLISHED',
  'ARCHIVED'
);

create table public.reports (
  id               uuid primary key default gen_random_uuid(),
  job_id           uuid not null unique references public.jobs(id) on delete cascade,
  user_id          uuid not null references public.users(id) on delete cascade,
  title            text not null,
  company_name     text not null,
  company_url      text,
  current_version  integer not null default 1,
  status           public.report_status not null default 'DRAFT',
  -- quality_score holds the AI critic output: overall score + per-section scores
  quality_score    jsonb,
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on table public.reports is 'Report artifacts. Each job produces exactly one report.';
comment on column public.reports.quality_score is 'AI critic scores: { overall: 8.2, sections: { executive_summary: 9, ... } }';

-- ============================================================
-- REPORT VERSIONS
-- Every time a report is generated or revised, a new version
-- row is created. The full content is stored in each row.
-- This enables version history and diff comparison without
-- computing diffs on the fly.
-- ============================================================
create table public.report_versions (
  id                uuid primary key default gen_random_uuid(),
  report_id         uuid not null references public.reports(id) on delete cascade,
  version_number    integer not null,
  -- content stored in three formats:
  -- content_json: structured data for programmatic access
  -- content_markdown: human-readable, used for AI follow-up
  -- content_html: pre-rendered for display
  content_markdown  text not null,
  content_json      jsonb not null default '{}'::jsonb,
  content_html      text not null default '',
  sources_used      jsonb not null default '[]'::jsonb,
  -- ai_metadata captures cost and quality data per version
  ai_metadata       jsonb not null default '{}'::jsonb,
  -- revision_trigger: 'INITIAL' | 'USER_FEEDBACK' | 'AUTO_RETRY'
  revision_trigger  text not null default 'INITIAL',
  created_at        timestamptz not null default now(),
  -- enforce unique version numbers per report
  unique(report_id, version_number)
);

comment on table public.report_versions is 'Immutable version history for each report.';
comment on column public.report_versions.ai_metadata is 'Cost/quality data: { model, tokens_in, tokens_out, quality_score, critic_notes, duration_ms }';

-- ============================================================
-- RESEARCH SOURCES
-- Every piece of raw data gathered during research is stored here.
-- The embedding column (vector) is added in migration 003
-- after pgvector is enabled.
-- Sources are used for:
--   1. Citations in reports
--   2. RAG context for follow-up chat
-- ============================================================
create table public.research_sources (
  id            uuid primary key default gen_random_uuid(),
  job_id        uuid not null references public.jobs(id) on delete cascade,
  -- source_type: 'WEBSITE' | 'SERP' | 'NEWS' | 'LINKEDIN' | 'CRUNCHBASE' | 'MANUAL'
  source_type   text not null,
  url           text,
  title         text,
  content_raw   text,
  -- metadata holds source-specific data: word count, fetch timestamp, HTTP status, etc.
  metadata      jsonb not null default '{}'::jsonb,
  fetched_at    timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

comment on table public.research_sources is 'Raw research data gathered per job. Used for citations and RAG.';

-- ============================================================
-- MESSAGES
-- Follow-up chat messages, scoped to a specific report.
-- role: 'user' | 'assistant'
-- sources_cited: array of research_source IDs used in the answer
-- ============================================================
create table public.messages (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.users(id) on delete cascade,
  report_id      uuid not null references public.reports(id) on delete cascade,
  role           text not null check (role in ('user', 'assistant')),
  content        text not null,
  sources_cited  jsonb not null default '[]'::jsonb,
  tokens_used    integer,
  created_at     timestamptz not null default now()
);

comment on table public.messages is 'Follow-up chat messages scoped to a report.';

-- ============================================================
-- FEEDBACK
-- User feedback on a specific report version.
-- This is what triggers the revision workflow.
-- ============================================================
create type public.feedback_type as enum (
  'REVISION_REQUEST',
  'SECTION_COMMENT',
  'THUMBS_UP',
  'THUMBS_DOWN'
);

create type public.feedback_status as enum (
  'PENDING',
  'PROCESSING',
  'RESOLVED',
  'DISMISSED'
);

create table public.feedback (
  id                  uuid primary key default gen_random_uuid(),
  report_version_id   uuid not null references public.report_versions(id) on delete cascade,
  report_id           uuid not null references public.reports(id) on delete cascade,
  user_id             uuid not null references public.users(id) on delete cascade,
  type                public.feedback_type not null,
  content             text,
  -- section_key: which section the feedback targets, e.g. 'executive_summary'
  section_key         text,
  status              public.feedback_status not null default 'PENDING',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table public.feedback is 'User feedback on report versions. REVISION_REQUEST triggers workflow.';

-- ============================================================
-- WORKFLOW RUNS
-- Every n8n workflow execution is logged here.
-- This is the primary observability table.
-- Enables cost tracking, performance analysis, and debugging.
-- ============================================================
create type public.workflow_run_status as enum (
  'RUNNING',
  'COMPLETED',
  'FAILED',
  'CANCELLED'
);

create table public.workflow_runs (
  id                  uuid primary key default gen_random_uuid(),
  job_id              uuid references public.jobs(id) on delete set null,
  workflow_name       text not null,
  -- n8n_execution_id is the ID from n8n's own execution log
  -- useful for cross-referencing with the n8n UI
  n8n_execution_id    text,
  status              public.workflow_run_status not null default 'RUNNING',
  -- error_log stores structured error data from n8n
  error_log           jsonb,
  duration_ms         integer,
  tokens_used         integer,
  -- cost_usd is calculated from token counts × model pricing
  cost_usd            numeric(10, 6),
  started_at          timestamptz not null default now(),
  completed_at        timestamptz,
  created_at          timestamptz not null default now()
);

comment on table public.workflow_runs is 'n8n execution log. Primary observability table for cost and performance.';

-- ============================================================
-- SHARE LINKS
-- Public share links for reports.
-- token is a random string (not sequential ID) for security.
-- is_active allows instant revocation without deleting the row.
-- ============================================================
create table public.share_links (
  id          uuid primary key default gen_random_uuid(),
  report_id   uuid not null references public.reports(id) on delete cascade,
  user_id     uuid not null references public.users(id) on delete cascade,
  -- token is what appears in the URL: /share/abc123xyz
  -- generated as a random 12-character alphanumeric string
  token       text not null unique,
  is_active   boolean not null default true,
  -- expires_at null = never expires
  expires_at  timestamptz,
  created_at  timestamptz not null default now()
);

comment on table public.share_links is 'Public share tokens for reports. token appears in URL /share/:token.';

-- ============================================================
-- NOTIFICATIONS
-- In-app notifications for job completion, errors, etc.
-- ============================================================
create table public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  -- type: 'JOB_COMPLETE' | 'JOB_FAILED' | 'REVISION_READY' | 'SYSTEM'
  type        text not null,
  title       text not null,
  body        text,
  is_read     boolean not null default false,
  -- metadata holds type-specific data: job_id, report_id, etc.
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

comment on table public.notifications is 'In-app notifications. Delivered via Supabase Realtime.';

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- Automatically updates the updated_at column on any table
-- that has one. Called via triggers defined below.
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Attach the trigger to every table with updated_at
create trigger handle_updated_at before update on public.users
  for each row execute function public.handle_updated_at();

create trigger handle_updated_at before update on public.jobs
  for each row execute function public.handle_updated_at();

create trigger handle_updated_at before update on public.reports
  for each row execute function public.handle_updated_at();

create trigger handle_updated_at before update on public.feedback
  for each row execute function public.handle_updated_at();