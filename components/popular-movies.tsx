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
      <RenderMovieCards movies={popularMovies.results} count={10} />
      <Button size="full" asChild>
        <Link href="/popular" prefetch={false}>
          More Popular Movies
        </Link>
      </Button>
    </section>
  );
};

export default PopularMovies;
