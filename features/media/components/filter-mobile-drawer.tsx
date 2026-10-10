"use client";
import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHandle,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
      <Drawer open={isOpen} onOpenChange={setIsOpen} dismissible>
        <DrawerTrigger asChild>
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
        </DrawerTrigger>

        {/* Draggable bottom sheet (vaul): drag the handle to close */}
        <DrawerContent>
          <DrawerTitle className="sr-only">{title}</DrawerTitle>

          <DrawerHandle />

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {children({ close })}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
