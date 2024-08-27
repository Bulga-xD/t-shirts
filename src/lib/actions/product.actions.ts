"use server";

import { db } from "@/database/client";

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
