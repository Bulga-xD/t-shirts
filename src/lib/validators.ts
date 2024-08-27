import * as z from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";

// USER
export const signInFormSchema = z.object({
  email: z.string().email().min(3, "Имейлът трябва да е поне 3 символа"),
  password: z.string().min(3, "Паролата трябва да е поне 3 символа"),
});

export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Името трябва да е поне 3 символа"),
    email: z.string().email().min(3, "Имейлът трябва да е поне 3 символа"),
    password: z.string().min(3, "Паролата трябва да е поне 3 символа"),
    confirmPassword: z.string().min(3, "Паролата трябва да е поне 3 символа"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Името е задължително"),
  slug: z.string().min(1, "Слъгът е задължителен"),
  qty: z
    .number()
    .int()
    .nonnegative("Количеството трябва да е положително число"),
  image: z.string().min(1, "Снимката е задължителна"),
  price: z
    .number()
    .refine(
      (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(value)),
      "Price must have exactly two decimal places (e.g., 49.99)"
    ),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Моля въведете поне едно име"),
  streetAddress: z.string().min(3, "Улицата трябва да съдържа поне 3 символа"),
  city: z.string().min(3, "Градът трябва да съдържа поне 3 символа"),
  postalCode: z
    .string()
    .min(3, "Пощенският код трябва да съдържа поне 3 символа"),
  country: z.string().min(3, "Държавата трябва да съдържа поне 3 символа"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Начинът на плащане е задължителен"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Невалиден начин на плащане",
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
  qty: z
    .number()
    .int()
    .nonnegative("Количеството трябва да е положително число"),
  price: z.number(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(3, "Името трябва да е поне 3 символа"),
  email: z.string().email().min(3, "Имейлът трябва да е поне 3 символа"),
});
