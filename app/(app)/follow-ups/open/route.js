import { NextResponse } from "next/server";
import { ACTIVE_CLIENT_COOKIE, getAppContext } from "@/lib/org";

// From the all-clients follow-up list (pedido 2026-11-17, A1): a row of
// another client switches the app to that client and opens its side panel,
// with the list still showing every client. Only a client the person can
// reach; anything else goes back to the list.
export async function GET(request) {
  const url = new URL(request.url);
  const client = url.searchParams.get("client");
  const open = url.searchParams.get("open") ?? "";
  const back = new URLSearchParams();
  back.set("scope", "all");
  for (const k of ["member"]) if (url.searchParams.get(k)) back.set(k, url.searchParams.get(k));
  const { clients } = await getAppContext();
  const target = new URL(`/follow-ups?${back}`, url.origin);
  if (!clients.some((c) => c.id === client) || !/^[0-9a-f-]{36}\.[0-9a-f-]{36}$/.test(open)) return NextResponse.redirect(target);
  target.searchParams.set("open", open);
  const res = NextResponse.redirect(target);
  res.cookies.set(ACTIVE_CLIENT_COOKIE, client, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 365 });
  return res;
}
