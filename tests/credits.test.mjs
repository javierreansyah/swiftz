import test from "node:test";
import assert from "node:assert/strict";
import { prepareCredits, filterCredits } from "../features/people/credits.ts";

const credits = {
  id: 1,
  cast: [
    {
      id: 10,
      title: "Early",
      release_date: "2020-01-01",
      character: "Lead",
      media_type: "movie",
    },
    {
      id: 11,
      name: "Upcoming",
      character: "Guest",
      media_type: "tv",
      episode_count: 2,
    },
    {
      id: 12,
      title: "Later",
      release_date: "2020-12-01",
      character: "Lead",
      media_type: "movie",
    },
  ],
  crew: [
    {
      id: 13,
      title: "Newest",
      release_date: "2025-01-01",
      department: "Directing",
      job: "Director",
      media_type: "movie",
    },
    {
      id: 14,
      name: "Series",
      first_air_date: "2022-06-01",
      department: "Writing",
      job: "Writer",
      media_type: "tv",
    },
    {
      id: 10,
      title: "Early",
      release_date: "2020-01-01",
      department: "Directing",
      job: "Director",
      media_type: "movie",
    },
  ],
};

test("credits retain upcoming-first and descending date order without mutating the response", () => {
  const original = structuredClone(credits);
  const { items, departments } = prepareCredits(credits);
  assert.deepEqual(
    items.map((item) => item.id),
    [11, 13, 14, 12, 10, 10],
  );
  assert.deepEqual(departments, ["Acting", "Directing", "Writing"]);
  assert.equal(items[0].characterOrJob, "as Guest");
  assert.equal(items[0].episodeCount, 2);
  assert.equal(items[2].releaseYear, "2022");
  assert.deepEqual(credits, original);
});

test("credit filters combine department, media, and title or role search while retaining order", () => {
  const { items } = prepareCredits(credits);
  const ids = (department, mediaType, query) =>
    filterCredits(items, department, mediaType, query).map((item) => item.id);
  assert.deepEqual(ids("acting", "movie", "LEAD"), [12, 10]);
  assert.deepEqual(ids("all", "tv", ""), [11, 14]);
  assert.deepEqual(ids("Directing", "all", "director"), [13, 10]);
  assert.deepEqual(ids("all", "all", "early"), [10, 10]);
  assert.deepEqual(
    ids("all", "all", "   "),
    items.map((item) => item.id),
  );
  assert.deepEqual(ids("Writing", "movie", ""), []);
  assert.deepEqual(
    items.map((item) => item.id),
    [11, 13, 14, 12, 10, 10],
  );
});

test("empty and incomplete credits preserve display fallbacks", () => {
  assert.deepEqual(prepareCredits({ id: 1, cast: [], crew: [] }), {
    items: [],
    departments: [],
  });
  const { items } = prepareCredits({
    id: 1,
    cast: [{ id: 2 }],
    crew: [{ id: 3 }],
  });
  assert.deepEqual(
    items.map((item) => [
      item.title,
      item.characterOrJob,
      item.department,
      item.mediaType,
    ]),
    [
      ["Untitled", "Cast", "Acting", "movie"],
      ["Untitled", "Crew", "Production", "movie"],
    ],
  );
});
