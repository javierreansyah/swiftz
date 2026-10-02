import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

process.env.NEXT_PUBLIC_TMDB_API_KEY = "test-public-key";
const { fetchTMDBClient } = await import("../lib/tmdb/browser.ts");

test("browser requests remain direct, authenticated requests bypass caches, and JSON headers survive", async (t) => {
  const requests = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    requests.push({ url: new URL(url), options });
    return Response.json({ success: true });
  });
  await fetchTMDBClient("/movie/popular", { page: 2 });
  await fetchTMDBClient(
    "/account/7/favorite",
    { session_id: "session" },
    { method: "POST", body: "{}", headers: { "X-Test": "retained" } },
  );
  await fetchTMDBClient("/authentication/token/new");
  assert.equal(requests[0].url.origin, "https://api.themoviedb.org");
  assert.equal(requests[0].url.searchParams.get("api_key"), "test-public-key");
  assert.equal(requests[0].options.cache, undefined);
  assert.equal(requests[1].options.cache, "no-store");
  assert.equal(
    requests[1].options.headers.get("content-type"),
    "application/json",
  );
  assert.equal(requests[1].options.headers.get("x-test"), "retained");
  assert.equal(requests[2].options.cache, "no-store");
});

test("browser error responses preserve TMDB status and tolerate non-JSON errors", async (t) => {
  t.mock.method(
    globalThis,
    "fetch",
    async () => new Response("Service unavailable", { status: 503 }),
  );
  await assert.rejects(
    fetchTMDBClient("/movie/popular"),
    (error) => error.status === 503,
  );
});

test("server transports retain credential isolation, appended core data, and ISR durations", () => {
  const source = `
    import assert from 'node:assert/strict';
    import { getPopularMovies, getMovieDetails } from './features/movies/api/server.ts';
    import { getTVDetails } from './features/tv/api/server.ts';
    import { getPersonDetails } from './features/people/api/server.ts';
    const requests = [];
    globalThis.fetch = async (url, options) => { requests.push({url:new URL(url), options}); return Response.json({id:42}); };
    await getPopularMovies(1); await getMovieDetails('42'); await getTVDetails('43'); await getPersonDetails('44');
    assert.deepEqual(requests.map(r=>r.options.next.revalidate), [86400,604800,86400,604800]);
    assert.ok(requests.every(r=>r.url.searchParams.get('api_key') === 'test-server-key'));
    assert.equal(requests[1].url.searchParams.get('append_to_response'), 'release_dates');
    assert.equal(requests[2].url.searchParams.get('append_to_response'), 'content_ratings');
    assert.equal(requests[3].url.searchParams.get('append_to_response'), 'combined_credits,external_ids');
    await assert.rejects(getMovieDetails('invalid'), e=>e.status===404);
    globalThis.fetch = async () => new Response('', {status:503});
    await assert.rejects(getMovieDetails('99'), e=>e.status===503);
  `;
  const result = spawnSync(
    process.execPath,
    [
      "--import",
      "tsx",
      "--conditions=react-server",
      "--input-type=module",
      "-e",
      source,
    ],
    {
      cwd: process.cwd(),
      encoding: "utf8",
      timeout: 15000,
      windowsHide: true,
      env: {
        ...process.env,
        TMDB_API_KEY: "test-server-key",
        NEXT_PUBLIC_TMDB_API_KEY: "test-public-key",
      },
    },
  );
  assert.equal(result.status, 0, result.stderr);
});
