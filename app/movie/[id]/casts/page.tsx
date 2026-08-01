import React from "react";
import Image from "next/image";
import { User } from "lucide-react";
import { getMovieCast } from "@/lib/tmdb";

interface MovieCastPageProps {
  params: {
    id: string;
  };
}

const MovieCastPage = async ({ params }: MovieCastPageProps) => {
  const movieCast = await getMovieCast(params.id);

  if (!movieCast || (!movieCast.cast.length && !movieCast.crew.length)) {
    return (
      <main className="container py-4">
        <h1 className="text-3xl font-bold">No cast or crew information found.</h1>
      </main>
    );
  }

  return (
    <main className="container space-y-6 pt-20 pb-8">
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
