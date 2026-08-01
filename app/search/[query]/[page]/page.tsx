import React from "react";
import Search from "@/components/search";
import RenderMovieCards from "@/components/render-movie-cards";
import PaginationSystem from "@/components/pagination-system";
import { searchMovies } from "@/lib/tmdb";

interface SearchQueryPageProps {
  params: {
    query: string;
    page: string;
  };
}

const SearchQueryPage = async ({ params }: SearchQueryPageProps) => {
  const queryString = decodeURIComponent(params.query);
  const pageNum = Number(params.page) || 1;
  const searchData = await searchMovies(queryString, pageNum);

  if (!searchData.results || searchData.results.length === 0) {
    return (
      <main className="container pt-4">
        <Search currentQuery={queryString} />
        <div className="h-[300px] rounded-lg w-full border flex items-center justify-center bg-card p-8 mt-4">
          <h1 className="text-center">No movies found</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="container space-y-8 pb-10 pt-20">
      <Search currentQuery={queryString} />
      <RenderMovieCards
        movies={searchData.results}
        count={
          searchData.results.length === 21 ? 20 : searchData.results.length
        }
      />
      <PaginationSystem
        currentPage={pageNum}
        totalPage={Number(searchData.total_pages)}
        url={`/search/${params.query}`}
      />
    </main>
  );
};

export default SearchQueryPage;
