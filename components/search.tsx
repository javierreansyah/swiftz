"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FormData = {
  query: string;
};

interface SearchProps {
  currentQuery?: string;
}

const Search: React.FC<SearchProps> = ({ currentQuery }) => {
  const { register, handleSubmit } = useForm<FormData>();
  const router = useRouter();

  const onSubmit = (data: FormData) => {
    const query = encodeURIComponent(data.query);
    router.push(`/search/${query}/1`);
  };
  return (
    <div className="py-2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="sm:flex gap-4 space-y-4 sm:space-y-0">
          <Input
            type="text"
            placeholder="Search for movies"
            {...register("query", { required: true })}
            defaultValue={currentQuery}
          />
          <Button type="submit" className="hidden sm:block">
            Search
          </Button>
          <Button type="submit" className="block sm:hidden" size="full">
            Search
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Search;
