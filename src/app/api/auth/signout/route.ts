import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Sign-out route. Called by the sign-out button in the sidebar.
 *
 * Must be a server-side route — not a client-side call — because
 * only the server can properly clear HttpOnly session cookies.
 *
 * After sign-out, redirect to /login.
 */
export async function POST() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(
    new URL('/login', process.env.NEXT_PUBLIC_APP_URL!)
  )
}