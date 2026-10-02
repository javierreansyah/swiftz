# Application architecture

Swiftz uses the Next.js App Router with server route composition and feature-owned
interaction. Keep the data-delivery split documented in [DEPLOYMENT.md](DEPLOYMENT.md)
and the appearance contracts in [DESIGN.md](../DESIGN.md).

## Ownership

| Location               | Responsibility                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| `app`                  | Routes, metadata, static-generation declarations, server fetching, and route-level Suspense |
| `features/home`        | Homepage shelves and featured hero                                                          |
| `features/movies`      | Movie discovery, category policies, genres, and movie details                               |
| `features/tv`          | TV discovery, category policies, details, seasons, and episodes                             |
| `features/people`      | People browsing, biography, server overview, and career timeline                            |
| `features/search`      | Search controller, category navigation, typed results, and header search                    |
| `features/auth`        | Authentication provider, sessions, account actions, and media mutations                     |
| `features/library`     | Movie favorites, watchlist, ratings, and account-scoped queries                             |
| `features/media`       | Shared movie/TV cards, listing layout, filters, detail overlays, and query feedback         |
| `components/ui`        | Adapted shadcn primitives and their appearance variants                                     |
| `components/layout`    | Navigation, footer, and application shell                                                   |
| `components/providers` | Global theme, query cache, and navigation infrastructure                                    |
| `components/common`    | Generic application compositions such as carousels and pagination                           |
| `hooks`                | Domain-independent browser hooks and URL navigation                                         |
| `lib`                  | Domain-independent utilities, SEO, pagination, and shared TMDB infrastructure               |

Features may compose other features through direct imports. Shared `lib` and root
`hooks` cannot import features. Features cannot import route files or the application
shell. Keep domain-specific filters separate; share navigation mechanics and UI
compositions rather than erasing the differences between movies and television.

## Routes and client boundaries

Every `page.tsx` exports a named default function. Server pages own metadata,
server requests, route configuration, and outer Suspense fallbacks. A small page
that composes a client screen is intentional: it keeps metadata on the server and
the client boundary visible.

Client entry components have named exports ending in `Client`, in matching
kebab-case files. Resolve dynamic route parameter promises in the page, then pass
plain IDs to client screens. Screens using `useSearchParams` must be under the
appropriate server-page Suspense boundary. Local subsection boundaries remain
local when they serve a separate loading state.

The person overview stays a Server Component. Its appended credits are processed
there; only the small known-for shelf and primitive props reach client components.

## Data and URL state

- `lib/tmdb/server.ts` is guarded by `server-only`; feature server API modules
  retain request memoization, appended resources, and existing ISR durations.
- `lib/tmdb/browser.ts` sends catalog and account requests directly to TMDB.
  Authenticated requests use `no-store`, and query cancellation reaches browser
  fetches through their `AbortSignal`.
- `lib/tmdb/types` owns shared wire contracts. `PaginatedResponse<T>` describes
  the common response shape without renaming TMDB fields.
- Feature `query-options.ts` modules own typed fetch configurations. Hook wrappers,
  search counts, and category selection reuse them. All cache keys come from
  `lib/tmdb/query-keys.ts`; preserve their values when reorganizing code.
- Account mutations share media-aware options, optimistic updates, rollback, and
  account-scoped invalidation. Library placeholder data must not cross accounts
  or sessions. The library continues to display movies only.
- Movie and TV filter codecs own their existing URL keys, defaults, bounds, and
  conversion into TMDB filters. `useFilterQueryState` shares apply/reset/pagination
  navigation and resets pagination when applying filters.
- Query-only changes use the native History API. Navigation between paths uses
  the Next router. Keep visibility/open gating and detail-link prefetch behavior.
- Failed requests use retry feedback separately from successful empty results.
  Background failures retain the previously loaded content.

## Conventions and checks

Use named exports and direct imports for application modules, with no broad
barrels or compatibility aliases. Next.js special files keep their required
default exports; existing shadcn export contracts are supported.

Use named function components, kebab-case filenames, PascalCase components and
types, camelCase local values, and explicit type-only imports. TMDB and URL field
names remain compatible with their external contracts.

Prettier defines two-space indentation, double quotes, semicolons, trailing commas,
and an 80-character print width. ESLint enforces type imports, unused bindings,
application named exports, dependency boundaries, and all six existing shadcn
rules. Appearance belongs in shared variants and semantic tokens.

Use pnpm and the pinned package-manager version. Before finishing changes, run:

```sh
pnpm format:check
pnpm exec tsc --noEmit
pnpm lint
pnpm test
pnpm build
```

Tests use Node's test runner with `tsx` for TypeScript and alias resolution.
Transport tests mock requests; server tests run in an isolated process with the
React server condition. No live TMDB credentials or browser verification are
required for the unit tests. Production builds require the configured environment
and network access for their existing server-rendered resources.
