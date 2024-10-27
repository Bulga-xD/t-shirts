"use server";

import { db } from "@/database/client";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { formatError } from "../utils";
import { z } from "zod";
import { colorSchema } from "../validators";

export const getColors = async () => {
  return await db.color.findMany();
};

export const getColorById = async (id: string) => {
  return await db.color.findUnique({
    where: {
      id,
    },
  });
};

export async function getAllColors({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const colors = await db.color.findMany({
    take: limit,
    skip: (page - 1) * limit,
  });
  const dataCount = await db.size.count();
  return {
    colors,
    totalPages: Math.ceil(dataCount / limit),
  };
}

export async function deleteColor(id: string) {
  try {
    await db.color.delete({
      where: {
        id,
      },
    });
    revalidatePath("/admin/users");
    return {
      success: true,
      message: "Успешно изтрит потребител",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export const createColor = async (data: z.infer<typeof colorSchema>) => {
  try {
    const color = colorSchema.parse(data);

    await db.color.create({
      data: color,
    });

    revalidatePath("/admin/user-reviews");
    return {
      success: true,
      message: "Успешно добавен цвят",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const updateColor = async (data: z.infer<typeof colorSchema>) => {
  try {
    const color = colorSchema.parse(data);

    await db.color.update({
      where: {
        id: color.id,
      },
      data: {
        label: color.label,
      },
    });
    revalidatePath("/admin/user-reviews");
    return {
      success: true,
      message: "Успешно редактиран цвят",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};
