"use client";

import { ColorType } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

const ColorSelector = ({
  currentColor,
  productColors,
  colors,
  disabledColors,
}: {
  currentColor: string;
  productColors: string[];
  colors: ColorType[];
  disabledColors?: string[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleColorChange = (color: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("color", color);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex gap-2">
      {productColors.map((color) => {
        const id = colors.find((c) => c.id === color)?.id;
        const isDisabled = disabledColors?.includes(id!);
        return (
          <button
            key={id}
            onClick={() => !isDisabled && handleColorChange(id!)}
            className={`border px-2 rounded-md disabled:cursor-not-allowed ${
              currentColor === colors.find((c) => c.id === color)?.id
                ? "bg-primary text-white"
                : isDisabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "hover:bg-primary hover:text-white"
            }`}
            disabled={isDisabled}
          >
            {colors.find((c) => c.id === color)?.label}
          </button>
        );
      })}
    </div>
  );
};

export default ColorSelector;
