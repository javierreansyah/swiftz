"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import movieGenres from "@/public/data/genres";
import { GenreCheckbox } from "@/components/genres/genre-checkbox";
import { MovieGrid } from "@/components/common/movie-grid";
import { PaginationSystem } from "@/components/common/pagination-system";
import { MovieCardSkeleton } from "@/components/common/movie-card-skeleton";
import { Button } from "@/components/ui/button";
import { useMoviesByGenresQuery } from "@/hooks/use-tmdb";

function GenresExplorer() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlGenres = searchParams.get("with") || "";
  const pageParam = searchParams.get("page");
  const currentPage = Number(pageParam) || 1;

  const [selectedGenres, setSelectedGenres] = useState<string[]>(() =>
    urlGenres ? urlGenres.split(",").filter(Boolean) : []
  );

  const { register } = useForm();

  useEffect(() => {
    if (urlGenres) {
      setSelectedGenres(urlGenres.split(",").filter(Boolean));
    }
  }, [urlGenres]);

  const genreQueryString = selectedGenres.join(",");

  const { data, isLoading, isFetching } = useMoviesByGenresQuery(
    genreQueryString,
    currentPage
  );

  const handleCheckboxChange = (genreId: string, isChecked: boolean) => {
    const updated = isChecked
      ? [...selectedGenres, genreId]
      : selectedGenres.filter((id) => id !== genreId);
    setSelectedGenres(updated);

    if (updated.length > 0) {
      router.push(`/genres?with=${updated.join(",")}&page=1`, { scroll: false });
    } else {
      router.push("/genres", { scroll: false });
    }
  };

  const handlePageChange = (newPage: number) => {
    router.push(`/genres?with=${genreQueryString}&page=${newPage}`);
  };

  const clearSelection = () => {
    setSelectedGenres([]);
    router.push("/genres", { scroll: false });
  };

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 1;

  return (
    <main className="container space-y-6 pt-20 pb-12">
      <div className="flex flex-col justify-between gap-2 pt-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-5xl font-bold sm:text-6xl">Genres</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Select one or more genres to discover matching movies in real-time.
          </p>
        </div>
        {selectedGenres.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearSelection}
            className="w-fit"
          >
            Clear Selection ({selectedGenres.length})
          </Button>
        )}
      </div>

      <div className="flex w-full flex-wrap gap-2 py-2 sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {movieGenres.map((genre) => {
          return (
            <GenreCheckbox
              key={genre.id}
              register={register}
              name="genres"
              value={String(genre.id)}
              label={genre.name}
              onChange={(isChecked) =>
                handleCheckboxChange(String(genre.id), isChecked)
              }
            />
          );
        })}
      </div>

      <div className="pt-6">
        {selectedGenres.length === 0 ? (
          <div className="flex h-55 w-full flex-col items-center justify-center space-y-2 rounded-lg border border-dashed bg-card p-8 text-center">
            <h2 className="text-xl font-semibold">No Genres Selected</h2>
            <p className="text-sm text-muted-foreground">
              Click any genre checkbox above to instantly browse movies.
            </p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }, (_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="flex h-62.5 w-full items-center justify-center rounded-lg border bg-card p-8">
            <h2 className="text-lg">No movies found matching all selected genres.</h2>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Matching Movies{" "}
                {isFetching && (
                  <span className="animate-pulse text-sm font-normal text-muted-foreground">
                    (Updating...)
                  </span>
                )}
              </h2>
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
            </div>
            <MovieGrid movies={movies} count={movies.length} />
            {totalPages > 1 && (
              <PaginationSystem
                currentPage={currentPage}
                totalPage={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function GenresPage() {
  return (
    <Suspense
      fallback={
        <main className="container space-y-6 pt-20 pb-12">
          <h1 className="pt-4 text-5xl font-bold sm:text-6xl">Genres</h1>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-md bg-secondary" />
            ))}
          </div>
        </main>
      }
    >
      <GenresExplorer />
    </Suspense>
  );
}
