import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

// Shallow checks exercise component handlers and effects without a browser.
function component(file, name, mocks = {}, globals = {}) {
  const slots = [];
  const dependencies = [];
  let cursor, effects, dirty;
  const react = {
    createContext: () => ({ Provider: "Provider" }),
    useState(initial) {
      const index = cursor++;
      if (!(index in slots))
        slots[index] = typeof initial === "function" ? initial() : initial;
      return [
        slots[index],
        (value) => {
          const next =
            typeof value === "function" ? value(slots[index]) : value;
          if (!Object.is(next, slots[index])) {
            slots[index] = next;
            dirty = true;
          }
        },
      ];
    },
    useEffect(effect, deps) {
      const index = cursor++;
      if (
        !deps ||
        !dependencies[index] ||
        deps.some((value, i) => !Object.is(value, dependencies[index][i]))
      ) {
        dependencies[index] = deps;
        effects.push(effect);
      }
    },
    useMemo: (fn) => {
      cursor++;
      return fn();
    },
    useCallback: (fn) => {
      cursor++;
      return fn;
    },
    useRef: (initial) => react.useState({ current: initial })[0],
  };
  const element = (type, props) => ({ type, props });
  const stub = new Proxy({}, { get: (_target, property) => property });
  const exported = {};
  const source = ts.transpileModule(
    readFileSync(new URL(`../${file}`, import.meta.url), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
      },
    },
  ).outputText;
  vm.runInNewContext(source, {
    exports: exported,
    require: (id) =>
      id === "react"
        ? react
        : id === "react/jsx-runtime"
          ? { jsx: element, jsxs: element }
          : mocks[id] || stub,
    setTimeout: () => 0,
    clearTimeout() {},
    window: { scrollY: 0, addEventListener() {}, removeEventListener() {} },
    document: {
      getElementById: () => null,
      addEventListener() {},
      removeEventListener() {},
    },
    ...globals,
  });
  return (props, render = exported[name]) => {
    let tree;
    for (let pass = 0; pass < 10; pass++) {
      cursor = 0;
      effects = [];
      dirty = false;
      tree = render(props);
      effects.forEach((effect) => effect());
      if (!dirty) return tree;
    }
    throw new Error("Component did not settle");
  };
}

test("legacy demo sessions are cleared before account requests are enabled", () => {
  const storage = new Map([
    ["swiftz_tmdb_session", "swiftz_demo_session_active"],
    ["swiftz_tmdb_user", JSON.stringify({ id: 999999 })],
  ]);
  let requests = 0;
  const render = component(
    "features/auth/auth-provider.tsx",
    "AuthProvider",
    {
      "@tanstack/react-query": { useQueryClient: () => ({ clear() {} }) },
      "@/features/auth/api/browser": { getAccountDetails: () => requests++ },
    },
    {
      localStorage: {
        getItem: (key) => storage.get(key) ?? null,
        removeItem: (key) => storage.delete(key),
      },
    },
  );
  const tree = render({ children: null });
  assert.equal(storage.size, 0);
  assert.equal(requests, 0);
  assert.equal(tree.props.value.isAuthenticated, false);
  assert.equal(tree.props.value.sessionId, null);
  assert.equal("loginDemo" in tree.props.value, false);
});

test("reopening a season card restores that season after changing seasons inside the sheet", () => {
  let requested;
  const render = component(
    "features/tv/detail/modals/tv-seasons-modal.tsx",
    "TVSeasonsModal",
    {
      "@/lib/utils": { cn: () => "" },
      "@/features/tv/hooks/queries": {
        useTVSeasonQuery: (_id, season) => {
          requested = season;
          return { data: { episodes: [] } };
        },
      },
    },
  );
  const props = {
    isOpen: true,
    initialSeasonNumber: 1,
    onClose() {},
    show: {
      id: 42,
      name: "Show",
      seasons: [
        { id: 1, name: "Season 1", season_number: 1 },
        { id: 2, name: "Season 2", season_number: 2 },
      ],
    },
  };
  render(props).props.mobileControls.props.onChange("2");
  render(props);
  assert.equal(requested, 2);
  render({ ...props, isOpen: false });
  render(props);
  assert.equal(requested, 1);
});

