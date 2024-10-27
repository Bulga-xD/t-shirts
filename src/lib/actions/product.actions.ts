"use server";

import { db } from "@/database/client";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { formatError } from "../utils";
import { z } from "zod";
import { insertProductSchema, updateProductSchema } from "../validators";

export const getLatestProducts = async () => {
  const products = await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
    include: {
      productVariants: true,
    },
  });

  const formattedProducts = products.map((product) => {
    return {
      ...product,
      price: Number(product.price),
      rating: Number(product.rating),
    };
  });

  return formattedProducts;
};

export const getProductBySlug = async (slug: string) => {
  return await db.product.findUnique({
    where: {
      slug,
    },
    include: {
      productVariants: true,
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
    include: {
      productVariants: true,
    },
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
      message: "Успешно изтрит продукт",
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

    const createdProduct = await db.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        category: product.category,
        images: product.images,
        brand: product.brand,
        description: product.description,
        price: product.price,
        isFeatured: product.isFeatured,
        banner: product.banner,
        discount: product.discount,
        productVariants: {
          create: product.productVariants.map((variant) => ({
            sizeId: variant.sizeId,
            colorId: variant.colorId,
            stock: variant.stock,
          })),
        },
      },
    });

    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Успешно добавен продукт",
      product: createdProduct,
    };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Възникна грешка при създаването на продукта",
    };
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
        productVariants: {
          upsert: product.productVariants.map((variant) => {
            const uniqueId = variant.id ? { id: variant.id } : undefined;

            return {
              where: uniqueId || {
                // Adjust this part to match your composite unique identifier if applicable
                productId_sizeId_colorId: {
                  productId: product.id, // Make sure this is the correct reference
                  sizeId: variant.sizeId,
                  colorId: variant.colorId,
                },
              },
              create: {
                sizeId: variant.sizeId,
                colorId: variant.colorId,
                stock: variant.stock,
              },
              update: {
                stock: variant.stock,
              },
            };
          }),
        },
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
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      productVariants: true,
    },
  });

  return {
    ...product,
    price: Number(product?.price || 0),
    rating: Number(product?.rating || 0),
  };
};

export const getLatestFeaturedProduct = async () => {
  return db.product.findFirst({
    where: {
      isFeatured: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      banner: true,
    },
  });
};
