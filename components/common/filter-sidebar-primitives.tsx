"use client";

import React from "react";
import { Check, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// 1. Standardized Section Header with Label & Icon
export interface FilterSectionHeaderProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  selectedCount?: number;
  badge?: React.ReactNode;
  className?: string;
}

export function FilterSectionHeader({
  icon: Icon,
  title,
  selectedCount,
  badge,
  className,
}: FilterSectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <label className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        <Icon className="size-3.5 text-primary" />
        <span>{title}</span>
      </label>

      {selectedCount !== undefined && selectedCount > 0 ? (
        <Badge
          variant="secondary"
          className="rounded-none bg-primary/10 px-1.5 py-0 text-[10px] font-bold text-primary"
        >
          {selectedCount} selected
        </Badge>
      ) : badge !== undefined ? (
        <span className="text-[11px] font-medium text-foreground">{badge}</span>
      ) : null}
    </div>
  );
}

// 2. Standardized Multi-Select Badges (Shadcn Badge style)
export interface MultiSelectItem {
  id: string;
  label: string;
}

export interface MultiSelectBadgesProps {
  items: MultiSelectItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  className?: string;
}

export function MultiSelectBadges({
  items,
  selectedIds,
  onToggle,
  className,
}: MultiSelectBadgesProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((item) => {
        const isSelected = selectedIds.includes(item.id);
        return (
          <Badge
            key={item.id}
            variant={isSelected ? "default" : "outline"}
            onClick={() => onToggle(item.id)}
            className={cn(
              "h-7 cursor-pointer px-2.5 py-1 text-xs font-medium transition-all select-none",
              isSelected
                ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                : "border-border/70 bg-card text-muted-foreground hover:border-primary/50 hover:bg-muted/40 hover:text-foreground"
            )}
          >
            {isSelected && <Check className="stroke-2.5 mr-1 size-3" />}
            <span>{item.label}</span>
          </Badge>
        );
      })}
    </div>
  );
}

// 3. Standardized Dropdown Select
export interface FilterSelectOption {
  value: string;
  label: string;
}

export interface FilterSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: FilterSelectOption[];
  placeholder?: string;
  className?: string;
}

export function FilterSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className,
}: FilterSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "w-full rounded-none border-border/70 bg-card text-xs transition-colors hover:border-border",
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// 4. Standardized Slider Modality
export interface FilterSliderProps {
  value: number[];
  onChange: (vals: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  ticks?: (string | number)[];
  className?: string;
}

export function FilterSlider({
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  ticks = [0, 5, 10],
  className,
}: FilterSliderProps) {
  return (
    <div className={cn("space-y-1.5 px-0.5 pt-1", className)}>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={onChange}
        className="w-full"
      />
      {ticks.length > 0 && (
        <div className="flex justify-between text-[10px] text-muted-foreground">
          {ticks.map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// 5. Standardized Sticky Bottom Action Bar
export interface FilterStickyActionBarProps {
  onApply: () => void;
  onReset: () => void;
  activeCount: number;
  applyLabel?: string;
  searchIcon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function FilterStickyActionBar({
  onApply,
  onReset,
  activeCount,
  applyLabel = "Search",
  searchIcon: SearchIcon,
  className,
}: FilterStickyActionBarProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-10 -mx-1 flex items-center gap-2 border-t border-border/70 bg-background/95 pt-3 pb-2 backdrop-blur-md",
        className
      )}
    >
      <Button
        onClick={onApply}
        size="default"
        className="flex-1 gap-2 rounded-none font-semibold shadow-sm"
      >
        {SearchIcon && <SearchIcon className="size-4" />}
        <span>
          {activeCount > 0
            ? `${applyLabel} (${activeCount})`
            : applyLabel}
        </span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={onReset}
        disabled={activeCount === 0}
        title="Reset all filters"
        aria-label="Reset all filters"
        className="shrink-0 rounded-none border-border/70 transition-opacity disabled:opacity-40"
      >
        <RotateCcw className="size-4" />
      </Button>
    </div>
  );
}
