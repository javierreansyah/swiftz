"use client";
import RenderMovieCards from "@/components/render-movie-cards";
import useMovieRecommendation from "@/hooks/use-movie-recommendation";
import useMovieDetails from "@/hooks/use-movie-details";
import MovieCardSkeleton from "@/components/movie-card-skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import PaginationSystem from "@/components/pagination-system";

interface MovieRecommendationPageProps {
  params: {
    id: string;
    page: string;
  };
}

const MovieRecommendationPage: React.FC<MovieRecommendationPageProps> = ({
  params,
}) => {
  const {
    movieRecommendation,
    isLoading: recommendationIsLoading,
    error: recommendationError,
  } = useMovieRecommendation(params.id, Number(params.page));
  const {
    movieDetails,
    movieReleaseDates,
    isLoading: detailIsLoading,
    error: detailError,
  } = useMovieDetails(params.id);

  if (recommendationError || detailError) {
    return (
      <main className="h-[300px] rounded-lg w-full border flex items-center justify-center bg-card p-8">
        <h1 className="text-center">Failed to fetch recommended movies</h1>
      </main>
    );
  }

  if (
    recommendationIsLoading ||
    detailIsLoading ||
    movieRecommendation === null
  ) {
    return (
      <main className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {Array.from({ length: 7 }, (_, index) => (
          <div key={index}>
            <MovieCardSkeleton />
          </div>
        ))}
      </main>
    );
  }

  const url = `/movie/${params.id}/recommendation`;

  return (
    <main className="container space-y-8">
      <h1 className="font-bold text-2xl sm:text-4xl md:text-5xl pt-4">
        {movieDetails?.title} Recommendation
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
        currentPage={Number(params.page)}
        totalPage={Number(movieRecommendation.total_pages)}
        url={url}
      />
    </main>
  );
};

export default MovieRecommendationPage;
