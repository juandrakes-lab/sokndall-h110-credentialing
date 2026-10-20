"use client";

import { buttonClass } from "@/components/app/ui";

// Saves the page as a PDF through the browser's own print dialog (its
// "Save as PDF" destination; no PDF library). The suggested file name comes
// from the document title, so it's set to the report's name for the dialog.
export default function PrintButton({ label = "Save as PDF", fileName }) {
  return (
    <span className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-ink-500">In the dialog, choose &ldquo;Save as PDF&rdquo;.</span>
      <button
        type="button"
        onClick={() => {
          const before = document.title;
          if (fileName) document.title = fileName;
          window.print();
          document.title = before;
        }}
        className={buttonClass("primary", "sm")}
      >
        {label}
      </button>
    </span>
  );
}
