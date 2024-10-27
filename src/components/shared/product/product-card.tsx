import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Product } from "@/types";
import ProductPrice from "./product-price";
import Rating from "./rating";
import { Button } from "@/components/ui/button";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0 items-center">
        <Link href={`/product/${product.slug}`} className="relative group">
          <div className="relative w-full h-[300px] overflow-hidden rounded">
            <Image
              alt={product.name}
              className="object-cover rounded transition-opacity duration-500 ease-in-out group-hover:opacity-0"
              src={product.images![0]}
              width={300}
              height={300}
            />
            {product.images![1] && (
              <Image
                alt={product.name}
                className="absolute top-0 left-0 aspect-square object-cover rounded opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
                src={product.images![1]}
                width={300}
                height={300}
              />
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <div>
          <p className="text-xs">{product.brand}</p>
        </div>
        <div>
          <Link href={`/product/${product.slug}`}>
            <h2 className="text-sm font-medium">{product.name}</h2>
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Rating value={Number(product.rating)} />
          {product.productVariants[0].stock > 0 ? (
            product.discount && product.discount > 0 ? (
              <div className="flex gap-2 items-center">
                <ProductPrice
                  className="line-through text-sm text-gray-500"
                  value={Number(product.price)}
                />
                <ProductPrice
                  className="text-lg font-semibold"
                  value={Number(product.discount)}
                />
              </div>
            ) : (
              <ProductPrice value={Number(product.price)} />
            )
          ) : (
            <p className="text-destructive">Няма в наличност</p>
          )}
        </div>
        <div className="w-full">
          <Link href={`/quickview/product/${product.slug}`}>
            <Button variant="outline" size="sm" className="w-full">
              <span>Бърз преглед</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
