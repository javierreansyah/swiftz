import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TVDetailClient } from "@/components/tv-detail/tv-detail-client";
import {
  getTVDetails,
  getTVCredits,
  getTVVideos,
  getTVRecommendations,
  getTVContentRatings,
} from "@/lib/tmdb";

// Edge CDN caches for 7 days (604,800s)
export const revalidate = 604800;

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
    if (!show) return { title: "TV Show | Swiftz" };

    const year = show.first_air_date
      ? ` (${show.first_air_date.substring(0, 4)})`
      : "";
    const title = `${show.name}${year} | Swiftz`;
    const description =
      show.overview?.slice(0, 160) || "Discover television series on Swiftz";
    const backdropUrl = show.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${show.backdrop_path}`
      : undefined;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: backdropUrl
          ? [{ url: backdropUrl, width: 1280, height: 720, alt: show.name }]
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
      title: "TV Show Details | Swiftz",
      description: "Discover television series on Swiftz",
    };
  }
}

export default async function TVDetailsPage({ params }: TVDetailsPageProps) {
  const { id } = await params;

  let show;
  let credits;
  let videos;
  let recommendations;
  let contentRatings;

  try {
    [show, credits, videos, recommendations, contentRatings] = await Promise.all([
      getTVDetails(id),
      getTVCredits(id).catch(() => ({ id: Number(id), cast: [], crew: [] })),
      getTVVideos(id).catch(() => ({ id, results: [] })),
      getTVRecommendations(id, 1).catch(() => ({
        page: 1,
        results: [],
        total_pages: 0,
        total_results: 0,
      })),
      getTVContentRatings(id).catch(() => ({ id: Number(id), results: [] })),
    ]);
  } catch {
    notFound();
  }

  if (!show || !show.id) {
    notFound();
  }

  const usRating =
    contentRatings?.results?.find(
      (r: { iso_3166_1: string; rating: string }) => r.iso_3166_1 === "US"
    )?.rating ||
    contentRatings?.results?.[0]?.rating ||
    "NR";

  return (
    <main className="min-h-screen bg-background">
      <TVDetailClient
        show={show}
        certification={usRating}
        videos={videos?.results || []}
        cast={credits?.cast || []}
        crew={credits?.crew || []}
        recommendations={recommendations?.results || []}
      />
    </main>
  );
}
