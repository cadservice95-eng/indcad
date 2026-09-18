import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { industries } from "@/data/industries";
import { locations } from "@/data/locations";
import { projects } from "@/data/projects";
import { projectCategories } from "@/data/project-categories";
import { software } from "@/data/software";
import { articles } from "@/data/resources";
import { absoluteUrl as url } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/services",
    "/industries",
    "/locations",
    "/projects",
    "/software",
    "/resources",
    "/blog",
    "/guides",
    "/standards",
    "/about",
    "/contact",
    "/get-a-quote",
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: url(path),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  for (const service of services) {
    entries.push({ url: url(`/services/${service.slug}`), changeFrequency: "monthly", priority: 0.8 });
  }
  for (const industry of industries) {
    entries.push({ url: url(`/industries/${industry.slug}`), changeFrequency: "monthly", priority: 0.7 });
  }
  for (const location of locations) {
    entries.push({ url: url(`/locations/${location.slug}`), changeFrequency: "monthly", priority: 0.7 });
  }
  for (const category of projectCategories) {
    entries.push({ url: url(`/projects/${category.slug}`), changeFrequency: "monthly", priority: 0.5 });
  }
  for (const project of projects) {
    entries.push({ url: url(`/projects/${project.slug}`), changeFrequency: "yearly", priority: 0.5 });
  }
  for (const item of software) {
    entries.push({ url: url(`/software/${item.slug}`), changeFrequency: "monthly", priority: 0.6 });
  }
  for (const article of articles) {
    const base = article.type === "blog" ? "/blog" : article.type === "guide" ? "/guides" : "/standards";
    entries.push({ url: url(`${base}/${article.slug}`), changeFrequency: "yearly", priority: 0.5 });
  }

  return entries;
}
