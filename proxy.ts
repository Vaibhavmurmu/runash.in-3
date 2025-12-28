import { NextResponse } from "next/server"
import type { NextRequest } from "next/request"

export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get("auth_session")?.value
  const { pathname } = request.nextUrl

  // Protected routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/settings")) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Auth routes (redirect to dashboard if already logged in)
  if (pathname === "/login" || pathname === "/register") {
    if (sessionToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/login", "/register"],
}
