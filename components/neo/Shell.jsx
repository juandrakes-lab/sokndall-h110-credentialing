import { Geist, Geist_Mono } from "next/font/google";

import "@/components/neo/neo.css";

// Geist for everything, Geist Mono for figures. Loaded through next/font, so
// the files are self-hosted and there is no render-blocking request to
// fonts.googleapis.com and no layout shift on first paint.
//
// The variables are attached here rather than in app/layout.jsx so they are
// scoped to the neo skin: the authenticated app and any page still on the
// forest stylesheet keep their own families untouched.
const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

// The page is the full width of the viewport. There is no page-level card and
// no grey ground behind it — that was the browser chrome in the reference
// screenshot, not part of the design. Light sections are white; a dark section
// is a rounded block inset from the edges. Grey is a card fill only.
export default function Shell({ children }) {
  return (
    <div className={`sokndall-neo ${geist.variable} ${geistMono.variable}`}>{children}</div>
  );
}
