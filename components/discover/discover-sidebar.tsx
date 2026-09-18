"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Search,
  RotateCcw,
  SlidersHorizontal,
  X,
  Loader2,
  Tv,
  Calendar,
  Sparkles,
  Tag,
  Clock,
  Globe,
  ShieldCheck,
  Star,
  Users,
  ArrowDownUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { cn } from "@/lib/utils";

export interface DiscoverSidebarProps {
  activeFilters: DiscoverFilterState;
  onApplyFilters: (filters: DiscoverFilterState) => void;
  onResetFilters: () => void;
  className?: string;
}

export function DiscoverSidebar({
  activeFilters,
  onApplyFilters,
  onResetFilters,
  className,
}: DiscoverSidebarProps) {
  // Pending local state: changed by user, only applied when clicking "Search" button!
  const [pendingFilters, setPendingFilters] =
    useState<DiscoverFilterState>(activeFilters);

  // Keyword search input state
  const [keywordInput, setKeywordInput] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [isKeywordDropdownOpen, setIsKeywordDropdownOpen] = useState(false);
  const keywordContainerRef = useRef<HTMLDivElement>(null);

  // Sync pendingFilters whenever activeFilters in URL change externally
  useEffect(() => {
    setPendingFilters(activeFilters);
  }, [activeFilters]);

  // Debounce keyword query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keywordInput.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [keywordInput]);

  // Query TMDB keywords
  const { data: keywordResults, isLoading: isSearchingKeywords } =
    useKeywordSearchQuery(debouncedKeyword);

  // Close keyword dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        keywordContainerRef.current &&
        !keywordContainerRef.current.contains(e.target as Node)
      ) {
        setIsKeywordDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pendingActiveCount = countActiveFilters(pendingFilters);

  const handleApply = () => {
    onApplyFilters(pendingFilters);
  };

  const handleReset = () => {
    setPendingFilters(DEFAULT_DISCOVER_FILTERS);
    setKeywordInput("");
    onResetFilters();
  };

  // Genre toggle
  const toggleGenre = (genreIdStr: string) => {
    setPendingFilters((prev) => {
      const exists = prev.with_genres.includes(genreIdStr);
      const updated = exists
        ? prev.with_genres.filter((id) => id !== genreIdStr)
        : [...prev.with_genres, genreIdStr];
      return { ...prev, with_genres: updated };
    });
  };

  // Keyword add/remove
  const addKeyword = (kw: { id: number; name: string }) => {
    if (!pendingFilters.keywords.some((k) => k.id === kw.id)) {
      setPendingFilters((prev) => ({
        ...prev,
        keywords: [...prev.keywords, kw],
      }));
    }
    setKeywordInput("");
    setIsKeywordDropdownOpen(false);
  };

  const removeKeyword = (id: number) => {
    setPendingFilters((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k.id !== id),
    }));
  };

  // Watch provider toggle
  const toggleProvider = (providerId: number) => {
    setPendingFilters((prev) => {
      const exists = prev.watch_providers.includes(providerId);
      const updated = exists
        ? prev.watch_providers.filter((id) => id !== providerId)
        : [...prev.watch_providers, providerId];
      return { ...prev, watch_providers: updated };
    });
  };

  return (
    <aside
      className={cn(
        "space-y-6 text-sm", // Clean minimalist design, directly on the background
        className
      )}
    >
      {/* Top Search & Reset Action Bar (Submit button on top, zero layout shift) */}
      <div className="flex items-center gap-2 border-b border-border/50 pb-4">
        <Button
          onClick={handleApply}
          size="default"
          className="flex-1 gap-2 rounded-xl font-medium shadow-sm transition-all"
        >
          <Search className="size-4" />
          <span>
            {pendingActiveCount > 0
              ? `Search (${pendingActiveCount} active)`
              : "Search Movies"}
          </span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleReset}
          disabled={pendingActiveCount === 0}
          title="Reset all filters"
          aria-label="Reset all filters"
          className="size-9 shrink-0 rounded-xl transition-opacity disabled:opacity-40"
        >
          <RotateCcw className="size-4" />
        </Button>
      </div>

      {/* 1. SORT SECTION (With Icon) */}
      <div className="space-y-2.5 border-b border-border/40 pb-4">
        <label className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          <ArrowDownUp className="size-3.5 text-primary/80" />
          <span>Sort Results By</span>
        </label>
        <Select
          value={pendingFilters.sort_by}
          onValueChange={(val) =>
            setPendingFilters((prev) => ({ ...prev, sort_by: val }))
          }
        >
          <SelectTrigger className="w-full rounded-none border-border/60 bg-secondary/40">
            <SelectValue placeholder="Sort movies..." />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 2. KEYWORDS SEARCH */}
      <div className="space-y-2.5 border-b border-border/40 pb-4" ref={keywordContainerRef}>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            <Tag className="size-3.5 text-primary/80" />
            <span>Keywords</span>
          </label>
          {pendingFilters.keywords.length > 0 && (
            <span className="text-[11px] font-medium text-muted-foreground">
              {pendingFilters.keywords.length} selected
            </span>
          )}
        </div>

        <div className="relative">
          <Input
            type="text"
            placeholder="Filter by keyword (e.g. superhero, anime)..."
            value={keywordInput}
            onChange={(e) => {
              setKeywordInput(e.target.value);
              setIsKeywordDropdownOpen(true);
            }}
            onFocus={() => setIsKeywordDropdownOpen(true)}
            className="h-9 rounded-none border-border/60 bg-secondary/40 text-xs placeholder:text-muted-foreground"
          />
          {isSearchingKeywords && (
            <Loader2 className="absolute top-2.5 right-3 size-4 animate-spin text-muted-foreground" />
          )}

          {/* Autocomplete Dropdown */}
          {isKeywordDropdownOpen &&
            keywordInput.trim().length >= 2 &&
            keywordResults &&
            keywordResults.results.length > 0 && (
              <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-none border border-border bg-popover p-1 shadow-lg backdrop-blur-md">
                {keywordResults.results.slice(0, 8).map((kw) => (
                  <li key={kw.id}>
                    <button
                      type="button"
                      onClick={() => addKeyword(kw)}
                      className="flex w-full items-center justify-between rounded-none px-2.5 py-1.5 text-left text-xs hover:bg-accent hover:text-accent-foreground"
                    >
                      <span className="capitalize">{kw.name}</span>
                      <span className="text-[10px] text-muted-foreground">Add</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
        </div>

        {/* Selected Keyword Tags */}
        {pendingFilters.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {pendingFilters.keywords.map((kw) => (
              <span
                key={kw.id}
                className="inline-flex items-center gap-1 rounded-none border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs text-primary"
              >
                <span className="capitalize">{kw.name}</span>
                <button
                  type="button"
                  onClick={() => removeKeyword(kw.id)}
                  className="rounded-none p-0.5 hover:bg-primary/20"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3. FILTERING SYSTEM */}

      {/* Genres */}
      <div className="space-y-2.5 border-b border-border/40 pb-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            <Sparkles className="size-3.5 text-primary/80" />
            <span>Genres</span>
          </label>
          {pendingFilters.with_genres.length > 0 && (
            <span className="text-[11px] font-medium text-primary">
              {pendingFilters.with_genres.length} selected
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {movieGenres.map((g) => {
            const isSelected = pendingFilters.with_genres.includes(String(g.id));
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => toggleGenre(String(g.id))}
                className={cn(
                  "rounded-none px-2.5 py-1 text-xs font-medium transition-all",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary/60 text-secondary-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {g.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Release Dates */}
      <div className="space-y-2.5 border-b border-border/40 pb-4">
        <label className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          <Calendar className="size-3.5 text-primary/80" />
          <span>Release Year</span>
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: "all", label: "All Time" },
            { id: "2026", label: "2026" },
            { id: "2025", label: "2025" },
            { id: "2020-2024", label: "2020s" },
            { id: "2010s", label: "2010s" },
            { id: "classic", label: "Classic" },
          ].map((preset) => {
            const isSelected =
              (pendingFilters.release_date_preset || "all") === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  setPendingFilters((prev) => ({
                    ...prev,
                    release_date_preset: preset.id,
                  }))
                }
                className={cn(
                  "rounded-none px-2 py-1 text-center text-xs font-medium transition-all",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/60 text-secondary-foreground hover:bg-secondary"
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Certification (Content Rating) */}
      <div className="space-y-2.5 border-b border-border/40 pb-4">
        <label className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          <ShieldCheck className="size-3.5 text-primary/80" />
          <span>Certification (US)</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CERTIFICATION_OPTIONS.map((cert) => {
            const isSelected =
              (pendingFilters.certification || "all") === cert;
            return (
              <button
                key={cert}
                type="button"
                onClick={() =>
                  setPendingFilters((prev) => ({
                    ...prev,
                    certification: cert,
                  }))
                }
                className={cn(
                  "rounded-none px-2.5 py-1 text-xs font-medium uppercase transition-all",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/60 text-secondary-foreground hover:bg-secondary"
                )}
              >
                {cert}
              </button>
            );
          })}
        </div>
      </div>

      {/* Language */}
      <div className="space-y-2.5 border-b border-border/40 pb-4">
        <label className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          <Globe className="size-3.5 text-primary/80" />
          <span>Original Language</span>
        </label>
        <Select
          value={pendingFilters.original_language || "all"}
          onValueChange={(val) =>
            setPendingFilters((prev) => ({ ...prev, original_language: val }))
          }
        >
          <SelectTrigger className="w-full rounded-none border-border/60 bg-secondary/40">
            <SelectValue placeholder="All Languages" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGE_OPTIONS.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* User Score (2-way Slider: 0 - 10) */}
      <div className="space-y-3 border-b border-border/40 pb-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            <Star className="size-3.5 fill-primary text-primary" />
            <span>User Score</span>
          </label>
          <span className="text-[11px] font-medium text-foreground">
            {pendingFilters.vote_average_gte === 0 &&
            pendingFilters.vote_average_lte === 10
              ? "Any (0 - 10)"
              : `${pendingFilters.vote_average_gte} - ${pendingFilters.vote_average_lte} ★`}
          </span>
        </div>
        <div className="px-1 pt-1">
          <Slider
            min={0}
            max={10}
            step={0.5}
            value={[
              pendingFilters.vote_average_gte,
              pendingFilters.vote_average_lte,
            ]}
            onValueChange={([min, max]) =>
              setPendingFilters((prev) => ({
                ...prev,
                vote_average_gte: min,
                vote_average_lte: max,
              }))
            }
          />
          <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
            <span>0</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>
      </div>

      {/* Minimum User Votes (1-way Slider: 0 - 500) */}
      <div className="space-y-3 border-b border-border/40 pb-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            <Users className="size-3.5 text-primary/80" />
            <span>Minimum Votes</span>
          </label>
          <span className="text-[11px] font-medium text-foreground">
            {pendingFilters.vote_count_gte === 0
              ? "Any (0)"
              : `${pendingFilters.vote_count_gte}+ votes`}
          </span>
        </div>
        <div className="px-1 pt-1">
          <Slider
            min={0}
            max={500}
            step={25}
            value={[pendingFilters.vote_count_gte]}
            onValueChange={([val]) =>
              setPendingFilters((prev) => ({
                ...prev,
                vote_count_gte: val,
              }))
            }
          />
          <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
            <span>0</span>
            <span>100</span>
            <span>250</span>
            <span>500+</span>
          </div>
        </div>
      </div>

      {/* Runtime (2-way Slider: 0 - 360 min) */}
      <div className="space-y-3 border-b border-border/40 pb-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            <Clock className="size-3.5 text-primary/80" />
            <span>Runtime</span>
          </label>
          <span className="text-[11px] font-medium text-foreground">
            {pendingFilters.with_runtime_gte === 0 &&
            pendingFilters.with_runtime_lte === 360
              ? "Any (0 - 360m)"
              : `${pendingFilters.with_runtime_gte}m - ${pendingFilters.with_runtime_lte}m`}
          </span>
        </div>
        <div className="px-1 pt-1">
          <Slider
            min={0}
            max={360}
            step={15}
            value={[
              pendingFilters.with_runtime_gte,
              pendingFilters.with_runtime_lte,
            ]}
            onValueChange={([min, max]) =>
              setPendingFilters((prev) => ({
                ...prev,
                with_runtime_gte: min,
                with_runtime_lte: max,
              }))
            }
          />
          <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
            <span>0m</span>
            <span>90m</span>
            <span>180m</span>
            <span>360m</span>
          </div>
        </div>
      </div>

      {/* 4. WHERE TO WATCH SECTION */}
      <div className="space-y-3 pb-6">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            <Tv className="size-3.5 text-primary/80" />
            <span>Where to Watch</span>
          </label>
          {pendingFilters.watch_providers.length > 0 && (
            <span className="text-[11px] font-medium text-primary">
              {pendingFilters.watch_providers.length} services
            </span>
          )}
        </div>

        {/* Region */}
        <Select
          value={pendingFilters.watch_region || "US"}
          onValueChange={(val) =>
            setPendingFilters((prev) => ({ ...prev, watch_region: val }))
          }
        >
          <SelectTrigger className="w-full rounded-none border-border/60 bg-secondary/40 text-xs">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            {WATCH_REGION_OPTIONS.map((reg) => (
              <SelectItem key={reg.value} value={reg.value}>
                {reg.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Streaming Providers Grid */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          {TOP_WATCH_PROVIDERS.map((provider) => {
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
                  "group relative flex aspect-square flex-col items-center justify-center rounded-none border p-1 transition-all",
                  isSelected
                    ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary"
                    : "border-border/60 bg-secondary/30 hover:border-border hover:bg-secondary/60"
                )}
              >
                <div className="relative size-8 overflow-clip rounded-none">
                  <Image
                    src={`https://image.tmdb.org/t/p/w92${provider.logo}`}
                    alt={provider.name}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
                <span className="mt-1 line-clamp-1 text-[9px] font-medium text-muted-foreground group-hover:text-foreground">
                  {provider.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky / Bottom Search Button */}
      <div className="pt-2">
        <Button
          onClick={handleApply}
          size="default"
          className="w-full gap-2 rounded-none font-medium shadow-md"
        >
          <Search className="size-4" />
          <span>
            {pendingActiveCount > 0
              ? `Apply & Search (${pendingActiveCount})`
              : "Search Movies"}
          </span>
        </Button>
      </div>
    </aside>
  );
}

export default DiscoverSidebar;
