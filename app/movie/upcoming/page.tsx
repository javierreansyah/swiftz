"use client";

import React, { Suspense } from "react";
import { MovieCategoryListing } from "@/components/discover";
import { MediaListingSkeleton } from "@/components/common/media-listing-skeleton";

export const dynamic = "force-dynamic";

export default function UpcomingMoviesPage() {
  return (
    <Suspense fallback={<MediaListingSkeleton />}>
      <MovieCategoryListing
        category="upcoming"
        title="Upcoming Movie Releases"
      />
    </Suspense>
  );
}
