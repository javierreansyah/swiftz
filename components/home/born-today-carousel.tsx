"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { Person } from "@/types";
import { Button } from "@/components/ui/button";

export interface BornTodayCarouselProps {
  people: Person[];
}

export function BornTodayCarousel({ people }: BornTodayCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -400 : 400;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (!people || people.length === 0) return null;

  return (
    <section className="container space-y-4">
      <div className="flex items-center justify-between border-l-4 border-primary pl-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Born Today &amp; Popular Stars
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            People who make the stories we love
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <Link href="/person">Explore People</Link>
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handleScroll("left")}
            aria-label="Previous stars"
            className="size-8 rounded-none border-border"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleScroll("right")}
            aria-label="Next stars"
            className="size-8 rounded-none border-border"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Horizontal Carousel of People Cards */}
      <div
        ref={scrollRef}
        className="flex scrollbar-none gap-4 overflow-x-auto scroll-smooth pb-4"
      >
        {people.map((person) => {
          const profileUrl = person.profile_path
            ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
            : null;

          const topKnownFor = person.known_for?.[0];
          const topWorkTitle = topKnownFor?.title || topKnownFor?.name || "";

          return (
            <Link
              key={person.id}
              href={`/person/${person.id}`}
              className="group flex w-36 shrink-0 flex-col items-center text-center sm:w-40"
            >
              {/* Circular or Soft-square Portrait */}
              <div className="relative size-28 overflow-hidden rounded-full border-2 border-border bg-muted shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-primary group-hover:shadow-md sm:size-32">
                {profileUrl ? (
                  <Image
                    src={profileUrl}
                    alt={person.name}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-secondary text-muted-foreground">
                    <User className="size-10" />
                  </div>
                )}
              </div>

              {/* Name & Role */}
              <div className="mt-3 space-y-0.5">
                <h3 className="line-clamp-1 text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                  {person.name}
                </h3>
                <p className="line-clamp-1 text-xs text-muted-foreground">
                  {person.known_for_department || "Actor"}
                </p>
                {topWorkTitle && (
                  <p className="line-clamp-1 text-[11px] text-muted-foreground/70">
                    Known for {topWorkTitle}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default BornTodayCarousel;
