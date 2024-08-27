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
  const existItem = items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div>
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={() => decreaseItem(item.productId)}
      >
        {isPending ? (
          <Loader className="w-4 h-4  animate-spin" />
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
      Добави в количката
    </Button>
  );
}