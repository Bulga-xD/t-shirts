"use server";

import { z } from "zod";

import { insertReviewSchema } from "../validators";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { formatError } from "../utils";
import { PAGE_SIZE } from "../constants";
import { db } from "@/database/client";

export async function createUpdateReview(
  data: z.infer<typeof insertReviewSchema>
) {
  try {
    const session = await auth();

    if (!session) throw new Error("User is not authenticated");

    const review = insertReviewSchema.parse({
      ...data,
      userId: session.user.id,
    });

    const product = await db.product.findUnique({
      where: { id: review.productId },
    });

    if (!product) throw new Error("Product not found");

    const reviewExists = await db.review.findFirst({
      where: {
        productId: review.productId,
        userId: review.userId,
      },
    });

    await db.$transaction(async (tx) => {
      if (reviewExists) {
        await tx.review.update({
          where: { id: reviewExists.id },
          data: {
            description: review.description,
            title: review.title,
            rating: review.rating,
          },
        });
      } else {
        await tx.review.create({
          data: review,
        });
      }

      const averageRating = await tx.review.aggregate({
        _avg: {
          rating: true,
        },
        where: {
          productId: review.productId,
        },
      });

      const numReviews = await tx.review.count({
        where: {
          productId: review.productId,
        },
      });

      await tx.product.update({
        where: { id: review.productId },
        data: {
          rating: averageRating._avg.rating || 0,
          numReviews,
        },
      });
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: "Успешно актуализиран отзив",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getReviews({
  productId,
  limit = PAGE_SIZE,
  page,
}: {
  productId: string;
  limit?: number;
  page: number;
}) {
  const data = await db.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
    include: { user: { select: { name: true } } },
  });

  const dataCount = await db.review.count({
    where: { productId },
  });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

export const getUserReviewByProductId = async ({
  productId,
}: {
  productId: string;
}) => {
  const session = await auth();

  if (!session) throw new Error("User is not authenticated");

  return await db.review.findFirst({
    where: {
      productId,
      userId: session.user.id,
    },
  });
};
