export interface FAQItem {
  question: string;
  answer: string;
}

export interface ContentSection {
  heading?: string;
  paragraphs: string[];
}

export interface ProcessStep {
  title: string;
  description: string;
}

export type ServiceCategorySlug =
  | "mechanical"
  | "structural"
  | "architectural"
  | "civil"
  | "electrical"
  | "bim"
  | "cad-conversion"
  | "engineering-design";

export interface Service {
  slug: string;
  name: string;
  category: ServiceCategorySlug;
  shortDescription: string;
  heroHeading: string;
  heroDescription: string;
  problemStatement: string;
  overview: ContentSection[];
  deliverables: string[];
  applications: string[];
  process: ProcessStep[];
  industries: string[];
  software: string[];
  faqs: FAQItem[];
  relatedServices: string[];
  relatedProjectCategories: string[];
  seoTitle: string;
  seoDescription: string;
}

export interface ServiceCategory {
  slug: ServiceCategorySlug;
  name: string;
  shortDescription: string;
  icon: string;
  services: { slug: string; name: string }[];
}

export interface Industry {
  slug: string;
  name: string;
  heroHeading: string;
  heroDescription: string;
  description: ContentSection[];
  useCases: string[];
  deliverables: string[];
  documentationRequirements: string[];
  services: string[];
  software: string[];
  projectCategories: string[];
  faqs: FAQItem[];
  seoTitle: string;
  seoDescription: string;
}

export interface Location {
  slug: string;
  name: string;
  state: string;
  heroHeading: string;
  heroDescription: string;
  intro: ContentSection[];
  localContext: ContentSection[];
  localProjectTypes: string[];
  services: string[];
  industries: string[];
  workflow: ProcessStep[];
  faqs: FAQItem[];
  relatedLocations: string[];
  seoTitle: string;
  seoDescription: string;
}

export type ProjectCategorySlug =
  | "mechanical"
  | "structural"
  | "civil"
  | "architectural"
  | "electrical"
  | "bim";

export interface ProjectGalleryImage {
  alt: string;
  placeholder: boolean;
}

export interface Project {
  slug: string;
  title: string;
  discipline: ProjectCategorySlug;
  industry: string;
  location?: string;
  isPlaceholder: boolean;
  summary: string;
  challenge: string[];
  scope: string[];
  process: string[];
  deliverables: string[];
  software: string[];
  outcome: string[];
  considerations: string[];
  gallery: ProjectGalleryImage[];
  relatedServices: string[];
  faqs: FAQItem[];
  seoTitle: string;
  seoDescription: string;
}

export interface Software {
  slug: string;
  name: string;
  category: string;
  summary: string;
  overview: ContentSection[];
  usedFor: string[];
  deliverables: string[];
  faqs: FAQItem[];
  relatedServices: string[];
  relatedIndustries: string[];
  seoTitle: string;
  seoDescription: string;
}

export type ResourceType = "blog" | "guide" | "standard";

export interface Article {
  slug: string;
  type: ResourceType;
  title: string;
  excerpt: string;
  body: { heading?: string; paragraphs: string[]; list?: string[] }[];
  publishedAt: string;
  updatedAt?: string;
  relatedServices: string[];
  seoTitle: string;
  seoDescription: string;
}

export interface BreadcrumbEntry {
  label: string;
  href: string;
}
