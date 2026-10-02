import { pageMetadata } from "@/lib/seo";
import React, { Suspense } from "react";
import { MovieCategoryListing } from "@/components/discover";
import { MediaListingSkeleton } from "@/components/common/media-listing-skeleton";

export const metadata = pageMetadata({ title: "Movies Now Playing", description: "Find movies currently in theaters, explore trailers, and discover what to watch next.", path: "/movie/now-playing" });

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
