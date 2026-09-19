"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  Share2,
  ChevronLeft,
  ChevronRight,
  Download,
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
import { MovieImagesData, MovieImageItem } from "@/types";
import { DetailBottomSheet } from "@/components/common/detail-bottom-sheet";
import { cn } from "@/lib/utils";

interface TypedMovieImage extends MovieImageItem {
  type: "backdrop" | "poster";
}

export interface PhotosModalProps {
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
  images?: MovieImagesData;
  initialPhotoIndex?: number;
}

export function PhotosModal({
  isOpen,
  onClose,
  movie,
  title: customTitle,
  releaseYear: customReleaseYear,
  images,
  initialPhotoIndex,
}: PhotosModalProps) {
  const displayTitle =
    customTitle || movie?.title || movie?.name || "Photos";
  const rawDate = movie?.release_date || movie?.first_air_date;
  const displayYear =
    customReleaseYear || (rawDate ? rawDate.substring(0, 4) : "");

  const [copiedShare, setCopiedShare] = useState(false);
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${displayTitle} (${displayYear}) Photos`,
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

  // When clicking "See all", initialPhotoIndex is undefined -> opens in gallery view
  // When clicking a specific card, initialPhotoIndex is provided -> opens in showcase view
  const [viewMode, setViewMode] = useState<"gallery" | "showcase">(
    initialPhotoIndex !== undefined ? "showcase" : "gallery"
  );
  const [photoTypeFilter, setPhotoTypeFilter] = useState<
    "all" | "backdrops" | "posters"
  >("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");

  const allPhotos = useMemo(() => {
    const list: TypedMovieImage[] = [];
    if (images?.backdrops) {
      list.push(
        ...images.backdrops.map((b) => ({ ...b, type: "backdrop" as const }))
      );
    }
    if (images?.posters) {
      list.push(
        ...images.posters.map((p) => ({ ...p, type: "poster" as const }))
      );
    }
    return list;
  }, [images]);

  const languagesAvailable = useMemo(() => {
    const langCounts: Record<string, { code: string; name: string; count: number }> =
      {};

    allPhotos.forEach((photo) => {
      const code = photo.iso_639_1 || "no_lang";
      if (!langCounts[code]) {
        langCounts[code] = {
          code,
          name:
            code === "no_lang"
              ? "No Language (Textless)"
              : code.toUpperCase(),
          count: 0,
        };
      }
      langCounts[code].count++;
    });

    return Object.values(langCounts).sort((a, b) => b.count - a.count);
  }, [allPhotos]);

  const filteredPhotos = useMemo(() => {
    let list: TypedMovieImage[] = [];
    if (photoTypeFilter === "all" || photoTypeFilter === "backdrops") {
      list.push(
        ...(images?.backdrops || []).map((b) => ({
          ...b,
          type: "backdrop" as const,
        }))
      );
    }
    if (photoTypeFilter === "all" || photoTypeFilter === "posters") {
      list.push(
        ...(images?.posters || []).map((p) => ({
          ...p,
          type: "poster" as const,
        }))
      );
    }

    if (selectedLanguage !== "all") {
      if (selectedLanguage === "no_lang") {
        list = list.filter((p) => !p.iso_639_1);
      } else {
        list = list.filter((p) => p.iso_639_1 === selectedLanguage);
      }
    }

    return list;
  }, [images, photoTypeFilter, selectedLanguage]);

  const [activePhotoIdx, setActivePhotoIdx] = useState(
    initialPhotoIndex !== undefined ? initialPhotoIndex : 0
  );

  useEffect(() => {
    if (initialPhotoIndex !== undefined) {
      setActivePhotoIdx(initialPhotoIndex);
      setViewMode("showcase");
    } else {
      setViewMode("gallery");
      setActivePhotoIdx(0);
    }
  }, [initialPhotoIndex]);

  const activePhoto =
    filteredPhotos[activePhotoIdx] ||
    filteredPhotos[0] ||
    allPhotos[0] ||
    null;

  const handlePrevPhoto = () => {
    setActivePhotoIdx((prev) =>
      prev === 0 ? filteredPhotos.length - 1 : prev - 1
    );
  };

  const handleNextPhoto = () => {
    setActivePhotoIdx((prev) =>
      prev === filteredPhotos.length - 1 ? 0 : prev + 1
    );
  };

  const handleSelectPhoto = (index: number) => {
    setActivePhotoIdx(index);
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

      {activePhoto && viewMode === "showcase" && (
        <Button
          size="sm"
          asChild
          className="gap-1.5 rounded-none bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/90"
        >
          <a
            href={`https://image.tmdb.org/t/p/original${activePhoto.file_path}`}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            <Download className="size-3.5" />
            <span>High-Res</span>
          </a>
        </Button>
      )}
    </div>
  );

  const desktopSidebar = (
    <div className="flex flex-col gap-5">
      <div>
        <h4 className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Category
        </h4>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setPhotoTypeFilter("all")}
            className={cn(
              "flex items-center justify-between rounded-none px-3 py-2 text-left text-xs font-medium transition-colors",
              photoTypeFilter === "all"
                ? "bg-primary font-semibold text-primary-foreground"
                : "text-foreground/80 hover:bg-muted"
            )}
          >
            <span>All Photos</span>
            <span className="text-[11px] opacity-80">{allPhotos.length}</span>
          </button>
          <button
            type="button"
            onClick={() => setPhotoTypeFilter("backdrops")}
            className={cn(
              "flex items-center justify-between rounded-none px-3 py-2 text-left text-xs font-medium transition-colors",
              photoTypeFilter === "backdrops"
                ? "bg-primary font-semibold text-primary-foreground"
                : "text-foreground/80 hover:bg-muted"
            )}
          >
            <span>Backdrops (16:9)</span>
            <span className="text-[11px] opacity-80">
              {images?.backdrops?.length || 0}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setPhotoTypeFilter("posters")}
            className={cn(
              "flex items-center justify-between rounded-none px-3 py-2 text-left text-xs font-medium transition-colors",
              photoTypeFilter === "posters"
                ? "bg-primary font-semibold text-primary-foreground"
                : "text-foreground/80 hover:bg-muted"
            )}
          >
            <span>Posters (2:3)</span>
            <span className="text-[11px] opacity-80">
              {images?.posters?.length || 0}
            </span>
          </button>
        </div>
      </div>

      {languagesAvailable.length > 1 && (
        <div>
          <h4 className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Language
          </h4>
          <div className="flex max-h-48 flex-col gap-1 overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedLanguage("all")}
              className={cn(
                "flex items-center justify-between rounded-none px-3 py-1.5 text-left text-xs font-medium transition-colors",
                selectedLanguage === "all"
                  ? "bg-primary font-semibold text-primary-foreground"
                  : "text-foreground/80 hover:bg-muted"
              )}
            >
              <span>All Languages</span>
            </button>
            {languagesAvailable.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSelectedLanguage(lang.code)}
                className={cn(
                  "flex items-center justify-between rounded-none px-3 py-1.5 text-left text-xs font-medium transition-colors",
                  selectedLanguage === lang.code
                    ? "bg-primary font-semibold text-primary-foreground"
                    : "text-foreground/80 hover:bg-muted"
                )}
              >
                <span className="truncate">{lang.name}</span>
                <span className="text-[11px] opacity-80">{lang.count}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const mobileControls = (
    <div className="grid grid-cols-2 gap-2">
      <Select
        value={photoTypeFilter}
        onValueChange={(val: "all" | "backdrops" | "posters") =>
          setPhotoTypeFilter(val)
        }
      >
        <SelectTrigger className="h-8 rounded-none bg-card text-xs">
          <SelectValue placeholder="Photo Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Photos ({allPhotos.length})</SelectItem>
          <SelectItem value="backdrops">
            Backdrops ({images?.backdrops?.length || 0})
          </SelectItem>
          <SelectItem value="posters">
            Posters ({images?.posters?.length || 0})
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={selectedLanguage}
        onValueChange={(val) => setSelectedLanguage(val)}
      >
        <SelectTrigger className="h-8 rounded-none bg-card text-xs">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Languages</SelectItem>
          {languagesAvailable.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name} ({lang.count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <DetailBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={displayTitle}
      subtitle={displayYear ? `Photos · ${displayYear}` : "Photos"}
      badge={`${allPhotos.length} Photos`}
      headerActions={headerActions}
      sidebar={desktopSidebar}
      mobileControls={mobileControls}
      disableDefaultScroll={viewMode === "showcase"}
    >
      {viewMode === "showcase" && activePhoto ? (
        /* Showcase View: Stage + Identical Height Bottom Filmstrip */
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
          {/* Main Photo Stage */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-black/95 p-2 sm:p-4">
            <div className="relative size-full">
              <Image
                src={`https://image.tmdb.org/t/p/original${activePhoto.file_path}`}
                alt={`${displayTitle} Photo`}
                fill
                sizes="100vw"
                className="object-contain select-none"
                priority
              />

              {/* Photo meta overlay */}
              <div className="absolute top-3 right-3 rounded-none border border-white/20 bg-black/60 px-3 py-1.5 text-xs text-white/80 backdrop-blur-md">
                <p className="font-semibold">{displayTitle}</p>
                <p className="text-[10px] text-white/60">
                  {activePhoto.width} &times; {activePhoto.height} &bull;{" "}
                  {activePhoto.type === "backdrop" ? "Backdrop" : "Poster"}
                </p>
              </div>

              {/* Prev/Next Buttons */}
              <button
                type="button"
                onClick={handlePrevPhoto}
                aria-label="Previous photo"
                className="absolute top-1/2 left-2 flex size-11 -translate-y-1/2 items-center justify-center rounded-none bg-black/50 text-white/80 backdrop-blur-md transition-colors hover:bg-black/80 hover:text-white"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={handleNextPhoto}
                aria-label="Next photo"
                className="absolute top-1/2 right-2 flex size-11 -translate-y-1/2 items-center justify-center rounded-none bg-black/50 text-white/80 backdrop-blur-md transition-colors hover:bg-black/80 hover:text-white"
              >
                <ChevronRight className="size-6" />
              </button>
            </div>
          </div>

          {/* Standardized Bottom Filmstrip (Identical h-20 container to Videos) */}
          <div className="shrink-0 border-t border-border/70 bg-card/90 px-6 py-3.5">
            <div className="flex scrollbar-none gap-2.5 overflow-x-auto pb-0.5">
              {filteredPhotos.map((photo, i) => {
                const isActive = i === activePhotoIdx;
                return (
                  <button
                    key={photo.file_path + i}
                    type="button"
                    onClick={() => setActivePhotoIdx(i)}
                    className={cn(
                      "relative h-20 w-36 flex-none cursor-pointer overflow-hidden rounded-none border-2 transition-all",
                      isActive
                        ? "scale-105 border-primary ring-2 ring-primary/40"
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/w300${photo.file_path}`}
                      alt="Thumbnail"
                      fill
                      sizes="144px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Gallery Grid View */
        <div className="h-full">
          {filteredPhotos.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              No photos found matching the filter.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filteredPhotos.map((photo, idx) => {
                const isBackdrop = photo.type === "backdrop";
                return (
                  <div
                    key={photo.file_path + idx}
                    onClick={() => handleSelectPhoto(idx)}
                    className={cn(
                      "group relative cursor-pointer overflow-hidden rounded-none border border-border/70 bg-card/60 transition-all hover:border-primary/40 hover:shadow-lg",
                      isBackdrop
                        ? "col-span-2 aspect-video"
                        : "col-span-1 aspect-2/3"
                    )}
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/w780${photo.file_path}`}
                      alt={displayTitle}
                      fill
                      sizes="(max-width: 640px) 50vw, 300px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
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

export default PhotosModal;
