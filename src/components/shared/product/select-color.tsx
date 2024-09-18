"use client";

import { ColorType } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

const ColorSelector = ({
  currentColor,
  colors,
}: {
  currentColor: string;
  colors: ColorType[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSizeChange = (color: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("color", color);

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex gap-2">
      {colors.map((color) => (
        <button
          key={color.id}
          onClick={() => handleSizeChange(color.id)}
          className={`border px-2 rounded-md ${
            currentColor === color.id
              ? "bg-primary text-white"
              : "hover:bg-primary hover:text-white"
          }`}
        >
          {color.label}
        </button>
      ))}
    </div>
  );
};

export default ColorSelector;
