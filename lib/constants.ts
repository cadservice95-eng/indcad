export const SITE = {
  name: "IndCAD",
  legalName: "[COMPANY LEGAL NAME]",
  shortDescription:
    "CAD design, drafting, BIM and engineering support for Indian engineers, architects, builders, manufacturers and contractors.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.indcad.in",
  email: "[EMAIL]",
  phone: "[PHONE]",
  addressLocality: "[CITY]",
  addressRegion: "[STATE]",
  addressCountry: "IN",
  gstin: "[GSTIN]",
  hours: "[BUSINESS HOURS]",
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
