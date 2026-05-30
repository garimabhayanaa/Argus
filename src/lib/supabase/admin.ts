import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

/**
 * Admin Supabase client using the service role key.
 *
 * IMPORTANT: This client BYPASSES Row-Level Security entirely.
 * Use it ONLY in:
 *   - /api/webhooks/n8n (receiving callbacks from n8n)
 *   - Server-side admin operations that legitimately need
 *     cross-user data access
 *
 * NEVER import this in Client Components or expose it to
 * the browser. The service role key must stay server-only.
 */
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set. Cannot create admin client.')
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        // Disable auto-refresh — admin client is used in
        // short-lived server contexts, not long-running sessions
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}