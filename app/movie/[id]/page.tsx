import React, { Suspense } from "react";
import type { Metadata } from "next";
import MovieDetails from "@/components/movie-details";
import MovieVideo from "@/components/movie-video";
import MovieCast from "@/components/movie-cast";
import MovieRecommendation from "@/components/movie-recommendation";
import MovieReviews from "@/components/movie-reviews";
import { Skeleton } from "@/components/ui/skeleton";
import MovieCardSkeleton from "@/components/movie-card-skeleton";
import { getMovieDetails, getPopularMovies } from "@/lib/tmdb";

// Edge CDN caches for 7 days (604,800s) - 0 function invocations on cache hits
export const revalidate = 604800;

export async function generateStaticParams() {
  try {
    const popular = await getPopularMovies(1);
    return popular.results.slice(0, 20).map((movie) => ({
      id: String(movie.id),
    }));
  } catch {
    return [];
  }
}

interface MovieDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: MovieDetailsProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = await getMovieDetails(id);
    if (!movie) return { title: "Movie | Swiftz" };

    const year = movie.release_date
      ? ` (${movie.release_date.substring(0, 4)})`
      : "";
    const title = `${movie.title}${year} | Swiftz`;
    const description =
      movie.overview?.slice(0, 160) || "Discover movie details on Swiftz";
    const backdropUrl = movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
      : undefined;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: backdropUrl
          ? [{ url: backdropUrl, width: 1280, height: 720, alt: movie.title }]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: backdropUrl ? [backdropUrl] : [],
      },
    };
  } catch {
    return {
      title: "Movie Details | Swiftz",
      description: "Discover movie details on Swiftz",
    };
  }
}

const MovieDetailsPage = async ({ params }: MovieDetailsProps) => {
  const { id } = await params;

  return (
    <main>
      {/* Top screen component rendered directly (No Suspense) */}
      <MovieDetails id={id} />

      {/* Below fold components wrapped in Suspense */}
      <div className="container mx-auto justify-between gap-8 pb-8 sm:space-y-8 sm:pt-12 lg:flex lg:space-y-0">
        <Suspense
          fallback={
            <Skeleton className="aspect-video w-full flex-none sm:rounded-xl lg:h-95 lg:w-auto xl:h-120 2xl:h-147.5" />
          }
        >
          <MovieVideo id={id} />
        </Suspense>
        <Suspense
          fallback={
            <Skeleton className="h-94.5 w-full sm:rounded-lg lg:h-95 xl:h-120 2xl:h-147.5" />
          }
        >
          <MovieCast id={id} />
        </Suspense>
      </div>

      {/* Community Reviews Section */}
      <div className="container pb-12">
        <MovieReviews id={id} />
      </div>

      <Suspense
        fallback={
          <div className="container grid grid-cols-1 gap-8 pb-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 5 }, (_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <MovieRecommendation id={id} />
      </Suspense>
    </main>
  );
};

export default MovieDetailsPage;
