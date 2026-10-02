import test from "node:test";
import assert from "node:assert/strict";
import { QueryClient, MutationObserver } from "@tanstack/react-query";

process.env.NEXT_PUBLIC_TMDB_API_KEY = "test-public-key";
const { movieCategoryDefaults, movieCategoryOptions } =
  await import("../features/movies/discovery/categories.ts");
const { tvCategoryDefaults, tvCategoryOptions } =
  await import("../features/tv/discovery/categories.ts");
const { searchKeywordsOptions, searchMoviesOptions, searchTypeCountsOptions } =
  await import("../features/search/query-options.ts");
const { movieCastOptions } =
  await import("../features/movies/query-options.ts");
const { mediaAccountKey } = await import("../features/auth/query-options.ts");
const { mediaFlagMutationOptions, mediaRatingMutationOptions } =
  await import("../features/auth/mutation-options.ts");
const { queryKeys } = await import("../lib/tmdb/query-keys.ts");

function client(t) {
  const cache = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 30 * 60 * 1000 },
      mutations: { retry: false },
    },
  });
  t.after(() => cache.clear());
  return cache;
}

test("category queries select native keys until custom filters are applied", () => {
  const now = new Date("2026-10-02T12:00:00Z");
  const defaults = movieCategoryDefaults("now-playing");
  assert.deepEqual(
    movieCategoryOptions("now-playing", defaults, 2, now).queryKey,
    ["now-playing-movies", 2],
  );
  const filtered = movieCategoryOptions(
    "now-playing",
    { ...defaults, with_genres: ["28"] },
    2,
    now,
  ).queryKey;
  assert.equal(filtered[0], "discover-movies");
  assert.equal(filtered[1]["primary_release_date.gte"], "2026-08-18");
  assert.equal(filtered[1]["primary_release_date.lte"], "2026-10-02");
  assert.equal(filtered[1].with_release_type, "2|3");
  const tv = tvCategoryOptions(
    "airing-today",
    { ...tvCategoryDefaults("airing-today"), vote_average_gte: 6 },
    1,
    now,
  ).queryKey;
  assert.equal(tv[0], "discover-tv");
  assert.equal(tv[1]["air_date.gte"], "2026-10-02");
  assert.equal(tv[1]["air_date.lte"], "2026-10-02");
  const top = movieCategoryOptions(
    "top-rated",
    { ...movieCategoryDefaults("top-rated"), with_genres: ["18"] },
    1,
    now,
  ).queryKey;
  assert.equal(top[1]["vote_count.gte"], 200);
});

test("keyword autocomplete and search share one cache while retaining thresholds", async (t) => {
  const cache = client(t);
  let requests = 0;
  t.mock.method(globalThis, "fetch", async () => {
    requests++;
    return Response.json({
      page: 1,
      results: [{ id: 42, name: "space" }],
      total_pages: 1,
      total_results: 1,
    });
  });
  assert.equal(searchKeywordsOptions("s", true).enabled, false);
  assert.equal(searchKeywordsOptions("s").enabled, true);
  assert.equal(searchKeywordsOptions("space", true).staleTime, 300000);
  const [autocomplete, search] = await Promise.all([
    cache.fetchQuery(searchKeywordsOptions("space", true)),
    cache.fetchQuery(searchKeywordsOptions("space")),
  ]);
  assert.deepEqual(autocomplete, search);
  assert.equal(requests, 1);
});

test("search counts reuse first-page results instead of refetching them", async (t) => {
  const cache = client(t);
  const endpoints = [];
  t.mock.method(globalThis, "fetch", async (url) => {
    endpoints.push(new URL(url).pathname);
    return Response.json({
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 4,
    });
  });
  await cache.fetchQuery(searchMoviesOptions("space", 1));
  const counts = await cache.fetchQuery(
    searchTypeCountsOptions(cache, "space"),
  );
  assert.equal(counts.movies, 4);
  assert.equal(
    endpoints.filter((endpoint) => endpoint.endsWith("/search/movie")).length,
    1,
  );
  assert.equal(endpoints.length, 6);
});

test("query cancellation reaches detail fetches", async (t) => {
  const cache = client(t);
  let receivedSignal;
  let started;
  const ready = new Promise((resolve) => {
    started = resolve;
  });
  t.mock.method(
    globalThis,
    "fetch",
    (_url, options) =>
      new Promise((_resolve, reject) => {
        receivedSignal = options.signal;
        receivedSignal.addEventListener(
          "abort",
          () => reject(receivedSignal.reason),
          { once: true },
        );
        started();
      }),
  );
  const pending = cache
    .fetchQuery(movieCastOptions("42"))
    .catch((error) => error);
  await ready;
  await cache.cancelQueries({ queryKey: queryKeys.movieCast("42") });
  await pending;
  assert.equal(receivedSignal.aborted, true);
});

for (const type of ["movie", "tv"]) {
  for (const flag of ["favorite", "watchlist"]) {
    test(`${type} ${flag} mutation rolls back and invalidates only the matching account`, async (t) => {
      const cache = client(t);
      const key = mediaAccountKey(type, 42, "session-a");
      const previous = {
        id: 42,
        favorite: false,
        watchlist: false,
        rated: false,
      };
      cache.setQueryData(key, previous);
      const listKey =
        flag === "favorite"
          ? queryKeys.accountFavorites
          : queryKeys.accountWatchlist;
      const own = listKey(7, "session-a", 2);
      const other = listKey(8, "session-b", 2);
      cache.setQueryData(own, { results: [] });
      cache.setQueryData(other, { results: [] });
      let resolveStarted;
      const started = new Promise((resolve) => {
        resolveStarted = resolve;
      });
      let fail;
      t.mock.method(globalThis, "fetch", async (_url, options) => {
        assert.equal(options.cache, "no-store");
        assert.equal(JSON.parse(options.body).media_type, type);
        assert.equal(cache.getQueryData(key)[flag], true);
        resolveStarted();
        return new Promise((resolve) => {
          fail = () =>
            resolve(
              Response.json({ status_message: "Unavailable" }, { status: 503 }),
            );
        });
      });
      const observer = new MutationObserver(
        cache,
        mediaFlagMutationOptions(cache, type, flag),
      );
      const pending = observer.mutate({
        accountId: 7,
        sessionId: "session-a",
        mediaId: 42,
        [flag]: true,
      });
      await started;
      fail();
      await assert.rejects(pending, /Unavailable/);
      assert.deepEqual(cache.getQueryData(key), previous);
      assert.equal(cache.getQueryState(own).isInvalidated, true);
      assert.equal(cache.getQueryState(other).isInvalidated, false);
    });
  }
}

test("movie ratings invalidate the movie library; TV ratings keep it intact", async (t) => {
  const cache = client(t);
  const ratedKey = queryKeys.accountRated(7, "session", 1);
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({ success: true }),
  );
  cache.setQueryData(ratedKey, { results: [] });
  await new MutationObserver(
    cache,
    mediaRatingMutationOptions(cache, "tv"),
  ).mutate({ mediaId: 42, sessionId: "session", rating: 8 });
  assert.equal(cache.getQueryState(ratedKey).isInvalidated, false);
  await new MutationObserver(
    cache,
    mediaRatingMutationOptions(cache, "movie"),
  ).mutate({ mediaId: 42, sessionId: "session" });
  assert.equal(cache.getQueryState(ratedKey).isInvalidated, true);
});
