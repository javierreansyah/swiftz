"use client";

import React from "react";
import { FilterMobileDrawer } from "@/components/common/filter-mobile-drawer";
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
  const activeCount =
    activeFilters.with_genres.length +
    (activeFilters.first_air_date_year ? 1 : 0) +
    (activeFilters.vote_average_gte > 0 ? 1 : 0) +
    (activeFilters.sort_by !== "popularity.desc" ? 1 : 0);

  return (
    <FilterMobileDrawer title="Filter & Sort TV Shows" activeCount={activeCount}>
      {({ close }) => (
        <TVSidebar
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

export default TVMobileFilterDrawer;
