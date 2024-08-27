import * as z from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";

// USER
export const signInFormSchema = z.object({
  email: z.string().email().min(3, "Email must be at least 3 characters"),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email().min(3, "Email must be at least 3 characters"),
    password: z.string().min(3, "Password must be at least 3 characters"),
    confirmPassword: z
      .string()
      .min(3, "Confirm password must be at least 3 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  qty: z.number().int().nonnegative("Quantity must be a positive integer"),
  image: z.string().min(1, "Image is required"),
  price: z
    .number()
    .refine(
      (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(value)),
      "Price must have exactly two decimal places (e.g., 49.99)"
    ),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  streetAddress: z
    .string()
    .min(3, "Street address must be at least 3 characters"),
  city: z.string().min(3, "City must be at least 3 characters"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  country: z.string().min(3, "Country must be at least 3 characters"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment method is required"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Invalid payment method",
  });

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

export const insertOrderSchema = z.object({
  userId: z.string(),
  shippingAddress: shippingAddressSchema,
  paymentResult: paymentResultSchema.optional(),
  totalPrice: z.number(),
  paymentMethod: z.string(),
  status: z.string().optional(),
});

export const insertOrderItemSchema = z.object({
  orderId: z.string(),
  productId: z.string(),
  qty: z.number().int().nonnegative("Quantity must be a positive integer"),
  price: z.number(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email().min(3, "Email must be at least 3 characters"),
});
