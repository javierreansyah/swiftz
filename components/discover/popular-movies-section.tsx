import React from "react";
import Link from "next/link";
import { MovieGrid } from "@/components/common/movie-grid";
import { Button } from "@/components/ui/button";
import { getPopularMovies } from "@/lib/tmdb";

export async function PopularMoviesSection() {
  const popularMovies = await getPopularMovies(1);

  return (
    <section className="space-y-6">
      <h2 className="text-4xl font-extrabold">Popular</h2>
      <MovieGrid movies={popularMovies.results} count={10} />
      <Button size="full" asChild>
        <Link href="/popular" prefetch={false}>
          More Popular Movies
        </Link>
      </Button>
    </section>
  );
}

// Compatibility alias
export const PopularMovies = PopularMoviesSection;

export default PopularMoviesSection;
