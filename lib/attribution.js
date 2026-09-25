// The campaign cookie: written on the public pages by components/SiteAnalytics,
// read once when a signed-in person picks a plan (startTrial), which records it
// against their user so the organization the Polar webhook creates inherits it
// (migration 20260924000001_signup_attribution).

export const ATTRIBUTION_COOKIE = "sk_attr";
export const ATTRIBUTION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
export const ATTRIBUTION_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "gclid", "msclkid"];

// Cookie value → the RPC's arguments. Anything malformed reads as no campaign.
export function parseAttribution(raw) {
  if (!raw) return null;
  try {
    const tags = JSON.parse(decodeURIComponent(raw));
    if (!tags || typeof tags !== "object") return null;
    const text = (v, max) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);
    const clickId = text(tags.gclid, 300) ? `gclid:${text(tags.gclid, 290)}` : text(tags.msclkid, 300) ? `msclkid:${text(tags.msclkid, 288)}` : null;
    return {
      p_utm_source: text(tags.utm_source, 200),
      p_utm_medium: text(tags.utm_medium, 200),
      p_utm_campaign: text(tags.utm_campaign, 200),
      p_utm_term: text(tags.utm_term, 200),
      p_click_id: clickId,
      p_landing_path: text(tags.landing_path, 300),
    };
  } catch {
    return null;
  }
}
