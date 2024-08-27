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
