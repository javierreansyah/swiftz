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
