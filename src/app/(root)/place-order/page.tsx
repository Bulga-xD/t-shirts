import { auth } from "@/auth";
import CheckoutSteps from "@/components/shared/checkout-steps";

import { getUserById } from "@/lib/actions/user.actions";
import { APP_NAME } from "@/lib/constants";

import { redirect } from "next/navigation";
import { OrderCart } from "./order-cart";
import { getColors } from "@/lib/actions/color.actions";
import { getSizes } from "@/lib/actions/size.actions";

export const metadata = {
  title: `Place Order - ${APP_NAME}`,
};

export default async function PlaceOrderPage() {
  const session = await auth();
  const user = await getUserById(session?.user.id!);
  if (!user.address) redirect("/shipping-address");
  const colors = await getColors();
  const sizes = await getSizes();

  return (
    <section className="max-w-7xl m-auto p-5 md:px-10">
      <CheckoutSteps current={2} />
      <h1 className="py-4 text-2xl">Направи поръчка</h1>

      <OrderCart user={user} colors={colors} sizes={sizes} />
    </section>
  );
}
