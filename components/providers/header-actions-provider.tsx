"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

const HeaderActionsContext = createContext<{
  target: HTMLDivElement | null;
  setTarget: (target: HTMLDivElement | null) => void;
} | null>(null);

export function HeaderActionsProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<HTMLDivElement | null>(null);

  return (
    <HeaderActionsContext.Provider value={{ target, setTarget }}>
      {children}
    </HeaderActionsContext.Provider>
  );
}

export function MobileHeaderActionsSlot() {
  const actions = useContext(HeaderActionsContext);

  return <div ref={actions?.setTarget} className="empty:hidden lg:hidden" />;
}

export function MobileHeaderActions({ children }: { children: ReactNode }) {
  const target = useContext(HeaderActionsContext)?.target;

  return target ? createPortal(children, target) : null;
}
