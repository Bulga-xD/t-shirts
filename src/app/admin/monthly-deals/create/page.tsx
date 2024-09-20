import MonthlyDealForm from "@/components/shared/admin/deal-form";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Create deal - ${APP_NAME}`,
};

export default async function AdminDealCreate() {
  return (
    <>
      <h1 className="h2-bold">Добавете оферта</h1>

      <div className="my-8">
        <MonthlyDealForm type="Create" />
      </div>
    </>
  );
}