test("an external photo thumbnail clears old filters so its index identifies the clicked image", () => {
  const render = component(
    "features/media/components/photos-modal.tsx",
    "PhotosModal",
    {
      "@/lib/utils": { cn: () => "" },
    },
    { requestAnimationFrame: () => 0, cancelAnimationFrame() {} },
  );
  const props = {
    isOpen: true,
    onClose() {},
    images: {
      backdrops: [{ file_path: "/backdrop.jpg", width: 100, height: 50 }],
      posters: [{ file_path: "/poster.jpg", width: 50, height: 100 }],
    },
  };
  let tree = render(props);
  nodes(tree.props.sidebar)
    .find((n) => n.type === "Button" && text(n).includes("Posters (2:3)"))
    .props.onClick();
  render(props);
  render({ ...props, isOpen: false });
  tree = render({ ...props, initialPhotoIndex: 0 });
  assert.ok(
    nodes(tree).some(
      (n) =>
        n.props?.src === "https://image.tmdb.org/t/p/original/backdrop.jpg",
    ),
  );
  assert.ok(
    !nodes(tree).some(
      (n) => n.props?.src === "https://image.tmdb.org/t/p/original/poster.jpg",
    ),
  );
});

test("header searches use local navigation on search and route navigation from other pages", () => {
  let pathname = "/search";
  const local = [],
    routes = [];
  const render = component(
    "features/search/components/header-search.tsx",
    "HeaderSearch",
    {
      "next/navigation": {
        useRouter: () => ({ push: (href) => routes.push(href) }),
        usePathname: () => pathname,
        useSearchParams: () => new URLSearchParams({ q: "first" }),
      },
      "@/hooks/use-client-query-router": {
        useClientQueryRouter: () => ({ push: (href) => local.push(href) }),
      },
      "@/features/search/hooks/queries": {
        useMultiSearchQuery: () => ({ data: { results: [] } }),
      },
      "@/lib/utils": { cn: () => "" },
    },
  );
  let tree = render({});
  nodes(tree)
    .find((n) => n.type === "Input")
    .props.onChange({ target: { value: "new query" } });
  tree = render({});
  nodes(tree)
    .find((n) => n.type === "form")
    .props.onSubmit({ preventDefault() {} });
  assert.deepEqual(local, ["/search?q=new%20query"]);
  assert.equal(routes.length, 0);
  pathname = "/movie/42";
  tree = render({});
  nodes(tree)
    .find((n) => n.type === "Input")
    .props.onChange({ target: { value: "other" } });
  tree = render({});
  nodes(tree)
    .find((n) => n.type === "form")
    .props.onSubmit({ preventDefault() {} });
  assert.deepEqual(routes, ["/search?q=other"]);
  const drawer = nodes(tree).find((n) => n.type === "DrawerContent");
  assert.equal(drawer.props.surface, "search");
});

test("search drawers can shrink for the keyboard while detail drawers retain their minimum height", () => {
  const render = component("components/ui/drawer.tsx", "DrawerContent", {
    vaul: {
      Drawer: { Content: "Content", Portal: "Portal", Overlay: "Overlay" },
    },
    "@/lib/utils": { cn: (...classes) => classes.filter(Boolean).join(" ") },
  });
  const content = (surface) =>
    nodes(render({ surface })).find((n) => n.type === "Content").props
      .className;
  assert.match(content("search"), /\bmin-h-0\b/);
  assert.doesNotMatch(content("search"), /\bmin-h-detail-sheet\b/);
  assert.match(content("detail"), /\bmin-h-detail-sheet\b/);
});

test("birthdays and age calculations use UTC calendar dates in western time zones", () => {
  class WesternDate extends Date {
    constructor(value) {
      super(value ?? "2020-12-18T12:00:00Z");
    }
    toLocaleDateString(locale, options) {
      return super.toLocaleDateString(locale, {
        timeZone: "America/Los_Angeles",
        ...options,
      });
    }
    getFullYear() {
      return 2020;
    }
    getMonth() {
      return 11;
    }
    getDate() {
      return 17;
    }
  }
  const render = component(
    "features/people/components/person-overview.tsx",
    "PersonOverview",
    {},
    { Date: WesternDate },
  );
  const tree = render({
    person: { id: 42, name: "Person", birthday: "1963-12-18" },
    credits: { cast: [], crew: [] },
    externalIds: {},
  });
  assert.match(text(tree), /December 18, 1963 \(57 years old\)/);
});

function nodes(tree) {
  if (Array.isArray(tree)) return tree.flatMap(nodes);
  if (!tree || typeof tree !== "object") return [];
  return [tree, ...nodes(tree.props?.children)];
}
function text(tree) {
  if (Array.isArray(tree))
    return tree.map(text).join(" ").replace(/\s+/g, " ").trim();
  if (!tree || typeof tree === "boolean") return "";
  return typeof tree === "object" ? text(tree.props?.children) : String(tree);
}

