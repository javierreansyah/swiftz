"use client";

import React from "react";
import { FilterMobileDrawer } from "@/components/common/filter-mobile-drawer";
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
  const activeCount = countActiveFilters(activeFilters);

  return (
    <FilterMobileDrawer title="Filter & Sort Movies" activeCount={activeCount}>
      {({ close }) => (
        <DiscoverSidebar
          activeFilters={activeFilters}
          onApplyFilters={(filters) => {
            onApplyFilters(filters);
            close();
          }}
          onResetFilters={() => {
            onResetFilters();
            close();
          }}
        />
      )}
    </FilterMobileDrawer>
  );
}

export default DiscoverMobileFilterDrawer;
