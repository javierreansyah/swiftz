"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Film,
  Star,
  Calendar,
  Layers,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMovieCollectionQuery } from "@/hooks/use-tmdb";
import { MovieCollectionPart } from "@/types";
import { DetailBottomSheet } from "@/components/common/detail-bottom-sheet";
import { cn } from "@/lib/utils";

export interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionId: number;
  collectionName?: string;
  currentMovieId: number;
}

export function CollectionModal({
  isOpen,
  onClose,
  collectionId,
  collectionName,
  currentMovieId,
}: CollectionModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: collection, isLoading, error } = useMovieCollectionQuery(
    isOpen ? collectionId : null
  );

  const parts = useMemo(() => {
    if (!collection?.parts) return [];
    return [...collection.parts].sort((a, b) => {
      const dateA = a.release_date || "9999";
      const dateB = b.release_date || "9999";
      return dateA.localeCompare(dateB);
    });
  }, [collection]);

  const filteredParts = useMemo(() => {
    if (!searchQuery.trim()) return parts;
    const q = searchQuery.toLowerCase();
    return parts.filter(
      (part) =>
        part.title.toLowerCase().includes(q) ||
        (part.overview && part.overview.toLowerCase().includes(q))
    );
  }, [parts, searchQuery]);

  const yearSpan = useMemo(() => {
    const validDates = parts
      .map((p) => p.release_date?.substring(0, 4))
      .filter(Boolean) as string[];
    if (validDates.length === 0) return "";
    const minYear = validDates[0];
    const maxYear = validDates[validDates.length - 1];
    return minYear === maxYear ? minYear : `${minYear} – ${maxYear}`;
  }, [parts]);

  const displayName =
    collection?.name || collectionName || "Franchise Collection";
  const backdropUrl = collection?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${collection.backdrop_path}`
    : null;

  return (
    <DetailBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={displayName}
      subtitle={yearSpan ? `Franchise Collection · ${yearSpan}` : "Franchise Collection"}
      badge={parts.length > 0 ? `${parts.length} Films` : undefined}
      search={{
        value: searchQuery,
        onChange: setSearchQuery,
        placeholder: "Search franchise films...",
      }}
    >
      <div className="space-y-6">
        {/* Franchise Spotlight Banner */}
        {backdropUrl && (
          <div className="relative overflow-hidden rounded-none border border-border/60 bg-muted/40 p-6 sm:p-8">
            <div className="absolute inset-0 -z-10">
              <Image
                src={backdropUrl}
                alt={displayName}
                fill
                className="object-cover opacity-25"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-r from-background via-background/85 to-transparent" />
            </div>

            <div className="relative z-10 max-w-2xl space-y-2.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-primary uppercase">
                <Layers className="size-3.5" />
                <span>The Complete Saga</span>
              </div>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {displayName}
              </h2>
              {collection?.overview && (
                <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {collection.overview}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="flex gap-4 border border-border/50 bg-card/40 p-4"
              >
                <Skeleton className="h-36 w-24 shrink-0 rounded-none" />
                <div className="flex-1 space-y-2 py-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Film className="size-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              Unable to load collection details.
            </p>
          </div>
        )}

        {/* Empty Search Result */}
        {!isLoading && !error && filteredParts.length === 0 && searchQuery && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Film className="size-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              No movies found matching &ldquo;{searchQuery}&rdquo;.
            </p>
          </div>
        )}

        {/* Films Grid */}
        {!isLoading && !error && filteredParts.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredParts.map((part: MovieCollectionPart, index: number) => {
              const isCurrent = part.id === currentMovieId;
              const posterUrl = part.poster_path
                ? `https://image.tmdb.org/t/p/w342${part.poster_path}`
                : null;
              const releaseYear = part.release_date
                ? part.release_date.substring(0, 4)
                : "TBA";

              return (
                <div
                  key={part.id}
                  className={cn(
                    "group relative flex flex-col justify-between overflow-hidden rounded-none border bg-card/60 transition-all hover:shadow-lg",
                    isCurrent
                      ? "border-primary/60 bg-primary/5 ring-1 ring-primary/40"
                      : "border-border/70 hover:border-primary/40"
                  )}
                >
                  <div className="flex gap-3.5 p-3.5 sm:p-4">
                    {/* Poster */}
                    <div className="relative aspect-2/3 w-24 shrink-0 overflow-hidden bg-muted sm:w-28">
                      {posterUrl ? (
                        <Image
                          src={posterUrl}
                          alt={part.title}
                          fill
                          sizes="(max-width: 640px) 96px, 112px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center bg-secondary text-muted-foreground">
                          <Film className="size-6" />
                        </div>
                      )}

                      <span className="absolute top-1 left-1 flex size-5 items-center justify-center rounded-none bg-black/80 text-[10px] font-bold text-white backdrop-blur-xs">
                        {index + 1}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div className="space-y-1">
                        <h3 className="line-clamp-2 text-sm font-bold text-foreground group-hover:text-primary sm:text-base">
                          {part.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="size-3 text-muted-foreground/70" />
                            {releaseYear}
                          </span>
                          {part.vote_average > 0 && (
                            <>
                              <span>·</span>
                              <span className="inline-flex items-center gap-1 font-semibold text-primary">
                                <Star className="size-3 fill-primary text-primary" />
                                {part.vote_average.toFixed(1)}
                              </span>
                            </>
                          )}
                        </div>

                        {part.overview && (
                          <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground/80 sm:line-clamp-4">
                            {part.overview}
                          </p>
                        )}
                      </div>

                      <div className="pt-2">
                        {isCurrent ? (
                          <Badge
                            variant="outline"
                            className="gap-1 rounded-none border-primary/50 bg-primary/10 text-[11px] font-bold text-primary"
                          >
                            <CheckCircle2 className="size-3 text-primary" />
                            <span>Currently Viewing</span>
                          </Badge>
                        ) : (
                          <Link
                            href={`/movie/${part.id}`}
                            onClick={onClose}
                            className="inline-flex items-center gap-1 text-xs font-bold text-primary transition-transform group-hover:translate-x-0.5 hover:underline"
                          >
                            <span>View Movie</span>
                            <ChevronRight className="size-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DetailBottomSheet>
  );
}

export default CollectionModal;
