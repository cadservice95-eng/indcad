import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/privacy-policy", "/terms-and-conditions"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
