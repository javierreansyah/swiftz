import React, { Suspense } from "react";
import type { Metadata } from "next";
import { MovieDetailClient } from "@/components/movie-detail/movie-detail-client";
import { MovieRecommendations } from "@/components/movie-detail/movie-recommendations";
import { MovieCardSkeleton } from "@/components/common/movie-card-skeleton";
import {
  getMovieDetails,
  getPopularMovies,
  getMovieReleaseDates,
  getMovieCast,
  getMovieVideos,
  getMovieImages,
} from "@/lib/tmdb";

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

export default async function MovieDetailsPage({ params }: MovieDetailsProps) {
  const { id } = await params;

  const [movie, releaseDates, castData, videoData, imagesData] =
    await Promise.all([
      getMovieDetails(id),
      getMovieReleaseDates(id).catch(() => ({ id: Number(id), results: [] })),
      getMovieCast(id).catch(() => ({ id: Number(id), cast: [], crew: [] })),
      getMovieVideos(id).catch(() => ({ id: String(id), results: [] })),
      getMovieImages(id).catch(() => ({
        id: Number(id),
        backdrops: [],
        posters: [],
        logos: [],
      })),
    ]);

  const certification =
    releaseDates.results?.find((r) => r.iso_3166_1 === "US")?.release_dates[0]
      ?.certification || "NR";

  return (
    <main className="min-h-screen bg-background">
      <MovieDetailClient
        movie={movie}
        certification={certification}
        videos={videoData.results || []}
        cast={castData.cast || []}
        crew={castData.crew || []}
        images={imagesData}
      >
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-8 pb-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 5 }, (_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <MovieRecommendations id={id} />
        </Suspense>
      </MovieDetailClient>
    </main>
  );
}
