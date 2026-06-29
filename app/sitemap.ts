import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";

export const dynamic = "force-static";

const BASE = "https://kanglena.github.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticUrls = ["", "/about", "/projects", "/blog", "/contact"].map((p) => ({ url: `${BASE}${p}` }));
  const projects = getContent("projects").map((d) => ({ url: `${BASE}/projects/${d.slug}` }));
  const posts = getContent("posts").map((d) => ({ url: `${BASE}/blog/${d.slug}` }));
  return [...staticUrls, ...projects, ...posts];
}
