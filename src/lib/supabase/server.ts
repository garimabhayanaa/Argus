import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

/**
 * Server-side Supabase client.
 *
 * Use this in:
 *   - Server Components
 *   - API Route Handlers (app/api/...)
 *   - Server Actions
 *
 * It reads and writes auth cookies correctly in the Next.js
 * App Router server environment. Each call creates a fresh
 * client with the current request's cookie store.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll is called from Server Components where cookies
            // cannot be set. This is safe to ignore if you have a
            // middleware refreshing the session.
          }
        },
      },
    }
  )
}