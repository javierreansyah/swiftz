"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MediaType } from "@/features/auth/api/media-account";
import { mediaAccountStatesOptions } from "@/features/auth/query-options";
import {
  mediaFlagMutationOptions,
  mediaRatingMutationOptions,
} from "@/features/auth/mutation-options";
export function useMediaAccountStatesQuery(
  type: MediaType,
  id: string | number,
  sessionId: string | null,
) {
  return useQuery(mediaAccountStatesOptions(type, id, sessionId));
}
export function useFavoriteMutation(type: MediaType) {
  return useMutation(
    mediaFlagMutationOptions(useQueryClient(), type, "favorite"),
  );
}
export function useWatchlistMutation(type: MediaType) {
  return useMutation(
    mediaFlagMutationOptions(useQueryClient(), type, "watchlist"),
  );
}
export function useRatingMutation(type: MediaType) {
  return useMutation(mediaRatingMutationOptions(useQueryClient(), type));
}
