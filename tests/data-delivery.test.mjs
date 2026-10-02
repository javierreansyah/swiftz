import test from "node:test";
import assert from "node:assert/strict";
import { getTMDBSrcSet, tmdbImageUrl } from "../lib/tmdb-images.ts";
import { parsePage } from "../lib/pagination.ts";
import { pageMetadata, siteUrl, isPreview, serializeStructuredData } from "../lib/seo.ts";
import { TMDBError, isTMDBNotFound } from "../lib/tmdb-error.ts";

test("TMDB srcsets use direct CDN width transforms and preserve the image path", () => {
  const candidates = getTMDBSrcSet("https://image.tmdb.org/t/p/h632/portrait.jpg").split(", ");
  assert.equal(candidates.length, 8);
  for (const candidate of candidates) {
    const match = /^https:\/\/image\.tmdb\.org\/t\/p\/w(\d+)\/portrait\.jpg (\d+)w$/.exec(candidate);
    assert.ok(match);
    assert.equal(match[1], match[2]);
  }
  assert.equal(new Set(candidates).size, candidates.length);
  assert.equal(getTMDBSrcSet("https://image.tmdb.org/t/p/original/portrait.jpg"), candidates.join(", "));
});

test("non-TMDB images, SVGs, and signed/query URLs are not rewritten", () => {
  for (const src of ["/assets/local.png", "https://img.youtube.com/vi/123/hqdefault.jpg", "https://image.tmdb.org/t/p/original/logo.svg", "https://image.tmdb.org/t/p/w500/photo.jpg?token=123"]) {
    assert.equal(getTMDBSrcSet(src), undefined);
  }
  assert.equal(tmdbImageUrl(null), undefined);
  assert.equal(tmdbImageUrl("/poster.jpg", 780), "https://image.tmdb.org/t/p/w780/poster.jpg");
});

test("pagination rejects invalid pages and respects TMDB's 500-page limit", () => {
  for (const value of [null, "", "0", "-4", "NaN", "Infinity", "1.5", "999999999999999999999"]) assert.equal(parsePage(value), 1);
  assert.equal(parsePage("2"), 2);
  assert.equal(parsePage("500"), 500);
  assert.equal(parsePage("501"), 500);
});

test("page metadata uses canonical production URLs and explicit indexing rules", () => {
  const metadata = pageMetadata({ title: "Popular Movies", description: "Popular films", path: "/movie/popular" });
  assert.equal(metadata.alternates.canonical, `${siteUrl}/movie/popular`);
  assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
  assert.equal(metadata.robots.index, !isPreview);
  assert.equal(pageMetadata({ title: "Search", description: "Search", path: "/search", noIndex: true }).robots.index, false);
});

test("only genuine TMDB not-found errors result in 404s", () => {
  assert.equal(isTMDBNotFound(new TMDBError("Missing", 404)), true);
  for (const error of [new TMDBError("Outage", 503), new TMDBError("Rate limit", 429), new TMDBError("Unauthorized", 401), new Error("Network failure")]) {
    assert.equal(isTMDBNotFound(error), false);
  }
});

test("JSON-LD cannot break out of its script element", () => {
  const data = { name: "</script><script>alert(1)</script>" };
  const serialized = serializeStructuredData(data);
  assert.equal(serialized.includes("<"), false);
  assert.deepEqual(JSON.parse(serialized), data);
});
