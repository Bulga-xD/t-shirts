import CreateColorForm from "@/components/shared/admin/color-form";
import ProductForm from "@/components/shared/admin/product-form";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Create color - ${APP_NAME}`,
};

export default async function CreateColorPage() {
  return (
    <>
      <h1 className="h2-bold">Добавете цвят</h1>

      <div className="my-8">
        <CreateColorForm type="Create" />
      </div>
    </>
  );
}
