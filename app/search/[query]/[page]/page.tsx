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
      <div>
        <div>
          <Search currentQuery={queryString} />
        </div>
        <div className="h-[300px] rounded-lg w-full border flex items-center justify-center bg-card p-8">
          <h1 className="text-center">Failed to fetch movies</h1>
        </div>
      </div>
    );
  }

  if (isLoading || searchData === null) {
    return (
      <div>
        <div className="container pt-4">
          <Search currentQuery={queryString} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {Array.from({ length: 7 }, (_, index) => (
              <div key={index}>
                <MovieCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (searchData.results.length === 0) {
    return (
      <div>
        <div className="container pt-4">
          <Search currentQuery={queryString} />
          <div className="h-[300px] rounded-lg w-full border flex items-center justify-center bg-card p-8">
            <h1 className="text-center">No movies found</h1>
          </div>
        </div>
      </div>
    );
  }

  const getPageUrl = (pageNumber: number): string => {
    return `/search/${params.query}/${pageNumber}`;
  };

  console.log(`${params.page} / ${searchData.total_pages}`);

  return (
    <div className="container space-y-8 pb-10 pt-4">
      <div>
        <Search currentQuery={queryString} />
      </div>
      <div>
        <RenderMovieCards
          movies={searchData.results}
          count={
            searchData.results.length === 21 ? 20 : searchData.results.length
          }
        />
      </div>
      <PaginationSystem
        currentPage={Number(params.page)}
        totalPage={Number(searchData.total_pages)}
        url={`/search/${params.query}`}
      />
    </div>
  );
};

export default SearchQueryPage;
