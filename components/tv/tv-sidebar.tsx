"use client";

import React from "react";
import { RotateCcw, SlidersHorizontal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  TVFilterState,
  DEFAULT_TV_FILTERS,
  TV_GENRES,
  TV_SORT_OPTIONS,
} from "./types";

export interface TVSidebarProps {
  activeFilters: TVFilterState;
  onApplyFilters: (filters: TVFilterState) => void;
  onResetFilters: () => void;
}

export function TVSidebar({
  activeFilters,
  onApplyFilters,
  onResetFilters,
}: TVSidebarProps) {
  const handleSortChange = (newSort: string) => {
    onApplyFilters({ ...activeFilters, sort_by: newSort });
  };

  const handleToggleGenre = (genreId: string) => {
    const current = activeFilters.with_genres;
    const exists = current.includes(genreId);
    const updated = exists
      ? current.filter((id) => id !== genreId)
      : [...current, genreId];
    onApplyFilters({ ...activeFilters, with_genres: updated });
  };

  const handleRatingChange = (vals: number[]) => {
    onApplyFilters({ ...activeFilters, vote_average_gte: vals[0] });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    onApplyFilters({ ...activeFilters, first_air_date_year: val });
  };

  return (
    <aside className="space-y-6 pb-8">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-primary" />
          <h2 className="text-base font-bold text-foreground">TV Filters</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          className="h-8 gap-1 rounded-none px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="size-3" />
          <span>Reset</span>
        </Button>
      </div>

      {/* Sort Section */}
      <div className="space-y-2">
        <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Sort Results By
        </label>
        <Select
          value={activeFilters.sort_by}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-full rounded-none bg-card text-xs">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            {TV_SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year Section */}
      <div className="space-y-2">
        <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
          First Air Year
        </label>
        <Input
          type="text"
          placeholder="e.g. 2024"
          value={activeFilters.first_air_date_year || ""}
          onChange={handleYearChange}
          className="h-9 rounded-none bg-card text-xs"
        />
      </div>

      {/* Minimum Rating Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold tracking-wider text-muted-foreground uppercase">
            Minimum Rating
          </span>
          <span className="flex items-center gap-1 font-bold text-primary">
            <Star className="size-3 fill-current" />
            {activeFilters.vote_average_gte}
          </span>
        </div>
        <Slider
          value={[activeFilters.vote_average_gte]}
          onValueChange={handleRatingChange}
          min={0}
          max={10}
          step={1}
          className="w-full"
        />
      </div>

      {/* TV Genres Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
            Genres
          </label>
          {activeFilters.with_genres.length > 0 && (
            <span className="text-[11px] font-semibold text-primary">
              {activeFilters.with_genres.length} selected
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TV_GENRES.map((genre) => {
            const isSelected = activeFilters.with_genres.includes(genre.id);
            return (
              <button
                key={genre.id}
                type="button"
                onClick={() => handleToggleGenre(genre.id)}
                className={`rounded-none border px-2.5 py-1 text-xs font-medium transition-colors ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/80 bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {genre.name}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export default TVSidebar;
