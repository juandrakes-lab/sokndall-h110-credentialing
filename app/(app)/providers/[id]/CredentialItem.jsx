"use client";

import { useCallback, useState } from "react";
import ExpiryBadge from "@/components/app/ExpiryBadge";
import { buttonClass } from "@/components/app/ui";
import { CREDENTIAL_TYPES, credentialSummary, formatDate } from "@/lib/credentials";
import CredentialForm from "./CredentialForm";
import SubmitButton from "@/components/app/SubmitButton";

export default function CredentialItem({ credential, updateAction, deleteAction, caqhIntervalDays, members = [], readOnly = false, lastName, registryLicenses = [] }) {
  const [mode, setMode] = useState("view"); // "view" | "edit" | "confirm-delete"
  const close = useCallback(() => setMode("view"), []);
  const config = CREDENTIAL_TYPES[credential.type];
  const summary = credentialSummary(credential);

  const dateLine =
    credential.type === "caqh_attestation"
      ? `Attested ${formatDate(credential.issue_date)} · next due ${formatDate(credential.expiration_date)}`
      : [
          credential.issue_date && config.labels.issue_date && `${config.labels.issue_date} ${formatDate(credential.issue_date)}`,
          credential.expiration_date && `${config.labels.expiration_date} ${formatDate(credential.expiration_date)}`,
        ]
          .filter(Boolean)
          .join(" · ");

  return (
    <li className="px-5 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-ink-900">{config.label}</span>
            <ExpiryBadge date={credential.expiration_date} />
          </div>
          {summary && <p className="mt-0.5 text-sm text-ink-900">{summary}</p>}
          {dateLine && <p className="mt-0.5 text-sm text-ink-500">{dateLine}</p>}
          {credential.notes && <p className="mt-1 text-sm text-ink-500">{credential.notes}</p>}
        </div>

        {mode === "view" && !readOnly && (
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={() => setMode("edit")} className={buttonClass("secondary", "sm")}>
              Edit
            </button>
            <button type="button" onClick={() => setMode("confirm-delete")} className={buttonClass("ghost", "sm")}>
              Delete
            </button>
          </div>
        )}

        {mode === "confirm-delete" && (
          <form action={deleteAction} className="flex shrink-0 flex-wrap items-center gap-2">
            <span className="text-sm text-ink-700">Delete this credential?</span>
            <SubmitButton className={buttonClass("danger", "sm")}>
              Delete
            </SubmitButton>
            <button type="button" onClick={close} className={buttonClass("secondary", "sm")}>
              Keep it
            </button>
          </form>
        )}
      </div>

      {mode === "edit" && (
        <div className="mt-4 rounded-2xl bg-ink-50/80 p-4 ring-1 ring-inset ring-ink-100">
          <CredentialForm
            action={updateAction}
            initial={credential}
            caqhIntervalDays={caqhIntervalDays}
            lastName={lastName}
            registryLicenses={registryLicenses}
            members={members}
            submitLabel="Save changes"
            onDone={close}
          />
          <button type="button" onClick={close} className={`${buttonClass("link")} mt-3 text-sm`}>
            Cancel
          </button>
        </div>
      )}
    </li>
  );
}
