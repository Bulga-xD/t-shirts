import HeroSection from "@/components/shared/hero-section";
import ProductCarousel from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/product-list";
import {
  getFeaturedProducts,
  getLatestProducts,
} from "@/lib/actions/product.actions";

export default async function Home() {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();
  return (
    <div>
      {/* {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )} */}
      <HeroSection />
      <div className="space-y-8 max-w-7xl m-auto p-5 md:px-10">
        <ProductList title="Нови попълнения" data={latestProducts} />
      </div>
    </div>
  );
}
