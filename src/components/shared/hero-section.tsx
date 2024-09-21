import { HeroImageDisplay } from "./image-display";
import { getHeroData } from "@/lib/actions/hero-section.actions";

const HeroSection = async () => {
  const { data } = await getHeroData();
  const section = data && data.length > 0 ? data[0] : null;
  const heroSection = section;
  const images = section?.images || [];

  if (!heroSection) {
    return null;
  }

  return (
    <section className="relative h-[700px] md:h-[860px] mb-10 md:mb-0 flex justify-center items-center flex-col gap-10 overflow-hidden w-full">
      <HeroImageDisplay images={images} />
      <div className="relative z-10 text-center text-white p-4 bg-opacity-50 flex flex-col justify-center max-w-7xl md:backdrop-blur-3xl bg-white/10 md:rounded-lg">
        <h1 className="text-3xl md:text-7xl font-bold uppercase text-outline">
          {heroSection.text}
        </h1>
      </div>
    </section>
  );
};

export default HeroSection;
