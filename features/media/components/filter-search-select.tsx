"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
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
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start"
        >
          <Search />
          <span className="truncate">{placeholder}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent surface="command" align="start" aria-label={placeholder}>
        <Command shouldFilter={false}>
          <CommandInput
            value={query}
            onValueChange={onQueryChange}
            placeholder={placeholder}
            aria-label={placeholder}
          />
          <CommandList aria-busy={isLoading}>
            <CommandEmpty>
              {!canSearch
                ? `Type at least ${minQueryLength} characters.`
                : isLoading
                  ? "Searching..."
                  : "No results found."}
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
