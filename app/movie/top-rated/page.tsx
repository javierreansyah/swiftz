"use client";

import React, { Suspense } from "react";
import { MovieCategoryListing } from "@/components/discover";
import { MediaListingSkeleton } from "@/components/common/media-listing-skeleton";

export const dynamic = "force-dynamic";

export default function TopRatedMoviesPage() {
  return (
    <Suspense fallback={<MediaListingSkeleton />}>
      <MovieCategoryListing category="top-rated" title="Top Rated Movies" />
    </Suspense>
  );
}
