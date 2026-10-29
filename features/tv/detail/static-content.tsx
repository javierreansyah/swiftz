import "server-only";
import Image from "@/components/ui/image";
import { Badge } from "@/components/ui/badge";
import type { TVShowDetailsData } from "@/lib/tmdb/types/tv";
export function getTVStaticContent(
  show: TVShowDetailsData,
  certification: string,
) {
  // Air years calculation: e.g. 2011–2019 or 2024–
  const startYear = show.first_air_date
    ? show.first_air_date.substring(0, 4)
    : "";
  const endYear = show.last_air_date ? show.last_air_date.substring(0, 4) : "";
  const airYears = startYear
    ? show.in_production
      ? `${startYear}–`
      : startYear === endYear
        ? startYear
        : `${startYear}–${endYear}`
    : "";

  const seasonsCount = show.number_of_seasons || show.seasons?.length || 1;
  const episodesCount = show.number_of_episodes || 0;
  const posterUrl = show.poster_path
    ? "https://image.tmdb.org/t/p/w780" + show.poster_path
    : "/assets/images/movie-placeholder.svg";
  return {
    heading: (
      <>
        <div className="space-y-1.5">
          <h1 className="heading-hero text-foreground">{show.name}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-muted-foreground sm:text-base">
            {airYears && <span>{airYears}</span>}
            {airYears && <span>·</span>}
            {certification && (
              <>
                <span>{certification}</span>
                <span>·</span>
              </>
            )}
            <span>
              {seasonsCount} {seasonsCount === 1 ? "Season" : "Seasons"}
            </span>
            {episodesCount > 0 && (
              <>
                <span>·</span>
                <span>{episodesCount} Episodes</span>
              </>
            )}
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
              alt={show.name}
              fill
              sizes="(max-width: 640px) 33vw, 160px"
              className="object-cover"
            />
          </div>

          <div className="col-span-2 min-w-0 space-y-2">
            {/* Genres scrollable carousel */}
            {show.genres && show.genres.length > 0 && (
              <div className="flex scrollbar-none items-center gap-1.5 overflow-x-auto">
                {show.genres.map((genre) => (
                  <Badge
                    key={genre.id}
                    variant="secondary"
                    className="shrink-0"
                  >
                    {genre.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Plot overview without label */}
            {show.overview && (
              <p className="text-sm leading-relaxed text-foreground">
                {show.overview}
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
          {show.genres && show.genres.length > 0 && (
            <div className="grid grid-cols-12 gap-4">
              <span className="col-span-2 text-sm font-bold text-muted-foreground">
                {show.genres.length > 1 ? "Genres" : "Genre"}
              </span>
              <div className="col-span-10 flex flex-wrap items-center gap-2">
                {show.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="h-px bg-border/50" />

          {show.overview && (
            <div className="grid grid-cols-12 gap-4">
              <span className="col-span-2 text-sm font-bold text-muted-foreground">
                Plot
              </span>
              <p className="col-span-10 text-sm leading-relaxed text-foreground sm:text-base">
                {show.overview}
              </p>
            </div>
          )}

          <div className="h-px bg-border/50" />
        </div>
      </>
    ),
    facts: (
      <>
        {/* Status & Type */}
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:gap-4">
          <span className="text-sm font-bold text-muted-foreground sm:col-span-3 lg:col-span-2">
            Status
          </span>
          <div className="flex flex-wrap items-center gap-4 text-sm sm:col-span-9 sm:text-base lg:col-span-10">
            {show.status && (
              <span>
                <strong className="text-muted-foreground">Status:</strong>{" "}
                <span className="font-medium text-foreground">
                  {show.status}
                </span>
              </span>
            )}
            {show.type && (
              <span>
                <strong className="text-muted-foreground">Type:</strong>{" "}
                <span className="font-medium text-foreground">{show.type}</span>
              </span>
            )}
          </div>
        </div>
      </>
    ),
  };
}
