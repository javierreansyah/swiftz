"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import Image from "@/components/ui/image";
import {
  Search,
  SlidersHorizontal,
  X,
  Tv,
  Calendar,
  Sparkles,
  Tag,
  Globe,
  ShieldCheck,
  Star,
  Users,
  ArrowDownUp,
} from "lucide-react";
import { FilterSearchSelect } from "@/components/common/filter-search-select";
import movieGenres from "@/public/data/genres";
import { useKeywordSearchQuery } from "@/hooks/use-tmdb";
import {
  DiscoverFilterState,
  DEFAULT_DISCOVER_FILTERS,
  SORT_OPTIONS,
  CERTIFICATION_OPTIONS,
  LANGUAGE_OPTIONS,
  WATCH_REGION_OPTIONS,
  TOP_WATCH_PROVIDERS,
} from "./types";
import { countActiveFilters } from "./filter-utils";
import {
  FilterSectionHeader,
  MultiSelectBadges,
  FilterSelect,
  FilterSlider,
  FilterStickyActionBar,
} from "@/components/common/filter-sidebar-primitives";
import { cn } from "@/lib/utils";

export interface DiscoverSidebarProps {
  activeFilters: DiscoverFilterState;
  onApplyFilters: (filters: DiscoverFilterState) => void;
  onResetFilters: () => void;
  className?: string;
}

const MOVIE_GENRE_ITEMS = movieGenres.map((g) => ({
  id: String(g.id),
  label: g.name,
}));

const RELEASE_PRESET_ITEMS = [
  { id: "all", label: "All Time" },
  { id: "2026", label: "2026" },
  { id: "2025", label: "2025" },
  { id: "2020-2024", label: "2020s" },
  { id: "2010s", label: "2010s" },
  { id: "classic", label: "Classic" },
];

const CERT_ITEMS = CERTIFICATION_OPTIONS.map((c) => ({
  id: c,
  label: c === "all" ? "All Ratings" : c,
}));

