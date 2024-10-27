"use client";

import { SizeType } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

const SizeSelector = ({
  currentSize,
  productSizes,
  sizes,
  disabledSizes,
}: {
  currentSize: string;
  productSizes: string[];
  sizes: SizeType[];
  disabledSizes?: string[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSizeChange = (size: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("size", size);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex gap-2">
      {productSizes.map((sizeOption) => {
        const id = sizes.find((size) => size.id === sizeOption)?.id;
        const isDisabled = disabledSizes?.includes(id!);
        return (
          <button
            key={id}
            onClick={() => !isDisabled && handleSizeChange(id!)}
            className={`border px-2 rounded-md disabled:cursor-not-allowed ${
              currentSize === id
                ? "bg-primary text-white"
                : isDisabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "hover:bg-primary hover:text-white"
            }`}
            disabled={isDisabled}
          >
            {sizes.find((size) => size.id === sizeOption)?.label}
          </button>
        );
      })}
    </div>
  );
};

export default SizeSelector;
