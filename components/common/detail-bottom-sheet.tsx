"use client";

import React from "react";
import { X, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface DetailBottomSheetSearch {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export interface DetailBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: string | number;
  badgeVariant?: "default" | "secondary" | "outline";
  search?: DetailBottomSheetSearch;
  headerActions?: React.ReactNode;
  subHeader?: React.ReactNode;
  sidebar?: React.ReactNode;
  sidebarWidth?: string;
  mobileControls?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  disableDefaultScroll?: boolean;
}

export function DetailBottomSheet({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  badgeVariant = "secondary",
  search,
  headerActions,
  subHeader,
  sidebar,
  sidebarWidth = "w-60",
  mobileControls,
  children,
  className,
  contentClassName,
  disableDefaultScroll = false,
}: DetailBottomSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className={cn(
          "inset-x-0 bottom-0 mx-auto flex h-[92vh] max-h-[92vh] min-h-[92vh] w-full max-w-(--max-container) flex-col overflow-hidden rounded-none border-x border-t border-b-0 border-border/80 bg-background/95 p-0 shadow-2xl backdrop-blur-2xl data-[side=bottom]:h-[92vh] data-[side=bottom]:max-h-[92vh] data-[side=bottom]:min-h-[92vh]",
          className
        )}
      >
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
          {/* Main Top Header */}
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-border/70 px-6 py-4 sm:px-8 sm:py-5">
            {/* Left: Title, Subtitle, and Badge */}
            <div className="flex items-center gap-3">
              <div>
                <SheetTitle className="text-lg font-bold text-foreground sm:text-xl">
                  {title}
                </SheetTitle>
                {subtitle && (
                  <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase sm:text-sm">
                    {subtitle}
                  </p>
                )}
              </div>
              {badge !== undefined && (
                <Badge
                  variant={badgeVariant}
                  className="rounded-none px-2.5 py-0.5 text-xs font-semibold"
                >
                  {badge}
                </Badge>
              )}
            </div>

            {/* Right: Search, Custom Actions, and Close Button on the FAR RIGHT */}
            <div className="flex items-center gap-2.5">
              {search && (
                <div className="relative w-44 sm:w-60">
                  <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={search.placeholder || "Search..."}
                    value={search.value}
                    onChange={(e) => search.onChange(e.target.value)}
                    className="h-8 pl-9 text-xs"
                  />
                </div>
              )}

              {headerActions}

              {/* Close Button on the Right Side */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="size-8 shrink-0 rounded-none hover:bg-muted"
                aria-label="Close sheet"
              >
                <X className="size-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>

          {/* Optional Subheader (e.g. Review filter bar, tags, or sort controls) */}
          {subHeader}

          {/* Optional Mobile Controls Bar */}
          {mobileControls && (
            <div className="border-b border-border/60 bg-muted/20 p-3 md:hidden">
              {mobileControls}
            </div>
          )}

          {/* Main Body Area: Optional Desktop Sidebar + Main Scrollable Content */}
          <div className="flex min-h-0 flex-1 overflow-hidden">
            {/* Optional Desktop Sidebar */}
            {sidebar && (
              <aside
                className={cn(
                  "hidden shrink-0 flex-col gap-4 overflow-y-auto border-r border-border/70 bg-muted/15 p-4 md:flex",
                  sidebarWidth
                )}
              >
                {sidebar}
              </aside>
            )}

            {/* Main Content Area */}
            {disableDefaultScroll ? (
              <div
                className={cn(
                  "flex min-h-0 flex-1 flex-col overflow-hidden",
                  contentClassName
                )}
              >
                {children}
              </div>
            ) : (
              <div
                className={cn(
                  "min-h-0 flex-1 overflow-y-auto p-6 sm:p-8 sm:px-10",
                  contentClassName
                )}
              >
                {children}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default DetailBottomSheet;
