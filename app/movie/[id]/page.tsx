import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MovieDetailClient } from "@/features/movies/detail/movie-detail-client";
import { getMovieDetails } from "@/features/movies/api/server";
import { isTMDBNotFound } from "@/lib/tmdb/error";
import { pageMetadata, siteUrl } from "@/lib/seo";
import { tmdbImageUrl } from "@/lib/tmdb/images";
import { StructuredData } from "@/components/common/structured-data";
// On-demand ISR: no catalog crawl/build fan-out; cached HTML for seven days.
export const revalidate = 604800;

export async function generateStaticParams() {
  return [];
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
    const year = movie.release_date?.substring(0, 4);
    return pageMetadata({
      title: `${movie.title}${year ? ` (${year})` : ""}`,
      description:
        movie.overview?.slice(0, 160) ||
        `Explore ${movie.title}, its cast, trailers, and recommendations.`,
      path: `/movie/${movie.id}`,
      image: tmdbImageUrl(movie.backdrop_path || movie.poster_path),
    });
  } catch (error) {
    if (isTMDBNotFound(error)) notFound();
    throw error;
  }
}

export default async function MovieDetailsPage({ params }: MovieDetailsProps) {
  const { id } = await params;

  const data = await getMovieDetails(id).catch((error: unknown) => {
    if (isTMDBNotFound(error)) notFound();
    throw error;
  });
  const { release_dates: releaseDates, ...movie } = data;

  const certification =
    releaseDates?.results
      ?.find((r) => r.iso_3166_1 === "US")
      ?.release_dates.find((release) => release.certification)?.certification ||
    "NR";

  return (
    <main className="min-h-screen bg-background">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Movie",
          name: movie.title,
          description: movie.overview,
          url: `${siteUrl}/movie/${movie.id}`,
          image: tmdbImageUrl(movie.poster_path, 780),
          datePublished: movie.release_date || undefined,
          duration: movie.runtime > 0 ? `PT${movie.runtime}M` : undefined,
          genre: movie.genres.map((genre) => genre.name),
          ...(movie.vote_count > 0
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: movie.vote_average,
                  bestRating: 10,
                  worstRating: 0,
                  ratingCount: movie.vote_count,
                },
              }
            : {}),
        }}
      />
      <MovieDetailClient
        key={movie.id}
        movie={movie}
        certification={certification}
      />
    </main>
  );
}
