"use client";

import { useActionState } from "react";
import { inputClass, buttonClass } from "@/components/app/ui";
import SubmitButton from "@/components/app/SubmitButton";
import { saveDemoEmail } from "@/lib/demo-actions";

// The demo's one optional ask: its alerts by email for the 3 days.
export default function DemoEmailForm({ email }) {
  const [state, action] = useActionState(saveDemoEmail, null);
  return (
    <form action={action} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-900">
        Get this demo&apos;s alerts by email for 3 days?
        <input name="email" type="email" defaultValue={email} placeholder="you@yourfirm.com" className={inputClass} autoComplete="email" />
      </label>
      <p className="text-xs text-ink-500">Only for this demo&apos;s alerts. If you later load your real data, we use it for your account.</p>
      {state?.error && <p className="text-sm text-status-expired">{state.error}</p>}
      {state?.saved && <p className="text-sm text-status-active">{state.saved === "saved" ? "Saved. The next alert goes to your inbox." : "Removed."}</p>}
      <SubmitButton className={`${buttonClass("secondary")} self-start`} pendingLabel="Saving…">
        Save
      </SubmitButton>
    </form>
  );
}
