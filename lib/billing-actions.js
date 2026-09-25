"use server";

import { cookies, headers } from "next/headers";
import { ATTRIBUTION_COOKIE, parseAttribution } from "@/lib/attribution";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAppContext } from "@/lib/org";
import { createPolarClient } from "@/lib/polar";
import { PLANS, PLAN_ORDER } from "@/lib/plans";
import { BUCKET } from "@/lib/documents";
import { INCLUDED_USERS, setSeats } from "@/lib/seats";

async function origin() {
  const h = await headers();
  return process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
    : `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;
}

// Signup always goes through payment (alcance §10.1): the signed-in person
// picks a plan and lands on Polar's hosted checkout, card required, 14-day
// trial. The organization is created only when Polar confirms, by webhook.
export async function startTrial(formData) {
  const planKey = formData.get("plan")?.toString();
  const plan = PLANS[planKey];
  if (!plan?.polarProductId) throw new Error("That plan isn't available.");

  const { user, org } = await getAppContext();
  if (!user) redirect(`/signup?next=${encodeURIComponent(`/start?plan=${planKey}`)}`);
  if (org) redirect("/dashboard");

  // The campaign that brought them (sk_attr, lib/attribution.js), recorded
  // against the user so the account the webhook creates inherits it. Never
  // allowed to stand between someone and the checkout.
  const campaign = parseAttribution((await cookies()).get(ATTRIBUTION_COOKIE)?.value);
  if (campaign) {
    const supabase = await createClient();
    const { error } = await supabase.rpc("cred_record_signup_attribution", campaign);
    if (error) console.error(`signup attribution not recorded: ${error.message}`);
  }

  const checkout = await createCheckout({
    products: [plan.polarProductId],
    externalCustomerId: user.id,
    customerEmail: user.email,
    // The name typed at sign-up; Polar's customer name becomes the account name.
    ...(user.user_metadata?.full_name ? { customerName: user.user_metadata.full_name } : {}),
    metadata: { plan: planKey, user_id: user.id },
    successUrl: `${await origin()}/welcome?checkout_id={CHECKOUT_ID}`,
    ...seatTerms(planKey),
  });
  redirect(checkout.url);
}

// Billing Co is bought with exactly its 10 included users; more are added
// later from Team, where the owner sees the $39/month before confirming.
function seatTerms(planKey, users = INCLUDED_USERS) {
  return planKey === "billing_co" ? { seats: users, minSeats: users, maxSeats: users } : {};
}

async function createCheckout(request) {
  try {
    return await createPolarClient().checkouts.create(request);
  } catch {
    // Polar refuses addresses it considers undeliverable; let the buyer type
    // one on the checkout page instead of failing here.
    const { customerEmail, ...withoutEmail } = request;
    return createPolarClient().checkouts.create(withoutEmail);
  }
}

// Polled by /welcome while the webhook creates the account.
export async function accountReady() {
  const { org } = await getAppContext();
  return Boolean(org);
}

function ownerOnly(ctx) {
  if (ctx.role !== "owner") throw new Error("Only the account owner can manage billing.");
}

// Upgrades take effect as soon as Polar confirms the charge; downgrades
// straight away, with any providers over the new limit turning read-only
// (alcance §4.5). Limits follow the plan by webhook — never set here.
export async function changePlan(formData) {
  const ctx = await getAppContext();
  ownerOnly(ctx);
  const planKey = formData.get("plan")?.toString();
  const plan = PLANS[planKey];
  if (!plan?.polarProductId) throw new Error("That plan isn't available.");
  if (planKey === ctx.org.plan) redirect(`/settings?plan_change=${planKey}#billing`);
  if (!ctx.org.polar_subscription_id) throw new Error("This account has no subscription to change.");

  const upgrade = PLAN_ORDER.indexOf(planKey) > PLAN_ORDER.indexOf(ctx.org.plan);
  const polar = createPolarClient();
  let failed = false;
  try {
    // Polar refuses a product change on a subscription set to cancel
    // (AlreadyCanceledSubscription). Picking a plan means staying, and the
    // card says so before the click — so the cancellation is undone first.
    if (ctx.org.cancel_at_period_end) {
      await polar.subscriptions.update({
        id: ctx.org.polar_subscription_id,
        subscriptionUpdate: { cancelAtPeriodEnd: false },
      });
    }
    await polar.subscriptions.update({
      id: ctx.org.polar_subscription_id,
      subscriptionUpdate: { productId: plan.polarProductId, prorationBehavior: upgrade ? "invoice" : "prorate" },
    });
    // Polar starts a switch into Billing Co at 1 seat; it carries the 10
    // included users (all $0 seats), so set them straight away.
    if (planKey === "billing_co") await setSeats(ctx.org.polar_subscription_id, INCLUDED_USERS);
  } catch (err) {
    console.error(`plan change to ${planKey} failed: ${err.message}`);
    failed = true;
  }
  if (failed) redirect("/settings?plan_error=1#billing");

  revalidatePath("/settings");
  redirect(`/settings?plan_change=${planKey}#billing`);
}

