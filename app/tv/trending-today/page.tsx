import { TrendingTVClient } from "@/features/tv/components/trending-tv-client";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { MediaListingSkeleton } from "@/features/media/components/media-listing-skeleton";
export const metadata = pageMetadata({
  title: "Trending TV Shows Today",
  description:
    "Explore the television series trending today, their seasons, cast, and recommendations.",
  path: "/tv/trending-today",
});

export default function TrendingTVPage() {
  return (
    <Suspense fallback={<MediaListingSkeleton hasSidebar={false} />}>
      <TrendingTVClient />
    </Suspense>
  );
}
