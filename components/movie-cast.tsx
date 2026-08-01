import React from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { User } from "lucide-react";
import { getMovieCast } from "@/lib/tmdb";

interface MovieCastsProps {
  id: string;
}

const MovieCast: React.FC<MovieCastsProps> = async ({ id }) => {
  const movieCast = await getMovieCast(id);
  const movieCastPageUrl = `/movie/${id}/casts`;

  return (
    <section className="space-y-4 w-full">
      <ScrollArea className="sm:rounded-lg sm:border h-[378px] lg:h-[324px] xl:h-[424px] 2xl:h-[534px] w-full bg-card">
        <ul className="p-4 lg:space-y-3 flex lg:block gap-2 lg:h-auto">
          <h1 className="font-bold text-3xl hidden lg:block">Cast</h1>
          {movieCast.cast.map((cast, index) => {
            const castProfileUrl = `https://image.tmdb.org/t/p/w185${cast.profile_path}`;
            return (
              <li
                key={index}
                className="rounded-md w-40 overflow-clip border lg:w-auto"
              >
                <div>
                  {cast.profile_path ? (
                    <div className="relative aspect-[185/278]">
                      <Image
                        src={castProfileUrl}
                        alt={cast.original_name}
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  ) : (
                    <div className="aspect-[185/278] lg:w-full bg-secondary flex items-center justify-center">
                      <User size={58} />
                    </div>
                  )}
                </div>
                <div className="h-[104px] bg-background lg:w-auto px-4 pt-3 pb-4">
                  <h2 className="font-bold text-sm">{cast.name}</h2>
                  <p className="font-light text-sm">{cast.character}</p>
                </div>
              </li>
            );
          })}
          {movieCast.crew.map((cast, index) => {
            const castProfileUrl = `https://image.tmdb.org/t/p/w185${cast.profile_path}`;
            return (
              <li
                key={index}
                className="rounded-md w-40 overflow-clip border lg:w-auto"
              >
                <div>
                  {cast.profile_path ? (
                    <div className="relative aspect-[185/278]">
                      <Image
                        src={castProfileUrl}
                        alt={cast.original_name}
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  ) : (
                    <div className="aspect-[185/278] lg:w-full bg-secondary flex items-center justify-center">
                      <User size={58} />
                    </div>
                  )}
                </div>
                <div className="h-[104px] bg-background lg:w-auto px-4 pt-3 pb-4">
                  <h2 className="font-bold text-sm">{cast.name}</h2>
                  <p className="font-light text-sm">
                    {cast.known_for_department}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="container sm:hidden">
        <Button size="full" className="font-bold" asChild>
          <Link href={movieCastPageUrl}>See Full Cast</Link>
        </Button>
      </div>
      <div className="hidden sm:block">
        <Button size="full" className="font-bold" asChild>
          <Link href={movieCastPageUrl}>See Full Cast</Link>
        </Button>
      </div>
    </section>
  );
};

export default MovieCast;
