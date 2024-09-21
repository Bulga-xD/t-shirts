import CreateSizeForm from "@/components/shared/admin/size-form";
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
        <CreateSizeForm type="Create" />
      </div>
    </>
  );
}
