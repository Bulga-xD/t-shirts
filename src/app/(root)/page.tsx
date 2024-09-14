import HeroSection from "@/components/shared/hero-section";
import EcommerceFeatures from "@/components/shared/product/ecommerce-features";
import ProductList from "@/components/shared/product/product-list";
import ProductPromotion from "@/components/shared/product/product-promotion";
import UserReviews from "@/components/shared/users-reviews";
import { getLatestProducts } from "@/lib/actions/product.actions";
import { getAllUserReviews } from "@/lib/actions/user-reviews.actions";

export default async function Home() {
  const latestProducts = await getLatestProducts();
  const userReviews = await getAllUserReviews({ limit: 10, page: 1 });
  return (
    <div>
      <HeroSection />
      <div className="space-y-8 max-w-7xl m-auto p-5 md:px-10">
        <EcommerceFeatures />
      </div>
      <div className="space-y-8 max-w-7xl m-auto p-5 md:px-10">
        <ProductList title="Нови попълнения" data={latestProducts} />
        <ProductPromotion />
        <UserReviews reviews={userReviews.data} />
      </div>
    </div>
  );
}
