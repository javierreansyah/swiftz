import React from "react";
import { UseFormRegister } from "react-hook-form";

export interface GenreCheckboxProps {
  register: UseFormRegister<any>;
  name: string;
  value: string;
  label: string;
  onChange: (isChecked: boolean) => void;
}

export function GenreCheckbox({
  register,
  name,
  value,
  label,
  onChange,
}: GenreCheckboxProps) {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <label className="block cursor-pointer">
      <input
        type="checkbox"
        className="peer sr-only"
        value={value}
        {...register(name)}
        onChange={handleCheckboxChange}
      />
      <div className="w-full rounded-md border bg-card px-4 py-2 text-sm text-foreground ring-2 ring-transparent transition-colors peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white hover:bg-secondary sm:py-3 sm:text-base">
        <h3 className="font-bold">{label}</h3>
      </div>
    </label>
  );
}

export default GenreCheckbox;
