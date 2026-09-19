"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  Play,
  Share2,
  Bookmark,
  Check,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Video } from "@/types";
import { DetailBottomSheet } from "@/components/common/detail-bottom-sheet";
import { cn } from "@/lib/utils";

export interface VideosModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie?: {
    id?: number;
    title?: string;
    name?: string;
    release_date?: string;
    first_air_date?: string;
    overview?: string;
  };
  title?: string;
  releaseYear?: string;
  videos: Video[];
  initialVideoIndex?: number;
  onToggleWatchlist?: () => void;
  isWatchlist?: boolean;
}

export function VideosModal({
  isOpen,
  onClose,
  movie,
  title: customTitle,
  releaseYear: customReleaseYear,
  videos,
  initialVideoIndex,
  onToggleWatchlist,
  isWatchlist = false,
}: VideosModalProps) {
  const displayTitle =
    customTitle || movie?.title || movie?.name || "Videos";
  const rawDate = movie?.release_date || movie?.first_air_date;
  const displayYear =
    customReleaseYear || (rawDate ? rawDate.substring(0, 4) : "");

  const [copiedShare, setCopiedShare] = useState(false);
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${displayTitle} (${displayYear}) Videos`,
          text: movie?.overview || "",
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

  // When clicking "See all", initialVideoIndex is undefined -> opens in gallery view
  // When clicking a specific card, initialVideoIndex is provided -> opens in showcase player view
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

  // Sync when initialVideoIndex or videos change
  useEffect(() => {
    if (initialVideoIndex !== undefined && videos[initialVideoIndex]) {
      setSelectedVideoModal(videos[initialVideoIndex]);
      setViewMode("showcase");
    } else {
      setViewMode("gallery");
      setSelectedVideoModal(videos[0] || null);
    }
  }, [initialVideoIndex, videos]);

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

  const headerActions = (
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
          <span>{isWatchlist ? "In Watchlist" : "Add to Watchlist"}</span>
        </Button>
      )}
    </div>
  );

  const desktopSidebar = (
    <div className="flex flex-col gap-4">
      <div>
        <h4 className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Video Types
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
            <span>All Types</span>
            <span className="text-[11px] opacity-80">{videos.length}</span>
          </button>
          {videoTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setVideoFilterType(type)}
              className={cn(
                "flex items-center justify-between rounded-none px-3 py-2 text-left text-xs font-medium transition-colors",
                videoFilterType === type
                  ? "bg-primary font-semibold text-primary-foreground"
                  : "text-foreground/80 hover:bg-muted"
              )}
            >
              <span>{type}</span>
              <span className="text-[11px] opacity-80">
                {videoTypeCounts[type]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Sort Order
        </h4>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setVideoSort("date_desc")}
            className={cn(
              "rounded-none px-3 py-2 text-left text-xs font-medium transition-colors",
              videoSort === "date_desc"
                ? "bg-primary font-semibold text-primary-foreground"
                : "text-foreground/80 hover:bg-muted"
            )}
          >
            Newest First
          </button>
          <button
            type="button"
            onClick={() => setVideoSort("date_asc")}
            className={cn(
              "rounded-none px-3 py-2 text-left text-xs font-medium transition-colors",
              videoSort === "date_asc"
                ? "bg-primary font-semibold text-primary-foreground"
                : "text-foreground/80 hover:bg-muted"
            )}
          >
            Oldest First
          </button>
        </div>
      </div>
    </div>
  );

  const mobileControls = (
    <div className="grid grid-cols-2 gap-2">
      <Select
        value={videoFilterType}
        onValueChange={(val) => setVideoFilterType(val)}
      >
        <SelectTrigger className="h-8 rounded-none bg-card text-xs">
          <SelectValue placeholder="Video Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types ({videos.length})</SelectItem>
          {videoTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type} ({videoTypeCounts[type]})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={videoSort}
        onValueChange={(val: "date_desc" | "date_asc") => setVideoSort(val)}
      >
        <SelectTrigger className="h-8 rounded-none bg-card text-xs">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date_desc">Newest First</SelectItem>
          <SelectItem value="date_asc">Oldest First</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <DetailBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={displayTitle}
      subtitle={displayYear ? `Videos · ${displayYear}` : "Videos"}
      badge={`${videos.length} Videos`}
      headerActions={headerActions}
      sidebar={desktopSidebar}
      mobileControls={mobileControls}
      disableDefaultScroll={viewMode === "showcase"}
    >
      {viewMode === "showcase" && selectedVideoModal ? (
        /* Showcase Player View: Stage + Identical Height Bottom Filmstrip */
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
          {/* Main Video Player Stage */}
          <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden bg-black p-2 sm:p-4">
            <div className="relative aspect-video max-h-[calc(100%-2.5rem)] w-full max-w-6xl overflow-hidden rounded-none shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideoModal.key}?autoplay=1&rel=0`}
                title={selectedVideoModal.name}
                className="size-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="mt-2 w-full max-w-6xl text-center">
              <h3 className="line-clamp-1 text-sm font-bold text-white">
                {selectedVideoModal.name}
              </h3>
            </div>
          </div>

          {/* Standardized Bottom Filmstrip (Identical h-20 container to Photos) */}
          <div className="shrink-0 border-t border-border/70 bg-card/90 px-6 py-3.5">
            <div className="flex scrollbar-none gap-2.5 overflow-x-auto pb-0.5">
              {filteredVideos.map((video) => {
                const isActive = video.id === selectedVideoModal.id;
                const ytThumb = `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`;
                return (
                  <button
                    key={video.id}
                    type="button"
                    onClick={() => setSelectedVideoModal(video)}
                    className={cn(
                      "relative h-20 w-36 flex-none cursor-pointer overflow-hidden rounded-none border-2 transition-all",
                      isActive
                        ? "scale-105 border-primary ring-2 ring-primary/40"
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={ytThumb}
                      alt={video.name}
                      fill
                      sizes="144px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Play className="size-4 fill-white text-white opacity-90" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Gallery Grid View */
        <div className="h-full">
          {filteredVideos.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              No videos found matching the filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredVideos.map((video) => {
                const ytThumb = `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`;

                return (
                  <div
                    key={video.id}
                    onClick={() => handleSelectVideo(video)}
                    className="group cursor-pointer overflow-hidden rounded-none border border-border/70 bg-card/60 transition-all hover:border-primary/40 hover:bg-card hover:shadow-lg"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-black">
                      <Image
                        src={ytThumb}
                        alt={video.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 400px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/10" />

                      <div className="absolute top-1/2 left-1/2 flex size-12 -translate-1/2 items-center justify-center rounded-none bg-primary text-primary-foreground shadow-xl backdrop-blur-xs transition-transform duration-300 group-hover:scale-110">
                        <Play className="ml-0.5 size-6 fill-current" />
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-none border border-white/20 bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                        <Play className="size-3 fill-white text-white" />
                        <span>{video.type || "Video"}</span>
                      </div>
                    </div>

                    <div className="p-3">
                      <h4 className="line-clamp-2 text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                        {video.name}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {video.published_at
                          ? new Date(video.published_at).toLocaleDateString()
                          : `${displayTitle} (${displayYear})`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </DetailBottomSheet>
  );
}

export default VideosModal;
