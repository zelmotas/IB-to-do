import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@/utils/supabase/middleware"

export async function middleware(request: NextRequest) {
  try {
    // Create a Supabase client configured to use cookies
    const { supabase, response } = createClient(request)

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Authentication check for protected routes
    const isAuthRoute =
      request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/signup") ||
      request.nextUrl.pathname.startsWith("/reset-password") ||
      request.nextUrl.pathname.startsWith("/update-password")

    const isProtectedRoute =
      request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/chat") ||
      request.nextUrl.pathname.startsWith("/tasks") ||
      request.nextUrl.pathname.startsWith("/calendar") ||
      request.nextUrl.pathname.startsWith("/settings")

    // If user is signed in and tries to access auth routes, redirect to dashboard
    if (session && isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // If user is not signed in and tries to access protected routes, redirect to login
    if (!session && isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // If user is not signed in and tries to access the root, redirect to login
    if (!session && request.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return response
  } catch (e) {
    // If there's an error, just continue to the destination
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
}
