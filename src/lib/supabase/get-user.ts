import { createClient } from '@/lib/supabase/server'

/**
 * Server-side helper to get the current authenticated user.
 *
 * Use this in API route handlers and Server Components.
 * Returns null if there is no authenticated session.
 *
 * Usage in an API route:
 *   const user = await getAuthenticatedUser()
 *   if (!user) return unauthorizedResponse()
 */
export async function getAuthenticatedUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return null
  return user
}

/**
 * Standard unauthorized response for API routes.
 */
export function unauthorizedResponse() {
  return Response.json(
    { success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' },
    { status: 401 }
  )
}