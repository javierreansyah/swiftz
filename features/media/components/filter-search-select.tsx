"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import type { FilterSelectOption } from "@/features/media/components/filter-sidebar-primitives";
interface FilterSearchSelectProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSelect: (value: string) => void;
  options: FilterSelectOption[];
  placeholder: string;
  isLoading?: boolean;
  minQueryLength?: number;
}

export function FilterSearchSelect({
  query,
  onQueryChange,
  onSelect,
  options,
  placeholder,
  isLoading = false,
  minQueryLength = 2,
}: FilterSearchSelectProps) {
  const [open, setOpen] = useState(false);
  const canSearch = query.trim().length >= minQueryLength;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            leadingIcon
            type="text"
            value={query}
            onChange={(e) => {
              onQueryChange(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            aria-label={placeholder}
            role="combobox"
            aria-expanded={open}
            aria-autocomplete="list"
          />
        </div>
      </PopoverAnchor>
      <PopoverContent surface="command" align="start" aria-label={placeholder}>
        <Command shouldFilter={false}>
          <CommandList aria-busy={isLoading}>
            <CommandEmpty>
              {isLoading ? "Searching..." : "No results found."}
            </CommandEmpty>
            {canSearch && !isLoading && (
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      onSelect(option.value);
                      setOpen(false);
                    }}
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
