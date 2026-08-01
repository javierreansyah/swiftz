import React from "react";
import RenderMovieCards from "@/components/render-movie-cards";
import PaginationSystem from "@/components/pagination-system";
import { getTrendingMovies } from "@/lib/tmdb";

interface TrendingMoviesPageProps {
  params: {
    page: string;
  };
}

const TrendingMoviesPage = async ({ params }: TrendingMoviesPageProps) => {
  const pageNum = Number(params.page) || 1;
  const trendingMovies = await getTrendingMovies(pageNum);

  if (!trendingMovies.results || trendingMovies.results.length === 0) {
    return (
      <main className="container h-[300px] rounded-lg w-full border flex items-center justify-center bg-card p-8">
        <h1 className="text-center">No trending movies</h1>
      </main>
    );
  }

  return (
    <main className="container space-y-8 pb-10 pt-20">
      <h1 className="font-bold text-2xl sm:text-4xl md:text-5xl pt-4">
        Trending
      </h1>
      <RenderMovieCards
        movies={trendingMovies.results}
        count={
          trendingMovies.results.length === 21
            ? 20
            : trendingMovies.results.length
        }
      />
      <PaginationSystem
        currentPage={pageNum}
        totalPage={Number(trendingMovies.total_pages)}
        url="/trending"
      />
    </main>
  );
};

export default TrendingMoviesPage;
