"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { X, Share2, Bookmark, Check, Play } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MovieDetailsData, Video } from "@/types";

export interface VideosModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: MovieDetailsData;
  videos: Video[];
  initialVideoIndex?: number;
  onToggleWatchlist?: () => void;
  isWatchlist?: boolean;
}

export function VideosModal({
  isOpen,
  onClose,
  movie,
  videos,
  initialVideoIndex = 0,
  onToggleWatchlist,
  isWatchlist = false,
}: VideosModalProps) {
  const releaseYear = movie.release_date
    ? movie.release_date.substring(0, 4)
    : "";

  const [copiedShare, setCopiedShare] = useState(false);
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${movie.title} (${releaseYear}) Videos`,
          text: movie.overview,
          url: window.location.href,
        });
        return;
      } catch {
        // fallback
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const [videoFilterType, setVideoFilterType] = useState<string>("all");
  const [videoSort, setVideoSort] = useState<"date_desc" | "date_asc">(
    "date_desc"
  );
  const [selectedVideoModal, setSelectedVideoModal] = useState<Video | null>(
    videos[initialVideoIndex] || null
  );

  const videoTypes = useMemo(() => {
    return Array.from(new Set(videos.map((v) => v.type || "Other")));
  }, [videos]);

  const filteredVideos = useMemo(() => {
    let list = [...videos];
    if (videoFilterType !== "all") {
      list = list.filter((v) => v.type === videoFilterType);
    }
    if (videoSort === "date_desc") {
      list.sort(
        (a, b) =>
          new Date(b.published_at || "").getTime() -
          new Date(a.published_at || "").getTime()
      );
    } else {
      list.sort(
        (a, b) =>
          new Date(a.published_at || "").getTime() -
          new Date(b.published_at || "").getTime()
      );
    }
    return list;
  }, [videos, videoFilterType, videoSort]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="h-[90vh] max-h-[92vh] rounded-t-3xl border-t border-border/80 bg-background/95 p-0 shadow-2xl backdrop-blur-2xl sm:max-w-none"
      >
        <div className="flex size-full flex-col">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 px-6 py-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-muted"
              >
                <X className="size-5" />
                <span className="sr-only">Close</span>
              </Button>
              <div>
                <SheetTitle className="text-lg font-bold text-foreground sm:text-xl">
                  {movie.title}{" "}
                  {releaseYear && (
                    <span className="font-normal text-muted-foreground">
                      ({releaseYear})
                    </span>
                  )}
                </SheetTitle>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:text-sm">
                  Videos
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="gap-1.5 rounded-full"
              >
                {copiedShare ? (
                  <Check className="size-4 text-emerald-500" />
                ) : (
                  <Share2 className="size-4" />
                )}
                <span>Share</span>
              </Button>

              {onToggleWatchlist && (
                <Button
                  size="sm"
                  onClick={onToggleWatchlist}
                  className={`gap-1.5 rounded-full font-bold transition-colors ${
                    isWatchlist
                      ? "bg-amber-600 text-white hover:bg-amber-700"
                      : "bg-amber-400 text-neutral-950 hover:bg-amber-300 dark:bg-amber-400 dark:text-neutral-950"
                  }`}
                >
                  <Bookmark className="size-4 fill-current" />
                  <span>
                    {isWatchlist ? "In Watchlist" : "Add to Watchlist"}
                  </span>
                </Button>
              )}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/30 px-6 py-3 text-xs sm:text-sm">
            <div className="flex flex-wrap items-center gap-3">
              {/* Sort selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Sort by:</span>
                <select
                  value={videoSort}
                  onChange={(e) => setVideoSort(e.target.value as any)}
                  className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground focus:outline-none"
                >
                  <option value="date_desc">Date (Newest)</option>
                  <option value="date_asc">Date (Oldest)</option>
                </select>
              </div>

              {/* Video type filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Video type:</span>
                <select
                  value={videoFilterType}
                  onChange={(e) => setVideoFilterType(e.target.value)}
                  className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground focus:outline-none"
                >
                  <option value="all">All Types</option>
                  {videoTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              1-{filteredVideos.length} of {videos.length}
            </div>
          </div>

          {/* Active video player if user selected one */}
          {selectedVideoModal && (
            <div className="border-b border-border/70 bg-black p-4">
              <div className="mx-auto aspect-video max-w-3xl overflow-hidden rounded-xl">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideoModal.key}?autoplay=1&rel=0`}
                  title={selectedVideoModal.name}
                  className="size-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="mt-2 text-center text-sm font-semibold text-white">
                {selectedVideoModal.name}
              </p>
            </div>
          )}

          {/* 3-Column Video Grid */}
          <ScrollArea className="flex-1 p-6">
            {filteredVideos.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">
                No videos found matching the filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVideos.map((video) => {
                  const ytThumb = `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`;
                  const isSelected = selectedVideoModal?.id === video.id;

                  return (
                    <div
                      key={video.id}
                      onClick={() => setSelectedVideoModal(video)}
                      className={`group cursor-pointer space-y-2.5 rounded-2xl border p-2 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-2 ring-primary/40"
                          : "border-border/70 bg-card/60 hover:border-primary/40 hover:bg-card"
                      }`}
                    >
                      {/* Thumbnail with duration/type badge */}
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
                        <Image
                          src={ytThumb}
                          alt={video.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 400px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/10" />

                        {/* Center play icon on hover */}
                        <div className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                          <Play className="ml-0.5 size-5 fill-current" />
                        </div>

                        {/* Floating Pill */}
                        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                          <Play className="size-3 fill-white text-white" />
                          <span>{video.type || "Video"}</span>
                        </div>
                      </div>

                      {/* Title & subtitle */}
                      <div className="px-1">
                        <h4 className="line-clamp-2 text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                          {video.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {movie.title} ({releaseYear})
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default VideosModal;
