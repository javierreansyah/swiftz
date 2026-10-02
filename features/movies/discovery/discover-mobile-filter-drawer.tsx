"use client";
import { FilterMobileDrawer } from "@/features/media/components/filter-mobile-drawer";
import { DiscoverSidebar } from "@/features/movies/discovery/discover-sidebar";
import {
  DEFAULT_DISCOVER_FILTERS,
  type DiscoverFilterState,
} from "@/features/movies/discovery/types";
import { countActiveFilters } from "@/features/movies/discovery/filter-utils";
export interface DiscoverMobileFilterDrawerProps {
  defaultFilters?: DiscoverFilterState;
  activeFilters: DiscoverFilterState;
  onApplyFilters: (filters: DiscoverFilterState) => void;
  onResetFilters: () => void;
}

export function DiscoverMobileFilterDrawer({
  defaultFilters = DEFAULT_DISCOVER_FILTERS,
  activeFilters,
  onApplyFilters,
  onResetFilters,
}: DiscoverMobileFilterDrawerProps) {
  const activeCount = countActiveFilters(activeFilters, defaultFilters);

  return (
    <FilterMobileDrawer title="Filter & Sort Movies" activeCount={activeCount}>
      {({ close }) => (
        <DiscoverSidebar
          defaultFilters={defaultFilters}
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
