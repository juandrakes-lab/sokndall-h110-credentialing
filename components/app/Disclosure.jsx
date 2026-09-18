"use client";

import { useState } from "react";
import { ICONS, Icon, buttonClass } from "@/components/app/ui";

// A form (or any block) folded behind the button that opens it, so a page shows
// what's on file first and the fields only when someone means to use them.
export default function Disclosure({ label, icon = ICONS.plus, variant = "secondary", size = "md", title, defaultOpen = false, children, className = "", panelClassName = "" }) {
  const [open, setOpen] = useState(defaultOpen);

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={`${buttonClass(variant, size)} ${className}`} aria-expanded="false">
        {icon && <Icon d={icon} className="h-4 w-4" strokeWidth={2} />}
        {label}
      </button>
    );
  }

  return (
    <div className={`rounded-2xl bg-ink-50/80 p-4 ring-1 ring-inset ring-ink-100 sm:p-5 ${panelClassName}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-[0.9375rem] font-semibold text-ink-900">{title ?? label}</h3>
        <button type="button" onClick={() => setOpen(false)} className={buttonClass("ghost", "sm")} aria-expanded="true">
          Close
        </button>
      </div>
      {children}
    </div>
  );
}
