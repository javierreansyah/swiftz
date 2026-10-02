import { pageMetadata } from "@/lib/seo";
import React, { Suspense } from "react";
import { MovieCategoryListing } from "@/components/discover";
import { MediaListingSkeleton } from "@/components/common/media-listing-skeleton";

export const metadata = pageMetadata({ title: "Top-Rated Movies", description: "Explore highly rated movies, audience favorites, and acclaimed films across genres.", path: "/movie/top-rated" });

export default function TopRatedMoviesPage() {
  return (
    <Suspense fallback={<MediaListingSkeleton />}>
      <MovieCategoryListing category="top-rated" title="Top Rated Movies" />
    </Suspense>
  );
}
