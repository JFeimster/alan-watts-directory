import type { MetadataRoute } from "next";
import { allRoutes } from "./content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://alan-watts-wisdom.feimster.chatgpt.site";
  return allRoutes.map((route) => ({
    url: new URL(route, base).toString(),
    lastModified: new Date("2026-07-23"),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.split("/").filter(Boolean).length === 1 ? 0.8 : 0.6,
  }));
}
