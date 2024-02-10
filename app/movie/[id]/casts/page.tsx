"use client";
import useMovieCast from "@/hooks/use-movie-cast";
import Image from "next/image";
import { User } from "lucide-react";
import MovieCastSkeleton from "@/components/movie-cast-skeleton";

interface MovieCastPage {
  params: {
    id: string;
  };
}

const MovieCastPage: React.FC<MovieCastPage> = ({ params }) => {
  const { movieCast, isLoading, error } = useMovieCast(params.id);

  if (isLoading || movieCast === null)
    return (
      <main className="container space-y-6 py-4">
        <h1 className="font-bold text-5xl">Cast</h1>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 9 }, (_, index) => (
            <div key={index}>
              <MovieCastSkeleton />
            </div>
          ))}
        </div>
      </main>
    );

  if (error)
    return (
      <main className="container py-4">
        <h1 className="text-3xl font-bold">
          Failed to fetch data, Try again later.
        </h1>
      </main>
    );

  return (
    <main className="container space-y-6 py-4">
      <h1 className="font-bold text-5xl">Cast</h1>
      <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {movieCast.cast.map((cast, index) => {
          const castProfileUrl = `https://image.tmdb.org/t/p/w185${cast.profile_path}`;
          return (
            <li key={index}>
              <div className="flex bg-card rounded-md overflow-clip border">
                {cast.profile_path ? (
                  <div className="relative aspect-[2/3] h-[150px] sm:h-[200px]">
                    <Image src={castProfileUrl} alt={cast.name} fill />
                  </div>
                ) : (
                  <div className="relative aspect-[2/3] h-[150px] sm:h-[200px] bg-secondary flex items-center justify-center">
                    <User size={58} />
                  </div>
                )}

                <div className="p-4 flex flex-col justify-between h-[150px] sm:h-[200px]">
                  <div>
                    <h2 className="font-bold">{cast.name}</h2>
                    <p className="font-light">{cast.character}</p>
                  </div>
                  <p className="font-light sm:hidden">
                    Pop: {Number(cast.popularity).toFixed(1)}
                  </p>
                  <p className="font-light sm:block hidden">
                    Popularity: {Number(cast.popularity).toFixed(1)}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <h1 className="font-bold text-5xl">Crew</h1>
      <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {movieCast.crew.map((cast, index) => {
          const castProfileUrl = `https://image.tmdb.org/t/p/w185${cast.profile_path}`;
          return (
            <li key={index}>
              <div className="flex bg-card rounded-md overflow-clip border">
                {cast.profile_path ? (
                  <div className="relative aspect-[2/3] h-[150px] sm:h-[200px]">
                    <Image src={castProfileUrl} alt={cast.name} fill />
                  </div>
                ) : (
                  <div className="relative aspect-[2/3] h-[150px] sm:h-[200px] bg-secondary flex items-center justify-center">
                    <User size={58} />
                  </div>
                )}

                <div className="p-4 flex flex-col justify-between h-[150px] sm:h-[200px]">
                  <div>
                    <h2 className="font-bold">{cast.name}</h2>
                    <p className="font-light">{cast.known_for_department}</p>
                  </div>
                  <p className="font-light sm:hidden">
                    Pop: {Number(cast.popularity).toFixed(1)}
                  </p>
                  <p className="font-light sm:block hidden">
                    Popularity: {Number(cast.popularity).toFixed(1)}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
};

export default MovieCastPage;
