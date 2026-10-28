"use client";
import { useState, useMemo } from "react";
import Image from "@/components/ui/image";
import { Film } from "lucide-react";
import { MediaCard } from "@/features/media/components/media-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMovieCollectionQuery } from "@/features/movies/hooks/queries";
import { DetailBottomSheet } from "@/features/media/components/detail-bottom-sheet";
import { QueryFeedback } from "@/features/media/components/query-feedback";
export interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionId: number;
  collectionName?: string;
  currentMovieId?: number;
}

export function CollectionModal({
  isOpen,
  onClose,
  collectionId,
  collectionName,
  currentMovieId,
}: CollectionModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: collection,
    isLoading,
    error,
    refetch,
  } = useMovieCollectionQuery(collectionId, isOpen);

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
        (part.overview && part.overview.toLowerCase().includes(q)),
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

  const displayName = collection?.name || collectionName || "Collection";
  const backdropUrl = collection?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${collection.backdrop_path}`
    : null;

  return (
    <DetailBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={displayName}
      subtitle={yearSpan || undefined}
      search={{
        value: searchQuery,
        onChange: setSearchQuery,
        placeholder: "Search movies...",
      }}
    >
      <div className="space-y-6">
        {/* Collection overview */}
        {collection && (
          <div className="relative overflow-hidden rounded-xl bg-muted/40 p-6 shadow-md sm:p-8">
            {backdropUrl && (
              <div className="absolute inset-0 -z-10">
                <Image
                  src={backdropUrl}
                  alt={displayName}
                  fill
                  variant="watermark"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-r from-background via-background/85 to-transparent" />
              </div>
            )}
            <div className="relative z-10 max-w-2xl space-y-2.5">
              <h2 className="heading-section text-foreground">{displayName}</h2>
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-2/3 w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <QueryFeedback
            hasData={!!collection}
            onRetry={() => void refetch()}
          />
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
        {!isLoading && filteredParts.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filteredParts.map((part) => (
              <MediaCard
                key={part.id}
                type="movie"
                id={part.id}
                title={part.title}
                image={part.poster_path}
                rating={part.vote_average}
                year={part.release_date?.substring(0, 4)}
                badge={`${parts.indexOf(part) + 1}${part.id === currentMovieId ? " · Currently viewing" : ""}`}
                href={`/movie/${part.id}`}
                onClick={onClose}
                variant="grid"
              />
            ))}
          </div>
        )}
      </div>
    </DetailBottomSheet>
  );
}
