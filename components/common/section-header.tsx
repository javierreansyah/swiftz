"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterSelect } from "@/features/media/components/filter-sidebar-primitives";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SectionHeaderTab {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface SectionHeaderAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface SectionHeaderProps {
  title: string;
  headingAs?: "h1" | "h2" | "h3";
  count?: number;
  badge?: string;
  tabs?: SectionHeaderTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  action?: SectionHeaderAction;
  controls?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  headingAs: Heading = "h2",
  count,
  badge,
  tabs,
  activeTab,
  onTabChange,
  action,
  controls,
  className,
}: SectionHeaderProps) {
  const actionContent = action ? (
    <>
      <span>{action.label}</span>
      <ChevronRight className="size-3.5" />
    </>
  ) : null;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2.5 pb-2 sm:gap-4",
        className,
      )}
    >
      {/* Left side: Title, Count Badge, Switcher/Tabs, Desktop Action */}
      <div className="flex min-w-0 shrink items-center gap-2.5 sm:gap-4">
        <Heading className="heading-section text-foreground">{title}</Heading>

        {/* Count or Badge */}
        {count !== undefined && <Badge variant="secondary">{count}</Badge>}
        {badge && <Badge variant="outline">{badge}</Badge>}

        {/* Switcher/Tabs */}
        {tabs && tabs.length > 0 && (
          <>
            {/* Mobile Dropdown Switcher (matching /movie sidebar filter & sort) */}
            <div className="sm:hidden">
              <FilterSelect
                value={activeTab ?? tabs[0]?.id ?? ""}
                onChange={(val) => onTabChange?.(val)}
                options={tabs.map((tab) => ({
                  value: tab.id,
                  label: tab.label,
                }))}
                fullWidth={false}
                placeholder={tabs[0]?.label}
                ariaLabel="Select category"
              />
            </div>

            {/* Desktop Tabs Switcher */}
            <Tabs
              value={activeTab}
              onValueChange={onTabChange}
              className="hidden w-auto sm:block"
            >
              <TabsList>
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="cursor-pointer"
                  >
                    {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className="ml-1.5 rounded-xl bg-muted-foreground/15 px-1.5 py-0.5 text-xs font-semibold text-muted-foreground">
                        {tab.count}
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </>
        )}

        {/* Action Button for Desktop alongside Title */}
        {action && (
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
            asChild={Boolean(action.href)}
            onClick={action.onClick}
          >
            {action.href ? (
              <Link href={action.href}>{actionContent}</Link>
            ) : (
              actionContent
            )}
          </Button>
        )}
      </div>

      {/* Right side: Mobile Action or Desktop Carousel Arrow Controls */}
      {(action || controls) && (
        <div className="flex shrink-0 items-center gap-2">
          {/* Mobile Action */}
          {action && (
            <Button
              variant="ghost"
              size="sm"
              className="sm:hidden"
              asChild={Boolean(action.href)}
              onClick={action.onClick}
            >
              {action.href ? (
                <Link href={action.href}>{actionContent}</Link>
              ) : (
                actionContent
              )}
            </Button>
          )}

          {/* Desktop Controls (hidden on mobile since gesture/swipe is used) */}
          {controls && (
            <div className="hidden sm:flex sm:items-center sm:gap-2">
              {controls}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
