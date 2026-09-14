import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Only the authenticated application surface needs the Supabase session
// refresh. Marketing routes (/, /pricing, /payer-enrollment*, /about, …) are
// static and must never trigger an auth round-trip on a crawl or a cache hit.
const APP_PREFIXES = [
  "/dashboard",
  "/clients",
  "/providers",
  "/follow-ups",
  "/enrollments",
  "/settings",
  "/documents",
  "/import-export",
  "/export",
  "/onboarding",
  "/start",
  "/welcome",
  "/invite",
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
    const { response, user } = await updateSession(request);
    // Signed out on a page of the app: sign in, then come back to it.
    // Invitations are readable signed out; auth callbacks finish sign-in;
    // /start sends newcomers to sign-up itself.
    const selfHandled = ["/invite", "/auth", "/start"].some((p) => pathname === p || pathname.startsWith(p + "/"));
    if (!user && !selfHandled) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = `?next=${encodeURIComponent(pathname + request.nextUrl.search)}`;
      return NextResponse.redirect(url);
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/clients/:path*",
    "/providers/:path*",
    "/follow-ups/:path*",
    "/enrollments/:path*",
    "/settings/:path*",
    "/documents/:path*",
    "/import-export/:path*",
    "/export/:path*",
    "/onboarding/:path*",
    "/start/:path*",
    "/welcome/:path*",
    "/invite/:path*",
    "/auth/:path*",
  ],
};
