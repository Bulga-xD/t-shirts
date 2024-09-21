"use server";

import { db } from "@/database/client";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { formatError } from "../utils";
import { sizeSchema } from "../validators";
import { z } from "zod";

export const getSizes = async () => {
  return await db.size.findMany();
};

export async function getAllSizes({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const sizes = await db.size.findMany({
    take: limit,
    skip: (page - 1) * limit,
  });
  const dataCount = await db.size.count();
  return {
    sizes,
    totalPages: Math.ceil(dataCount / limit),
  };
}

export async function deleteSize(id: string) {
  try {
    await db.size.delete({
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

export const createSize = async (data: z.infer<typeof sizeSchema>) => {
  try {
    const color = sizeSchema.parse(data);

    await db.size.create({
      data: color,
    });

    revalidatePath("/admin/size");
    return {
      success: true,
      message: "Успешно добавен размер",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const updateSize = async (data: z.infer<typeof sizeSchema>) => {
  try {
    const size = sizeSchema.parse(data);

    await db.size.update({
      where: {
        id: size.id,
      },
      data: {
        label: size.label,
      },
    });
    revalidatePath("/admin/sizes");
    return {
      success: true,
      message: "Успешно редактиран цвят",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const getSizeById = async (id: string) => {
  return await db.size.findUnique({ where: { id } });
};
