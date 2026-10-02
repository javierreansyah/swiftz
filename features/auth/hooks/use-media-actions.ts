"use client";
import { useState } from "react";
import { useAuth } from "@/features/auth/auth-provider";
import {
  useFavoriteMutation,
  useWatchlistMutation,
} from "@/features/auth/hooks/queries";
import type { MediaType } from "@/features/auth/api/media-account";
export function useMediaActions({
  type,
  mediaId,
  isFavorite,
  isWatchlist,
  onRate,
  authMode = "prompt",
}: {
  type: MediaType;
  mediaId: number;
  isFavorite: boolean;
  isWatchlist: boolean;
  onRate?: () => void;
  authMode?: "prompt" | "login";
}) {
  const { user, sessionId, isAuthenticated, login, loginDemo } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const toggleFavorite = useFavoriteMutation(type);
  const toggleWatchlist = useWatchlistMutation(type);

  function authorize() {
    if (isAuthenticated && user && sessionId)
      return { accountId: user.id, sessionId, mediaId };
    if (authMode === "login") void login();
    else setShowAuthModal(true);
    return null;
  }

  function handleWatchlistClick() {
    const session = authorize();
    if (session)
      toggleWatchlist.mutate({ ...session, watchlist: !isWatchlist });
  }
  function handleFavoriteClick() {
    const session = authorize();
    if (session) toggleFavorite.mutate({ ...session, favorite: !isFavorite });
  }
  function handleRateClick() {
    if (authorize()) onRate?.();
  }

  return {
    toggleFavorite,
    toggleWatchlist,
    handleWatchlistClick,
    handleFavoriteClick,
    handleRateClick,
    showAuthModal,
    setShowAuthModal,
    login,
    loginDemo,
  };
}
