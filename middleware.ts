import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/database'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })

  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession()

  // Protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/upload',
    '/profile',
    '/settings',
    '/collections'
  ]

  // Admin routes that require special permissions
  const adminRoutes = [
    '/admin'
  ]

  const pathname = req.nextUrl.pathname

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/login', req.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Check admin permissions for admin routes
  if (isAdminRoute && session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_verified')
      .eq('id', session.user.id)
      .single()

    if (!profile?.is_verified) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  // Redirect authenticated users away from auth pages
  const authRoutes = ['/auth/login', '/auth/signup', '/auth/reset-password']
  if (authRoutes.includes(pathname) && session) {
    const redirectTo = req.nextUrl.searchParams.get('redirectTo') || '/dashboard'
    return NextResponse.redirect(new URL(redirectTo, req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}