"use client";
import React from "react";
import { Check, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectGroup,
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
        <Badge variant="secondary">{selectedCount} selected</Badge>
      ) : badge !== undefined ? (
        <span className="text-xs font-medium text-foreground">{badge}</span>
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
          <Button
            key={item.id}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            aria-pressed={isSelected}
            onClick={() => onToggle(item.id)}
            className="cursor-pointer select-none"
          >
            {isSelected && <Check className="mr-1 size-3 stroke-2" />}
            <span>{item.label}</span>
          </Button>
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
  ariaLabel?: string;
  fullWidth?: boolean;
  className?: string;
}

export function FilterSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  ariaLabel,
  fullWidth = true,
  className,
}: FilterSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        aria-label={ariaLabel || placeholder}
        className={cn(fullWidth && "w-full", className)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectGroup>
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
        <div className="flex justify-between text-xs text-muted-foreground">
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
        className,
      )}
    >
      <Button onClick={onApply} size="default" className="flex-1">
        {SearchIcon && <SearchIcon className="size-4" />}
        <span>
          {activeCount > 0 ? `${applyLabel} (${activeCount})` : applyLabel}
        </span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={onReset}
        disabled={activeCount === 0}
        title="Reset all filters"
        aria-label="Reset all filters"
        className="shrink-0"
      >
        <RotateCcw className="size-4" />
      </Button>
    </div>
  );
}
