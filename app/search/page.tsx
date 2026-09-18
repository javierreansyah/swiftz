"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  X,
  Info,
  Film,
  Tv,
  User,
  Layers,
  Tag,
  Building,
  Radio,
  Trophy,
  Calendar,
} from "lucide-react";
import {
  useSearchMoviesQuery,
  useSearchTVQuery,
  useSearchPeopleQuery,
  useSearchCollectionsQuery,
  useSearchCompaniesQuery,
  useSearchKeywordsQuery,
  useSearchTypeCountsQuery,
} from "@/hooks/use-tmdb";
import { Input } from "@/components/ui/input";
import { PaginationSystem } from "@/components/common/pagination-system";
import { MovieCardSkeleton } from "@/components/common/movie-card-skeleton";

export const dynamic = "force-dynamic";

type SearchCategory =
  | "movies"
  | "tv"
  | "people"
  | "collections"
  | "keywords"
  | "companies"
  | "networks"
  | "awards";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawQuery = searchParams.get("q") || "";
  const typeParam = (searchParams.get("type") as SearchCategory) || "movies";
  const pageParam = searchParams.get("page");
  const currentPage = Number(pageParam) || 1;

  const [inputVal, setInputVal] = useState(rawQuery);

  useEffect(() => {
    setInputVal(rawQuery);
  }, [rawQuery]);

  // Support year filter shorthand (e.g., "spider man y:2002")
  const { cleanQuery, yearFilter } = useMemo(() => {
    const yearMatch = rawQuery.match(/\by:(\d{4})\b/i);
    if (yearMatch) {
      const year = yearMatch[1];
      const clean = rawQuery.replace(/\by:\d{4}\b/i, "").trim();
      return { cleanQuery: clean || rawQuery, yearFilter: year };
    }
    return { cleanQuery: rawQuery, yearFilter: null };
  }, [rawQuery]);

  // Live Counts for each Category
  const { data: counts } = useSearchTypeCountsQuery(cleanQuery);

  // Queries for each Category
  const isMovies = typeParam === "movies";
  const isTV = typeParam === "tv";
  const isPeople = typeParam === "people";
  const isCollections = typeParam === "collections";
  const isCompanies = typeParam === "companies";
  const isKeywords = typeParam === "keywords";

  const { data: movieData, isLoading: isMovieLoading } = useSearchMoviesQuery(
    isMovies ? cleanQuery : "",
    currentPage
  );
  const { data: tvData, isLoading: isTvLoading } = useSearchTVQuery(
    isTV ? cleanQuery : "",
    currentPage
  );
  const { data: peopleData, isLoading: isPeopleLoading } = useSearchPeopleQuery(
    isPeople ? cleanQuery : "",
    currentPage
  );
  const { data: collectionsData, isLoading: isCollectionsLoading } =
    useSearchCollectionsQuery(isCollections ? cleanQuery : "", currentPage);
  const { data: companiesData, isLoading: isCompaniesLoading } =
    useSearchCompaniesQuery(isCompanies ? cleanQuery : "", currentPage);
  const { data: keywordsData, isLoading: isKeywordsLoading } =
    useSearchKeywordsQuery(isKeywords ? cleanQuery : "");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}&type=${typeParam}&page=1`);
    }
  };

  const handleCategoryChange = (newCategory: SearchCategory) => {
    router.push(
      `/search?q=${encodeURIComponent(rawQuery)}&type=${newCategory}&page=1`
    );
  };

  const handlePageChange = (newPage: number) => {
    router.push(
      `/search?q=${encodeURIComponent(rawQuery)}&type=${typeParam}&page=${newPage}`
    );
  };

  const categories = [
    {
      id: "movies" as SearchCategory,
      label: "Movies",
      count: counts?.movies ?? movieData?.total_result ?? 0,
      icon: Film,
    },
    {
      id: "tv" as SearchCategory,
      label: "TV Shows",
      count: counts?.tv ?? tvData?.total_results ?? 0,
      icon: Tv,
    },
    {
      id: "people" as SearchCategory,
      label: "People",
      count: counts?.people ?? peopleData?.total_results ?? 0,
      icon: User,
    },
    {
      id: "collections" as SearchCategory,
      label: "Collections",
      count: counts?.collections ?? collectionsData?.total_results ?? 0,
      icon: Layers,
    },
    {
      id: "keywords" as SearchCategory,
      label: "Keywords",
      count: counts?.keywords ?? keywordsData?.total_results ?? 0,
      icon: Tag,
    },
    {
      id: "companies" as SearchCategory,
      label: "Companies",
      count: counts?.companies ?? companiesData?.total_results ?? 0,
      icon: Building,
    },
    {
      id: "networks" as SearchCategory,
      label: "Networks",
      count: 0,
      icon: Radio,
    },
    {
      id: "awards" as SearchCategory,
      label: "Awards",
      count: 0,
      icon: Trophy,
    },
  ];

  // Determine active dataset & pagination
  let activeList: React.ReactNode = null;
  let totalPages = 1;
  let isLoading = false;

  if (isMovies) {
    isLoading = isMovieLoading;
    const rawMovies = movieData?.results || [];
    const movies = yearFilter
      ? rawMovies.filter(
          (m) => m.release_date && m.release_date.startsWith(yearFilter)
        )
      : rawMovies;
    totalPages = Math.min(movieData?.total_pages || 1, 500);

    activeList = (
      <div className="space-y-4">
        {movies.map((movie) => {
          const posterUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
            : null;
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
              className="group flex gap-4 overflow-hidden rounded-none border border-border bg-card p-3 shadow-xs transition-all hover:border-primary/50 hover:shadow-md sm:p-4"
            >
              <div className="relative aspect-2/3 w-20 shrink-0 overflow-hidden bg-muted sm:w-24">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={movie.title}
                    fill
                    sizes="96px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-secondary text-xs text-muted-foreground">
                    <Film className="size-6" />
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center space-y-1.5">
                <h3 className="line-clamp-1 text-base font-bold text-foreground transition-colors group-hover:text-primary sm:text-lg">
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
  } else if (isTV) {
    isLoading = isTvLoading;
    const tvShows = tvData?.results || [];
    totalPages = Math.min(tvData?.total_pages || 1, 500);

    activeList = (
      <div className="space-y-4">
        {tvShows.map((show) => {
          const posterUrl = show.poster_path
            ? `https://image.tmdb.org/t/p/w185${show.poster_path}`
            : null;
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
              className="group flex gap-4 overflow-hidden rounded-none border border-border bg-card p-3 shadow-xs transition-all hover:border-primary/50 hover:shadow-md sm:p-4"
            >
              <div className="relative aspect-2/3 w-20 shrink-0 overflow-hidden bg-muted sm:w-24">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={show.name}
                    fill
                    sizes="96px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-secondary text-xs text-muted-foreground">
                    <Tv className="size-6" />
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center space-y-1.5">
                <h3 className="line-clamp-1 text-base font-bold text-foreground transition-colors group-hover:text-primary sm:text-lg">
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
  } else if (isPeople) {
    isLoading = isPeopleLoading;
    const people = peopleData?.results || [];
    totalPages = Math.min(peopleData?.total_pages || 1, 500);

    activeList = (
      <div className="space-y-4">
        {people.map((person) => {
          const profileUrl = person.profile_path
            ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
            : null;

          const knownForSummary = person.known_for
            ?.map((k) => k.title || k.name)
            .filter(Boolean)
            .join(", ");

          return (
            <Link
              key={person.id}
              href={`/person/${person.id}`}
              className="group flex gap-4 overflow-hidden rounded-none border border-border bg-card p-3 shadow-xs transition-all hover:border-primary/50 hover:shadow-md sm:p-4"
            >
              <div className="relative aspect-2/3 w-20 shrink-0 overflow-hidden bg-muted sm:w-24">
                {profileUrl ? (
                  <Image
                    src={profileUrl}
                    alt={person.name}
                    fill
                    sizes="96px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-secondary text-xs text-muted-foreground">
                    <User className="size-6" />
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center space-y-1.5">
                <h3 className="line-clamp-1 text-base font-bold text-foreground transition-colors group-hover:text-primary sm:text-lg">
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
  } else if (isCollections) {
    isLoading = isCollectionsLoading;
    const collections = collectionsData?.results || [];
    totalPages = Math.min(collectionsData?.total_pages || 1, 500);

    activeList = (
      <div className="space-y-4">
        {collections.map((col) => {
          const posterUrl = col.poster_path
            ? `https://image.tmdb.org/t/p/w185${col.poster_path}`
            : null;

          return (
            <div
              key={col.id}
              className="flex gap-4 overflow-hidden rounded-none border border-border bg-card p-3 shadow-xs sm:p-4"
            >
              <div className="relative aspect-2/3 w-20 shrink-0 overflow-hidden bg-muted sm:w-24">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={col.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-secondary text-xs text-muted-foreground">
                    <Layers className="size-6" />
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center space-y-1.5">
                <h3 className="line-clamp-1 text-base font-bold text-foreground sm:text-lg">
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
  } else if (isKeywords) {
    isLoading = isKeywordsLoading;
    const keywords = keywordsData?.results || [];

    activeList = (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {keywords.map((kw) => (
          <Link
            key={kw.id}
            href={`/movie?keywords=${kw.id}`}
            className="group flex items-center justify-between rounded-none border border-border bg-card p-3 text-xs font-semibold text-foreground transition-all hover:border-primary hover:text-primary"
          >
            <span className="line-clamp-1">{kw.name}</span>
            <Tag className="size-3 text-muted-foreground group-hover:text-primary" />
          </Link>
        ))}
      </div>
    );
  } else if (isCompanies) {
    isLoading = isCompaniesLoading;
    const companies = companiesData?.results || [];
    totalPages = Math.min(companiesData?.total_pages || 1, 500);

    activeList = (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((comp) => {
          const logoUrl = comp.logo_path
            ? `https://image.tmdb.org/t/p/w185${comp.logo_path}`
            : null;

          return (
            <div
              key={comp.id}
              className="flex items-center gap-4 rounded-none border border-border bg-card p-4 shadow-xs"
            >
              <div className="relative flex size-12 shrink-0 items-center justify-center bg-muted p-1">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={comp.name}
                    fill
                    sizes="48px"
                    className="object-contain p-1"
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
  } else {
    activeList = (
      <div className="flex h-48 flex-col items-center justify-center space-y-2 rounded-none border border-dashed border-border bg-card p-8 text-center">
        <h3 className="text-sm font-bold text-foreground">
          No records found for this category
        </h3>
        <p className="text-xs text-muted-foreground">
          TMDB currently has no registered data under this type for &quot;{rawQuery}&quot;.
        </p>
      </div>
    );
  }

  return (
    <main className="container min-h-screen space-y-8 py-20">
      {/* Top Search Bar with Clear Button */}
      <form
        onSubmit={handleSearchSubmit}
        className="relative flex w-full items-center border-b border-border pb-4"
      >
        <Search className="pointer-events-none absolute left-3 size-5 text-muted-foreground" />
        <Input
          type="search"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Search movies, TV shows, people, collections..."
          className="h-12 rounded-none border-border bg-card pr-10 pl-11 text-base focus-visible:ring-1 focus-visible:ring-primary"
        />
        {inputVal && (
          <button
            type="button"
            onClick={() => {
              setInputVal("");
              router.push("/search");
            }}
            className="absolute right-3 p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </form>

      {/* Main Two-Column Layout matching Reference 3 */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Left Sidebar (Desktop 4 cols) / Top Pills (Mobile) */}
        <aside className="space-y-4 lg:col-span-4 xl:col-span-3">
          {/* Card Header & Category List */}
          <div className="overflow-hidden rounded-none border border-border bg-card shadow-xs">
            <div className="bg-primary px-4 py-3 text-sm font-bold text-primary-foreground">
              Search Results
            </div>

            <div className="divide-y divide-border/60">
              {categories.map((cat) => {
                const isActive = typeParam === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-secondary font-bold text-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <cat.icon
                        className={`size-4 ${
                          isActive ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                      <span>{cat.label}</span>
                    </div>

                    <span
                      className={`rounded-none px-2 py-0.5 text-[11px] font-bold ${
                        isActive
                          ? "bg-muted text-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {cat.count.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Tip Notice */}
          <div className="flex items-start gap-2.5 rounded-none border border-border/80 bg-muted/40 p-3.5 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="leading-relaxed">
              <strong>Tip:</strong> You can use the <code className="rounded-none bg-background px-1 py-0.5 font-mono text-[11px] text-foreground">y:</code> filter to narrow your results by year. Example: <span className="text-foreground italic">&apos;star wars y:1977&apos;</span>.
            </p>
          </div>
        </aside>

        {/* Right Content Column */}
        <section className="min-w-0 flex-1 space-y-6 lg:col-span-8 xl:col-span-9">
          {!rawQuery ? (
            <div className="flex h-64 flex-col items-center justify-center space-y-2 rounded-none border border-dashed border-border bg-card p-8 text-center">
              <Search className="size-10 text-muted-foreground" />
              <h2 className="text-base font-bold">Search Swiftz</h2>
              <p className="text-xs text-muted-foreground">
                Enter a title, actor, or keyword in the box above to explore movies, TV shows, and celebrities.
              </p>
            </div>
          ) : isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="flex h-32 animate-pulse rounded-none bg-secondary/40"
                />
              ))}
            </div>
          ) : (
            <>
              {activeList}

              {totalPages > 1 && (
                <div className="pt-6">
                  <PaginationSystem
                    currentPage={currentPage}
                    totalPage={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="container min-h-screen space-y-8 py-20">
          <div className="h-12 w-full animate-pulse rounded-none bg-secondary" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="h-72 w-full animate-pulse rounded-none bg-secondary lg:col-span-4" />
            <div className="h-72 w-full animate-pulse rounded-none bg-secondary lg:col-span-8" />
          </div>
        </main>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
