import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Canonical URL format across the site has no trailing slash
  // (e.g. /services/mechanical-drafting, not /services/mechanical-drafting/).
  // This matches the default, kept explicit so internal links, canonical
  // tags and the sitemap can't drift out of sync with it.
  trailingSlash: false,
};

export default nextConfig;
