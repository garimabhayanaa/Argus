-- ============================================================
-- Migration 003: pgvector extension + auth trigger
--
-- pgvector adds a vector column type to PostgreSQL.
-- We use it to store text embeddings of research sources,
-- enabling semantic similarity search for follow-up chat (RAG).
--
-- The auth trigger automatically creates a public.users profile
-- row whenever a new user signs up via Supabase Auth.
-- ============================================================

-- Enable pgvector
create extension if not exists vector;

-- Add embedding column to research_sources.
-- 1536 dimensions = OpenAI text-embedding-3-small output size.
-- We use this because it's the standard size and well-supported by pgvector indexes.
alter table public.research_sources
  add column embedding vector(1536);

comment on column public.research_sources.embedding
  is '1536-dimension text embedding. Used for semantic similarity search in follow-up chat.';

-- Create an IVFFlat index for fast approximate nearest-neighbor search.
-- lists=100 is appropriate for tables under ~1M rows.
-- We create this index now so it exists when data starts flowing.
create index research_sources_embedding_idx
  on public.research_sources
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- ============================================================
-- AUTH USER TRIGGER
-- When a new user signs up via Supabase Auth, automatically
-- create a corresponding row in public.users.
-- This runs as a database trigger — not application code —
-- so it works regardless of how the user signs up
-- (email, OAuth, magic link, etc.).
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    -- raw_user_meta_data holds name from OAuth providers
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Attach trigger to auth.users (Supabase's managed auth table)
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- INDEXES
-- These improve query performance for the most common access
-- patterns in the application.
-- ============================================================

-- Jobs: fetch all jobs for a user (dashboard query)
create index jobs_user_id_idx on public.jobs(user_id);
-- Jobs: filter by status (admin / monitoring queries)
create index jobs_status_idx on public.jobs(status);
-- Jobs: sort by creation date (default sort on dashboard)
create index jobs_created_at_idx on public.jobs(created_at desc);

-- Reports: fetch report by job (post-generation lookup)
create index reports_job_id_idx on public.reports(job_id);
-- Reports: fetch all reports for a user
create index reports_user_id_idx on public.reports(user_id);

-- Report versions: fetch all versions for a report
create index report_versions_report_id_idx on public.report_versions(report_id);

-- Research sources: fetch all sources for a job
create index research_sources_job_id_idx on public.research_sources(job_id);

-- Messages: fetch conversation for a report (ordered by time)
create index messages_report_id_created_idx on public.messages(report_id, created_at);

-- Notifications: fetch unread notifications for a user
create index notifications_user_id_read_idx on public.notifications(user_id, is_read);

-- Share links: look up by token (the most frequent query — /share/:token page)
create index share_links_token_idx on public.share_links(token);

-- Workflow runs: fetch runs for a job (observability queries)
create index workflow_runs_job_id_idx on public.workflow_runs(job_id);