import { mutationOptions, type QueryClient } from "@tanstack/react-query";
import {
  setMediaFlag,
  setMediaRating,
  type MediaType,
} from "@/features/auth/api/media-account";
import { mediaAccountKey } from "@/features/auth/query-options";
import { queryKeys } from "@/lib/tmdb/query-keys";
import type { AccountStates } from "@/lib/tmdb/types/account";
interface MediaSession {
  mediaId: number;
  sessionId: string;
}
type FlagVariables<K extends "favorite" | "watchlist"> = MediaSession & {
  accountId: number;
} & Record<K, boolean>;

export function mediaFlagMutationOptions<K extends "favorite" | "watchlist">(
  client: QueryClient,
  type: MediaType,
  flag: K,
) {
  return mutationOptions({
    mutationFn: (variables: FlagVariables<K>) =>
      setMediaFlag(
        type,
        flag,
        variables.accountId,
        variables.sessionId,
        variables.mediaId,
        variables[flag],
      ),
    onMutate: async (variables: FlagVariables<K>) => {
      const queryKey = mediaAccountKey(
        type,
        variables.mediaId,
        variables.sessionId,
      );
      await client.cancelQueries({ queryKey });
      const previous = client.getQueryData<AccountStates>(queryKey);
      if (previous)
        client.setQueryData(queryKey, { ...previous, [flag]: variables[flag] });
      return { previous };
    },
    onError: (_error, variables, context) => {
      if (context?.previous)
        client.setQueryData(
          mediaAccountKey(type, variables.mediaId, variables.sessionId),
          context.previous,
        );
    },
    onSettled: (_data, _error, variables) => {
      void client.invalidateQueries({
        queryKey: mediaAccountKey(type, variables.mediaId, variables.sessionId),
      });
      const prefix =
        flag === "favorite"
          ? queryKeys.accountFavorites
          : queryKeys.accountWatchlist;
      void client.invalidateQueries({
        queryKey: prefix(variables.accountId, variables.sessionId, 1).slice(
          0,
          3,
        ),
      });
    },
  });
}

export function mediaRatingMutationOptions(
  client: QueryClient,
  type: MediaType,
) {
  return mutationOptions({
    mutationFn: ({
      mediaId,
      sessionId,
      rating,
    }: MediaSession & { rating?: number }) =>
      setMediaRating(type, mediaId, sessionId, rating),
    onSettled: (_data, _error, { mediaId, sessionId }) => {
      void client.invalidateQueries({
        queryKey: mediaAccountKey(type, mediaId, sessionId),
      });
      if (type === "movie")
        void client.invalidateQueries({
          queryKey: queryKeys.accountRated(undefined, null, 1).slice(0, 1),
        });
    },
  });
}
