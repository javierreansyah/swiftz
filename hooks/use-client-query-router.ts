"use client";
import { useCallback, useMemo } from "react";
function updateHistory(
  href: string,
  { scroll = true }: { scroll?: boolean } = {},
  replace = false,
) {
  const next = new URL(href, window.location.href);
  if (
    next.origin !== window.location.origin ||
    next.pathname !== window.location.pathname
  ) {
    throw new Error("Use the Next router for navigation to another page.");
  }
  window.history[replace ? "replaceState" : "pushState"](
    null,
    "",
    `${next.pathname}${next.search}${next.hash}`,
  );
  if (scroll) window.scrollTo(0, 0);
}

/** Same-page URL state: Next synchronizes useSearchParams without an RSC request. */
export function useClientQueryRouter() {
  const push = useCallback(
    (href: string, options?: { scroll?: boolean }) =>
      updateHistory(href, options),
    [],
  );
  const replace = useCallback(
    (href: string, options?: { scroll?: boolean }) =>
      updateHistory(href, options, true),
    [],
  );
  return useMemo(() => ({ push, replace }), [push, replace]);
}
