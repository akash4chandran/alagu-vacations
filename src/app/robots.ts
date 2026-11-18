import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { isDemoMode } from "@/lib/demo";

export default function robots(): MetadataRoute.Robots {
  if (isDemoMode()) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
