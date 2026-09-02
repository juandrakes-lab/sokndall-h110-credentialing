// The login page itself is a client component and cannot export metadata.
// This server layout carries its noindex — a sign-in screen has no business
// in a search index.
export const metadata = {
  title: "Sign in — Sokndall",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }) {
  return children;
}
