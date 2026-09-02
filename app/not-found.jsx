import Link from "next/link";

// A custom not-found replaces Next's built-in one, which hard-codes its own
// <title>404: This page could not be found.</title> and produced a second
// <title> tag alongside the root layout's. With this file there is one title.
export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: "0 24px",
        textAlign: "center",
        fontFamily:
          'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <p style={{ margin: 0, fontSize: 40, fontWeight: 600 }}>404</p>
      <p style={{ margin: 0, fontSize: 16, color: "#555" }}>
        This page could not be found.
      </p>
      <Link href="/" style={{ marginTop: 8, fontSize: 15 }}>
        Go to the homepage
      </Link>
    </main>
  );
}
