type SiteUrlEnv = {
  NEXT_PUBLIC_SITE_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
  [key: string]: string | undefined;
};

/**
 * The site's public origin, for absolute URLs (canonical links, sitemap, link previews).
 * Set NEXT_PUBLIC_SITE_URL once Mason has a custom domain; until then Vercel provides
 * its production domain automatically.
 */
export const getSiteUrl = (env: SiteUrlEnv = process.env) => {
  if (env.NEXT_PUBLIC_SITE_URL) {
    const url = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
    // Accept a bare domain ("masonfarrington.com"), the same format as Vercel's variable
    return /^https?:\/\//.test(url) ? url : `https://${url}`;
  }
  if (env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
};
