import CreateSizeForm from "@/components/shared/admin/size-form";
import { getSizeById } from "@/lib/actions/size.actions";
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
  const size = await getSizeById(id);
  return (
    <>
      <h1 className="h2-bold">
        Редактирайте <span className="italic">{size?.label}</span> цвят
      </h1>

      <div className="my-8">
        <CreateSizeForm type="Update" size={size} />
      </div>
    </>
  );
}
