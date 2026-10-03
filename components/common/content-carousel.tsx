"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type SectionHeaderTab,
  type SectionHeaderAction,
  SectionHeader,
} from "@/components/common/section-header";
import { cn } from "@/lib/utils";
export interface ContentCarouselProps {
  title: string;
  count?: number;
  badge?: string;
  tabs?: SectionHeaderTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  action?: SectionHeaderAction;
  scrollAmount?: number;
  id?: string;
  children: React.ReactNode;
  className?: string;
  carouselClassName?: string;
}

export function ContentCarousel({
  title,
  count,
  badge,
  tabs,
  activeTab,
  onTabChange,
  action,
  scrollAmount = 520,
  id,
  children,
  className,
  carouselClassName,
}: ContentCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: true });

  const updateEdges = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const atStart = el.scrollLeft <= 1;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
    setEdges((prev) =>
      prev.atStart === atStart && prev.atEnd === atEnd
        ? prev
        : { atStart, atEnd },
    );
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    const resizeObserver = new ResizeObserver(updateEdges);
    resizeObserver.observe(el);
    const mutationObserver = new MutationObserver(updateEdges);
    mutationObserver.observe(el, { childList: true });
    return () => {
      el.removeEventListener("scroll", updateEdges);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [updateEdges]);

  const scrollPrev = () => {
    scrollContainerRef.current?.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollNext = () => {
    scrollContainerRef.current?.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const arrowControls = (
    <div className="hidden items-center gap-1 sm:flex">
      <Button
        variant="outline"
        size="icon-sm"
        onClick={scrollPrev}
        disabled={edges.atStart}
        aria-label={`Scroll ${title} left`}
      >
        <ChevronLeft className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={scrollNext}
        disabled={edges.atEnd}
        aria-label={`Scroll ${title} right`}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );

  return (
    <section id={id} className={cn("scroll-mt-24 space-y-3 pt-2", className)}>
      {/* Standardized Serif Section Header */}
      <SectionHeader
        title={title}
        count={count}
        badge={badge}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        action={action}
        controls={arrowControls}
      />

      {/* Horizontal Carousel Shelf */}
      <div
        ref={scrollContainerRef}
        className={cn(
          "flex scrollbar-none gap-4 overflow-x-auto scroll-smooth pt-1 pb-2",
          carouselClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
