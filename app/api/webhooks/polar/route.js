import { NextResponse } from "next/server";
import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks";
import { createAdminClient } from "@/lib/supabase/admin";
import { applySubscription } from "@/lib/polar-sync";

// Polar → Sokndall (alcance §10.2). The only way an organization is created:
// subscription.created (and every later subscription.* event) runs
// cred_sync_subscription, which creates the account on first sight and keeps
// plan, limits, status and dates in step afterwards.
//
//   signature   verified with POLAR_WEBHOOK_SECRET; anything else is a 403
//   idempotent  each delivery id is recorded once in cred_polar_events
//   ordered     an older subscription state never overwrites a newer one
//   quiet       payloads are never logged
export async function POST(request) {
  const body = await request.text();
  const headers = Object.fromEntries(request.headers);

  let event;
  try {
    event = validateEvent(body, headers, process.env.POLAR_WEBHOOK_SECRET);
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }
    // Signed, but not a shape the SDK knows. Events we don't act on are
    // acknowledged so Polar doesn't retry them; a subscription event we can't
    // read is an error worth a retry.
    let type = "";
    try {
      type = JSON.parse(body).type ?? "";
    } catch {}
    if (!type.startsWith("subscription.")) return NextResponse.json({ ignored: type || "unknown" }, { status: 202 });
    return NextResponse.json({ error: "Unreadable event" }, { status: 400 });
  }

  if (!event.type.startsWith("subscription.")) {
    return NextResponse.json({ ignored: event.type });
  }

  const deliveryId = headers["webhook-id"];
  const admin = createAdminClient();

  const { error: seenError } = await admin.from("cred_polar_events").insert({ id: deliveryId, type: event.type });
  if (seenError) {
    if (seenError.code === "23505") return NextResponse.json({ duplicate: true });
    return NextResponse.json({ error: "Could not record the event" }, { status: 500 });
  }

  try {
    await applySubscription(admin, event.data, event.type);

    await admin.from("cred_polar_events").update({ processed_at: new Date().toISOString() }).eq("id", deliveryId);
    return NextResponse.json({ received: true });
  } catch (err) {
    // Forget the delivery so Polar's retry is processed, not skipped.
    await admin.from("cred_polar_events").delete().eq("id", deliveryId);
    console.error(`polar webhook ${event.type} failed: ${err.message}`);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
