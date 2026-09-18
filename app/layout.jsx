import "./globals.css";

import { JsonLd, organizationSchema } from "@/components/neo/schema";
import { fontVars } from "@/components/app/fonts";

export const metadata = {
  metadataBase: new URL("https://sokndall.com"),
  title: "Sokndall — Credentialing & Enrollments",
  description: "Credential and payer enrollment tracking for small provider groups.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={fontVars.replace("app-type ", "")}>
      <body>
        {/* Organization on every page (on-page-seo.md §8). Static data, so it
            costs nothing on the prerender. */}
        <JsonLd data={organizationSchema()} />
        {children}
      </body>
    </html>
  );
}
