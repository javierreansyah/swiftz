"use client";
import type { ReactNode, Ref } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShowcaseFilmstrip({
  label,
  count,
  onPrevious,
  onNext,
  media,
  containerRef,
  children,
}: {
  label: string;
  count: number;
  onPrevious: () => void;
  onNext: () => void;
  media: "photo" | "video";
  containerRef: Ref<HTMLDivElement>;
  children: ReactNode;
}) {
  return (
    <div className="shrink-0 border-t border-border/70 bg-card/90 py-3">
      <div className="mb-2 flex items-center justify-between px-6">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            variant="secondary"
            size="icon-sm"
            type="button"
            onClick={onPrevious}
            disabled={count <= 1}
            aria-label={`Previous ${media}`}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon-sm"
            type="button"
            onClick={onNext}
            disabled={count <= 1}
            aria-label={`Next ${media}`}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="flex scrollbar-none gap-3 overflow-x-auto px-6 py-2"
      >
        {children}
      </div>
    </div>
  );
}
