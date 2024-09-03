"use server";

import { db } from "@/database/client";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { formatError } from "../utils";
import { z } from "zod";
import { insertProductSchema, updateProductSchema } from "../validators";

export const getLatestProducts = async () => {
  return db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });
};

export const getProductBySlug = async (slug: string) => {
  return db.product.findUnique({
    where: {
      slug,
    },
  });
};

export async function getAllCategories(): Promise<{ category: string }[]> {
  return await db.product.findMany({
    select: {
      category: true,
    },
    distinct: ["category"],
  });
}

export async function getFeaturedProducts() {
  return await db.product.findMany({
    where: {
      isFeatured: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });
}

export const getAllProducts = async ({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query: string;
  category: string;
  limit?: number;
  page: number;
  price?: string;
  rating?: string;
  sort?: string;
}) => {
  // Construct filters for db queries
  const filters: any = {};

  if (query && query !== "all") {
    filters.name = {
      contains: query,
      mode: "insensitive", // Case-insensitive search
    };
  }

  if (category && category !== "all") {
    filters.category = category;
  }

  if (rating && rating !== "all") {
    filters.rating = {
      gte: Number(rating),
    };
  }

  if (price && price !== "all") {
    const [minPrice, maxPrice] = price.split("-").map(Number);
    filters.price = {
      gte: minPrice,
      lte: maxPrice,
    };
  }

  // Determine the sort order
  const orderBy: any = [];
  if (sort === "lowest") {
    orderBy.push({ price: "asc" });
  } else if (sort === "highest") {
    orderBy.push({ price: "desc" });
  } else if (sort === "rating") {
    orderBy.push({ rating: "desc" });
  } else {
    orderBy.push({ createdAt: "desc" });
  }

  // Fetch data from db
  const data = await db.product.findMany({
    where: filters,
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
  });

  // Count total number of products that match the filters
  const totalProductsCount = await db.product.count({
    where: filters,
  });

  return {
    data,
    totalPages: Math.ceil(totalProductsCount / limit),
  };
};

export const deleteProduct = async (id: string) => {
  try {
    const productExists = await db.product.findUnique({
      where: {
        id,
      },
    });
    if (!productExists) throw new Error("Product not found");
    await db.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const createProduct = async (
  data: z.infer<typeof insertProductSchema>
) => {
  try {
    const product = insertProductSchema.parse(data);
    await db.product.create({
      data: {
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
      },
    });
    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Успешно добавен продукт",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const updateProduct = async (
  data: z.infer<typeof updateProductSchema>
) => {
  try {
    const product = updateProductSchema.parse(data);

    const productExists = await db.product.findUnique({
      where: {
        id: product.id,
      },
    });
    if (!productExists) throw new Error("Product not found");
    await db.product.update({
      where: {
        id: product.id,
      },
      data: {
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
      },
    });
    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Успешно актуализиран продукт",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const getProductById = async (id: string) => {
  return db.product.findUnique({
    where: {
      id,
    },
  });
};
