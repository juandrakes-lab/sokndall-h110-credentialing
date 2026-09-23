"use client";

import { usePathname } from "next/navigation";
import { SUPPORT_EMAIL } from "@/lib/legal";
import { ICONS, Icon } from "@/components/app/ui";

// Help, everywhere in the app: a mailto with the answers already in it — the
// account, the plan, the client that was open and the screen they were on —
// so the first reply can be the answer instead of four questions. No form,
// no widget, no third party reading the page.
export function helpHref({ org, plan, client, path }) {
  const lines = [
    "",
    "",
    "— so we can help faster, please leave this below —",
    `Account: ${org}`,
    `Plan: ${plan}`,
    ...(client ? [`Client open: ${client}`] : []),
    `Screen: ${path}`,
  ];
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Sokndall help — ${org}`)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

export default function HelpLink({ help, variant = "tool", onDone }) {
  const pathname = usePathname();
  const href = helpHref({ ...help, path: pathname });

  if (variant === "row") {
    return (
      <a href={href} onClick={onDone} className="flex items-center gap-3 rounded-xl px-3 py-3 text-[0.9375rem] font-medium text-ink-900">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-100 text-ink-700">
          <Icon d={ICONS.help} className="h-[18px] w-[18px]" />
        </span>
        Help
      </a>
    );
  }

  return (
    <a
      href={href}
      title="Help — writes us an email with your account details"
      aria-label="Help"
      className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-700 transition-colors hover:bg-white/70 hover:text-ink-900"
    >
      <Icon d={ICONS.help} className="h-[19px] w-[19px]" />
    </a>
  );
}
