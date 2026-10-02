"use client";
import { useState, useMemo, useEffect } from "react";
import Image from "@/components/ui/image";
import { Play, Share2, Bookmark, Check, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/features/media/components/filter-sidebar-primitives";
import type { Video } from "@/lib/tmdb/types/common";
import { DetailBottomSheet } from "@/features/media/components/detail-bottom-sheet";
import { MediaCard } from "@/features/media/components/media-card";
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
  const displayTitle = customTitle || movie?.title || movie?.name || "Videos";
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
    initialVideoIndex !== undefined ? "showcase" : "gallery",
  );
  const [videoFilterType, setVideoFilterType] = useState<string>("all");
  const [videoSort, setVideoSort] = useState<"date_desc" | "date_asc">(
    "date_desc",
  );
  const [selectedVideoModal, setSelectedVideoModal] = useState<Video | null>(
    initialVideoIndex !== undefined && videos[initialVideoIndex]
      ? videos[initialVideoIndex]
      : videos[0] || null,
  );

  // Sync when initialVideoIndex or videos change
  useEffect(() => {
    if (!isOpen) return;
    if (initialVideoIndex !== undefined && videos[initialVideoIndex]) {
      setSelectedVideoModal(videos[initialVideoIndex]);
      setViewMode("showcase");
    } else {
      setViewMode("gallery");
      setSelectedVideoModal(videos[0] || null);
    }
  }, [isOpen, initialVideoIndex, videos]);

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
          new Date(a.published_at || "").getTime(),
      );
    } else {
      list.sort(
        (a, b) =>
          new Date(a.published_at || "").getTime() -
          new Date(b.published_at || "").getTime(),
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
        >
          <LayoutGrid className="size-3.5" />
          <span>Back to Gallery</span>
        </Button>
      )}

      <Button variant="outline" size="sm" onClick={handleShare}>
        {copiedShare ? (
          <Check className="size-3.5 text-success" />
        ) : (
          <Share2 className="size-3.5" />
        )}
        <span>Share</span>
      </Button>

      {onToggleWatchlist && (
        <Button size="sm" onClick={onToggleWatchlist}>
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
          <Button
            variant={videoFilterType === "all" ? "default" : "ghost"}
            size="sm"
            type="button"
            onClick={() => setVideoFilterType("all")}
            className="justify-between"
          >
            <span>All Types</span>
            <span className="text-xs opacity-80">{videos.length}</span>
          </Button>
          {videoTypes.map((type) => (
            <Button
              variant={videoFilterType === type ? "default" : "ghost"}
              size="sm"
              key={type}
              type="button"
              onClick={() => setVideoFilterType(type)}
              className="justify-between"
            >
              <span>{type}</span>
              <span className="text-xs opacity-80">
                {videoTypeCounts[type]}
              </span>
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Sort Order
        </h4>
        <div className="flex flex-col gap-1">
          <Button
            variant={videoSort === "date_desc" ? "default" : "ghost"}
            size="sm"
            type="button"
            onClick={() => setVideoSort("date_desc")}
          >
            Newest First
          </Button>
          <Button
            variant={videoSort === "date_asc" ? "default" : "ghost"}
            size="sm"
            type="button"
            onClick={() => setVideoSort("date_asc")}
          >
            Oldest First
          </Button>
        </div>
      </div>
    </div>
  );

  const mobileControls = (
    <div className="grid grid-cols-2 gap-2">
      <FilterSelect
        value={videoFilterType}
        onChange={setVideoFilterType}
        placeholder="Video Type"
        options={[
          { value: "all", label: `All Types (${videos.length})` },
          ...videoTypes.map((type) => ({
            value: type,
            label: `${type} (${videoTypeCounts[type]})`,
          })),
        ]}
      />

      <FilterSelect
        value={videoSort}
        onChange={(val) => setVideoSort(val as typeof videoSort)}
        placeholder="Sort videos"
        options={[
          { value: "date_desc", label: "Newest First" },
          { value: "date_asc", label: "Oldest First" },
        ]}
      />
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
          <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden bg-scrim p-2 sm:p-4">
            <div className="relative aspect-video max-h-lightbox w-full max-w-6xl overflow-hidden rounded-xl shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideoModal.key}?autoplay=1&rel=0`}
                title={selectedVideoModal.name}
                className="size-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="mt-2 w-full max-w-6xl text-center">
              <h3 className="line-clamp-1 heading-card text-media-foreground">
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
                      "relative h-20 w-36 flex-none cursor-pointer overflow-hidden rounded-xl border-2 transition-all",
                      isActive
                        ? "scale-105 border-primary ring-2 ring-primary/40"
                        : "border-transparent opacity-60 hover:opacity-100",
                    )}
                  >
                    <Image
                      src={ytThumb}
                      alt={video.name}
                      fill
                      sizes="144px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-scrim/20">
                      <Play className="size-4 fill-white text-media-foreground opacity-90" />
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
                  <MediaCard
                    key={video.id}
                    type="video"
                    title={video.name}
                    image={ytThumb}
                    badge={video.type || "Video"}
                    subtitle={
                      video.published_at
                        ? new Date(video.published_at).toLocaleDateString()
                        : `${displayTitle} (${displayYear})`
                    }
                    variant="grid"
                    onClick={() => handleSelectVideo(video)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </DetailBottomSheet>
  );
}
