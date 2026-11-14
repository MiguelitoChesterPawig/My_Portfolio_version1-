// Full web address of the site, used by link previews (Facebook, LinkedIn, Messenger),
// the sitemap and robots.txt. Set NEXT_PUBLIC_SITE_URL once you have a domain;
// on Vercel it falls back to the project's production address automatically.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  "http://localhost:3000";
