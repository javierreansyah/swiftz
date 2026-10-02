import Image from "@/components/ui/image";
import Link from "next/link";
import { Film, Tv, User, Layers, Tag, Building } from "lucide-react";
import type { Movie } from "@/lib/tmdb/types/movie";
import type { TVShow } from "@/lib/tmdb/types/tv";
import type { Person } from "@/lib/tmdb/types/people";
import type {
  SearchCollectionItem,
  SearchCompanyItem,
  TMDBKeyword,
} from "@/lib/tmdb/types/search";
import type { SearchDataset } from "@/features/search/types";
import { SearchResultImage } from "@/features/search/components/search-result-image";
function MovieSearchResults({ items: movies }: { items: Movie[] }) {
  return (
    <div className="space-y-4">
      {movies.map((movie) => {
        const releaseFormatted = movie.release_date
          ? new Date(movie.release_date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
          : null;

        return (
          <Link
            key={movie.id}
            href={`/movie/${movie.id}`}
            className="group flex gap-4 overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-xs transition-all hover:border-primary/50 hover:shadow-md sm:p-4"
          >
            <div className="relative aspect-2/3 w-20 shrink-0 overflow-hidden bg-muted sm:w-24">
              <SearchResultImage
                path={movie.poster_path}
                title={movie.title}
                icon={Film}
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-center space-y-1.5">
              <h3 className="line-clamp-1 heading-card text-foreground transition-colors group-hover:text-primary">
                {movie.title}
              </h3>
              {releaseFormatted && (
                <p className="text-xs text-muted-foreground">
                  {releaseFormatted}
                </p>
              )}
              <p className="line-clamp-3 text-xs text-muted-foreground/90 sm:text-sm">
                {movie.overview || "No overview available."}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
function TVSearchResults({ items: tvShows }: { items: TVShow[] }) {
  return (
    <div className="space-y-4">
      {tvShows.map((show) => {
        const airFormatted = show.first_air_date
          ? new Date(show.first_air_date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
          : null;

        return (
          <Link
            key={show.id}
            href={`/tv/${show.id}`}
            className="group flex gap-4 overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-xs transition-all hover:border-primary/50 hover:shadow-md sm:p-4"
          >
            <div className="relative aspect-2/3 w-20 shrink-0 overflow-hidden bg-muted sm:w-24">
              <SearchResultImage
                path={show.poster_path}
                title={show.name}
                icon={Tv}
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-center space-y-1.5">
              <h3 className="line-clamp-1 heading-card text-foreground transition-colors group-hover:text-primary">
                {show.name}
              </h3>
              {airFormatted && (
                <p className="text-xs text-muted-foreground">{airFormatted}</p>
              )}
              <p className="line-clamp-3 text-xs text-muted-foreground/90 sm:text-sm">
                {show.overview || "No overview available."}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
function PeopleSearchResults({ items: people }: { items: Person[] }) {
  return (
    <div className="space-y-4">
      {people.map((person) => {
        const knownForSummary = person.known_for
          ?.map((k) => k.title || k.name)
          .filter(Boolean)
          .join(", ");

        return (
          <Link
            key={person.id}
            href={`/person/${person.id}`}
            className="group flex gap-4 overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-xs transition-all hover:border-primary/50 hover:shadow-md sm:p-4"
          >
            <div className="relative aspect-2/3 w-20 shrink-0 overflow-hidden bg-muted sm:w-24">
              <SearchResultImage
                path={person.profile_path}
                title={person.name}
                icon={User}
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-center space-y-1.5">
              <h3 className="line-clamp-1 heading-card text-foreground transition-colors group-hover:text-primary">
                {person.name}
              </h3>
              <p className="text-xs font-semibold text-primary">
                {person.known_for_department || "Actor"}
              </p>
              {knownForSummary && (
                <p className="line-clamp-2 text-xs text-muted-foreground/90 sm:text-sm">
                  Known for: {knownForSummary}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
function CollectionSearchResults({
  items: collections,
}: {
  items: SearchCollectionItem[];
}) {
  return (
    <div className="space-y-4">
      {collections.map((col) => {
        return (
          <div
            key={col.id}
            className="flex gap-4 overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-xs sm:p-4"
          >
            <div className="relative aspect-2/3 w-20 shrink-0 overflow-hidden bg-muted sm:w-24">
              <SearchResultImage
                path={col.poster_path}
                title={col.name}
                icon={Layers}
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-center space-y-1.5">
              <h3 className="line-clamp-1 heading-card text-foreground">
                {col.name}
              </h3>
              <p className="line-clamp-3 text-xs text-muted-foreground/90 sm:text-sm">
                {col.overview || "Movie franchise collection."}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
function KeywordSearchResults({ items: keywords }: { items: TMDBKeyword[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {keywords.map((kw) => (
        <Link
          key={kw.id}
          href={`/movie?with_keywords=${kw.id}&keywords_names=${encodeURIComponent(encodeURIComponent(kw.name))}`}
          className="group flex items-center justify-between rounded-3xl border border-border bg-card p-3 text-xs font-semibold text-foreground transition-all hover:border-primary hover:text-primary"
        >
          <span className="line-clamp-1">{kw.name}</span>
          <Tag className="size-3 text-muted-foreground group-hover:text-primary" />
        </Link>
      ))}
    </div>
  );
}
function CompanySearchResults({
  items: companies,
}: {
  items: SearchCompanyItem[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {companies.map((comp) => {
        const logoUrl = comp.logo_path
          ? `https://image.tmdb.org/t/p/w185${comp.logo_path}`
          : null;

        return (
          <div
            key={comp.id}
            className="flex items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-xs"
          >
            <div className="relative flex size-12 shrink-0 items-center justify-center bg-muted p-1">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={comp.name}
                  fill
                  sizes="48px"
                  variant="logo"
                />
              ) : (
                <Building className="size-6 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="line-clamp-1 text-sm font-bold text-foreground">
                {comp.name}
              </h4>
              {comp.origin_country && (
                <p className="text-xs text-muted-foreground">
                  Country: {comp.origin_country}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
export function SearchResults({
  dataset,
  rawQuery,
}: {
  dataset: SearchDataset;
  rawQuery: string;
}) {
  switch (dataset.category) {
    case "movies":
      return <MovieSearchResults items={dataset.items} />;
    case "tv":
      return <TVSearchResults items={dataset.items} />;
    case "people":
      return <PeopleSearchResults items={dataset.items} />;
    case "collections":
      return <CollectionSearchResults items={dataset.items} />;
    case "keywords":
      return <KeywordSearchResults items={dataset.items} />;
    case "companies":
      return <CompanySearchResults items={dataset.items} />;
    default:
      return (
        <div className="flex h-48 flex-col items-center justify-center space-y-2 rounded-3xl border border-dashed border-border bg-card p-8 text-center">
          <h3 className="heading-card text-foreground">
            No records found for this category
          </h3>
          <p className="text-xs text-muted-foreground">
            TMDB currently has no registered data under this type for &quot;
            {rawQuery}&quot;.
          </p>
        </div>
      );
  }
}
