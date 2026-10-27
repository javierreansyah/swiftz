import "server-only";
import { cache } from "react";
import { TMDBError } from "@/lib/tmdb/error";
import type {
  PopularPeopleData,
  PersonDetailsData,
  PersonCombinedCredits,
  PersonExternalIds,
} from "@/lib/tmdb/types/people";
import { fetchTMDB } from "@/lib/tmdb/server";
export async function getPopularPeople(
  page: number = 1,
): Promise<PopularPeopleData> {
  return fetchTMDB<PopularPeopleData>("/person/popular", { page }, 86400);
}

export const getPersonDetails = cache(
  async (
    id: string,
  ): Promise<
    PersonDetailsData & {
      combined_credits: PersonCombinedCredits;
      external_ids: PersonExternalIds;
    }
  > => {
    if (!/^[1-9]\d*$/.test(id)) throw new TMDBError("Invalid person ID", 404);
    return fetchTMDB(
      `/person/${id}`,
      { append_to_response: "combined_credits,external_ids" },
      604800,
    );
  },
);
