"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FormData = {
  query: string;
};

export interface SearchBarProps {
  currentQuery?: string;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  currentQuery = "",
  placeholder = "Search for movies...",
  className,
}: SearchBarProps) {
  const { register, handleSubmit } = useForm<FormData>();
  const router = useRouter();

  const onSubmit = (data: FormData) => {
    const trimmed = data.query.trim();
    if (!trimmed) return;
    const query = encodeURIComponent(trimmed);
    router.push(`/search?q=${query}&page=1`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className || "py-2"}>
      <div className="gap-4 space-y-4 sm:flex sm:space-y-0">
        <Input
          type="text"
          placeholder={placeholder}
          {...register("query", { required: true })}
          defaultValue={currentQuery}
          className="flex-1"
        />
        <Button type="submit" className="hidden sm:inline-flex">
          Search
        </Button>
        <Button type="submit" className="w-full sm:hidden" size="full">
          Search
        </Button>
      </div>
    </form>
  );
}

// Backward-compatible alias
export const Search = SearchBar;

export default SearchBar;
