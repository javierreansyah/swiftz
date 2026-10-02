import { pageMetadata } from "@/lib/seo";
import React, { Suspense } from "react";
import { TVCategoryListing } from "@/components/tv";
import { MediaListingSkeleton } from "@/components/common/media-listing-skeleton";

export const metadata = pageMetadata({ title: "Top-Rated TV Shows", description: "Discover acclaimed television series and audience favorites across every genre.", path: "/tv/top-rated" });

export default function TopRatedTVPage() {
  return (
    <Suspense fallback={<MediaListingSkeleton />}>
      <TVCategoryListing category="top-rated" title="Top Rated TV Shows" />
    </Suspense>
  );
}
