"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { CartItem } from "@/types";
import { Loader, Minus, Plus } from "lucide-react";
import { useTransition } from "react";

export default function AddToCart({
  item,
}: {
  item: Omit<CartItem, "cartId">;
}) {
  const { addItem, decreaseItem, items } = useCart();
  const [isPending] = useTransition();

  // Check for an existing item with the same productId and size
  const existItem = items.find(
    (x) => x.productId === item.productId && x.size === item.size
  );

  // Check if the size is selected
  const isSizeSelected = item.size && item.size !== "";
  const isColorSelected = item.color && item.color !== "";

  return !isSizeSelected || !isColorSelected ? (
    <div className="text-red-500 text-center">
      <p>Моля изберете цвят и размер.</p>
    </div>
  ) : existItem ? (
    <div className="sm:w-full flex justify-center sm:items-center sm:mr-4 sm:mt-2 gap-2">
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={() => decreaseItem(item.productId, item.size)}
        className="flex items-center justify-center w-8 h-8 p-2"
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={() => addItem(item)}
        className="flex items-center justify-center w-8 h-8 p-2"
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full"
      type="button"
      disabled={isPending}
      onClick={() => addItem(item)}
    >
      {isPending ? <Loader className="animate-spin" /> : <Plus />}
      <span className="inline sm:inline md:hidden lg:inline">
        Добави в количката
      </span>
      <span className="hidden md:inline lg:hidden">Добави</span>
    </Button>
  );
}
