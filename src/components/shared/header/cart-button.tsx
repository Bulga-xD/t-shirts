"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useEffect, useState } from "react";

export default function CartButton() {
  const { items } = useCart();
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const itemCount = items.reduce((total, product) => {
    const qty =
      typeof product.qty === "number" && !isNaN(product.qty) ? product.qty : 0;
    return total + qty;
  }, 0);

  return (
    <Button asChild variant="ghost">
      <Link href="/cart">
        <ShoppingCart className="" />
        Cart
        {isMounted ? (
          <Badge variant="secondary" className="ml-1 rouded-full">
            {itemCount}
          </Badge>
        ) : (
          0
        )}
      </Link>
    </Button>
  );
}
