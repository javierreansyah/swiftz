"use client";

import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
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
              <span>Filter & Sort Movies</span>
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

        <SheetContent
          side="left"
          className="w-[85vw] max-w-sm overflow-y-auto p-5"
        >
          <SheetHeader className="mb-4">
            <SheetTitle className="font-heading text-lg font-bold">
              Filter & Sort
            </SheetTitle>
          </SheetHeader>

          <DiscoverSidebar
            activeFilters={activeFilters}
            onApplyFilters={handleApply}
            onResetFilters={handleReset}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default DiscoverMobileFilterDrawer;
