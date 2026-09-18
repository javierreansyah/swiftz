"use client";

import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMovieVideosQuery, useTVVideosQuery } from "@/hooks/use-tmdb";
import { Film, Loader2 } from "lucide-react";

export interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoKey?: string;
  mediaId?: number | string;
  mediaType?: "movie" | "tv";
}

export function TrailerModal({
  isOpen,
  onClose,
  title,
  videoKey: directVideoKey,
  mediaId,
  mediaType = "movie",
}: TrailerModalProps) {
  // Query videos if mediaId is supplied and no directVideoKey was passed
  const isMovie = mediaType === "movie";
  const { data: movieVideos, isLoading: isMovieLoading } = useMovieVideosQuery(
    !directVideoKey && isMovie && mediaId ? mediaId : ""
  );
  const { data: tvVideos, isLoading: isTvLoading } = useTVVideosQuery(
    !directVideoKey && !isMovie && mediaId ? mediaId : ""
  );

  const activeVideoKey = useMemo(() => {
    if (directVideoKey) return directVideoKey;
    const vList = isMovie ? movieVideos?.results : tvVideos?.results;
    if (!vList || vList.length === 0) return null;

    // Look for official trailer first
    const officialTrailer = vList.find(
      (v) =>
        v.site?.toLowerCase() === "youtube" &&
        v.type?.toLowerCase() === "trailer" &&
        v.official
    );
    if (officialTrailer) return officialTrailer.key;

    // Any trailer
    const trailer = vList.find(
      (v) =>
        v.site?.toLowerCase() === "youtube" &&
        v.type?.toLowerCase() === "trailer"
    );
    if (trailer) return trailer.key;

    // Any teaser or clip
    const teaserOrClip = vList.find(
      (v) =>
        v.site?.toLowerCase() === "youtube" &&
        (v.type?.toLowerCase() === "teaser" || v.type?.toLowerCase() === "clip")
    );
    if (teaserOrClip) return teaserOrClip.key;

    // Any YouTube video
    const anyYt = vList.find((v) => v.site?.toLowerCase() === "youtube");
    return anyYt ? anyYt.key : null;
  }, [directVideoKey, isMovie, movieVideos, tvVideos]);

  const isLoading =
    !directVideoKey && mediaId && (isMovie ? isMovieLoading : isTvLoading);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl overflow-hidden border-border/80 bg-neutral-950 p-0 text-white shadow-2xl sm:max-w-4xl">
        <DialogHeader className="border-b border-white/10 p-4">
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-white">
            <Film className="size-4 text-primary" />
            <span className="line-clamp-1">{title} &mdash; Official Trailer</span>
          </DialogTitle>
        </DialogHeader>

        <div className="relative aspect-video w-full bg-black">
          {isLoading ? (
            <div className="flex size-full flex-col items-center justify-center gap-3 text-neutral-400">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm">Loading trailer...</p>
            </div>
          ) : activeVideoKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${activeVideoKey}?autoplay=1&rel=0&modestbranding=1`}
              title={`${title} Trailer`}
              className="size-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-2 p-8 text-center text-neutral-400">
              <Film className="stroke-1.5 size-12 text-neutral-600" />
              <h3 className="text-base font-semibold text-neutral-300">
                Trailer Not Available
              </h3>
              <p className="max-w-sm text-xs text-neutral-500">
                TMDB currently has no video trailer registered for &quot;{title}&quot;.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TrailerModal;
