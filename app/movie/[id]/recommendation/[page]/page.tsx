import React from "react";
import RenderMovieCards from "@/components/render-movie-cards";
import PaginationSystem from "@/components/pagination-system";
import { getMovieRecommendations, getMovieDetails } from "@/lib/tmdb";

interface MovieRecommendationPageProps {
  params: {
    id: string;
    page: string;
  };
}

const MovieRecommendationPage = async ({
  params,
}: MovieRecommendationPageProps) => {
  const pageNum = Number(params.page) || 1;
  const [movieRecommendation, movieDetails] = await Promise.all([
    getMovieRecommendations(params.id, pageNum),
    getMovieDetails(params.id).catch(() => null),
  ]);

  if (
    !movieRecommendation.results ||
    movieRecommendation.results.length === 0
  ) {
    return (
      <main className="container h-[300px] rounded-lg w-full border flex items-center justify-center bg-card p-8 mt-4">
        <h1 className="text-center">No recommendations found</h1>
      </main>
    );
  }

  const url = `/movie/${params.id}/recommendation`;

  return (
    <main className="container space-y-8 pb-10 pt-20">
      <h1 className="font-bold text-2xl sm:text-4xl md:text-5xl pt-4">
        {movieDetails?.title ? `${movieDetails.title} Recommendation` : "Recommendation"}
      </h1>
      <RenderMovieCards
        movies={movieRecommendation.results}
        count={
          movieRecommendation.results.length === 21
            ? 20
            : movieRecommendation.results.length
        }
      />
      <PaginationSystem
        currentPage={pageNum}
        totalPage={Number(movieRecommendation.total_pages)}
        url={url}
      />
    </main>
  );
};

export default MovieRecommendationPage;
