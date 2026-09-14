import { deleteDocument } from "@/lib/document-actions";
import { DOCUMENT_CATEGORIES, formatBytes } from "@/lib/documents";
import { businessDate, formatDate } from "@/lib/credentials";
import SubmitButton from "@/components/app/SubmitButton";

// Documents with a download link (a short-lived signed URL, issued on click)
// and a two-step delete. `showProvider` for the cross-provider Documents page.
export default function DocumentList({ documents, showProvider = false, emptyText = "No documents yet.", readOnly = false }) {
  if (documents.length === 0) return <p className="px-5 py-5 text-sm text-ink-500">{emptyText}</p>;

  return (
    <ul className="divide-y divide-ink-100">
      {documents.map((doc) => (
        <li key={doc.id} className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download via redirect, not a page */}
            <a
              href={`/documents/${doc.id}/download`}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-sm font-medium text-brand-600 hover:underline"
            >
              {doc.file_name}
            </a>
            <p className="text-xs text-ink-500">
              {DOCUMENT_CATEGORIES[doc.category]}
              {showProvider && doc.provider && ` · ${doc.provider.first_name} ${doc.provider.last_name}`}
              {doc.payerName && ` · ${doc.payerName}`}
              {` · ${formatBytes(doc.size_bytes)} · ${formatDate(businessDate(doc.created_at))}`}
            </p>
          </div>
          {!readOnly && (
          <details className="shrink-0 text-xs text-ink-500">
            <summary className="cursor-pointer list-none hover:text-ink-900 [&::-webkit-details-marker]:hidden">Delete</summary>
            <form action={deleteDocument.bind(null, doc.id)} className="mt-1">
              <SubmitButton className="font-medium text-status-expired hover:underline">
                Yes, delete this file
              </SubmitButton>
            </form>
          </details>
          )}
        </li>
      ))}
    </ul>
  );
}
