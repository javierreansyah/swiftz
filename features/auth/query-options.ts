import { queryOptions } from "@tanstack/react-query";
import {
  getMediaAccountStates,
  type MediaType,
} from "@/features/auth/api/media-account";
import { queryKeys } from "@/lib/tmdb/query-keys";
export function mediaAccountKey(
  type: MediaType,
  id: string | number,
  sessionId: string | null,
) {
  return type === "movie"
    ? queryKeys.movieAccountStates(id, sessionId)
    : queryKeys.tvAccountStates(id, sessionId);
}
export function mediaAccountStatesOptions(
  type: MediaType,
  id: string | number,
  sessionId: string | null,
) {
  return queryOptions({
    queryKey: mediaAccountKey(type, id, sessionId),
    queryFn: ({ signal }) =>
      getMediaAccountStates(type, id, sessionId!, signal),
    enabled: Boolean(id && sessionId),
    staleTime: 1000 * 60 * 5,
  });
}
