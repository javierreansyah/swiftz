"use client";
import {
  Film,
  Users,
  Video,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  Layers,
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-provider";
import { useMediaAccountStatesQuery } from "@/features/auth/hooks/queries";
import {
  type QuickRailSectionItem,
  MediaQuickRail,
} from "@/features/media/components/media-quick-rail";
import { useMediaActions } from "@/features/auth/hooks/use-media-actions";
export interface MovieQuickRailProps {
  movieId: number;
  movieTitle: string;
  onOpenRating: () => void;
  hasCollection?: boolean;
  mode?: "all" | "desktop" | "mobile";
  className?: string;
}

export function MovieQuickRail({
  movieId,
  movieTitle,
  onOpenRating,
  hasCollection = false,
  mode = "all",
  className,
}: MovieQuickRailProps) {
  const { sessionId } = useAuth();

  const { data: accountStates } = useMediaAccountStatesQuery(
    "movie",
    movieId,
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
    handleRateClick,
  } = useMediaActions({
    type: "movie",
    mediaId: movieId,
    isFavorite,
    isWatchlist,
    authMode: "login",
    onRate: onOpenRating,
  });

  const sections: QuickRailSectionItem[] = [
    { id: "section-overview", label: "Overview", icon: Film },
    { id: "section-cast", label: "Cast", icon: Users },
    { id: "section-videos", label: "Videos", icon: Video },
    { id: "section-photos", label: "Photos", icon: ImageIcon },
    { id: "section-reviews", label: "Reviews", icon: MessageSquare },
    ...(hasCollection
      ? [
          {
            id: "section-collection",
            label: "Franchise",
            icon: Layers,
          },
        ]
      : []),
    {
      id: "section-recommendations",
      label: "Related",
      icon: Sparkles,
    },
  ];

  return (
    <MediaQuickRail
      sections={sections}
      title={movieTitle}
      mediaTypeName="Movie"
      isWatchlist={isWatchlist}
      isFavorite={isFavorite}
      userRating={userRating}
      actionError={toggleFavorite.isError || toggleWatchlist.isError}
      isWatchlistPending={toggleWatchlist.isPending}
      isFavoritePending={toggleFavorite.isPending}
      onToggleWatchlist={handleWatchlist}
      onToggleFavorite={handleFavorite}
      onOpenRating={handleRateClick}
      mode={mode}
      className={className}
    />
  );
}
