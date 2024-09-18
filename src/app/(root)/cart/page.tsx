import { getColors } from "@/lib/actions/color.actions";
import CartForm from "./cart-form";
import { APP_NAME } from "@/lib/constants";

export const metadata = {
  title: `Shopping Cart - ${APP_NAME}`,
};

export default async function CartPage() {
  const colors = await getColors();
  return <CartForm colors={colors} />;
}
