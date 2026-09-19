"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface SectionHeaderTab {
  id: string;
  label: string;
}

export interface SectionHeaderAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface SectionHeaderProps {
  title: string;
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
  count,
  badge,
  tabs,
  activeTab,
  onTabChange,
  action,
  controls,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 pb-2",
        className
      )}
    >
      {/* Left side: Serif Title, Count Badge, Switcher/Tabs */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <h2 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
          {title}
        </h2>

        {/* Count or Badge */}
        {count !== undefined && (
          <Badge
            variant="secondary"
            className="rounded-none px-2 py-0.5 font-sans text-xs font-semibold"
          >
            {count}
          </Badge>
        )}
        {badge && (
          <Badge
            variant="outline"
            className="rounded-none border-primary/30 px-2 py-0.5 font-sans text-xs font-semibold text-primary"
          >
            {badge}
          </Badge>
        )}

        {/* Optional Segmented Switcher / Tabs */}
        {tabs && tabs.length > 0 && (
          <div className="inline-flex items-center gap-0.5 rounded-none border border-border/80 bg-muted/40 p-0.5">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange?.(tab.id)}
                  className={cn(
                    "cursor-pointer rounded-none px-3 py-1 font-sans text-xs font-semibold transition-all select-none",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Action Button for Desktop alongside Title */}
        {action && (
          action.href ? (
            <Link
              href={action.href}
              className="hidden items-center gap-1 font-sans text-xs font-semibold text-primary hover:underline sm:inline-flex"
            >
              <span>{action.label}</span>
              <ChevronRight className="size-3.5" />
            </Link>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={action.onClick}
              className="hidden gap-1 font-sans text-xs font-semibold text-primary hover:text-primary sm:inline-flex"
            >
              <span>{action.label}</span>
              <ChevronRight className="size-3.5" />
            </Button>
          )
        )}
      </div>

      {/* Right side: Mobile Action or Desktop Carousel Arrow Controls */}
      <div className="flex items-center gap-2">
        {/* Mobile Action */}
        {action && (
          action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-primary sm:hidden"
            >
              <span>{action.label}</span>
              <ChevronRight className="size-3.5" />
            </Link>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={action.onClick}
              className="gap-1 font-sans text-xs font-semibold text-primary hover:text-primary sm:hidden"
            >
              <span>{action.label}</span>
              <ChevronRight className="size-3.5" />
            </Button>
          )
        )}

        {/* Carousel Navigation Arrow Controls or Custom Controls */}
        {controls}
      </div>
    </div>
  );
}

export default SectionHeader;