// Payment method, invoices and cancellation live in Polar's customer portal:
// cancelling never needs an email to anyone (alcance §10.2).
export async function openBillingPortal() {
  const ctx = await getAppContext();
  ownerOnly(ctx);
  const session = await createPolarClient().customerSessions.create({
    externalCustomerId: ctx.user.id,
    returnUrl: `${await origin()}/settings?tab=billing`,
  });
  redirect(session.customerPortalUrl);
}

// A new subscription for an account whose previous one ended — or for an
// account created before billing existed, which never had one (that one still
// gets the trial). The webhook links it to the existing account by owner.
export async function resubscribe(formData) {
  const ctx = await getAppContext();
  ownerOnly(ctx);
  const planKey = formData.get("plan")?.toString() ?? ctx.org.plan;
  const plan = PLANS[planKey];
  if (!plan?.polarProductId) throw new Error("That plan isn't available.");
  const checkout = await createCheckout({
    products: [plan.polarProductId],
    externalCustomerId: ctx.user.id,
    customerEmail: ctx.user.email,
    metadata: { plan: planKey, user_id: ctx.user.id },
    allowTrial: !ctx.org.polar_subscription_id,
    successUrl: `${await origin()}/settings?resubscribed=1#billing`,
    ...seatTerms(planKey),
  });
  redirect(checkout.url);
}

// Owner closes the account: the subscription ends now, stored files are
// removed, and the organization goes with everything under it.
export async function deleteAccount(_prev, formData) {
  const ctx = await getAppContext();
  if (ctx.role !== "owner") {
    // Usually a second tab: signing in as someone else replaces the session
    // for the whole browser, while this page still shows the owner.
    return {
      error: `You're signed in as ${ctx.user.email}, who isn't the owner of this account. If you signed in with another account in a different tab, reload this page.`,
    };
  }
  if (formData.get("confirm")?.toString().trim() !== ctx.org.name) {
    return { error: `Type the account name exactly — ${ctx.org.name} — to confirm.` };
  }

  if (ctx.org.polar_subscription_id && ctx.org.subscription_status !== "revoked") {
    try {
      await createPolarClient().subscriptions.revoke({ id: ctx.org.polar_subscription_id });
    } catch (err) {
      return { error: `Couldn't end the subscription with Polar, so nothing was deleted: ${err.message}` };
    }
  }

  // Every client's files — archived ones included, which are readable only
  // when named — since Storage doesn't cascade with the rows.
  const paths = [];
  for (const c of [...ctx.clients, ...ctx.archivedClients]) {
    const scoped = await createClient({ clientOrgId: c.id });
    const { data: docs } = await scoped.from("cred_documents").select("storage_path").eq("client_org_id", c.id);
    paths.push(...(docs ?? []).map((d) => d.storage_path));
  }
  for (let i = 0; i < paths.length; i += 100) {
    await ctx.supabaseAll.storage.from(BUCKET).remove(paths.slice(i, i + 100));
  }

  const { error } = await ctx.supabaseAll.rpc("cred_delete_organization");
  if (error) return { error: `Couldn't delete the account: ${error.message}` };

  await (await createClient()).auth.signOut();
  redirect("/?account=deleted");
}
