// Dev tool, not part of the app runtime: replays Polar's real subscription
// webhooks to a local dev server.
//
// Polar can only deliver webhooks to a public URL (the registered endpoint),
// never to localhost. After a real sandbox checkout, this fetches the events
// Polar actually sent in the last --minutes (default 60), re-signs each exact
// payload with the local POLAR_WEBHOOK_SECRET and posts it to the local route.
// The Polar event id is kept as the delivery id, so running it twice is safe.
//
// Usage: node scripts/relay-polar-webhooks.mjs [base-url] [--minutes 60] [--watch]
// --watch keeps polling every 10 seconds (for a hands-on checkout test).

import { readFileSync } from "node:fs";
import { Polar } from "@polar-sh/sdk";
import { Webhook } from "standardwebhooks";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((line) => line.includes("=") && !line.trim().startsWith("#"))
    .map((line) => {
      const idx = line.indexOf("=");
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);

const args = process.argv.slice(2);
const BASE = args.find((a) => a.startsWith("http")) ?? "http://localhost:3100";
const minutes = args.includes("--minutes") ? Number(args[args.indexOf("--minutes") + 1]) : 60;
const since = Date.now() - minutes * 60000;

const polar = new Polar({ accessToken: env.POLAR_ACCESS_TOKEN, server: env.POLAR_SERVER === "production" ? "production" : "sandbox" });
const signer = new Webhook(Buffer.from(env.POLAR_WEBHOOK_SECRET, "utf-8"), { format: "raw" });

const relayed = new Set();

async function relayOnce() {
  const events = new Map();
  for await (const page of await polar.webhooks.listWebhookEndpoints({})) {
    for (const endpoint of page.result.items) {
      for await (const dpage of await polar.webhooks.listWebhookDeliveries({ endpointId: endpoint.id })) {
        for (const d of dpage.result.items) {
          const e = d.webhookEvent;
          if (!e?.payload || !String(e.type).startsWith("subscription.")) continue;
          if (new Date(e.createdAt).getTime() < since || relayed.has(e.id)) continue;
          events.set(e.id, e);
        }
      }
    }
  }

  const ordered = [...events.values()].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  if (ordered.length || !watch) console.log(`${ordered.length} new subscription event(s) from the last ${minutes} minutes`);

  for (const e of ordered) {
    const ts = new Date();
    const res = await fetch(`${BASE}/api/webhooks/polar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "webhook-id": e.id,
        "webhook-timestamp": String(Math.floor(ts.getTime() / 1000)),
        "webhook-signature": signer.sign(e.id, ts, e.payload),
      },
      body: e.payload,
    });
    if (res.ok) relayed.add(e.id);
    console.log(`${e.type} → ${res.status} ${await res.text()}`);
  }
}

const watch = args.includes("--watch");
do {
  try {
    await relayOnce();
  } catch (err) {
    console.log(`relay error: ${err.message}`);
  }
  if (watch) await new Promise((r) => setTimeout(r, 10000));
} while (watch);
