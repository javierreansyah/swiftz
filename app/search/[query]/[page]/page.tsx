"use client";
import React from "react";
import Search from "@/components/search";
import useMovieSearch from "@/hooks/use-movie-search";
import MovieCardSkeleton from "@/components/movie-card-skeleton";
import RenderMovieCards from "@/components/render-movie-cards";
import PaginationSystem from "@/components/pagination-system";

interface SearchQueryPageProps {
  params: {
    query: string;
    page: number;
  };
}

const SearchQueryPage: React.FC<SearchQueryPageProps> = ({ params }) => {
  const queryString = decodeURIComponent(params.query);
  const { searchData, isLoading, error } = useMovieSearch(
    params.query,
    params.page
  );

  if (error) {
    return (
      <main>
        <Search currentQuery={queryString} />
        <div className="h-[300px] rounded-lg w-full border flex items-center justify-center bg-card p-8">
          <h1 className="text-center">Failed to fetch movies</h1>
        </div>
      </main>
    );
  }

  if (isLoading || searchData === null) {
    return (
      <main className="container pt-4">
        <Search currentQuery={queryString} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 pt-4">
          {Array.from({ length: 7 }, (_, index) => (
            <div key={index}>
              <MovieCardSkeleton />
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (searchData.results.length === 0) {
    return (
      <main className="container pt-4">
        <Search currentQuery={queryString} />
        <div className="h-[300px] rounded-lg w-full border flex items-center justify-center bg-card p-8">
          <h1 className="text-center">No movies found</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="container space-y-8 pb-10 pt-4">
      <Search currentQuery={queryString} />
      <RenderMovieCards
        movies={searchData.results}
        count={
          searchData.results.length === 21 ? 20 : searchData.results.length
        }
      />
      <PaginationSystem
        currentPage={Number(params.page)}
        totalPage={Number(searchData.total_pages)}
        url={`/search/${params.query}`}
      />
    </main>
  );
};

export default SearchQueryPage;
