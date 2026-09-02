import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Only the authenticated application surface needs the Supabase session
// refresh. Marketing routes (/, /pricing, /payer-enrollment*, /about, …) are
// static and must never trigger an auth round-trip on a crawl or a cache hit.
const APP_PREFIXES = [
  "/dashboard",
  "/providers",
  "/payers",
  "/enrollments",
  "/credentials",
  "/onboarding",
];

function isAppPath(pathname) {
  if (pathname.startsWith("/auth")) return true;
  return APP_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // "/" stays fully static. Bounce signed-in users into the app with a cheap
  // cookie-presence check — no Supabase client, no network, no Set-Cookie, so
  // the prerendered landing page is still served from cache for everyone else.
  // A stale/expired token cookie sends the user to /dashboard, where the app
  // layout re-checks the session and forwards to /login if it is invalid.
  if (pathname === "/") {
    const hasAuthCookie = request.cookies
      .getAll()
      .some((c) => c.name.includes("-auth-token"));
    if (hasAuthCookie) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (isAppPath(pathname)) {
    const { response } = await updateSession(request);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/providers/:path*",
    "/payers/:path*",
    "/enrollments/:path*",
    "/credentials/:path*",
    "/onboarding/:path*",
    "/auth/:path*",
  ],
};
