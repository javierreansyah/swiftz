import React, { Suspense } from "react";
import PopularMovies from "@/components/popular-movies";
import TrendingMovies from "@/components/movie-trending";
import Search from "@/components/search";
import MovieCardSkeleton from "@/components/movie-card-skeleton";

const Discover = () => {
  return (
    <main className="container space-y-3 min-h-screen pt-20">
      <div className="py-4 w-full">
        <Search />
      </div>
      <div className="space-y-8">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {Array.from({ length: 5 }, (_, index) => (
                <MovieCardSkeleton key={index} />
              ))}
            </div>
          }
        >
          <PopularMovies />
        </Suspense>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {Array.from({ length: 5 }, (_, index) => (
                <MovieCardSkeleton key={index} />
              ))}
            </div>
          }
        >
          <TrendingMovies />
        </Suspense>
      </div>
    </main>
  );
};

export default Discover;