test("discovery shelves keep their carousel shell while results load", () => {
  const render = component(
    "features/media/components/media-carousel-row.tsx",
    "MediaCarouselRow",
  );
  const props = {
    title: "Popular Movies",
    viewAllHref: "/movie/popular",
    type: "movie",
  };
  const loading = render({ ...props, isLoading: true });
  const loaded = render({
    ...props,
    isLoading: false,
    items: [{ id: 42 }],
  });
  assert.equal(loading.type, "ContentCarousel");
  assert.equal(loading.type, loaded.type);
  assert.deepEqual(loading.props.action, loaded.props.action);
  assert.equal(
    nodes(loading).filter((node) => node.type === "Skeleton").length,
    6,
  );
  assert.equal(
    nodes(loaded).filter((node) => node.type === "CatalogCard").length,
    1,
  );
  assert.equal(render({ ...props, isLoading: false, items: [] }), null);
});

test("sign-in reserves its final button geometry while authentication loads", () => {
  let logins = 0;
  const auth = {
    isLoading: true,
    isAuthenticated: false,
    user: null,
    login: () => logins++,
  };
  const render = component(
    "components/layout/user-nav-dropdown.tsx",
    "UserNavDropdown",
    { "@/features/auth/auth-provider": { useAuth: () => auth } },
  );
  const loading = render({});
  assert.equal(loading.type, "Button");
  assert.equal(loading.props.disabled, true);
  auth.isLoading = false;
  const loaded = render({});
  assert.equal(loaded.props.disabled, false);
  assert.equal(loading.props.size, loaded.props.size);
  assert.equal(text(loading), text(loaded));
  loaded.props.onClick();
  assert.equal(logins, 1);
});

test("trending keeps its header and selection while preserving visibility gating", () => {
  const enabled = [];
  const movieQuery = { data: undefined };
  const tvQuery = { data: undefined };
  const render = component(
    "features/home/components/trending-section.tsx",
    "TrendingSection",
    {
      "@/features/movies/hooks/queries": {
        useTrendingMoviesQuery: (_page, value) => {
          enabled.push(["movie", value]);
          return movieQuery;
        },
      },
      "@/features/tv/hooks/queries": {
        useTrendingTVShowsQuery: (_page, value) => {
          enabled.push(["tv", value]);
          return tvQuery;
        },
      },
    },
  );
  const hidden = render({ enabled: false });
  assert.deepEqual(enabled.slice(-2), [
    ["movie", false],
    ["tv", false],
  ]);
  const loading = render({ enabled: true });
  assert.deepEqual(enabled.slice(-2), [
    ["movie", true],
    ["tv", false],
  ]);
  assert.deepEqual(hidden.props.tabs, loading.props.tabs);
  loading.props.onTabChange("tv");
  const loadingTV = render({ enabled: true });
  assert.deepEqual(enabled.slice(-2), [
    ["movie", false],
    ["tv", true],
  ]);
  tvQuery.data = { results: [{ id: 42, name: "Series" }] };
  const loaded = render({ enabled: true });
  assert.deepEqual(loadingTV.props.tabs, loaded.props.tabs);
  assert.equal(loadingTV.props.activeTab, loaded.props.activeTab);
  assert.equal(loadingTV.props.action.href, loaded.props.viewAllHref);
});

test("ratings follow late account data, discard cancelled edits, and expose save failures", () => {
  const writes = [];
  const mutation = {
    reset() {},
    mutate: (value) => writes.push(value),
    isPending: false,
    isError: false,
  };
  const render = component(
    "features/media/components/media-rating-dialog.tsx",
    "MediaRatingDialog",
    {
      "@/features/auth/hooks/queries": { useRatingMutation: () => mutation },
    },
  );
  const props = {
    isOpen: true,
    mediaId: 42,
    title: "Film",
    sessionId: "session",
    onClose() {},
    currentRating: null,
  };
  render(props);
  let tree = render({ ...props, currentRating: 3 });
  assert.match(text(tree), /Rate 3/);
  nodes(tree)
    .find((node) => node.props?.["aria-label"] === "Rate 5 stars")
    .props.onClick();
  assert.match(text(render({ ...props, currentRating: 3 })), /Rate 5/);
  render({ ...props, isOpen: false, currentRating: 3 });
  tree = render({ ...props, currentRating: 3 });
  nodes(tree)
    .find((node) => node.type === "Button" && text(node).includes("Rate 3"))
    .props.onClick();
  assert.equal(writes[0].rating, 3);
  mutation.isError = true;
  assert.match(
    text(render({ ...props, currentRating: 3 })),
    /Could not save your rating/,
  );
  mutation.isPending = true;
  assert.ok(
    nodes(render({ ...props, currentRating: 3 }))
      .filter((node) => node.type === "Button")
      .every((node) => node.props.disabled),
  );
});

