import React, { Suspense } from "react";
import MovieDetails from "@/components/movie-details";
import MovieVideo from "@/components/movie-video";
import MovieCast from "@/components/movie-cast";
import MovieRecommendation from "@/components/movie-recommendation";
import { Skeleton } from "@/components/ui/skeleton";
import MovieCardSkeleton from "@/components/movie-card-skeleton";

interface MovieDetailsProps {
  params: {
    id: string;
  };
}

const MovieDetailsPage: React.FC<MovieDetailsProps> = ({ params }) => {
  return (
    <main>
      {/* Top screen component rendered directly (No Suspense) */}
      <MovieDetails id={params.id} />

      {/* Below fold components wrapped in Suspense */}
      <div className="sm:container lg:flex gap-8 pb-8 justify-between sm:space-y-8 lg:space-y-0 sm:pt-12">
        <Suspense
          fallback={
            <Skeleton className="sm:rounded-xl aspect-video flex-none w-full lg:w-auto lg:h-[380px] xl:h-[480px] 2xl:h-[590px]" />
          }
        >
          <MovieVideo id={params.id} />
        </Suspense>
        <Suspense
          fallback={
            <Skeleton className="sm:rounded-lg h-[378px] lg:h-[380px] xl:h-[480px] 2xl:h-[590px] w-full" />
          }
        >
          <MovieCast id={params.id} />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 pb-8">
            {Array.from({ length: 5 }, (_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <MovieRecommendation id={params.id} />
      </Suspense>
    </main>
  );
};

export default MovieDetailsPage;
