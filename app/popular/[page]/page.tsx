"use client";
import React from "react";
import usePopularMovies from "@/hooks/use-popular-movies";
import MovieCardSkeleton from "@/components/movie-card-skeleton";
import RenderMovieCards from "@/components/render-movie-cards";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
      <div className="h-[300px] rounded-lg w-full border flex items-center justify-center bg-card p-8">
        <h1 className="text-center">Failed to fetch recommended movies</h1>
      </div>
    );
  }

  if (isLoading || popularMovies === null) {
    return (
      <div className="container space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {Array.from({ length: 10 }, (_, index) => (
            <div key={index}>
              <MovieCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (popularMovies.results.length === 0) {
    return null;
  }

  return (
    <div className="container space-y-8 pb-10">
      <h1 className="font-bold text-2xl sm:text-4xl md:text-5xl pt-4">
        Popular
      </h1>
      <div>
        <RenderMovieCards
          movies={popularMovies.results}
          count={
            popularMovies.results.length === 21
              ? 20
              : popularMovies.results.length
          }
        />
      </div>
      <PaginationSystem
        currentPage={Number(params.page)}
        totalPage={Number(popularMovies.total_pages)}
        url="/popular"
      />
    </div>
  );
};

export default PopularMoviesPage;
