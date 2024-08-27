"use client";

import { useEffect } from "react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { CartItem } from "@/types";
import { Button } from "../ui/button";

const AddToCartButton = ({
  product,
}: {
  product: CartItem;
  className?: string;
}) => {
  const { addItem } = useCart();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isSuccess]);

  return (
    <Button
      onClick={() => {
        addItem(product);
        setIsSuccess(true);
      }}
    >
      {isSuccess ? "Добавено!" : "Добави в количката"}
    </Button>
  );
};

export default AddToCartButton;
