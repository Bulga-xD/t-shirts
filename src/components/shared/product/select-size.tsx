"use client";

import { SizeType } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

const SizeSelector = ({
  currentSize,
  sizes,
}: {
  currentSize: string;
  sizes: SizeType[];
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
      {sizes.map((sizeOption) => (
        <button
          key={sizeOption.id}
          onClick={() => handleSizeChange(sizeOption.label)}
          className={`border px-2 rounded-md ${
            currentSize === sizeOption.label
              ? "bg-primary text-white"
              : "hover:bg-primary hover:text-white"
          }`}
        >
          {sizeOption.label}
        </button>
      ))}
    </div>
  );
};

export default SizeSelector;
