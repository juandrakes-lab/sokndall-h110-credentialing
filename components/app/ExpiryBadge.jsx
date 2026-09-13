import { Badge } from "@/components/app/ui";
import { daysLabel, daysUntil, severityFor } from "@/lib/credentials";

// Deadline pill on the alert ladder's colours (alcance §3.11): red at 14 days
// or less, amber within 30, neutral within 90, green beyond.
export default function ExpiryBadge({ date }) {
  if (!date) return <Badge tone="neutral">No expiration</Badge>;
  const days = daysUntil(date);
  if (days > 90) return <Badge tone="green">Active</Badge>;
  return <Badge tone={severityFor(days)}>{daysLabel(days)}</Badge>;
}
