'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/**
 * Signup form — creates a new Supabase Auth user.
 *
 * On success: redirects to /dashboard (session is set immediately
 * because email confirmation is disabled in development).
 *
 * Validation rules:
 *   - Email must be a valid email format
 *   - Password must be at least 8 characters
 *   - Full name is required
 */
export function SignupForm() {
  const router = useRouter()
  const supabase = createClient()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Client-side validation
    if (!fullName.trim()) {
      setError('Please enter your full name.')
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      setIsLoading(false)
      return
    }

    const { error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        // This data goes into auth.users.raw_user_meta_data
        // Our database trigger (migration 003) reads it to
        // populate the public.users profile row
        data: {
          full_name: fullName.trim(),
        },
      },
    })

    if (authError) {
      if (authError.message.includes('User already registered')) {
        setError('An account with this email already exists.')
      } else if (authError.message.includes('Password should be')) {
        setError('Password must be at least 8 characters.')
      } else {
        setError(authError.message)
      }
      setIsLoading(false)
      return
    }

    // Success — the auth trigger will have created the public.users row
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Ada Lovelace"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
          autoFocus
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Minimum 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          disabled={isLoading}
          required
          minLength={8}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  )
}