import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'Sign in',
}

/**
 * Login page — server component wrapper.
 * The actual form is a client component (login-form.tsx)
 * because it needs useState for form state and error handling.
 *
 * This pattern — server component page + client component form —
 * is the standard Next.js App Router pattern for auth pages.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string; error?: string }
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Argus</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        {/* Error from callback */}
        {searchParams.error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Authentication failed. Please try again.
          </div>
        )}

        <LoginForm redirectTo={searchParams.redirectTo} />

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}