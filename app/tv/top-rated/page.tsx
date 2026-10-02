import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { TVCategoryListing } from "@/features/tv/discovery/tv-category-listing";
import { MediaListingSkeleton } from "@/features/media/components/media-listing-skeleton";
export const metadata = pageMetadata({
  title: "Top-Rated TV Shows",
  description:
    "Discover acclaimed television series and audience favorites across every genre.",
  path: "/tv/top-rated",
});

export default function TopRatedTVPage() {
  return (
    <Suspense fallback={<MediaListingSkeleton />}>
      <TVCategoryListing category="top-rated" title="Top Rated TV Shows" />
    </Suspense>
  );
}
