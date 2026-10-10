import Image from "@/components/ui/image";
import Link from "next/link";
import { Tag, Building } from "lucide-react";
import type { Movie } from "@/lib/tmdb/types/movie";
import type { TVShow } from "@/lib/tmdb/types/tv";
import type { Person } from "@/lib/tmdb/types/people";
import type {
  SearchCollectionItem,
  SearchCompanyItem,
  TMDBKeyword,
} from "@/lib/tmdb/types/search";
import type { SearchDataset } from "@/features/search/types";
import { MovieCard } from "@/features/movies/components/movie-card";
import { TVCard } from "@/features/tv/discovery/tv-card";
import { PersonCard } from "@/features/people/components/person-card";
import { MediaCard } from "@/features/media/components/media-card";

function MovieSearchResults({ items: movies }: { items: Movie[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          id={movie.id}
          title={movie.title}
          poster={movie.poster_path}
          rating={movie.vote_average}
          year={
            movie.release_date ? movie.release_date.substring(0, 4) : undefined
          }
          variant="grid"
        />
      ))}
    </div>
  );
}

function TVSearchResults({ items: tvShows }: { items: TVShow[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
      {tvShows.map((show) => (
        <TVCard key={show.id} show={show} variant="grid" />
      ))}
    </div>
  );
}

function PeopleSearchResults({ items: people }: { items: Person[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
      {people.map((person) => (
        <PersonCard key={person.id} person={person} variant="grid" />
      ))}
    </div>
  );
}

function CollectionSearchResults({
  items: collections,
}: {
  items: SearchCollectionItem[];
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
      {collections.map((col) => (
        <MediaCard
          key={col.id}
          type="movie"
          id={col.id}
          title={col.name}
          image={col.poster_path}
          subtitle="Collection"
          variant="grid"
        />
      ))}
    </div>
  );
}

function KeywordSearchResults({ items: keywords }: { items: TMDBKeyword[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map((kw) => (
        <Link
          key={kw.id}
          href={`/movie?with_keywords=${kw.id}&keywords_names=${encodeURIComponent(encodeURIComponent(kw.name))}`}
          className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3.5 py-1.5 text-xs font-medium text-foreground transition-all hover:border-primary/50 hover:text-primary"
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
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {companies.map((comp) => {
        const logoUrl = comp.logo_path
          ? `https://image.tmdb.org/t/p/w185${comp.logo_path}`
          : null;

        return (
          <div
            key={comp.id}
            className="flex items-center gap-3.5 rounded-3xl border border-border/70 bg-card/60 p-3.5 shadow-xs transition-colors hover:border-primary/40"
          >
            <div className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-muted p-1">
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
              <h4 className="line-clamp-1 text-sm font-semibold text-foreground">
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
