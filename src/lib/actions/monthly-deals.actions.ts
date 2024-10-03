"use server";

import { db } from "@/database/client";
import { revalidatePath } from "next/cache";
import { formatError } from "../utils";
import { z } from "zod";
import {
  insertMonthlyDealSchema,
  updateMonthlyDealSchema,
} from "../validators";

export const getAllDeals = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const deals = await db.monthlyDeal.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: (page - 1) * limit,
  });

  const totalDeals = await db.monthlyDeal.count();

  return {
    deals,
    totalPages: Math.ceil(totalDeals / limit),
  };
};

export const deleteDeal = async (id: string) => {
  try {
    const dealExists = await db.monthlyDeal.findUnique({
      where: {
        id,
      },
    });
    if (!dealExists) throw new Error("Product not found");
    await db.monthlyDeal.delete({ where: { id } });
    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Успешно изтрит продукт",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const getDealById = async (id: string) => {
  return await db.monthlyDeal.findUnique({
    where: {
      id,
    },
  });
};

export const createDeal = async (
  data: z.infer<typeof insertMonthlyDealSchema>
) => {
  try {
    const deal = insertMonthlyDealSchema.parse(data);
    await db.monthlyDeal.create({
      data: {
        text: deal.text,
        image: deal.image,
        endDate: deal.endDate,
      },
    });
    revalidatePath("/admin/monthly-deals");
    return {
      success: true,
      message: "Успешно добавена оферта",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const updateDeal = async (
  data: z.infer<typeof updateMonthlyDealSchema>
) => {
  try {
    console.log(data);

    const deal = updateMonthlyDealSchema.parse(data);

    const dealExists = await db.monthlyDeal.findUnique({
      where: {
        id: deal.id,
      },
    });

    if (!dealExists) throw new Error("Офертата не е намерена");

    await db.monthlyDeal.update({
      where: {
        id: deal.id,
      },
      data: {
        text: deal.text,
        image: deal.image,
        endDate: deal.endDate,
      },
    });
    revalidatePath("/admin/monthly-deals");
    return { success: true, message: "Успешно актуализирана оферта" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const getLatestFeaturedProduct = async () => {
  return await db.monthlyDeal.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getSingeFeaturedProduct = async (id: string) => {
  return await db.monthlyDeal.findUnique({
    where: {
      id,
    },
  });
};
