"use client";
import React from "react";
import usePopularMovies from "@/hooks/use-popular-movies";
import MovieCardSkeleton from "@/components/movie-card-skeleton";
import RenderMovieCards from "@/components/render-movie-cards";
import PaginationSystem from "@/components/pagination-system";

interface PopularMoviesPageProps {
  params: {
    page: string;
  };
}

const PopularMoviesPage: React.FC<PopularMoviesPageProps> = ({ params }) => {
  const { popularMovies, isLoading, error } = usePopularMovies(
    Number(params.page)
  );

  if (error) {
    return (
      <main className="h-[300px] rounded-lg w-full border flex items-center justify-center bg-card p-8">
        <h1 className="text-center">Failed to fetch recommended movies</h1>
      </main>
    );
  }

  if (isLoading || popularMovies === null) {
    return (
      <main className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {Array.from({ length: 10 }, (_, index) => (
            <div key={index}>
              <MovieCardSkeleton />
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (popularMovies.results.length === 0) {
    return (
      <main className="h-[300px] rounded-lg w-full border flex items-center justify-center bg-card p-8">
        <h1 className="text-center">No popular movies</h1>
      </main>
    );
  }

  return (
    <main className="container space-y-8 pb-10">
      <h1 className="font-bold text-2xl sm:text-4xl md:text-5xl pt-4">
        Popular
      </h1>
      <RenderMovieCards
        movies={popularMovies.results}
        count={
          popularMovies.results.length === 21
            ? 20
            : popularMovies.results.length
        }
      />
      <PaginationSystem
        currentPage={Number(params.page)}
        totalPage={Number(popularMovies.total_pages)}
        url="/popular"
      />
    </main>
  );
};

export default PopularMoviesPage;
