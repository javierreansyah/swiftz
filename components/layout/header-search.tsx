"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
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
                ? "text-white/70"
                : "text-muted-foreground"
            )}
          />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (debouncedQuery.length >= 2) setIsDropdownOpen(true);
            }}
            placeholder="Search movies, TV, people..."
            aria-label="Search"
            className={cn(
              "h-9 w-full rounded-none pr-8 pl-9 text-xs transition-all duration-200 focus-visible:ring-1 focus-visible:ring-primary",
              !isScrolled && isMovieDetailPage
                ? "border-white/20 bg-black/30 text-white placeholder:text-white/60 focus:border-white/40 focus:bg-black/50"
                : "border-border/60 bg-muted/40 text-foreground placeholder:text-muted-foreground hover:bg-muted/70 focus:bg-background"
            )}
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-2.5 rounded-none p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          ) : (
            <span
              className={cn(
                "pointer-events-none absolute right-2.5 hidden rounded-none border px-1.5 py-0.5 text-[10px] font-medium select-none lg:inline-block",
                !isScrolled && isMovieDetailPage
                  ? "border-white/20 text-white/50"
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
        <div className="absolute top-12 left-0 z-50 hidden w-96 overflow-hidden rounded-none border border-border bg-popover text-popover-foreground shadow-2xl md:block">
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
                          className={`py-0.2 rounded-none px-1 text-[9px] font-bold uppercase ${
                            item.media_type === "movie"
                              ? "bg-blue-500/10 text-blue-500"
                              : item.media_type === "tv"
                              ? "bg-purple-500/10 text-purple-500"
                              : "bg-emerald-500/10 text-emerald-500"
                          }`}
                        >
                          {item.media_type}
                        </span>
                      </div>
                      {subText && (
                        <p className="text-[11px] text-muted-foreground">
                          {subText}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* View All Results Footer */}
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="flex w-full items-center justify-between bg-muted/30 p-2.5 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <span>See all results for &quot;{debouncedQuery}&quot;</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mobile Search Button Trigger */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Search"
        className={cn(
          "size-9 md:hidden",
          !isScrolled && isMovieDetailPage
            ? "text-white hover:bg-white/10 hover:text-white"
            : "text-foreground hover:bg-accent"
        )}
      >
        <Search className="size-5" />
      </Button>

      {/* Mobile Search Sheet From Top */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent
          side="top"
          className="max-h-[90vh] overflow-y-auto border-b border-border/80 bg-background/95 p-4 pt-5 pb-6 backdrop-blur-xl"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Search Swiftz</SheetTitle>
          </SheetHeader>

          <form onSubmit={handleSearchSubmit} className="mx-auto max-w-xl space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={mobileInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies, TV shows, people..."
                  aria-label="Search query"
                  className="h-11 rounded-none border-border bg-secondary/50 pr-9 pl-10 text-sm focus-visible:ring-1 focus-visible:ring-primary"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
              <Button
                type="submit"
                size="default"
                className="h-11 gap-1.5 rounded-none bg-primary px-4 font-bold text-primary-foreground hover:bg-primary/90"
              >
                <span>Search</span>
                <CornerDownLeft className="size-3.5" />
              </Button>
            </div>

            {/* Mobile Live Autocomplete List */}
            {debouncedQuery.length >= 2 && (
              <div className="overflow-hidden rounded-none border border-border bg-card">
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
                              <span className="py-0.2 rounded-none bg-secondary px-1 text-[9px] font-bold text-muted-foreground uppercase">
                                {item.media_type}
                              </span>
                            </div>
                            {subText && (
                              <p className="text-[11px] text-muted-foreground">
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
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="hover:underline"
              >
                Cancel
              </button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default HeaderSearch;
