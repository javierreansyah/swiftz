"use client";
import RenderMovieCards from "./render-movie-cards";
import useTrendingMovies from "@/hooks/use-trending-movies";
import MovieCardSkeleton from "./movie-card-skeleton";
import { Button } from "./ui/button";
import Link from "next/link";

const TrendingMovies: React.FC = () => {
  const { trendingMovies, isLoading, error } = useTrendingMovies(1);

  if (error) {
    return (
      <section className="h-[300px] rounded-lg w-full border flex items-center justify-center bg-card p-8">
        <h1 className="text-center">Failed to fetch popular movies</h1>
      </section>
    );
  }

  if (isLoading || trendingMovies === null) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index}>
            <MovieCardSkeleton />
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <h2 className="font-extrabold text-4xl">Trending</h2>
      <RenderMovieCards
        movies={trendingMovies.results}
        count={4}
        className="md:hidden"
      />
      <RenderMovieCards
        movies={trendingMovies.results}
        count={6}
        className="md:grid hidden lg:hidden"
      />
      <RenderMovieCards
        movies={trendingMovies.results}
        count={8}
        className="lg:grid hidden xl:hidden"
      />
      <RenderMovieCards
        movies={trendingMovies.results}
        count={10}
        className="xl:grid hidden"
      />
      <Button size="full" asChild>
        <Link href="/trending/1">More Trending Movies</Link>
      </Button>
    </section>
  );
};

export default TrendingMovies;
