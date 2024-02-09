"use client";
import RenderMovieCards from "./render-movie-cards";
import Link from "next/link";
import { Button } from "./ui/button";
import useMovieRecommendation from "@/hooks/use-movie-recommendation";
import MovieCardSkeleton from "./movie-card-skeleton";

interface MovieRecommendationProps {
  id: string;
}

const MovieRecommendation: React.FC<MovieRecommendationProps> = ({ id }) => {
  const { movieRecommendation, isLoading, error } = useMovieRecommendation(
    id,
    1
  );

  if (error) {
    return (
      <div className="h-[300px] rounded-lg w-full border flex items-center justify-center bg-card p-8">
        <h1 className="text-center">Failed to fetch recommended movies</h1>
      </div>
    );
  }

  if (isLoading || movieRecommendation === null) {
    return (
      <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {Array.from({ length: 7 }, (_, index) => (
          <div key={index}>
            <MovieCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (movieRecommendation.results.length === 0) {
    return null;
  }

  const recommendationUrl = `/movie/${id}/recommendation/1`;

  return (
    <div className="container space-y-8 pb-8">
      <div>
        <h1 className="text-2xl md:text-5xl font-bold">Recommendation</h1>
      </div>
      <div>
        <div>
          <RenderMovieCards
            movies={movieRecommendation.results}
            count={4}
            className="md:hidden"
          />
        </div>
        <div>
          <RenderMovieCards
            movies={movieRecommendation.results}
            count={6}
            className="md:grid hidden lg:hidden"
          />
        </div>
        <div>
          <RenderMovieCards
            movies={movieRecommendation.results}
            count={8}
            className="lg:grid hidden xl:hidden"
          />
        </div>
        <div>
          <RenderMovieCards
            movies={movieRecommendation.results}
            count={10}
            className="xl:grid hidden"
          />
        </div>
      </div>
      <Button className="font-bold" size="full" asChild>
        <Link href={recommendationUrl}>More Recommendation</Link>
      </Button>
    </div>
  );
};

export default MovieRecommendation;
