import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // Public routes — most of AINN is public (it's a news site)
  const publicRoutes = [
    "/",
    "/news",
    "/section",
    "/widget",
    "/standards",
    "/corrections",
    "/about",
    "/disclosure",
    "/subscribe",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/api/auth",
    "/api/cron",
    "/api/og",
    "/api/sitemap",
    "/api/wire",
    "/api/newsletter",
    "/api/follow",
    "/api/webhook",
    "/feed.xml",
  ];

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // The homepage and news pages are always public
  if (isPublicRoute || pathname === "/") {
    return NextResponse.next();
  }

  // Protected routes: /admin, /api/admin, /archive, /logs, /database
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.png|robots.txt).*)",
  ],
};
