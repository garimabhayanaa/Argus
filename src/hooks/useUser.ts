'use client'

import { useAuth } from '@/components/providers/auth-provider'

/**
 * Convenience hook that returns only the user object.
 * Use this when you need the user but not the full session.
 *
 * Usage:
 *   const { user, isLoading } = useUser()
 *   if (isLoading) return <Spinner />
 *   if (!user) redirect('/login')
 */
export function useUser() {
  const { user, isLoading } = useAuth()
  return { user, isLoading }
}