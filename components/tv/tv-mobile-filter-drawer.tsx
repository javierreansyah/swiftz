"use client";

import React, { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TVSidebar } from "./tv-sidebar";
import { TVFilterState } from "./types";

export interface TVMobileFilterDrawerProps {
  activeFilters: TVFilterState;
  onApplyFilters: (filters: TVFilterState) => void;
  onResetFilters: () => void;
}

export function TVMobileFilterDrawer({
  activeFilters,
  onApplyFilters,
  onResetFilters,
}: TVMobileFilterDrawerProps) {
  const [open, setOpen] = useState(false);

  const activeCount =
    activeFilters.with_genres.length +
    (activeFilters.first_air_date_year ? 1 : 0) +
    (activeFilters.vote_average_gte > 0 ? 1 : 0) +
    (activeFilters.sort_by !== "popularity.desc" ? 1 : 0);

  const handleApply = (filters: TVFilterState) => {
    onApplyFilters(filters);
    setOpen(false);
  };

  const handleReset = () => {
    onResetFilters();
    setOpen(false);
  };

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between rounded-none border-border/80 bg-secondary/40 py-5 text-xs font-medium"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-3.5 text-primary" />
              <span>Filter &amp; Sort TV Shows</span>
            </div>
            {activeCount > 0 ? (
              <span className="rounded-none bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                {activeCount} active
              </span>
            ) : (
              <span className="text-muted-foreground">None active</span>
            )}
          </Button>
        </SheetTrigger>

        {/* Full-width mobile filter screen */}
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="inset-0 flex size-full max-h-screen max-w-full flex-col rounded-none border-none bg-background p-0 sm:max-w-full"
        >
          {/* Top Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-border/70 px-6 py-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-primary" />
              <SheetTitle className="font-heading text-lg font-bold">
                Filter &amp; Sort TV Shows
              </SheetTitle>
              {activeCount > 0 && (
                <span className="rounded-none bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                  {activeCount} active
                </span>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="rounded-none hover:bg-muted"
            >
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {/* Scrollable Filter Options Body */}
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            <TVSidebar
              activeFilters={activeFilters}
              onApplyFilters={handleApply}
              onResetFilters={handleReset}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default TVMobileFilterDrawer;
