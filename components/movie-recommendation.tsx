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
      <h1 className="text-2xl md:text-5xl font-bold">Recommendation</h1>
      <RenderMovieCards
        movies={movieRecommendation.results}
        count={4}
        className="md:hidden"
      />
      <RenderMovieCards
        movies={movieRecommendation.results}
        count={6}
        className="md:grid hidden lg:hidden"
      />
      <RenderMovieCards
        movies={movieRecommendation.results}
        count={8}
        className="lg:grid hidden xl:hidden"
      />
      <RenderMovieCards
        movies={movieRecommendation.results}
        count={10}
        className="xl:grid hidden"
      />
      <Button className="font-bold" size="full" asChild>
        <Link href={recommendationUrl}>More Recommendation</Link>
      </Button>
    </section>
  );
};

export default MovieRecommendation;
