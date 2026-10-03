"use client";
import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

function renderAction(
  action: SectionHeaderAction,
  placement: "desktop" | "mobile",
) {
  const content = (
    <>
      <span>{action.label}</span>
      <ChevronRight className="size-3.5" />
    </>
  );

  if (action.href) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={
          placement === "desktop" ? "hidden sm:inline-flex" : "sm:hidden"
        }
        asChild
      >
        <Link href={action.href}>{content}</Link>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={action.onClick}
      className={
        placement === "desktop" ? "hidden sm:inline-flex" : "sm:hidden"
      }
    >
      {content}
    </Button>
  );
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
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 pb-2",
        className,
      )}
    >
      {/* Left side: Serif Title, Count Badge, Switcher/Tabs */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <Heading className="heading-section text-foreground">{title}</Heading>

        {/* Count or Badge */}
        {count !== undefined && <Badge variant="secondary">{count}</Badge>}
        {badge && <Badge variant="outline">{badge}</Badge>}

        {/* Shadcn Default Tabs Switcher */}
        {tabs && tabs.length > 0 && (
          <Tabs
            value={activeTab}
            onValueChange={onTabChange}
            className="w-auto"
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
        )}

        {/* Action Button for Desktop alongside Title */}
        {action && renderAction(action, "desktop")}
      </div>

      {/* Right side: Mobile Action or Desktop Carousel Arrow Controls */}
      <div className="flex items-center gap-2">
        {/* Mobile Action */}
        {action && renderAction(action, "mobile")}

        {/* Carousel Navigation Arrow Controls or Custom Controls */}
        {controls}
      </div>
    </div>
  );
}
