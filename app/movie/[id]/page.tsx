import React from "react";
import MovieDetails from "@/components/movie-details";
import MovieVideo from "@/components/movie-video";
import MovieCast from "@/components/movie-cast";
import MovieRecommendation from "@/components/movie-recommendation";

interface MovieDetailsProps {
  params: {
    id: string;
  };
}

const MovieDetailsPage: React.FC<MovieDetailsProps> = ({ params }) => {
  return (
    <main>
      <MovieDetails id={params.id} />
      <div className="sm:container lg:flex gap-8 pb-8 justify-between sm:space-y-8 lg:space-y-0 sm:pt-12">
        <MovieVideo id={params.id} />
        <MovieCast id={params.id} />
      </div>
      <MovieRecommendation id={params.id} />
    </main>
  );
};

export default MovieDetailsPage;
