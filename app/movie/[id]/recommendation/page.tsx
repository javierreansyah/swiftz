"use client";

import React, { use, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import RenderMovieCards from "@/components/render-movie-cards";
import PaginationSystem from "@/components/pagination-system";
import MovieCardSkeleton from "@/components/movie-card-skeleton";
import { useMovieRecommendationsQuery } from "@/hooks/use-tmdb";

interface RecommendationPageProps {
  params: Promise<{
    id: string;
  }>;
}

function RecommendationContent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pageParam = searchParams.get("page");
  const currentPage = Number(pageParam) || 1;

  const { data, isLoading, isError } = useMovieRecommendationsQuery(
    id,
    currentPage
  );

  const handlePageChange = (newPage: number) => {
    router.push(`/movie/${id}/recommendation?page=${newPage}`);
  };

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 1;

  return (
    <main className="container space-y-8 pb-10 pt-20">
      <div className="flex items-center gap-3 pt-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/movie/${id}`}>
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to movie</span>
          </Link>
        </Button>
        <div className="flex-1 flex justify-between items-baseline">
          <h1 className="font-bold text-2xl sm:text-4xl md:text-5xl">
            Recommendations
          </h1>
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {Array.from({ length: 15 }, (_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : isError || movies.length === 0 ? (
        <div className="h-[300px] rounded-lg w-full border flex items-center justify-center bg-card p-8">
          <h2 className="text-center text-lg">No recommendations found for this movie.</h2>
        </div>
      ) : (
        <>
          <RenderMovieCards movies={movies} count={movies.length} />
          <PaginationSystem
            currentPage={currentPage}
            totalPage={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
}

export default function MovieRecommendationPage({
  params,
}: RecommendationPageProps) {
  const { id } = use(params);

  return (
    <Suspense
      fallback={
        <main className="container space-y-8 pb-10 pt-20">
          <h1 className="font-bold text-2xl sm:text-4xl md:text-5xl pt-4">
            Recommendations
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {Array.from({ length: 10 }, (_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        </main>
      }
    >
      <RecommendationContent id={id} />
    </Suspense>
  );
}
