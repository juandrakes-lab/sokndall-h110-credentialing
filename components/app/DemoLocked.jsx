"use client";

import Link from "next/link";
import { useState } from "react";
import { buttonClass } from "@/components/app/ui";
import { logDemoBlocked } from "@/lib/demo-actions";

const WHY = {
  import: "In the demo you can't import spreadsheets.",
  documents: "In the demo you can't upload documents.",
  upload_link: "In the demo you can't send upload links to providers.",
  invite: "In the demo you can't invite your team.",
  billing: "In the demo there's no billing or plan to change.",
  delete: "The demo can't be deleted from here. It deletes itself when it ends.",
};

// A feature the demo shows but doesn't run: the same button, and a short
// note with the way forward when it's tapped (spec: friction on purpose).
export default function DemoLocked({ feature, label, variant = "secondary", size }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={buttonClass(variant, size)}
        onClick={() => {
          setOpen(true);
          logDemoBlocked(feature).catch(() => {});
        }}
      >
        {label}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/30 px-5" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <p className="text-base font-semibold text-ink-900">Not in the demo</p>
            <p className="mt-2 text-sm text-ink-700">
              {WHY[feature] ?? "This isn't available in the demo."} In your real account we do it for you.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/real-data" className={buttonClass("primary")}>
                Load my real data
              </Link>
              <button type="button" className={buttonClass("secondary")} onClick={() => setOpen(false)}>
                Keep exploring
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
