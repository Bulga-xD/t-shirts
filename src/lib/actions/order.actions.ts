"use server";

import { auth } from "@/auth";
import { getUserById } from "./user.actions";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { formatError } from "../utils";
import { CartItem, PaymentResult } from "@/types";
import { PAGE_SIZE } from "../constants";
import { db } from "@/database/client";
import { getMyCart } from "./cart.actions";
import { revalidatePath } from "next/cache";

export async function getOrderById(orderId: string) {
  return await db.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      user: true,
    },
  });
}

export async function getMyOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const session = await auth();
  if (!session) throw new Error("User is not authenticated");

  const [data, dataCount] = await Promise.all([
    db.order.findMany({
      where: {
        userId: session.user.id!,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: (page - 1) * limit,
    }),
    db.order.count({
      where: {
        userId: session.user.id!,
      },
    }),
  ]);

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// CREATE
export const createOrder = async (
  itemsPrice: number,
  shippingPrice: number,
  totalPrice: number
) => {
  try {
    const session = await auth();
    if (!session) throw new Error("User is not authenticated");
    const cart = await getMyCart();
    if (!cart || !cart.items) throw new Error("Cart is empty");

    const user = await getUserById(session.user.id!);
    if (!user.address) redirect("/shipping-address");
    if (!user.paymentMethod) redirect("/payment-method");

    const orderData = {
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    };

    const insertedOrder = await db.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: orderData,
      });
      const items = cart.items as CartItem[];

      for (const item of items) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: parseFloat(item.price.toFixed(2)),
            orderId: newOrder.id,
          },
        });
      }

      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0,
        },
      });

      return newOrder.id;
    });

    if (!insertedOrder) throw new Error("Order not created");
    redirect(`/order/${insertedOrder}`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
};

export const updateOrderToPaid = async ({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) => {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { orderItems: true },
  });

  if (!order) throw new Error("Order not found");
  if (order.isPaid) throw new Error("Order is already paid");

  await db.$transaction(async (tx) => {
    for (const item of order.orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.qty,
          },
        },
      });
    }

    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult: paymentResult || undefined,
      },
    });
  });
};

export const getOrderSummary = async () => {
  const ordersCount = await db.order.count();
  const productsCount = await db.product.count();
  const usersCount = await db.user.count();
  const ordersPrice = await db.order.aggregate({
    _sum: {
      totalPrice: true,
    },
  });

  const salesDataRaw = await db.order.groupBy({
    by: ["createdAt"],
    _sum: {
      totalPrice: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Transform the sales data to match the expected format
  const salesData = salesDataRaw.map((entry) => {
    const { createdAt, _sum } = entry;

    // Format the date to MM/YY
    const months = new Date(createdAt).toLocaleDateString("en-US", {
      month: "2-digit",
      year: "2-digit",
    });

    // Convert Decimal to number, handle null cases
    const totalSales = _sum.totalPrice ? Number(_sum.totalPrice) : 0;

    return { months, totalSales };
  });

  const latestOrders = await db.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    take: 6,
  });

  return {
    ordersCount,
    productsCount,
    usersCount,
    ordersPrice,
    salesData,
    latestOrders,
  };
};

export const getAllOrders = async ({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) => {
  const data = await db.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: (page - 1) * limit,
    include: {
      user: true,
    },
  });

  const dataCount = await db.order.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
};

export const deleteOrder = async (orderId: string) => {
  try {
    await db.order.delete({
      where: {
        id: orderId,
      },
    });
    revalidatePath("/admin/orders");
    return {
      success: true,
      message: "Поръчката е изтрита успешно",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export async function updateOrderToPaidByCOD(orderId: string) {
  try {
    await updateOrderToPaid({ orderId });
    revalidatePath(`/order/${orderId}`);
    return { success: true, message: "Order paid successfully" };
  } catch (err) {
    return { success: false, message: formatError(err) };
  }
}

export async function deliverOrder(orderId: string) {
  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new Error("Поръчката не е намерена");
    if (!order.isPaid) throw new Error("Поръчката не е платена");

    await db.order.update({
      where: { id: orderId },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      },
    });

    revalidatePath(`/order/${orderId}`);
    return { success: true, message: "Поръчката е доставена успешно" };
  } catch (err) {
    return { success: false, message: formatError(err) };
  }
}
