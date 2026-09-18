"use server";

import { revalidatePath } from "next/cache";
import { getAppContext } from "@/lib/org";

// Your own name, kept on the login (the team directory reads it from there).
export async function updateProfile(_prev, formData) {
  const { supabaseAll } = await getAppContext();
  const first = formData.get("first_name")?.toString().trim() ?? "";
  const last = formData.get("last_name")?.toString().trim() ?? "";
  const fieldErrors = {};
  if (!first) fieldErrors.first_name = "Enter your first name.";
  if (!last) fieldErrors.last_name = "Enter your last name.";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const { error } = await supabaseAll.auth.updateUser({ data: { first_name: first, last_name: last, full_name: `${first} ${last}` } });
  if (error) return { error: `Couldn't save: ${error.message}` };
  revalidatePath("/", "layout");
  return { notice: "Saved." };
}

export async function updateOrganization(_prev, formData) {
  const { supabase, org, role } = await getAppContext();
  if (role !== "owner") return { error: "Only the account owner can change these settings." };

  // Each settings form sends only its own field; save what came.
  const hasName = formData.has("name");
  const hasInterval = formData.has("caqh_reattestation_interval_days");
  const name = formData.get("name")?.toString().trim();
  const interval = Number(formData.get("caqh_reattestation_interval_days"));
  const fieldErrors = {};
  if (hasName && !name) fieldErrors.name = "Enter a name.";
  if (hasInterval && (!Number.isInteger(interval) || interval < 30 || interval > 365)) {
    fieldErrors.caqh_reattestation_interval_days = "Enter a number of days between 30 and 365.";
  }
  if (!hasName && !hasInterval) return { error: "Nothing to save." };
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  // Only these two columns are writable by the customer; plan and limits are
  // not (column privileges in the Fase 1 migration).
  const changes = {};
  if (hasName) changes.name = name;
  if (hasInterval) changes.caqh_reattestation_interval_days = interval;
  const { error } = await supabase.from("cred_organizations").update(changes).eq("id", org.id);
  if (error) return { error: `Couldn't save: ${error.message}` };

  revalidatePath("/", "layout");
  return { notice: hasInterval ? "Saved. CAQH due dates were recalculated." : "Saved." };
}

// The alert ladder (alcance §3.11): days before a deadline when an email goes
// out. Expired items always alert once on top of these.
export async function updateAlertDays(_prev, formData) {
  const { supabase, org, role } = await getAppContext();
  if (role !== "owner") return { error: "Only the account owner can change these settings." };

  // One checkbox per day (older clients may still send "90, 60, 30").
  const parts = formData.getAll("alert_days").flatMap((v) => v.toString().split(/[\s,;]+/)).filter(Boolean);
  const days = [...new Set(parts.map(Number))].sort((a, b) => b - a);

  if (parts.length === 0) return { fieldErrors: { alert_days: "Choose at least one day." } };
  if (days.some((d) => !Number.isInteger(d) || d < 1 || d > 365)) {
    return { fieldErrors: { alert_days: "Alert days are whole numbers between 1 and 365." } };
  }
  if (days.length > 8) return { fieldErrors: { alert_days: "Up to 8 alert days." } };

  const { error } = await supabase.from("cred_organizations").update({ alert_days: days }).eq("id", org.id);
  if (error) return { error: `Couldn't save: ${error.message}` };

  revalidatePath("/settings");
  return { notice: `Saved. Alerts go out ${days.join(", ")} days before each deadline, and once when it's passed.`, value: days.join(", ") };
}

const AVATAR_BUCKET = "cred-avatars";

// Your photo, uploaded by the browser to your own folder; this only records it
// on your login and removes the one it replaces.
export async function savePhoto(path) {
  const { supabaseAll, user } = await getAppContext();
  if (!user || typeof path !== "string" || !path.startsWith(`${user.id}/`)) return { error: "That upload doesn't belong to you." };

  const { data } = supabaseAll.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  const previous = user.user_metadata?.photo_path;
  const { error } = await supabaseAll.auth.updateUser({ data: { photo_url: data.publicUrl, photo_path: path } });
  if (error) return { error: `Couldn't save the photo: ${error.message}` };
  if (previous && previous !== path) await supabaseAll.storage.from(AVATAR_BUCKET).remove([previous]);
  revalidatePath("/", "layout");
  return { notice: "Photo saved." };
}

export async function removePhoto() {
  const { supabaseAll, user } = await getAppContext();
  if (!user) return { error: "Sign in again." };
  const previous = user.user_metadata?.photo_path;
  const { error } = await supabaseAll.auth.updateUser({ data: { photo_url: null, photo_path: null } });
  if (error) return { error: `Couldn't remove the photo: ${error.message}` };
  if (previous) await supabaseAll.storage.from(AVATAR_BUCKET).remove([previous]);
  revalidatePath("/", "layout");
  return { notice: "Photo removed." };
}
