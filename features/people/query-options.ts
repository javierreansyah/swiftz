import { queryOptions, keepPreviousData } from "@tanstack/react-query";
import { queryKeys } from "@/lib/tmdb/query-keys";
import {
  getPopularPeopleClient,
  getPersonDetailsClient,
  getPersonCombinedCreditsClient,
  getPersonExternalIdsClient,
} from "@/features/people/api/browser";
export function popularPeopleOptions(page: number = 1, enabled = true) {
  return queryOptions({
    queryKey: queryKeys.popularPeople(page),
    queryFn: ({ signal }) => getPopularPeopleClient(page, signal),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function personDetailsOptions(id: string | number) {
  return queryOptions({
    queryKey: queryKeys.personDetails(id),
    queryFn: ({ signal }) => getPersonDetailsClient(id, signal),
    enabled: Boolean(id),
  });
}

export function personCombinedCreditsOptions(
  id: string | number,
  enabled = true,
) {
  return queryOptions({
    queryKey: queryKeys.personCredits(id),
    queryFn: ({ signal }) => getPersonCombinedCreditsClient(id, signal),
    enabled: Boolean(id) && enabled,
  });
}

export function personExternalIdsOptions(id: string | number) {
  return queryOptions({
    queryKey: queryKeys.personExternalIds(id),
    queryFn: ({ signal }) => getPersonExternalIdsClient(id, signal),
    enabled: Boolean(id),
  });
}
