import React from "react";
import RenderMovieCards from "./render-movie-cards";
import { Button } from "./ui/button";
import Link from "next/link";
import { getTrendingMovies } from "@/lib/tmdb";

const TrendingMovies: React.FC = async () => {
  const trendingMovies = await getTrendingMovies(1);

  return (
    <section className="space-y-6">
      <h2 className="font-extrabold text-4xl">Trending</h2>
      <RenderMovieCards movies={trendingMovies.results} count={10} />
      <Button size="full" asChild>
        <Link href="/trending" prefetch={false}>
          More Trending Movies
        </Link>
      </Button>
    </section>
  );
};

export default TrendingMovies;
