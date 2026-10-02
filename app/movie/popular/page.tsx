import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { MovieCategoryListing } from "@/features/movies/discovery/movie-category-listing";
import { MediaListingSkeleton } from "@/features/media/components/media-listing-skeleton";
export const metadata = pageMetadata({
  title: "Popular Movies",
  description:
    "Browse today's popular movies and find your next film with genre, year, and rating filters.",
  path: "/movie/popular",
});

export default function PopularMoviesPage() {
  return (
    <Suspense fallback={<MediaListingSkeleton />}>
      <MovieCategoryListing category="popular" title="Popular Movies" />
    </Suspense>
  );
}
