"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "@/components/ui/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  X,
  CornerDownLeft,
  Film,
  Tv,
  User,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMultiSearchQuery } from "@/hooks/use-tmdb";
import { MultiSearchResultItem } from "@/types";
import { cn } from "@/lib/utils";

export interface HeaderSearchProps {
  className?: string;
  isScrolled?: boolean;
  isMovieDetailPage?: boolean;
}

export function HeaderSearch({
  className,
  isScrolled = false,
  isMovieDetailPage = false,
}: HeaderSearchProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Debounce search query by 250ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Sync with current query if on /search page
  useEffect(() => {
    if (pathname === "/search") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q") || "";
      setSearchQuery(q);
    } else {
      setSearchQuery("");
    }
    setIsDropdownOpen(false);
  }, [pathname]);

  // Open dropdown when query has length
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  }, [debouncedQuery]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live multi-search results
  const { data: searchResults, isLoading } = useMultiSearchQuery(
    debouncedQuery,
    1
  );

  const rawResults = searchResults?.results || [];
  // Filter only movie, tv, person
  const liveResults = rawResults
    .filter((item) => ["movie", "tv", "person"].includes(item.media_type))
    .slice(0, 6);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setIsDropdownOpen(false);
    setIsMobileOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSelectResult = (item: MultiSearchResultItem) => {
    setIsDropdownOpen(false);
    setIsMobileOpen(false);
    setSearchQuery("");

    if (item.media_type === "movie") {
      router.push(`/movie/${item.id}`);
    } else if (item.media_type === "tv") {
      router.push(`/tv/${item.id}`);
    } else if (item.media_type === "person") {
      router.push(`/person/${item.id}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    setIsDropdownOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative flex items-center", className)}>
      {/* Desktop Inline Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="relative hidden items-center md:flex"
      >
        <div className="relative flex w-56 items-center transition-all duration-300 focus-within:w-80 lg:w-72 lg:focus-within:w-96">
          <Search
            className={cn(
              "pointer-events-none absolute left-3 size-4 transition-colors",
              !isScrolled && isMovieDetailPage
                ? "text-media-foreground/70"
                : "text-muted-foreground"
            )}
          />
          <Input leadingIcon trailingIcon
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (debouncedQuery.length >= 2) setIsDropdownOpen(true);
            }}
            placeholder="Search movies, TV, people..."
            aria-label="Search"
            className="w-full"
          />
          {searchQuery ? (
            <Button variant="ghost" size="icon-xs"
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-2.5"
            >
              <X className="size-3.5" />
            </Button>
          ) : (
            <span
              className={cn(
                "pointer-events-none absolute right-2.5 hidden rounded-xl border px-1.5 py-0.5 text-xs font-medium select-none lg:inline-block",
                !isScrolled && isMovieDetailPage
                  ? "border-media-foreground/20 text-media-foreground/50"
                  : "border-border/60 text-muted-foreground/70"
              )}
            >
              ⌘K
            </span>
          )}
        </div>
      </form>

      {/* Desktop Live Dropdown Tooltip */}
      {isDropdownOpen && debouncedQuery.length >= 2 && (
        <div className="absolute top-12 left-0 z-50 hidden w-96 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl md:block">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 p-6 text-xs text-muted-foreground">
              <Loader2 className="size-4 animate-spin text-primary" />
              <span>Searching across Swiftz...</span>
            </div>
          ) : liveResults.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              No results found for &quot;{debouncedQuery}&quot;. Press enter to search all.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {liveResults.map((item) => {
                const title = item.title || item.name || "Untitled";
                const imagePath = item.poster_path || item.profile_path;
                const imageUrl = imagePath
                  ? `https://image.tmdb.org/t/p/w92${imagePath}`
                  : null;

                const date = item.release_date || item.first_air_date;
                const year = date ? date.substring(0, 4) : "";
                const subText =
                  item.media_type === "person"
                    ? item.known_for_department || "Celebrity"
                    : year;

                return (
                  <div
                    key={`${item.media_type}-${item.id}`}
                    onClick={() => handleSelectResult(item)}
                    className="group flex cursor-pointer items-center gap-3 p-2.5 transition-colors hover:bg-muted/70"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-2/3 w-10 shrink-0 overflow-hidden bg-muted">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={title}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center bg-secondary text-muted-foreground">
                          {item.media_type === "person" ? (
                            <User className="size-4" />
                          ) : item.media_type === "tv" ? (
                            <Tv className="size-4" />
                          ) : (
                            <Film className="size-4" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="line-clamp-1 text-xs font-bold text-foreground transition-colors group-hover:text-primary">
                          {title}
                        </span>
                        <span
                          className={`rounded-xl px-1 py-0.5 text-xs font-bold uppercase ${
                            item.media_type === "movie"
                              ? "bg-info/10 text-info"
                              : item.media_type === "tv"
                              ? "bg-highlight/10 text-highlight"
                              : "bg-success/10 text-success"
                          }`}
                        >
                          {item.media_type}
                        </span>
                      </div>
                      {subText && (
                        <p className="text-xs text-muted-foreground">
                          {subText}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* View All Results Footer */}
              <Button variant="default" size="sm"
                type="button"
                onClick={handleSearchSubmit}
                className="w-full justify-between"
              >
                <span>See all results for &quot;{debouncedQuery}&quot;</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Mobile Search Button Trigger */}
      <Button
        variant={!isScrolled && isMovieDetailPage ? "media-ghost" : "ghost"}
        size="icon"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Search"
        className="md:hidden"
      >
        <Search className="size-5" />
      </Button>

      {/* Mobile Search Sheet From Top */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent surface="search"
          side="top"
          className="overflow-y-auto"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Search Swiftz</SheetTitle>
          </SheetHeader>

          <form onSubmit={handleSearchSubmit} className="mx-auto max-w-xl space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground" />
                <Input leadingIcon trailingIcon
                  ref={mobileInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies, TV shows, people..."
                  aria-label="Search query"
                />
                {searchQuery && (
                  <Button variant="ghost" size="icon-xs"
                    type="button"
                    onClick={clearSearch}
                    className="absolute top-1/2 right-3 -translate-y-1/2"
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </div>
              <Button
                type="submit"
                size="lg"
              >
                <span>Search</span>
                <CornerDownLeft className="size-3.5" />
              </Button>
            </div>

            {/* Mobile Live Autocomplete List */}
            {debouncedQuery.length >= 2 && (
              <div className="overflow-hidden rounded-3xl border border-border bg-card">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2 p-4 text-xs text-muted-foreground">
                    <Loader2 className="size-4 animate-spin text-primary" />
                    <span>Searching...</span>
                  </div>
                ) : liveResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-muted-foreground">
                    No results found for &quot;{debouncedQuery}&quot;. Press Search to see all.
                  </div>
                ) : (
                  <div className="divide-y divide-border/60">
                    {liveResults.map((item) => {
                      const title = item.title || item.name || "Untitled";
                      const imagePath = item.poster_path || item.profile_path;
                      const imageUrl = imagePath
                        ? `https://image.tmdb.org/t/p/w92${imagePath}`
                        : null;

                      const date = item.release_date || item.first_air_date;
                      const year = date ? date.substring(0, 4) : "";
                      const subText =
                        item.media_type === "person"
                          ? item.known_for_department || "Celebrity"
                          : year;

                      return (
                        <div
                          key={`${item.media_type}-${item.id}`}
                          onClick={() => handleSelectResult(item)}
                          className="flex cursor-pointer items-center gap-3 p-2.5 transition-colors hover:bg-muted"
                        >
                          <div className="relative aspect-2/3 w-10 shrink-0 overflow-hidden bg-muted">
                            {imageUrl && (
                              <Image
                                src={imageUrl}
                                alt={title}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="line-clamp-1 text-xs font-bold text-foreground">
                                {title}
                              </span>
                              <span className="rounded-xl bg-secondary px-1 py-0.5 text-xs font-bold text-muted-foreground uppercase">
                                {item.media_type}
                              </span>
                            </div>
                            {subText && (
                              <p className="text-xs text-muted-foreground">
                                {subText}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
              <span>Press enter to search across all categories</span>
              <Button variant="link" size="inline"
                type="button"
                onClick={() => setIsMobileOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default HeaderSearch;
