import "server-only";
import Link from "next/link";
import Image from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import type { MovieDetailsData } from "@/lib/tmdb/types/movie";
export function getMovieStaticContent(
  movie: MovieDetailsData,
  certification: string,
) {
  // Release year & runtime calculations
  const releaseYear = movie.release_date
    ? movie.release_date.substring(0, 4)
    : "";
  const runtimeHours = Math.floor((movie.runtime || 0) / 60);
  const runtimeMins = (movie.runtime || 0) % 60;
  const runtimeFormatted =
    runtimeHours > 0 ? `${runtimeHours}h ${runtimeMins}m` : `${runtimeMins}m`;

  const posterUrl = movie.poster_path
    ? "https://image.tmdb.org/t/p/w780" + movie.poster_path
    : "/assets/images/movie-placeholder.svg";
  return {
    heading: (
      <>
        <div className="space-y-1.5">
          <h1 className="heading-hero text-foreground">{movie.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-muted-foreground sm:text-base">
            {releaseYear && <span>{releaseYear}</span>}
            {releaseYear && <span>·</span>}
            {certification && (
              <>
                <span>{certification}</span>
                <span>·</span>
              </>
            )}
            <span>{runtimeFormatted}</span>
          </div>
        </div>
      </>
    ),
    mobileOverview: (
      <>
        {/* MOBILE ONLY: Poster (1:3) + Genres & Plot (2:3) */}
        <div className="grid grid-cols-3 items-start gap-3.5 lg:hidden">
          <div className="relative col-span-1 aspect-2/3 w-full overflow-hidden rounded-2xl bg-card shadow-lg">
            <Image
              src={posterUrl}
              alt={movie.title}
              fill
              sizes="(max-width: 640px) 33vw, 160px"
              className="object-cover"
            />
          </div>

          <div className="col-span-2 min-w-0 space-y-2">
            {/* Genres scrollable carousel */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex scrollbar-none items-center gap-1.5 overflow-x-auto">
                {movie.genres.map((genre) => (
                  <Button
                    key={genre.id}
                    asChild
                    variant="secondary"
                    size="sm"
                    className="shrink-0"
                  >
                    <Link
                      href={`/movie?with_genres=${genre.id}`}
                      prefetch={false}
                    >
                      {genre.name}
                    </Link>
                  </Button>
                ))}
              </div>
            )}

            {/* Plot overview without label */}
            {movie.overview && (
              <p className="text-sm leading-relaxed text-foreground">
                {movie.overview}
              </p>
            )}
          </div>
        </div>
      </>
    ),
    desktopOverview: (
      <>
        {/* DESKTOP ONLY: Genres and Plot */}
        <div className="hidden space-y-4 lg:block">
          {movie.genres && movie.genres.length > 0 && (
            <div className="grid grid-cols-12 gap-4">
              <span className="col-span-2 text-sm font-bold text-muted-foreground">
                {movie.genres.length > 1 ? "Genres" : "Genre"}
              </span>
              <div className="col-span-10 flex flex-wrap items-center gap-2">
                {movie.genres.map((genre) => (
                  <Button key={genre.id} asChild variant="secondary" size="sm">
                    <Link
                      href={`/movie?with_genres=${genre.id}`}
                      prefetch={false}
                    >
                      {genre.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {movie.genres?.length > 0 && movie.overview && (
            <div className="h-px bg-border/50" />
          )}

          {movie.overview && (
            <div className="grid grid-cols-12 gap-4">
              <span className="col-span-2 text-sm font-bold text-muted-foreground">
                Plot
              </span>
              <p className="col-span-10 text-sm leading-relaxed text-foreground sm:text-base">
                {movie.overview}
              </p>
            </div>
          )}

          {(movie.genres?.length > 0 || movie.overview) && (
            <div className="h-px bg-border/50" />
          )}
        </div>
      </>
    ),
    facts: (
      <>
        {/* Box Office / Details */}
        {(movie.budget > 0 || movie.revenue > 0) && (
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:gap-4">
            <span className="text-sm font-bold text-muted-foreground sm:col-span-3 lg:col-span-2">
              Box Office
            </span>
            <div className="flex flex-wrap items-center gap-4 text-sm sm:col-span-9 sm:text-base lg:col-span-10">
              {movie.budget > 0 && (
                <span>
                  <strong className="text-muted-foreground">Budget:</strong>{" "}
                  <span className="font-medium text-foreground">
                    {formatCurrency(movie.budget)}
                  </span>
                </span>
              )}
              {movie.revenue > 0 && (
                <span>
                  <strong className="text-muted-foreground">Worldwide:</strong>{" "}
                  <span className="font-medium text-foreground">
                    {formatCurrency(movie.revenue)}
                  </span>
                </span>
              )}
            </div>
          </div>
        )}
      </>
    ),
  };
}
