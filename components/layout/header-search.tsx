"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, X, CornerDownLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface HeaderSearchProps {
  className?: string;
  isScrolled?: boolean;
  isMovieDetailPage?: boolean;
}

export function HeaderSearch({
  className,
  isScrolled = false,
  isMovieDetailPage = false,
}: HeaderSearchProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Sync with current query if on /search page (client-side only to prevent SSR bailouts)
  useEffect(() => {
    if (pathname === "/search") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q") || "";
      setSearchQuery(q);
    } else {
      setSearchQuery("");
    }
  }, [pathname]);

  // Focus mobile input when sheet opens
  useEffect(() => {
    if (isMobileOpen) {
      const timer = setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isMobileOpen]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setIsMobileOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}&page=1`);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className={cn("flex items-center", className)}>
      {/* Desktop Inline Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="relative hidden items-center md:flex"
      >
        <div className="relative flex w-52 items-center transition-all duration-300 focus-within:w-72 lg:w-64 lg:focus-within:w-80">
          <Search
            className={cn(
              "pointer-events-none absolute left-3 size-4 transition-colors",
              !isScrolled && isMovieDetailPage
                ? "text-white/70"
                : "text-muted-foreground"
            )}
          />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies..."
            aria-label="Search movies"
            className={cn(
              "h-9 w-full rounded-none pr-8 pl-9 text-sm transition-all duration-200 focus-visible:ring-1 focus-visible:ring-primary",
              !isScrolled && isMovieDetailPage
                ? "border-white/20 bg-black/30 text-white placeholder:text-white/60 focus:border-white/40 focus:bg-black/50"
                : "border-border/60 bg-muted/40 text-foreground placeholder:text-muted-foreground hover:bg-muted/70 focus:bg-background"
            )}
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-2.5 rounded-none p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          ) : (
            <span
              className={cn(
                "pointer-events-none absolute right-2.5 hidden rounded-none border px-1.5 py-0.5 text-[10px] font-medium select-none lg:inline-block",
                !isScrolled && isMovieDetailPage
                  ? "border-white/20 text-white/50"
                  : "border-border/60 text-muted-foreground/70"
              )}
            >
              ⌘K
            </span>
          )}
        </div>
      </form>

      {/* Mobile Search Button Trigger */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Search movies"
        className={cn(
          "size-9 md:hidden",
          !isScrolled && isMovieDetailPage
            ? "text-white hover:bg-white/10 hover:text-white"
            : "text-foreground hover:bg-accent"
        )}
      >
        <Search className="size-5" />
      </Button>

      {/* Mobile Search Sheet From Top */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent
          side="top"
          className="border-b border-border/80 bg-background/95 p-4 pt-5 pb-6 backdrop-blur-xl"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Search Movies</SheetTitle>
          </SheetHeader>

          <form onSubmit={handleSearchSubmit} className="mx-auto max-w-xl space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={mobileInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search titles, actors, or keywords..."
                  aria-label="Search query"
                  className="h-11 rounded-none border-border bg-secondary/50 pr-9 pl-10 text-base focus-visible:ring-1 focus-visible:ring-primary"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
              <Button type="submit" size="default" className="h-11 gap-1.5 rounded-none px-4 font-medium">
                <span>Search</span>
                <CornerDownLeft className="size-3.5" />
              </Button>
            </div>
            <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
              <span>Press enter to search across all movies</span>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="hover:underline"
              >
                Cancel
              </button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default HeaderSearch;
