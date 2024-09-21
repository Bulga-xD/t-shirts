import HeroSectionDataForm from "@/components/shared/admin/hero-section";
import { getSingleHeroData } from "@/lib/actions/hero-section.actions";

const SingleHeroData = async ({ params }: { params: { id: string } }) => {
  const data = await getSingleHeroData(params.id);
  return (
    <>
      <h1 className="h2-bold">Обновете информация</h1>

      <div className="my-8">
        <HeroSectionDataForm type="Update" section={data} />
      </div>
    </>
  );
};
export default SingleHeroData;
