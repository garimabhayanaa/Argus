/**
 * Standard API response wrapper used by all Next.js API routes.
 * Ensures every response has a consistent shape the frontend can rely on.
 */
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string }

/**
 * Job status values — must match the database enum exactly.
 */
export type JobStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'RESEARCHING'
  | 'GENERATING'
  | 'REVIEWING'
  | 'REVISION_REQUESTED'
  | 'COMPLETED'
  | 'FAILED'
  | 'ARCHIVED'

/**
 * Report status values.
 */
export type ReportStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

/**
 * Payload sent to n8n when a new job is created.
 */
export type N8nJobTriggerPayload = {
  jobId: string
  userId: string
  companyName: string
  companyUrl: string | null
  callbackUrl: string
  secret: string
}

/**
 * Payload n8n sends back to our webhook endpoint to update job state.
 */
export type N8nWebhookPayload =
  | { type: 'JOB_STATUS_UPDATE'; jobId: string; status: JobStatus; metadata?: Record<string, unknown> }
  | { type: 'REPORT_READY'; jobId: string; reportId: string; versionId: string }
  | { type: 'JOB_FAILED'; jobId: string; error: string; workflowName: string }