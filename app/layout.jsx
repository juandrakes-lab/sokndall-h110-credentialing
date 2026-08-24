import "./globals.css";

export const metadata = {
  title: "Sokndall — Credentialing & Enrollments",
  description: "Credential and payer enrollment tracking for small provider groups.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
