"use client";

import { useEffect, useState } from "react";

const format = (iso, timeZone) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
    ...(timeZone ? { timeZone } : {}),
  }).format(new Date(iso));

// A moment in the viewer's own time zone ("Nov 12, 2026, 3:30 AM GMT+5").
// The server doesn't know where the viewer is, so the first render says it in
// UTC and the browser swaps in local time as soon as it loads.
export default function LocalDateTime({ iso }) {
  const [text, setText] = useState(() => format(iso, "UTC"));
  useEffect(() => setText(format(iso)), [iso]);
  return (
    <time dateTime={iso} suppressHydrationWarning>
      {text}
    </time>
  );
}
