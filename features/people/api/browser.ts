import type {
  PopularPeopleData,
  PersonDetailsData,
  PersonCombinedCredits,
  PersonExternalIds,
} from "@/lib/tmdb/types/people";
import { fetchTMDBClient } from "@/lib/tmdb/browser";
export async function getPopularPeopleClient(
  page: number = 1,
  signal?: AbortSignal,
): Promise<PopularPeopleData> {
  return fetchTMDBClient<PopularPeopleData>(
    "/person/popular",
    { page },
    { signal },
  );
}

export async function getPersonDetailsClient(
  id: string | number,
  signal?: AbortSignal,
): Promise<PersonDetailsData> {
  return fetchTMDBClient<PersonDetailsData>(`/person/${id}`, {}, { signal });
}

export async function getPersonCombinedCreditsClient(
  id: string | number,
  signal?: AbortSignal,
): Promise<PersonCombinedCredits> {
  return fetchTMDBClient<PersonCombinedCredits>(
    `/person/${id}/combined_credits`,
    {},
    { signal },
  );
}

export async function getPersonExternalIdsClient(
  id: string | number,
  signal?: AbortSignal,
): Promise<PersonExternalIds> {
  return fetchTMDBClient<PersonExternalIds>(
    `/person/${id}/external_ids`,
    {},
    { signal },
  );
}
