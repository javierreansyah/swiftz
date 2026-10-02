import {
  keepPreviousData,
  type QueryFunction,
  type QueryKey,
  type UseQueryOptions,
} from "@tanstack/react-query";
/** Adapt endpoint-specific keys to a listing whose endpoint changes with filters. */
export function listingOptions<T, K extends QueryKey>(options: {
  queryKey: K;
  queryFn?: QueryFunction<T, K>;
}): UseQueryOptions<T> {
  return {
    queryKey: options.queryKey,
    placeholderData: keepPreviousData,
    queryFn: (context) => {
      if (!options.queryFn) throw new Error("Listing query has no fetcher");
      return options.queryFn({ ...context, queryKey: options.queryKey });
    },
  };
}
