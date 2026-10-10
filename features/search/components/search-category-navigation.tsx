import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import type {
  SearchCategory,
  SearchCategoryItem,
} from "@/features/search/types";
export function SearchCategoryNavigation({
  categories,
  typeParam,
  handleCategoryChange,
}: {
  categories: SearchCategoryItem[];
  typeParam: SearchCategory;
  handleCategoryChange: (category: SearchCategory) => void;
}) {
  return (
    <aside className="space-y-3 lg:col-span-4 xl:col-span-3">
      {/* Category Chips / Nav */}
      <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1.5">
        {categories.map((cat) => {
          const isActive = typeParam === cat.id;

          return (
            <Button
              variant={isActive ? "default" : "secondary"}
              size="sm"
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              className="shrink-0 lg:w-full lg:justify-between"
            >
              <div className="flex items-center gap-2">
                <cat.icon
                  className={`size-3.5 ${
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                />
                <span>{cat.label}</span>
              </div>

              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {cat.count.toLocaleString()}
              </span>
            </Button>
          );
        })}
      </div>

      {/* Search Tip Notice Straight in the Background */}
      <div className="flex items-start gap-2 pt-1 text-xs text-muted-foreground">
        <Info className="mt-0.5 size-3.5 shrink-0 text-primary" />
        <p className="leading-relaxed">
          <strong className="text-foreground">Tip:</strong> You can use the{" "}
          <code className="rounded-md bg-secondary px-1 py-0.5 font-mono text-xs text-foreground">
            y:
          </code>{" "}
          filter to narrow your results by year. Example:{" "}
          <span className="text-foreground italic">
            &apos;star wars y:1977&apos;
          </span>
          .
        </p>
      </div>
    </aside>
  );
}
