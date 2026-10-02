import type { MetadataRoute } from "next";
import { siteUrl, isPreview } from "@/lib/seo";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        ...(isPreview
          ? { disallow: "/" }
          : {
              allow: ["/", "/search", "/library", "/auth/"],
              // Let crawlers see noindex metadata on search/library/auth and auxiliary pages.
              disallow: ["/*?*"],
            }),
      },
    ],
    sitemap: isPreview ? undefined : `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
