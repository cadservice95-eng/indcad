import type { NextConfig } from "next";

const adminHeaders = [
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
  { key: "Cache-Control", value: "private, no-store" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "X-Content-Type-Options", value: "nosniff" },
];

const nextConfig: NextConfig = {
  // Canonical URL format across the site has a trailing slash
  // (e.g. /services/mechanical-drafting/, not /services/mechanical-drafting).
  // Next.js applies this to next/link hrefs automatically and normalizes
  // a request without the slash with a single built-in redirect (not a
  // custom rule / chain) — canonical tags and the sitemap match it too.
  trailingSlash: true,

  // Server-only libraries that must be loaded by Node at runtime rather than
  // bundled (native sockets, large parsers, or the embedded dev database).
  serverExternalPackages: ["pg", "nodemailer", "imapflow", "mailparser", "sanitize-html", "@electric-sql/pglite"],

  async headers() {
    return [
      { source: "/admin", headers: adminHeaders },
      { source: "/admin/:path*", headers: adminHeaders },
      { source: "/api/admin/:path*", headers: adminHeaders },
    ];
  },
};

export default nextConfig;
