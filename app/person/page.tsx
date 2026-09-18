"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, User, X } from "lucide-react";
import { usePopularPeopleQuery, useSearchPeopleQuery } from "@/hooks/use-tmdb";
import { PersonCard } from "@/components/person";
import { PaginationSystem } from "@/components/common/pagination-system";
import { MovieCardSkeleton } from "@/components/common/movie-card-skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

function PeopleContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryParam = searchParams.get("q") || "";
  const pageParam = searchParams.get("page");
  const currentPage = Number(pageParam) || 1;

  const [searchInput, setSearchInput] = useState(queryParam);

  const isSearching = Boolean(queryParam.trim());

  // Use popular query if no search query, else search query
  const { data: popularData, isLoading: isPopularLoading } =
    usePopularPeopleQuery(isSearching ? 1 : currentPage);

  const { data: searchData, isLoading: isSearchLoading } = useSearchPeopleQuery(
    queryParam,
    currentPage
  );

  const activeData = isSearching ? searchData : popularData;
  const isLoading = isSearching ? isSearchLoading : isPopularLoading;

  const people = activeData?.results || [];
  const totalPages = Math.min(activeData?.total_pages || 1, 500);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (trimmed) {
      router.push(`/person?q=${encodeURIComponent(trimmed)}&page=1`);
    } else {
      router.push("/person");
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    router.push("/person");
  };

  const handlePageChange = (newPage: number) => {
    if (isSearching) {
      router.push(`/person?q=${encodeURIComponent(queryParam)}&page=${newPage}`);
    } else {
      router.push(`/person?page=${newPage}`);
    }
  };

  return (
    <main className="container min-h-screen space-y-8 pt-20 pb-16">
      {/* Header & Search Bar */}
      <div className="flex flex-col gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            {isSearching ? `People matching "${queryParam}"` : "Popular People"}
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {isSearching
              ? `Found ${activeData?.total_results || 0} actors and creators`
              : "Discover the most popular actors, directors, and creators in entertainment"}
          </p>
        </div>

        {/* Live Search Box */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex w-full max-w-sm items-center"
        >
          <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
          <Input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search actors, directors..."
            className="h-10 rounded-none bg-card pr-10 pl-9 text-sm"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </form>
      </div>

      {/* People Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 18 }, (_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : people.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center space-y-3 rounded-none border border-dashed border-border bg-card p-8 text-center">
          <User className="size-10 text-muted-foreground" />
          <h3 className="text-base font-bold">No People Found</h3>
          <p className="max-w-md text-xs text-muted-foreground">
            We couldn&apos;t find anyone matching &quot;{queryParam}&quot;. Please try a different name.
          </p>
          <Button
            variant="outline"
            onClick={handleClearSearch}
            className="rounded-none text-xs"
          >
            Clear Search
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {people.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>

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
    </main>
  );
}

export default function PeoplePage() {
  return (
    <Suspense
      fallback={
        <main className="container min-h-screen space-y-8 pt-20 pb-16">
          <div className="h-12 w-64 animate-pulse rounded-none bg-secondary" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 12 }, (_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        </main>
      }
    >
      <PeopleContent />
    </Suspense>
  );
}
