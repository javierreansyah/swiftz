import test from "node:test";
import assert from "node:assert/strict";
import { toMovieDetailView } from "../features/movies/detail/payload.ts";
import { toTVDetailView } from "../features/tv/detail/payload.ts";
import { toHeroMovie } from "../features/home/hero-payload.ts";

test("movie payload excludes unused and unexpected fields, including nested collection fields", () => {
  const movie = {
    id: 42,
    title: "Film",
    overview: "Plot",
    poster_path: null,
    backdrop_path: null,
    release_date: "2020-01-01",
    vote_average: 8,
    vote_count: 10,
    popularity: 20,
    budget: 100,
    runtime: 120,
    production_companies: Array(100).fill({ name: "Studio" }),
    unexpected: "upstream addition",
    belongs_to_collection: {
      id: 7,
      name: "Series",
      poster_path: null,
      backdrop_path: null,
      unexpected: "extra",
    },
  };
  const payload = toMovieDetailView(movie);
  assert.deepEqual(
    Object.keys(payload).sort(),
    [
      "id",
      "title",
      "overview",
      "poster_path",
      "backdrop_path",
      "release_date",
      "vote_average",
      "vote_count",
      "popularity",
      "belongs_to_collection",
    ].sort(),
  );
  assert.deepEqual(payload.belongs_to_collection, {
    id: 7,
    name: "Series",
    poster_path: null,
    backdrop_path: null,
  });
  assert.equal(
    toMovieDetailView({ ...movie, belongs_to_collection: null })
      .belongs_to_collection,
    null,
  );
  assert.ok(JSON.stringify(payload).length < JSON.stringify(movie).length);
});

test("TV payload keeps every season and its overview but strips unused nested metadata", () => {
  const season = {
    id: 1,
    name: "Season",
    air_date: null,
    episode_count: 10,
    overview: "Season plot",
    poster_path: null,
    season_number: 1,
    unused: "extra",
  };
  const show = {
    id: 43,
    name: "Show",
    created_by: [{ name: "Creator", credit_id: "unused" }],
    networks: [{ name: "Network", logo_path: "unused" }],
    seasons: Array.from({ length: 100 }, (_, i) => ({
      ...season,
      id: i,
      season_number: i,
    })),
    production_companies: ["unused"],
    unexpected: "extra",
  };
  const payload = toTVDetailView(show);
  assert.deepEqual(payload.created_by, [{ name: "Creator" }]);
  assert.deepEqual(payload.networks, [{ name: "Network" }]);
  assert.equal(payload.seasons.length, 100);
  assert.equal(payload.seasons[99].overview, "Season plot");
  assert.equal("unused" in payload.seasons[0], false);
  assert.equal("unexpected" in payload, false);
  assert.equal("production_companies" in payload, false);
  assert.deepEqual(
    toTVDetailView({ ...show, seasons: [], created_by: [], networks: [] })
      .seasons,
    [],
  );
});

test("homepage hero sends only the fields used by its interactive slides", () => {
  const payload = toHeroMovie({
    id: 42,
    title: "Film",
    overview: "Plot",
    poster_path: null,
    backdrop_path: null,
    vote_average: 8,
    release_date: "2020-01-01",
    unexpected: "extra",
    genre_ids: [1, 2],
  });
  assert.deepEqual(
    Object.keys(payload).sort(),
    [
      "id",
      "title",
      "overview",
      "poster_path",
      "backdrop_path",
      "vote_average",
      "release_date",
    ].sort(),
  );
});
