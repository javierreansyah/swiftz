"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  X,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Image as ImageIcon,
  Languages,
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
import { MovieDetailsData, MovieImagesData, MovieImageItem } from "@/types";
import { cn } from "@/lib/utils";

export interface PhotosModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: MovieDetailsData;
  images?: MovieImagesData;
  initialPhotoIndex?: number;
}

type TypedMovieImage = MovieImageItem & { type: "backdrop" | "poster" };

export function PhotosModal({
  isOpen,
  onClose,
  movie,
  images,
  initialPhotoIndex,
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

  const [viewMode, setViewMode] = useState<"gallery" | "showcase">(
    initialPhotoIndex !== undefined ? "showcase" : "gallery"
  );
  const [photoTypeFilter, setPhotoTypeFilter] = useState<
    "all" | "backdrops" | "posters"
  >("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");

  const allPhotos: TypedMovieImage[] = useMemo(() => {
    if (!images) return [];
    const backdrops = (images.backdrops || []).map((b) => ({
      ...b,
      type: "backdrop" as const,
    }));
    const posters = (images.posters || []).map((p) => ({
      ...p,
      type: "poster" as const,
    }));
    return [...backdrops, ...posters];
  }, [images]);

  const languageList = useMemo(() => {
    const langCounts: Record<
      string,
      { code: string; label: string; count: number }
    > = {};
    const langNames = new Intl.DisplayNames(["en"], { type: "language" });

    allPhotos.forEach((p) => {
      const code = p.iso_639_1 || "no_lang";
      if (!langCounts[code]) {
        let label = "No Language (Textless)";
        if (p.iso_639_1) {
          try {
            label = langNames.of(p.iso_639_1) || p.iso_639_1.toUpperCase();
          } catch {
            label = p.iso_639_1.toUpperCase();
          }
        }
        langCounts[code] = { code, label, count: 0 };
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
                    Photo Gallery ({allPhotos.length})
                  </p>
                  {viewMode === "showcase" && (
                    <span className="rounded-none bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {activePhotoIdx + 1} of {filteredPhotos.length}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {viewMode === "showcase" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode("gallery")}
                    className="gap-1.5 rounded-none text-xs"
                  >
                    <LayoutGrid className="size-3.5" />
                    <span>Back to Gallery</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={handlePrevPhoto}
                    className="rounded-none"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={handleNextPhoto}
                    className="rounded-none"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </>
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
            </div>
          </div>

          {/* Mobile Top Controls */}
          <div className="flex flex-col gap-2 border-b border-border/60 bg-muted/20 p-3 md:hidden">
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={photoTypeFilter}
                onValueChange={(val) =>
                  setPhotoTypeFilter(val as "all" | "backdrops" | "posters")
                }
              >
                <SelectTrigger className="h-8 w-full bg-card text-xs">
                  <SelectValue placeholder="All Photos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All Photos ({allPhotos.length})
                  </SelectItem>
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
                <SelectTrigger className="h-8 w-full bg-card text-xs">
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All Languages ({allPhotos.length})
                  </SelectItem>
                  {languageList.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.label} ({lang.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Body: Desktop Left Sidebar + Main Content Area */}
          <div className="flex min-h-0 flex-1 overflow-hidden">
            {/* Desktop Left Sidebar */}
            <aside className="hidden w-60 shrink-0 flex-col gap-5 overflow-y-auto border-r border-border/70 bg-muted/15 p-4 md:flex">
              {/* Photo Type Filter */}
              <div>
                <h4 className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Image Type
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
                    <span className="flex items-center gap-2">
                      <ImageIcon className="size-4" />
                      All Photos
                    </span>
                    <span className="text-[10px] opacity-80">
                      {allPhotos.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPhotoTypeFilter("backdrops")}
                    className={cn(
                      "flex items-center justify-between rounded-none px-3 py-1.5 text-left text-xs transition-colors",
                      photoTypeFilter === "backdrops"
                        ? "bg-primary font-semibold text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span>Backdrops</span>
                    <span className="text-[10px] opacity-80">
                      {images?.backdrops?.length || 0}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPhotoTypeFilter("posters")}
                    className={cn(
                      "flex items-center justify-between rounded-none px-3 py-1.5 text-left text-xs transition-colors",
                      photoTypeFilter === "posters"
                        ? "bg-primary font-semibold text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span>Posters</span>
                    <span className="text-[10px] opacity-80">
                      {images?.posters?.length || 0}
                    </span>
                  </button>
                </div>
              </div>

              {/* Language Filter */}
              <div>
                <h4 className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Language
                </h4>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => setSelectedLanguage("all")}
                    className={cn(
                      "flex items-center justify-between rounded-none px-3 py-2 text-left text-xs font-medium transition-colors",
                      selectedLanguage === "all"
                        ? "bg-accent font-semibold text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Languages className="size-3.5" />
                      All Languages
                    </span>
                    <span className="text-[10px] opacity-80">
                      {allPhotos.length}
                    </span>
                  </button>

                  {languageList.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setSelectedLanguage(lang.code)}
                      className={cn(
                        "flex items-center justify-between rounded-none px-3 py-1.5 text-left text-xs transition-colors",
                        selectedLanguage === lang.code
                          ? "bg-primary font-semibold text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <span className="truncate">{lang.label}</span>
                      <span className="ml-2 text-[10px] opacity-80">
                        {lang.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Area: Gallery View OR Showcase View */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              {viewMode === "showcase" && activePhoto ? (
                /* Showcase View: Large Preview + Filmstrip */
                <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
                  {/* Stage */}
                  <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-black/95 p-4 sm:p-6">
                    <div className="relative size-full max-w-5xl">
                      <Image
                        src={`https://image.tmdb.org/t/p/original${activePhoto.file_path}`}
                        alt={`${movie.title} Photo`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 1200px"
                        className="object-contain"
                        priority
                      />

                      {/* Photo meta overlay */}
                      <div className="absolute top-3 right-3 rounded-none border border-white/20 bg-black/60 px-3 py-1.5 text-xs text-white/80 backdrop-blur-md">
                        <p className="font-semibold">{movie.title}</p>
                        <p className="text-[10px] text-white/60">
                          {activePhoto.width} &times; {activePhoto.height} &bull;{" "}
                          {activePhoto.type === "backdrop"
                            ? "Backdrop"
                            : "Poster"}
                        </p>
                      </div>

                      {/* Large Prev/Next buttons */}
                      <button
                        onClick={handlePrevPhoto}
                        className="absolute top-1/2 left-2 flex size-11 -translate-y-1/2 items-center justify-center rounded-none bg-black/50 text-white/80 backdrop-blur-md transition-colors hover:bg-black/80 hover:text-white"
                      >
                        <ChevronLeft className="size-6" />
                      </button>
                      <button
                        onClick={handleNextPhoto}
                        className="absolute top-1/2 right-2 flex size-11 -translate-y-1/2 items-center justify-center rounded-none bg-black/50 text-white/80 backdrop-blur-md transition-colors hover:bg-black/80 hover:text-white"
                      >
                        <ChevronRight className="size-6" />
                      </button>
                    </div>
                  </div>

                  {/* Showcase Filmstrip */}
                  <div className="shrink-0 border-t border-border/70 bg-card/80 px-6 py-3">
                    <div className="flex scrollbar-none gap-2 overflow-x-auto pb-1">
                      {filteredPhotos.map((photo, i) => {
                        const isActive = i === activePhotoIdx;
                        return (
                          <button
                            key={photo.file_path + i}
                            onClick={() => setActivePhotoIdx(i)}
                            className={cn(
                              "relative h-14 w-22 flex-none overflow-hidden rounded-none border-2 transition-all",
                              isActive
                                ? "scale-105 border-primary ring-2 ring-primary/40"
                                : "border-transparent opacity-60 hover:opacity-100"
                            )}
                          >
                            <Image
                              src={`https://image.tmdb.org/t/p/w300${photo.file_path}`}
                              alt="Thumbnail"
                              fill
                              sizes="88px"
                              className="object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* Gallery View */
                <ScrollArea className="min-h-0 flex-1 p-6 sm:p-8">
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
                              alt={movie.title}
                              fill
                              sizes="(max-width: 640px) 50vw, 300px"
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-end bg-black/20 p-2.5 opacity-0 transition-opacity group-hover:opacity-100">
                              <span className="rounded-none bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                                {photo.width} &times; {photo.height}
                              </span>
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

export default PhotosModal;
