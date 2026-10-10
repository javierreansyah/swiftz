"use client";
import { FilterMobileDrawer } from "@/features/media/components/filter-mobile-drawer";
import { TVSidebar } from "@/features/tv/discovery/tv-sidebar";
import type { TVFilterState } from "@/features/tv/discovery/types";
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
  const activeCount =
    activeFilters.with_genres.length +
    (activeFilters.first_air_date_year ? 1 : 0) +
    (activeFilters.vote_average_gte > 0 ? 1 : 0) +
    (activeFilters.sort_by !== "popularity.desc" ? 1 : 0);

  return (
    <FilterMobileDrawer
      title="Filter & Sort TV Shows"
      activeCount={activeCount}
    >
      {({ close }) => (
        <TVSidebar
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
