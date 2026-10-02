import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sword,
  TentTree,
  Pencil,
  Laugh,
  Slice,
  BedDouble,
  Rocket,
  Ghost,
  type LucideIcon,
} from "lucide-react";
interface GenreCategory {
  id: number;
  name: string;
  icon: LucideIcon;
  iconClass?: string;
}

const FEATURED_GENRES: GenreCategory[] = [
  { id: 28, name: "Action", icon: Sword, iconClass: "group-hover:rotate-90" },
  { id: 12, name: "Adventure", icon: TentTree },
  { id: 16, name: "Animation", icon: Pencil },
  { id: 35, name: "Comedy", icon: Laugh },
  { id: 80, name: "Crime", icon: Slice },
  { id: 10751, name: "Family", icon: BedDouble },
  { id: 878, name: "Science Fiction", icon: Rocket },
  { id: 27, name: "Horror", icon: Ghost },
];

export function GenresCard() {
  return (
    <section className="container">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURED_GENRES.map((genre) => {
          const Icon = genre.icon;
          return (
            <article key={genre.id}>
              <Link href={`/movie?with_genres=${genre.id}`} prefetch={false}>
                <Card size="sm" interactive className="group w-full">
                  <CardContent className="flex items-center">
                    <figure className="mr-4 flex aspect-square w-16 shrink-0 items-center justify-center overflow-clip rounded-2xl bg-secondary">
                      <Icon
                        size={36}
                        className={`transition-all group-hover:scale-125 group-hover:text-primary ${
                          genre.iconClass || ""
                        }`}
                      />
                    </figure>
                    <div>
                      <h2 className="heading-card">{genre.name}</h2>
                      <p className="text-sm text-muted-foreground">View</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
