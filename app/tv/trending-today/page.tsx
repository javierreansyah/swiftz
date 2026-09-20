"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TVCard } from "@/components/tv/tv-card";
import { PaginationSystem } from "@/components/common/pagination-system";
import { MovieCardSkeleton } from "@/components/common/movie-card-skeleton";
import { useTrendingTVShowsQuery } from "@/hooks/use-tmdb";
import { SectionHeader } from "@/components/common/section-header";

export const dynamic = "force-dynamic";

function TrendingTVContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pageParam = searchParams.get("page");
  const currentPage = Number(pageParam) || 1;

  const { data, isLoading, isError } = useTrendingTVShowsQuery(currentPage);

  const handlePageChange = (newPage: number) => {
    router.push(`/tv/trending-today?page=${newPage}`);
  };

  const shows = data?.results || [];
  const totalPages = Math.min(data?.total_pages || 1, 500);

  return (
    <main className="container space-y-8 pt-20 pb-16">
      <SectionHeader
        title="Trending TV Shows - Today"
        badge={`Page ${currentPage} of ${totalPages}`}
        className="pt-4"
      />

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 15 }, (_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : isError || shows.length === 0 ? (
        <div className="flex h-72 w-full items-center justify-center rounded-none border border-dashed border-border bg-card p-8">
          <h2 className="text-center text-sm text-muted-foreground">
            Unable to load trending TV shows right now.
          </h2>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {shows.map((show) => (
              <TVCard key={show.id} show={show} />
            ))}
          </div>
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

export default function TrendingTVPage() {
  return (
    <Suspense
      fallback={
        <main className="container space-y-8 pt-20 pb-16">
          <div className="h-10 w-64 animate-pulse bg-muted" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }, (_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        </main>
      }
    >
      <TrendingTVContent />
    </Suspense>
  );
}
