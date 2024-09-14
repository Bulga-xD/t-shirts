"use server";

import { db } from "@/database/client";
import { revalidatePath } from "next/cache";
import { formatError } from "../utils";
import { z } from "zod";
import { insertUserReviewSchema } from "../validators";
import { auth } from "@/auth";

export const getAllUserReviews = async ({
  limit = 9,
  page,
}: {
  limit?: number;
  page: number;
}) => {
  const data = await db.userReview.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: (page - 1) * limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const dataCount = await db.userReview.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
};

export const getSingleReview = async (id: string) => {
  return await db.userReview.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const deleteReview = async (id: string) => {
  try {
    const productExists = await db.userReview.findUnique({
      where: {
        id,
      },
    });
    if (!productExists) throw new Error("Product not found");
    await db.userReview.delete({ where: { id } });
    revalidatePath("/admin/user-reviews");
    return {
      success: true,
      message: "Усешно изтрито ревю",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const createUserReview = async (
  data: z.infer<typeof insertUserReviewSchema>,
  userId?: string
) => {
  try {
    const reviewData = insertUserReviewSchema.parse(data);

    await db.userReview.create({
      data: {
        ...reviewData,
        userId,
      },
    });

    revalidatePath("/admin/user-reviews");
    return {
      success: true,
      message: "Успешно добавено ревю",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};
