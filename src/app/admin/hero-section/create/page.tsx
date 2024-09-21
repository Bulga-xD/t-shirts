import HeroSectionDataForm from "@/components/shared/admin/hero-section";

const CreateHeroData = () => {
  return (
    <>
      <h1 className="h2-bold">Добавете информация</h1>

      <div className="my-8">
        <HeroSectionDataForm type="Create" />
      </div>
    </>
  );
};
export default CreateHeroData;
