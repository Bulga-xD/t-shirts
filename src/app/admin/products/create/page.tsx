import ProductForm from "@/components/shared/admin/product-form";
import { db } from "@/database/client";
import { getColors } from "@/lib/actions/color.actions";
import { getSizes } from "@/lib/actions/size.actions";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Create product - ${APP_NAME}`,
};

export default async function UpdateProductPage() {
  const colors = await getColors();
  const sizes = await getSizes();

  return (
    <>
      <h1 className="h2-bold">Create Product</h1>

      <div className="my-8">
        <ProductForm type="Create" colors={colors} sizes={sizes} />
      </div>
    </>
  );
}
