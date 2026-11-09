"use client";

import { useActionState } from "react";
import { inputClass } from "@/components/app/ui";
import SubmitButton from "@/components/app/SubmitButton";
import { loadRealData } from "@/lib/demo-actions";

export default function RealDataForm({ email }) {
  const [state, action] = useActionState(loadRealData, null);
  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-900">
        Work email for your account
        <input name="email" type="email" required defaultValue={email} className={inputClass} autoComplete="email" />
      </label>
      {state?.error && <p className="text-sm text-status-expired">{state.error}</p>}
      <p className="text-xs text-ink-500">
        Next you create your login and start the trial (card up front, nothing charged before day 15). We&apos;ll get in touch to do the import.
      </p>
      <SubmitButton className="h-11 self-start rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-600" pendingLabel="Taking you to sign-up…">
        Continue to sign-up
      </SubmitButton>
    </form>
  );
}
