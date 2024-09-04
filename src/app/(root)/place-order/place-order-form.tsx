import { Check, Loader } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/order.actions";
import { CartItem } from "@/types";

export default function PlaceOrderForm({
  items,
  itemsPrice,
  shippingPrice,
  totalPrice,
}: {
  items: CartItem[];
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
}) {
  const createOrderWrapper = async (state: {
    success: boolean;
    message: any;
  }) => {
    return await createOrder(items, itemsPrice, shippingPrice, totalPrice);
  };

  const [data, action] = useFormState(createOrderWrapper, {
    success: false,
    message: "",
  });

  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full">
        {pending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Check className="w-4 h-4" />
        )}{" "}
        Поръчай
      </Button>
    );
  };

  return (
    <form action={action} className="w-full">
      <PlaceOrderButton />
      {!data.success && <p className="text-destructive py-4">{data.message}</p>}
    </form>
  );
}