for (const [folder, kind, name] of [
  ["movies", "movie", "Movie"],
  ["tv", "tv", "TV"],
]) {
  test(`${kind} rating entry points require sign-in and detail failures retain retry`, () => {
    let logins = 0,
      retries = 0;
    const failed = { data: undefined, isError: true, refetch: () => retries++ };
    const queries = new Proxy({}, { get: () => () => failed });
    const render = component(
      `features/${folder}/detail/${kind}-detail-client.tsx`,
      `${name}DetailClient`,
      {
        [`@/features/${folder}/hooks/queries`]: queries,
        "@/features/auth/hooks/queries": {
          useMediaAccountStatesQuery: () => ({ data: undefined }),
        },
        "@/features/auth/auth-provider": {
          useAuth: () => ({
            sessionId: null,
            isAuthenticated: false,
            login: () => logins++,
          }),
        },
        "@/hooks/use-visible": {
          useVisible: () => ({ ref: null, visible: true }),
        },
      },
    );
    const media = { id: 42, title: "Film", name: "Series", seasons: [] };
    const props = kind === "movie" ? { movie: media } : { show: media };
    const tree = render(props);
    nodes(tree)
      .find((node) => node.type === `${name}Hero`)
      .props.onOpenRating();
    assert.equal(logins, 1);
    assert.equal(
      nodes(render(props)).find((node) => node.type === "MediaRatingDialog")
        .props.isOpen,
      false,
    );
    nodes(tree)
      .find((node) => node.type === "QueryFeedback")
      .props.onRetry();
    assert.equal(retries, 1);
  });
}

test("review pagination remains reachable when this page has no filter matches", () => {
  const pages = [];
  const render = component(
    "features/media/components/reviews-modal.tsx",
    "ReviewsModal",
    {
      "@/features/movies/hooks/queries": {
        useMovieReviewsQuery: (_id, page) => {
          pages.push(page);
          return {
            data: { results: [], page, total_pages: 3, total_results: 41 },
            isLoading: false,
            isError: false,
          };
        },
      },
      "@/features/tv/hooks/queries": { useTVReviewsQuery: () => ({}) },
    },
  );
  const props = { isOpen: true, movie: { id: 42, title: "Film" } };
  const tree = render(props);
  nodes(tree)
    .find((node) => node.type === "PaginationSystem")
    .props.onPageChange(2);
  const next = render(props);
  assert.equal(pages.at(-1), 2);
  assert.equal(
    nodes(next).find((node) => node.type === "PaginationSystem").props
      .currentPage,
    2,
  );
  assert.match(text(next), /Sorting and filters apply to this page/);
});

test("collection results open the existing sheet and keep it mounted when closed", () => {
  const render = component(
    "features/search/components/search-results.tsx",
    "SearchResults",
  );
  const result = render({
    dataset: { category: "collections", items: [{ id: 12, name: "Saga" }] },
    rawQuery: "Saga",
  });
  let tree = render(result.props, result.type);
  nodes(tree)
    .find((node) => node.type === "MediaCard")
    .props.onClick();
  tree = render(result.props, result.type);
  let sheet = nodes(tree).find((node) => node.type === "CollectionModal");
  assert.equal(sheet.props.collectionId, 12);
  assert.equal(sheet.props.isOpen, true);
  sheet.props.onClose();
  sheet = nodes(render(result.props, result.type)).find(
    (node) => node.type === "CollectionModal",
  );
  assert.equal(sheet.props.isOpen, false);
});

