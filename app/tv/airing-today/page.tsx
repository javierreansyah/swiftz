import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { TVCategoryListing } from "@/features/tv/discovery/tv-category-listing";
import { MediaListingSkeleton } from "@/features/media/components/media-listing-skeleton";
export const metadata = pageMetadata({
  title: "TV Shows Airing Today",
  description:
    "Find television series with episodes airing today and explore show details and cast.",
  path: "/tv/airing-today",
});

export default function AiringTodayTVPage() {
  return (
    <Suspense fallback={<MediaListingSkeleton />}>
      <TVCategoryListing
        category="airing-today"
        title="TV Shows Airing Today"
      />
    </Suspense>
  );
}
