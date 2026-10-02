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
  onOpenModal: (
    modal:
      | "reviews"
      | "videos"
      | "photos"
      | "cast"
      | "recommendations"
      | "collection",
  ) => void;
  onOpenRating?: () => void;
  hasCollection?: boolean;
  mode?: "all" | "desktop" | "mobile";
  className?: string;
}

export function MovieQuickRail({
  movieId,
  movieTitle,
  onOpenModal,
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
  } = useMediaActions({
    type: "movie",
    mediaId: movieId,
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
    { id: "section-overview", label: "Overview", icon: Film },
    { id: "section-cast", label: "Cast", icon: Users, modal: "cast" },
    { id: "section-videos", label: "Videos", icon: Video, modal: "videos" },
    { id: "section-photos", label: "Photos", icon: ImageIcon, modal: "photos" },
    {
      id: "section-reviews",
      label: "Reviews",
      icon: MessageSquare,
      modal: "reviews",
    },
    ...(hasCollection
      ? [
          {
            id: "section-collection",
            label: "Franchise",
            icon: Layers,
            modal: "collection",
          },
        ]
      : []),
    {
      id: "section-recommendations",
      label: "Related",
      icon: Sparkles,
      modal: "recommendations",
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
      isWatchlistPending={toggleWatchlist.isPending}
      isFavoritePending={toggleFavorite.isPending}
      onToggleWatchlist={handleWatchlist}
      onToggleFavorite={handleFavorite}
      onOpenRating={handleRateClick}
      onOpenModal={(modal) =>
        onOpenModal(
          modal as
            | "reviews"
            | "videos"
            | "photos"
            | "cast"
            | "recommendations"
            | "collection",
        )
      }
      mode={mode}
      className={className}
    />
  );
}
