import * as z from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHOD } from "./constants";

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
  size: z.string(),
  color: z.string(),
  discount: z.number().optional(),
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
  .refine((data) => PAYMENT_METHOD.includes(data.type), {
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

export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, "ИД-то е задължително"),
  role: z.string().min(1, "Ролята е задължителна"),
});

export const insertProductSchema = z.object({
  name: z.string().min(3, "Името трябва да е поне 3 символа"),
  slug: z.string().min(1, "Слъгът е задължителен"),
  category: z.string().min(3, "Категорията трябва да е поне 3 символа"),
  images: z.array(z.string()).min(1, "Моля добавете поне една снимка"),
  brand: z.string().min(3, "Марката трябва да е поне 3 символа"),
  description: z.string().min(10, "Описанието трябва да е поне 10 символа"),
  stock: z.coerce
    .number()
    .int()
    .nonnegative()
    .min(0, "Наличността трябва да е поне 0"),
  price: z.coerce
    .number()
    .nonnegative()
    .min(0.01, "Цената трябва да е поне 0.01"),
  isFeatured: z.boolean(),
  banner: z.string().optional().nullable(),
  colors: z
    .array(
      z.object({
        id: z.string().min(1, "Невалиден ID за цвят"),
        label: z.string().min(1, "Стойността на цвета е задължителна"),
      })
    )
    .min(1, "Трябва да има поне един цвят"),
  sizes: z
    .array(
      z.object({
        id: z.string().min(1, "Невалиден ID за размер"),
        label: z.string().min(1, "Стойността на размера е задължителна"),
      })
    )
    .min(1, "Трябва да има поне един размер"),
  discount: z.coerce.number().nonnegative().optional(),
});

export const updateProductSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "Името трябва да е поне 3 символа"),
  slug: z.string().min(1, "Слъгът е задължителен"),
  category: z.string().min(3, "Категорията трябва да е поне 3 символа"),
  images: z.array(z.string()).min(1, "Моля добавете поне една снимка"),
  brand: z.string().min(3, "Марката трябва да е поне 3 символа"),
  description: z.string().min(10, "Описанието трябва да е поне 10 символа"),
  stock: z.coerce
    .number()
    .int()
    .nonnegative()
    .min(0, "Наличността трябва да е поне 0"),
  price: z.coerce
    .number()
    .nonnegative()
    .min(0.01, "Цената трябва да е поне 0.01"),
  isFeatured: z.boolean(),
  banner: z.string().optional().nullable(),
  colors: z
    .array(
      z.object({
        id: z.string().min(1, "Невалиден ID за цвят"),
        label: z.string().min(1, "Стойността на цвета е задължителна"),
      })
    )
    .min(1, "Трябва да има поне един цвят"),
  sizes: z
    .array(
      z.object({
        id: z.string().min(1, "Невалиден ID за размер"),
        label: z.string().min(1, "Стойността на размера е задължителна"),
      })
    )
    .min(1, "Трябва да има поне един размер"),
  discount: z.coerce.number().nonnegative().optional(),
});

export const insertReviewSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  productId: z.string().uuid("Invalid product ID"),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  isVerifiedPurchase: z.boolean().optional().default(true),
});

export const insertUserReviewSchema = z.object({
  fullName: z.string().optional().nullable(),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Рейтинга трябва да е най-малко 1")
    .max(5, "Рейтинга трябва да е най-много 5"),
  title: z.string().min(1, "Заглавието е задължително"),
  city: z.string().optional().nullable(),
  text: z.string().min(1, "Описанието е задължително"),
});

export const insertMonthlyDealSchema = z.object({
  text: z.string().min(1, "Описанието е задължително"),
  image: z.string(),
  endDate: z.date({
    required_error: "Крайната дата е задължителна",
  }),
  imageKey: z.string().optional().nullable(),
});

export const updateMonthlyDealSchema = insertMonthlyDealSchema.extend({
  id: z.string().uuid(), // Ensure id is a valid UUID for updating the deal
});

export const insertHeroImage = z.object({
  image: z.string().min(1, { message: "Image URL is required" }),
  imageKey: z.string().min(1, { message: "Image key is required" }),
  heroSectionId: z.string().uuid().optional(),
});

export const insertHeroSection = z.object({
  text: z.string().min(1, "Описанието е задължително"),
  images: z.array(insertHeroImage).optional(),
  isActive: z.boolean(),
});

export const updateHeroSection = z.object({
  id: z.string().uuid(),
  text: z.string().min(1, "Описанието е задължително"),
  images: z.array(insertHeroImage).optional(),
  isActive: z.boolean(),
});
