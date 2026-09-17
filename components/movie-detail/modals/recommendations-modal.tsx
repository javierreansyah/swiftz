"use client";

import React, { useState, useMemo, useEffect } from "react";
import { X, Search, Sparkles, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MovieCard } from "@/components/common/movie-card";
import { MovieDetailsData, Movie } from "@/types";
import { useMovieRecommendationsQuery } from "@/hooks/use-tmdb";

export interface RecommendationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: MovieDetailsData;
}

export function RecommendationsModal({
  isOpen,
  onClose,
  movie,
}: RecommendationsModalProps) {
  const releaseYear = movie.release_date
    ? movie.release_date.substring(0, 4)
    : "";

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);

  // Reset when movie changes
  useEffect(() => {
    setPage(1);
    setAllMovies([]);
  }, [movie.id]);

  const { data: recData, isFetching } = useMovieRecommendationsQuery(
    movie.id.toString(),
    page
  );

  // Accumulate movies across pages
  useEffect(() => {
    if (recData?.results && recData.results.length > 0) {
      setAllMovies((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const newItems = recData.results.filter((m) => !existingIds.has(m.id));
        return [...prev, ...newItems];
      });
    }
  }, [recData]);

  const totalPages = recData?.total_pages || 1;
  const hasMore = page < totalPages;

  const filteredMovies = useMemo(() => {
    if (!searchQuery.trim()) return allMovies;
    const q = searchQuery.toLowerCase();
    return allMovies.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (m.overview && m.overview.toLowerCase().includes(q))
    );
  }, [allMovies, searchQuery]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="inset-x-0 bottom-0 mx-auto h-[90vh] max-h-[92vh] w-full max-w-(--max-container) overflow-hidden rounded-t-3xl border-x border-t border-b-0 border-border/80 bg-background/95 p-0 shadow-2xl backdrop-blur-2xl"
      >
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
          {/* Header bar */}
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-border/70 px-6 py-4 sm:px-10 sm:py-5">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="shrink-0 rounded-full hover:bg-muted"
              >
                <X className="size-5" />
                <span className="sr-only">Close</span>
              </Button>
              <div>
                <SheetTitle className="text-lg font-bold text-foreground sm:text-xl">
                  More Like {movie.title}{" "}
                  {releaseYear && (
                    <span className="font-normal text-muted-foreground">
                      ({releaseYear})
                    </span>
                  )}
                </SheetTitle>
                <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase sm:text-sm">
                  Recommended Titles
                </p>
              </div>
              <Badge variant="secondary" className="rounded-full px-3 py-0.5">
                {allMovies.length}
                {recData?.total_result ? ` of ${recData.total_result}` : ""}{" "}
                Titles
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-48 sm:w-64">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Filter recommendations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-9 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Recommendations Content Grid */}
          <ScrollArea className="min-h-0 flex-1 p-6 sm:p-10">
            {allMovies.length === 0 && isFetching ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={i}
                    className="aspect-2/3 animate-pulse rounded-xl bg-muted"
                  />
                ))}
              </div>
            ) : filteredMovies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Sparkles className="size-10 text-muted-foreground/50" />
                <p className="mt-3 text-sm font-medium text-muted-foreground">
                  No recommendations found matching &ldquo;{searchQuery}&rdquo;.
                </p>
              </div>
            ) : (
              <div className="space-y-8 pb-12">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {filteredMovies.map((rec) => (
                    <MovieCard
                      key={rec.id}
                      id={rec.id}
                      title={rec.title}
                      poster={rec.poster_path}
                      rating={rec.vote_average}
                    />
                  ))}
                </div>

                {/* View More Button */}
                {hasMore && !searchQuery.trim() && (
                  <div className="flex justify-center pt-2">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={isFetching}
                      className="gap-2 rounded-full px-8 text-sm font-semibold hover:border-primary/50"
                    >
                      {isFetching ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          <span>Loading more...</span>
                        </>
                      ) : (
                        <span>
                          View More ({allMovies.length} of{" "}
                          {recData?.total_result || allMovies.length})
                        </span>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default RecommendationsModal;
