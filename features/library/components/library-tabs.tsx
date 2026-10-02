"use client";
import { Heart, Bookmark, Star } from "lucide-react";
import { SectionHeader } from "@/components/common/section-header";
export type LibraryTab = "favorites" | "watchlist" | "rated";

export interface LibraryTabsProps {
  activeTab: LibraryTab;
  onTabChange: (tab: LibraryTab) => void;
  favoritesCount?: number;
  watchlistCount?: number;
  ratedCount?: number;
  onRefresh?: () => void;
  isFetching?: boolean;
}

export function LibraryTabs({
  activeTab,
  onTabChange,
  favoritesCount,
  watchlistCount,
  ratedCount,
}: LibraryTabsProps) {
  return (
    <SectionHeader
      title="Your Library"
      tabs={[
        {
          id: "favorites",
          label: "Favorites",
          count: favoritesCount,
          icon: <Heart className="size-3.5" />,
        },
        {
          id: "watchlist",
          label: "Watchlist",
          count: watchlistCount,
          icon: <Bookmark className="size-3.5" />,
        },
        {
          id: "rated",
          label: "Rated",
          count: ratedCount,
          icon: <Star className="size-3.5" />,
        },
      ]}
      activeTab={activeTab}
      onTabChange={(tabId) => onTabChange(tabId as LibraryTab)}
    />
  );
}
