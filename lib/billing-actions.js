"use server";

import { DEMO_ACTION_ERROR } from "@/lib/demo";

import { cookies, headers } from "next/headers";
import { ATTRIBUTION_COOKIE, REFERRAL_CODE, REFERRAL_COOKIE, REFERRAL_NOTE_COOKIE, parseAttribution } from "@/lib/attribution";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAppContext, providerUsage } from "@/lib/org";
import { createPolarClient } from "@/lib/polar";
import { PLANS, PLAN_ORDER, downgradeBlockers } from "@/lib/plans";
import { seatsInUse } from "@/lib/seats";
import { BUCKET } from "@/lib/documents";
import { INCLUDED_USERS, setSeats } from "@/lib/seats";
import { EXTRA, reportExtraProviders } from "@/lib/extra-providers";

async function origin() {
  const h = await headers();
  return process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
    : `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;
}

function decodeCookie(raw) {
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return null;
  }
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
  const jar = await cookies();
  const campaign = parseAttribution(jar.get(ATTRIBUTION_COOKIE)?.value);
  if (campaign) {
    const supabase = await createClient();
    const { error } = await supabase.rpc("cred_record_signup_attribution", campaign);
    if (error) console.error(`signup attribution not recorded: ${error.message}`);
  }
  // The partner's link and the "Did someone recommend Sokndall?" answer
  // (migration 20261110000000_cred_referrals). Same rule: never in the way.
  const refCode = decodeCookie(jar.get(REFERRAL_COOKIE)?.value)?.toLowerCase();
  const refNote = decodeCookie(jar.get(REFERRAL_NOTE_COOKIE)?.value) ?? user.user_metadata?.referral_note;
  if ((refCode && REFERRAL_CODE.test(refCode)) || refNote?.trim()) {
    const supabase = await createClient();
    const { error } = await supabase.rpc("cred_record_signup_referral", {
      p_ref_code: refCode && REFERRAL_CODE.test(refCode) ? refCode : null,
      p_note: refNote?.trim().slice(0, 300) || null,
    });
    if (error) console.error(`signup referral not recorded: ${error.message}`);
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
// Practice is bought with its 15 included providers as seats; extra ones are
// added later from Settings → Billing.
function seatTerms(planKey, users = INCLUDED_USERS) {
  if (planKey === "billing_co") return { seats: users, minSeats: users, maxSeats: users };
  if (planKey === "practice") return { seats: EXTRA.practice.included, minSeats: EXTRA.practice.included, maxSeats: EXTRA.practice.included };
  return {};
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
// straight away, and only once the account fits the smaller plan
// (downgradeBlockers; founder decision 2026-11-11). Limits follow the plan by webhook — never set here.
export async function changePlan(formData) {
  if ((await getAppContext()).org?.demo) throw new Error(DEMO_ACTION_ERROR);
  const ctx = await getAppContext();
  ownerOnly(ctx);
  const planKey = formData.get("plan")?.toString();
  const plan = PLANS[planKey];
  if (!plan?.polarProductId) throw new Error("That plan isn't available.");
  if (planKey === ctx.org.plan) redirect(`/settings?plan_change=${planKey}#billing`);
  if (!ctx.org.polar_subscription_id) throw new Error("This account has no subscription to change.");

  const upgrade = PLAN_ORDER.indexOf(planKey) > PLAN_ORDER.indexOf(ctx.org.plan);
  // A smaller plan only once everything fits in it (the card lists what to
  // reduce); re-checked here whatever the page showed.
  if (!upgrade) {
    const [usage, { data: members }, { data: invitations }] = await Promise.all([
      providerUsage(ctx.supabaseAll, ctx.org.id),
      ctx.supabaseAll.rpc("cred_org_directory"),
      ctx.supabaseAll.from("cred_invitations").select("accepted_at, expires_at").eq("org_id", ctx.org.id),
    ]);
    const blockers = downgradeBlockers(planKey, { providers: usage.count, users: seatsInUse(members ?? [], invitations ?? []), clients: ctx.clients.length });
    if (blockers.length) redirect("/settings?tab=billing#billing");
  }
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
    // Into Practice: its seats are providers — 15, or what is in use (≤ 30,
    // downgradeBlockers made sure), so nothing goes over the new limit.
    if (planKey === "practice") {
      const used = (await providerUsage(ctx.supabaseAll, ctx.org.id)).count;
      await setSeats(ctx.org.polar_subscription_id, Math.max(EXTRA.practice.included, used));
    }
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
  if ((await getAppContext()).org?.demo) throw new Error(DEMO_ACTION_ERROR);
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
  if ((await getAppContext()).org?.demo) throw new Error(DEMO_ACTION_ERROR);
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
    ...trialTerms(ctx.org),
    successUrl: `${await origin()}/settings?resubscribed=1#billing`,
    ...seatTerms(planKey),
  });
  redirect(checkout.url);
}

