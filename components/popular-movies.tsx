"use client";
import RenderMovieCards from "./render-movie-cards";
import usePopularMovies from "@/hooks/use-popular-movies";
import MovieCardSkeleton from "./movie-card-skeleton";
import { Button } from "./ui/button";
import Link from "next/link";

const PopularMovies: React.FC = () => {
  const { popularMovies, isLoading, error } = usePopularMovies(1);

  if (error) {
    return (
      <div className="h-[300px] rounded-lg w-full border flex items-center justify-center bg-card p-8">
        <h1 className="text-center">Failed to fetch popular movies</h1>
      </div>
    );
  }

  if (isLoading || popularMovies === null) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index}>
            <MovieCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-extrabold text-4xl">Popular</h2>
      <div>
        <RenderMovieCards
          movies={popularMovies.results}
          count={4}
          className="md:hidden"
        />
      </div>
      <div>
        <RenderMovieCards
          movies={popularMovies.results}
          count={6}
          className="md:grid hidden lg:hidden"
        />
      </div>
      <div>
        <RenderMovieCards
          movies={popularMovies.results}
          count={8}
          className="lg:grid hidden xl:hidden"
        />
      </div>
      <div>
        <RenderMovieCards
          movies={popularMovies.results}
          count={10}
          className="xl:grid hidden"
        />
      </div>
      <div>
        <Button size="full" asChild>
          <Link href="/popular/1">More Popular Movies</Link>
        </Button>
      </div>
    </div>
  );
};

export default PopularMovies;
