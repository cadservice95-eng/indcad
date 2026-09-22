// Not yet registered — fill these in and the footer/contact/quote pages will
// start showing them automatically (they're hidden while null, not shown as
// placeholder text on the live site).
const legalName: string | null = null;
const phone: string | null = null;
const addressLocality: string | null = null;
const addressRegion: string | null = null;
const gstin: string | null = null;
const hours: string | null = null;

export const SITE = {
  name: "Render CAD Hub",
  legalName,
  shortDescription:
    "CAD design, drafting, BIM and engineering support for Indian engineers, architects, builders, manufacturers and contractors.",
  // `||` (not `??`) so a blank-but-set env var on the host still falls
  // back to a valid default instead of producing an empty string.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.rendercadhub.com",
  email: "support@rendercadhub.com",
  phone,
  addressLocality,
  addressRegion,
  addressCountry: "IN",
  gstin,
  hours,
  // Public review page — not a secret, safe to hardcode like the other site facts above.
  trustpilotReviewUrl: "https://www.trustpilot.com/review/rendercadhub.com",
} as const;

export const SERVICE_AREAS = [
  "Mumbai",
  "Delhi NCR",
  "Bangalore",
  "Pune",
  "Chennai",
  "Hyderabad",
  "Ahmedabad",
  "Kolkata",
  "India-wide",
] as const;
