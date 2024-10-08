import {
  Product as ProductModel,
  Cart as CartModel,
  Order as OrderModel,
  OrderItem as OrderItemModel,
  Review as ReviewModel,
  UserReview as UserReviewModel,
  Color as ColorModel,
  Size as SizeModel,
} from "@prisma/client";
import {
  cartItemSchema,
  paymentResultSchema,
  shippingAddressSchema,
} from "@/lib/validators";
import { z } from "zod";

// PRODUCTS
export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  images: string[];
  brand: string;
  description: string;
  stock: number;
  price: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  banner: string | null;
  createdAt: Date;
  colors: ColorType[];
  sizes: SizeType[];
  discount: number | null;
};

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

export type Review = ReviewModel & {
  user?: { name: string };
};

export type UserReview = UserReviewModel;
export type ColorType = ColorModel;
export type SizeType = SizeModel;
