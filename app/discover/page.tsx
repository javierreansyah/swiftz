import React from "react";
import PopularMovies from "@/components/popular-movies";
import TrendingMovies from "@/components/movie-trending";
import { Button } from "@/components/ui/button";

const Discover = () => {
  return (
    <main className="container space-y-3 min-h-screen">
      <h1 className="font-extrabold text-5xl sm:text-7xl">Discover</h1>
      <div className="space-y-8">
        <PopularMovies />
        <TrendingMovies />
      </div>
    </main>
  );
};

export default Discover;
