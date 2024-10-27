import { notFound } from "next/navigation";

import ProductImages from "@/components/shared/product/product-images";
import ProductPrice from "@/components/shared/product/product-price";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProductBySlug } from "@/lib/actions/product.actions";
import { APP_NAME } from "@/lib/constants";
import AddToCart from "@/components/shared/product/add-to-cart";
import { round2 } from "@/lib/utils";
import ReviewList from "./review-list";
import { auth } from "@/auth";
import Rating from "@/components/shared/product/rating";
import SizeSelector from "@/components/shared/product/select-size";
import ColorSelector from "@/components/shared/product/select-color";
import { getSizes } from "@/lib/actions/size.actions";
import { getColors } from "@/lib/actions/color.actions";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return { title: "Product not found" };
  }
  return {
    title: `${product.name} - ${APP_NAME}`,
    description: product.description,
  };
}

const ProductDetails = async ({
  params: { slug },
  searchParams: { page, color, size },
}: {
  params: { slug: string };
  searchParams: { page: string; color: string; size: string };
}) => {
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const session = await auth();
  const sizes = await getSizes();
  const colors = await getColors();

  const selectedVariant = product.productVariants.find(
    (variant) => variant.sizeId === size && variant.colorId === color
  );

  const availableSizes = Array.from(
    new Set(product.productVariants.map((variant) => variant.sizeId))
  );
  const availableColors = Array.from(
    new Set(product.productVariants.map((variant) => variant.colorId))
  );

  const stringValue = product.price.toString();
  const [intValue, floatValue] = stringValue.includes(".")
    ? stringValue.split(".")
    : [stringValue, ""];

  const getStockMessage = (stock: number) => {
    if (stock >= 2) return "Последни бройки";
    if (stock === 1) return "Последна бройка";
    return "";
  };

  const isVariantAvailable = (sizeId: string, colorId: string) => {
    const variant = product.productVariants.find(
      (v) => v.sizeId === sizeId && v.colorId === colorId
    );
    return variant && variant.stock > 0;
  };

  // Determine which sizes and colors to disable based on selection
  const disabledSizes = size
    ? availableSizes.filter((s) => !isVariantAvailable(s, color))
    : [];
  const disabledColors = color
    ? availableColors.filter((c) => !isVariantAvailable(size, c))
    : [];

  return (
    <>
      <section className="max-w-7xl m-auto p-5 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <ProductImages images={product.images} />
          </div>

          <div className="col-span-2 flex flex-col w-full gap-8 p-5">
            <div className="flex flex-col gap-6">
              <p className="p-medium-16 rounded-full bg-grey-500/10 text-grey-500">
                {product.brand} {product.category}
              </p>
              <h1 className="h3-bold">{product.name}</h1>
              <Rating
                value={Number(product.rating)}
                caption={`${product.numReviews} reviews`}
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3">
                  <div className="flex items-center gap-1">
                    {product.discount && Number(product.discount) > 0 ? (
                      <div className="text-2xl flex gap-2 p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700">
                        <p className="line-through text-lg self-center text-gray-500">
                          {intValue}
                          <span className="text-xs align-super">
                            {floatValue}
                          </span>
                        </p>
                        <ProductPrice
                          value={Number(product.discount)}
                          className="font-semibold"
                          withText
                        />
                      </div>
                    ) : (
                      <p
                        className={
                          "text-2xl flex p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700"
                        }
                      >
                        {intValue}
                        <span className="text-xs align-super">
                          {floatValue}
                        </span>
                        <span className="text-sm mt-2 ml-1">лв.</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <section>
              <h3 className="text-xl mb-2">Размери</h3>
              <SizeSelector
                currentSize={size}
                productSizes={availableSizes}
                sizes={sizes}
                disabledSizes={disabledSizes}
              />
            </section>

            <section>
              <h3 className="text-xl mb-2">Цветове</h3>
              <ColorSelector
                currentColor={color}
                colors={colors}
                productColors={availableColors}
                disabledColors={disabledColors}
              />
            </section>

            <div>
              <p className="font-semibold mb-2">Описание:</p>
              <p>{product.description}</p>
            </div>
          </div>
          <div>
            <Card>
              <CardContent className="p-4">
                {product.discount && Number(product.discount) > 0 ? (
                  <div className="flex gap-2 items-center mb-4">
                    <p className="text-sm">Цена</p>
                    <div className="text-sm text-gray-500 line-through">
                      <ProductPrice
                        value={Number(product.price)}
                        withText={false}
                      />
                    </div>
                    <div className="text-lg font-semibold">
                      <ProductPrice value={Number(product.discount)} withText />
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm">Цена</p>
                    <ProductPrice
                      className="text-lg font-semibold"
                      value={Number(product.price)}
                      withText
                    />
                  </div>
                )}

                <div className="mb-3 text-xl flex gap-1 md:flex-col md:items-center lg:flex justify-between">
                  {selectedVariant ? (
                    selectedVariant.stock > 0 ? (
                      <Badge className="p-2 text-lg" variant="outline">
                        {getStockMessage(selectedVariant.stock)}
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Няма налични</Badge>
                    )
                  ) : (
                    <Badge variant="secondary">Изберете размер и цвят</Badge>
                  )}
                </div>
                {selectedVariant && selectedVariant.stock > 0 && (
                  <div className="flex-center">
                    <AddToCart
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: round2(Number(product.price)),
                        qty: 1,
                        image: product.images[0],
                        variants: product.productVariants,
                      }}
                      selectedVariant={selectedVariant}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto mt-10 p-5 md:px-10">
        <h2 className="h2-bold mb-5">Потребителски отзиви</h2>
        <ReviewList
          productId={product.id}
          productSlug={product.slug}
          userId={session?.user.id!}
        />
      </section>
    </>
  );
};

export default ProductDetails;
