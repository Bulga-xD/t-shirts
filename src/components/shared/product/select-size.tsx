"use client";

import { useRouter, useSearchParams } from "next/navigation";

const SizeSelector = ({ currentSize }: { currentSize: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSizeChange = (size: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("size", size);

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex gap-2">
      {["S", "M", "L", "XL"].map((sizeOption) => (
        <button
          key={sizeOption}
          onClick={() => handleSizeChange(sizeOption)}
          className={`border px-2 rounded-md ${
            currentSize === sizeOption
              ? "bg-muted-foreground text-white"
              : "hover:bg-muted-foreground hover:text-white"
          }`}
        >
          {sizeOption}
        </button>
      ))}
    </div>
  );
};

export default SizeSelector;
