import React from "react";
import RenderMovieCards from "./render-movie-cards";
import { Button } from "./ui/button";
import Link from "next/link";
import { getPopularMovies } from "@/lib/tmdb";

const PopularMovies: React.FC = async () => {
  const popularMovies = await getPopularMovies(1);

  return (
    <section className="space-y-6">
      <h2 className="font-extrabold text-4xl">Popular</h2>
      <RenderMovieCards
        movies={popularMovies.results}
        count={4}
        className="md:hidden"
      />
      <RenderMovieCards
        movies={popularMovies.results}
        count={6}
        className="md:grid hidden lg:hidden"
      />
      <RenderMovieCards
        movies={popularMovies.results}
        count={8}
        className="lg:grid hidden xl:hidden"
      />
      <RenderMovieCards
        movies={popularMovies.results}
        count={10}
        className="xl:grid hidden"
      />
      <Button size="full" asChild>
        <Link href="/popular/1">More Popular Movies</Link>
      </Button>
    </section>
  );
};

export default PopularMovies;
