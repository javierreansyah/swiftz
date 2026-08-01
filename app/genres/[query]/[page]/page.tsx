import React from "react";
import RenderMovieCards from "@/components/render-movie-cards";
import PaginationSystem from "@/components/pagination-system";
import { getMoviesByGenres } from "@/lib/tmdb";

interface GenreQueryPageProps {
  params: {
    query: string;
    page: string;
  };
}

const GenreQueryPage = async ({ params }: GenreQueryPageProps) => {
  const queryString = decodeURIComponent(params.query);
  const pageNum = Number(params.page) || 1;
  const moviesWithGenres = await getMoviesByGenres(queryString, pageNum);

  if (!moviesWithGenres.results || moviesWithGenres.results.length === 0) {
    return (
      <main className="container h-[300px] rounded-lg w-full border flex items-center justify-center bg-card p-8 mt-4">
        <h1 className="text-center">There are no movies with these genres</h1>
      </main>
    );
  }

  const url = `/genres/${params.query}`;

  return (
    <main className="container space-y-8 pb-10 pt-20">
      <RenderMovieCards
        movies={moviesWithGenres.results}
        count={
          moviesWithGenres.results.length === 21
            ? 20
            : moviesWithGenres.results.length
        }
      />
      <PaginationSystem
        currentPage={pageNum}
        totalPage={Number(moviesWithGenres.total_pages)}
        url={url}
      />
    </main>
  );
};

export default GenreQueryPage;
