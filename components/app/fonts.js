import { Geist, Geist_Mono } from "next/font/google";

// The app's type, the same families the marketing site loads (components/neo/Shell.jsx),
// so the product and the site read as one thing. Self-hosted by next/font.
export const geist = Geist({ subsets: ["latin"], display: "swap", variable: "--font-geist" });
export const geistMono = Geist_Mono({ subsets: ["latin"], display: "swap", variable: "--font-geist-mono" });

// Put on the wrapper of every app surface; .app-type (globals.css) applies them.
export const fontVars = `app-type ${geist.variable} ${geistMono.variable}`;
