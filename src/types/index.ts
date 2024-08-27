import {
  Product as ProductModel,
  Cart as CartModel,
  Order as OrderModel,
  OrderItem as OrderItemModel,
} from "@prisma/client";
import {
  cartItemSchema,
  paymentResultSchema,
  shippingAddressSchema,
} from "@/lib/validators";
import { z } from "zod";

// PRODUCTS
export type Product = ProductModel;

// CART
export type Cart = CartModel;
export type CartItem = z.infer<typeof cartItemSchema>;

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type PaymentResult = z.infer<typeof paymentResultSchema>;

// ORDERS
export type Order = OrderModel & {
  orderItems: OrderItem[];
  user: { name: string | null; email: string };
};
export type OrderItem = OrderItemModel;
