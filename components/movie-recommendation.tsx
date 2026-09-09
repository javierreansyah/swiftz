import React from "react";
import RenderMovieCards from "./render-movie-cards";
import Link from "next/link";
import { Button } from "./ui/button";
import { getMovieRecommendations } from "@/lib/tmdb";

interface MovieRecommendationProps {
  id: string;
}

const MovieRecommendation: React.FC<MovieRecommendationProps> = async ({
  id,
}) => {
  const movieRecommendation = await getMovieRecommendations(id, 1);

  if (!movieRecommendation.results || movieRecommendation.results.length === 0) {
    return null;
  }

  const recommendationUrl = `/movie/${id}/recommendation/1`;

  return (
    <section className="container space-y-8 pb-8">
      <h2 className="text-2xl md:text-5xl font-bold">Recommendations</h2>
      <RenderMovieCards movies={movieRecommendation.results} count={10} />
      <Button className="font-bold" size="full" asChild>
        <Link href={`/movie/${id}/recommendation`} prefetch={false}>
          More Recommendations
        </Link>
      </Button>
    </section>
  );
};

export default MovieRecommendation;
