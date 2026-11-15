import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only protect the /admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check if the user has the admin_token cookie
    const hasToken = request.cookies.has('admin_token')

    // If no cookie, redirect to the login page
    if (!hasToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

// Tell Next.js to only run this on the /admin path
export const config = {
  matcher: '/admin/:path*',
}