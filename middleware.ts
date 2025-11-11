import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Allow public routes
  const publicRoutes = ['/', '/login', '/register', '/about', '/resources', '/volunteer']
  const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + '/'))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check for auth token
  const token = request.cookies.get('auth-token')

  // If accessing dashboard routes without token, redirect to login
  if (request.nextUrl.pathname.startsWith('/dashboard') && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

