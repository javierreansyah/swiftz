"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import GenreCheckbox from "@/components/genre-checkbox";
import movieGenres from "@/public/data/genres";
import RenderMovieCards from "@/components/render-movie-cards";
import PaginationSystem from "@/components/pagination-system";
import MovieCardSkeleton from "@/components/movie-card-skeleton";
import { Button } from "@/components/ui/button";
import { useMoviesByGenresQuery } from "@/hooks/use-tmdb";
import { useForm } from "react-hook-form";

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
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2 pt-4">
        <div>
          <h1 className="font-bold text-5xl sm:text-6xl">Genres</h1>
          <p className="text-muted-foreground text-sm mt-1">
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

      <div className="py-2 flex flex-wrap sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 w-full">
        {movieGenres.map((genre) => {
          const isSelected = selectedGenres.includes(String(genre.id));
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
          <div className="h-[220px] rounded-lg w-full border border-dashed flex flex-col items-center justify-center bg-card p-8 text-center space-y-2">
            <h2 className="text-xl font-semibold">No Genres Selected</h2>
            <p className="text-muted-foreground text-sm">
              Click any genre checkbox above to instantly browse movies.
            </p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {Array.from({ length: 10 }, (_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="h-[250px] rounded-lg w-full border flex items-center justify-center bg-card p-8">
            <h2 className="text-lg">No movies found matching all selected genres.</h2>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                Matching Movies {isFetching && <span className="text-sm font-normal text-muted-foreground animate-pulse">(Updating...)</span>}
              </h2>
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
          <h1 className="font-bold text-5xl sm:text-6xl pt-4">Genres</h1>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="h-12 bg-secondary animate-pulse rounded-md" />
            ))}
          </div>
        </main>
      }
    >
      <GenresExplorer />
    </Suspense>
  );
}
