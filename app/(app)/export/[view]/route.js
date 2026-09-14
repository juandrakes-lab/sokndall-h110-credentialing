import { NextResponse } from "next/server";
import { getAppContext } from "@/lib/org";
import { toCsv } from "@/lib/csv";
import { todayISO } from "@/lib/credentials";
import { VIEWS } from "@/lib/export-views";

// CSV export of every list in the app (alcance §3.14); the lists themselves
// live in lib/export-views.js, shared with the per-client export.

export async function GET(request, { params }) {
  const { view } = await params;
  const build = VIEWS[view];
  if (!build) return new NextResponse("Not found", { status: 404 });

  const ctx = await getAppContext();
  if (!ctx.user || !ctx.org) return new NextResponse("Sign in first", { status: 401 });

  const [headers, rows] = await build({ ...ctx, sp: new URL(request.url).searchParams });
  // BOM so Excel opens accents and symbols correctly.
  const body = String.fromCharCode(0xfeff) + toCsv(headers, rows);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sokndall-${view}-${todayISO()}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
