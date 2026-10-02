import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TVDetailClient } from "@/features/tv/detail/tv-detail-client";
import { getTVDetails } from "@/features/tv/api/server";
import { isTMDBNotFound } from "@/lib/tmdb/error";
import { pageMetadata, siteUrl } from "@/lib/seo";
import { tmdbImageUrl } from "@/lib/tmdb/images";
import { StructuredData } from "@/components/common/structured-data";
export const revalidate = 86400;

export async function generateStaticParams() {
  return [];
}

interface TVDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: TVDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const show = await getTVDetails(id);
    const year = show.first_air_date?.substring(0, 4);
    return pageMetadata({
      title: `${show.name}${year ? ` (${year})` : ""}`,
      description:
        show.overview?.slice(0, 160) ||
        `Explore ${show.name}, its seasons, cast, and trailers.`,
      path: `/tv/${show.id}`,
      image: tmdbImageUrl(show.backdrop_path || show.poster_path),
    });
  } catch (error) {
    if (isTMDBNotFound(error)) notFound();
    throw error;
  }
}

export default async function TVDetailsPage({ params }: TVDetailsPageProps) {
  const { id } = await params;

  const data = await getTVDetails(id).catch((error: unknown) => {
    if (isTMDBNotFound(error)) notFound();
    throw error;
  });
  const { content_ratings: contentRatings, ...show } = data;

  const usRating =
    contentRatings?.results?.find(
      (r: { iso_3166_1: string; rating: string }) => r.iso_3166_1 === "US",
    )?.rating ||
    contentRatings?.results?.[0]?.rating ||
    "NR";

  return (
    <main className="min-h-screen bg-background">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "TVSeries",
          name: show.name,
          description: show.overview,
          url: `${siteUrl}/tv/${show.id}`,
          image: tmdbImageUrl(show.poster_path, 780),
          datePublished: show.first_air_date || undefined,
          genre: show.genres.map((genre) => genre.name),
          numberOfSeasons: show.number_of_seasons,
          ...(show.vote_count > 0
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: show.vote_average,
                  bestRating: 10,
                  worstRating: 0,
                  ratingCount: show.vote_count,
                },
              }
            : {}),
        }}
      />
      <TVDetailClient key={show.id} show={show} certification={usRating} />
    </main>
  );
}
