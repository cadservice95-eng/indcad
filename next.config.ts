import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Canonical URL format across the site has a trailing slash
  // (e.g. /services/mechanical-drafting/, not /services/mechanical-drafting).
  // Next.js applies this to next/link hrefs automatically and normalizes
  // a request without the slash with a single built-in redirect (not a
  // custom rule / chain) — canonical tags and the sitemap match it too.
  trailingSlash: true,
};

export default nextConfig;
