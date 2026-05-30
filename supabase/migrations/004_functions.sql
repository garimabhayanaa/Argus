-- ============================================================
-- Migration 004: Database utility functions
-- ============================================================

-- ============================================================
-- MATCH RESEARCH SOURCES (vector similarity search)
-- Called by the follow-up chat workflow to find relevant
-- source chunks for a given question embedding.
--
-- Parameters:
--   query_embedding  — the embedding of the user's question
--   match_job_id     — scope search to a specific job's sources
--   match_threshold  — minimum cosine similarity (0.0–1.0)
--   match_count      — max number of results to return
-- ============================================================
create or replace function public.match_research_sources(
  query_embedding  vector(1536),
  match_job_id     uuid,
  match_threshold  float default 0.7,
  match_count      int default 8
)
returns table (
  id            uuid,
  job_id        uuid,
  source_type   text,
  url           text,
  title         text,
  content_raw   text,
  metadata      jsonb,
  similarity    float
)
language plpgsql
as $$
begin
  return query
  select
    rs.id,
    rs.job_id,
    rs.source_type,
    rs.url,
    rs.title,
    rs.content_raw,
    rs.metadata,
    -- cosine similarity: 1 = identical, 0 = orthogonal, -1 = opposite
    1 - (rs.embedding <=> query_embedding) as similarity
  from public.research_sources rs
  where
    rs.job_id = match_job_id
    and rs.embedding is not null
    and 1 - (rs.embedding <=> query_embedding) > match_threshold
  order by rs.embedding <=> query_embedding
  limit match_count;
end;
$$;

comment on function public.match_research_sources
  is 'Vector similarity search over research sources. Used for RAG in follow-up chat.';

-- ============================================================
-- GET REPORT WITH CURRENT VERSION
-- Convenience function that returns a report joined to its
-- current version. Used by the report viewer API route.
-- ============================================================
create or replace function public.get_report_with_version(p_report_id uuid)
returns table (
  report_id          uuid,
  title              text,
  company_name       text,
  company_url        text,
  report_status      public.report_status,
  current_version    integer,
  quality_score      jsonb,
  published_at       timestamptz,
  version_id         uuid,
  version_number     integer,
  content_markdown   text,
  content_json       jsonb,
  content_html       text,
  sources_used       jsonb,
  ai_metadata        jsonb,
  revision_trigger   text,
  version_created_at timestamptz
)
language plpgsql
as $$
begin
  return query
  select
    r.id,
    r.title,
    r.company_name,
    r.company_url,
    r.status,
    r.current_version,
    r.quality_score,
    r.published_at,
    rv.id,
    rv.version_number,
    rv.content_markdown,
    rv.content_json,
    rv.content_html,
    rv.sources_used,
    rv.ai_metadata,
    rv.revision_trigger,
    rv.created_at
  from public.reports r
  join public.report_versions rv
    on rv.report_id = r.id
    and rv.version_number = r.current_version
  where r.id = p_report_id;
end;
$$;