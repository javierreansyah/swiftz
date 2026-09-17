"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Search from "@/components/search";
import RenderMovieCards from "@/components/render-movie-cards";
import PaginationSystem from "@/components/pagination-system";
import MovieCardSkeleton from "@/components/movie-card-skeleton";
import { useSearchMoviesQuery } from "@/hooks/use-tmdb";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("q") || "";
  const pageParam = searchParams.get("page");
  const currentPage = Number(pageParam) || 1;

  const { data, isLoading, isError } = useSearchMoviesQuery(query, currentPage);

  const handlePageChange = (newPage: number) => {
    const encoded = encodeURIComponent(query);
    router.push(`/search?q=${encoded}&page=${newPage}`);
  };

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 1;

  return (
    <main className="container space-y-8 pt-20 pb-10">
      <Search currentQuery={query} />

      {!query ? (
        <div className="flex h-62.5 w-full flex-col items-center justify-center space-y-2 rounded-lg border bg-card p-8 text-center">
          <h2 className="text-xl font-bold">Search for Movies</h2>
          <p className="text-sm text-muted-foreground">
            Enter a title, actor, or keyword in the box above to discover films.
          </p>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }, (_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : isError || movies.length === 0 ? (
        <div className="flex h-75 w-full items-center justify-center rounded-lg border bg-card p-8">
          <h1 className="text-center text-lg font-medium">
            No movies found for &quot;{query}&quot;
          </h1>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              Results for &quot;{query}&quot;
            </h1>
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
          </div>
          <RenderMovieCards movies={movies} count={movies.length} />
          {totalPages > 1 && (
            <PaginationSystem
              currentPage={currentPage}
              totalPage={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="container space-y-8 pt-20 pb-10">
          <div className="h-10 w-full animate-pulse rounded-md bg-secondary" />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }, (_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        </main>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
