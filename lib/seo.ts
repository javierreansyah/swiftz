import type { Metadata } from "next";
const configuredUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
export const siteUrl = new URL(configuredUrl).origin;
export const isPreview = process.env.VERCEL_ENV === "preview";

export function pageMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${siteUrl}${path}`;
  const socialImage = image || `${siteUrl}/images/icon.png`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: !noIndex && !isPreview, follow: !isPreview },
    openGraph: {
      type: "website",
      siteName: "Swiftz",
      locale: "en_US",
      title: `${title} | Swiftz`,
      description,
      url,
      images: [{ url: socialImage, alt: image ? title : "Swiftz" }],
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: `${title} | Swiftz`,
      description,
      images: [socialImage],
    },
  };
}

export function serializeStructuredData(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
