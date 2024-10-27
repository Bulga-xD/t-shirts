import {
  Product as ProductModel,
  Cart as CartModel,
  Order as OrderModel,
  OrderItem as OrderItemModel,
  Review as ReviewModel,
  UserReview as UserReviewModel,
  Color as ColorModel,
  Size as SizeModel,
  ProductVariant,
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
  price: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  banner: string | null;
  createdAt: Date;
  discount: number | null;
  productVariants: ProductVariant[];
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
export type ProductWithVariants = Product & {
  productVariants: (ProductVariant & { size: SizeModel; color: ColorModel })[];
};
