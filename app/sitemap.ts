import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE = "https://kanglena.github.io";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: BASE }];
}
