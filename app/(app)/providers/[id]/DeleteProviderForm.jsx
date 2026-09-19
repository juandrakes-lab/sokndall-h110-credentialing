"use client";

import { useActionState, useState } from "react";
import { FormError, buttonClass, inputClass } from "@/components/app/ui";
import SubmitButton from "@/components/app/SubmitButton";

// Deleting a provider takes years of history with it, so it asks for the
// provider's full name first (alcance §6, rev. 2026-09-18). The server checks
// the name again.
export default function DeleteProviderForm({ action, fullName }) {
  const [state, formAction] = useActionState(action, {});
  const [typed, setTyped] = useState("");
  const ready = typed.trim().toLowerCase() === fullName.trim().toLowerCase();

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <FormError message={state?.error} />
      <label htmlFor="confirm-provider-delete" className="text-sm font-medium text-ink-900">
        Type <span className="font-semibold">{fullName}</span> to confirm
      </label>
      <input
        id="confirm-provider-delete"
        name="confirm"
        autoComplete="off"
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        className={`${inputClass} sm:max-w-sm`}
      />
      <div>
        <SubmitButton disabled={!ready} className={buttonClass("danger", "sm")}>
          Delete permanently
        </SubmitButton>
      </div>
    </form>
  );
}
