"use client";

import { buttonClass } from "@/components/app/ui";

// The browser's own print dialog, which also saves as PDF. No PDF library.
export default function PrintButton({ label = "Print or save as PDF" }) {
  return (
    <button type="button" onClick={() => window.print()} className={buttonClass("primary", "sm")}>
      {label}
    </button>
  );
}
