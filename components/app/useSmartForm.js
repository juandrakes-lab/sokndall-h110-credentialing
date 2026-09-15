"use client";

import { startTransition, useActionState, useMemo, useState } from "react";

// Every data-entry form in the app runs through this:
//
//   values    controlled, so nothing typed is ever lost — the form is
//             submitted by hand (not `action={…}`), because React resets a
//             form after each action and a controlled input then shows empty
//             while its state still holds the text
//   errors    the shared rules (lib/validation.js) run as you type, and show
//             once a field has been left or a save was attempted
//   submit    blocked while any rule fails: the first bad field gets focus;
//             the server runs the same rules again on save
//
// A server error for a field (state.fieldErrors) shows until that field is
// edited again.
export default function useSmartForm(action, { initial = {}, validate = () => ({}) } = {}) {
  const [state, formAction, pending] = useActionState(action, {});
  const [values, setValues] = useState(initial);
  const [touched, setTouched] = useState(() => new Set());
  const [attempted, setAttempted] = useState(false);
  const [editedSinceServer, setEdited] = useState(() => new Set());

  const clientErrors = useMemo(() => validate(values) ?? {}, [validate, values]);
  const serverErrors = state?.fieldErrors ?? {};

  function errorFor(field) {
    if (serverErrors[field] && !editedSinceServer.has(field)) return serverErrors[field];
    if (attempted || touched.has(field)) return clientErrors[field] ?? null;
    return null;
  }

  function setValue(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
    setEdited((s) => (s.has(field) ? s : new Set(s).add(field)));
  }

  // onChange handler; `transform` masks/cleans what's typed (e.g. digits only).
  const bind = (field, transform) => (e) => {
    const raw = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setValue(field, transform ? transform(raw) : raw);
  };

  function onBlur(e) {
    const name = e.target?.name;
    if (name && !touched.has(name)) setTouched((s) => new Set(s).add(name));
  }

  function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const submitter = e.nativeEvent?.submitter;
    const errs = validate(values) ?? {};
    if (Object.keys(errs).length) {
      setAttempted(true);
      // The first bad field as the eye reads the form, not in rule order.
      const el =
        [...form.querySelectorAll("[name], [id]")].find((node) => errs[node.name] || errs[node.id]) ??
        document.getElementById(Object.keys(errs)[0]);
      el?.focus?.();
      el?.scrollIntoView?.({ block: "center", behavior: "smooth" });
      return;
    }
    setEdited(new Set());
    const data = new FormData(form, submitter ?? undefined);
    startTransition(() => formAction(data));
  }

  // Start over after a successful "add" (keeps the form mounted).
  function reset(next = initial) {
    setValues(next);
    setTouched(new Set());
    setAttempted(false);
  }

  const invalid = Object.keys(clientErrors).length > 0;

  return { state, pending, values, setValues, setValue, bind, errorFor, onBlur, onSubmit, reset, invalid, clientErrors };
}
