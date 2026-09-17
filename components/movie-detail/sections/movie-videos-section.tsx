import React from "react";
import Image from "next/image";
import { Video as VideoIcon, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Video } from "@/types";

export interface MovieVideosSectionProps {
  videos: Video[];
  onOpenVideosModal: (index?: number) => void;
}

export function MovieVideosSection({
  videos,
  onOpenVideosModal,
}: MovieVideosSectionProps) {
  if (videos.length === 0) return null;

  const previewVideos = videos.slice(0, 3);

  return (
    <section id="section-videos" className="space-y-4">
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <div className="flex items-center gap-2">
          <VideoIcon className="size-5 text-primary" />
          <h2 className="text-xl font-bold sm:text-2xl">Videos</h2>
          <span className="text-xs text-muted-foreground">({videos.length})</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onOpenVideosModal(0)}
          className="gap-1 text-xs font-semibold text-primary hover:text-primary"
        >
          <span>View all videos ({videos.length})</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {previewVideos.map((vid, idx) => {
          const thumb = `https://img.youtube.com/vi/${vid.key}/hqdefault.jpg`;
          return (
            <div
              key={vid.id}
              onClick={() => onOpenVideosModal(idx)}
              className="group cursor-pointer space-y-2 rounded-2xl border border-border/70 bg-card/60 p-2.5 transition-all hover:border-primary/40 hover:shadow-lg"
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
                <Image
                  src={thumb}
                  alt={vid.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 400px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/10" />
                <div className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg backdrop-blur-sm transition-transform group-hover:scale-110">
                  <Play className="ml-0.5 size-5 fill-current" />
                </div>
                <div className="absolute bottom-2 left-2 rounded-full border border-white/20 bg-black/70 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  {vid.type || "Video"}
                </div>
              </div>
              <h4 className="line-clamp-1 px-1 text-sm font-bold text-foreground group-hover:text-primary">
                {vid.name}
              </h4>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default MovieVideosSection;
