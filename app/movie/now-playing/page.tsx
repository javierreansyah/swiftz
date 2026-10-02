import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { MovieCategoryListing } from "@/features/movies/discovery/movie-category-listing";
import { MediaListingSkeleton } from "@/features/media/components/media-listing-skeleton";
export const metadata = pageMetadata({
  title: "Movies Now Playing",
  description:
    "Find movies currently in theaters, explore trailers, and discover what to watch next.",
  path: "/movie/now-playing",
});

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
