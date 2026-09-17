import React, { Suspense } from "react";
import PopularMovies from "@/components/popular-movies";
import TrendingMovies from "@/components/movie-trending";
import Search from "@/components/search";
import MovieCardSkeleton from "@/components/movie-card-skeleton";
export const revalidate = 86400; // 24 hours ISR

const Discover = () => {
  return (
    <main className="container min-h-screen space-y-3 pt-20">
      <div className="w-full py-4">
        <Search />
      </div>
      <div className="space-y-8">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
