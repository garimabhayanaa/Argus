import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware runs on every matched request before the page renders.
 *
 * Responsibilities:
 *   1. Refresh the Supabase auth session (keeps JWT fresh)
 *   2. Redirect unauthenticated users from protected routes to /login
 *   3. Redirect authenticated users away from auth pages to /dashboard
 *
 * IMPORTANT: We must call supabase.auth.getUser() here — not
 * getSession(). getSession() reads from cookies without verifying
 * the JWT signature, which is a security risk in middleware.
 * getUser() makes a network call to Supabase to verify the token.
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Write cookies to both the request (for downstream
          // middleware) and the response (for the browser)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Verify the session. This refreshes the token if it's expired.
  // Do NOT use getSession() here — getUser() is required for security.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Define route categories
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup')
  const isProtectedRoute = pathname.startsWith('/dashboard') ||
    pathname.startsWith('/new') ||
    pathname.startsWith('/jobs') ||
    pathname.startsWith('/reports') ||
    pathname.startsWith('/settings')
  const isApiRoute = pathname.startsWith('/api')
  const isShareRoute = pathname.startsWith('/share')

  // API routes and share routes handle their own auth
  if (isApiRoute || isShareRoute) {
    return supabaseResponse
  }

  // Unauthenticated user trying to access a protected route
  if (!user && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url)
    // Preserve the intended destination so we can redirect after login
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Authenticated user trying to access login/signup
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}