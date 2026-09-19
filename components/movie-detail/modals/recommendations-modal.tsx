"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { MediaCard } from "@/components/common/media-card";
import { DetailBottomSheet } from "@/components/common/detail-bottom-sheet";
import {
  useMovieRecommendationsQuery,
  useTVRecommendationsQuery,
} from "@/hooks/use-tmdb";

export interface RecommendationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie?: {
    id?: number;
    title?: string;
    name?: string;
    release_date?: string;
    first_air_date?: string;
  };
  mediaId?: number;
  mediaType?: "movie" | "tv";
  title?: string;
  releaseYear?: string;
}

export function RecommendationsModal({
  isOpen,
  onClose,
  movie,
  mediaId: customMediaId,
  mediaType = "movie",
  title: customTitle,
  releaseYear: customReleaseYear,
}: RecommendationsModalProps) {
  const targetId = customMediaId || movie?.id || 0;
  const displayTitle =
    customTitle || movie?.title || movie?.name || "Titles";
  const rawDate = movie?.release_date || movie?.first_air_date;
  const displayYear =
    customReleaseYear || (rawDate ? rawDate.substring(0, 4) : "");

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [allTitles, setAllTitles] = useState<any[]>([]);

  useEffect(() => {
    setPage(1);
    setAllTitles([]);
  }, [targetId]);

  const movieQuery = useMovieRecommendationsQuery(
    mediaType === "movie" ? String(targetId) : "",
    page
  );
  const tvQuery = useTVRecommendationsQuery(
    mediaType === "tv" ? targetId : 0,
    page
  );

  const recData = mediaType === "tv" ? tvQuery.data : movieQuery.data;
  const isFetching =
    mediaType === "tv" ? tvQuery.isFetching : movieQuery.isFetching;

  useEffect(() => {
    if (recData?.results && recData.results.length > 0) {
      setAllTitles((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const newItems = recData.results.filter((m: any) => !existingIds.has(m.id));
        return [...prev, ...newItems];
      });
    }
  }, [recData]);

  const filteredTitles = useMemo(() => {
    if (!searchQuery.trim()) return allTitles;
    const q = searchQuery.toLowerCase();
    return allTitles.filter(
      (m) =>
        (m.title && m.title.toLowerCase().includes(q)) ||
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.overview && m.overview.toLowerCase().includes(q))
    );
  }, [allTitles, searchQuery]);

  return (
    <DetailBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`More Like ${displayTitle}`}
      subtitle={displayYear ? `Recommended Titles · ${displayYear}` : "Recommended Titles"}
      badge={`${allTitles.length} Titles`}
      search={{
        value: searchQuery,
        onChange: setSearchQuery,
        placeholder: "Filter recommendations...",
      }}
    >
      {allTitles.length === 0 && isFetching ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="aspect-2/3 animate-pulse rounded-none bg-muted"
            />
          ))}
        </div>
      ) : filteredTitles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Sparkles className="size-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            No recommendations found matching &ldquo;{searchQuery}&rdquo;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredTitles.map((item: any) => {
            const itemTitle = item.title || item.name || "Untitled";
            const itemYear = item.release_date
              ? item.release_date.substring(0, 4)
              : item.first_air_date
              ? item.first_air_date.substring(0, 4)
              : undefined;
            const href =
              mediaType === "tv" || item.first_air_date
                ? `/tv/${item.id}`
                : `/movie/${item.id}`;

            return (
              <MediaCard
                key={item.id}
                type={mediaType === "tv" || item.first_air_date ? "tv" : "movie"}
                id={item.id}
                title={itemTitle}
                image={item.poster_path}
                rating={item.vote_average}
                year={itemYear}
                href={href}
                onClick={onClose}
                variant="grid"
              />
            );
          })}
        </div>
      )}
    </DetailBottomSheet>
  );
}

export default RecommendationsModal;
