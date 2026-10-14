"use client";
import { useQuery } from "@tanstack/react-query";
import {
  popularPeopleOptions,
  personDetailsOptions,
  personCombinedCreditsOptions,
  personExternalIdsOptions,
} from "@/features/people/query-options";
export function usePopularPeopleQuery(page: number = 1, enabled = true) {
  return useQuery(popularPeopleOptions(page, enabled));
}

export function usePersonDetailsQuery(id: string | number, enabled = true) {
  return useQuery(personDetailsOptions(id, enabled));
}

export function usePersonCombinedCreditsQuery(
  id: string | number,
  enabled = true,
) {
  return useQuery(personCombinedCreditsOptions(id, enabled));
}

export function usePersonExternalIdsQuery(id: string | number, enabled = true) {
  return useQuery(personExternalIdsOptions(id, enabled));
}
