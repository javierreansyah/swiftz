"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { usePathname } from "next/navigation";

let nextDrawerId = 0;

export function useDrawerHistory(open: boolean, onClose: () => void) {
  const pathname = usePathname();
  const entry = useRef<{ id: number; pathname: string } | null>(null);
  const pendingClose = useRef<{ afterClose?: () => void } | null>(null);

  function close(afterClose?: () => void) {
    if (pendingClose.current) return;

    if (
      entry.current &&
      window.history.state?.swiftzDrawer === entry.current.id
    ) {
      pendingClose.current = { afterClose };
      window.history.back();
    } else {
      entry.current = null;
      onClose();
      afterClose?.();
    }
  }

  const syncHistory = useEffectEvent(() => {
    if (entry.current && entry.current.pathname !== pathname) {
      entry.current = null;
      pendingClose.current = null;
      if (open) onClose();
    } else if (open && !entry.current && pathname) {
      const id = ++nextDrawerId;
      // The URL stays shareable and Next keeps its own state on the new entry.
      window.history.pushState({ swiftzDrawer: id }, "");
      entry.current = { id, pathname };
    } else if (!open && entry.current) {
      close();
    }
  });

  useEffect(() => {
    syncHistory();
  }, [open, pathname]);

  const handlePopState = useEffectEvent((event: PopStateEvent) => {
    if (!entry.current || event.state?.swiftzDrawer === entry.current.id)
      return;

    entry.current = null;
    const afterClose = pendingClose.current?.afterClose;
    pendingClose.current = null;
    if (open) onClose();

    // Let Next process the history traversal before starting a new navigation.
    if (afterClose) queueMicrotask(afterClose);
  });

  useEffect(() => {
    const handlePop = (event: PopStateEvent) => handlePopState(event);
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  return close;
}
