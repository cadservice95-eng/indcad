import type { NextConfig } from "next";
import { services } from "./data/services";
import { projects } from "./data/projects";

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
  // sanitize-html is deliberately NOT here: its nested htmlparser2 dependency
  // ships as ESM-only, which crashes a raw runtime require() on Vercel
  // (ERR_REQUIRE_ESM). Bundling it normally lets Next.js handle the ESM/CJS
  // interop at build time instead.
  serverExternalPackages: ["pg", "nodemailer", "imapflow", "mailparser", "@electric-sql/pglite"],

  async headers() {
    return [
      { source: "/admin", headers: adminHeaders },
      { source: "/admin/:path*", headers: adminHeaders },
      { source: "/api/admin/:path*", headers: adminHeaders },
    ];
  },

  // Services and projects moved from flat (/services/x/) to nested
  // (/services/category/x/) URLs to match the category structure the data
  // already has. Permanent redirects so any link already shared (or already
  // crawled) still resolves, even though the site isn't in Search Console yet.
  async redirects() {
    return [
      ...services.map((service) => ({
        source: `/services/${service.slug}/`,
        destination: `/services/${service.category}/${service.slug}/`,
        permanent: true,
      })),
      ...projects.map((project) => ({
        source: `/projects/${project.slug}/`,
        destination: `/projects/${project.discipline}/${project.slug}/`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
