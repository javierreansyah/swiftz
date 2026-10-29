import type { TVShowDetailsData } from "@/lib/tmdb/types/tv";
export type TVDetailView = Pick<
  TVShowDetailsData,
  | "id"
  | "name"
  | "overview"
  | "poster_path"
  | "backdrop_path"
  | "first_air_date"
  | "seasons"
  | "vote_average"
  | "vote_count"
  | "popularity"
> & { created_by: { name: string }[]; networks: { name: string }[] };
export function toTVDetailView(data: TVShowDetailsData): TVDetailView {
  return {
    id: data.id,
    name: data.name,
    overview: data.overview,
    poster_path: data.poster_path,
    backdrop_path: data.backdrop_path,
    first_air_date: data.first_air_date,
    created_by: data.created_by.map(({ name }) => ({ name })),
    networks: data.networks.map(({ name }) => ({ name })),
    vote_average: data.vote_average,
    vote_count: data.vote_count,
    popularity: data.popularity,
    seasons: data.seasons.map((s) => ({
      id: s.id,
      name: s.name,
      air_date: s.air_date,
      episode_count: s.episode_count,
      overview: s.overview,
      poster_path: s.poster_path,
      season_number: s.season_number,
    })),
  };
}
