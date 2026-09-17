import React from "react";
import Link from "next/link";
import { MovieGrid } from "@/components/common/movie-grid";
import { Button } from "@/components/ui/button";
import { getMovieRecommendations } from "@/lib/tmdb";

export interface MovieRecommendationsProps {
  id: string;
}

export async function MovieRecommendations({ id }: MovieRecommendationsProps) {
  const movieRecommendation = await getMovieRecommendations(id, 1);

  if (!movieRecommendation.results || movieRecommendation.results.length === 0) {
    return null;
  }

  return (
    <section className="container space-y-8 pb-8">
      <h2 className="text-2xl font-bold md:text-5xl">Recommendations</h2>
      <MovieGrid movies={movieRecommendation.results} count={10} />
      <Button className="font-bold" size="full" asChild>
        <Link href={`/movie/${id}/recommendation`} prefetch={false}>
          More Recommendations
        </Link>
      </Button>
    </section>
  );
}

// Backward-compatible alias
export const MovieRecommendation = MovieRecommendations;

export default MovieRecommendations;
