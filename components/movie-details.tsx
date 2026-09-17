import React from "react";
import Image from "next/image";
import StarRating from "./star-rating";
import MovieUserActions from "./movie-user-actions";
import { getMovieDetails, getMovieReleaseDates } from "@/lib/tmdb";

interface MovieDetailsProps {
  id: string;
}

const MovieDetails: React.FC<MovieDetailsProps> = async ({ id }) => {
  const [movieDetails, movieReleaseDates] = await Promise.all([
    getMovieDetails(id),
    getMovieReleaseDates(id),
  ]);

  const backdropUrl = `https://image.tmdb.org/t/p/w1280${movieDetails.backdrop_path}`;
  const posterUrl = `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`;
  const year = movieDetails.release_date
    ? movieDetails.release_date.substring(0, 4)
    : "";
  const certification = movieReleaseDates.results?.find(
    (result) => result.iso_3166_1 === "US"
  )?.release_dates[0]?.certification;
  const runtimeMinutes = movieDetails.runtime || 0;
  const hours = Math.floor(runtimeMinutes / 60);
  const minutes = runtimeMinutes % 60;
  const runtimeString = `${hours}h ${minutes}m`;

  return (
    <section>
      <div className="relative overflow-hidden bg-secondary dark:bg-card">
        {movieDetails.backdrop_path && (
          <Image
            src={backdropUrl}
            alt=""
            fill
            sizes="100vw"
            className="pointer-events-none scale-125 object-cover blur-3xl brightness-45"
            priority
          />
        )}

        <div className="relative z-10 mx-auto flex w-full justify-end xl:container">
          <div className="relative flex h-55 w-full overflow-hidden sm:h-80 md:h-105 lg:h-130 2xl:h-155">
            <Image
              src={backdropUrl}
              alt={movieDetails.title}
              width={1280}
              height={720}
              className="hidden h-auto w-full object-cover object-right brightness-65 md:block"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
              }}
              priority
            />
          </div>
        </div>

        <Image
          src={backdropUrl}
          alt={movieDetails.title}
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          className="z-0 brightness-60 md:hidden"
        />

        <div className="absolute top-0 z-20 w-full">
          <div className="relative container">
            <div className="absolute top-0 flex">
              <div className="flex h-55 gap-10 pt-16 pb-6 sm:h-80 sm:pt-20 sm:pb-8 md:h-105 lg:h-130 2xl:h-155">
                <div className="hidden md:flex">
                  <Image
                    src={posterUrl}
                    alt={movieDetails.title}
                    width={500}
                    height={750}
                    className="h-auto w-full rounded-sm shadow-2xl"
                  />
                </div>

                <div className="flex max-w-62.5 items-end sm:max-w-130 md:max-w-75 md:py-8 lg:max-w-120 xl:max-w-170">
                  <div className="space-y-4">
                    <h1 className="text-2xl font-bold text-white drop-shadow-md sm:text-4xl xl:text-5xl">
                      {movieDetails.title}
                      {year && (
                        <span className="text-sm font-normal text-white sm:text-2xl">
                          {" "}
                          ({year})
                        </span>
                      )}
                    </h1>
                    <div className="hidden space-y-4 lg:block">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-fit items-center justify-center rounded-sm border border-white/20 bg-black/80 px-1 text-sm">
                          <p className="font-medium text-white">
                            {certification ? certification : "NA"}
                          </p>
                        </div>

                        <p className="hidden text-white xl:block">
                          {movieDetails.release_date}
                        </p>
                        <div className="hidden text-white xl:block">-</div>
                        {movieDetails.genres.map((genre, index) => (
                          <p key={index} className="text-white">
                            {genre.name}
                          </p>
                        ))}
                        <div className="hidden text-white xl:block">-</div>
                        <p className="hidden text-white xl:block">
                          {runtimeString}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={movieDetails.vote_average} />
                        <div className="block text-white xl:hidden">-</div>
                        <p className="block text-white xl:hidden">
                          {movieDetails.release_date}
                        </p>
                        <div className="block text-white xl:hidden">-</div>
                        <p className="block text-white xl:hidden">
                          {runtimeString}
                        </p>
                      </div>

                      <p className="text-sm text-white/90 drop-shadow lg:text-base">
                        {movieDetails.overview}
                      </p>

                      <div>
                        <MovieUserActions id={id} title={movieDetails.title} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container block py-6 sm:py-0 sm:pt-8 sm:pb-0 lg:hidden">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-fit items-center justify-center rounded-sm border bg-card px-1 text-sm opacity-70">
              <p className="">{certification ? certification : "NA"}</p>
            </div>
            <div>-</div>
            <p>{movieDetails.release_date}</p>
            <div>-</div>
            <p>{runtimeString}</p>
          </div>
          <div className="flex items-center gap-2">
            <StarRating rating={movieDetails.vote_average} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {movieDetails.genres.map((genre, index) => (
              <p key={index}>{genre.name}</p>
            ))}
          </div>

          <p className="text-sm lg:text-base">{movieDetails.overview}</p>

          <div className="pt-1">
            <MovieUserActions id={id} title={movieDetails.title} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovieDetails;
