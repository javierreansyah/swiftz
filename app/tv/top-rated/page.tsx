"use client";

import React, { Suspense } from "react";
import { TVCategoryListing } from "@/components/tv";
import { MediaListingSkeleton } from "@/components/common/media-listing-skeleton";

export const dynamic = "force-dynamic";

export default function TopRatedTVPage() {
  return (
    <Suspense fallback={<MediaListingSkeleton />}>
      <TVCategoryListing category="top-rated" title="Top Rated TV Shows" />
    </Suspense>
  );
}
