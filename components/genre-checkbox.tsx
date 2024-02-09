import React from "react";
import { UseFormRegister } from "react-hook-form";

interface GenreCheckboxProps {
  register: UseFormRegister<any>;
  name: string;
  value: string;
  label: string;
  onChange: (isChecked: boolean) => void;
}

const GenreCheckbox: React.FC<GenreCheckboxProps> = ({
  register,
  name,
  value,
  label,
  onChange,
}) => {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <label className="cursor-pointer block">
      <input
        type="checkbox"
        className="peer sr-only"
        value={value}
        {...register(name)}
        onChange={handleCheckboxChange}
      />
      <div className="w-full px-4 py-2 sm:py-3 text-foreground text-sm sm:text-base rounded-md hover:bg-secondary ring-2 ring-transparent bg-card peer-checked:bg-primary border peer-checked:border-primary peer-checked:text-white">
        <h1 className="font-bold">{label}</h1>
      </div>
    </label>
  );
};

export default GenreCheckbox;
