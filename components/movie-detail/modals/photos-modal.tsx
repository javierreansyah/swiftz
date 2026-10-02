"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "@/components/ui/image";
import {
  Share2,
  ChevronLeft,
  ChevronRight,
  Download,
  Check,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/components/common/filter-sidebar-primitives";
import { MovieImagesData, MovieImageItem } from "@/types";
import { DetailBottomSheet } from "@/components/common/detail-bottom-sheet";
import { MediaCard } from "@/components/common/media-card";
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
    if (!isOpen) return;
    if (initialPhotoIndex !== undefined) {
      setActivePhotoIdx(initialPhotoIndex);
      setViewMode("showcase");
    } else {
      setViewMode("gallery");
      setActivePhotoIdx(0);
    }
  }, [isOpen, initialPhotoIndex]);

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
        >
          <LayoutGrid className="size-3.5" />
          <span>Back to Gallery</span>
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
      >
        {copiedShare ? (
          <Check className="size-3.5 text-success" />
        ) : (
          <Share2 className="size-3.5" />
        )}
        <span>Share</span>
      </Button>

      {activePhoto && viewMode === "showcase" && (
        <Button
          size="sm"
          asChild
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
          <Button variant={photoTypeFilter === "all" ? "default" : "ghost"} size="sm"
            type="button"
            onClick={() => setPhotoTypeFilter("all")}
            className="justify-between"
          >
            <span>All Photos</span>
            <span className="text-xs opacity-80">{allPhotos.length}</span>
          </Button>
          <Button variant={photoTypeFilter === "backdrops" ? "default" : "ghost"} size="sm"
            type="button"
            onClick={() => setPhotoTypeFilter("backdrops")}
            className="justify-between"
          >
            <span>Backdrops (16:9)</span>
            <span className="text-xs opacity-80">
              {images?.backdrops?.length || 0}
            </span>
          </Button>
          <Button variant={photoTypeFilter === "posters" ? "default" : "ghost"} size="sm"
            type="button"
            onClick={() => setPhotoTypeFilter("posters")}
            className="justify-between"
          >
            <span>Posters (2:3)</span>
            <span className="text-xs opacity-80">
              {images?.posters?.length || 0}
            </span>
          </Button>
        </div>
      </div>

      {languagesAvailable.length > 1 && (
        <div>
          <h4 className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Language
          </h4>
          <div className="flex max-h-48 flex-col gap-1 overflow-y-auto">
            <Button variant={selectedLanguage === "all" ? "default" : "ghost"} size="sm"
              type="button"
              onClick={() => setSelectedLanguage("all")}
              className="justify-between"
            >
              <span>All Languages</span>
            </Button>
            {languagesAvailable.map((lang) => (
              <Button variant={selectedLanguage === lang.code ? "default" : "ghost"} size="sm"
                key={lang.code}
                type="button"
                onClick={() => setSelectedLanguage(lang.code)}
                className="justify-between"
              >
                <span className="truncate">{lang.name}</span>
                <span className="text-xs opacity-80">{lang.count}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const mobileControls = (
    <div className="grid grid-cols-2 gap-2">
      <FilterSelect
        value={photoTypeFilter}
        onChange={(val) => setPhotoTypeFilter(val as typeof photoTypeFilter)}
        placeholder="Photo Type"
        options={[
          { value: "all", label: `All Photos (${allPhotos.length})` },
          { value: "backdrops", label: `Backdrops (${images?.backdrops?.length || 0})` },
          { value: "posters", label: `Posters (${images?.posters?.length || 0})` },
        ]}
      />

      <FilterSelect
        value={selectedLanguage}
        onChange={setSelectedLanguage}
        placeholder="Language"
        options={[
          { value: "all", label: "All Languages" },
          ...languagesAvailable.map((lang) => ({ value: lang.code, label: `${lang.name} (${lang.count})` })),
        ]}
      />
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
          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-scrim/95 p-2 sm:p-4">
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
              <div className="absolute top-3 right-3 rounded-xl border border-media-foreground/20 bg-scrim/60 px-3 py-1.5 text-xs text-media-foreground/80 backdrop-blur-md">
                <p className="font-semibold">{displayTitle}</p>
                <p className="text-xs text-media-foreground/60">
                  {activePhoto.width} &times; {activePhoto.height} &bull;{" "}
                  {activePhoto.type === "backdrop" ? "Backdrop" : "Poster"}
                </p>
              </div>

              {/* Prev/Next Buttons */}
              <Button variant="media" size="icon-lg"
                type="button"
                onClick={handlePrevPhoto}
                aria-label="Previous photo"
                className="absolute top-1/2 left-2 -translate-y-1/2"
              >
                <ChevronLeft className="size-6" />
              </Button>
              <Button variant="media" size="icon-lg"
                type="button"
                onClick={handleNextPhoto}
                aria-label="Next photo"
                className="absolute top-1/2 right-2 -translate-y-1/2"
              >
                <ChevronRight className="size-6" />
              </Button>
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
                      "relative h-20 w-36 flex-none cursor-pointer overflow-hidden rounded-xl border-2 transition-all",
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
                    className={isBackdrop ? "col-span-2" : "col-span-1"}
                  >
                    <MediaCard
                      type="photo"
                      title={`${displayTitle} · ${isBackdrop ? "Backdrop" : "Poster"} ${idx + 1}`}
                      image={`https://image.tmdb.org/t/p/w780${photo.file_path}`}
                      aspectRatio={isBackdrop ? "video" : "poster"}
                      variant="image"
                      sizes={isBackdrop
                        ? "(max-width: 640px) 100vw, (max-width: 768px) 66vw, (max-width: 1024px) 50vw, 40vw"
                        : "(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"}
                      onClick={() => handleSelectPhoto(idx)}
                    />
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
