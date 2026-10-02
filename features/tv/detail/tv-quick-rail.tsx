"use client";
import { Tv, Layers, Users, Video, Sparkles } from "lucide-react";
import { useAuth } from "@/features/auth/auth-provider";
import { useMediaAccountStatesQuery } from "@/features/auth/hooks/queries";
import {
  type QuickRailSectionItem,
  MediaQuickRail,
} from "@/features/media/components/media-quick-rail";
import { useMediaActions } from "@/features/auth/hooks/use-media-actions";
export interface TVQuickRailProps {
  tvId: number;
  showTitle?: string;
  showName?: string;
  onOpenModal: (
    modal: "reviews" | "videos" | "photos" | "cast" | "seasons",
  ) => void;
  onOpenRating?: () => void;
  mode?: "all" | "desktop" | "mobile";
  className?: string;
}

export function TVQuickRail({
  tvId,
  showTitle,
  showName,
  onOpenModal,
  onOpenRating,
  mode = "all",
  className,
}: TVQuickRailProps) {
  const resolvedTitle = showTitle || showName || "";
  const { sessionId } = useAuth();

  const { data: accountStates } = useMediaAccountStatesQuery(
    "tv",
    tvId,
    sessionId,
  );
  const isFavorite = Boolean(accountStates?.favorite);
  const isWatchlist = Boolean(accountStates?.watchlist);
  const userRating =
    typeof accountStates?.rated === "object" && accountStates?.rated !== null
      ? accountStates.rated.value
      : accountStates?.rated === true
        ? 10
        : null;

  const {
    toggleFavorite,
    toggleWatchlist,
    handleWatchlistClick: handleWatchlist,
    handleFavoriteClick: handleFavorite,
  } = useMediaActions({
    type: "tv",
    mediaId: tvId,
    isFavorite,
    isWatchlist,
    authMode: "login",
  });

  const handleRateClick = () => {
    if (onOpenRating) {
      onOpenRating();
    } else {
      onOpenModal("reviews");
    }
  };

  const sections: QuickRailSectionItem[] = [
    { id: "section-overview", label: "Overview", icon: Tv },
    { id: "section-seasons", label: "Seasons", icon: Layers, modal: "seasons" },
    { id: "section-cast", label: "Cast", icon: Users, modal: "cast" },
    { id: "section-videos", label: "Videos", icon: Video, modal: "videos" },
    { id: "section-recommendations", label: "Related", icon: Sparkles },
  ];

  return (
    <MediaQuickRail
      sections={sections}
      title={resolvedTitle}
      mediaTypeName="Series"
      isWatchlist={isWatchlist}
      isFavorite={isFavorite}
      userRating={userRating}
      isWatchlistPending={toggleWatchlist.isPending}
      isFavoritePending={toggleFavorite.isPending}
      onToggleWatchlist={handleWatchlist}
      onToggleFavorite={handleFavorite}
      onOpenRating={handleRateClick}
      onOpenModal={(modal) =>
        onOpenModal(
          modal as "reviews" | "videos" | "photos" | "cast" | "seasons",
        )
      }
      mode={mode}
      className={className}
    />
  );
}
