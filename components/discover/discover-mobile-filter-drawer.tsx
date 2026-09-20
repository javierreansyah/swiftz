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
import { DiscoverSidebar } from "./discover-sidebar";
import { DiscoverFilterState } from "./types";
import { countActiveFilters } from "./filter-utils";

export interface DiscoverMobileFilterDrawerProps {
  activeFilters: DiscoverFilterState;
  onApplyFilters: (filters: DiscoverFilterState) => void;
  onResetFilters: () => void;
}

export function DiscoverMobileFilterDrawer({
  activeFilters,
  onApplyFilters,
  onResetFilters,
}: DiscoverMobileFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeCount = countActiveFilters(activeFilters);

  const handleApply = (filters: DiscoverFilterState) => {
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    onResetFilters();
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between rounded-none border-border/80 bg-secondary/40 py-5 text-xs font-medium"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-3.5 text-primary" />
              <span>Filter &amp; Sort Movies</span>
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
                Filter &amp; Sort Movies
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
              onClick={() => setIsOpen(false)}
              className="rounded-none hover:bg-muted"
            >
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {/* Scrollable Filter Options Body */}
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            <DiscoverSidebar
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

export default DiscoverMobileFilterDrawer;
