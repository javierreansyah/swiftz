"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Film, Tv, User, Loader2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHandle,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useMultiSearchQuery } from "@/features/search/hooks/queries";
import type { MultiSearchResultItem } from "@/lib/tmdb/types/search";
import { cn } from "@/lib/utils";
import { searchResultSummary } from "@/features/search/result-summary";
import { QueryFeedback } from "@/features/media/components/query-feedback";
import { SearchResultImage } from "@/features/search/components/search-result-image";
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
  const {
    data: searchResults,
    isLoading,
    isError,
    refetch,
  } = useMultiSearchQuery(debouncedQuery, 1);

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
    router.push(searchResultSummary(item, item.media_type).href);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    setIsDropdownOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex w-full items-center justify-end md:justify-start",
        className,
      )}
    >
      {/* Desktop Inline Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="relative hidden w-full items-center md:flex"
      >
        <div className="relative flex w-full items-center">
          <Search
            className={cn(
              "pointer-events-none absolute left-3 size-4 transition-colors",
              !isScrolled && isMovieDetailPage
                ? "text-muted-foreground dark:text-media-foreground/70"
                : "text-muted-foreground",
            )}
          />
          <Input
            leadingIcon
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!e.target.value) {
                clearSearch();
              }
            }}
            onFocus={() => {
              if (debouncedQuery.length >= 2) setIsDropdownOpen(true);
            }}
            placeholder="Search movies, TV shows, people..."
            aria-label="Search"
            className="w-full"
          />
        </div>
      </form>

      {/* Desktop Live Dropdown Tooltip */}
      {isDropdownOpen && debouncedQuery.length >= 2 && (
        <div className="absolute inset-x-0 top-12 z-50 hidden overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl md:block">
          {isError && searchResults && (
            <QueryFeedback hasData onRetry={() => void refetch()} />
          )}
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 p-6 text-xs text-muted-foreground">
              <Loader2 className="size-4 animate-spin text-primary" />
              <span>Searching across Swiftz...</span>
            </div>
          ) : isError && !searchResults ? (
            <QueryFeedback hasData={false} onRetry={() => void refetch()} />
          ) : liveResults.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              No results found for &quot;{debouncedQuery}&quot;. Press enter to
              search all.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {liveResults.map((item) => {
                const {
                  title,
                  imagePath,
                  subtitle: subText,
                } = searchResultSummary(item, item.media_type);

                return (
                  <div
                    key={`${item.media_type}-${item.id}`}
                    onClick={() => handleSelectResult(item)}
                    className="group flex cursor-pointer items-center gap-3 p-2.5 transition-colors hover:bg-muted/70"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-2/3 w-10 shrink-0 overflow-hidden bg-muted">
                      <SearchResultImage
                        path={imagePath}
                        title={title}
                        icon={
                          item.media_type === "person"
                            ? User
                            : item.media_type === "tv"
                              ? Tv
                              : Film
                        }
                        size="compact"
                      />
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
              <div className="p-2">
                <Button
                  variant="default"
                  size="sm"
                  type="button"
                  onClick={handleSearchSubmit}
                  className="w-full justify-between"
                >
                  <span>See all results for &quot;{debouncedQuery}&quot;</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
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
        className="md:hidden"
      >
        <Search className="size-5" />
      </Button>

      {/* Mobile Search Bottom Sheet */}
      <Drawer open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <DrawerContent
          surface="detail"
          className="inset-x-0 bottom-0 mx-auto flex w-full max-w-(--max-container) flex-col overflow-hidden"
        >
          <DrawerHandle className="md:hidden" />
          <DrawerTitle className="sr-only">Search Swiftz</DrawerTitle>
          <DrawerDescription className="sr-only">
            Search movies, TV shows, and people
          </DrawerDescription>

          <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
            {/* Search Input Bar (Full Width, No Divider) */}
            <div className="p-4 pb-1">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={mobileInputRef}
                  leadingIcon
                  type="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (!e.target.value) {
                      clearSearch();
                    }
                  }}
                  placeholder="Search movies, TV shows, people..."
                  aria-label="Search query"
                  className="w-full"
                  autoFocus
                />
              </form>
            </div>

            {/* Scrollable Results Area */}
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {debouncedQuery.length >= 2 ? (
                <div className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/70 bg-card">
                  {isError && searchResults && (
                    <QueryFeedback hasData onRetry={() => void refetch()} />
                  )}
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2 p-6 text-xs text-muted-foreground">
                      <Loader2 className="size-4 animate-spin text-primary" />
                      <span>Searching...</span>
                    </div>
                  ) : isError && !searchResults ? (
                    <QueryFeedback
                      hasData={false}
                      onRetry={() => void refetch()}
                    />
                  ) : liveResults.length === 0 ? (
                    <div className="p-6 text-center text-xs text-muted-foreground">
                      No results found for &quot;{debouncedQuery}&quot;. Press
                      enter to search all.
                    </div>
                  ) : (
                    <>
                      {liveResults.map((item) => {
                        const {
                          title,
                          imagePath,
                          subtitle: subText,
                        } = searchResultSummary(item, item.media_type);

                        return (
                          <div
                            key={`${item.media_type}-${item.id}`}
                            onClick={() => handleSelectResult(item)}
                            className="flex cursor-pointer items-center gap-3 p-3 transition-colors hover:bg-muted/70 active:bg-muted"
                          >
                            <div className="relative aspect-2/3 w-10 shrink-0 overflow-hidden rounded-xl bg-muted">
                              <SearchResultImage
                                path={imagePath}
                                title={title}
                                icon={
                                  item.media_type === "person"
                                    ? User
                                    : item.media_type === "tv"
                                      ? Tv
                                      : Film
                                }
                                size="compact"
                                fallback={false}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="line-clamp-1 text-xs font-bold text-foreground">
                                  {title}
                                </span>
                                <span
                                  className={`rounded-xl px-1.5 py-0.5 text-xs font-bold uppercase ${
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

                      {/* View All Recommendation Results */}
                      <div className="p-2">
                        <Button
                          variant="default"
                          size="sm"
                          type="button"
                          onClick={handleSearchSubmit}
                          className="w-full justify-between"
                        >
                          <span>
                            See all results for &quot;{debouncedQuery}&quot;
                          </span>
                          <ArrowRight className="size-3.5" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Empty query state with quick category jumps */
                <div className="py-1">
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      type="button"
                      onClick={() => {
                        setIsMobileOpen(false);
                        router.push("/movie");
                      }}
                      className="justify-start"
                    >
                      <Film className="size-3.5 text-primary" />
                      <span>Movies</span>
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      type="button"
                      onClick={() => {
                        setIsMobileOpen(false);
                        router.push("/tv");
                      }}
                      className="justify-start"
                    >
                      <Tv className="size-3.5 text-primary" />
                      <span>TV</span>
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      type="button"
                      onClick={() => {
                        setIsMobileOpen(false);
                        router.push("/person");
                      }}
                      className="justify-start"
                    >
                      <User className="size-3.5 text-primary" />
                      <span>People</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
