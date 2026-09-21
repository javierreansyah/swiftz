"use client";

import React, { Suspense } from "react";
import { MovieCategoryListing } from "@/components/discover";
import { MediaListingSkeleton } from "@/components/common/media-listing-skeleton";

export const dynamic = "force-dynamic";

export default function PopularMoviesPage() {
  return (
    <Suspense fallback={<MediaListingSkeleton />}>
      <MovieCategoryListing category="popular" title="Popular Movies" />
    </Suspense>
  );
}
