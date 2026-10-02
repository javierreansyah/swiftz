import { MovieDiscoveryClient } from "@/features/movies/discovery/movie-discovery-client";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { MediaListingSkeleton } from "@/features/media/components/media-listing-skeleton";
export const metadata = pageMetadata({
  title: "Discover Movies",
  description:
    "Explore popular, trending, upcoming, and top-rated movies. Filter by genre, release year, rating, and streaming provider.",
  path: "/movie",
});

export default function MoviePage() {
  return (
    <Suspense fallback={<MediaListingSkeleton />}>
      <MovieDiscoveryClient />
    </Suspense>
  );
}
