"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TRIAL_HREF } from "@/components/neo/neoData";

// The nav's way in: a quiet "Log in" beside the trial button, which stays the
// one loud thing in the bar. Someone already signed in gets a single "Go to
// app" instead. The pages are static, so that's read from the session cookie's
// presence after load — the server HTML always carries the signed-out pair.
export default function NavAccess() {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    setSignedIn(document.cookie.split("; ").some((c) => c.split("=")[0].includes("-auth-token")));
  }, []);

  if (signedIn) {
    return (
      <span className="sk-nav__access">
        <Link href="/dashboard" className="sk-nav__cta">
          Go to app
        </Link>
      </span>
    );
  }
  return (
    <span className="sk-nav__access">
      <Link href="/login" className="sk-nav__login">
        Log in
      </Link>
      <Link href={TRIAL_HREF} className="sk-nav__cta">
        Start free trial
      </Link>
    </span>
  );
}
