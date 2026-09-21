"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Bookmark,
  Heart,
  Star,
  Share2,
  Check,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMovieNav } from "@/components/providers/movie-nav-provider";

export interface QuickRailSectionItem {
  id: string;
  label: string;
  icon: LucideIcon;
  modal?: string;
}

export interface MediaQuickRailProps {
  sections: QuickRailSectionItem[];
  title: string;
  mediaTypeName?: string;
  isWatchlist: boolean;
  isFavorite: boolean;
  userRating: number | null;
  isWatchlistPending?: boolean;
  isFavoritePending?: boolean;
  onToggleWatchlist: () => void;
  onToggleFavorite: () => void;
  onOpenRating: () => void;
  onOpenModal: (modal: string) => void;
  mode?: "all" | "desktop" | "mobile";
  className?: string;
}

export function MediaQuickRail({
  sections,
  title,
  mediaTypeName = "Media",
  isWatchlist,
  isFavorite,
  userRating,
  isWatchlistPending = false,
  isFavoritePending = false,
  onToggleWatchlist,
  onToggleFavorite,
  onOpenRating,
  onOpenModal,
  mode = "all",
  className,
}: MediaQuickRailProps) {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(
    sections[0]?.id || "section-overview"
  );

  const {
    isOpen: isMobileNavOpen,
    close: closeMobileNav,
    setIsAvailable,
  } = useMovieNav();

  // Register availability on mount
  useEffect(() => {
    setIsAvailable(true);
    return () => {
      setIsAvailable(false);
    };
  }, [setIsAvailable]);

  // Section scroll tracking for active indicator
  useEffect(() => {
    const sectionIds = sections.map((s) => s.id);

    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      let current = sectionIds[0] || "section-overview";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 96; // 64px fixed header + 32px padding
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      closeMobileNav();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /* ----------------- DESKTOP SIDEBAR CONTENT ----------------- */
  const renderDesktopSidebar = () => (
    <div className="flex flex-col space-y-4">
      {/* Navigation Links with continuous vertical bar and active primary indicator */}
      <nav className="relative space-y-1 pl-3">
        {/* Continuous vertical track */}
        <div className="absolute inset-y-1.5 left-0 w-0.5 rounded-none bg-border/40" />

        {sections.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="group relative flex w-full cursor-pointer items-center justify-between py-1.5 text-xs font-semibold select-none"
            >
              {/* Primary colored bar on the activated section */}
              {isActive && (
                <span className="absolute inset-y-0.5 -left-3 w-0.5 rounded-none bg-primary transition-all duration-300" />
              )}

              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "size-3.5 transition-colors duration-200",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground/60 group-hover:text-foreground"
                  )}
                />
                <span
                  className={cn(
                    "transition-colors duration-200",
                    isActive
                      ? "font-bold text-foreground"
                      : "text-muted-foreground/70 group-hover:text-foreground"
                  )}
                >
                  {item.label}
                </span>
              </div>

              {item.modal && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenModal(item.modal!);
                  }}
                  className="flex items-center gap-0.5 rounded-none px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground/60 transition-colors hover:text-primary"
                  title={`Open ${item.label} sheet`}
                >
                  <span>Open</span>
                  <ChevronRight className="size-3" />
                </button>
              )}
            </div>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="space-y-2 border-t border-border/60 pt-3">
        <p className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
          Actions
        </p>

        <div className="grid grid-cols-1 gap-1.5">
          {/* Watchlist button */}
          <Button
            size="sm"
            variant={isWatchlist ? "default" : "outline"}
            onClick={onToggleWatchlist}
            disabled={isWatchlistPending}
            className={cn(
              "h-9 w-full justify-start gap-2.5 rounded-none text-xs font-semibold",
              isWatchlist
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "border-border/70 hover:bg-muted"
            )}
          >
            {isWatchlistPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Bookmark className={cn("size-3.5", isWatchlist && "fill-current")} />
            )}
            <span>{isWatchlist ? "In Watchlist" : "Add to Watchlist"}</span>
          </Button>

          {/* Favorite button */}
          <Button
            size="sm"
            variant={isFavorite ? "default" : "outline"}
            onClick={onToggleFavorite}
            disabled={isFavoritePending}
            className={cn(
              "h-9 w-full justify-start gap-2.5 rounded-none text-xs font-semibold",
              isFavorite
                ? "bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                : "border-border/70 hover:bg-muted"
            )}
          >
            {isFavoritePending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Heart
                className={cn(
                  "size-3.5",
                  isFavorite && "fill-current text-red-500"
                )}
              />
            )}
            <span>{isFavorite ? "In Favorites" : "Add to Favorites"}</span>
          </Button>

          {/* Rate button */}
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenRating}
            className="h-9 w-full justify-start gap-2.5 rounded-none border-border/70 text-xs font-semibold hover:bg-muted"
          >
            <Star
              className={cn(
                "size-3.5",
                userRating ? "fill-primary text-primary" : "text-primary"
              )}
            />
            <span>
              {userRating
                ? `Your Rating: ${userRating}/10`
                : `Rate This ${mediaTypeName}`}
            </span>
          </Button>

          {/* Share button */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleShare}
            className="h-9 w-full justify-start gap-2.5 rounded-none border-border/70 text-xs font-semibold hover:bg-muted"
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-500" />
            ) : (
              <Share2 className="size-3.5" />
            )}
            <span>{copied ? "Copied Link!" : `Share ${mediaTypeName}`}</span>
          </Button>
        </div>
      </div>
    </div>
  );

  /* ----------------- MOBILE 2-COLUMN COLLAPSIBLE CONTENT ----------------- */
  const renderMobileContent = () => (
    <div className="flex flex-col space-y-4">
      {/* 2-Column Section Jumpers with Icon Highlighting */}
      <div className="space-y-2">
        <p className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
          Sections
        </p>

        <div className="grid grid-cols-2 gap-2">
          {sections.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  "active:scale-0.98 flex items-center gap-2.5 rounded-none border p-2.5 text-left text-xs transition-colors select-none",
                  isActive
                    ? "border-primary/50 bg-primary/10 font-bold text-foreground shadow-xs"
                    : "border-border/50 bg-card/40 font-medium text-muted-foreground hover:border-border/80 hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-none transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/70 text-muted-foreground/80"
                  )}
                >
                  <Icon className="size-3.5" />
                </div>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Quick Actions */}
      <div className="space-y-2 border-t border-border/60 pt-3">
        <p className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
          Actions
        </p>

        <div className="grid grid-cols-2 gap-2">
          {/* Watchlist */}
          <Button
            size="sm"
            variant={isWatchlist ? "default" : "outline"}
            onClick={() => {
              onToggleWatchlist();
              closeMobileNav();
            }}
            disabled={isWatchlistPending}
            className={cn(
              "h-9 w-full justify-start gap-2 rounded-none text-xs font-semibold",
              isWatchlist
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "border-border/70 bg-card/40 hover:bg-muted"
            )}
          >
            {isWatchlistPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Bookmark className={cn("size-3.5", isWatchlist && "fill-current")} />
            )}
            <span className="truncate">
              {isWatchlist ? "In Watchlist" : "Watchlist"}
            </span>
          </Button>

          {/* Favorite */}
          <Button
            size="sm"
            variant={isFavorite ? "default" : "outline"}
            onClick={() => {
              onToggleFavorite();
              closeMobileNav();
            }}
            disabled={isFavoritePending}
            className={cn(
              "h-9 w-full justify-start gap-2 rounded-none text-xs font-semibold",
              isFavorite
                ? "bg-red-600 text-white hover:bg-red-700"
                : "border-border/70 bg-card/40 hover:bg-muted"
            )}
          >
            {isFavoritePending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Heart
                className={cn(
                  "size-3.5",
                  isFavorite && "fill-current text-red-500"
                )}
              />
            )}
            <span className="truncate">
              {isFavorite ? "Favorited" : "Favorite"}
            </span>
          </Button>

          {/* Rate */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              closeMobileNav();
              onOpenRating();
            }}
            className="h-9 w-full justify-start gap-2 rounded-none border-border/70 bg-card/40 text-xs font-semibold hover:bg-muted"
          >
            <Star
              className={cn(
                "size-3.5",
                userRating ? "fill-primary text-primary" : "text-primary"
              )}
            />
            <span className="truncate">
              {userRating ? `${userRating}/10` : "Rate"}
            </span>
          </Button>

          {/* Share */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleShare}
            className="h-9 w-full justify-start gap-2 rounded-none border-border/70 bg-card/40 text-xs font-semibold hover:bg-muted"
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-500" />
            ) : (
              <Share2 className="size-3.5" />
            )}
            <span className="truncate">{copied ? "Copied!" : "Share"}</span>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      {(mode === "desktop" || mode === "all") && (
        <div className={cn("flex flex-col space-y-4", className)}>
          {renderDesktopSidebar()}
        </div>
      )}

      {/* Mobile Sticky Collapsible Dropdown below Header (Triggered by header Compass button) */}
      {(mode === "mobile" || mode === "all") && isMobileNavOpen && (
        <>
          {/* Transparent Backdrop to dismiss outside */}
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={closeMobileNav}
            aria-hidden="true"
          />

          {/* Frosted Translucent Collapsible below Header */}
          <div className="fixed inset-x-0 top-16 z-50 max-h-[85vh] animate-in overflow-y-auto border-b border-border/80 bg-background/85 p-4 shadow-xl backdrop-blur-md duration-200 slide-in-from-top-2 lg:hidden">
            <div className="container max-w-md space-y-4">
              {renderMobileContent()}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default MediaQuickRail;
