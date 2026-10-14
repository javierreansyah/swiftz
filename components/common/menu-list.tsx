import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MenuListItem {
  key: string;
  icon?: LucideIcon;
  label?: string;
  content?: ReactNode;
  active?: boolean;
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

export interface MenuListProps {
  items: MenuListItem[];
  className?: string;
}

export function MenuList({ items, className }: MenuListProps) {
  if (items.length === 0) return null;

  return (
    <div className={cn("overflow-hidden rounded-2xl bg-card", className)}>
      {items.map((item, index) => {
        const Icon = item.icon;
        const isClickable = Boolean(item.href || item.onClick);

        const inner = (
          <>
            {Icon && (
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  item.active ? "text-primary" : "text-muted-foreground",
                )}
              />
            )}
            {item.content ?? (
              <span
                className={cn(
                  "flex-1 text-sm",
                  item.active
                    ? "font-semibold text-foreground"
                    : "font-medium text-foreground",
                )}
              >
                {item.label}
              </span>
            )}
          </>
        );

        const rowClassName = cn(
          "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors select-none",
          isClickable && "cursor-pointer hover:bg-muted/50 active:bg-muted",
        );

        return (
          <Fragment key={item.key}>
            {index > 0 && (
              <div
                aria-hidden="true"
                className="mx-4 border-t border-border/60"
              />
            )}
            {item.href ? (
              <Link
                href={item.href}
                onClick={item.onClick}
                aria-label={item.ariaLabel}
                className={rowClassName}
              >
                {inner}
              </Link>
            ) : item.onClick ? (
              <button
                type="button"
                onClick={item.onClick}
                aria-label={item.ariaLabel}
                className={rowClassName}
              >
                {inner}
              </button>
            ) : (
              <div className={rowClassName}>{inner}</div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
