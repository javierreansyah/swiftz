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
    <aside className="space-y-4 lg:col-span-4 xl:col-span-3">
      {/* Card Header & Category List */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xs">
        <div className="bg-primary px-4 py-3 text-sm font-bold text-primary-foreground">
          Search Results
        </div>

        <div className="divide-y divide-border/60">
          {categories.map((cat) => {
            const isActive = typeParam === cat.id;

            return (
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
              >
                <div className="flex items-center gap-2.5">
                  <cat.icon
                    className={`size-4 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span>{cat.label}</span>
                </div>

                <span
                  className={`rounded-xl px-2 py-0.5 text-xs font-bold ${
                    isActive
                      ? "bg-muted text-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {cat.count.toLocaleString()}
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Search Tip Notice */}
      <div className="flex items-start gap-2.5 rounded-xl border border-border/80 bg-muted/40 p-3.5 text-xs text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="leading-relaxed">
          <strong>Tip:</strong> You can use the{" "}
          <code className="rounded-xl bg-background px-1 py-0.5 font-mono text-xs text-foreground">
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
