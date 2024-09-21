import MonthlyDealForm from "@/components/shared/admin/deal-form";
import { getSingeFeaturedProduct } from "@/lib/actions/monthly-deals.actions";
import { notFound } from "next/navigation";

const SingleDealPage = async ({ params }: { params: { id: string } }) => {
  const data = await getSingeFeaturedProduct(params.id);

  if (!data) notFound();

  return (
    <>
      <h1 className="h2-bold">Добавете оферта</h1>

      <div className="my-8">
        <MonthlyDealForm type="Update" deal={data} />
      </div>
    </>
  );
};
export default SingleDealPage;
