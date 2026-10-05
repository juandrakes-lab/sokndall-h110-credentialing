/** @type {import('next').NextConfig} */
const nextConfig = {
  // Two chats share this worktree, and a `next build` overwrites the .next a
  // running `next dev` is reading from — the failure that looks like a code
  // bug ("Cannot find module './996.js'"). NEXT_DIST_DIR lets the production
  // server build and serve from its own directory (.claude/run-app-v3-prod.cmd
  // sets .next-prod), so dev and prod stop colliding.
  distDir: process.env.NEXT_DIST_DIR || ".next",

  // forbidden() → a real 403 for the Billing Co–only routes (alcance §4.3).
  // serverActions.bodySizeLimit: the template importer takes an .xlsx of up
  // to 5 MB through a Server Action (default limit is 1 MB).
  experimental: { authInterrupts: true, serverActions: { bodySizeLimit: "6mb" } },

  // Dev only: keep Next's "N" badge off the app sidebar's account button.
  devIndicators: { position: "bottom-right" },

  // One trailing-slash convention for the whole site: no trailing slash.
  // Next issues a 308 from "/path/" to "/path" automatically.
  trailingSlash: false,

  async redirects() {
    return [
      // The standalone /landing route is gone — "/" now serves the landing.
      // 301 so any existing links and prior indexing consolidate onto "/".
      { source: "/landing", destination: "/", statusCode: 301 },

      // Canonical host. www.sokndall.com → apex, permanent (308).
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.sokndall.com" }],
        destination: "https://sokndall.com/:path*",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      // sokndall.com is the only indexable host. Anything served from a
      // *.vercel.app hostname (preview deploys and the project alias) must
      // never be indexed.
      {
        source: "/:path*",
        has: [{ type: "host", value: "(?<sub>.*)\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
