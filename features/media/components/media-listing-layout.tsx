import type { ReactNode } from "react";
import { cva } from "class-variance-authority";
const contentVariants = cva("min-w-0 flex-1", {
  variants: { variant: { discovery: "", category: "space-y-6" } },
  defaultVariants: { variant: "discovery" },
});

interface MediaListingLayoutProps {
  mobileFilters: ReactNode;
  sidebar: ReactNode;
  header?: ReactNode;
  activeFilters?: ReactNode;
  children: ReactNode;
  pagination?: ReactNode;
  variant?: "discovery" | "category";
}

export function MediaListingLayout({
  mobileFilters,
  sidebar,
  header,
  activeFilters,
  children,
  pagination,
  variant = "discovery",
}: MediaListingLayoutProps) {
  return (
    <main className="container min-h-screen pt-20 pb-16">
      <div className="mb-6 lg:hidden">{mobileFilters}</div>
      <div className="flex gap-8 xl:gap-12">
        <div className="hidden w-64 shrink-0 lg:block lg:w-72 xl:w-80">
          <div className="sticky top-20 max-h-sidebar scrollbar-thin overflow-x-hidden overflow-y-auto pr-3">
            {sidebar}
          </div>
        </div>
        <div className={contentVariants({ variant })}>
          {header}
          {activeFilters}
          {children}
          {pagination}
        </div>
      </div>
    </main>
  );
}
