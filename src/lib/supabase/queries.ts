import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

type TypedClient = SupabaseClient<Database>

// ── Jobs ──────────────────────────────────────────────────────

export async function getJobById(client: TypedClient, jobId: string) {
  return client
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single()
}

export async function getJobsByUser(client: TypedClient, userId: string) {
  return client
    .from('jobs')
    .select(`
      *,
      reports (
        id,
        title,
        status,
        current_version,
        published_at
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}

export async function updateJobStatus(
  client: TypedClient,
  jobId: string,
  status: Database['public']['Enums']['job_status'],
  metadata?: Record<string, unknown>
) {
  return client
    .from('jobs')
    .update({
      status,
      ...(metadata && { metadata: JSON.stringify(metadata)   }),
      ...(status === 'COMPLETED' || status === 'FAILED'
        ? { completed_at: new Date().toISOString() }
        : {}),
      ...(status === 'PROCESSING'
        ? { started_at: new Date().toISOString() }
        : {}),
    })
    .eq('id', jobId)
    .select()
    .single()
}

// ── Reports ───────────────────────────────────────────────────

export async function getReportById(client: TypedClient, reportId: string) {
  return client
    .from('reports')
    .select(`
      *,
      report_versions (
        id,
        version_number,
        content_markdown,
        content_json,
        content_html,
        sources_used,
        ai_metadata,
        revision_trigger,
        created_at
      )
    `)
    .eq('id', reportId)
    .single()
}

export async function getReportByJobId(client: TypedClient, jobId: string) {
  return client
    .from('reports')
    .select('*')
    .eq('job_id', jobId)
    .single()
}

// ── Messages ──────────────────────────────────────────────────

export async function getMessagesByReport(client: TypedClient, reportId: string) {
  return client
    .from('messages')
    .select('*')
    .eq('report_id', reportId)
    .order('created_at', { ascending: true })
}

// ── Notifications ─────────────────────────────────────────────

export async function getUnreadNotifications(client: TypedClient, userId: string) {
  return client
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('is_read', false)
    .order('created_at', { ascending: false })
    .limit(20)
}

export async function markNotificationRead(client: TypedClient, notificationId: string) {
  return client
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
}

// ── Share Links ───────────────────────────────────────────────

export async function getShareLinkByToken(client: TypedClient, token: string) {
  return client
    .from('share_links')
    .select(`
      *,
      reports (
        id,
        title,
        company_name,
        status,
        current_version,
        published_at
      )
    `)
    .eq('token', token)
    .eq('is_active', true)
    .single()
}

// ── Workflow Runs (observability) ─────────────────────────────

export async function getWorkflowRunsByJob(client: TypedClient, jobId: string) {
  return client
    .from('workflow_runs')
    .select('*')
    .eq('job_id', jobId)
    .order('started_at', { ascending: false })
}