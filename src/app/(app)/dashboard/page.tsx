import { createClient } from '@/lib/supabase/server'

/**
 * Dashboard placeholder — will be replaced with the real
 * dashboard in Phase 4.
 */
export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground">
          Phase 3 — Authentication Complete
        </div>
        <h1 className="text-2xl font-medium">Welcome to Argus</h1>
        <p className="text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{user?.email}</span>
        </p>
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  )
}