# Data delivery and Vercel deployment

## Environment

Copy `.env.example` to `.env.local` for development. Configure these in Vercel
before the production build:

Enable Corepack in Vercel with `ENABLE_EXPERIMENTAL_COREPACK=1` so `packageManager`
selects the pinned pnpm version and uses the sole `pnpm-lock.yaml`. Leave the
install command on automatic detection; use `pnpm build` for the build command.
Locally, install with `pnpm install --frozen-lockfile`. Avoid overriding the Vercel
install command with bare `pnpm install` without Corepack, which can select an
older pnpm version.

- `NEXT_PUBLIC_TMDB_API_KEY`: TMDB **v3 API key**, not a private bearer token.
  Catalog, search, secondary details, and account requests go directly from the
  browser to TMDB. This key is necessarily public; do not treat it as a secret.
- `NEXT_PUBLIC_SITE_URL`: your production origin, such as `https://swiftz.example`.
  Canonicals, sharing URLs, robots, and sitemap use it. A stable Vercel project
  production hostname is the fallback; local development falls back to localhost.
- Optional `TMDB_API_KEY`: separate server v3 credential for cached RSC requests.

Public variables are built into browser bundles. Redeploy after changing them.
Preview builds are noindex, disallow crawling, and have an empty sitemap.

## Fetching split

| Page/resource                                                                     | Delivery                                                            |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Homepage hero and popular film links                                              | One server request, 24-hour ISR                                     |
| Movie core details and US certification                                           | One appended server request, 7-day ISR                              |
| TV core details and content ratings                                               | One appended server request, 24-hour ISR                            |
| Person biography and known-for summary                                            | One appended server request, 7-day ISR                              |
| Catalog filters, pagination, search, and account data                             | Browser directly to TMDB                                            |
| Home secondary shelves, galleries, reviews, recommendations, full career timeline | Browser; visibility/open-gated                                      |
| Sitemap                                                                           | Up to 60 popular detail URLs plus public landing pages, daily cache |

Detail routes use on-demand static generation rather than prebuilding or crawling
the catalog. Core fetches are request-memoized across metadata and page rendering.
The person page computes a small known-for summary on the server, but does not
serialize the entire combined-credits response into RSC; the full timeline fetches
directly from TMDB when visible.
Only a genuine TMDB 404 produces a not-found page; outages are errors, not cached
"missing" content. Server revalidation failures can retain the previous good page.

Query-only navigation uses the native History API, which Next synchronizes with
`useSearchParams`; filters and pagination do not request another RSC payload.
Use the Next router for **different-page** navigation. Detail card links disable
automatic prefetch so merely seeing a carousel does not generate all detail pages.

Routes compose feature-owned screens. Server pages own metadata and outer
Suspense boundaries; dynamic route parameters are resolved before passing plain
IDs to client screens. Feature query-options modules and centralized query keys
share fetch behavior across hooks, search counts, and category selection. See
[ARCHITECTURE.md](ARCHITECTURE.md) for module ownership and conventions.

React Query coalesces shared requests, caches catalog responses for 30 minutes,
and garbage-collects inactive queries after an hour. Search requests consume abort
signals, and category pages enable only the selected endpoint. Count badges reuse
the cached first-page search results instead of duplicating the same requests.
GET requests omit JSON Content-Type to avoid unnecessary CORS preflight requests.
Private requests bypass the browser HTTP cache; session-keyed React Query caching
still allows UI reuse. Requests time out after 15 seconds where supported.

## Images

`components/ui/image.tsx` emits native responsive images. TMDB supplies resize
URLs, not prebuilt srcsets: `lib/tmdb/images.ts` builds width candidates from its
CDN transforms. The browser chooses using `sizes`, viewport width, and pixel
density. Always specify accurate `sizes` for fill images. SVG, local assets,
Gravatar, and YouTube URLs pass through without TMDB transforms.

No image request goes through `/_next/image`; Next optimization is also disabled
as a safeguard. Parent aspect ratios reserve space for fill images. Hero images
are high-priority, ordinary images are lazy, and unseen hero slides are not mounted
until selected. Appearance belongs in shared image variants, not consumers.

## SEO and limits

Public pages have unique titles/descriptions, canonical URLs, Open Graph, and
Twitter metadata. Core detail content is server-rendered; interactive catalog
results intentionally remain client-rendered. Movie, TV, person, and website pages
emit escaped JSON-LD. Search, library, authentication, and auxiliary movie pages
are noindex and excluded from the sitemap. Query-string filter URLs are blocked
to prevent a combinatorial crawl; canonical public pages remain crawlable.

The bounded sitemap is **not** a promise to list every TMDB title. Additional
titles are discovered through normal public links. There is no fabricated
`lastModified` timestamp or expensive full-catalog enumeration.

Client fetching reduces Vercel compute and TMDB-response transfer through your
deployment. It does not eliminate Vercel bandwidth for HTML/RSC/JS, ISR cache
usage, or compute on cold detail requests. Monitor actual usage in Vercel and
follow current [Hobby plan limits](https://vercel.com/docs/plans/hobby) and TMDB
API/attribution requirements. Never proxy all public requests just to hide a key
without accepting the resulting function and bandwidth costs.

## Checks

### Transfer budget and server boundaries

Movie and TV routes compose static headings, plots, genres, and facts on the
server and pass rendered content slots into the interactive detail screen. The
client screen receives an explicit small payload, not a full TMDB response.
Homepage shelf mapping also runs on the server. These changes add no API requests.
Keep the seven-day movie/person and daily TV/homepage intervals aligned between
route declarations and fetches. Do not add short-lived fetches to these routes.

After deployment, verify repeated requests to the same public detail URL hit the
cache. Record HTML/RSC sizes and the highest-traffic paths in Vercel. Compare a
representative week of daily usage deltas and visits before expanding server
fetching. Initial planning ceilings are 7 GB Fast Origin Transfer and 700,000 CDN
(formerly Edge) Requests per 30 days. Project each metric as measured usage divided
by days measured, multiplied by 30; also monitor function invocations and ISR units.
These are operating targets, not guarantees under unknown traffic. Cache hits
still count as CDN requests. Bot protection must be checked in the dashboard.

Payload selection reduces serialization; it does not shrink the original TMDB
response stored in the fetch cache. Keep galleries, full credits, reviews, and
episode details on the existing direct browser paths.

Local production verification on October 29, 2026 returned `MISS` then `HIT`
for `/movie/550`, `/tv/1399`, and `/person/287`, with cache headers of seven days,
one day, and seven days respectively. Uncompressed HTML/RSC sizes were approximately
100/33 KB, 125/37 KB, and 89/35 KB. These are local observations, not Vercel billing
measurements or a before/after comparison of complete responses. For representative
live TMDB responses, selected JSON was 560 vs 1702 bytes for the movie, 5007 vs
7164 bytes for the TV show, and 4033 vs 5370 bytes for the eight homepage hero
items. Static markup is still delivered alongside these smaller client inputs.

- `pnpm format:check`
- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm test` (Node test runner with tsx)
- `pnpm build` (requires a working TMDB key; checks static route generation)

No browser verification is required for these checks.
