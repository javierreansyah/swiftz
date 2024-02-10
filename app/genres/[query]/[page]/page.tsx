"use client";
import React from "react";
import useMovieGenresSearch from "@/hooks/use-movie-genres-search";
import MovieCardSkeleton from "@/components/movie-card-skeleton";
import RenderMovieCards from "@/components/render-movie-cards";
import PaginationSystem from "@/components/pagination-system";

interface GenreQueryPageProps {
  params: {
    query: string;
    page: number;
  };
}

const GenreQueryPage: React.FC<GenreQueryPageProps> = ({ params }) => {
  const queryString = decodeURIComponent(params.query);
  const { moviesWithGenres, isLoading, error } = useMovieGenresSearch(
    params.page,
    queryString
  );

  if (error) {
    return (
      <main className="h-[300px] rounded-lg w-full border flex items-center justify-center bg-card p-8">
        <h1 className="text-center">Failed to fetch recommended movies</h1>
      </main>
    );
  }

  if (isLoading || moviesWithGenres === null) {
    return (
      <main className="container space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index}>
              <MovieCardSkeleton />
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (moviesWithGenres.results.length === 0) {
    return (
      <main className="h-[300px] rounded-lg w-full border flex items-center justify-center bg-card p-8">
        <h1 className="text-center">There is no movies with these genres</h1>
      </main>
    );
  }

  const url = `/genres/${params.query}`;

  return (
    <main className="container space-y-8 pb-10">
      <RenderMovieCards
        movies={moviesWithGenres.results}
        count={
          moviesWithGenres.results.length === 21
            ? 20
            : moviesWithGenres.results.length
        }
      />
      <PaginationSystem
        currentPage={Number(params.page)}
        totalPage={Number(moviesWithGenres.total_pages)}
        url={url}
      />
    </main>
  );
};

export default GenreQueryPage;
