import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/user.actions";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import ShippingAddressForm from "./shipping-address-form";
import { ShippingAddress } from "@/types";

export const metadata: Metadata = {
  title: `Shipping Address = ${APP_NAME}`,
};

export default async function ShippingPage() {
  const session = await auth();
  const user = await getUserById(session?.user.id!);

  return <ShippingAddressForm address={user.address as ShippingAddress} />;
}
