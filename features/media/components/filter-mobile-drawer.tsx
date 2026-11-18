"use client";
import type { ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerTitle,
  DrawerTrigger,
  useDrawerClose,
} from "@/components/ui/drawer";

type FilterContent = (helpers: {
  close: (afterClose?: () => void) => void;
}) => ReactNode;

export interface FilterMobileDrawerProps {
  title: string;
  activeCount: number;
  children: FilterContent;
}

function FilterDrawerBody({ children }: { children: FilterContent }) {
  const close = useDrawerClose();

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {close && children({ close })}
    </div>
  );
}

export function FilterMobileDrawer({
  title,
  activeCount,
  children,
}: FilterMobileDrawerProps) {
  return (
    <Drawer dismissible>
      <DrawerTrigger asChild>
        <Button
          variant={activeCount > 0 ? "default" : "outline"}
          size="icon"
          aria-label={
            activeCount > 0 ? `${title} (${activeCount} active)` : title
          }
          title={title}
          className="relative"
        >
          <SlidersHorizontal className="size-5" />
          {activeCount > 0 && (
            <Badge
              aria-hidden="true"
              variant="secondary"
              className="pointer-events-none absolute -top-1 -right-1"
            >
              {activeCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>

      {/* Draggable bottom sheet (vaul): drag the handle to close */}
      <DrawerContent>
        <DrawerTitle className="sr-only">{title}</DrawerTitle>
        <DrawerDescription className="sr-only">
          Choose filters and a sort order for the listing.
        </DrawerDescription>

        <DrawerHandle />

        <FilterDrawerBody>{children}</FilterDrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