export function DiscoverSidebar({
  activeFilters,
  onApplyFilters,
  onResetFilters,
  className,
}: DiscoverSidebarProps) {
  const [pendingFilters, setPendingFilters] =
    useState<DiscoverFilterState>(activeFilters);

  const [keywordInput, setKeywordInput] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  useEffect(() => {
    setPendingFilters(activeFilters);
  }, [activeFilters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keywordInput.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [keywordInput]);

  const { data: keywordResults, isLoading: isSearchingKeywords } =
    useKeywordSearchQuery(debouncedKeyword);

  const pendingActiveCount = countActiveFilters(pendingFilters);

  const handleApply = () => {
    onApplyFilters(pendingFilters);
  };

  const handleReset = () => {
    setPendingFilters(DEFAULT_DISCOVER_FILTERS);
    setKeywordInput("");
    onResetFilters();
  };

  const toggleGenre = (genreIdStr: string) => {
    setPendingFilters((prev) => {
      const exists = prev.with_genres.includes(genreIdStr);
      const updated = exists
        ? prev.with_genres.filter((id) => id !== genreIdStr)
        : [...prev.with_genres, genreIdStr];
      return { ...prev, with_genres: updated };
    });
  };

  const addKeyword = (kw: { id: number; name: string }) => {
    if (!pendingFilters.keywords.some((k) => k.id === kw.id)) {
      setPendingFilters((prev) => ({
        ...prev,
        keywords: [...prev.keywords, kw],
      }));
    }
    setKeywordInput("");
  };

  const removeKeyword = (id: number) => {
    setPendingFilters((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k.id !== id),
    }));
  };

  const toggleProvider = (providerId: number) => {
    setPendingFilters((prev) => {
      const exists = prev.watch_providers.includes(providerId);
      const updated = exists
        ? prev.watch_providers.filter((id) => id !== providerId)
        : [...prev.watch_providers, providerId];
      return { ...prev, watch_providers: updated };
    });
  };

  const activeProviders = TOP_WATCH_PROVIDERS;

  return (
    <aside className={cn("space-y-6 pb-4 text-sm", className)}>
      {/* 1. Sort Section */}
      <div className="space-y-3 border-b border-border/40 pb-4">
        <FilterSectionHeader icon={ArrowDownUp} title="Sort Results By" />
        <FilterSelect
          value={pendingFilters.sort_by}
          onChange={(val) =>
            setPendingFilters((prev) => ({ ...prev, sort_by: val }))
          }
          options={SORT_OPTIONS}
          placeholder="Sort movies..."
        />
      </div>

      {/* 2. Keywords Search */}
      <div
        className="space-y-3 border-b border-border/40 pb-4"
      >
        <FilterSectionHeader
          icon={Tag}
          title="Keywords"
          selectedCount={pendingFilters.keywords.length}
        />

        <FilterSearchSelect
          query={keywordInput}
          onQueryChange={setKeywordInput}
          placeholder="Search keywords..."
          isLoading={isSearchingKeywords || keywordInput.trim() !== debouncedKeyword}
          options={(keywordResults?.results || []).slice(0, 8).map((kw) => ({
            value: String(kw.id),
            label: kw.name,
          }))}
          onSelect={(value) => {
            const keyword = keywordResults?.results.find((kw) => String(kw.id) === value);
            if (keyword) addKeyword(keyword);
          }}
        />

        {pendingFilters.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {pendingFilters.keywords.map((kw) => (
              <Badge variant="soft" size="filter"
                key={kw.id}
              >
                <span className="capitalize">{kw.name}</span>
                <Button variant="default" size="icon-xs"
                  type="button"
                  onClick={() => removeKeyword(kw.id)}
                >
                  <X className="size-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* 3. Genres (Multi-Select using Shadcn Badge pattern) */}
      <div className="space-y-3 border-b border-border/40 pb-4">
        <FilterSectionHeader
          icon={Sparkles}
          title="Genres"
          selectedCount={pendingFilters.with_genres.length}
        />
        <MultiSelectBadges
          items={MOVIE_GENRE_ITEMS}
          selectedIds={pendingFilters.with_genres}
          onToggle={toggleGenre}
        />
      </div>

      {/* 4. Release Year Presets */}
      <div className="space-y-3 border-b border-border/40 pb-4">
        <FilterSectionHeader icon={Calendar} title="Release Year" />
        <MultiSelectBadges
          items={RELEASE_PRESET_ITEMS}
          selectedIds={[pendingFilters.release_date_preset || "all"]}
          onToggle={(id) =>
            setPendingFilters((prev) => ({
              ...prev,
              release_date_preset: id,
            }))
          }
        />
      </div>

      {/* 5. Certification (US Content Rating) */}
      <div className="space-y-3 border-b border-border/40 pb-4">
        <FilterSectionHeader icon={ShieldCheck} title="Certification (US)" />
        <MultiSelectBadges
          items={CERT_ITEMS}
          selectedIds={[pendingFilters.certification || "all"]}
          onToggle={(id) =>
            setPendingFilters((prev) => ({
              ...prev,
              certification: id,
            }))
          }
        />
      </div>

      {/* 6. Original Language */}
      <div className="space-y-3 border-b border-border/40 pb-4">
        <FilterSectionHeader icon={Globe} title="Original Language" />
        <FilterSelect
          value={pendingFilters.original_language || "all"}
          onChange={(val) =>
            setPendingFilters((prev) => ({ ...prev, original_language: val }))
          }
          options={LANGUAGE_OPTIONS}
          placeholder="All Languages"
        />
      </div>

      {/* 7. User Score Slider (0 - 10) */}
      <div className="space-y-3 border-b border-border/40 pb-4">
        <FilterSectionHeader
          icon={Star}
          title="User Score"
          badge={
            pendingFilters.vote_average_gte === 0 &&
            pendingFilters.vote_average_lte === 10
              ? "Any (0 - 10)"
              : `${pendingFilters.vote_average_gte} - ${pendingFilters.vote_average_lte} ★`
          }
        />
        <FilterSlider
          min={0}
          max={10}
          step={0.5}
          value={[
            pendingFilters.vote_average_gte,
            pendingFilters.vote_average_lte,
          ]}
          onChange={([min, max]) =>
            setPendingFilters((prev) => ({
              ...prev,
              vote_average_gte: min,
              vote_average_lte: max,
            }))
          }
          ticks={[0, 5, 10]}
        />
      </div>

      {/* 8. Minimum Votes */}
      <div className="space-y-3 border-b border-border/40 pb-4">
        <FilterSectionHeader
          icon={Users}
          title="Minimum Votes"
          badge={
            pendingFilters.vote_count_gte === 0
              ? "Any (0)"
              : `${pendingFilters.vote_count_gte}+ votes`
          }
        />
        <FilterSlider
          min={0}
          max={500}
          step={25}
          value={[pendingFilters.vote_count_gte]}
          onChange={([val]) =>
            setPendingFilters((prev) => ({
              ...prev,
              vote_count_gte: val,
            }))
          }
          ticks={[0, 250, "500+"]}
        />
      </div>

      {/* 9. Watch Providers */}
      <div className="space-y-3 pb-2">
        <FilterSectionHeader
          icon={Tv}
          title="Watch Providers"
          selectedCount={pendingFilters.watch_providers.length}
        />

        <FilterSelect
          value={pendingFilters.watch_region || "US"}
          onChange={(val) =>
            setPendingFilters((prev) => ({ ...prev, watch_region: val }))
          }
          options={WATCH_REGION_OPTIONS}
          placeholder="Select Region"
        />

        <div className="grid grid-cols-4 gap-2 pt-1">
          {activeProviders.map((provider) => {
            const isSelected = pendingFilters.watch_providers.includes(
              provider.id
            );
            return (
              <button
                key={provider.id}
                type="button"
                onClick={() => toggleProvider(provider.id)}
                title={provider.name}
                className={cn(
                  "group relative flex aspect-square flex-col items-center justify-center rounded-xl border p-1 transition-all",
                  isSelected
                    ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary"
                    : "border-border/60 bg-card hover:border-border hover:bg-muted/50"
                )}
              >
                <div className="relative size-8 overflow-clip rounded-xl">
                  <Image
                    src={`https://image.tmdb.org/t/p/w92${provider.logo}`}
                    alt={provider.name}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
                <span className="mt-1 line-clamp-1 text-xs font-medium text-muted-foreground group-hover:text-foreground">
                  {provider.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Standardized Sticky Bottom Search & Reset Action Bar */}
      <FilterStickyActionBar
        onApply={handleApply}
        onReset={handleReset}
        activeCount={pendingActiveCount}
        applyLabel="Search Movies"
        searchIcon={Search}
      />
    </aside>
  );
}

export default DiscoverSidebar;
