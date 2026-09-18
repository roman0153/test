import type { MetadataRoute } from "next";
import { articles, getSiteUrl, projects } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const routes = ["/", "/realizacie", "/sluzby", "/o-nas", "/media", "/kontakt"];
  return [
    ...routes.map((path) => ({ url: new URL(path, base).href, changeFrequency: "monthly" as const, priority: path === "/" ? 1 : 0.8 })),
    ...projects.map((project) => ({ url: new URL(`/realizacie/${project.slug}`, base).href, changeFrequency: "yearly" as const, priority: 0.7 })),
    ...articles.map((article) => ({ url: new URL(`/media/${article.slug}`, base).href, lastModified: article.date, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}