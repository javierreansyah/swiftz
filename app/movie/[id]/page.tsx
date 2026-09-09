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
      <div className="sm:container lg:flex gap-8 pb-8 justify-between sm:space-y-8 lg:space-y-0 sm:pt-12">
        <Suspense
          fallback={
            <Skeleton className="sm:rounded-xl aspect-video flex-none w-full lg:w-auto lg:h-[380px] xl:h-[480px] 2xl:h-[590px]" />
          }
        >
          <MovieVideo id={id} />
        </Suspense>
        <Suspense
          fallback={
            <Skeleton className="sm:rounded-lg h-[378px] lg:h-[380px] xl:h-[480px] 2xl:h-[590px] w-full" />
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
          <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 pb-8">
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
