"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Star,
  Clock,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  User,
  Tv,
} from "lucide-react";
import { DetailBottomSheet } from "@/components/common/detail-bottom-sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TVShowDetailsData, TVSeason } from "@/types";
import { useTVSeasonQuery } from "@/hooks/use-tmdb";
import { cn } from "@/lib/utils";

export interface TVSeasonsModalProps {
  isOpen: boolean;
  onClose: () => void;
  show: TVShowDetailsData;
  initialSeasonNumber?: number;
}

export function TVSeasonsModal({
  isOpen,
  onClose,
  show,
  initialSeasonNumber,
}: TVSeasonsModalProps) {
  const seasons: TVSeason[] = show.seasons || [];

  // Default to initialSeasonNumber, or Season 1 (or first available season)
  const defaultSeason =
    initialSeasonNumber !== undefined
      ? initialSeasonNumber
      : seasons.find((s) => s.season_number > 0)?.season_number ??
        seasons[0]?.season_number ??
        1;

  const [activeSeasonNumber, setActiveSeasonNumber] = useState<number>(defaultSeason);
  const [expandedEpisodes, setExpandedEpisodes] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (initialSeasonNumber !== undefined) {
      setActiveSeasonNumber(initialSeasonNumber);
    }
  }, [initialSeasonNumber]);

  const { data: seasonDetails, isLoading } = useTVSeasonQuery(
    isOpen ? show.id : undefined,
    isOpen ? activeSeasonNumber : undefined
  );

  const toggleEpisodeExpand = (episodeId: number) => {
    setExpandedEpisodes((prev) => ({
      ...prev,
      [episodeId]: !prev[episodeId],
    }));
  };

  const currentSeasonSummary = seasons.find(
    (s) => s.season_number === activeSeasonNumber
  );

  const episodes = seasonDetails?.episodes || [];

  const mobileSeasonSelector = (
    <div className="p-3">
      <Select
        value={String(activeSeasonNumber)}
        onValueChange={(val) => setActiveSeasonNumber(Number(val))}
      >
        <SelectTrigger className="h-9 w-full rounded-none text-xs font-semibold">
          <SelectValue placeholder="Select Season" />
        </SelectTrigger>
        <SelectContent>
          {seasons.map((s) => (
            <SelectItem key={s.id} value={String(s.season_number)}>
              {s.name} ({s.episode_count} Episodes)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const desktopSidebar = (
    <aside className="p-4">
      <h4 className="mb-3 text-xs font-bold tracking-wider text-muted-foreground uppercase">
        Seasons
      </h4>
      <div className="space-y-1">
        {seasons.map((s) => {
          const isActive = s.season_number === activeSeasonNumber;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSeasonNumber(s.season_number)}
              className={cn(
                "flex w-full items-center justify-between rounded-none px-3 py-2 text-left text-xs font-medium transition-colors",
                isActive
                  ? "bg-primary font-bold text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span className="truncate">{s.name}</span>
              <span
                className={cn(
                  "text-[11px]",
                  isActive
                    ? "font-bold text-primary-foreground/90"
                    : "text-muted-foreground/70"
                )}
              >
                {s.episode_count} eps
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );

  return (
    <DetailBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={show.name}
      subtitle="Seasons & Episode Guide"
      badge={`${seasons.length} ${seasons.length === 1 ? "Season" : "Seasons"}`}
      sidebar={desktopSidebar}
      sidebarWidth="w-64"
      mobileControls={mobileSeasonSelector}
      contentClassName="p-4 sm:p-6 lg:p-8"
    >
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Season Banner Card */}
        {currentSeasonSummary && (
          <div className="flex flex-col gap-4 rounded-none border border-border/70 bg-card/60 p-4 sm:flex-row sm:items-start sm:p-5">
            {/* Season Poster */}
            <div className="relative aspect-2/3 w-28 shrink-0 overflow-hidden bg-muted sm:w-32">
              {currentSeasonSummary.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w342${currentSeasonSummary.poster_path}`}
                  alt={currentSeasonSummary.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-muted-foreground">
                  <Layers className="size-8" />
                </div>
              )}
            </div>

            {/* Season Details */}
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-baseline gap-2">
                <h2 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
                  {currentSeasonSummary.name}
                </h2>
                {currentSeasonSummary.air_date && (
                  <span className="text-xs text-muted-foreground sm:text-sm">
                    · {currentSeasonSummary.air_date.substring(0, 4)}
                  </span>
                )}
                <span className="text-xs text-muted-foreground sm:text-sm">
                  · {currentSeasonSummary.episode_count} Episodes
                </span>
              </div>

              {currentSeasonSummary.overview && (
                <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {currentSeasonSummary.overview}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Episodes List */}
        <div className="space-y-4">
          <h3 className="font-heading text-lg font-bold text-foreground sm:text-xl">
            Episodes ({isLoading ? "Loading..." : episodes.length})
          </h3>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-4 rounded-none border border-border/60 bg-card/40 p-4 sm:flex-row"
                >
                  <Skeleton className="aspect-video w-full rounded-none sm:w-48" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48 rounded-none" />
                    <Skeleton className="h-4 w-32 rounded-none" />
                    <Skeleton className="h-12 w-full rounded-none" />
                  </div>
                </div>
              ))}
            </div>
          ) : episodes.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-none border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground">
              No episode data available for this season.
            </div>
          ) : (
            <div className="space-y-4">
              {episodes.map((ep) => {
                const isExpanded = Boolean(expandedEpisodes[ep.id]);
                const stillUrl = ep.still_path
                  ? `https://image.tmdb.org/t/p/w500${ep.still_path}`
                  : null;

                const guestStars = ep.guest_stars || [];
                const directors =
                  ep.crew?.filter((c) => c.job === "Director") || [];
                const writers =
                  ep.crew?.filter((c) =>
                    ["Writer", "Screenplay", "Story"].includes(c.job)
                  ) || [];

                return (
                  <div
                    key={ep.id}
                    className="overflow-hidden rounded-none border border-border/70 bg-card/60 transition-colors hover:border-primary/40"
                  >
                    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-5">
                      {/* 16:9 Episode Still Image */}
                      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-muted sm:w-56">
                        {stillUrl ? (
                          <Image
                            src={stillUrl}
                            alt={ep.name}
                            fill
                            sizes="(max-width: 640px) 100vw, 224px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-muted-foreground">
                            <Tv className="size-8" />
                          </div>
                        )}
                        <div className="absolute top-2 left-2 flex items-center gap-1 rounded-none bg-black/80 px-2 py-0.5 text-[11px] font-bold text-white">
                          <span>
                            EP {String(ep.episode_number).padStart(2, "0")}
                          </span>
                        </div>
                      </div>

                      {/* Episode Metadata & Synopsis */}
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h4 className="text-base font-bold text-foreground sm:text-lg">
                            {ep.episode_number}. {ep.name}
                          </h4>

                          {ep.vote_average > 0 && (
                            <div className="flex items-center gap-1 rounded-none bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                              <Star className="size-3 fill-primary text-primary" />
                              <span>{ep.vote_average.toFixed(1)}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          {ep.air_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="size-3" />
                              <span>{ep.air_date}</span>
                            </span>
                          )}
                          {ep.runtime && ep.runtime > 0 && (
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" />
                              <span>{ep.runtime} min</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                          {ep.overview || "No overview available for this episode."}
                        </p>

                        {/* Toggle Extra Details (Guest Stars / Crew) */}
                        {(guestStars.length > 0 ||
                          directors.length > 0 ||
                          writers.length > 0) && (
                          <button
                            type="button"
                            onClick={() => toggleEpisodeExpand(ep.id)}
                            className="inline-flex items-center gap-1 pt-1 text-xs font-semibold text-primary hover:underline"
                          >
                            <span>
                              {isExpanded
                                ? "Hide guest stars & crew"
                                : "View guest stars & crew"}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="size-3" />
                            ) : (
                              <ChevronDown className="size-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expanded Guest Stars & Crew */}
                    {isExpanded && (
                      <div className="space-y-3 border-t border-border/60 bg-muted/20 p-4 text-xs sm:px-5">
                        {directors.length > 0 && (
                          <div>
                            <span className="font-bold text-foreground">
                              Directed by:{" "}
                            </span>
                            <span className="text-muted-foreground">
                              {directors.map((d) => d.name).join(", ")}
                            </span>
                          </div>
                        )}

                        {writers.length > 0 && (
                          <div>
                            <span className="font-bold text-foreground">
                              Written by:{" "}
                            </span>
                            <span className="text-muted-foreground">
                              {writers.map((w) => w.name).join(", ")}
                            </span>
                          </div>
                        )}

                        {guestStars.length > 0 && (
                          <div className="space-y-2 pt-1">
                            <p className="font-bold text-foreground">
                              Guest Stars:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {guestStars.map((guest) => (
                                <div
                                  key={guest.id}
                                  className="flex items-center gap-1.5 rounded-none border border-border/70 bg-card/60 px-2.5 py-1 text-xs"
                                >
                                  {guest.profile_path ? (
                                    <div className="relative size-5 overflow-hidden rounded-full bg-muted">
                                      <Image
                                        src={`https://image.tmdb.org/t/p/w185${guest.profile_path}`}
                                        alt={guest.name}
                                        fill
                                        sizes="20px"
                                        className="object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <User className="size-3.5 text-muted-foreground" />
                                  )}
                                  <span className="font-medium text-foreground">
                                    {guest.name}
                                  </span>
                                  {guest.character && (
                                    <span className="text-muted-foreground">
                                      as {guest.character}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DetailBottomSheet>
  );
}

export default TVSeasonsModal;
