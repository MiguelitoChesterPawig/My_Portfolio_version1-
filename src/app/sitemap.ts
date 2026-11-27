import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// /sitemap.xml: tells search engines which pages exist
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/projects/techworld`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.8 },
  ];
}
