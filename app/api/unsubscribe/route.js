import { NextResponse } from "next/server";
import { unsubscribe } from "@/lib/template-lead-actions";

// RFC 8058 one-click unsubscribe: Gmail's and Outlook's own "Unsubscribe"
// button posts here (List-Unsubscribe-Post). A plain GET — someone pasting
// the URL — goes to the page, which asks for the click.
export async function POST(request) {
  const token = request.nextUrl.searchParams.get("t");
  await unsubscribe(token);
  return new NextResponse(null, { status: 200 });
}

export async function GET(request) {
  const url = request.nextUrl.clone();
  url.pathname = "/unsubscribe";
  return NextResponse.redirect(url);
}
