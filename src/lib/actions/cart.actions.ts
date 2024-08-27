import { auth } from "@/auth";
import { db } from "@/database/client";

export async function getMyCart() {
  const session = await auth();
  const userId = session?.user.id;

  const cart = await db.cart.findFirst({
    where: { userId },
  });

  return cart;
}
