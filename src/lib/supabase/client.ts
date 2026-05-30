import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

/**
 * Browser-side Supabase client.
 *
 * Use this in Client Components ('use client') only.
 * It reads auth state from cookies automatically via @supabase/ssr.
 *
 * Never use this in API routes or Server Components — use
 * the server client instead to avoid session leakage.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}