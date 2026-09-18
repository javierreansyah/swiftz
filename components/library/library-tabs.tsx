import React from "react";
import { Heart, Bookmark, Star, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export type LibraryTab = "favorites" | "watchlist" | "rated";

export interface LibraryTabsProps {
  activeTab: LibraryTab;
  onTabChange: (tab: LibraryTab) => void;
  favoritesCount?: number;
  watchlistCount?: number;
  ratedCount?: number;
  onRefresh: () => void;
  isFetching?: boolean;
}

export function LibraryTabs({
  activeTab,
  onTabChange,
  favoritesCount,
  watchlistCount,
  ratedCount,
  onRefresh,
  isFetching = false,
}: LibraryTabsProps) {
  return (
    <div className="flex items-center justify-between gap-4 overflow-x-auto border-b pb-2">
      <div className="flex items-center gap-2">
        {/* Favorites Tab */}
        <Button
          variant={activeTab === "favorites" ? "default" : "ghost"}
          size="sm"
          onClick={() => onTabChange("favorites")}
          className="gap-2 rounded-none transition-all"
        >
          <Heart
            className={`size-4 ${
              activeTab === "favorites" ? "fill-current" : "text-red-500"
            }`}
          />
          <span className="font-semibold">Favorites</span>
          {favoritesCount !== undefined && (
            <span
              className={`rounded-none px-2 py-0.5 text-xs ${
                activeTab === "favorites"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {favoritesCount}
            </span>
          )}
        </Button>

        {/* Watchlist Tab */}
        <Button
          variant={activeTab === "watchlist" ? "default" : "ghost"}
          size="sm"
          onClick={() => onTabChange("watchlist")}
          className="gap-2 rounded-none transition-all"
        >
          <Bookmark
            className={`size-4 ${
              activeTab === "watchlist" ? "fill-current" : "text-blue-500"
            }`}
          />
          <span className="font-semibold">Watchlist</span>
          {watchlistCount !== undefined && (
            <span
              className={`rounded-none px-2 py-0.5 text-xs ${
                activeTab === "watchlist"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {watchlistCount}
            </span>
          )}
        </Button>

        {/* Rated Movies Tab */}
        <Button
          variant={activeTab === "rated" ? "default" : "ghost"}
          size="sm"
          onClick={() => onTabChange("rated")}
          className="gap-2 rounded-none transition-all"
        >
          <Star
            className={`size-4 ${
              activeTab === "rated" ? "fill-current" : "text-primary"
            }`}
          />
          <span className="font-semibold">Rated</span>
          {ratedCount !== undefined && (
            <span
              className={`rounded-none px-2 py-0.5 text-xs ${
                activeTab === "rated"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {ratedCount}
            </span>
          )}
        </Button>
      </div>

      {/* Refresh Current Tab */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onRefresh}
        disabled={isFetching}
        className="gap-1 text-xs text-muted-foreground hover:text-foreground"
        title="Refresh items"
      >
        <RefreshCw
          className={`size-3.5 ${isFetching ? "animate-spin" : ""}`}
        />
        <span className="hidden sm:inline">Refresh</span>
      </Button>
    </div>
  );
}

export default LibraryTabs;
