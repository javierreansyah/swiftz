"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  X,
  Share2,
  Bookmark,
  Check,
  Play,
  LayoutGrid,
  Film,
  ArrowUpDown,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MovieDetailsData, Video } from "@/types";
import { cn } from "@/lib/utils";

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
  initialVideoIndex,
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

  const [viewMode, setViewMode] = useState<"gallery" | "showcase">(
    initialVideoIndex !== undefined ? "showcase" : "gallery"
  );
  const [videoFilterType, setVideoFilterType] = useState<string>("all");
  const [videoSort, setVideoSort] = useState<"date_desc" | "date_asc">(
    "date_desc"
  );
  const [selectedVideoModal, setSelectedVideoModal] = useState<Video | null>(
    initialVideoIndex !== undefined && videos[initialVideoIndex]
      ? videos[initialVideoIndex]
      : videos[0] || null
  );

  const videoTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    videos.forEach((v) => {
      const t = v.type || "Other";
      counts[t] = (counts[t] || 0) + 1;
    });
    return counts;
  }, [videos]);

  const videoTypes = useMemo(() => {
    return Object.keys(videoTypeCounts);
  }, [videoTypeCounts]);

  const filteredVideos = useMemo(() => {
    let list = [...videos];
    if (videoFilterType !== "all") {
      list = list.filter((v) => (v.type || "Other") === videoFilterType);
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

  const handleSelectVideo = (video: Video) => {
    setSelectedVideoModal(video);
    setViewMode("showcase");
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="inset-x-0 bottom-0 mx-auto h-[90vh] max-h-[92vh] w-full max-w-(--max-container) overflow-hidden rounded-none border-x border-t border-b-0 border-border/80 bg-background/95 p-0 shadow-2xl backdrop-blur-2xl"
      >
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
          {/* Header */}
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-border/70 px-6 py-4 sm:px-8 sm:py-5">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="shrink-0 rounded-none hover:bg-muted"
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
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase sm:text-sm">
                    Videos ({videos.length})
                  </p>
                  {viewMode === "showcase" && (
                    <span className="rounded-none bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      Showcase Mode
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {viewMode === "showcase" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode("gallery")}
                  className="gap-1.5 rounded-none text-xs"
                >
                  <LayoutGrid className="size-3.5" />
                  <span>Back to Gallery</span>
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="gap-1.5 rounded-none text-xs"
              >
                {copiedShare ? (
                  <Check className="size-3.5 text-emerald-500" />
                ) : (
                  <Share2 className="size-3.5" />
                )}
                <span>Share</span>
              </Button>

              {onToggleWatchlist && (
                <Button
                  size="sm"
                  onClick={onToggleWatchlist}
                  className={cn(
                    "gap-1.5 rounded-none text-xs font-bold transition-colors",
                    isWatchlist
                      ? "bg-primary/80 text-primary-foreground hover:bg-primary/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  <Bookmark className="size-3.5 fill-current" />
                  <span>
                    {isWatchlist ? "In Watchlist" : "Add to Watchlist"}
                  </span>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Top Controls */}
          <div className="flex flex-col gap-2 border-b border-border/60 bg-muted/20 p-3 md:hidden">
            <div className="grid grid-cols-2 gap-2">
              {/* Type Select */}
              <Select
                value={videoFilterType}
                onValueChange={(val) => setVideoFilterType(val)}
              >
                <SelectTrigger className="h-8 w-full bg-card text-xs">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types ({videos.length})</SelectItem>
                  {videoTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type} ({videoTypeCounts[type] || 0})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort Select */}
              <Select
                value={videoSort}
                onValueChange={(val) =>
                  setVideoSort(val as "date_desc" | "date_asc")
                }
              >
                <SelectTrigger className="h-8 w-full bg-card text-xs">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date_desc">Newest First</SelectItem>
                  <SelectItem value="date_asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Body: Desktop Left Sidebar + Main Content Area */}
          <div className="flex min-h-0 flex-1 overflow-hidden">
            {/* Desktop Left Sidebar */}
            <aside className="hidden w-60 shrink-0 flex-col gap-5 overflow-y-auto border-r border-border/70 bg-muted/15 p-4 md:flex">
              {/* Type Filter */}
              <div>
                <h4 className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Video Type
                </h4>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => setVideoFilterType("all")}
                    className={cn(
                      "flex items-center justify-between rounded-none px-3 py-2 text-left text-xs font-medium transition-colors",
                      videoFilterType === "all"
                        ? "bg-primary font-semibold text-primary-foreground"
                        : "text-foreground/80 hover:bg-muted"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Film className="size-4" />
                      All Videos
                    </span>
                    <span className="text-[10px] opacity-80">{videos.length}</span>
                  </button>

                  {videoTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setVideoFilterType(type)}
                      className={cn(
                        "flex items-center justify-between rounded-none px-3 py-1.5 text-left text-xs transition-colors",
                        videoFilterType === type
                          ? "bg-primary font-semibold text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <span className="truncate">{type}</span>
                      <span className="ml-2 text-[10px] opacity-80">
                        {videoTypeCounts[type] || 0}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Filter */}
              <div>
                <h4 className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Sort Order
                </h4>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => setVideoSort("date_desc")}
                    className={cn(
                      "flex items-center justify-between rounded-none px-3 py-2 text-left text-xs font-medium transition-colors",
                      videoSort === "date_desc"
                        ? "bg-accent font-semibold text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <ArrowUpDown className="size-3.5" />
                      Newest First
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoSort("date_asc")}
                    className={cn(
                      "flex items-center justify-between rounded-none px-3 py-2 text-left text-xs font-medium transition-colors",
                      videoSort === "date_asc"
                        ? "bg-accent font-semibold text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <ArrowUpDown className="size-3.5" />
                      Oldest First
                    </span>
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Area: Gallery View OR Showcase View */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              {viewMode === "showcase" && selectedVideoModal ? (
                /* Showcase View: Player + Bottom Carousel */
                <div className="flex h-full min-h-0 flex-1 flex-col overflow-y-auto">
                  {/* Embedded Player */}
                  <div className="shrink-0 bg-black/90 p-4 sm:p-6">
                    <div className="mx-auto aspect-video max-w-4xl overflow-hidden rounded-none border border-white/10 shadow-2xl">
                      <iframe
                        src={`https://www.youtube.com/embed/${selectedVideoModal.key}?autoplay=1&rel=0`}
                        title={selectedVideoModal.name}
                        className="size-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="mx-auto mt-4 flex max-w-4xl items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white sm:text-lg">
                          {selectedVideoModal.name}
                        </h3>
                        <p className="text-xs text-neutral-400">
                          {selectedVideoModal.type || "Video"} &bull;{" "}
                          {selectedVideoModal.published_at
                            ? new Date(
                                selectedVideoModal.published_at
                              ).toLocaleDateString()
                            : ""}
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setViewMode("gallery")}
                        className="gap-1.5 rounded-none text-xs"
                      >
                        <LayoutGrid className="size-3.5" />
                        <span>All Videos</span>
                      </Button>
                    </div>
                  </div>

                  {/* Showcase Bottom Carousel / Filmstrip */}
                  <div className="space-y-3 border-t border-border/70 p-4 sm:p-6">
                    <h4 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                      More Videos ({filteredVideos.length})
                    </h4>
                    <div className="flex scrollbar-none gap-3 overflow-x-auto pb-2">
                      {filteredVideos.map((video) => {
                        const isCurrent = video.id === selectedVideoModal.id;
                        const ytThumb = `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`;
                        return (
                          <div
                            key={video.id}
                            onClick={() => setSelectedVideoModal(video)}
                            className={cn(
                              "w-48 shrink-0 cursor-pointer overflow-hidden rounded-none border p-1.5 transition-all sm:w-56",
                              isCurrent
                                ? "border-primary bg-primary/10 ring-2 ring-primary/40"
                                : "border-border/60 bg-card/60 hover:border-primary/40"
                            )}
                          >
                            <div className="relative aspect-video w-full overflow-hidden rounded-none bg-black">
                              <Image
                                src={ytThumb}
                                alt={video.name}
                                fill
                                sizes="224px"
                                className="object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                                <Play className="size-5 fill-white text-white opacity-80" />
                              </div>
                            </div>
                            <p className="mt-1.5 line-clamp-1 text-xs font-semibold text-foreground">
                              {video.name}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* Gallery View: Full Grid */
                <ScrollArea className="min-h-0 flex-1 p-6 sm:p-8">
                  {filteredVideos.length === 0 ? (
                    <div className="py-20 text-center text-muted-foreground">
                      No videos found matching the filter.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredVideos.map((video) => {
                        const ytThumb = `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`;

                        return (
                          <div
                            key={video.id}
                            onClick={() => handleSelectVideo(video)}
                            className="group cursor-pointer overflow-hidden rounded-none border border-border/70 bg-card/60 transition-all hover:border-primary/40 hover:bg-card hover:shadow-lg"
                          >
                            {/* Video Thumbnail */}
                            <div className="relative aspect-video w-full overflow-hidden bg-black">
                              <Image
                                src={ytThumb}
                                alt={video.name}
                                fill
                                sizes="(max-width: 640px) 100vw, 400px"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/10" />

                              {/* Center play button on hover */}
                              <div className="absolute top-1/2 left-1/2 flex size-12 -translate-1/2 items-center justify-center rounded-none bg-primary text-primary-foreground shadow-xl backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                                <Play className="ml-0.5 size-6 fill-current" />
                              </div>

                              {/* Floating Pill */}
                              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-none border border-white/20 bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                                <Play className="size-3 fill-white text-white" />
                                <span>{video.type || "Video"}</span>
                              </div>
                            </div>

                            {/* Title & subtitle */}
                            <div className="p-3">
                              <h4 className="line-clamp-2 text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                                {video.name}
                              </h4>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {video.published_at
                                  ? new Date(
                                      video.published_at
                                    ).toLocaleDateString()
                                  : `${movie.title} (${releaseYear})`}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default VideosModal;
