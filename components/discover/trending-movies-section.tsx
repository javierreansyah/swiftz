import React from "react";
import Link from "next/link";
import { MovieGrid } from "@/components/common/movie-grid";
import { Button } from "@/components/ui/button";
import { getTrendingMovies } from "@/lib/tmdb";

export async function TrendingMoviesSection() {
  const trendingMovies = await getTrendingMovies(1);

  return (
    <section className="space-y-6">
      <h2 className="text-4xl font-extrabold">Trending</h2>
      <MovieGrid movies={trendingMovies.results} count={10} />
      <Button className="w-full" asChild>
        <Link href="/trending" prefetch={false}>
          More Trending Movies
        </Link>
      </Button>
    </section>
  );
}

// Compatibility alias
export const TrendingMovies = TrendingMoviesSection;

export default TrendingMoviesSection;
