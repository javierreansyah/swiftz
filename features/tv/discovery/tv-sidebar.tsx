"use client";
import React, { useState, useEffect } from "react";
import { Search, Star, ArrowDownUp, Calendar, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  type TVFilterState,
  DEFAULT_TV_FILTERS,
  TV_GENRES,
  TV_SORT_OPTIONS,
} from "@/features/tv/discovery/types";
import {
  FilterSectionHeader,
  MultiSelectBadges,
  FilterSelect,
  FilterSlider,
  FilterStickyActionBar,
} from "@/features/media/components/filter-sidebar-primitives";
import { cn } from "@/lib/utils";
export interface TVSidebarProps {
  activeFilters: TVFilterState;
  onApplyFilters: (filters: TVFilterState) => void;
  onResetFilters: () => void;
  className?: string;
}

const TV_GENRE_ITEMS = TV_GENRES.map((g) => ({
  id: g.id,
  label: g.name,
}));

const TV_YEAR_PRESET_ITEMS = [
  { id: "", label: "All Years" },
  { id: "2026", label: "2026" },
  { id: "2025", label: "2025" },
  { id: "2024", label: "2024" },
  { id: "2023", label: "2023" },
  { id: "2020", label: "2020" },
];

export function TVSidebar({
  activeFilters,
  onApplyFilters,
  onResetFilters,
  className,
}: TVSidebarProps) {
  const [pendingFilters, setPendingFilters] =
    useState<TVFilterState>(activeFilters);

  useEffect(() => {
    setPendingFilters(activeFilters);
  }, [activeFilters]);

  const countActiveFilters = (filters: TVFilterState) => {
    let count = 0;
    if (filters.sort_by !== DEFAULT_TV_FILTERS.sort_by) count++;
    if (filters.with_genres.length > 0) count += filters.with_genres.length;
    if (filters.first_air_date_year) count++;
    if (filters.vote_average_gte > 0) count++;
    return count;
  };

  const pendingActiveCount = countActiveFilters(pendingFilters);

  const handleApply = () => {
    onApplyFilters(pendingFilters);
  };

  const handleReset = () => {
    setPendingFilters(DEFAULT_TV_FILTERS);
    onResetFilters();
  };

  const handleSortChange = (newSort: string) => {
    setPendingFilters((prev) => ({ ...prev, sort_by: newSort }));
  };

  const handleToggleGenre = (genreId: string) => {
    setPendingFilters((prev) => {
      const current = prev.with_genres;
      const exists = current.includes(genreId);
      const updated = exists
        ? current.filter((id) => id !== genreId)
        : [...current, genreId];
      return { ...prev, with_genres: updated };
    });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPendingFilters((prev) => ({ ...prev, first_air_date_year: val }));
  };

  return (
    <aside className={cn("space-y-6 pb-4 text-sm", className)}>
      {/* 1. Sort Section */}
      <div className="space-y-3 border-b border-border/40 pb-4">
        <FilterSectionHeader icon={ArrowDownUp} title="Sort Results By" />
        <FilterSelect
          value={pendingFilters.sort_by}
          onChange={handleSortChange}
          options={TV_SORT_OPTIONS}
          placeholder="Sort TV shows..."
        />
      </div>

      {/* 2. TV Genres (Multi-Select using Shadcn Badge pattern) */}
      <div className="space-y-3 border-b border-border/40 pb-4">
        <FilterSectionHeader
          icon={Sparkles}
          title="Genres"
          selectedCount={pendingFilters.with_genres.length}
        />
        <MultiSelectBadges
          items={TV_GENRE_ITEMS}
          selectedIds={pendingFilters.with_genres}
          onToggle={handleToggleGenre}
        />
      </div>

      {/* 3. First Air Year */}
      <div className="space-y-3 border-b border-border/40 pb-4">
        <FilterSectionHeader
          icon={Calendar}
          title="First Air Year"
          badge={pendingFilters.first_air_date_year || undefined}
        />
        <MultiSelectBadges
          items={TV_YEAR_PRESET_ITEMS}
          selectedIds={[pendingFilters.first_air_date_year || ""]}
          onToggle={(id) =>
            setPendingFilters((prev) => ({
              ...prev,
              first_air_date_year: id,
            }))
          }
        />
        <Input
          type="text"
          placeholder="Or enter custom year (e.g. 2018)..."
          value={pendingFilters.first_air_date_year || ""}
          onChange={handleYearChange}
        />
      </div>

      {/* 4. Minimum User Rating */}
      <div className="space-y-3 pb-2">
        <FilterSectionHeader
          icon={Star}
          title="Minimum Rating"
          badge={
            pendingFilters.vote_average_gte === 0 ? (
              "Any Rating"
            ) : (
              <span className="flex items-center gap-1 font-bold text-primary">
                <Star className="size-3 fill-current" />
                {pendingFilters.vote_average_gte}+
              </span>
            )
          }
        />
        <FilterSlider
          value={[pendingFilters.vote_average_gte]}
          onChange={([val]) =>
            setPendingFilters((prev) => ({
              ...prev,
              vote_average_gte: val,
            }))
          }
          min={0}
          max={10}
          step={1}
          ticks={[0, 5, 10]}
        />
      </div>

      {/* Sticky Bottom Search & Reset Action Bar */}
      <FilterStickyActionBar
        onApply={handleApply}
        onReset={handleReset}
        activeCount={pendingActiveCount}
        applyLabel="Search TV Shows"
        searchIcon={Search}
      />
    </aside>
  );
}
