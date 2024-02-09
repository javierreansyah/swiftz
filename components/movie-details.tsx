"use client";
import Image from "next/image";
import StarRating from "./star-rating";
import useMovieDetails from "@/hooks/use-movie-details";
import MovieDetailsSkeleton from "./movie-details-skeleton";
import { Skeleton } from "./ui/skeleton";

interface MovieDetailsProps {
  id: string;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ id }) => {
  const { movieDetails, movieReleaseDates, isLoading, error } =
    useMovieDetails(id);

  if (error) {
    return (
      <div className="h-[220px] sm:h-[320px] md:h-[420px] lg:h-[520px] 2xl:h-[620px] bg-card flex justify-center items-center">
        <h1>Failed to fetch movie details</h1>
      </div>
    );
  }

  if (isLoading || movieDetails === null || movieReleaseDates === null) {
    return (
      <div>
        <MovieDetailsSkeleton />
      </div>
    );
  }

  const backdropUrl = `https://image.tmdb.org/t/p/w1280${movieDetails?.backdrop_path}`;
  const posterUrl = `https://image.tmdb.org/t/p/w500${movieDetails?.poster_path}`;
  const year = movieDetails.release_date.substring(0, 4);
  const certification = movieReleaseDates.results.find(
    (result) => result.iso_3166_1 === "US"
  )?.release_dates[0].certification;
  const runtimeMinutes = movieDetails.runtime;
  const hours = Math.floor(runtimeMinutes / 60);
  const minutes = runtimeMinutes % 60;
  const runtimeString = `${hours}h ${minutes}m`;

  return (
    <div>
      <div className="relative bg-secondary dark:bg-card overflow-clip">
        <div className="flex xl:container justify-end relative ">
          <div className="relative flex h-[220px] sm:h-[320px] md:h-[420px] lg:h-[520px] 2xl:h-[620px]">
            <Image
              src={backdropUrl}
              alt={movieDetails.title}
              width={1280}
              height={720}
              layout="responsive"
              className="brightness-[60%] md:block hidden"
            />
            <div className="h-[80vw] w-[200px] absolute bg-secondary dark:bg-card top-[-10vw] left-[-100px] blur-xl hidden md:block"></div>
            <div className="h-[80vw] w-[200px] absolute bg-secondary dark:bg-card top-[-10vw] right-[-100px] blur-xl hidden xl:block"></div>
          </div>
        </div>
        <Image
          src={backdropUrl}
          alt={movieDetails.title}
          fill
          style={{ objectFit: "cover" }}
          className="brightness-[60%] md:hidden"
        />
        <div className="absolute w-full top-0">
          <div className="relative container">
            <div className="absolute top-0 flex">
              <div className="h-[220px] sm:h-[320px] md:h-[420px] lg:h-[520px] 2xl:h-[620px] flex gap-10 py-6 sm:py-8">
                <div className="hidden md:flex">
                  <Image
                    src={posterUrl}
                    alt={movieDetails.title}
                    width={500}
                    height={750}
                    layout="responsive"
                    className="rounded-sm"
                  />
                </div>

                <div className="sm:py-8 xl:max-w-[680px] lg:max-w-[480px] md:max-w-[300px] sm:max-w-[520px] max-w-[250px] flex items-end">
                  <div className="space-y-4">
                    <h1 className="xl:text-5xl sm:text-4xl text-2xl font-bold text-white">
                      {movieDetails.title}
                      <span className="font-normal text-white sm:text-2xl text-sm">
                        {" "}
                        ({year})
                      </span>
                    </h1>
                    <div className="space-y-4 hidden sm:block">
                      <div className="flex gap-2 items-center">
                        <div className="bg-black w-fit px-1 h-6 flex items-center justify-center rounded-sm opacity-70 border border-black text-sm">
                          <p className="text-white">
                            {certification ? certification : "NA"}
                          </p>
                        </div>

                        <p className="hidden xl:block text-white">
                          {movieDetails.release_date}
                        </p>
                        <div className="hidden xl:block text-white">-</div>
                        {movieDetails.genres.map((genre, index) => (
                          <p key={index} className="text-white">
                            {genre.name}
                          </p>
                        ))}
                        <div className="hidden xl:block text-white">-</div>
                        <p className="hidden xl:block text-white">
                          {runtimeString}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <StarRating rating={movieDetails.vote_average} />
                        <div className="block xl:hidden text-white">-</div>
                        <p className="block xl:hidden text-white">
                          {movieDetails.release_date}
                        </p>
                        <div className="block xl:hidden text-white">-</div>
                        <p className="block xl:hidden text-white">
                          {runtimeString}
                        </p>
                      </div>

                      <p className="text-sm lg:text-base text-white">
                        {movieDetails.overview}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container py-6 block sm:hidden">
        <div className="space-y-4 ">
          <div className="flex gap-2 items-center">
            <div className="bg-card w-fit px-1 h-6 flex items-center justify-center rounded-sm opacity-70 border text-sm">
              <p className="">{certification ? certification : "NA"}</p>
            </div>
            <div>-</div>
            <p>{movieDetails.release_date}</p>
            <div>-</div>
            <p>{runtimeString}</p>
          </div>
          <div className="flex gap-2 items-center">
            <StarRating rating={movieDetails.vote_average} />
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            {movieDetails.genres.map((genre, index) => (
              <p key={index}>{genre.name}</p>
            ))}
          </div>

          <p className="text-sm lg:text-base">{movieDetails.overview}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
