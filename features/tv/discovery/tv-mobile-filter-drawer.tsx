"use client";
import { FilterMobileDrawer } from "@/features/media/components/filter-mobile-drawer";
import { TVSidebar } from "@/features/tv/discovery/tv-sidebar";
import {
  DEFAULT_TV_FILTERS,
  type TVFilterState,
} from "@/features/tv/discovery/types";
import { countTVFilters } from "@/features/tv/discovery/filter-utils";
export interface TVMobileFilterDrawerProps {
  defaultFilters?: TVFilterState;
  activeFilters: TVFilterState;
  onApplyFilters: (filters: TVFilterState) => void;
  onResetFilters: () => void;
}

export function TVMobileFilterDrawer({
  defaultFilters = DEFAULT_TV_FILTERS,
  activeFilters,
  onApplyFilters,
  onResetFilters,
}: TVMobileFilterDrawerProps) {
  const activeCount = countTVFilters(activeFilters, defaultFilters);

  return (
    <FilterMobileDrawer
      title="Filter & Sort TV Shows"
      activeCount={activeCount}
    >
      {({ close }) => (
        <TVSidebar
          defaultFilters={defaultFilters}
          activeFilters={activeFilters}
          bareActions
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
