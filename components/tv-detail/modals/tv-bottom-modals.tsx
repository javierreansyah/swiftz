"use client";

import React from "react";
import { TVShowDetailsData, Cast, Crew, Video } from "@/types";
import { TVCastModal } from "./tv-cast-modal";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export type TVModalType =
  | "reviews"
  | "videos"
  | "photos"
  | "cast"
  | "recommendations"
  | null;

export interface TVBottomModalsProps {
  activeModal: TVModalType;
  onClose: () => void;
  show: TVShowDetailsData;
  cast: Cast[];
  crew: Crew[];
  videos: Video[];
  initialVideoIndex?: number;
}

export function TVBottomModals({
  activeModal,
  onClose,
  show,
  cast,
  crew,
  videos,
  initialVideoIndex = 0,
}: TVBottomModalsProps) {
  if (!activeModal) return null;

  const currentVideo = videos[initialVideoIndex] || videos[0] || null;

  return (
    <>
      {/* Full Cast & Crew Sheet Modal */}
      <TVCastModal
        isOpen={activeModal === "cast"}
        onClose={onClose}
        show={show}
        cast={cast}
        crew={crew}
      />

      {/* Video / Trailer Dialog Modal */}
      {activeModal === "videos" && currentVideo && (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
          <DialogContent className="max-w-4xl overflow-hidden border-border bg-black p-0">
            <DialogTitle className="sr-only">
              {currentVideo.name || `${show.name} Video`}
            </DialogTitle>
            <div className="relative aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${currentVideo.key}?autoplay=1&rel=0`}
                title={currentVideo.name || "Video"}
                className="size-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default TVBottomModals;
