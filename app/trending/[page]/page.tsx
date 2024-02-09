"use client";
import React from "react";
import useTrendingMovies from "@/hooks/use-trending-movies";
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

const TrendingMoviesPage: React.FC<PopularMoviesPageProps> = ({ params }) => {
  const { trendingMovies, isLoading, error } = useTrendingMovies(
    Number(params.page)
  );

  if (error) {
    return (
      <div className="h-[300px] rounded-lg w-full border flex items-center justify-center bg-card p-8">
        <h1 className="text-center">Failed to fetch trending movies</h1>
      </div>
    );
  }

  if (isLoading || trendingMovies === null) {
    return (
      <div className="container space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index}>
              <MovieCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (trendingMovies.results.length === 0) {
    return null;
  }

  return (
    <div className="container space-y-8 pb-10">
      <h1 className="font-bold text-2xl sm:text-4xl md:text-5xl pt-4">
        Trending
      </h1>
      <div>
        <RenderMovieCards
          movies={trendingMovies.results}
          count={
            trendingMovies.results.length === 21
              ? 20
              : trendingMovies.results.length
          }
        />
      </div>
      <PaginationSystem
        currentPage={Number(params.page)}
        totalPage={Number(trendingMovies.total_pages)}
        url="/popular"
      />
    </div>
  );
};

export default TrendingMoviesPage;
