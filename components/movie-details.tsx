import React from "react";
import Image from "next/image";
import StarRating from "./star-rating";
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
            className="object-cover brightness-[45%] blur-3xl scale-125 pointer-events-none"
            priority
          />
        )}

        <div className="flex xl:container justify-end relative w-full mx-auto z-10">
          <div className="relative flex h-[220px] sm:h-[320px] md:h-[420px] lg:h-[520px] 2xl:h-[620px] w-full overflow-hidden">
            <Image
              src={backdropUrl}
              alt={movieDetails.title}
              width={1280}
              height={720}
              className="brightness-[65%] md:block hidden object-cover object-right w-full h-auto"
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
          style={{ objectFit: "cover" }}
          className="brightness-[60%] md:hidden z-0"
        />

        <div className="absolute w-full top-0 z-20">
          <div className="relative container">
            <div className="absolute top-0 flex">
              <div className="h-[220px] sm:h-[320px] md:h-[420px] lg:h-[520px] 2xl:h-[620px] flex gap-10 pt-16 sm:pt-20 pb-6 sm:pb-8">
                <div className="hidden md:flex">
                  <Image
                    src={posterUrl}
                    alt={movieDetails.title}
                    width={500}
                    height={750}
                    className="rounded-sm w-full h-auto shadow-2xl"
                  />
                </div>

                <div className="md:py-8 xl:max-w-[680px] lg:max-w-[480px] md:max-w-[300px] sm:max-w-[520px] max-w-[250px] flex items-end">
                  <div className="space-y-4">
                    <h1 className="xl:text-5xl sm:text-4xl text-2xl font-bold text-white drop-shadow-md">
                      {movieDetails.title}
                      {year && (
                        <span className="font-normal text-white sm:text-2xl text-sm">
                          {" "}
                          ({year})
                        </span>
                      )}
                    </h1>
                    <div className="space-y-4 hidden lg:block">
                      <div className="flex gap-2 items-center">
                        <div className="bg-black/80 w-fit px-1 h-6 flex items-center justify-center rounded-sm border border-white/20 text-sm">
                          <p className="text-white font-medium">
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

                      <p className="text-sm lg:text-base text-white/90 drop-shadow">
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
      <div className="container py-6 sm:py-0 sm:pt-8 sm:pb-0 block lg:hidden">
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
    </section>
  );
};

export default MovieDetails;
