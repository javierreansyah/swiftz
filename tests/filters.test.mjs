import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_DISCOVER_FILTERS } from "../features/movies/discovery/types.ts";
import {
  parseFiltersFromParams,
  serializeFiltersToParams,
  buildTMDBFilters,
  isDefaultFilterState,
} from "../features/movies/discovery/filter-utils.ts";
import { DEFAULT_TV_FILTERS } from "../features/tv/discovery/types.ts";
import {
  parseTVFilters,
  serializeTVFilters,
} from "../features/tv/discovery/filter-utils.ts";

test("movie filter URLs round trip existing keys and encoded keyword names", () => {
  const filters = {
    ...DEFAULT_DISCOVER_FILTERS,
    sort_by: "title.asc",
    with_genres: ["28", "12"],
    keywords: [{ id: 42, name: "space, 100% & time" }],
    release_date_gte: "2025-01-01",
    release_date_lte: "2026-12-31",
    certification: "PG-13",
    original_language: "ja",
    vote_average_gte: 6,
    vote_average_lte: 9,
    vote_count_gte: 100,
    with_runtime_gte: 90,
    with_runtime_lte: 180,
    watch_providers: [8, 9],
    watch_region: "ID",
    monetization_type: "flatrate",
  };
  const params = new URLSearchParams(serializeFiltersToParams(filters, 3));
  assert.equal(params.get("with_genres"), "28,12");
  assert.equal(params.get("providers"), "8|9");
  assert.equal(params.get("page"), "3");
  assert.deepEqual(parseFiltersFromParams(params), filters);
  const api = buildTMDBFilters(parseFiltersFromParams(params), 3);
  assert.equal(api.with_keywords, "42");
  assert.equal(api.with_watch_providers, "8|9");
  assert.equal(api["primary_release_date.gte"], "2025-01-01");
});

test("default filters omit query parameters and malformed values stay finite", () => {
  assert.equal(serializeFiltersToParams(DEFAULT_DISCOVER_FILTERS), "");
  const parsed = parseFiltersFromParams(
    new URLSearchParams(
      "sort_by=unknown&score_gte=Infinity&score_lte=NaN&runtime_gte=-1&runtime_lte=9999&votes_gte=Infinity&with_genres=28,0,-1,NaN,28&providers=8,1.5,Infinity,-1,8&with_keywords=42,NaN,0&keywords_names=%25broken,bad,bad&release_date_gte=2026-02-30",
    ),
  );
  assert.equal(parsed.sort_by, "popularity.desc");
  assert.equal(parsed.vote_average_gte, 0);
  assert.equal(parsed.vote_average_lte, 10);
  assert.equal(parsed.vote_count_gte, 0);
  assert.equal(parsed.with_runtime_gte, 0);
  assert.equal(parsed.with_runtime_lte, 360);
  assert.equal(parsed.release_date_gte, undefined);
  assert.deepEqual(parsed.with_genres, ["28"]);
  assert.deepEqual(parsed.watch_providers, [8]);
  assert.deepEqual(parsed.keywords, [{ id: 42, name: "%broken" }]);
});

test("category defaults preserve an explicit popularity sort on top-rated routes", () => {
  const defaults = {
    ...DEFAULT_DISCOVER_FILTERS,
    sort_by: "vote_average.desc",
  };
  assert.equal(isDefaultFilterState(defaults, defaults), true);
  const filters = { ...defaults, sort_by: "popularity.desc" };
  const encoded = serializeFiltersToParams(filters, 1, defaults);
  assert.equal(new URLSearchParams(encoded).get("sort_by"), "popularity.desc");
  assert.equal(
    parseFiltersFromParams(new URLSearchParams(encoded), defaults).sort_by,
    "popularity.desc",
  );
});

test("TV URLs preserve their domain keys, defaults, and rating bounds", () => {
  const filters = {
    ...DEFAULT_TV_FILTERS,
    with_genres: ["18"],
    first_air_date_year: "2020",
    vote_average_gte: 7,
  };
  assert.deepEqual(
    parseTVFilters(new URLSearchParams(serializeTVFilters(filters, 2))),
    filters,
  );
  const malformed = parseTVFilters(
    new URLSearchParams(
      "sort_by=invalid&rating=Infinity&year=foo&genres=18,0,9999,-1,18",
    ),
  );
  assert.deepEqual(malformed, { ...DEFAULT_TV_FILTERS, with_genres: ["18"] });
  assert.equal(
    parseTVFilters(new URLSearchParams("rating=100")).vote_average_gte,
    10,
  );
});
