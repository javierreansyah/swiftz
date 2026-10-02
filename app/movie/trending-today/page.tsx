import { TrendingMoviesClient } from "@/features/movies/components/trending-movies-client";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { MediaListingSkeleton } from "@/features/media/components/media-listing-skeleton";
export const metadata = pageMetadata({
  title: "Trending Movies Today",
  description:
    "Discover the movies trending today, explore trailers and cast, and find what everyone is watching.",
  path: "/movie/trending-today",
});

export default function TrendingMoviesPage() {
  return (
    <Suspense fallback={<MediaListingSkeleton hasSidebar={false} />}>
      <TrendingMoviesClient />
    </Suspense>
  );
}
