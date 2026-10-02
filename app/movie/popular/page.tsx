import { pageMetadata } from "@/lib/seo";
import React, { Suspense } from "react";
import { MovieCategoryListing } from "@/components/discover";
import { MediaListingSkeleton } from "@/components/common/media-listing-skeleton";

export const metadata = pageMetadata({ title: "Popular Movies", description: "Browse today's popular movies and find your next film with genre, year, and rating filters.", path: "/movie/popular" });

export default function PopularMoviesPage() {
  return (
    <Suspense fallback={<MediaListingSkeleton />}>
      <MovieCategoryListing category="popular" title="Popular Movies" />
    </Suspense>
  );
}
