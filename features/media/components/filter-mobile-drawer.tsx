"use client";
import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
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
            size="default"
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-primary" />
              <span>{title}</span>
            </div>
            {activeCount > 0 ? (
              <span className="rounded-xl bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                {activeCount} active
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">None active</span>
            )}
          </Button>
        </SheetTrigger>

        {/* 70% height mobile bottom sheet */}
        <SheetContent
          surface="filter"
          side="bottom"
          showCloseButton={false}
          className="inset-x-0 bottom-0 flex flex-col overflow-hidden"
        >
          <SheetTitle className="sr-only">{title}</SheetTitle>

          {/* Bottom Sheet Pill Drag Handle */}
          <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-muted-foreground/20" />

          {/* Scrollable Filter Options Body */}
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            {children({ close })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
