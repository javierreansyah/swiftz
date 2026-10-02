import { fetchTMDBClient } from "@/lib/tmdb/browser";
import type { AccountStates } from "@/lib/tmdb/types/account";
export type MediaType = "movie" | "tv";
export interface MutationResult {
  success: boolean;
  status_message: string;
}

export function getMediaAccountStates(
  type: MediaType,
  id: string | number,
  sessionId: string,
  signal?: AbortSignal,
) {
  return fetchTMDBClient<AccountStates>(
    `/${type}/${id}/account_states`,
    { session_id: sessionId },
    { signal },
  );
}

export function setMediaFlag(
  type: MediaType,
  flag: "favorite" | "watchlist",
  accountId: number,
  sessionId: string,
  mediaId: number,
  value: boolean,
) {
  return fetchTMDBClient<MutationResult>(
    `/account/${accountId}/${flag}`,
    { session_id: sessionId },
    {
      method: "POST",
      body: JSON.stringify({
        media_type: type,
        media_id: mediaId,
        [flag]: value,
      }),
    },
  );
}

export function setMediaRating(
  type: MediaType,
  mediaId: number,
  sessionId: string,
  rating?: number,
) {
  return fetchTMDBClient<MutationResult>(
    `/${type}/${mediaId}/rating`,
    { session_id: sessionId },
    rating === undefined
      ? { method: "DELETE" }
      : { method: "POST", body: JSON.stringify({ value: rating }) },
  );
}
