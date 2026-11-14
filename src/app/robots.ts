import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// /robots.txt: search engines may index the site, but not the chat/contact endpoints
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
