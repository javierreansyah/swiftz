"use client";

import React, { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface FilterMobileDrawerProps {
  title: string;
  activeCount: number;
  children: (helpers: { close: () => void }) => React.ReactNode;
}

export function FilterMobileDrawer({
  title,
  activeCount,
  children,
}: FilterMobileDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-3.5 text-primary" />
              <span>{title}</span>
            </div>
            {activeCount > 0 ? (
              <span className="rounded-xl bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                {activeCount} active
              </span>
            ) : (
              <span className="text-muted-foreground">None active</span>
            )}
          </Button>
        </SheetTrigger>

        {/* Full-width mobile filter screen */}
        <SheetContent surface="fullscreen"
          side="bottom"
          showCloseButton={false}
          className="inset-0 flex size-full max-h-screen max-w-full flex-col sm:max-w-full"
        >
          {/* Top Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-border/70 px-6 py-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-primary" />
              <SheetTitle>
                {title}
              </SheetTitle>
              {activeCount > 0 && (
                <span className="rounded-xl bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                  {activeCount} active
                </span>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={close}
            >
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {/* Scrollable Filter Options Body */}
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            {children({ close })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default FilterMobileDrawer;
