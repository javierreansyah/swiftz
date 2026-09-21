"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MovieGrid } from "@/components/common/movie-grid";
import { PaginationSystem } from "@/components/common/pagination-system";
import { MovieCardSkeleton } from "@/components/common/movie-card-skeleton";
import { MediaListingSkeleton } from "@/components/common/media-listing-skeleton";
import { useTrendingMoviesQuery } from "@/hooks/use-tmdb";
import { SectionHeader } from "@/components/common/section-header";

export const dynamic = "force-dynamic";

function TrendingMoviesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pageParam = searchParams.get("page");
  const currentPage = Number(pageParam) || 1;

  const { data, isLoading, isError } = useTrendingMoviesQuery(currentPage);

  const handlePageChange = (newPage: number) => {
    router.push(`/movie/trending-today?page=${newPage}`);
  };

  const movies = data?.results || [];
  const totalPages = Math.min(data?.total_pages || 1, 500);

  return (
    <main className="container space-y-8 pt-20 pb-16">
      <SectionHeader
        title="Trending Movies - Today"
        badge={`Page ${currentPage} of ${totalPages}`}
        className="pt-4"
      />

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 15 }, (_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : isError || movies.length === 0 ? (
        <div className="flex h-72 w-full items-center justify-center rounded-none border border-dashed border-border bg-card p-8">
          <h2 className="text-center text-sm text-muted-foreground">
            Unable to load trending movies right now.
          </h2>
        </div>
      ) : (
        <>
          <MovieGrid movies={movies} count={movies.length} />
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

export default function TrendingMoviesPage() {
  return (
    <Suspense fallback={<MediaListingSkeleton hasSidebar={false} />}>
      <TrendingMoviesContent />
    </Suspense>
  );
}
