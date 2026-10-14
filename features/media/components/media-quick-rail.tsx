"use client";
import { useState, useEffect } from "react";
import {
  Bookmark,
  Heart,
  Star,
  Share2,
  Check,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuList } from "@/components/common/menu-list";
import { cn } from "@/lib/utils";
import { useMovieNav } from "@/components/providers/movie-nav-provider";
import {
  Drawer,
  DrawerContent,
  DrawerHandle,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
export interface QuickRailSectionItem {
  id: string;
  label: string;
  icon: LucideIcon;
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
  mode = "all",
  className,
}: MediaQuickRailProps) {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(
    sections[0]?.id || "section-overview",
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
    closeMobileNav();
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const headerOffset = 96; // 64px fixed header + 32px padding
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 150);
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
        <div className="absolute inset-y-1.5 left-0 w-0.5 rounded-xl bg-border/40" />

        {sections.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="group relative flex w-full cursor-pointer items-center gap-2.5 py-1.5 text-xs font-semibold select-none"
            >
              {/* Primary colored bar on the activated section */}
              {isActive && (
                <span className="absolute inset-y-0.5 -left-3 w-0.5 rounded-xl bg-primary transition-all duration-300" />
              )}

              <Icon
                className={cn(
                  "size-3.5 transition-colors duration-200",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground/60 group-hover:text-foreground",
                )}
              />
              <span
                className={cn(
                  "transition-colors duration-200",
                  isActive
                    ? "font-bold text-foreground"
                    : "text-muted-foreground/70 group-hover:text-foreground",
                )}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-1.5">
        {/* Watchlist button */}
        <Button
          size="default"
          variant={isWatchlist ? "default" : "secondary"}
          onClick={onToggleWatchlist}
          disabled={isWatchlistPending}
          className="w-full justify-start"
        >
          {isWatchlistPending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Bookmark
              className={cn("size-3.5", isWatchlist && "fill-current")}
            />
          )}
          <span>{isWatchlist ? "In Watchlist" : "Add to Watchlist"}</span>
        </Button>

        {/* Favorite button */}
        <Button
          size="default"
          variant={isFavorite ? "default" : "secondary"}
          onClick={onToggleFavorite}
          disabled={isFavoritePending}
          className="w-full justify-start"
        >
          {isFavoritePending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Heart
              className={cn(
                "size-3.5",
                isFavorite && "fill-current text-destructive",
              )}
            />
          )}
          <span>{isFavorite ? "In Favorites" : "Add to Favorites"}</span>
        </Button>

        {/* Rate button */}
        <Button
          size="default"
          variant="secondary"
          onClick={onOpenRating}
          className="w-full justify-start"
        >
          <Star
            className={cn(
              "size-3.5",
              userRating ? "fill-primary text-primary" : "text-primary",
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
          size="default"
          variant="secondary"
          onClick={handleShare}
          className="w-full justify-start"
        >
          {copied ? (
            <Check className="size-3.5 text-success" />
          ) : (
            <Share2 className="size-3.5" />
          )}
          <span>{copied ? "Copied Link!" : `Share ${mediaTypeName}`}</span>
        </Button>
      </div>
    </div>
  );

  /* ----------------- MOBILE NAVIGATION BOTTOM SHEET CONTENT ----------------- */
  const renderMobileContent = () => (
    <div className="flex flex-col space-y-4">
      {/* Section Navigation List */}
      <MenuList
        items={sections.map((item) => ({
          key: item.id,
          icon: item.icon,
          label: item.label,
          active: activeSection === item.id,
          onClick: () => scrollToSection(item.id),
        }))}
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        {/* Watchlist */}
        <Button
          size="default"
          variant={isWatchlist ? "default" : "secondary"}
          onClick={() => {
            onToggleWatchlist();
            closeMobileNav();
          }}
          disabled={isWatchlistPending}
          className="w-full justify-start"
        >
          {isWatchlistPending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Bookmark
              className={cn("size-3.5", isWatchlist && "fill-current")}
            />
          )}
          <span className="truncate">
            {isWatchlist ? "In Watchlist" : "Watchlist"}
          </span>
        </Button>

        {/* Favorite */}
        <Button
          size="default"
          variant={isFavorite ? "default" : "secondary"}
          onClick={() => {
            onToggleFavorite();
            closeMobileNav();
          }}
          disabled={isFavoritePending}
          className="w-full justify-start"
        >
          {isFavoritePending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Heart
              className={cn(
                "size-3.5",
                isFavorite && "fill-current text-destructive",
              )}
            />
          )}
          <span className="truncate">
            {isFavorite ? "Favorited" : "Favorite"}
          </span>
        </Button>

        {/* Rate */}
        <Button
          size="default"
          variant="secondary"
          onClick={() => {
            closeMobileNav();
            onOpenRating();
          }}
          className="w-full justify-start"
        >
          <Star
            className={cn(
              "size-3.5",
              userRating ? "fill-primary text-primary" : "text-primary",
            )}
          />
          <span className="truncate">
            {userRating ? `${userRating}/10` : "Rate"}
          </span>
        </Button>

        {/* Share */}
        <Button
          size="default"
          variant="secondary"
          onClick={handleShare}
          className="w-full justify-start"
        >
          {copied ? (
            <Check className="size-3.5 text-success" />
          ) : (
            <Share2 className="size-3.5" />
          )}
          <span className="truncate">{copied ? "Copied!" : "Share"}</span>
        </Button>
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

      {/* Mobile Navigation Bottom Sheet (Triggered by header Compass button) */}
      {(mode === "mobile" || mode === "all") && (
        <Drawer
          open={isMobileNavOpen}
          onOpenChange={(open) => !open && closeMobileNav()}
        >
          <DrawerContent
            surface="fit"
            className="inset-x-0 bottom-0 mx-auto w-full max-w-(--max-container)"
          >
            <DrawerHandle className="md:hidden" />
            <DrawerTitle className="sr-only">Navigation</DrawerTitle>
            <DrawerDescription className="sr-only">
              Browse sections for {title}
            </DrawerDescription>

            <div className="px-4 pt-5 pb-8">{renderMobileContent()}</div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
