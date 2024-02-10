"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import GenreCheckbox from "@/components/genre-checkbox";
import movieGenres from "@/public/data/genres";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface FormData {
  genres: string[];
}

const GenresPage: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const handleCheckboxChange = (genreId: string, isChecked: boolean) => {
    setSelectedGenres((prevSelectedGenres) =>
      isChecked
        ? [...prevSelectedGenres, genreId]
        : prevSelectedGenres.filter((id) => id !== genreId)
    );
  };

  const onSubmit = (data: FormData) => {
    const genresString = data.genres.join(",");
    const encodedUrl = encodeURIComponent(genresString);
    router.push(`/genres/${encodedUrl}/1`);
  };

  return (
    <main className="container space-y-4">
      <h1 className="font-bold text-6xl sm:text-7xl pt-4">Genres</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="sm:space-y-4 space-y-2"
      >
        <div className="py-2 flex flex-wrap sm:grid sm:grid-cols-2 sm:grid-col lg:grid-cols-4 gap-2 sm:gap-4 w-full">
          {movieGenres.map((genre) => (
            <GenreCheckbox
              key={genre.id}
              register={register}
              name="genres"
              value={String(genre.id)}
              label={genre.name}
              onChange={(isChecked) =>
                handleCheckboxChange(String(genre.id), isChecked)
              }
            />
          ))}
        </div>
        <Button
          type="submit"
          size="full"
          disabled={selectedGenres.length === 0}
        >
          Search
        </Button>
      </form>
    </main>
  );
};

export default GenresPage;
