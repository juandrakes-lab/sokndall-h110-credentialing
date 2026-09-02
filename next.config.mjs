/** @type {import('next').NextConfig} */
const nextConfig = {
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
