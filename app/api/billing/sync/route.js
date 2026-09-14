import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { syncFromPolar } from "@/lib/polar-sync";

// Webhook fallback (alcance §10.1): the signed-in user asks "has my payment
// landed?" and the server checks with Polar itself. Only ever syncs the
// caller's own subscription, looked up at Polar by their user id.
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  try {
    const orgId = await syncFromPolar(createAdminClient(), user.id);
    return NextResponse.json({ ready: Boolean(orgId) });
  } catch (err) {
    console.error(`billing sync failed: ${err.message}`);
    return NextResponse.json({ ready: false }, { status: 502 });
  }
}
