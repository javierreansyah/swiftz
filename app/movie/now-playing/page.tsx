"use client";

import React, { Suspense } from "react";
import { MovieCategoryListing } from "@/components/discover";
import { MediaListingSkeleton } from "@/components/common/media-listing-skeleton";

export const dynamic = "force-dynamic";

export default function NowPlayingMoviesPage() {
  return (
    <Suspense fallback={<MediaListingSkeleton />}>
      <MovieCategoryListing
        category="now-playing"
        title="Now Playing in Theatres"
      />
    </Suspense>
  );
}
