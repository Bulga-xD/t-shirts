import { getColors } from "@/lib/actions/color.actions";
import CartForm from "./cart-form";
import { APP_NAME } from "@/lib/constants";
import { getSizes } from "@/lib/actions/size.actions";

export const metadata = {
  title: `Shopping Cart - ${APP_NAME}`,
};

export default async function CartPage() {
  const colors = await getColors();
  const sizes = await getSizes();
  return <CartForm colors={colors} sizes={sizes} />;
}