// The trial a resubscribe checkout carries. An account that never had a
// subscription gets the product's trial — except a card-free trial
// (cred_start_cardless_trial), whose free days were already given: a card
// added during it is first charged when it ends (whole days, so within half a
// day of the end), and once it has ended, straight away.
function trialTerms(org) {
  if (org.polar_subscription_id) return { allowTrial: false };
  if (!org.trial_ends_at) return { allowTrial: true };
  const days = Math.round((new Date(org.trial_ends_at) - Date.now()) / 86400000);
  return days >= 1 ? { allowTrial: true, trialInterval: "day", trialIntervalCount: days } : { allowTrial: false };
}

// Owner closes the account: the subscription ends now, stored files are
// removed, and the organization goes with everything under it.
export async function deleteAccount(_prev, formData) {
  if ((await getAppContext()).org?.demo) return { error: DEMO_ACTION_ERROR };
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

// Settings → Billing: how many extra providers the account pays for.
//   Practice    Polar seats = 15 + extra (≤ 30); raising is charged now,
//               prorated; lowering applies at renewal. The webhook brings the
//               new limit back; the page waits for it.
//   Billing Co  set here at once; billed on the next invoice at the month's
//               highest number (reported to Polar's meter).
// Never below what is active: the owner marks providers inactive first.
export async function changeExtraProviders(_prev, formData) {
  const ctx = await getAppContext();
  if (ctx.org?.demo) return { error: DEMO_ACTION_ERROR };
  if (ctx.role !== "owner") return { error: "Only the account owner can change this." };
  const rule = EXTRA[ctx.org.plan];
  if (!rule) return { error: "Extra providers are part of Practice and Billing Co." };
  const extra = Number.parseInt(formData.get("extra")?.toString() ?? "", 10);
  const max = rule.max === null ? 1000 : rule.max - rule.included;
  if (!Number.isInteger(extra) || extra < 0 || extra > max) {
    return { error: rule.max === null ? "Choose a number from 0 up." : `Choose between 0 and ${max} extra providers.` };
  }
  const used = (await providerUsage(ctx.supabaseAll, ctx.org.id)).count;
  if (rule.included + extra < used) {
    return { error: `${used} providers are active. Mark ${used - rule.included - extra} inactive before lowering to ${rule.included + extra}.` };
  }

  if (ctx.org.plan === "practice") {
    if (!ctx.org.polar_subscription_id) return { error: "Add a card in Billing first; extra providers go on the subscription." };
    try {
      const r = await setSeats(ctx.org.polar_subscription_id, rule.included + extra);
      revalidatePath("/settings");
      return { done: true, waiting: r.seats !== ctx.org.provider_limit, pending: r.pendingSeats, pendingAt: r.pendingAt };
    } catch (err) {
      console.error(`practice seats change failed: ${err.message}`);
      return { error: "Polar didn't accept the change, and nothing was charged. Try again in a minute; if it keeps happening, use the help button." };
    }
  }

  const { error } = await ctx.supabaseAll.rpc("cred_set_extra_providers", { p_count: extra });
  if (error) return { error: error.message.replace(/^[A-Z_]+: /, "") };
  if (ctx.org.polar_subscription_id) {
    await reportExtraProviders(ctx.user.id, extra).catch((err) => console.error(`meter report failed: ${err.message}`));
  }
  revalidatePath("/", "layout");
  return { done: true };
}
