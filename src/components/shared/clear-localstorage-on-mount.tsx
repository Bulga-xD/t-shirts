"use client";

import { useCart } from "@/hooks/use-cart";
import { useEffect } from "react";

const ClearLocalStorageOnMount = () => {
  const { clearCart } = useCart();
  useEffect(() => {
    // Clear localStorage when the component mounts
    clearCart();
  }, []); // Empty dependency array means this effect runs once, on mount

  return null; // This component does not render anything
};

export default ClearLocalStorageOnMount;
