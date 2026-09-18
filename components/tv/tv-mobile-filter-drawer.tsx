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
    (activeFilters.vote_average_gte > 0 ? 1 : 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between rounded-none border-border bg-card py-5 font-semibold lg:hidden"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-primary" />
            <span>TV Filters &amp; Sort</span>
          </div>
          {activeCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-none bg-primary text-[11px] font-bold text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="max-h-[85vh] overflow-y-auto rounded-none border-t border-border bg-background p-6"
      >
        <SheetHeader className="mb-4 flex flex-row items-center justify-between border-b pb-3">
          <SheetTitle className="text-base font-bold">Filter TV Shows</SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="size-8"
          >
            <X className="size-4" />
          </Button>
        </SheetHeader>

        <TVSidebar
          activeFilters={activeFilters}
          onApplyFilters={(filters) => {
            onApplyFilters(filters);
          }}
          onResetFilters={() => {
            onResetFilters();
            setOpen(false);
          }}
        />

        <div className="sticky bottom-0 mt-6 border-t border-border bg-background pt-3">
          <Button
            onClick={() => setOpen(false)}
            className="w-full rounded-none font-bold"
          >
            Done
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default TVMobileFilterDrawer;
