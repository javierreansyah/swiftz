import React from "react";
import RenderMovieCards from "@/components/render-movie-cards";
import PaginationSystem from "@/components/pagination-system";
import { getPopularMovies } from "@/lib/tmdb";

interface PopularMoviesPageProps {
  params: {
    page: string;
  };
}

const PopularMoviesPage = async ({ params }: PopularMoviesPageProps) => {
  const pageNum = Number(params.page) || 1;
  const popularMovies = await getPopularMovies(pageNum);

  if (!popularMovies.results || popularMovies.results.length === 0) {
    return (
      <main className="container h-[300px] rounded-lg w-full border flex items-center justify-center bg-card p-8">
        <h1 className="text-center">No popular movies</h1>
      </main>
    );
  }

  return (
    <main className="container space-y-8 pb-10 pt-20">
      <h1 className="font-bold text-2xl sm:text-4xl md:text-5xl pt-4">
        Popular
      </h1>
      <RenderMovieCards
        movies={popularMovies.results}
        count={
          popularMovies.results.length === 21
            ? 20
            : popularMovies.results.length
        }
      />
      <PaginationSystem
        currentPage={pageNum}
        totalPage={Number(popularMovies.total_pages)}
        url="/popular"
      />
    </main>
  );
};

export default PopularMoviesPage;
