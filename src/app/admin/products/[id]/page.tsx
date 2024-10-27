import { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductForm from "@/components/shared/admin/product-form";
import { getProductById } from "@/lib/actions/product.actions";
import { APP_NAME } from "@/lib/constants";
import { getColors } from "@/lib/actions/color.actions";
import { getSizes } from "@/lib/actions/size.actions";
import { Product } from "@/types";

export const metadata: Metadata = {
  title: `Update product - ${APP_NAME}`,
};

export default async function UpdateProductPage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const product = await getProductById(id);
  const colors = await getColors();
  const sizes = await getSizes();

  if (!product) notFound();

  const formattedProduct: Product = {
    id: product.id!,
    name: product.name!,
    slug: product.slug!,
    category: product.category!,
    images: product.images!,
    brand: product.brand!,
    description: product.description!,
    price: Number(product.price),
    rating: Number(product.rating),
    numReviews: product.numReviews!,
    isFeatured: product.isFeatured!,
    banner: product.banner!,
    createdAt: product.createdAt!,
    discount: product.discount ? Number(product.discount) : null,
    productVariants: product.productVariants || [],
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">Обнови Продукт</h1>
      {formattedProduct && (
        <ProductForm
          type="Update"
          product={formattedProduct}
          productId={product.id}
          colors={colors}
          sizes={sizes}
        />
      )}
    </div>
  );
}
