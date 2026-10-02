import type { Metadata } from "next";
import { MovieRecommendationsClient } from "@/features/movies/detail/movie-recommendations-client";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { MovieCardSkeleton } from "@/features/media/components/movie-card-skeleton";
export const revalidate = 604800;
export async function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return pageMetadata({
    title: "Movie Recommendations",
    description: "Find related movies and personalized viewing inspiration.",
    path: `/movie/${id}/recommendation`,
    noIndex: true,
  });
}

export default async function MovieRecommendationsPage({ params }: Props) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <main className="container space-y-8 pt-20 pb-10">
          <h1 className="pt-4 heading-hero">Recommendations</h1>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }, (_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        </main>
      }
    >
      <MovieRecommendationsClient id={id} />
    </Suspense>
  );
}