test("collections use API text and numbered media cards that retain release order when searched", () => {
  let closes = 0;
  const part = (id, title, release_date) => ({
    id,
    title,
    release_date,
    overview: "",
    poster_path: null,
    vote_average: 7,
  });
  const collection = {
    name: "API Collection Name",
    overview: "API collection overview",
    backdrop_path: null,
    parts: [part(2, "Second", "2022-01-01"), part(1, "First", "2020-01-01")],
  };
  const render = component(
    "features/movies/detail/modals/collection-modal.tsx",
    "CollectionModal",
    {
      "@/features/movies/hooks/queries": {
        useMovieCollectionQuery: () => ({ data: collection }),
      },
    },
  );
  const props = {
    isOpen: true,
    collectionId: 42,
    currentMovieId: 2,
    onClose: () => closes++,
  };
  const tree = render(props);
  assert.equal(tree.props.title, collection.name);
  assert.ok(
    nodes(tree).some(
      (node) => node.type === "h2" && text(node) === collection.name,
    ),
  );
  assert.match(text(tree), /API collection overview/);
  assert.doesNotMatch(text(tree), /Franchise|Complete Saga/i);
  const cards = nodes(tree).filter((node) => node.type === "MediaCard");
  assert.deepEqual(
    cards.map((card) => card.props.title),
    ["First", "Second"],
  );
  assert.equal(cards[0].props.badge, "1");
  assert.equal(cards[1].props.badge, "2 · Currently viewing");
  tree.props.search.onChange("Second");
  const card = nodes(render(props)).find((node) => node.type === "MediaCard");
  assert.equal(card.props.badge, "2 · Currently viewing");
  assert.equal(card.props.href, "/movie/2");
  card.props.onClick();
  assert.equal(closes, 1);
  assert.equal(collection.parts[0].id, 2);
});

test("the collection card loads its API description when approaching the viewport", () => {
  let visible = false;
  const requests = [];
  const render = component(
    "features/movies/detail/sections/movie-collection-section.tsx",
    "MovieCollectionSection",
    {
      "@/hooks/use-visible": { useVisible: () => ({ ref: null, visible }) },
      "@/features/movies/hooks/queries": {
        useMovieCollectionQuery: (id, enabled) => {
          requests.push([id, enabled]);
          return {
            data: enabled ? { overview: "API description" } : undefined,
          };
        },
      },
    },
  );
  const props = {
    collection: { id: 42, name: "Collection name" },
    onOpenCollectionModal() {},
  };
  assert.doesNotMatch(text(render(props)), /API description/);
  visible = true;
  assert.match(text(render(props)), /API description/);
  assert.deepEqual(requests, [
    [42, false],
    [42, true],
  ]);
});

test("header search follows query-only URL changes", () => {
  let query = "first";
  const render = component(
    "features/search/components/header-search.tsx",
    "HeaderSearch",
    {
      "next/navigation": {
        useRouter: () => ({}),
        usePathname: () => "/search",
        useSearchParams: () => new URLSearchParams({ q: query }),
      },
      "@/features/search/hooks/queries": {
        useMultiSearchQuery: () => ({ data: { results: [] } }),
      },
      "@/hooks/use-client-query-router": {
        useClientQueryRouter: () => ({ push() {} }),
      },
      "@/lib/utils": { cn: () => "" },
    },
  );
  assert.equal(
    nodes(render({})).find((node) => node.type === "Input").props.value,
    "first",
  );
  query = "second";
  assert.equal(
    nodes(render({})).find((node) => node.type === "Input").props.value,
    "second",
  );
});

test("episode failures offer retry instead of claiming that episodes do not exist", () => {
  let retries = 0;
  const render = component(
    "features/tv/detail/modals/tv-seasons-modal.tsx",
    "TVSeasonsModal",
    {
      "@/features/tv/hooks/queries": {
        useTVSeasonQuery: () => ({
          data: undefined,
          isLoading: false,
          isError: true,
          refetch: () => retries++,
        }),
      },
      "@/lib/utils": { cn: () => "" },
    },
  );
  const tree = render({
    isOpen: true,
    show: { id: 42, name: "Series", seasons: [] },
    onClose() {},
  });
  assert.doesNotMatch(text(tree), /No episode data available/);
  nodes(tree)
    .find((node) => node.type === "QueryFeedback")
    .props.onRetry();
  assert.equal(retries, 1);
});

test("death dates have no age annotation", () => {
  const render = component(
    "features/people/components/person-overview.tsx",
    "PersonOverview",
  );
  const tree = render({
    person: {
      id: 42,
      name: "Person",
      birthday: "1900-01-01",
      deathday: "2008-07-16",
    },
    credits: { cast: [], crew: [] },
    externalIds: {},
  });
  assert.ok(
    nodes(tree).some((node) => node.props?.children === "July 16, 2008"),
  );
  assert.doesNotMatch(text(tree), /years old/);
});
