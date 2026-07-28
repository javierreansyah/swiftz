import React from "react";
import PopularMovies from "@/components/popular-movies";
import TrendingMovies from "@/components/movie-trending";
import Search from "@/components/search";

const Discover = () => {
  return (
    <main className="container space-y-3 min-h-screen">
      <div className="py-4 w-full">
        <Search />
      </div>
      <div className="space-y-8">
        <PopularMovies />
        <TrendingMovies />
      </div>
    </main>
  );
};

export default Discover;
