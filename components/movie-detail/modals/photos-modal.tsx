"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { X, Share2, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MovieDetailsData, MovieImagesData, MovieImageItem } from "@/types";

export interface PhotosModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: MovieDetailsData;
  images?: MovieImagesData;
  initialPhotoIndex?: number;
}

export function PhotosModal({
  isOpen,
  onClose,
  movie,
  images,
  initialPhotoIndex = 0,
}: PhotosModalProps) {
  const releaseYear = movie.release_date
    ? movie.release_date.substring(0, 4)
    : "";

  const [copiedShare, setCopiedShare] = useState(false);
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${movie.title} (${releaseYear}) Photos`,
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

  const allPhotos: MovieImageItem[] = useMemo(() => {
    if (!images) return [];
    return [...(images.backdrops || []), ...(images.posters || [])];
  }, [images]);

  const [activePhotoIdx, setActivePhotoIdx] = useState(initialPhotoIndex);

  const activePhoto = allPhotos[activePhotoIdx] || allPhotos[0] || null;

  const handlePrevPhoto = () => {
    setActivePhotoIdx((prev) => (prev === 0 ? allPhotos.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    setActivePhotoIdx((prev) => (prev === allPhotos.length - 1 ? 0 : prev + 1));
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="inset-x-0 bottom-0 mx-auto h-[90vh] max-h-[92vh] w-full max-w-(--max-container) overflow-hidden rounded-t-3xl border-x border-t border-b-0 border-border/80 bg-background/95 p-0 shadow-2xl backdrop-blur-2xl"
      >
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
          {/* Header */}
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-border/70 px-6 py-4 sm:px-10 sm:py-5">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="shrink-0 rounded-full hover:bg-muted"
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
                <p className="text-xs font-semibold text-muted-foreground sm:text-sm">
                  {movie.title} photo gallery - image {activePhotoIdx + 1} of{" "}
                  {allPhotos.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={handlePrevPhoto}
                className="rounded-full"
                aria-label="Previous photo"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={handleNextPhoto}
                className="rounded-full"
                aria-label="Next photo"
              >
                <ChevronRight className="size-4" />
              </Button>

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
            </div>
          </div>

          {/* Main Stage: Large Centered Photo Preview */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-black/95 p-4 sm:p-8">
            {activePhoto ? (
              <div className="relative size-full max-w-5xl">
                <Image
                  src={`https://image.tmdb.org/t/p/original${activePhoto.file_path}`}
                  alt={`${movie.title} Photo`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1200px"
                  className="object-contain"
                  priority
                />

                {/* Photo meta / credit overlay top-right */}
                <div className="absolute top-3 right-3 rounded-lg border border-white/20 bg-black/60 px-3 py-1.5 text-xs text-white/80 backdrop-blur-md">
                  <p className="font-semibold">{movie.title}</p>
                  <p className="text-[10px] text-white/60">Courtesy of TMDB Media</p>
                </div>

                {/* Prev / Next large navigation arrows */}
                <button
                  onClick={handlePrevPhoto}
                  className="absolute top-1/2 left-2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur-md transition-colors hover:bg-black/80 hover:text-white"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  onClick={handleNextPhoto}
                  className="absolute top-1/2 right-2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur-md transition-colors hover:bg-black/80 hover:text-white"
                >
                  <ChevronRight className="size-6" />
                </button>
              </div>
            ) : (
              <div className="text-muted-foreground">No photos available</div>
            )}
          </div>

          {/* Bottom filmstrip thumbnail carousel */}
          <div className="shrink-0 border-t border-border/70 bg-card px-6 py-4 sm:px-10 sm:py-5">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">
                  Photo Gallery
                </span>
                <Badge variant="outline" className="text-xs">
                  {allPhotos.length} photos
                </Badge>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevPhoto}
                  className="flex size-7 items-center justify-center rounded-full border text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  onClick={handleNextPhoto}
                  className="flex size-7 items-center justify-center rounded-full border text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            {/* Filmstrip row */}
            <div className="flex scrollbar-none gap-2.5 overflow-x-auto pb-1">
              {allPhotos.map((photo, i) => {
                const isActive = i === activePhotoIdx;
                return (
                  <button
                    key={photo.file_path + i}
                    onClick={() => setActivePhotoIdx(i)}
                    className={`relative h-16 w-24 flex-none overflow-hidden rounded-lg border-2 transition-all ${
                      isActive
                        ? "scale-105 border-primary ring-2 ring-primary/40"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/w300${photo.file_path}`}
                      alt="Thumbnail"
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default PhotosModal;
