import { Card, CardHeader, ICONS, Meter } from "@/components/app/ui";

// The onboarding checklist (alcance §3.10): what's ready, and what's still
// missing before an application can be submitted.
export default function ChecklistCard({ items }) {
  const done = items.filter((i) => i.done).length;
  const complete = done === items.length;

  return (
    <Card>
      <CardHeader
        icon={ICONS.check}
        title="Ready to enroll?"
        description={complete ? "Everything payers ask for is on file." : `${done} of ${items.length} ready. Payers ask for all of these.`}
      />
      <div className="px-5 pt-4">
        <Meter value={items.length ? done / items.length : 0} tone={complete ? "green" : "amber"} />
      </div>
      <ul className="divide-y divide-ink-100">
        {items.map((item) => (
          <li key={item.key} className="flex gap-3 px-5 py-2.5">
            <span
              aria-hidden="true"
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                item.done
                  ? "bg-status-active-bg text-status-active"
                  : item.warn
                    ? "bg-status-expiring-bg text-status-expiring"
                    : "border border-dashed border-ink-500 text-transparent"
              }`}
            >
              {item.warn && !item.done ? "!" : "✓"}
            </span>
            <div>
              <p className={`text-sm ${item.done ? "text-ink-700" : "font-semibold text-ink-900"}`}>
                {item.label}
                <span className="sr-only">{item.done ? " — done" : item.warn ? " — needs attention" : " — missing"}</span>
              </p>
              {!item.done && <p className={`text-xs ${item.warn ? "text-status-expiring" : "text-ink-500"}`}>{item.todo}</p>}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
