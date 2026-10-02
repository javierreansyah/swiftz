import { pageMetadata } from "@/lib/seo";
import React, { Suspense } from "react";
import { MovieCategoryListing } from "@/components/discover";
import { MediaListingSkeleton } from "@/components/common/media-listing-skeleton";

export const metadata = pageMetadata({ title: "Upcoming Movies", description: "Discover upcoming movie releases, watch trailers, and add anticipated films to your watchlist.", path: "/movie/upcoming" });

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
