import CreateColorForm from "@/components/shared/admin/color-form";
import ProductForm from "@/components/shared/admin/product-form";
import { getColorById } from "@/lib/actions/color.actions";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Update color - ${APP_NAME}`,
};

export default async function UpdateColorPage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const color = await getColorById(id);
  return (
    <>
      <h1 className="h2-bold">
        Редактирайте <span className="italic">{color?.label}</span> цвят
      </h1>

      <div className="my-8">
        <CreateColorForm type="Update" color={color} />
      </div>
    </>
  );
}
