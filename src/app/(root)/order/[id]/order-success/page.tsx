import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/actions/order.actions";
import { APP_NAME } from "@/lib/constants";
import ClearLocalStorageOnMount from "@/components/shared/clear-localstorage-on-mount";

export const metadata: Metadata = {
  title: `Order Success - ${APP_NAME}`,
};

export default async function SuccessPage({
  searchParams,
  params: { id },
}: {
  params: {
    id: string;
  };
  searchParams: { payment_intent: string };
}) {
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="max-w-4xl w-full mx-auto space-y-8 py-5">
      <div className="flex flex-col gap-6 items-center ">
        <h1 className="h1-bold">Благодаря за покупката!</h1>
        <div>В момента обработваме вашата поръчка.</div>
        <Button asChild>
          <Link href={`/order/${id}`}>Преглед на порчъката</Link>
        </Button>
        <ClearLocalStorageOnMount />
      </div>
    </div>
  );
}
