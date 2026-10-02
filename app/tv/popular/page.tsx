import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { TVCategoryListing } from "@/features/tv/discovery/tv-category-listing";
import { MediaListingSkeleton } from "@/features/media/components/media-listing-skeleton";
export const metadata = pageMetadata({
  title: "Popular TV Shows",
  description:
    "Browse popular television series, explore seasons and cast, and discover your next show.",
  path: "/tv/popular",
});

export default function PopularTVPage() {
  return (
    <Suspense fallback={<MediaListingSkeleton />}>
      <TVCategoryListing category="popular" title="Popular TV Shows" />
    </Suspense>
  );
}
