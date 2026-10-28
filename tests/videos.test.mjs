import test from "node:test";
import assert from "node:assert/strict";
import { prioritizePlayableVideos } from "../features/media/videos.ts";

test("Spider-Man's Official Trailer precedes its official Final and New trailers", () => {
  const videos = ["Final Trailer", "New Trailer", "Official Trailer"].map(
    (name) => ({
      name,
      key: name,
      site: "YouTube",
      type: "Trailer",
      official: true,
    }),
  );
  assert.deepEqual(
    prioritizePlayableVideos(videos).map(({ name }) => name),
    ["Official Trailer", "Final Trailer", "New Trailer"],
  );
  assert.equal(
    prioritizePlayableVideos([
      videos[0],
      { ...videos[2], name: " OFFICIAL TRAILER " },
    ])[0].key,
    "Official Trailer",
  );
  assert.equal(
    prioritizePlayableVideos([{ ...videos[2], official: false }, videos[0]])[0]
      .name,
    "Final Trailer",
  );
});

test("playback prioritizes official YouTube trailers without mutating API order", () => {
  const video = (key, type, official = false, site = "YouTube") => ({
    key,
    type,
    official,
    site,
  });
  const videos = [
    video("featurette", "Featurette", true),
    video("unofficial", "Trailer"),
    video("teaser", "Teaser", true),
    video("vimeo", "Trailer", true, "Vimeo"),
    video("official", "Trailer", true),
    video("clip", "Clip"),
    video("official-2", "trailer", true, "youtube"),
    video("", "Trailer", true),
  ];
  const original = [...videos];
  assert.deepEqual(
    prioritizePlayableVideos(videos).map(({ key }) => key),
    ["official", "official-2", "unofficial", "teaser", "clip", "featurette"],
  );
  assert.deepEqual(videos, original);
});

test("playback falls back to trailers, teasers, clips, then other YouTube videos", () => {
  const videos = [
    { key: "other", site: "YouTube", type: "Featurette", official: true },
    { key: "clip", site: "YouTube", type: "Clip", official: true },
    { key: "teaser", site: "YouTube", type: "Teaser", official: false },
    { key: "trailer", site: "YouTube", type: "Trailer", official: false },
  ];
  for (const expected of ["trailer", "teaser", "clip", "other"]) {
    const ordered = prioritizePlayableVideos(videos);
    assert.equal(ordered[0].key, expected);
    videos.splice(
      videos.findIndex(({ key }) => key === expected),
      1,
    );
  }
  assert.deepEqual(prioritizePlayableVideos([]), []);
  assert.deepEqual(
    prioritizePlayableVideos([
      { key: "vimeo", site: "Vimeo", type: "Trailer" },
    ]),
    [],
  );
});
