import { pageMetadata } from "@/lib/seo";
import React, { Suspense } from "react";
import { TVCategoryListing } from "@/components/tv";
import { MediaListingSkeleton } from "@/components/common/media-listing-skeleton";

export const metadata = pageMetadata({ title: "Popular TV Shows", description: "Browse popular television series, explore seasons and cast, and discover your next show.", path: "/tv/popular" });

export default function PopularTVPage() {
  return (
    <Suspense fallback={<MediaListingSkeleton />}>
      <TVCategoryListing category="popular" title="Popular TV Shows" />
    </Suspense>
  );
}
