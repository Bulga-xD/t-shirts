"use client";

import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { CartItem } from "@/types";
import { Loader, Minus, Plus } from "lucide-react";

export default function AddToCart({
  item,
  selectedVariant,
}: {
  item: CartItem;
  selectedVariant: {
    productId: string;
    sizeId: string;
    colorId: string;
    stock: number;
    id: string;
  };
}) {
  const { addItem, decreaseItem, items } = useCart();
  const [isPending, startTransition] = useTransition();

  if (!selectedVariant) {
    return (
      <div className="text-red-500 text-center">
        <p>Невалиден вариант на продукта.</p>
      </div>
    );
  }

  const { sizeId, colorId, stock } = selectedVariant;

  const existItem = items.find(
    (x) =>
      x.productId === item.productId &&
      x.variants.some((v) => v.sizeId === sizeId && v.colorId === colorId)
  );

  const isMaxStockReached = existItem ? existItem.qty >= stock : false;

  const handleAddItem = () => {
    startTransition(() => {
      addItem({
        ...item,
        variants: [{ sizeId, colorId, stock }],
      });
    });
  };

  const handleDecreaseItem = () => {
    startTransition(() => {
      decreaseItem(item.productId, sizeId, colorId);
    });
  };

  if (existItem) {
    return (
      <div className="sm:w-full flex justify-center sm:items-center sm:mr-4 sm:mt-2 gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={handleDecreaseItem}
          className="flex items-center justify-center w-8 h-8 p-2"
        >
          {isPending ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Minus className="w-4 h-4" />
          )}
        </Button>
        <span className="px-2">
          {existItem.qty > selectedVariant.stock ? 1 : existItem.qty}
        </span>
        <Button
          type="button"
          variant="outline"
          disabled={isMaxStockReached || isPending}
          onClick={handleAddItem}
          className="flex items-center justify-center w-8 h-8 p-2"
        >
          {isPending ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <Button
      className="w-full"
      type="button"
      disabled={isPending}
      onClick={handleAddItem}
      size="icon"
    >
      {isPending ? <Loader className="animate-spin" /> : <Plus size={16} />}
      <span className="inline sm:inline md:hidden lg:inline">
        Добави в количката
      </span>
      <span className="hidden md:inline lg:hidden">Добави</span>
    </Button>
  );
}
