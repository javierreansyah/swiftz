"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MovieGrid } from "@/components/common/movie-grid";
import { PaginationSystem } from "@/components/common/pagination-system";
import { MovieCardSkeleton } from "@/components/common/movie-card-skeleton";
import { usePopularMoviesQuery } from "@/hooks/use-tmdb";

function PopularContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pageParam = searchParams.get("page");
  const currentPage = Number(pageParam) || 1;

  const { data, isLoading, isError } = usePopularMoviesQuery(currentPage);

  const handlePageChange = (newPage: number) => {
    router.push(`/popular?page=${newPage}`);
  };

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 1;

  return (
    <main className="container space-y-8 pt-20 pb-10">
      <div className="flex items-baseline justify-between pt-4">
        <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
          Popular Movies
        </h1>
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 15 }, (_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : isError || movies.length === 0 ? (
        <div className="flex h-75 w-full items-center justify-center rounded-lg border bg-card p-8">
          <h2 className="text-center text-lg">Unable to load popular movies right now.</h2>
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

export default function PopularPage() {
  return (
    <Suspense
      fallback={
        <main className="container space-y-8 pt-20 pb-10">
          <h1 className="pt-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            Popular Movies
          </h1>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }, (_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        </main>
      }
    >
      <PopularContent />
    </Suspense>
  );
}
