import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Layout for all authenticated app pages.
 *
 * This is a Server Component that validates the session
 * server-side before rendering any child page. If the
 * session is invalid, it redirects to /login immediately —
 * the user never sees a flash of authenticated content.
 *
 * The middleware handles the redirect for most cases, but
 * this provides a second layer of protection specifically
 * for Server Component rendering.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Full app shell (sidebar + topnav) is built in Phase 4 */}
      {children}
    </div>
  )
}