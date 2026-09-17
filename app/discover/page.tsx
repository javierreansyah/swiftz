import React, { Suspense } from "react";
import { PopularMoviesSection } from "@/components/discover/popular-movies-section";
import { TrendingMoviesSection } from "@/components/discover/trending-movies-section";
import { SearchBar } from "@/components/common/search-bar";
import { MovieCardSkeleton } from "@/components/common/movie-card-skeleton";

export const revalidate = 86400; // 24 hours ISR

export default function Discover() {
  return (
    <main className="container min-h-screen space-y-3 pt-20">
      <div className="w-full py-4">
        <SearchBar />
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
          <PopularMoviesSection />
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
          <TrendingMoviesSection />
        </Suspense>
      </div>
    </main>
  );
}
